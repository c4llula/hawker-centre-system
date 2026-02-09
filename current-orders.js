// grab all the "Set Prepared" buttons
const setPreparedButtons = document.querySelectorAll('.set-prepared');

// when someone clicks a "Set Prepared" button, change it to say "Prepared"
setPreparedButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.textContent = 'Prepared'; // change the text
    this.classList.remove('set-prepared'); // remove old styling
    this.classList.add('prepared'); // add new styling
  });
});

// grab sidebar and top bar navigation elements
const sidebarItems = document.querySelectorAll('.sidebar ul li');
const topBarButtons = document.querySelectorAll('.top-bar button');

// sidebar navigation mapping
const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'vendor-orders.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

// top bar navigation mapping
const topBarPages = {
  'Order Requests': 'order-requests.html',
  'Current Requests': 'current-orders.html',
  'Orders Completed': 'completed-orders.html'
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

// handle top bar clicks
topBarButtons.forEach(button => {
  button.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (topBarPages[pageName]) {
      window.location.href = topBarPages[pageName];
    }
  });
});