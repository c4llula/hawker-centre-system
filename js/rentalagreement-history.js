let db;
const VENDOR_NAME = "Tian Tian Chicken Rice";

window.addEventListener('load', function() {
  setTimeout(() => {
    try {
      db = firebase.firestore();
      console.log('✅ Firestore connected');
      loadRentalHistory();
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
    }
  }, 500);
});

// ===== LOAD RENTAL HISTORY =====
async function loadRentalHistory() {
  const tableBody = document.getElementById('rental-table-body');
  
  try {
    if (!db) {
      console.error('Database not initialized');
      return;
    }

    // Query the correct collection name (lowercase)
    const rentalSnapshot = await db.collection('rentalagreement')
      .where('vendorId', '==', VENDOR_NAME)
      .get();

    if (rentalSnapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #666;">
            No rental history found
          </td>
        </tr>
      `;
      return;
    }

    // Convert to array and sort in JavaScript
    const rentals = [];
    rentalSnapshot.forEach(doc => {
      rentals.push(doc.data());
    });

    // Sort by startDate descending (newest first)
    rentals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Build table rows
    let html = '';
    rentals.forEach(rental => {
      const statusClass = rental.status === 'Active' ? 'active' : 'expired';
      const startDate = formatDate(rental.startDate);
      const endDate = formatDate(rental.endDate);
      
      html += `
        <tr>
          <td>${rental.stallNumber}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>$${rental.fee}</td>
          <td class="status ${statusClass}">${rental.status}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    console.log('✅ Rental history loaded');

  } catch (error) {
    console.error('Error loading rental history:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #d32f2f;">
          Error: ${error.message}
        </td>
      </tr>
    `;
  }
}

// ===== FORMAT DATES =====
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// ===== SIDEBAR NAVIGATION =====
const sidebarItems = document.querySelectorAll('.sidebar ul li');
const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'order-requests.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (sidebarPages[pageName]) {
      window.location.href = sidebarPages[pageName];
    }
  });
});

// ===== TOP BAR BUTTONS =====
document.getElementById('rental-agreement-btn').addEventListener('click', function() {
  window.location.href = 'current-rentalagreement.html';
});

document.getElementById('renew-rental-btn').addEventListener('click', function() {
  window.location.href = 'renew-rentalagreement.html';
});

document.getElementById('rental-history-btn').addEventListener('click', function() {
  window.location.href = 'rentalagreement-history.html';
});

console.log('✅ Rental history page ready');