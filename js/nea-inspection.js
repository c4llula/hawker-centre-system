
/* ========= FIREBASE INIT (INLINE) ========= */
const firebaseConfig = {
  apiKey: "AIzaSyBsn3nzbTWFP0f2k7XTmFsRxdAjd0vhDKA",
  authDomain: "fed-assignment-33cc7.firebaseapp.com",
  databaseURL: "https://fed-assignment-33cc7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fed-assignment-33cc7",
  storageBucket: "fed-assignment-33cc7.firebasestorage.app",
  messagingSenderId: "6435796920",
  appId: "1:6435796920:web:5f521b0e023e8882a7014d",
};

if (typeof firebase === "undefined") {
  alert("Firebase scripts not loaded. Check your HTML script order.");
  throw new Error("firebase is undefined");
}

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
window.db = db;
console.log("✅ Firebase + Firestore ready");

/* ========= DOM ========= */
const scheduleForm = document.getElementById("scheduleForm");
const vendorSelect = document.getElementById("vendorSelect");
const officerInput = document.getElementById("officer");
const notesInput = document.getElementById("notes");

const upcomingList = document.getElementById("upcomingList");

const logForm = document.getElementById("logForm");
const logInspectionSelect = document.getElementById("logInspection");
const scoreInput = document.getElementById("score");
const gradeSelect = document.getElementById("grade");
const remarksInput = document.getElementById("remarks");

const recordsTableBody = document.getElementById("recordsTableBody");

const searchVendor = document.getElementById("searchVendor");
const filterGrade = document.getElementById("filterGrade");
const filterMonth = document.getElementById("filterMonth");

const totalVendorsEl = document.getElementById("totalVendors");
const pendingInspectionsEl = document.getElementById("pendingInspections");
const thisMonthEl = document.getElementById("thisMonth");
const successMessage = document.getElementById("successMessage");

/* ========= GLOBAL STATE ========= */
let vendorsCache = {}; // Store vendors: { docId: { name, ... } }
let allVendorIds = []; // List of all vendor doc IDs
let neaOfficersCache = {}; // Store NEA officers: { neaId: { name, email, ... } }
let officersByName = {}; // Quick lookup: { "name": neaId }
let unsubscribers = []; // Track listeners for cleanup

/* ========= HELPERS ========= */
function showSuccess(msg) {
  if (!successMessage) return;
  successMessage.textContent = msg;
  successMessage.style.display = "block";
  setTimeout(() => (successMessage.style.display = "none"), 2500);
}

function vendorDocIdFromSelect() {
  return vendorSelect?.value?.trim() || "";
}

function tsToYMD(ts) {
  if (!ts) return "";
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString().slice(0, 10);
  return "";
}

