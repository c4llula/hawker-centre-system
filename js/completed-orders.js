document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems = document.querySelectorAll('.sidebar ul li');
  const topBarButtons = document.querySelectorAll('.top-bar button');
  
  const sidebarPages = {
    'My Store': 'vendor-dashboard.html',
    'Menu': 'vendor-menu.html',
    'Orders': 'order-requests.html',
    'Rental Agreement': 'current-rentalagreement.html'
  };
  
  const topBarPages = {
    'Order Requests': 'order-requests.html',
    'Current Requests': 'current-orders.html',
    'Orders Completed': 'completed-orders.html'
  };
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      if (sidebarPages[pageName]) {
        window.location.href = sidebarPages[pageName];
      }
    });
  });
  
  topBarButtons.forEach(button => {
    button.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      if (topBarPages[pageName]) {
        window.location.href = topBarPages[pageName];
      }
    });
  });
});