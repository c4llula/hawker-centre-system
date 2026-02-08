const inspectionRecords = [
    {
        date: "2025-02-05",
        vendor: "Hawker Stall #01 - Chicken Rice",
        officer: "Sarah Tan",
        score: 92,
        grade: "A",
        remarks: "Excellent hygiene standards. All food stored properly at correct temperatures.",
        violations: "None",
        followUp: "No"
    },
    {
        date: "2025-02-01",
        vendor: "Hawker Stall #02 - Laksa",
        officer: "John Lim",
        score: 78,
        grade: "B",
        remarks: "Good overall standards. Minor improvement needed in food handling procedures.",
        violations: "Staff not wearing hairnets",
        followUp: "Yes"
    },
    {
        date: "2025-01-28",
        vendor: "Hawker Stall #04 - Char Kway Teow",
        officer: "Sarah Tan",
        score: 88,
        grade: "B",
        remarks: "Good hygiene practices. Kitchen well-maintained and clean.",
        violations: "None",
        followUp: "No"
    },
    {
        date: "2025-01-25",
        vendor: "Hawker Stall #03 - Nasi Lemak",
        officer: "John Lim",
        score: 65,
        grade: "C",
        remarks: "Acceptable but needs improvement. Found issues with pest control.",
        violations: "Evidence of pest activity, Improper waste disposal",
        followUp: "Yes"
    },
    {
        date: "2025-01-20",
        vendor: "Hawker Stall #05 - Satay",
        officer: "Sarah Tan",
        score: 95,
        grade: "A",
        remarks: "Exemplary standards. Kitchen spotless, food handling procedures excellent.",
        violations: "None",
        followUp: "No"
    },
    {
        date: "2025-01-15",
        vendor: "Hawker Stall #01 - Chicken Rice",
        officer: "John Lim",
        score: 90,
        grade: "A",
        remarks: "Maintained high standards. Staff well-trained in food safety.",
        violations: "None",
        followUp: "No"
    }
];

// Upcoming inspections array
let upcomingInspections = [
    {
        vendor: "Hawker Stall #01 - Chicken Rice",
        date: "2025-02-10",
        time: "10:00 AM",
        officer: "Sarah Tan",
        notes: ""
    },
    {
        vendor: "Hawker Stall #03 - Nasi Lemak",
        date: "2025-02-12",
        time: "2:00 PM",
        officer: "John Lim",
        notes: ""
    },
    {
        vendor: "Hawker Stall #05 - Satay",
        date: "2025-02-15",
        time: "11:30 AM",
        officer: "Sarah Tan",
        notes: ""
    }
];

