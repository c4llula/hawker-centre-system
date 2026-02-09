// Initialize Firestore (Assuming 'db' is initialized in firebase-init.js)
// If 'db' isn't global, ensure firebase-init.js defines: window.db = firebase.firestore();
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsn3nzbTWFP0f2k7XTmFsRxdAjd0vhDKA",
  authDomain: "fed-assignment-33cc7.firebaseapp.com",
  databaseURL: "https://fed-assignment-33cc7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fed-assignment-33cc7",
  storageBucket: "fed-assignment-33cc7.firebasestorage.app",
  messagingSenderId: "6435796920",
  appId: "1:6435796920:web:5f521b0e023e8882a7014d"
};



firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

/**
 * 1. RENDERING THE CART
 * Pulls data from localStorage and builds the HTML list
 */
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    const cartContainer = document.getElementById('cartItems');
    const totalDisplay = document.getElementById('totalAmount');
    
    cartContainer.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<li class="info-item text-muted">Your cart is empty.</li>';
        totalDisplay.innerText = `S$0.00`;
        return;
    }

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement('li');
        li.className = 'info-item d-flex justify-content-between align-items-center mb-2';
        li.innerHTML = `
            <div>
                <span class="fw-bold">${item.name}</span> <br>
                <small class="text-muted">Qty: ${item.quantity} @ S$${item.price.toFixed(2)}</small>
            </div>
            <span class="info-value">S$${itemTotal.toFixed(2)}</span>
        `;
        cartContainer.appendChild(li);
    });

    totalDisplay.innerText = `S$${total.toFixed(2)}`;
}

/**
 * 2. GENERATE ORDER ID
 * Creates a unique string (e.g., HG-123456)
 */
function generateOrderID() {
    // Get the last 4 digits of the current time (milliseconds)
    const timestamp = Date.now().toString().slice(-4); 
    // Generate a random 3-character string
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `HG-${timestamp}-${randomStr}`;
}
/**
 * 3. PLACE ORDER (DATABASE INTERACTION)
 * Pushes the order details to Firebase Firestore
 */
async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
    
    if (cart.length === 0) {
        alert("Please add items to your cart before checking out.");
        return;
    }

    const orderId = generateOrderID();
    const totalAmount = document.getElementById('totalAmount').innerText;

    // Prepare the data for Firestore
    const orderData = {
        orderID: orderId,
        items: cart,
        total: totalAmount,
        orderDate: new Date().toLocaleString(),
        status: "Preparing", 
        stallLocation: "Hawker Centre #B2-15",
        customerType: "Registered User" 
    };

    try {
        const confirmBtn = document.querySelector('.confirm-btn');
        confirmBtn.disabled = true;
        confirmBtn.innerText = "Processing...";

        // 1. ADD TO FIREBASE: 'orders' collection
        await db.collection("orders").add(orderData);

        // 2. CLEAR THE CART: (Crucial so they don't pay twice for the same items)
        localStorage.removeItem('hawkerCart');

        // 3. REDIRECT: Go to the success page
        // We pass the Order ID in the URL so the success page can display it
        window.location.href = `payment-success-user.html?id=${orderId}`;

    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Transaction failed. Check console for details.");
        
        const confirmBtn = document.querySelector('.confirm-btn');
        confirmBtn.disabled = false;
        confirmBtn.innerText = "Confirm Order";
    }
}

/**
 * 4. CLEAR CART
 */
function clearCart() {
    if (confirm("Clear all items in your cart?")) {
        localStorage.removeItem('hawkerCart');
        renderCart();
        document.getElementById('orderNumber').innerText = "---";
    }
}