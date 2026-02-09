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

const menuListView = document.getElementById('menu-list-view');
const createMenuView = document.getElementById('create-menu-view');
const addMenuBtn = document.getElementById('addmenu');
const menuListBtn = document.getElementById('menulist');
const backToListBtn = document.getElementById('back-to-list');
const menusContainer = document.getElementById('menus-container');

menuListView.style.display = 'block';
createMenuView.style.display = 'none';

function loadFoodItems() {
  const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  
  if (foodItems.length === 0) {
    menusContainer.innerHTML = '<div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 1px 0px 10px lightgrey; text-align: center;"><p style="color: #666; font-size: 16px; margin: 0;">No food items added yet. Click "Add Menu" to add your first item.</p></div>';
    return;
  }

  menusContainer.innerHTML = '<table class="menu-items-table"><thead><tr><th>Food Name</th><th>Description</th><th>Cuisine</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead><tbody id="food-items-list"></tbody></table>';
  
  const foodItemsList = document.getElementById('food-items-list');
  
  foodItems.forEach(item => {
    const row = document.createElement('tr');
    const availabilityText = item.availability === 'Yes' ? 'Available' : 'Unavailable';
    const availabilityClass = item.availability === 'Yes' ? 'available' : 'unavailable';
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
    foodItemsList.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.getAttribute('data-id'));
      if (confirm('Are you sure you want to delete this item?')) {
        deleteFoodItem(itemId);
      }
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.getAttribute('data-id'));
      editFoodItem(itemId);
    });
  });
}

function deleteFoodItem(itemId) {
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  foodItems = foodItems.filter(item => item.id !== itemId);
  localStorage.setItem('foodItems', JSON.stringify(foodItems));
  loadFoodItems();
}

function editFoodItem(itemId) {
  let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
  const item = foodItems.find(f => f.id === itemId);
  if (!item) return;
  localStorage.setItem('editItemData', JSON.stringify(item));
  window.location.href = 'add-food-item.html';
}

addMenuBtn.addEventListener('click', function() {
  localStorage.removeItem('editItemData');
  window.location.href = 'add-food-item.html';
});

menuListBtn.addEventListener('click', function() {
  menuListView.style.display = 'block';
  createMenuView.style.display = 'none';
  loadFoodItems();
});

if (backToListBtn) {
  backToListBtn.addEventListener('click', function() {
    menuListView.style.display = 'block';
    createMenuView.style.display = 'none';
  });
}

loadFoodItems();