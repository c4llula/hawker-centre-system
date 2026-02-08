    // Handle login form submission
    document.querySelector('.form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.querySelector('input[placeholder="User Name"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;
        
        // Validate inputs
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user exists
        const user = users.find(u => 
            (u.email === username || u.name === username) && 
            u.password === password
        );
        
        if (user) {
            // Save current user to localStorage for session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert('Login successful!');
            // Redirect to home page
            window.location.href = "CustomerEng.html"; // Change to your home page filename
        } else {
            alert('Invalid username or password');
        }
    });
    
    // Guest login
    document.querySelector('.guest-login-btn').addEventListener('click', function() {
        // Create guest user object
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Guest',
            accountType: 'guest',
            loginTime: new Date().toISOString()
        };
        
        // Save guest session to localStorage
        localStorage.setItem('currentUser', JSON.stringify(guestUser));
        
        alert('Continuing as guest...');
        // Redirect to home page
        window.location.href = "index.html"; // Change to your home page filename
    });
    
    // Optional: Check if user is already logged in
    window.addEventListener('DOMContentLoaded', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // User is already logged in, redirect to home page
            // window.location.href = "index.html";
        }
    });