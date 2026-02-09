let db;
const VENDOR_NAME = "Tian Tian Chicken Rice";

window.addEventListener('load', function() {
  setTimeout(() => {
    try {
      db = firebase.firestore();
      console.log('✅ Firestore connected');
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
    }
  }, 500);
});

// ===== GET DOM ELEMENTS =====
const stallNumberField = document.getElementById('stallNumber');
const startDateField = document.getElementById('startDate');
const endDateField = document.getElementById('endDate');
const feeField = document.getElementById('fee');
const renewBtn = document.querySelector('.renew');
const discardBtn = document.querySelector('.discard');

// ===== MAKE FIELDS EDITABLE =====
stallNumberField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter stall number...') {
    this.textContent = '';
  }
});

stallNumberField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter stall number...';
  }
});

startDateField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter rental start date (YYYY-MM-DD)...') {
    this.textContent = '';
  }
});

startDateField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter rental start date (YYYY-MM-DD)...';
  }
});

endDateField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter rental end date (YYYY-MM-DD)...') {
    this.textContent = '';
  }
});

endDateField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter rental end date (YYYY-MM-DD)...';
  }
});

feeField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter fee...') {
    this.textContent = '';
  }
});

feeField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter fee...';
  }
});

// ===== DISCARD BUTTON =====
discardBtn.addEventListener('click', function() {
  if (confirm('Discard changes and go back?')) {
    window.location.href = 'current-rentalagreement.html';
  }
});

// ===== RENEW BUTTON - SAVE TO DATABASE =====
renewBtn.addEventListener('click', async function() {
  // Get all input values
  const stallNumber = stallNumberField.textContent.trim();
  const startDate = startDateField.textContent.trim();
  const endDate = endDateField.textContent.trim();
  const fee = feeField.textContent.trim();

  // ===== VALIDATION =====
  if (stallNumber === '' || stallNumber === 'Enter stall number...') {
    alert('❌ Please enter a stall number');
    return;
  }

  if (startDate === '' || startDate === 'Enter rental start date (YYYY-MM-DD)...') {
    alert('❌ Please enter a start date');
    return;
  }

  if (endDate === '' || endDate === 'Enter rental end date (YYYY-MM-DD)...') {
    alert('❌ Please enter an end date');
    return;
  }

  if (fee === '' || fee === 'Enter fee...') {
    alert('❌ Please enter a fee');
    return;
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    alert('❌ Please use date format: YYYY-MM-DD (e.g., 2024-01-01)');
    return;
  }

  // ===== PREPARE DATA =====
  const rentalAgreement = {
    vendorId: VENDOR_NAME,
    stallNumber: stallNumber,
    startDate: startDate,
    endDate: endDate,
    fee: parseFloat(fee),
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  console.log('📝 Saving rental agreement:', rentalAgreement);

  try {
    if (!db) {
      alert('❌ Error: Database not initialized. Please refresh the page.');
      return;
    }

    // Disable button to prevent multiple clicks
    renewBtn.disabled = true;
    renewBtn.textContent = 'Saving...';

    // Save to rentalagreement collection
    const docRef = await db.collection('rentalagreement').add(rentalAgreement);

    console.log('✅ Rental agreement saved with ID:', docRef.id);
    alert('✅ Rental agreement renewed successfully!');

    // Redirect to current rental agreement page
    window.location.href = 'current-rentalagreement.html';

  } catch (error) {
    console.error('❌ Error saving rental agreement:', error);
    alert('❌ Error saving rental agreement: ' + error.message);

    // Re-enable button
    renewBtn.disabled = false;
    renewBtn.textContent = 'Renew Rental';
  }
});

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

console.log('✅ Renew rental page ready');