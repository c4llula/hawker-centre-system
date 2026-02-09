const firebaseConfig = {
    apiKey: "AIzaSyBsn3nzbTWFP0f2k7XTmFsRxdAjd0vhDKA",
    authDomain: "fed-assignment-33cc7.firebaseapp.com",
    databaseURL: "https://fed-assignment-33cc7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fed-assignment-33cc7",
    storageBucket: "fed-assignment-33cc7.firebasestorage.app",
    messagingSenderId: "6435796920",
    appId: "1:6435796920:web:5f521b0e023e8882a7014d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

async function saveStoreDetails() {
    try {
        // Get store details from form
        const storeDetails = {
            storeNumber: document.querySelector('input[placeholder="Store Number"]').value,
            hawkerCentre: document.querySelector('input[placeholder="Hawker Centre Name"]').value,
            streetAddress: document.querySelector('input[placeholder="Street Address"]').value,
            postalCode: document.querySelector('input[placeholder="Postal Code"]').value
        };
        
        // Validate required fields
        if (!storeDetails.storeNumber || !storeDetails.hawkerCentre) {
            alert('Please fill in Store Number and Hawker Centre Name.');
            return;
        }
        
        // Get basic vendor info from localStorage (from previous signup page)
        const vendorBasicInfo = JSON.parse(localStorage.getItem('vendorBasicInfo'));
        
        if (!vendorBasicInfo) {
            alert('Vendor information not found. Please start the signup process again.');
            window.location.href = "signup-account-type.html";
            return;
        }
        
        // Combine all vendor data
        const completeVendorData = {
            // Basic info from previous page
            name: vendorBasicInfo.name,
            email: vendorBasicInfo.email,
            phone: vendorBasicInfo.phone,
            password: vendorBasicInfo.password, // ADDED: Store password in database
            accountType: 'vendor',
            
            // Store details from current page
            ...storeDetails,
            
            // Additional metadata
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            vendorDetailsCompleted: true,
            status: 'active'
        };
        
        try {
            // CREATE the Firebase Auth user (not sign in)
            const userCredential = await auth.createUserWithEmailAndPassword(
                vendorBasicInfo.email,
                vendorBasicInfo.password
            );
            
            const user = userCredential.user;
            
            // Save to "storeOwners" collection with user UID as document ID (INCLUDING PASSWORD)
            await db.collection('storeOwners').doc(user.uid).set(completeVendorData);
            
            // Also save to main 'users' collection (INCLUDING PASSWORD)
            await db.collection('users').doc(user.uid).set({
                name: vendorBasicInfo.name,
                email: vendorBasicInfo.email,
                phone: vendorBasicInfo.phone,
                password: vendorBasicInfo.password, // ADDED: Store password in database
                accountType: 'vendor',
                storeOwnerId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid
            });
            
            // Auto-login the vendor
            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                email: vendorBasicInfo.email,
                name: vendorBasicInfo.name,
                accountType: 'vendor',
                storeOwnerId: user.uid
            }));
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', 'vendor');
            
            // Clear the temporary data
            localStorage.removeItem('vendorBasicInfo');
            
            alert('Store owner account created successfully!');
            
            // Redirect to vendor dashboard or menu page
            window.location.href = "main-login.html";
            
        } catch (authError) {
            console.error("Authentication error:", authError);
            
            // Handle specific authentication errors
            if (authError.code === 'auth/email-already-in-use') {
                // User already exists, try to sign them in
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(
                        vendorBasicInfo.email,
                        vendorBasicInfo.password
                    );
                    
                    const user = userCredential.user;
                    
                    // Update the existing store owner data (INCLUDING PASSWORD)
                    await db.collection('storeOwners').doc(user.uid).set(completeVendorData, { merge: true });
                    
                    await db.collection('users').doc(user.uid).set({
                        name: vendorBasicInfo.name,
                        email: vendorBasicInfo.email,
                        phone: vendorBasicInfo.phone,
                        password: vendorBasicInfo.password, // ADDED: Store password in database
                        accountType: 'vendor',
                        storeOwnerId: user.uid,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    
                    // Auto-login
                    localStorage.setItem('currentUser', JSON.stringify({
                        uid: user.uid,
                        email: vendorBasicInfo.email,
                        name: vendorBasicInfo.name,
                        accountType: 'vendor',
                        storeOwnerId: user.uid
                    }));
                    
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userType', 'vendor');
                    
                    localStorage.removeItem('vendorBasicInfo');
                    
                    alert('Store details updated successfully!');
                    window.location.href = "vendor-menu.html";
                    
                } catch (signInError) {
                    console.error("Sign in error:", signInError);
                    alert('Account exists but password is incorrect. Please try signing up again with a different email.');
                    localStorage.removeItem('vendorBasicInfo');
                    window.location.href = "signup-account-type.html";
                }
            } else {
                // Other auth errors
                alert('Error creating account: ' + authError.message);
            }
        }
        
    } catch (error) {
        console.error("Error saving store details:", error);
        alert('Error saving store details: ' + error.message);
    }
}