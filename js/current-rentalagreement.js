const sidebarItems = document.querySelectorAll('.sidebar ul li');
const topBarButtons = document.querySelectorAll('.top-bar button');

const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'vendor-orders.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

const topBarPages = {
  'Rental Agreement': 'current-rentalagreement.html',
  'Renew Rental': 'renew-rentalagreement.html',
  'Rental History': 'rentalagreement-history.html'
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

// Table row highlighting
const tableRows = document.querySelectorAll('tbody tr');
tableRows.forEach(row => {
  row.addEventListener('click', function() {
    tableRows.forEach(r => r.style.backgroundColor = '');
    const status = this.querySelector('.status');
    if (status.classList.contains('active')) {
      this.style.backgroundColor = '#e8f5e9';
    } else {
      this.style.backgroundColor = '#ffe6ee';
    }
  });
});