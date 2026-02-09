/**
 * Using a self-executing function to ensure no variable names 
 * like 'firebaseConfig' clash with other files.
 */
(function() {
    console.log("=== main-login.js loaded ===");
    
    const myAppConfig = {
        apiKey: "AIzaSyBsn3nzbTWFP0f2k7XTmFsRxdAjd0vhDKA",
        authDomain: "fed-assignment-33cc7.firebaseapp.com",
        databaseURL: "https://fed-assignment-33cc7-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "fed-assignment-33cc7",
        storageBucket: "fed-assignment-33cc7.firebasestorage.app",
        messagingSenderId: "6435796920",
        appId: "1:6435796920:web:5f521b0e023e8882a7014d"
    };

    // Initialize Firebase safely
    if (!firebase.apps.length) {
        firebase.initializeApp(myAppConfig);
        console.log("Firebase initialized");
    } else {
        console.log("Firebase already initialized");
    }
    const auth = firebase.auth();
    const db = firebase.firestore();

    /**
     * PATH CALCULATOR
     * Adjust these paths based on where main-login.html actually is
     */
    function getRedirectPath(userType) {
        if (userType === 'vendor') return '/Pages/Vendor/vendor-menu.html';
        if (userType === 'customer') return '/Pages/Customer/User/home-page-user.html';
        if (userType === 'guest') return '/Pages/Customer/Guest/home-page-guest.html';
        return 'index.html';
    }

    function saveAndGo(userData, type) {
        console.log("=== saveAndGo called ===");
        console.log("User type:", type);
        console.log("User data:", userData);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', type);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        const target = getRedirectPath(type);
        console.log("Target URL:", target);
        console.log("Redirecting now...");
        window.location.href = target;
    }

    // Attach to the form
    document.addEventListener('DOMContentLoaded', () => {
        console.log("=== DOM Content Loaded ===");

        const loginForm = document.getElementById('loginForm');
        console.log("Login form found:", loginForm !== null);
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                console.log("=== Form submitted ===");
                e.preventDefault(); 
                
                const userVal = document.getElementById('username').value.trim();
                const passVal = document.getElementById('password').value;

                console.log("Username/Email:", userVal);
                console.log("Password entered:", passVal ? "Yes" : "No");

                // Basic validation
                if (!userVal || !passVal) {
                    alert("Please enter both username/email and password.");
                    return;
                }

                try {
                    let foundUser = null;
                    let userType = null;

                    // Determine if user entered email or name
                    const isEmail = userVal.includes('@');
                    const searchField = isEmail ? 'email' : 'name';
                    
                    console.log(`Searching by ${searchField}:`, userVal);

                    // Search in vendors (storeOwners) first
                    console.log("Searching storeOwners collection...");
                    const vSnap = await db.collection('storeOwners')
                        .where(searchField, '==', userVal)
                        .get();
                    
                    console.log("Vendor results found:", vSnap.size);

                    if (!vSnap.empty) {
                        foundUser = vSnap.docs[0].data();
                        userType = 'vendor';
                        console.log("Found vendor account");
                        console.log("Stored password:", foundUser.password);
                    } else {
                        // Search in customers
                        console.log("Searching customers collection...");
                        const cSnap = await db.collection('customers')
                            .where(searchField, '==', userVal)
                            .get();
                        
                        console.log("Customer results found:", cSnap.size);

                        if (!cSnap.empty) {
                            foundUser = cSnap.docs[0].data();
                            userType = 'customer';
                            console.log("Found customer account");
                            console.log("Stored password:", foundUser.password);
                        }
                    }

                    // Check if user was found
                    if (!foundUser) {
                        console.log("No user found in database");
                        alert("Account not found. Please check your username/email or sign up.");
                        return;
                    }

                    // Verify password matches the one in database
                    console.log("Comparing passwords...");
                    console.log("Entered password:", passVal);
                    console.log("Database password:", foundUser.password);
                    
                    if (foundUser.password !== passVal) {
                        console.log("Password mismatch!");
                        alert("Incorrect password. Please try again.");
                        return;
                    }

                    console.log("Password matched! Logging in...");

                    // Password matches - log them in
                    saveAndGo(foundUser, userType);
                    
                } catch (err) {
                    console.error("=== Login error ===");
                    console.error("Error:", err);
                    alert("Error logging in: " + err.message);
                }
            });
        }

        // Guest logic
        const guestBtn = document.getElementById('guestBtn');
        console.log("Guest button found:", guestBtn !== null);
        
        if (guestBtn) {
            guestBtn.addEventListener('click', (e) => {
                console.log("=== Guest login clicked ===");
                e.preventDefault();
                
                // Clear existing session
                localStorage.clear();
                
                // Set guest session
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'guest');
                
                console.log("Redirecting to guest page");
                window.location.href = getRedirectPath('guest');
            });
        }
    });
})();