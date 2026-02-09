    // handle login form submission
    document.querySelector('.form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.querySelector('input[placeholder="User Name"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;
        
        // validate inputs
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }
        
        // get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // check if user exists
        const user = users.find(u => 
            (u.email === username || u.name === username) && 
            u.password === password
        );
        
        if (user) {
            // save current user to localStorage for session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert('Login successful!');
            // redirect to home page
            window.location.href = "home-page-user.html"; 
        } else {
            alert('Invalid username or password');
        }
    });
    
    // guest login
    document.querySelector('.guest-login-btn').addEventListener('click', function() {
        // create guest user object
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Guest',
            accountType: 'guest',
            loginTime: new Date().toISOString()
        };
        
        // save guest session to localStorage
        localStorage.setItem('currentUser', JSON.stringify(guestUser));
        
        alert('Continuing as guest...');
        // redirect to home page
        window.location.href = "home-page-guest.html"; 
    });
    
