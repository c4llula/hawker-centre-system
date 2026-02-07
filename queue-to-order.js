document.addEventListener('DOMContentLoaded', function() {
    const orderButton = document.querySelector('.order');
    
    orderButton.addEventListener('click', function() {
        alert('Order placed successfully');
    });
});