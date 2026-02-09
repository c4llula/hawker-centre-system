// Wait for page to load
document.addEventListener("DOMContentLoaded", function() {
  loadCart();
});

// Load cart from storage and show it
function loadCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalAmountDisplay = document.getElementById("totalAmount");
  const cartData = localStorage.getItem("hawkersgoCart");
  
  // Check if cart is empty
  if (!cartData || cartData === "{}") {
    cartItemsContainer.innerHTML = '<li class="text-center p-4">Your cart is empty</li>';
    totalAmountDisplay.textContent = "S$0.00";
    return;
  }
  
  const items = JSON.parse(cartData);
  let html = "";
  let grandTotal = 0;
  
  // Loop through each item in cart
  for (let combinedName in items) {
    const item = items[combinedName];
    
    // Get price as number
    let pricePerUnit;
    if (typeof item.price === 'string') {
      pricePerUnit = parseFloat(item.price.replace("S$", ""));
    } else {
      pricePerUnit = item.price;
    }
    
    // Get quantity
    const quantity = item.qty || item.quantity || 1;
    const rowTotal = pricePerUnit * quantity;
    grandTotal += rowTotal;
    
    // Create HTML for this item
    html += `
      <li class="info-item d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div class="item-info">
          <span class="info-label d-block fw-bold">${combinedName}</span>
          <span class="info-value text-muted small">Qty: ${quantity}</span>
        </div>
        <span class="info-value fw-bold">S$${rowTotal.toFixed(2)}</span>
      </li>
    `;
  }
  
  // Update page with cart items
  cartItemsContainer.innerHTML = html;
  totalAmountDisplay.textContent = "S$" + grandTotal.toFixed(2);
}

// Clear entire cart
function clearCart() {
  if (confirm("Are you sure you want to remove all items from your cart?")) {
    localStorage.removeItem("hawkersgoCart");
    loadCart();
  }
}

// Place order and checkout
function placeOrder() {
  const cartData = localStorage.getItem("hawkersgoCart");
  
  if (!cartData || cartData === "{}") {
    alert("Your cart is empty! Add some food before checking out.");
    return;
  }

  // Random payment success (90% chance)
  const isSuccessful = Math.random() > 0.1; 

  if (isSuccessful) {
    window.location.href = 'payment-success-user.html';
  } else {
    window.location.href = 'payment-failure-user.html';
  }
  
  // Generate order number
  const orderNum = Math.floor(1000 + Math.random() * 9000);

  // Show order number
  const orderNumberEl = document.getElementById("orderNumber");
  if (orderNumberEl) {
    orderNumberEl.textContent = "#" + orderNum;
  }
  
  alert("Order Confirmed!\nYour Order Number is: #" + orderNum);
  
  // Clear cart and redirect
  localStorage.removeItem("hawkersgoCart");
  
  setTimeout(() => {
    window.location.href = "Stalls-user.html";
  }, 3000);
}