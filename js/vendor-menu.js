// sidebar navigation setup
const sidebarItems = document.querySelectorAll('.sidebar ul li');

const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'order-requests.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

// handle sidebar clicks
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (sidebarPages[pageName]) {
      window.location.href = sidebarPages[pageName];
    }
  });
});

// grab the two main view sections and the buttons
const menuListView = document.getElementById('menu-list-view');
const createMenuView = document.getElementById('create-menu-view');
const addMenuBtn = document.getElementById('addmenu');
const menuListBtn = document.getElementById('menulist');
const backToListBtn = document.getElementById('back-to-list');
const menusContainer = document.getElementById('menus-container');

// show menu list by default, hide create view
menuListView.style.display = 'block';
createMenuView.style.display = 'none';

// this function loads all food items from localStorage and displays them
function loadFoodItems() {
  // get items from storage (or empty array if nothing there)
  const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  // if no items exist, show a message
  if (foodItems.length === 0) {
    menusContainer.innerHTML = '<div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 1px 0px 10px lightgrey; text-align: center;"><p style="color: #666; font-size: 16px; margin: 0;">No food items added yet. Click "Add Menu" to add your first item.</p></div>';
    return;
  }

  // create a table to display all items
  menusContainer.innerHTML = '<table class="menu-items-table"><thead><tr><th>Food Name</th><th>Description</th><th>Cuisine</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead><tbody id="food-items-list"></tbody></table>';
  
  const foodItemsList = document.getElementById('food-items-list');
  
  // loop through each item and create a table row
  foodItems.forEach(item => {
    const row = document.createElement('tr');
    // figure out availability text and styling
    const availabilityText = item.availability === 'Yes' ? 'Available' : 'Unavailable';
    const availabilityClass = item.availability === 'Yes' ? 'available' : 'unavailable';
    // build the row HTML with all the data
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.cuisine}</td>
      <td>${item.price}</td>
      <td><span class="availability-badge ${availabilityClass}">${availabilityText}</span></td>
      <td>
        <button class="action-btn edit-btn" data-id="${item.id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${item.id}">Delete</button>
      </td>
    `;
    // add the row to the table
    foodItemsList.appendChild(row);
  });

  // set up delete button click handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.getAttribute('data-id')); // get the item's ID
      if (confirm('Are you sure you want to delete this item?')) {
        deleteFoodItem(itemId); // delete it
      }
    });
  });

  // set up edit button click handlers
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.getAttribute('data-id'));
      editFoodItem(itemId); // edit it
    });
  });
}

// delete a food item from localStorage
function deleteFoodItem(itemId) {
  // get all items
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  // filter out the one we want to delete (keep everything except this ID)
  foodItems = foodItems.filter(item => item.id !== itemId);
  // save the updated array
  localStorage.setItem('foodItems', JSON.stringify(foodItems));
  // refresh the display
  loadFoodItems();
}

// prepare to edit a food item
function editFoodItem(itemId) {
  // get all items
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  // find the specific item we want to edit
  const item = foodItems.find(f => f.id === itemId);
  if (!item) return; // if not found, bail out
  // save it temporarily so the edit page can access it
  localStorage.setItem('editItemData', JSON.stringify(item));
  // go to the edit page
  window.location.href = 'add-food-item.html';
}

// when "Add Menu" is clicked, clear any edit data and go to add page
addMenuBtn.addEventListener('click', function() {
  localStorage.removeItem('editItemData'); // clear edit data so we're in "add" mode
  window.location.href = 'add-food-item.html';
});

// when "Menu List" is clicked, show the list view
menuListBtn.addEventListener('click', function() {
  menuListView.style.display = 'block';
  createMenuView.style.display = 'none';
  loadFoodItems(); // refresh the list
});

// if back button exists, set up its click handler
if (backToListBtn) {
  backToListBtn.addEventListener('click', function() {
    menuListView.style.display = 'block';
    createMenuView.style.display = 'none';
  });
}

// load items when page first loads
loadFoodItems();