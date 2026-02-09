// grab all the input fields from the HTML so we can work with them
const foodNameField = document.getElementById('foodName');
const foodDescriptionField = document.getElementById('foodDescription');
const priceField = document.getElementById('price');

// set up default values for availability and cuisine
let selectedAvailability = 'Yes';
let selectedCuisine = 'Cuisine selection';

// when someone clicks the food name field, make it editable and clear the placeholder text
foodNameField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter food name...') {
    this.textContent = '';
  }
});

// same thing for the description field
foodDescriptionField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter food description...') {
    this.textContent = '';
  }
});

// and same for the price field
priceField.addEventListener('click', function() {
  this.contentEditable = true;
  this.focus();
  if (this.textContent === 'Enter price...') {
    this.textContent = '';
  }
});

// get all the availability buttons (Yes/No)
const availabilityButtons = document.querySelectorAll('.availability button');
// when someone clicks a button, highlight it and save their choice
availabilityButtons.forEach(button => {
  button.addEventListener('click', function() {
    // first remove the highlight from all buttons
    availabilityButtons.forEach(btn => btn.classList.remove('selected'));
    // then add highlight to the one they clicked
    this.classList.add('selected');
    // save what they picked
    selectedAvailability = this.textContent;
  });
});

// grab the cuisine dropdown button and all the options inside it
const cuisineButton = document.querySelector('.dropdown button');
const cuisineOptions = document.querySelectorAll('.dropdown-content option');

// when they click the cuisine button, show or hide the dropdown menu
cuisineButton.addEventListener('click', function(e) {
  e.stopPropagation(); // stops the click from bubbling up to document
  const dropdown = this.nextElementSibling;
  dropdown.classList.toggle('show'); // flip between showing and hiding
});

// when someone clicks a cuisine option, update the button and save their choice
cuisineOptions.forEach(option => {
  option.addEventListener('click', function() {
    selectedCuisine = this.textContent; // save what they picked
    cuisineButton.textContent = selectedCuisine; // update button text to show it
    document.querySelector('.dropdown-content').classList.remove('show'); // close the dropdown
  });
});

// if they click anywhere else on the page, close the dropdown
document.addEventListener('click', function() {
  document.querySelector('.dropdown-content').classList.remove('show');
});

// get all the sidebar menu items
const sidebarItems = document.querySelectorAll('.sidebar ul li');

// this object connects menu names to their HTML files
const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'order-requests.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

// when someone clicks a sidebar item, redirect them to that page
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    const pageName = this.textContent.trim(); // get the text they clicked
    if (sidebarPages[pageName]) { // check if we have a page for it
      window.location.href = sidebarPages[pageName]; // go to that page
    }
  });
});

// if they click the discard button, confirm then go back to menu
document.querySelector('.discard').addEventListener('click', function() {
  if (confirm('Discard changes and go back to menu?')) {
    window.location.href = 'vendor-menu.html';
  }
});

// when they click "Add Item", validate everything and save it
document.querySelector('.add-item').addEventListener('click', function() {
  // get all the values they entered
  const foodName = foodNameField.textContent.trim();
  const foodDescription = foodDescriptionField.textContent.trim();
  const price = priceField.textContent.trim();

  // check if food name is filled in
  if (foodName === '' || foodName === 'Enter food name...') {
    alert('Please enter a food name');
    return; // stop here if empty
  }
  // check if description is filled in
  if (foodDescription === '' || foodDescription === 'Enter food description...') {
    alert('Please enter a food description');
    return;
  }
  // check if price is filled in
  if (price === '' || price === 'Enter price...') {
    alert('Please enter a price');
    return;
  }
  // check if they picked a cuisine
  if (selectedCuisine === 'Cuisine selection') {
    alert('Please select a cuisine');
    return;
  }

  // create an object with all the food item data
  const foodItem = {
    id: Date.now(), // use current timestamp as unique ID
    name: foodName,
    description: foodDescription,
    price: price,
    availability: selectedAvailability,
    cuisine: selectedCuisine
  };

  // get existing items from localStorage (or empty array if nothing saved yet)
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  // add the new item to the array
  foodItems.push(foodItem);
  
  // save the updated array back to localStorage
  localStorage.setItem('foodItems', JSON.stringify(foodItems));

  // show success message and redirect to menu page
  alert('Food item added successfully!');
  window.location.href = 'vendor-menu.html';
});