function tsToDateTime(ts) {
  if (!ts) return "";
  if (ts.toDate) {
    const d = ts.toDate();
    return d.toLocaleString('en-SG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return "";
}

function tsToMillis(ts) {
  if (!ts) return 0;
  if (ts.toMillis) return ts.toMillis();
  if (ts.toDate) return ts.toDate().getTime();
  return 0;
}

function monthKeyFromTs(ts) {
  if (!ts || !ts.toDate) return "";
  const d = ts.toDate();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

function calcGrade(score) {
  const s = Number(score);
  if (Number.isNaN(s)) return "";
  if (s >= 85) return "A";
  if (s >= 70) return "B";
  if (s >= 55) return "C";
  return "D";
}

function inspectionsRef(vendorDocId) {
  return db.collection("vendors").doc(vendorDocId).collection("inspections");
}

function getVendorName(vendorDocId) {
  return vendorsCache[vendorDocId]?.name || vendorDocId;
}

function getOfficerNeaId(officerName) {
  // Try to find by exact name match (case-insensitive)
  const normalizedName = officerName.trim().toLowerCase();
  
  for (const [neaId, officer] of Object.entries(neaOfficersCache)) {
    if (officer.name && officer.name.toLowerCase() === normalizedName) {
      return neaId;
    }
  }
  
  // If not found, return null
  return null;
}

function getOfficerName(neaId) {
  return neaOfficersCache[neaId]?.name || neaId;
}

/* ========= READ: NEA OFFICERS ========= */
function listenNeaOfficers() {
  const unsub = db.collection("neaOfficers").onSnapshot(
    (snap) => {
      neaOfficersCache = {};
      officersByName = {};
      
      snap.forEach((doc) => {
        const data = doc.data();
        neaOfficersCache[doc.id] = {
          neaId: doc.id,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          ...data
        };
        
        // Build name lookup
        if (data.name) {
          officersByName[data.name.toLowerCase()] = doc.id;
        }
      });
      
      console.log(`✅ Loaded ${snap.size} NEA officers`);
      
      // Update officer input with autocomplete/datalist
      updateOfficerDatalist();
    },
    (err) => {
      console.error("NEA Officers listener error:", err);
    }
  );
  
  unsubscribers.push(unsub);
  return unsub;
}

function updateOfficerDatalist() {
  // Create or update datalist for officer input autocomplete
  let datalist = document.getElementById("officerList");
  if (!datalist && officerInput) {
    datalist = document.createElement("datalist");
    datalist.id = "officerList";
    officerInput.setAttribute("list", "officerList");
    officerInput.parentNode.appendChild(datalist);
  }
  
  if (datalist) {
    datalist.innerHTML = "";
    Object.values(neaOfficersCache).forEach(officer => {
      if (officer.name) {
        const option = document.createElement("option");
        option.value = officer.name;
        datalist.appendChild(option);
      }
    });
  }
}

/* ========= READ: VENDORS (populate dropdown) ========= */
function listenVendors() {
  const unsub = db.collection("vendors").onSnapshot(
    (snap) => {
      vendorsCache = {};
      allVendorIds = [];
      
      if (vendorSelect) {
        vendorSelect.innerHTML = '<option value="">Select vendor...</option>';
      }
      
      snap.forEach((doc) => {
        const data = doc.data();
        vendorsCache[doc.id] = {
          name: data.name || doc.id,
          ...data
        };
        allVendorIds.push(doc.id);
        
        if (vendorSelect) {
          const opt = document.createElement("option");
          opt.value = doc.id;
          opt.textContent = data.name || doc.id;
          vendorSelect.appendChild(opt);
        }
      });
      
      if (totalVendorsEl) totalVendorsEl.textContent = String(snap.size);
      
      // After vendors load, set up inspection listeners
      if (allVendorIds.length > 0) {
        setupInspectionListeners();
      }
    },
    (err) => {
      console.error("Vendor listener error:", err);
      alert("Error loading vendors: " + (err.message || err));
    }
  );
  
  unsubscribers.push(unsub);
  return unsub;
}

/* ========= WRITE: SCHEDULE (PENDING) ========= */
async function scheduleInspection() {
  const vendorDocId = vendorDocIdFromSelect();
  const officerName = (officerInput.value || "").trim();
  const notes = (notesInput.value || "").trim();

  if (!vendorDocId) return alert("Please select a vendor");
  if (!officerName) return alert("Please enter assigned officer");

  // Try to find matching NEA officer
  const neaId = getOfficerNeaId(officerName);
  
  if (!neaId) {
    const confirm = window.confirm(
      `Officer "${officerName}" not found in the NEA Officers database.\n\n` +
      `Do you want to proceed anyway? (The officer name will be saved but won't be linked to an NEA ID)`
    );
    if (!confirm) return;
  }

  const vendorName = getVendorName(vendorDocId);
  const docRef = inspectionsRef(vendorDocId).doc();

  await docRef.set({
    inspectId: docRef.id,
    vendorDocId: vendorDocId,
    vendorName: vendorName,
    neaId: neaId || officerName, // Use neaId if found, otherwise use name as fallback
    officerName: officerName,
    remarks: notes,
    score: null,
    grade: null,
    inspectionStatus: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  showSuccess(neaId 
    ? `✓ Inspection scheduled for ${officerName}!`
    : `✓ Inspection scheduled! (Officer not in database)`
  );
  scheduleForm.reset();
}

/* ========= WRITE: COMPLETE (PENDING -> COMPLETED) ========= */
async function completeInspection() {
  const selected = logInspectionSelect.value;
  if (!selected) return alert("Please select a scheduled inspection");

  const [vendorDocId, inspectionId] = selected.split("|");
  if (!vendorDocId || !inspectionId) return alert("Invalid inspection selection");

  const score = Number(scoreInput.value);
  if (Number.isNaN(score)) return alert("Score must be a number");

  const grade = gradeSelect.value || calcGrade(score);
  const remarks = (remarksInput.value || "").trim();

  if (!grade) return alert("Please choose a grade");
  if (!remarks) return alert("Please enter remarks");

  await inspectionsRef(vendorDocId).doc(inspectionId).update({
    score,
    grade,
    remarks,
    inspectionStatus: "completed",
    completedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  showSuccess("✓ Inspection logged successfully!");
  logForm.reset();
}

/* ========= READ: PENDING - NO INDEX REQUIRED ========= */
function setupInspectionListeners() {
  // Clear old listeners for inspections (keep vendor and officer listeners)
  while (unsubscribers.length > 2) { // Keep first 2: vendors and officers
    const unsub = unsubscribers.pop();
    unsub();
  }
  
  // Listen to each vendor's inspections
  allVendorIds.forEach(vendorDocId => {
    // Pending inspections
    const pendingUnsub = inspectionsRef(vendorDocId)
      .where("inspectionStatus", "==", "pending")
      .onSnapshot(
        (snap) => {
          handlePendingSnapshot(vendorDocId, snap);
        },
        (err) => {
          console.error(`Pending listener error for ${vendorDocId}:`, err);
        }
      );
    unsubscribers.push(pendingUnsub);
    
    // Completed inspections
    const completedUnsub = inspectionsRef(vendorDocId)
      .where("inspectionStatus", "==", "completed")
      .onSnapshot(
        (snap) => {
          handleCompletedSnapshot(vendorDocId, snap);
        },
        (err) => {
          console.error(`Completed listener error for ${vendorDocId}:`, err);
        }
      );
    unsubscribers.push(completedUnsub);
  });
}

/* ========= PENDING DATA AGGREGATION ========= */
let pendingByVendor = {}; // { vendorId: [inspections] }

function handlePendingSnapshot(vendorDocId, snap) {
  const pending = [];
  snap.forEach((doc) => {
    const d = doc.data();
    pending.push({
      vendorDocId,
      vendorName: d.vendorName || getVendorName(vendorDocId),
      inspectionId: d.inspectId || doc.id,
      createdAt: d.createdAt || null,
      neaId: d.neaId || "",
      officerName: d.officerName || getOfficerName(d.neaId) || "Unknown Officer",
      remarks: d.remarks || "",
    });
  });
  
  pendingByVendor[vendorDocId] = pending;
  renderPending();
}

function renderPending() {
  // Flatten all pending inspections
  const allPending = [];
  Object.values(pendingByVendor).forEach(arr => {
    allPending.push(...arr);
  });
  
  // Sort by creation date (newest first for pending)
  allPending.sort((a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt));
  
  // Update count
  if (pendingInspectionsEl) pendingInspectionsEl.textContent = String(allPending.length);
  
  // Render list
  if (upcomingList) {
    upcomingList.innerHTML = "";
    if (allPending.length === 0) {
      const item = document.createElement("div");
      item.className = "inspection-item";
      item.innerHTML = `<div style="text-align:center;opacity:0.6;">No upcoming inspections</div>`;
      upcomingList.appendChild(item);
    } else {
      allPending.forEach((p) => {
        const dateText = tsToDateTime(p.createdAt);
        const item = document.createElement("div");
        item.className = "inspection-item";
        
        // Show officer info from cache if available
        const officerInfo = neaOfficersCache[p.neaId];
        const officerDisplay = officerInfo 
          ? `${officerInfo.name} (ID: ${p.neaId})`
          : p.officerName;
        
        item.innerHTML = `
          <div style="display:flex;justify-content:space-between;gap:12px;">
            <div>
              <div style="font-weight:700;">${p.vendorName}</div>
              <div style="font-size:13px;opacity:.85;">Scheduled: ${dateText}</div>
              <div style="font-size:12px;opacity:.7;">Officer: ${officerDisplay}</div>
              ${p.remarks ? `<div style="font-size:12px;opacity:.7;margin-top:4px;">${p.remarks}</div>` : ''}
            </div>
            <div style="font-weight:700;opacity:.85;color:#f59e0b;">Pending</div>
          </div>
        `;
        upcomingList.appendChild(item);
      });
    }
  }
  
  // Render dropdown
  if (logInspectionSelect) {
    logInspectionSelect.innerHTML = `<option value="">Choose from upcoming inspections...</option>`;
    allPending.forEach((p) => {
      const dateText = tsToDateTime(p.createdAt);
      const opt = document.createElement("option");
      opt.value = `${p.vendorDocId}|${p.inspectionId}`;
      opt.textContent = `${p.vendorName} — ${dateText}`;
      logInspectionSelect.appendChild(opt);
    });
  }
}

/* ========= COMPLETED DATA AGGREGATION ========= */
let completedByVendor = {}; // { vendorId: [inspections] }

function handleCompletedSnapshot(vendorDocId, snap) {
  const completed = [];
  snap.forEach((doc) => {
    const d = doc.data();
    completed.push({
      vendorDocId,
      vendorName: d.vendorName || getVendorName(vendorDocId),
      inspectionId: d.inspectId || doc.id,
      completedAt: d.completedAt || null,
      neaId: d.neaId || "",
      officerName: d.officerName || getOfficerName(d.neaId) || "Unknown Officer",
      score: d.score,
      grade: d.grade,
      remarks: d.remarks,
    });
  });
  
  completedByVendor[vendorDocId] = completed;
  renderCompleted();
}

function renderCompleted() {
  // Flatten all completed inspections
  const allCompleted = [];
  Object.values(completedByVendor).forEach(arr => {
    allCompleted.push(...arr);
  });
  
  // Calculate this month count (based on completedAt)
  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const completedThisMonth = allCompleted.filter(r => monthKeyFromTs(r.completedAt) === curMonth).length;
  
  if (thisMonthEl) thisMonthEl.textContent = String(completedThisMonth);
  
  // Apply filters and render table
  renderCompletedWithFilters(allCompleted);
}

function renderCompletedWithFilters(allCompleted = null) {
  if (!recordsTableBody) return;
  
  // If not provided, recalculate from cache
  if (!allCompleted) {
    allCompleted = [];
    Object.values(completedByVendor).forEach(arr => {
      allCompleted.push(...arr);
    });
  }
  
  const qVendor = (searchVendor?.value || "").toLowerCase().trim();
  const qGrade = filterGrade?.value || "";
  const qMonth = filterMonth?.value || "";

  const filtered = allCompleted.filter((r) => {
    const vn = (r.vendorName || "").toLowerCase();
    const gr = r.grade || "";
    const mk = monthKeyFromTs(r.completedAt);

    if (qVendor && !vn.includes(qVendor)) return false;
    if (qGrade && gr !== qGrade) return false;
    if (qMonth && mk !== qMonth) return false;
    return true;
  });

  recordsTableBody.innerHTML = "";

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" style="text-align:center;padding:20px;opacity:0.6;">No records found</td>`;
    recordsTableBody.appendChild(tr);
    return;
  }

  filtered
    .sort((a, b) => tsToMillis(b.completedAt) - tsToMillis(a.completedAt))
    .forEach((r) => {
      // Show officer info from cache if available
      const officerInfo = neaOfficersCache[r.neaId];
      const officerDisplay = officerInfo 
        ? officerInfo.name
        : r.officerName;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tsToYMD(r.completedAt)}</td>
        <td>${r.vendorName}</td>
        <td>${officerDisplay}</td>
        <td>${r.score ?? ""}</td>
        <td><span class="grade-badge grade-${r.grade}">${r.grade ?? ""}</span></td>
        <td>${r.remarks ?? ""}</td>
        <td>
          <button class="btn-small" onclick="viewDetails('${r.vendorDocId}', '${r.inspectionId}')">View</button>
        </td>
      `;
      recordsTableBody.appendChild(tr);
    });
}

/* ========= HELPER: View Details ========= */
window.viewDetails = function(vendorDocId, inspectionId) {
  alert(`View details for ${vendorDocId} - ${inspectionId}\n\nThis feature can be implemented to show a modal with full inspection details.`);
};

/* ========= EVENTS ========= */
if (scheduleForm) {
  scheduleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    scheduleInspection().catch((err) => {
      console.error(err);
      alert(err.message || "Failed to schedule inspection");
    });
  });
}

if (logForm) {
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();
    completeInspection().catch((err) => {
      console.error(err);
      alert(err.message || "Failed to log inspection");
    });
  });
}

// Auto-calculate grade when score changes
if (scoreInput) {
  scoreInput.addEventListener("input", (e) => {
    const score = Number(e.target.value);
    if (!Number.isNaN(score) && gradeSelect) {
      const autoGrade = calcGrade(score);
      gradeSelect.value = autoGrade;
    }
  });
}

if (searchVendor) searchVendor.addEventListener("input", () => renderCompletedWithFilters());
if (filterGrade) filterGrade.addEventListener("change", () => renderCompletedWithFilters());
if (filterMonth) filterMonth.addEventListener("change", () => renderCompletedWithFilters());

/* ========= CLEANUP ========= */
window.addEventListener("beforeunload", () => {
  unsubscribers.forEach(unsub => unsub());
});

/* ========= BOOT ========= */
document.addEventListener("DOMContentLoaded", () => {
  listenNeaOfficers(); // Load NEA officers first
  listenVendors(); // This will trigger setupInspectionListeners() once vendors load
  console.log("✅ NEA inspection dashboard listeners running");
});