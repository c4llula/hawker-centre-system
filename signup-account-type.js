function showForm(formType) {
    // Hide all forms
    document.getElementById('customer-form').style.display = 'none';
    document.getElementById('vendor-form').style.display = 'none';
    
    // Remove selected class from all buttons
    const allButtons = document.querySelectorAll('.type-option');
    allButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Show selected form and highlight the correct button
    if (formType === 'customer') {
        document.getElementById('customer-form').style.display = 'flex';
        // Highlight Customer button in both forms
        document.querySelectorAll('.type-option').forEach(btn => {
            if (btn.textContent.includes('Customer')) {
                btn.classList.add('selected');
            }
        });
    } else {
        document.getElementById('vendor-form').style.display = 'flex';
        // Highlight Store Owner button in both forms
        document.querySelectorAll('.type-option').forEach(btn => {
            if (btn.textContent.includes('Store Owner')) {
                btn.classList.add('selected');
            }
        });
        
        // OPTIONAL: Clear vendor form when switching to it
        // document.getElementById('vendor-name').value = '';
        // document.getElementById('vendor-email').value = '';
        // document.getElementById('vendor-phone').value = '';
        // document.getElementById('vendor-password').value = '';
    }
}

function createAccount(type) {
    if (type === 'customer') {
        // Get customer form data using customer-specific IDs
        const customerData = {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            phone: document.getElementById('customer-phone').value,
            password: document.getElementById('customer-password').value,
            accountType: 'customer'
        };
        
        // Validate
        if (!customerData.name || !customerData.email || !customerData.password) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(u => u.email === customerData.email);
        
        if (userExists) {
            alert('User with this email already exists.');
            return;
        }
        
        // Save customer data
        existingUsers.push(customerData);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Auto-login
        localStorage.setItem('currentUser', JSON.stringify(customerData));
        
        alert('Account created successfully!');
        window.location.href = "index.html";
        
    } else {
        // Get vendor form data using vendor-specific IDs
        const vendorBasicInfo = {
            name: document.getElementById('vendor-name').value,
            email: document.getElementById('vendor-email').value,
            phone: document.getElementById('vendor-phone').value,
            password: document.getElementById('vendor-password').value,
            accountType: 'vendor'
        };
        
        // Validate
        if (!vendorBasicInfo.name || !vendorBasicInfo.email || !vendorBasicInfo.password) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(u => u.email === vendorBasicInfo.email);
        
        if (userExists) {
            alert('User with this email already exists.');
            return;
        }
        
        // Save vendor basic info temporarily
        localStorage.setItem('vendorBasicInfo', JSON.stringify(vendorBasicInfo));
        
        // Go to vendor details page
        window.location.href = "signup-vendor-details.html";
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    showForm('customer');
});