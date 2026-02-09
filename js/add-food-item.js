// ===== FIREBASE & DOM SETUP =====
let db;
let vendorDocId = "Tian Tian Chicken Rice"; // Default vendor
let foodData = null;

// Initialize Firebase and get references
window.addEventListener('load', function() {
  setTimeout(() => {
    try {
      db = firebase.firestore();
      console.log('✅ Firestore connected');
      
      // Get data passed from vendor-menu.js
      const tempFoodData = sessionStorage.getItem('tempFoodData');
      if (tempFoodData) {
        foodData = JSON.parse(tempFoodData);
        vendorDocId = foodData.vendorDocId;
        console.log('✅ Food data loaded from sessionStorage:', foodData);
      }
    } catch (error) {
      console.error('❌ Error initializing:', error);
      alert('Error initializing. Please try again.');
    }
  }, 500);
});

// ===== GET DOM ELEMENTS =====
const foodNameField = document.getElementById('foodName');
const foodDescriptionField = document.getElementById('foodDescription');
const priceField = document.getElementById('price');
const cuisineBtn = document.querySelector('.cuisine-btn');
const cuisineOptions = document.querySelectorAll('.dropdown-content option');
const availabilityButtons = document.querySelectorAll('.availability-btn');
const addItemBtn = document.querySelector('.add-item');
const discardBtn = document.querySelector('.discard');

// ===== DEFAULT VALUES =====
let selectedAvailability = 'Yes';
let selectedCuisine = 'Cuisine selection';

// ===== FOOD NAME FIELD - MAKE EDITABLE =====
foodNameField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter food name...') {
    this.textContent = '';
  }
});

foodNameField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter food name...';
  }
});

// ===== FOOD DESCRIPTION FIELD - MAKE EDITABLE =====
foodDescriptionField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter food description...') {
    this.textContent = '';
  }
});

foodDescriptionField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter food description...';
  }
});

// ===== PRICE FIELD - MAKE EDITABLE =====
priceField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter price...') {
    this.textContent = '';
  }
});

priceField.addEventListener('blur', function() {
  if (this.textContent.trim() === '') {
    this.textContent = 'Enter price...';
  }
});

// ===== AVAILABILITY BUTTONS (YES/NO) =====
availabilityButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove selected class from all buttons
    availabilityButtons.forEach(btn => btn.classList.remove('selected'));
    // Add selected class to clicked button
    this.classList.add('selected');
    // Save selection
    selectedAvailability = this.textContent.trim();
    console.log('Selected availability:', selectedAvailability);
  });
});

// Set default selection
availabilityButtons[0].classList.add('selected');

// ===== CUISINE DROPDOWN =====
cuisineBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  const dropdown = this.nextElementSibling;
  dropdown.classList.toggle('show');
});

cuisineOptions.forEach(option => {
  option.addEventListener('click', function() {
    selectedCuisine = this.textContent.trim();
    cuisineBtn.textContent = selectedCuisine;
    document.querySelector('.dropdown-content').classList.remove('show');
    console.log('Selected cuisine:', selectedCuisine);
  });
});

// Close dropdown if click elsewhere
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelector('.dropdown-content').classList.remove('show');
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

// ===== DISCARD BUTTON =====
discardBtn.addEventListener('click', function() {
  if (confirm('Discard changes and go back to menu?')) {
    // Clear sessionStorage
    sessionStorage.removeItem('tempFoodData');
    window.location.href = 'vendor-menu.html';
  }
});

// ===== ADD ITEM BUTTON - SAVE TO FIREBASE =====
addItemBtn.addEventListener('click', async function() {
  // Get all input values
  const foodName = foodNameField.textContent.trim();
  const foodDescription = foodDescriptionField.textContent.trim();
  const price = priceField.textContent.trim();

  // ===== VALIDATION =====
  if (foodName === '' || foodName === 'Enter food name...') {
    alert('❌ Please enter a food name');
    return;
  }
  
  if (foodDescription === '' || foodDescription === 'Enter food description...') {
    alert('❌ Please enter a food description');
    return;
  }
  
  if (price === '' || price === 'Enter price...') {
    alert('❌ Please enter a price');
    return;
  }
  
  if (selectedCuisine === 'Cuisine selection') {
    alert('❌ Please select a cuisine');
    return;
  }

  // ===== PREPARE DATA =====
  const foodItem = {
    name: foodName,
    description: foodDescription,
    price: parseFloat(price), // Convert to number
    availability: selectedAvailability === 'Yes' ? true : false,
    cuisine: selectedCuisine,
    createdAt: new Date().toISOString()
  };

  console.log('📝 Saving food item:', foodItem);

  try {
    if (!db || !vendorDocId) {
      alert('❌ Error: Database not initialized. Please refresh the page.');
      return;
    }

    // Disable button to prevent multiple clicks
    addItemBtn.disabled = true;
    addItemBtn.textContent = 'Saving...';

    // Save to Menu subcollection in Firestore
    const vendorRef = db.collection('vendors').doc(vendorDocId);
    const menuCollectionRef = vendorRef.collection('Menu');
    
    // Add document with auto-generated ID
    const docRef = await menuCollectionRef.add(foodItem);
    
    console.log('✅ Food item saved successfully with ID:', docRef.id);
    
    // Show success message
    alert('✅ Food item added successfully!');
    
    // Clear sessionStorage
    sessionStorage.removeItem('tempFoodData');
    
    // Redirect back to menu page
    window.location.href = 'vendor-menu.html';

  } catch (error) {
    console.error('❌ Error saving food item:', error);
    alert('❌ Error saving food item: ' + error.message);
    
    // Re-enable button
    addItemBtn.disabled = false;
    addItemBtn.textContent = 'Add Item';
  }
});