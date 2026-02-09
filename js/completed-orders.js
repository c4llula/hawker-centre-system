let db;
const VENDOR_NAME = "Hawker Centre #B2-15";

window.addEventListener('load', function() {
  setTimeout(() => {
    try {
      db = firebase.firestore();
      console.log('✅ Firestore connected');
      loadCompletedOrders();
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
    }
  }, 500);
});

// ===== LOAD COMPLETED ORDERS FROM DATABASE =====
async function loadCompletedOrders() {
  const tableBody = document.querySelector('tbody');
  
  try {
    if (!db) {
      console.error('Database not initialized');
      return;
    }

    // Query orders where stallLocation matches and status is "Prepared" or "Declined"
    const ordersSnapshot = await db.collection('orders')
      .where('stallLocation', '==', VENDOR_NAME)
      .where('status', 'in', ['Prepared', 'Declined'])
      .get();

    if (ordersSnapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: #666;">
            No completed orders
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
      const itemsHtml = order.items.map(item => item.name).join('<br>');
      const quantityHtml = order.items.map(item => item.quantity).join('<br>');
      
      // Extract date and time from orderDate
      const orderDateTime = new Date(order.orderDate);
      const formattedDate = formatDate(orderDateTime);
      const formattedTime = formatTime(orderDateTime);
      
      // Get customer type
      const customerType = order.customerType || 'Guest';
      
      // Determine payment method
      const payment = order.paymentMethod || 'Not specified';
      
      // Determine if order was cancelled/declined
      const isCancelled = order.status === 'Declined';
      const rowClass = isCancelled ? 'cancelled-order' : '';
      const statusClass = isCancelled ? 'cancelled' : 'completed';
      const statusText = isCancelled ? 'Cancelled' : 'Completed';
      
      html += `
        <tr class="${rowClass}">
          <td class="${statusClass}">${statusText}</td>
          <td>${order.orderID}</td>
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
          <td>${customerType}</td>
          <td>${itemsHtml}</td>
          <td>${quantityHtml}</td>
          <td>$${parseFloat(order.total.replace('S$', '')).toFixed(2)}</td>
          <td>${payment}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    console.log('✅ Completed orders loaded successfully');

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
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// ===== FORMAT TIME =====
function formatTime(date) {
  if (!date) return '';
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

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
const topBarButtons = document.querySelectorAll('.top-bar button');
const topBarPages = {
  'Order Requests': 'order-requests.html',
  'Current Requests': 'current-orders.html',
  'Orders Completed': 'completed-orders.html'
};

topBarButtons.forEach(button => {
  button.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (topBarPages[pageName]) {
      window.location.href = topBarPages[pageName];
    }
  });
});

console.log('✅ Completed orders page ready');