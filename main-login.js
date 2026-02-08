// Reset session on login page load
document.addEventListener('DOMContentLoaded', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    console.log('Session reset for fresh login');
});

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find the user - check both email and name fields
    const user = users.find(u => 
        u.email === username || 
        u.name === username || 
        u.username === username
    );
    
    let userType = 'customer'; // Default
    
    if (user) {
        // Check if user exists in database
        if (user.password === password) {
            // Check accountType field
            if (user.accountType === 'vendor') {
                userType = 'vendor';
                console.log('Found vendor by accountType:', user.name);
            } else {
                userType = 'customer';
                console.log('Found customer:', user.name);
            }
        } else {
            alert('Incorrect password');
            return;
        }
    } else {
        // User not found in database
        alert('User not found. Please sign up first.');
        return;
    }
    
    // Save login state
    localStorage.setItem('userType', userType);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    
    // Redirect
    if (userType === 'vendor') {
        alert('Vendor login successful! Welcome ' + (user.name || username));
        window.location.href = 'vendor-menu.html';
    } else {
        alert('Customer login successful! Welcome ' + (user.name || username));
        window.location.href = 'home-page-user.html';
    }
});

// Guest login
document.getElementById('guestBtn').addEventListener('click', function() {
    localStorage.setItem('userType', 'guest');
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', 'guest');
    alert('Continuing as guest');
    window.location.href = 'home-page-guest.html';
});