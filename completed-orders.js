document.addEventListener('DOMContentLoaded', function() {
  const sidebarItems = document.querySelectorAll('.sidebar ul li');
  const topBarButtons = document.querySelectorAll('.top-bar button');
  
  const pages = {
    'My Store': 'my-store.html',
    'Menu': 'menu-list.html',
    'Orders': 'orders-completed.html',
    'Reset Password': 'reset-password.html',
    'Rental Agreement': 'rental-agreement.html',
    'Menu List': 'menu-list.html',
    'Order Requests': 'order-requests.html',
    'Current Requests': 'current-requests.html',
    'Orders Completed': 'orders-completed.html'
  };
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      if (pages[pageName]) {
        window.location.href = pages[pageName];
      }
    });
  });
  
  topBarButtons.forEach(button => {
    button.addEventListener('click', function() {
      const pageName = this.textContent.trim();
      if (pages[pageName]) {
        window.location.href = pages[pageName];
      }
    });
  });
});