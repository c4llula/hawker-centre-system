let customMenus = [];
let currentEditingMenuId = null;

const mainMenuView = document.getElementById('main-menu-view');
const menuListView = document.getElementById('menu-list-view');
const createMenuView = document.getElementById('create-menu-view');
const menuListBtn = document.getElementById('menulist');
const addMenuBtn = document.getElementById('addmenu');
const backToListBtn = document.getElementById('back-to-list');
const menuNameInput = document.getElementById('menu-name-input');
const addItemBtn = document.getElementById('add-item-btn');
const menuItemsContainer = document.getElementById('menu-items-container');
const saveMenuBtn = document.getElementById('save-menu-btn');
const cancelMenuBtn = document.getElementById('cancel-menu-btn');
const menusContainer = document.getElementById('menus-container');
const menuEditorTitle = document.getElementById('menu-editor-title');

function showMainMenu() {
  mainMenuView.style.display = 'block';
  menuListView.style.display = 'none';
  createMenuView.style.display = 'none';
}

function showMenuList() {
  mainMenuView.style.display = 'none';
  menuListView.style.display = 'block';
  createMenuView.style.display = 'none';
  renderMenuList();
}

function showCreateMenu() {
  mainMenuView.style.display = 'none';
  menuListView.style.display = 'none';
  createMenuView.style.display = 'block';
}

menuListBtn.addEventListener('click', showMenuList);

addMenuBtn.addEventListener('click', () => {
  currentEditingMenuId = null;
  menuEditorTitle.textContent = 'Create New Menu';
  menuNameInput.value = '';
  menuItemsContainer.innerHTML = '';
  showCreateMenu();
});

backToListBtn.addEventListener('click', showMenuList);
cancelMenuBtn.addEventListener('click', showMenuList);
addItemBtn.addEventListener('click', addMenuItem);
saveMenuBtn.addEventListener('click', saveMenu);

function addMenuItem() {
  const itemRow = document.createElement('tr');
  itemRow.className = 'menu-item-row';
  
  itemRow.innerHTML = `
    <td><input type="text" class="item-name" placeholder="e.g., Nasi Goreng"></td>
    <td><input type="text" class="item-cuisine" placeholder="e.g., Indonesian"></td>
    <td><input type="text" class="item-price" placeholder="e.g., $5.00"></td>
    <td>
      <select class="item-availability">
        <option value="Available">Available</option>
        <option value="Unavailable">Unavailable</option>
      </select>
    </td>
    <td>
      <button class="remove-item-btn action-btn">Remove</button>
    </td>
  `;
  
  menuItemsContainer.appendChild(itemRow);
  itemRow.querySelector('.remove-item-btn').addEventListener('click', () => itemRow.remove());
}

function saveMenu() {
  const menuName = menuNameInput.value.trim();
  
  if (!menuName) {
    alert('Please enter a menu name');
    return;
  }
  
  const itemRows = menuItemsContainer.querySelectorAll('.menu-item-row');
  
  if (itemRows.length === 0) {
    alert('Please add at least one item to the menu');
    return;
  }
  
  const items = [];
  let isValid = true;
  
  itemRows.forEach(row => {
    const name = row.querySelector('.item-name').value.trim();
    const cuisine = row.querySelector('.item-cuisine').value.trim();
    const price = row.querySelector('.item-price').value.trim();
    const availability = row.querySelector('.item-availability').value;
    
    if (!name || !cuisine || !price) {
      isValid = false;
      return;
    }
    
    items.push({ name, cuisine, price, availability });
  });
  
  if (!isValid) {
    alert('Please fill in all fields for each menu item');
    return;
  }
  
  if (currentEditingMenuId !== null) {
    const menuIndex = customMenus.findIndex(m => m.id === currentEditingMenuId);
    if (menuIndex !== -1) {
      customMenus[menuIndex] = {
        id: currentEditingMenuId,
        name: menuName,
        items: items,
        createdAt: customMenus[menuIndex].createdAt
      };
    }
  } else {
    customMenus.push({
      id: Date.now(),
      name: menuName,
      items: items,
      createdAt: new Date().toISOString()
    });
  }
  
  alert(`Menu "${menuName}" saved successfully!`);
  showMenuList();
}

