// vendor-menu.js - WORKING WITH FIREBASE
document.addEventListener('DOMContentLoaded', function() {
  console.log('Vendor menu page loading...');
  
  // ===== FIREBASE CHECK =====
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded!');
    showError('Firebase not loaded. Make sure Firebase scripts are included.');
    return;
  }
  
  let db;
  try {
    db = firebase.firestore();
    console.log('✅ Firestore connected');
  } catch (error) {
    console.error('Firestore error:', error);
    showError('Database connection failed. Please refresh.');
    return;
  }
  
  // ===== DOM ELEMENTS =====
  const menuListView = document.getElementById('menu-list-view');
  const createMenuView = document.getElementById('create-menu-view');
  const addMenuBtn = document.getElementById('addmenu');
  const menuListBtn = document.getElementById('menulist');
  const backToListBtn = document.getElementById('back-to-list');
  const menusContainer = document.getElementById('menus-container');
  const menuNameInput = document.getElementById('menu-name-input');
  const addItemBtn = document.getElementById('add-item-btn');
  const saveMenuBtn = document.getElementById('save-menu-btn');
  const cancelMenuBtn = document.getElementById('cancel-menu-btn');
  const menuItemsContainer = document.getElementById('menu-items-container');
  
  // ===== VARIABLES =====
  const VENDOR_NAME = "Tian Tian Chicken Rice";
  let vendorDocId = null;
  let vendorData = null;
  
  // ===== INITIAL SETUP =====
  if (menuListView) menuListView.style.display = 'block';
  if (createMenuView) createMenuView.style.display = 'none';
  
  // Hide menu name section (we're just adding food items)
  const menuNameSection = document.querySelector('.menu-name-section');
  if (menuNameSection) menuNameSection.style.display = 'none';
  
  // Change page title
  const pageTitle = document.querySelector('#menu-list-view h2');
  if (pageTitle) {
    pageTitle.textContent = `${VENDOR_NAME} - Main Menu`;
  }
  
  // ===== LOAD DATA FROM FIREBASE =====
  loadVendorData();
  
  // ===== EVENT LISTENERS =====
  // Sidebar navigation
  document.querySelectorAll('.sidebar ul li').forEach(item => {
    item.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      const pages = {
        'My Store': 'vendor-dashboard.html',
        'Menu': 'vendor-menu.html',
        'Orders': 'order-requests.html',
        'Rental Agreement': 'current-rentalagreement.html'
      };
      if (pages[pageName]) {
        window.location.href = pages[pageName];
      }
    });
  });
  
  // Add Menu button → Redirect to add-food-item.html
  if (addMenuBtn) {
    addMenuBtn.addEventListener('click', function() {
      console.log('Add Menu clicked - going to add-food-item.html');
      
      if (!vendorDocId) {
        alert('Vendor not loaded yet. Please wait.');
        return;
      }
      
      // Get current food items from vendor data
      const currentFoodItems = vendorData.menuItems || [];
      
      // Prepare data for add-food-item page
      const foodData = {
        vendorDocId: vendorDocId,
        vendorName: VENDOR_NAME,
        currentFoodItems: currentFoodItems
      };
      
      // Save to sessionStorage for the add-food-item page
      sessionStorage.setItem('tempFoodData', JSON.stringify(foodData));
      
      // Redirect to add food item page
      window.location.href = 'add-food-item.html';
    });
  }
  
  // Menu List button → Show food items list
  if (menuListBtn) {
    menuListBtn.addEventListener('click', function() {
      console.log('Menu List clicked');
      if (menuListView) menuListView.style.display = 'block';
      if (createMenuView) createMenuView.style.display = 'none';
      loadVendorData(); // Reload data
    });
  }
  
  // Back to List button
  if (backToListBtn) {
    backToListBtn.addEventListener('click', function() {
      if (menuListView) menuListView.style.display = 'block';
      if (createMenuView) createMenuView.style.display = 'none';
      loadVendorData(); // Reload data
    });
  }
  
  // Cancel button
  if (cancelMenuBtn) {
    cancelMenuBtn.addEventListener('click', function() {
      if (menuListView) menuListView.style.display = 'block';
      if (createMenuView) createMenuView.style.display = 'none';
      loadVendorData(); // Reload data
    });
  }
  
  // Add Item button (in edit view) → Redirect to add-food-item.html
  if (addItemBtn) {
    addItemBtn.addEventListener('click', function() {
      console.log('Add Item clicked - going to add-food-item.html');
      
      if (!vendorDocId) {
        alert('Vendor not loaded yet. Please wait.');
        return;
      }
      
      // Get current food items (from Menu subcollection)
      const currentFoodItems = vendorData.menuItems || [];
      
      // Prepare data for add-food-item page
      const foodData = {
        vendorDocId: vendorDocId,
        vendorName: VENDOR_NAME,
        currentFoodItems: currentFoodItems
      };
      
      // Save to sessionStorage for the add-food-item page
      sessionStorage.setItem('tempFoodData', JSON.stringify(foodData));
      
      // Redirect to add food item page
      window.location.href = 'add-food-item.html';
    });
  }
  
  // Save Menu button (for editing existing items - optional feature)
  if (saveMenuBtn) {
    saveMenuBtn.addEventListener('click', async function() {
      console.log('Save Menu clicked');
      
      if (!vendorDocId) {
        alert('Vendor not found. Please reload the page.');
        return;
      }
      
      // This is optional - you can remove if you don't need editing
      alert('Save button clicked. For now, use "Add Menu" to add new items.');
    });
  }
  
  // ===== FUNCTIONS =====
  function showError(message) {
    if (!menusContainer) return;
    
    const color = '#b6174b';
    menusContainer.innerHTML = `
      <div class="menu-card">
        <div class="menu-card-body">
          <p style="color: ${color}; text-align: center; font-size: 16px;">
            ${message}
          </p>
        </div>
      </div>
    `;
  }
  
  function showLoading() {
    if (!menusContainer) return;
    
    menusContainer.innerHTML = `
      <div class="menu-card">
        <div class="menu-card-body">
          <p style="color: #666; text-align: center; font-size: 16px;">
            Loading ${VENDOR_NAME}...
          </p>
        </div>
      </div>
    `;
  }
  
  async function loadVendorData() {
    if (!menusContainer || !db) return;
    
    showLoading();
    
    try {
      console.log('Loading vendor data from Firebase...');
      
      // Get the document from 'vendors' collection
      const vendorDocRef = db.collection('vendors').doc('Tian Tian Chicken Rice');
      const vendorDoc = await vendorDocRef.get();
      
      if (vendorDoc.exists) {
        vendorDocId = vendorDoc.id;
        vendorData = vendorDoc.data();
        console.log('✅ Vendor document loaded:', vendorData);
        
        // Now fetch the Menu subcollection
        try {
          const menuSnapshot = await vendorDocRef.collection('Menu').get();
          
          if (!menuSnapshot.empty) {
            console.log('✅ Found Menu subcollection with', menuSnapshot.size, 'items');
            
            // Extract items from Menu subcollection
            const menuItems = [];
            menuSnapshot.forEach(doc => {
              const itemData = doc.data();
              menuItems.push({
                id: doc.id,
                name: itemData.name || itemData.Name || doc.id,
                price: itemData.price || itemData.Price || 0,
                description: itemData.description || itemData.Description || '',
                cuisine: itemData.cuisine || itemData.Cuisine || 'Chinese',
                availability: itemData.availability !== false, // Default to true
                ...itemData
              });
            });
            
            // Sort alphabetically by name
            menuItems.sort((a, b) => a.name.localeCompare(b.name));
            
            // Add to vendorData
            vendorData.menuItems = menuItems;
            console.log('✅ Menu items loaded:', menuItems);
          } else {
            console.log('⚠️ No Menu subcollection found');
            vendorData.menuItems = [];
          }
        } catch (subError) {
          console.error('Error loading Menu subcollection:', subError);
          vendorData.menuItems = [];
        }
        
        displayVendorData(vendorData);
        
      } else {
        showError(`${VENDOR_NAME} not found in vendors collection.`);
        console.log('❌ Vendor not found');
      }
      
    } catch (error) {
      console.error('Error loading vendor:', error);
      showError('Error loading vendor data: ' + error.message);
    }
  }
  
  function displayVendorData(vendorData) {
    if (!menusContainer) return;
    
    const foodItems = vendorData.menuItems || [];
    
    // Display vendor info and food items
    let html = `
      <div class="menu-card">
        <div class="menu-card-header">
          <h3>${VENDOR_NAME}</h3>
          <div class="menu-card-actions">
            <button id="add-more-items-btn" class="btn-edit">+ Add More Items</button>
          </div>
        </div>
        <div class="menu-card-body">
          <div style="display: flex; gap: 30px; margin-bottom: 20px; flex-wrap: wrap;">
            <div>
              <p><strong>Cuisine:</strong> ${vendorData.Cusines || vendorData.Cuisines || vendorData.cuisine || 'Chinese'}</p>
              <p><strong>Rating:</strong> ${vendorData.Rating || vendorData.rating || 'Not rated'}</p>
              <p><strong>Vegetarian:</strong> ${vendorData.Veg === true ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p><strong>Waiting Time:</strong> ${vendorData['Waiting Time'] || vendorData.waitingTime || 'Not specified'} minutes</p>
              <p><strong>Total Items:</strong> ${foodItems.length}</p>
            </div>
          </div>
    `;
    
    if (foodItems.length > 0) {
      html += `
        <div style="margin-top: 20px;">
          <h4 style="color: #305652; margin-bottom: 15px;">🍽️ Menu Items (${foodItems.length})</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
            ${foodItems.map(item => `
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #f9f9f9;">
                <h5 style="color: #305652; margin: 0 0 8px 0;">${item.name}</h5>
                <p style="margin: 5px 0; font-size: 14px; color: #666;">
                  <strong>Price:</strong> $${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </p>
                ${item.description ? `<p style="margin: 5px 0; font-size: 14px; color: #666;">${item.description}</p>` : ''}
                <p style="margin: 5px 0; font-size: 13px; color: #999;">
                  <strong>Available:</strong> ${item.availability ? '✓ Yes' : '✗ No'}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      html += `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p style="font-size: 18px; margin-bottom: 10px;">📭 No food items yet</p>
          <p>Click "Add Menu" to start adding food items to this stall.</p>
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
    
    menusContainer.innerHTML = html;
    
    // Add "Add More Items" button listener
    setTimeout(() => {
      const addMoreBtn = document.getElementById('add-more-items-btn');
      if (addMoreBtn) {
        addMoreBtn.addEventListener('click', function() {
          const currentFoodItems = vendorData.menuItems || [];
          
          const foodData = {
            vendorDocId: vendorDocId,
            vendorName: VENDOR_NAME,
            currentFoodItems: currentFoodItems,
            hasMenuSubcollection: true
          };
          
          sessionStorage.setItem('tempFoodData', JSON.stringify(foodData));
          window.location.href = 'add-food-item.html';
        });
      }
    }, 100);
  }
  
  console.log('✅ Vendor menu page ready');
});