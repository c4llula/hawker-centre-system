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

const chartData = {
  byDay: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    data: [120, 150, 145, 127, 151],
    title: "Sales by Day (Last Week)"
  },
  byHour: {
    labels: ["07 - 10", "10 - 13", "13 - 16", "16 - 19", "19 - 22"],
    data: [20, 39, 44, 41, 15],
    title: "Sales by Hour (Today)"
  }
};

const ctx = document.getElementById("salesChart");

const salesChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: chartData.byHour.labels,
    datasets: [{
      data: chartData.byHour.data,
      backgroundColor: "#59a96a",
      borderRadius: 6,
      barThickness: 40
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false }
    }
  }
});

const viewSelect = document.getElementById("view");

viewSelect.addEventListener("change", () => {
  const selectedView = viewSelect.value;
  const selectedData = chartData[selectedView];

  // Update chart data
  salesChart.data.labels = selectedData.labels;
  salesChart.data.datasets[0].data = selectedData.data;

  // Update title
  document.getElementById("salesChartTitle").textContent = selectedData.title;

  salesChart.update();
});

const data = [
  { img: "/imgs/Rojak.jpg", text: "Rojak" },
  { img: "/imgs/Cockle Laksa.jpg", text: "Laksa" },
  { img: "/imgs/Popiah.jpeg", text: "Popiah" },
  { img: "/imgs/Chicken Satay Sticks.jpg", text: "Chicken Satay" },
  { img: "/imgs/Tau Pok.jpg", text: "Tau Pok" }
];

const container = document.getElementById("popularItems");

data.forEach(item => {
  const card = document.createElement("div");
  card.className = "popItem";

  card.innerHTML = `
    <img src="${item.img}" alt="">
    <p>${item.text}</p>
  `;

  container.appendChild(card);
});

function getVendorId() {
  // Option A: from URL like vendor-dashboard.html?vendorId=1980%20Penang%20Prawn%20Noodle
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("vendorId");
  if (fromUrl) return fromUrl;

  // Option B: from localStorage if you stored it at login/menu click
  const fromStorage = localStorage.getItem("vendorId");
  if (fromStorage) return fromStorage;

  // Fallback: use your Firestore doc id (from your screenshot)
  return "1980 Penang Prawn Noodle";
}

function formatStars(rating) {
  const r = Math.round(rating); // nearest whole star
  return "★".repeat(r) + "☆".repeat(5 - r);
}

function isInLast30Days(dateObj) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  return dateObj >= cutoff;
}

// Simple complaint categorizer from comment text.
// You can expand these keywords anytime.
function categorizeComplaint(comment) {
  const text = (comment || "").toLowerCase();

  const rules = [
    { category: "Food Quality", keywords: ["cold", "raw", "stale", "salty", "bland", "taste", "spoilt"] },
    { category: "Service Speed", keywords: ["slow", "wait", "waiting", "late", "delay", "long"] },
    { category: "Portion Size", keywords: ["small", "little", "portion", "less", "tiny"] },
    { category: "Cleanliness", keywords: ["dirty", "unclean", "hygiene", "clean", "cockroach", "smell"] },
  ];

  for (const rule of rules) {
    if (rule.keywords.some(k => text.includes(k))) return rule.category;
  }
  return "Other";
}

/***********************
 * LOAD CUSTOMER SATISFACTION FROM FIRESTORE
 ***********************/
