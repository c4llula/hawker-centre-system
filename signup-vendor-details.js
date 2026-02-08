function saveStoreDetails() {
        // Get store details
        const storeDetails = {
            storeNumber: document.querySelector('input[placeholder="Store Number"]').value,
            hawkerCentre: document.querySelector('input[placeholder="Hawker Centre Name"]').value,
            streetAddress: document.querySelector('input[placeholder="Street Address"]').value,
            postalCode: document.querySelector('input[placeholder="Postal Code"]').value
        };
        
        // Validate
        if (!storeDetails.storeNumber || !storeDetails.hawkerCentre) {
            alert('Please fill in Store Number and Hawker Centre Name.');
            return;
        }
        
        // Get vendor basic info
        const vendorBasicInfo = JSON.parse(localStorage.getItem('vendorBasicInfo'));
        
        if (!vendorBasicInfo) {
            alert('Vendor information not found. Please start the signup process again.');
            window.location.href = "signup-account-type.html";
            return;
        }
        
        // Combine basic info with store details
        const completeVendorData = {
            ...vendorBasicInfo,
            ...storeDetails,
            accountType: 'vendor'
        };
        
        // Save complete vendor data to users array
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        existingUsers.push(completeVendorData);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Clear temporary data
        localStorage.removeItem('vendorBasicInfo');
        
        // Auto-login after signup
        localStorage.setItem('currentUser', JSON.stringify(completeVendorData));
        
        alert('Vendor account created successfully!');
        // Redirect to home page
        window.location.href = "main-login.html";
    }