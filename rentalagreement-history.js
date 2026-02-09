// grab all the sidebar menu items
const sidebarItems = document.querySelectorAll('.sidebar ul li');
// grab all the top bar buttons
const topBarButtons = document.querySelectorAll('.top-bar button');

// this object connects sidebar menu names to their actual HTML files
const sidebarPages = {
  'My Store': 'vendor-dashboard.html',
  'Menu': 'vendor-menu.html',
  'Orders': 'vendor-orders.html',
  'Rental Agreement': 'current-rentalagreement.html'
};

// same thing but for the top bar buttons
const topBarPages = {
  'Rental Agreement': 'current-rentalagreement.html',
  'Renew Rental': 'renew-rentalagreement.html',
  'Rental History': 'rentalagreement-history.html'
};

// loop through each sidebar item and add click listeners
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    const pageName = this.textContent.trim(); // get the text of what was clicked
    if (sidebarPages[pageName]) { // check if we have a page for it
      window.location.href = sidebarPages[pageName]; // redirect to that page
    }
  });
});

// same thing for top bar buttons
topBarButtons.forEach(button => {
  button.addEventListener('click', function() {
    const pageName = this.textContent.trim(); // get button text
    if (topBarPages[pageName]) { // look it up in our object
      window.location.href = topBarPages[pageName]; // go to that page
    }
  });
});