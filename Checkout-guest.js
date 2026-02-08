document.addEventListener("DOMContentLoaded", function() {
  loadCart();
});

function loadCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalAmountDisplay = document.getElementById("totalAmount");
  const cartData = localStorage.getItem("hawkersgoCart");
  
  //  check if cart exists or is empty
  if (!cartData || cartData === "{}") {
    cartItemsContainer.innerHTML = '<li class="text-center p-4">Your cart is empty</li>';
    totalAmountDisplay.textContent = "S$0.00";
    return;
  }
  
  const items = JSON.parse(cartData);
  let html = "";
  let grandTotal = 0;
  
  console.log("Cart items:", items); // Debug
  
  // loop through cart items
  for (let combinedName in items) {
    const item = items[combinedName];
    
    console.log("Processing item:", combinedName, item); // Debug
    
    let pricePerUnit;
    if (typeof item.price === 'string') {
      pricePerUnit = parseFloat(item.price.replace("S$", ""));
    } else {
      pricePerUnit = item.price;
    }
    
    // get quantity
    const quantity = item.qty || item.quantity || 1;
    const rowTotal = pricePerUnit * quantity;
    grandTotal += rowTotal;
    
    // create the HTML for each row
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
  
  // updates the page
  cartItemsContainer.innerHTML = html;
  totalAmountDisplay.textContent = "S$" + grandTotal.toFixed(2);
}

function clearCart() {
  if (confirm("Are you sure you want to remove all items from your cart?")) {
    localStorage.removeItem("hawkersgoCart");
    loadCart(); // Refresh the list
  }
}

function placeOrder() {
  const cartData = localStorage.getItem("hawkersgoCart");
  
  if (!cartData || cartData === "{}") {
    alert("Your cart is empty! Add some food before checking out.");
    return;
  }

  // simulate a payment processing delay
  console.log("Processing payment...");

  // for demonstration: generate a random outcome
  const isSuccessful = Math.random() > 0.9; 

  if (isSuccessful) {
    window.location.href = 'payment-success-guest.html';
  } else {
    window.location.href = 'payment-failure-guest.html';
  }
  
  const orderNum = Math.floor(1000 + Math.random() * 9000);

  const orderNumberEl = document.getElementById("orderNumber");
  if (orderNumberEl) {
    orderNumberEl.textContent = "#" + orderNum;
  }
  
  alert("Order Confirmed!\nYour Order Number is: #" + orderNum);
  
  localStorage.removeItem("hawkersgoCart");
  
  setTimeout(() => {
    window.location.href = "Stalls-guest.html";
  }, 3000);
}

