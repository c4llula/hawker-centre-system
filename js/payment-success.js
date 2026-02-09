/**
 * 3. PLACE ORDER (DATABASE INTERACTION)
 * Pushes the order details to Firebase Firestore and redirects
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


function generateOrderID() {
    // Get the last 4 digits of the current time (milliseconds)
    const timestamp = Date.now().toString().slice(-4); 
    // Generate a random 3-character string
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `HG-${timestamp}-${randomStr}`;
}


// Add this to your payment-success-user page script
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (orderId) {
        // Assuming you have an element with id="displayOrderId" on that page
        const displayElement = document.getElementById('displayOrderId');
        if (displayElement) {
            displayElement.innerText = orderId;
        }
    }
});