function renderMenuList() {
  menusContainer.innerHTML = '';
  
  if (customMenus.length === 0) {
    menusContainer.innerHTML = '<p class="empty-state">No menus created yet. Click "Create New Menu" to get started!</p>';
    return;
  }
  
  customMenus.forEach(menu => {
    const menuCard = document.createElement('div');
    menuCard.className = 'menu-card';
    
    menuCard.innerHTML = `
      <div class="menu-card-header">
        <h3>${menu.name}</h3>
        <div class="menu-card-actions">
          <button class="edit-menu-btn action-btn" data-menu-id="${menu.id}">Edit</button>
          <button class="delete-menu-btn action-btn" data-menu-id="${menu.id}">Delete</button>
        </div>
      </div>
      <p class="menu-card-info">${menu.items.length} item(s)</p>
      <table>
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Cuisine</th>
            <th>Price</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          ${menu.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.cuisine}</td>
              <td>${item.price}</td>
              <td>${item.availability}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    menusContainer.appendChild(menuCard);
  });
  
  document.querySelectorAll('.edit-menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const menuId = parseInt(e.target.dataset.menuId);
      editMenu(menuId);
    });
  });
  
  document.querySelectorAll('.delete-menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const menuId = parseInt(e.target.dataset.menuId);
      const menu = customMenus.find(m => m.id === menuId);
      if (menu && confirm(`Are you sure you want to delete the menu "${menu.name}"?`)) {
        customMenus = customMenus.filter(m => m.id !== menuId);
        renderMenuList();
      }
    });
  });
}

function editMenu(menuId) {
  const menu = customMenus.find(m => m.id === menuId);
  if (!menu) return;
  
  currentEditingMenuId = menuId;
  menuEditorTitle.textContent = `Edit Menu: ${menu.name}`;
  menuNameInput.value = menu.name;
  menuItemsContainer.innerHTML = '';
  
  menu.items.forEach(item => {
    const itemRow = document.createElement('tr');
    itemRow.className = 'menu-item-row';
    
    itemRow.innerHTML = `
      <td><input type="text" class="item-name" value="${item.name}"></td>
      <td><input type="text" class="item-cuisine" value="${item.cuisine}"></td>
      <td><input type="text" class="item-price" value="${item.price}"></td>
      <td>
        <select class="item-availability">
          <option value="Available" ${item.availability === 'Available' ? 'selected' : ''}>Available</option>
          <option value="Unavailable" ${item.availability === 'Unavailable' ? 'selected' : ''}>Unavailable</option>
        </select>
      </td>
      <td>
        <button class="remove-item-btn action-btn">Remove</button>
      </td>
    `;
    
    menuItemsContainer.appendChild(itemRow);
    itemRow.querySelector('.remove-item-btn').addEventListener('click', () => itemRow.remove());
  });
  
  showCreateMenu();
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    const topBarButtons = document.querySelectorAll('.top-bar button');
    const editButtons = document.querySelectorAll('.edit');
    const deleteButtons = document.querySelectorAll('.delete');
    const tableRows = document.querySelectorAll('tbody tr');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.style.backgroundColor = 'transparent');
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            item.style.borderRadius = '5px';
        });
    });

    topBarButtons.forEach(button => {
        button.addEventListener('click', function() {
            topBarButtons.forEach(btn => {
                btn.style.backgroundColor = '';
            });
            button.style.backgroundColor = '#5a7a8a';
        });
    });

    editButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            const isEditing = button.textContent === 'Save';
            
            if (isEditing) {
                const cells = row.querySelectorAll('td');
                
                cells[0].contentEditable = false;
                cells[1].contentEditable = false;
                cells[2].contentEditable = false;
                
                cells[0].style.backgroundColor = '';
                cells[1].style.backgroundColor = '';
                cells[2].style.backgroundColor = '';
                
                button.textContent = 'Edit';
                button.style.background = 'linear-gradient(135deg, #59a96a, #4a8c5a)';
                
                const availabilityCell = cells[3];
                const toggleButton = availabilityCell.querySelector('.toggle-availability');
                const currentAvailability = toggleButton.textContent.trim();
                
                availabilityCell.innerHTML = `<span class="availability">${currentAvailability}</span>`;
                
                if (currentAvailability === 'Unavailable') {
                    availabilityCell.querySelector('.availability').style.color = '#b6174b';
                    availabilityCell.querySelector('.availability').style.fontWeight = '600';
                } else {
                    availabilityCell.querySelector('.availability').style.color = '#59a96a';
                    availabilityCell.querySelector('.availability').style.fontWeight = '600';
                }
            } else {
                const cells = row.querySelectorAll('td');
                
                cells[0].contentEditable = true;
                cells[1].contentEditable = true;
                cells[2].contentEditable = true;
                
                cells[0].style.backgroundColor = '#fff9e6';
                cells[1].style.backgroundColor = '#fff9e6';
                cells[2].style.backgroundColor = '#fff9e6';
                
                cells[0].focus();
                
                button.textContent = 'Save';
                button.style.background = 'linear-gradient(135deg, #69a2b0, #52ad9c)';
                
                const availabilityCell = cells[3];
                const currentAvailability = availabilityCell.textContent.trim();
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'toggle-availability';
                toggleButton.textContent = currentAvailability;
                toggleButton.style.padding = '6px 12px';
                toggleButton.style.borderRadius = '5px';
                toggleButton.style.border = 'none';
                toggleButton.style.color = 'white';
                toggleButton.style.fontStyle = 'italic';
                toggleButton.style.fontWeight = '600';
                toggleButton.style.cursor = 'pointer';
                toggleButton.style.transition = 'all 0.3s';
                
                if (currentAvailability === 'Available') {
                    toggleButton.style.background = 'linear-gradient(135deg, #59a96a, #4a8c5a)';
                } else {
                    toggleButton.style.background = 'linear-gradient(135deg, #b6174b, #c62828)';
                }
                
                toggleButton.addEventListener('click', function() {
                    if (toggleButton.textContent === 'Available') {
                        toggleButton.textContent = 'Unavailable';
                        toggleButton.style.background = 'linear-gradient(135deg, #b6174b, #c62828)';
                    } else {
                        toggleButton.textContent = 'Available';
                        toggleButton.style.background = 'linear-gradient(135deg, #59a96a, #4a8c5a)';
                    }
                });
                
                availabilityCell.innerHTML = '';
                availabilityCell.appendChild(toggleButton);
            }
        });
    });

    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            const foodItem = row.querySelectorAll('td')[0].textContent;
            
            const confirmDelete = confirm(`Are you sure you want to delete "${foodItem}" from the menu?`);
            
            if (confirmDelete) {
                row.style.transition = 'opacity 0.3s, transform 0.3s';
                row.style.opacity = '0';
                row.style.transform = 'translateX(-100%)';
                
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
    });

    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (!e.target.classList.contains('action-btn')) {
                tableRows.forEach(r => r.style.backgroundColor = '');
                row.style.backgroundColor = '#e8f5e9';
            }
        });
    });

    const availabilityCells = document.querySelectorAll('.availability');
    availabilityCells.forEach(cell => {
        if (cell.textContent.trim() === 'Unavailable') {
            cell.style.color = '#b6174b';
            cell.style.fontWeight = '600';
        } else {
            cell.style.color = '#59a96a';
            cell.style.fontWeight = '600';
        }
    });
});