window.addEventListener('load', function() {
  console.log('DOM fully loaded');
  
  // Check if Firebase is initialized
  if (!window.db) {
    console.error('❌ Firebase not initialized');
    const tableBody = document.querySelector('tbody');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: #d32f2f;">
            Firebase not initialized. Please refresh the page.
          </td>
        </tr>
      `;
    }
    return;
  }
  
  console.log('✅ Firebase is ready');
  loadCompletedOrders();
  
  // Setup navigation AFTER DOM is loaded
  setupNavigation();
});

// ===== SETUP NAVIGATION =====
function setupNavigation() {
  console.log('Setting up navigation...');
  
  // ===== SIDEBAR NAVIGATION =====
  const sidebarItems = document.querySelectorAll('.sidebar ul li');
  console.log('Found sidebar items:', sidebarItems.length);
  
  const sidebarPages = {
    'My Store': 'vendor-dashboard.html',
    'Menu': 'vendor-menu.html',
    'Orders': 'order-requests.html',
    'Rental Agreement': 'current-rentalagreement.html'
  };

  sidebarItems.forEach((item, index) => {
    console.log(`Sidebar item ${index}: ${item.textContent}`);
    item.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      console.log(`Sidebar clicked: ${pageName}`);
      if (sidebarPages[pageName]) {
        console.log(`Redirecting to: ${sidebarPages[pageName]}`);
        window.location.href = sidebarPages[pageName];
      } else {
        console.log(`No page mapping found for: ${pageName}`);
      }
    });
    
    // Add cursor pointer for visual feedback
    item.style.cursor = 'pointer';
  });

  // ===== TOP BAR BUTTONS =====
  const topBarButtons = document.querySelectorAll('.top-bar button');
  console.log('Found top bar buttons:', topBarButtons.length);
  
  const topBarPages = {
    'Order Requests': 'order-requests.html',
    'Current Orders': 'current-orders.html',
    'Completed Orders': 'completed-orders.html'
  };

  topBarButtons.forEach((button, index) => {
    const buttonText = button.textContent.trim();
    console.log(`Top bar button ${index}: "${buttonText}"`);
    
    button.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      console.log(`Top bar button clicked: "${pageName}"`);
      
      if (topBarPages[pageName]) {
        console.log(`Redirecting to: ${topBarPages[pageName]}`);
        window.location.href = topBarPages[pageName];
      } else {
        console.log(`No page mapping found for: "${pageName}"`);
        console.log('Available mappings:', Object.keys(topBarPages));
      }
    });
    
    // Add visual feedback on hover
    button.style.cursor = 'pointer';
  });
  
  console.log('Navigation setup complete');
}

// ===== LOAD COMPLETED ORDERS FROM DATABASE =====
async function loadCompletedOrders() {
  const tableBody = document.querySelector('tbody');
  
  if (!tableBody) {
    console.error('Table body not found');
    return;
  }
  
  try {
    if (!window.db) {
      console.error('Database not initialized');
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: #666;">
            Database not initialized
          </td>
        </tr>
      `;
      return;
    }

    // Import Firestore functions for v9
    const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js");

    // Query orders where stallLocation matches and status is "Prepared" or "Declined"
    const q = query(
      collection(window.db, 'orders'),
      where('stallLocation', '==', window.VENDOR_NAME),
      where('status', 'in', ['Prepared', 'Declined'])
    );

    const ordersSnapshot = await getDocs(q);

    if (ordersSnapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: #666;">
            No completed orders found
          </td>
        </tr>
      `;
      console.log('⚠️ No completed orders found');
      return;
    }

    // Convert to array and sort by orderDate
    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort by orderDate descending (newest first)
    orders.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return dateB - dateA;
    });

    // Build table rows
    let html = '';
    orders.forEach(order => {
      // Format items and quantities from the items array
      const itemsHtml = order.items && order.items.length > 0 
        ? order.items.map(item => item.name || 'Unknown Item').join('<br>')
        : 'N/A';
      
      const quantityHtml = order.items && order.items.length > 0
        ? order.items.map(item => item.quantity || '0').join('<br>')
        : 'N/A';
      
      // Extract date and time from orderDate
      const orderDateTime = new Date(order.orderDate);
      const formattedDate = formatDate(orderDateTime);
      const formattedTime = formatTime(orderDateTime);
      
      // Get customer type
      const customerType = order.customerType || 'Guest';
      
      // Determine payment method
      const payment = order.paymentMethod || 'Not specified';
      
      // Calculate total - handle both string and number formats
      let total = 0;
      if (order.total) {
        if (typeof order.total === 'string') {
          total = parseFloat(order.total.replace('S$', '').replace('$', '').trim());
        } else {
          total = parseFloat(order.total);
        }
      }
      
      // Handle NaN total
      if (isNaN(total)) {
        total = 0;
      }
      
      // Determine if order was cancelled/declined
      const isCancelled = order.status === 'Declined';
      const rowClass = isCancelled ? 'cancelled-order' : '';
      const statusClass = isCancelled ? 'cancelled' : 'completed';
      const statusText = isCancelled ? 'Cancelled' : 'Completed';
      
      html += `
        <tr class="${rowClass}">
          <td class="${statusClass}">${statusText}</td>
          <td>${order.orderID || 'N/A'}</td>
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
          <td>${customerType}</td>
          <td>${itemsHtml}</td>
          <td>${quantityHtml}</td>
          <td>$${total.toFixed(2)}</td>
          <td>${payment}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    console.log(`✅ ${orders.length} completed orders loaded`);

  } catch (error) {
    console.error('Error loading completed orders:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: #d32f2f;">
          Error loading orders: ${error.message}
        </td>
      </tr>
    `;
  }
}

// ===== FORMAT DATE =====
function formatDate(date) {
  if (!date || isNaN(date.getTime())) return 'N/A';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// ===== FORMAT TIME =====
function formatTime(date) {
  if (!date || isNaN(date.getTime())) return 'N/A';
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

console.log('✅ Completed orders page script loaded');