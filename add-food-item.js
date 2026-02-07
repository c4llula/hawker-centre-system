const foodName = document.getElementById('foodName');
const foodDescription = document.getElementById('foodDescription');
const price = document.getElementById('price');

foodName.contentEditable = true;
foodDescription.contentEditable = true;
price.contentEditable = true;

[foodName, foodDescription].forEach(field => {
  field.addEventListener('focus', function() {
    if (this.textContent.includes('Enter')) {
      this.textContent = '';
    }
  });

  field.addEventListener('blur', function() {
    if (this.textContent.trim() === '') {
      if (this.id === 'foodName') this.textContent = 'Enter food name...';
      if (this.id === 'foodDescription') this.textContent = 'Enter food description...';
    }
  });
});

price.addEventListener('focus', function() {
  if (this.textContent.includes('Enter')) {
    this.textContent = '$';
  }
  if (!this.textContent.startsWith('$')) {
    this.textContent = '$' + this.textContent;
  }
});

price.addEventListener('input', function() {
  if (!this.textContent.startsWith('$')) {
    this.textContent = '$' + this.textContent;
  }
  
  let value = this.textContent.substring(1).replace(/[^\d.]/g, '');
  
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  
  if (parts[1] && parts[1].length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  this.textContent = '$' + value;
  
  if (value && parseFloat(value) > 0) {
    this.classList.add('valid');
    this.classList.remove('invalid');
  } else if (value) {
    this.classList.add('invalid');
    this.classList.remove('valid');
  } else {
    this.classList.remove('valid', 'invalid');
  }
  
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(this);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
});

price.addEventListener('blur', function() {
  if (this.textContent.trim() === '$' || this.textContent.trim() === '') {
    this.textContent = 'Enter price...';
    this.classList.remove('valid', 'invalid');
  }
});

const availabilityButtons = document.querySelectorAll('.availability button');
let selectedAvailability = null;

availabilityButtons.forEach(button => {
  button.addEventListener('click', function() {
    availabilityButtons.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
    selectedAvailability = this.textContent;
  });
});

const dropdownButton = document.querySelector('.dropdown button');
const dropdownOptions = document.querySelectorAll('.dropdown-content option');
const dropdownContent = document.querySelector('.dropdown-content');
let selectedCuisine = null;

dropdownButton.addEventListener('click', function(e) {
  e.stopPropagation();
  if (dropdownContent.style.display === 'block') {
    dropdownContent.style.display = 'none';
  } else {
    dropdownContent.style.display = 'block';
  }
});

dropdownOptions.forEach(option => {
  option.addEventListener('click', function() {
    selectedCuisine = this.textContent;
    dropdownButton.textContent = selectedCuisine;
    dropdownContent.style.display = 'none';
  });
});

document.addEventListener('click', function() {
  dropdownContent.style.display = 'none';
});

const dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(e) {
  e.stopPropagation();
});

const discardButton = document.querySelector('.discard');
const addItemButton = document.querySelector('.add-item');

discardButton.addEventListener('click', function() {
  if (confirm('Are you sure you want to discard this item?')) {
    foodName.textContent = 'Enter food name...';
    foodDescription.textContent = 'Enter food description...';
    price.textContent = 'Enter price...';
    availabilityButtons.forEach(btn => btn.classList.remove('selected'));
    dropdownButton.textContent = 'Cuisine selection';
    selectedAvailability = null;
    selectedCuisine = null;
    price.classList.remove('valid', 'invalid');
  }
});

addItemButton.addEventListener('click', function() {
  const name = foodName.textContent.includes('Enter') ? '' : foodName.textContent;
  const description = foodDescription.textContent.includes('Enter') ? '' : foodDescription.textContent;
  const priceValue = price.textContent.includes('Enter') ? '' : price.textContent.replace('$', '');

  if (!name || !description || !priceValue || !selectedAvailability || !selectedCuisine) {
    alert('Please fill in all fields!');
    return;
  }

  const menuItem = {
    name: name,
    description: description,
    price: priceValue,
    availability: selectedAvailability,
    cuisine: selectedCuisine
  };

  console.log('Menu Item Added:', menuItem);
  alert('Item added successfully!');

  foodName.textContent = 'Enter food name...';
  foodDescription.textContent = 'Enter food description...';
  price.textContent = 'Enter price...';
  availabilityButtons.forEach(btn => btn.classList.remove('selected'));
  dropdownButton.textContent = 'Cuisine selection';
  selectedAvailability = null;
  selectedCuisine = null;
  price.classList.remove('valid', 'invalid');
});

const sidebarItems = document.querySelectorAll('.sidebar ul li');
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    alert('Navigate to: ' + this.textContent);
  });
});

const menuListButton = document.querySelector('.top-bar button');
menuListButton.addEventListener('click', function() {
  alert('Navigate to Menu List');
});