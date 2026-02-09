
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



document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the Order ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        console.error("No Order ID found in URL");
        return;
    }

    // 2. Update the Order ID on screen immediately
    document.getElementById('displayOrderId').innerText = `#${orderId}`;

    try {
        // 3. Fetch the specific order details from Firestore
        // We query the 'orders' collection where the field 'orderID' matches our URL ID
        const querySnapshot = await db.collection("orders")
                                      .where("orderID", "==", orderId)
                                      .limit(1)
                                      .get();

        if (!querySnapshot.empty) {
            const orderData = querySnapshot.docs[0].data();
            
            // 4. Update the UI with data from the database
            const totalElement = document.getElementById('displayTotal');
            if (totalElement) {
                totalElement.innerText = orderData.total; 
            }
            
            console.log("Successfully retrieved order data:", orderData);
        } else {
            console.warn("Order not found in database yet. It might still be syncing.");
        }
    } catch (error) {
        console.error("Error fetching order from database:", error);
    }
});