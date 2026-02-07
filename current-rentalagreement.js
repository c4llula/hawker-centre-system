const sidebarItems = document.querySelectorAll('.sidebar ul li');
sidebarItems.forEach(item => {
  item.addEventListener('click', function() {
    alert('Navigate to: ' + this.textContent);
  });
});

const topBarButtons = document.querySelectorAll('.top-bar button');
topBarButtons.forEach(button => {
  button.addEventListener('click', function() {
    alert('Navigate to: ' + this.textContent);
  });
});

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