// Populate inspection dropdown
function populateInspectionDropdown() {
    const select = document.getElementById("logInspection");
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Choose from upcoming inspections...</option>';
    
    upcomingInspections.forEach((inspection, index) => {
        const option = document.createElement("option");
        option.value = index;
        const formattedDate = new Date(inspection.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        option.textContent = `${inspection.vendor} - ${formattedDate} at ${inspection.time} (Officer: ${inspection.officer})`;
        select.appendChild(option);
    });
}

// Populate records table
function populateRecordsTable(records = inspectionRecords) {
    const tbody = document.getElementById("recordsTableBody");
    tbody.innerHTML = "";

    records.forEach((record, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.vendor}</td>
            <td>${record.officer}</td>
            <td>${record.score}</td>
            <td><span class="grade-badge grade-${record.grade}">${record.grade}</span></td>
            <td>${record.remarks.substring(0, 50)}${record.remarks.length > 50 ? '...' : ''}</td>
            <td>
                <button class="btn action-btn" onclick="viewRecord(${index})">View</button>
                <button class="btn btn-secondary action-btn" onclick="editRecord(${index})">Edit</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// View full record details
function viewRecord(index) {
    const record = inspectionRecords[index];
    alert(`
Inspection Details:
==================
Date: ${record.date}
Vendor: ${record.vendor}
Officer: ${record.officer}
Score: ${record.score}
Grade: ${record.grade}

Remarks:
${record.remarks}

Violations: ${record.violations}
Follow-up Required: ${record.followUp}
    `);
}

// Edit record (placeholder function)
function editRecord(index) {
    alert("Edit functionality would open a modal or form to update the record.");
}

// Search and filter functionality
document.getElementById("searchVendor").addEventListener("input", filterRecords);
document.getElementById("filterGrade").addEventListener("change", filterRecords);
document.getElementById("filterMonth").addEventListener("change", filterRecords);

function filterRecords() {
    const searchTerm = document.getElementById("searchVendor").value.toLowerCase();
    const gradeFilter = document.getElementById("filterGrade").value;
    const monthFilter = document.getElementById("filterMonth").value;

    const filtered = inspectionRecords.filter(record => {
        const matchesSearch = record.vendor.toLowerCase().includes(searchTerm);
        const matchesGrade = !gradeFilter || record.grade === gradeFilter;
        const matchesMonth = !monthFilter || record.date.startsWith(monthFilter);
        
        return matchesSearch && matchesGrade && matchesMonth;
    });

    populateRecordsTable(filtered);
}

// Schedule form submission
document.getElementById("scheduleForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const vendor = document.getElementById("vendorSelect").value;
    const date = document.getElementById("inspectionDate").value;
    const time = document.getElementById("inspectionTime").value;
    const officer = document.getElementById("officer").value;
    const notes = document.getElementById("notes").value;

    // Add to upcoming inspections array
    const newInspection = {
        vendor: vendor,
        date: date,
        time: time,
        officer: officer,
        notes: notes
    };
    upcomingInspections.push(newInspection);

    // Update the dropdown
    populateInspectionDropdown();

    // Create new inspection item
    const inspectionList = document.getElementById("upcomingList");
    const newItem = document.createElement("div");
    newItem.className = "inspection-item";
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    newItem.innerHTML = `
        <div class="inspection-item-header">
            <div class="vendor-name">${vendor}</div>
            <span class="status-badge status-pending">Pending</span>
        </div>
        <div class="inspection-date">📅 ${formattedDate} at ${time}</div>
        <div class="inspection-time">Officer: ${officer}</div>
        ${notes ? `<div class="inspection-time" style="margin-top: 5px; font-style: italic;">Note: ${notes}</div>` : ''}
    `;
    
    inspectionList.insertBefore(newItem, inspectionList.firstChild);
    
    // Update pending count
    const pendingCount = document.getElementById("pendingInspections");
    pendingCount.textContent = parseInt(pendingCount.textContent) + 1;
    
    // Show success message
    const successMsg = document.getElementById("successMessage");
    successMsg.textContent = "✓ Inspection scheduled successfully!";
    successMsg.style.display = "block";
    setTimeout(() => {
        successMsg.style.display = "none";
    }, 3000);
    
    // Reset form
    this.reset();
});

// Log inspection form submission
document.getElementById("logForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const selectedIndex = document.getElementById("logInspection").value;
    
    if (selectedIndex === "") {
        alert("Please select an inspection to log.");
        return;
    }
    
    const selectedInspection = upcomingInspections[selectedIndex];
    
    const newRecord = {
        date: selectedInspection.date,
        vendor: selectedInspection.vendor,
        officer: selectedInspection.officer,
        score: parseInt(document.getElementById("score").value),
        grade: document.getElementById("grade").value,
        remarks: document.getElementById("remarks").value,
        violations: document.getElementById("violations").value || "None",
        followUp: document.getElementById("followUp").value
    };

    // Add to records array
    inspectionRecords.unshift(newRecord);
    
    // Remove from upcoming inspections
    upcomingInspections.splice(selectedIndex, 1);
    
    // Update the dropdown
    populateInspectionDropdown();
    
    // Remove from upcoming list display
    const upcomingList = document.getElementById("upcomingList");
    const items = upcomingList.getElementsByClassName("inspection-item");
    if (items[selectedIndex]) {
        // Mark as completed instead of removing
        const statusBadge = items[selectedIndex].querySelector(".status-badge");
        statusBadge.textContent = "Completed";
        statusBadge.className = "status-badge status-completed";
        
        // Remove after a delay
        setTimeout(() => {
            items[selectedIndex].remove();
        }, 2000);
    }
    
    // Refresh table
    populateRecordsTable();
    
    // Update stats
    const thisMonth = document.getElementById("thisMonth");
    thisMonth.textContent = parseInt(thisMonth.textContent) + 1;
    
    const pendingCount = document.getElementById("pendingInspections");
    pendingCount.textContent = parseInt(pendingCount.textContent) - 1;
    
    // Show success message
    const successMsg = document.getElementById("successMessage");
    successMsg.textContent = "✓ Inspection logged successfully!";
    successMsg.style.display = "block";
    setTimeout(() => {
        successMsg.style.display = "none";
    }, 3000);
    
    // Scroll to records
    document.getElementById("records").scrollIntoView({ behavior: 'smooth' });
    
    // Reset form
    this.reset();
});

// Initialize table on load
populateRecordsTable();

// Initialize inspection dropdown
populateInspectionDropdown();

// Set today's date as default for date inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById("inspectionDate").setAttribute('min', today);

