document.addEventListener("DOMContentLoaded", function() {
  loadCart();
});

/**
 * Reads the flat cart object from localStorage and builds the list.
 */
function loadCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalAmountDisplay = document.getElementById("totalAmount");
  const cartData = localStorage.getItem("hawkersgoCart");
  
  // 1. Check if cart exists or is empty
  if (!cartData || cartData === "{}") {
    cartItemsContainer.innerHTML = '<li class="text-center p-4">Your cart is empty</li>';
    totalAmountDisplay.textContent = "S$0.00";
    return;
  }
  
  const items = JSON.parse(cartData);
  let html = "";
  let grandTotal = 0;
  
  // 2. Loop through the flat keys (the combined names)
  for (let combinedName in items) {
    const item = items[combinedName];
    
    // Convert "S$5.50" to a number for math
    const pricePerUnit = parseFloat(item.price.replace("S$", ""));
    const rowTotal = pricePerUnit * item.quantity;
    grandTotal += rowTotal;
    
    // 3. Create the HTML for each row
    // combinedName already includes the " + Extra Peanuts" from Menu.js
    html += `
      <li class="info-item d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div class="item-info">
          <span class="info-label d-block fw-bold">${combinedName}</span>
          <span class="info-value text-muted small">Stall: ${item.stall} | Qty: ${item.quantity}</span>
        </div>
        <span class="info-value fw-bold">S$${rowTotal.toFixed(2)}</span>
      </li>
    `;
  }
  
  // 4. Update the Page
  cartItemsContainer.innerHTML = html;
  totalAmountDisplay.textContent = "S$" + grandTotal.toFixed(2);
}

/**
 * Clears the cart and refreshes the display
 */
function clearCart() {
  if (confirm("Are you sure you want to remove all items from your cart?")) {
    localStorage.removeItem("hawkersgoCart");
    loadCart(); // Refresh the list
  }
}

/**
 * Places the order, shows a random number, and clears storage
 */
function placeOrder() {
  const cartData = localStorage.getItem("hawkersgoCart");
  
  if (!cartData || cartData === "{}") {
    alert("Your cart is empty! Add some food before checking out.");
    return;
  }
  
  // Generate a random 4-digit order number
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  
  // Display it on the page
  document.getElementById("orderNumber").textContent = "#" + orderNum;
  
  // Final confirmation alert
  alert("Order Confirmed!\nYour Order Number is: #" + orderNum + "\nPlease pay cash at the stall.");
  
  // Clear the cart after order is placed
  localStorage.removeItem("hawkersgoCart");
  
  // Optional: Redirect to Stalls page after 3 seconds
  setTimeout(() => {
    window.location.href = "Stalls.html";
  }, 3000);
}