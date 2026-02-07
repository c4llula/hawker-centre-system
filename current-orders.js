const setPreparedButtons = document.querySelectorAll('.set-prepared');

setPreparedButtons.forEach(button => {
  button.addEventListener('click', function() {
    this.textContent = 'Prepared';
    this.classList.remove('set-prepared');
    this.classList.add('prepared');
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