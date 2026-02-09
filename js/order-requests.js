// grab all accept and decline buttons
const acceptButtons = document.querySelectorAll('.accept');
const declineButtons = document.querySelectorAll('.decline');

// when someone clicks accept, confirm then update the UI
acceptButtons.forEach(button => {
  button.addEventListener('click', function() {
    const row = this.closest('tr'); // find the table row this button is in
    const actionCell = this.closest('td'); // find the cell with the buttons
    
    // show confirmation popup
    if (confirm('Accept this order?')) {
      // replace the buttons with "Accepted" text
      actionCell.innerHTML = '<span style="color: #59a96a; font-weight: 600; font-style: italic;">Accepted</span>';
      // make the row green
      row.style.backgroundColor = '#e8f5e9';
    }
  });
});

// same thing but for decline
declineButtons.forEach(button => {
  button.addEventListener('click', function() {
    const row = this.closest('tr');
    const actionCell = this.closest('td');
    
    if (confirm('Decline this order?')) {
      // replace buttons with "Declined" text
      actionCell.innerHTML = '<span style="color: #b6174b; font-weight: 600; font-style: italic;">Declined</span>';
      // make the row pink/red
      row.style.backgroundColor = '#ffe6ee';
    }
  });
});

// sidebar and top bar navigation setup
const sidebarItems = document.querySelectorAll('.sidebar ul li');
const topBarButtons = document.querySelectorAll('.top-bar button');

const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'vendor-orders.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

const topBarPages = {
  'Order Requests': 'order-requests.html',
  'Current Requests': 'current-orders.html',
  'Orders Completed': 'completed-orders.html'
};

// handle sidebar navigation
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (sidebarPages[pageName]) {
      window.location.href = sidebarPages[pageName];
    }
  });
});

// handle top bar navigation
topBarButtons.forEach(button => {
  button.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (topBarPages[pageName]) {
      window.location.href = topBarPages[pageName];
    }
  });
});