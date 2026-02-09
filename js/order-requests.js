let db;
const VENDOR_NAME = "Hawker Centre #B2-15";

// ================= PAGE LOAD =================
window.addEventListener('load', function () {
  setTimeout(() => {
    try {
      db = firebase.firestore();
      console.log('✅ Firestore connected');

      loadOrderRequests();
      initSidebarNav();
      initTopBarNav();

    } catch (error) {
      console.error('❌ Error initializing Firebase:', error);
    }
  }, 500);
});

// ================= LOAD ORDER REQUESTS =================
async function loadOrderRequests() {
  const tableBody = document.querySelector('tbody');

  try {
    if (!db) return console.error('Database not initialized');

    const ordersSnapshot = await db.collection('orders')
      .where('stallLocation', '==', VENDOR_NAME)
      .where('status', '==', 'Pending')
      .get();

    if (ordersSnapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: #666;">
            No pending order requests
          </td>
        </tr>
      `;
      return;
    }

    const orders = [];
    ordersSnapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    let html = '';
    orders.forEach(order => {
      const itemsHtml = order.items.map(i => i.name).join('<br>');
      const quantityHtml = order.items.map(i => i.quantity).join('<br>');
      const orderDateTime = new Date(order.orderDate);

      html += `
        <tr data-order-id="${order.id}">
          <td>
            <button class="button accept" data-order-id="${order.id}">Accept</button>
            <button class="button decline" data-order-id="${order.id}">Decline</button>
          </td>
          <td>${order.orderID}</td>
          <td>${formatDate(orderDateTime)}</td>
          <td>${formatTime(orderDateTime)}</td>
          <td>${order.customerType || 'Guest'}</td>
          <td>${itemsHtml}</td>
          <td>${quantityHtml}</td>
          <td>$${parseFloat(order.total.replace('S$', '')).toFixed(2)}</td>
          <td>${order.paymentMethod || 'Not specified'}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    attachButtonListeners();

  } catch (error) {
    console.error('Error loading order requests:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="color:red;text-align:center;">
          Error loading orders: ${error.message}
        </td>
      </tr>
    `;
  }
}

// ================= BUTTON HANDLERS =================
function attachButtonListeners() {
  document.querySelectorAll('.accept').forEach(btn => {
    btn.onclick = async function () {
      if (!confirm('Accept this order?')) return;
      const orderId = this.dataset.orderId;
      await db.collection('orders').doc(orderId).update({ status: 'Preparing' });
      loadOrderRequests();
    };
  });

  document.querySelectorAll('.decline').forEach(btn => {
    btn.onclick = async function () {
      if (!confirm('Decline this order?')) return;
      const orderId = this.dataset.orderId;
      await db.collection('orders').doc(orderId).update({ status: 'Declined' });
      loadOrderRequests();
    };
  });
}

// ================= NAVIGATION =================
function initSidebarNav() {
  const sidebarPages = {
    'My Store': 'vendor-dashboard.html',
    'Menu': 'vendor-menu.html',
    'Orders': 'order-requests.html',
    'Rental Agreement': 'current-rentalagreement.html'
  };

  document.querySelectorAll('.sidebar ul li').forEach(item => {
    item.style.cursor = 'pointer';
    item.onclick = () => {
      const page = sidebarPages[item.textContent.trim()];
      if (page) window.location.href = page;
    };
  });
}

function initTopBarNav() {
  const topBarPages = {
    'Order Requests': 'order-requests.html',
    'Current Requests': 'current-orders.html',
    'Orders Completed': 'completed-orders.html'
  };

  document.querySelectorAll('.top-bar button').forEach(button => {
    button.onclick = () => {
      const page = topBarPages[button.textContent.trim()];
      if (page) window.location.href = page;
    };
  });
}

// ================= HELPERS =================
function formatDate(date) {
  if (!date) return '';
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
}

function formatTime(date) {
  if (!date) return '';
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}