async function loadCustomerSatisfaction() {
  const vendorId = getVendorId();

  // 1) Read all reviews for this vendor
  // If your "timestamp" is a Firestore Timestamp field (as in your screenshot), ordering works.
  const reviewsRef = db.collection("vendors").doc(vendorId).collection("Reviews");
  const snap = await reviewsRef.orderBy("timestamp", "desc").get();

  const reviews = [];
  snap.forEach(doc => {
    const d = doc.data();
    const ts = d.timestamp && d.timestamp.toDate ? d.timestamp.toDate() : null;

    reviews.push({
      rating: Number(d.rating ?? 0),
      comment: d.comment ?? "",
      date: ts, // JS Date object (or null)
    });
  });

  // If there are no reviews, clear UI nicely
  if (reviews.length === 0) {
    document.getElementById("overallRating").textContent = "0.0";
    document.getElementById("overallStars").textContent = "☆☆☆☆☆";
    document.getElementById("totalReviews").textContent = "0";
    document.getElementById("totalComplaints").textContent = "0";
    document.getElementById("reviewsList").innerHTML = "<div class='muted'>No reviews yet.</div>";
    document.getElementById("complaintsGrid").innerHTML = "<div class='muted'>No complaint data yet.</div>";
    return;
  }

  // 2) Overall rating (all-time average)
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  const avg = sum / reviews.length;

  document.getElementById("overallRating").textContent = avg.toFixed(1);
  document.getElementById("overallStars").textContent = formatStars(avg);

  // 3) Total reviews "this month" (using last 30 days)
  const reviewsLast30 = reviews.filter(r => r.date && isInLast30Days(r.date));
  document.getElementById("totalReviews").textContent = String(reviewsLast30.length);

  // 4) Complaints (rule: rating <= 2) in last 30 days
  const complaintsLast30 = reviewsLast30.filter(r => (r.rating || 0) <= 2);
  document.getElementById("totalComplaints").textContent = String(complaintsLast30.length);

  // Optional: update the subtext "x% of orders" if you don't have orders count.
  // If you DO have orders count somewhere, tell me and I’ll wire it properly.
  // For now we’ll show % of reviews.
  const complaintRate = reviewsLast30.length > 0
    ? (complaintsLast30.length / reviewsLast30.length) * 100
    : 0;

  const complaintSubtextEl = document.querySelector("#totalComplaints + .stat-subtext");
  if (complaintSubtextEl) {
    complaintSubtextEl.textContent = `${complaintRate.toFixed(1)}% of reviews (last 30 days)`;
  }

  // 5) Recent reviews list (latest 5)
  const recent = reviews.slice(0, 5);
  const reviewsList = document.getElementById("reviewsList");
  reviewsList.innerHTML = "";

  recent.forEach(r => {
    const dateStr = r.date
      ? r.date.toISOString().slice(0, 10)
      : "";

    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

    // sentiment from rating (simple rule)
    const sentiment =
      r.rating >= 4 ? "positive" :
      r.rating === 3 ? "neutral" : "negative";

    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";
    reviewCard.innerHTML = `
      <div class="review-header">
        <span class="review-rating">${stars}</span>
        <span class="review-date">${dateStr}</span>
      </div>
      <div class="review-text">${r.comment || ""}</div>
      <span class="review-sentiment sentiment-${sentiment}">
        ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </span>
    `;
    reviewsList.appendChild(reviewCard);
  });

  // 6) Complaint categories grid (from complaint comments in last 30 days)
  const counts = {};
  complaintsLast30.forEach(r => {
    const cat = categorizeComplaint(r.comment);
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const totalComplaintCount = complaintsLast30.length || 1; // avoid div by 0
  const complaintCategories = Object.entries(counts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalComplaintCount) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const complaintsGrid = document.getElementById("complaintsGrid");
  complaintsGrid.innerHTML = "";

  if (complaintCategories.length === 0) {
    complaintsGrid.innerHTML = "<div class='muted'>No complaints in the last 30 days.</div>";
  } else {
    complaintCategories.forEach(c => {
      const card = document.createElement("div");
      card.className = "complaint-category";
      card.innerHTML = `
        <h5>${c.category}</h5>
        <div class="complaint-count">${c.count}</div>
        <div class="complaint-bar">
          <div class="complaint-fill" style="width: ${c.percentage}%"></div>
        </div>
        <div class="stat-subtext">${c.percentage}% of complaints</div>
      `;
      complaintsGrid.appendChild(card);
    });
  }
}

// Run after page loads
window.addEventListener("DOMContentLoaded", () => {
  loadCustomerSatisfaction().catch(err => console.error("Customer satisfaction load failed:", err));
})