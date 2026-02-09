const foodNameField = document.getElementById('foodName');
const foodDescriptionField = document.getElementById('foodDescription');
const priceField = document.getElementById('price');

let selectedAvailability = 'Yes';
let selectedCuisine = 'Cuisine selection';

foodNameField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter food name...') {
    this.textContent = '';
  }
});

foodDescriptionField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter food description...') {
    this.textContent = '';
  }
});

priceField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter price...') {
    this.textContent = '';
  }
});

const availabilityButtons = document.querySelectorAll('.availability button');
availabilityButtons.forEach(button => {
  button.addEventListener('click', function() {
    availabilityButtons.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
    selectedAvailability = this.textContent;
  });
});

const cuisineButton = document.querySelector('.dropdown button');
const cuisineOptions = document.querySelectorAll('.dropdown-content option');

cuisineButton.addEventListener('click', function(e) {
  e.stopPropagation();
  const dropdown = this.nextElementSibling;
  dropdown.classList.toggle('show');
});

cuisineOptions.forEach(option => {
  option.addEventListener('click', function() {
    selectedCuisine = this.textContent;
    cuisineButton.textContent = selectedCuisine;
    document.querySelector('.dropdown-content').classList.remove('show');
  });
});

document.addEventListener('click', function() {
  document.querySelector('.dropdown-content').classList.remove('show');
});

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

document.querySelector('.discard').addEventListener('click', function() {
  if (confirm('Discard changes and go back to menu?')) {
    window.location.href = 'vendor-menu.html';
  }
});

document.querySelector('.add-item').addEventListener('click', function() {
  const foodName = foodNameField.textContent.trim();
  const foodDescription = foodDescriptionField.textContent.trim();
  const price = priceField.textContent.trim();

  if (foodName === '' || foodName === 'Enter food name...') {
    alert('Please enter a food name');
    return;
  }
  if (foodDescription === '' || foodDescription === 'Enter food description...') {
    alert('Please enter a food description');
    return;
  }
  if (price === '' || price === 'Enter price...') {
    alert('Please enter a price');
    return;
  }
  if (selectedCuisine === 'Cuisine selection') {
    alert('Please select a cuisine');
    return;
  }

  const foodItem = {
    id: Date.now(),
    name: foodName,
    description: foodDescription,
    price: price,
    availability: selectedAvailability,
    cuisine: selectedCuisine
  };

  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  foodItems.push(foodItem);
  
  localStorage.setItem('foodItems', JSON.stringify(foodItems));

  alert('Food item added successfully!');
  window.location.href = 'vendor-menu.html';
});