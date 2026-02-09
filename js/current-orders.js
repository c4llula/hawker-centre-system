let db;
const VENDOR_NAME = "Hawker Centre #B2-15";

window.addEventListener('load', function() {
  setTimeout(() => {
    try {
      db = firebase.firestore();
      console.log('✅ Firestore connected');
      loadCurrentOrders();
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
    }
  }, 500);
});

// ===== LOAD CURRENT ORDERS FROM DATABASE =====
async function loadCurrentOrders() {
  const tableBody = document.getElementById('orders-table-body');
  
  try {
    if (!db) {
      console.error('Database not initialized');
      return;
    }

    // Query orders where stallLocation matches and status is "Preparing"
    const ordersSnapshot = await db.collection('orders')
      .where('stallLocation', '==', VENDOR_NAME)
      .where('status', '==', 'Preparing')
      .get();

    if (ordersSnapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: #666;">
            No current orders
          </td>
        </tr>
      `;
      console.log('⚠️ No current orders found');
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
      
      html += `
        <tr data-order-id="${order.id}">
          <td>
            <button class="button complete" data-order-id="${order.id}">Complete</button>
          </td>
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
    console.log('✅ Current orders loaded successfully');

    // Add event listeners to buttons
    attachButtonListeners();

  } catch (error) {
    console.error('Error loading current orders:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: #d32f2f;">
          Error loading orders: ${error.message}
        </td>
      </tr>
    `;
  }
}

// ===== ATTACH BUTTON LISTENERS =====
function attachButtonListeners() {
  const completeButtons = document.querySelectorAll('.complete');

  // Handle Complete button clicks
  completeButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const orderId = this.getAttribute('data-order-id');
      const row = this.closest('tr');
      const actionCell = this.closest('td');
      
      if (!confirm('Mark this order as complete?')) {
        return;
      }

      try {
        // Update status to "Prepared" in database
        await db.collection('orders').doc(orderId).update({
          status: 'Prepared'
        });

        console.log(`✅ Order ${orderId} completed`);
        
        // Update UI
        actionCell.innerHTML = '<span style="color: #59a96a; font-weight: 600; font-style: italic;">Completed</span>';
        row.style.backgroundColor = '#e8f5e9';
        
        // Reload after a delay
        setTimeout(() => {
          loadCurrentOrders();
        }, 1500);
        
      } catch (error) {
        console.error('Error completing order:', error);
        alert('❌ Error completing order: ' + error.message);
      }
    });
  });
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
document.getElementById('order-requests-btn')?.addEventListener('click', () => {
  window.location.href = 'order-requests.html';
});

document.getElementById('current-orders-btn')?.addEventListener('click', () => {
  window.location.href = 'current-orders.html';
});

document.getElementById('completed-orders-btn')?.addEventListener('click', () => {
  window.location.href = 'completed-orders.html';
});

console.log('✅ Current orders page ready');