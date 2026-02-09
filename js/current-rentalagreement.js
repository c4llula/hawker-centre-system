// grab sidebar and top bar elements
const sidebarItems = document.querySelectorAll('.sidebar ul li');
const topBarButtons = document.querySelectorAll('.top-bar button');

// sidebar page mappings
const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'vendor-orders.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

// top bar page mappings
const topBarPages = {
  'Rental Agreement': 'current-rentalagreement.html',
  'Renew Rental': 'renew-rentalagreement.html',
  'Rental History': 'rentalagreement-history.html'
};

// sidebar navigation
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (sidebarPages[pageName]) {
      window.location.href = sidebarPages[pageName];
    }
  });
});

// top bar navigation
topBarButtons.forEach(button => {
  button.addEventListener('click', function() {
    const pageName = this.textContent.trim();
    if (topBarPages[pageName]) {
      window.location.href = topBarPages[pageName];
    }
  });
});

// grab all the table rows
const tableRows = document.querySelectorAll('tbody tr');
// when someone clicks a row, highlight it based on status
tableRows.forEach(row => {
  row.addEventListener('click', function() {
    // clear background color from all rows first
    tableRows.forEach(r => r.style.backgroundColor = '');
    // find the status badge in this row
    const status = this.querySelector('.status');
    // if status is active, make row green, otherwise make it pink
    if (status.classList.contains('active')) {
      this.style.backgroundColor = '#e8f5e9';
    } else {
      this.style.backgroundColor = '#ffe6ee';
    }
  });
});