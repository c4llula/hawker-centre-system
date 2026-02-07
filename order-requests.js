const acceptButtons = document.querySelectorAll('.accept');
const declineButtons = document.querySelectorAll('.decline');

acceptButtons.forEach(button => {
  button.addEventListener('click', function() {
    const row = this.closest('tr');
    const actionCell = this.closest('td');
    
    if (confirm('Accept this order?')) {
      actionCell.innerHTML = '<span style="color: #59a96a; font-weight: 600; font-style: italic;">Accepted</span>';
      row.style.backgroundColor = '#e8f5e9';
    }
  });
});

declineButtons.forEach(button => {
  button.addEventListener('click', function() {
    const row = this.closest('tr');
    const actionCell = this.closest('td');
    
    if (confirm('Decline this order?')) {
      actionCell.innerHTML = '<span style="color: #b6174b; font-weight: 600; font-style: italic;">Declined</span>';
      row.style.backgroundColor = '#ffe6ee';
    }
  });
});

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