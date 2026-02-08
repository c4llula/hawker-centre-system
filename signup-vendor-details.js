function saveStoreDetails() {
        const storeDetails = {
            storeNumber: document.querySelector('input[placeholder="Store Number"]').value,
            hawkerCentre: document.querySelector('input[placeholder="Hawker Centre Name"]').value,
            streetAddress: document.querySelector('input[placeholder="Street Address"]').value,
            postalCode: document.querySelector('input[placeholder="Postal Code"]').value
        };
        
        if (!storeDetails.storeNumber || !storeDetails.hawkerCentre) {
            alert('Please fill in Store Number and Hawker Centre Name.');
            return;
        }
        
        const vendorBasicInfo = JSON.parse(localStorage.getItem('vendorBasicInfo'));
        
        if (!vendorBasicInfo) {
            alert('Vendor information not found. Please start the signup process again.');
            window.location.href = "signup-account-type.html";
            return;
        }
        
        const completeVendorData = {
            ...vendorBasicInfo,
            ...storeDetails,
            accountType: 'vendor'
        };
        
        // Get existing users OR start with empty array
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        existingUsers.push(completeVendorData);

        // Save updated users array back to localStorage
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        localStorage.removeItem('vendorBasicInfo');
        localStorage.setItem('currentUser', JSON.stringify(completeVendorData));
        
        alert('Vendor account created successfully!');

        window.location.href = "main-login.html";
    }