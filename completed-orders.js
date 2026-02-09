// wait for the page to fully load before running this code
document.addEventListener('DOMContentLoaded', function() {
  // grab all sidebar items and top bar buttons
  const sidebarItems = document.querySelectorAll('.sidebar ul li');
  const topBarButtons = document.querySelectorAll('.top-bar button');
  
  // map sidebar item names to their page files
  const sidebarPages = {
    'My Store': 'vendor-dashboard.html',
    'Menu': 'vendor-menu.html',
    'Orders': 'order-requests.html',
    'Rental Agreement': 'current-rentalagreement.html'
  };
  
  // map top bar button names to their page files
  const topBarPages = {
    'Order Requests': 'order-requests.html',
    'Current Requests': 'current-orders.html',
    'Orders Completed': 'completed-orders.html'
  };
  
  // set up click handlers for sidebar navigation
  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      if (sidebarPages[pageName]) {
        window.location.href = sidebarPages[pageName];
      }
    });
  });
  
  // set up click handlers for top bar navigation
  topBarButtons.forEach(button => {
    button.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      if (topBarPages[pageName]) {
        window.location.href = topBarPages[pageName];
      }
    });
  });
});