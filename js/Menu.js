// 1. WAIT FOR PAGE TO LOAD
document.addEventListener("DOMContentLoaded", function() {
    
    // 2. SETUP CART & LIKES STORAGE
    const cartKey = "hawkersgoCart";
    const likesKey = "hawkersgoLikes";
    
    // Quick functions to save/load from browser storage
    function getCart() { return JSON.parse(localStorage.getItem(cartKey)) || {}; }
    function saveCart(cart) { localStorage.setItem(cartKey, JSON.stringify(cart)); }
    function getLikes() { return JSON.parse(localStorage.getItem(likesKey)) || {}; }
    function saveLikes(likes) { localStorage.setItem(likesKey, JSON.stringify(likes)); }
    
    // 3. ALL OUR FOOD DATA
    const menus = {
        "rojak": [
            // Rojak stall items
            {name: "Rojak", price: 5.50, cat: "classics", img: "Menu Images/Rojak.jpg", desc: "Mixed fruits with shrimp paste sauce", addons: ["Extra Peanuts (+S$0.50)", "Extra Sauce (+S$0.50)"]},
            {name: "Popiah", price: 5.50, cat: "classics", img: "Menu Images/Popiah.jpeg", desc: "Fresh spring rolls with turnip & shrimp", addons: ["Extra Shrimp (+S$1.00)", "Extra Sauce (+S$0.50)"]},
            {name: "Cockle Laksa", price: 5.50, cat: "classics", img: "Menu Images/Cockle Laksa.jpg", desc: "Spicy coconut noodles with cockles", addons: ["Extra Cockles (+S$1.50)", "Extra Spicy (+S$0.50)"]},
            
            // Rojak add-ons
            {name: "Century Egg & Tofu", price: 2.50, cat: "addons", img: "Menu Images/Century Egg & Tofu.jpg", desc: "Preserved egg with silken tofu", addons: []},
            {name: "Chicken Satays", price: 5.50, cat: "addons", img: "Menu Images/Chicken Satay Sticks.jpg", desc: "Grilled chicken skewers", addons: []},
            {name: "Tau Pok", price: 3.00, cat: "addons", img: "Menu Images/Tau Pok.jpg", desc: "Fried tofu puffs in broth", addons: []},
            
            // Drinks
            {name: "Teh Tarik", price: 2.00, cat: "drinks", img: "Menu Images/Teh Tarik.jpg", desc: "Pulled milk tea", addons: []},
            {name: "Sugarcane Juice", price: 3.00, cat: "drinks", img: "Menu Images/Sugarcane Juice.jpg", desc: "Fresh sugarcane juice", addons: []},
            {name: "Iced Milo", price: 2.50, cat: "drinks", img: "Menu Images/Iced Chocolate.jpg", desc: "Chocolate malt drink", addons: []}
        ],
        "chicken": [
            // Chicken rice stall items
            {name: "Steamed Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/steam chicken rice.jpg", desc: "Tender steamed chicken with rice", addons: ["Extra Chicken (+S$1.00)", "Extra Sauce (+S$0.50)"]},
            {name: "Roasted Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/Roasted Chicken Rice.avif", desc: "Crispy roasted chicken with rice", addons: ["Extra Chicken (+S$1.00)", "Extra Sauce (+S$0.50)"]},
            {name: "BBQ Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/BBQ Chicken Rice.webp", desc: "BBQ glazed chicken with rice", addons: ["Extra BBQ Sauce (+S$0.50)", "Extra Chicken (+S$1.00)"]},
            
            // Chicken rice add-ons
            {name: "Extra Rice", price: 2.50, cat: "addons", img: "Menu Images/Bowl of Rice.webp", desc: "Additional fragrant rice", addons: []},
            {name: "Chicken Gizzard", price: 5.50, cat: "addons", img: "Menu Images/Chicken Gizzard.webp", desc: "Seasoned chicken gizzard", addons: []},
            {name: "Roast Pork Slices", price: 3.00, cat: "addons", img: "Menu Images/Roast Pork Slices.webp", desc: "Crispy roast pork slices", addons: []},
            
            // Same drinks
            {name: "Teh Tarik", price: 2.00, cat: "drinks", img: "Menu Images/Teh Tarik.jpg", desc: "Pulled milk tea", addons: []},
            {name: "Sugarcane Juice", price: 3.00, cat: "drinks", img: "Menu Images/Sugarcane Juice.jpg", desc: "Fresh sugarcane juice", addons: []},
            {name: "Iced Milo", price: 2.50, cat: "drinks", img: "Menu Images/Iced Chocolate.jpg", desc: "Chocolate malt drink", addons: []}
        ]
    };
    
    // 4. FIGURE OUT WHICH STALL WE'RE ON
    const title = document.querySelector("h1");
    const stallName = title ? title.textContent : "Menu";
    const menuData = title && title.textContent.includes("Chicken Rice") ? menus.chicken : menus.rojak;
    
    // 5. BUILD THE MENU PAGE
    const template = document.getElementById('food-item-template');
    if (template) {
        // Go through each food item
        menuData.forEach(item => {
            // Copy the template (like a photocopy)
            const clone = template.content.cloneNode(true);
            
            // Fill in the details
            clone.querySelector('img').src = item.img;
            clone.querySelector('img').alt = item.name;
            clone.querySelector('h3').textContent = item.name;
            clone.querySelector('.description').textContent = item.desc;
            clone.querySelector('.price').textContent = `S$${item.price.toFixed(2)}`;
            
            // Make add-on checkboxes if this item has them
            const addonContainer = clone.querySelector('.simple-addons');
            if (item.addons && item.addons.length > 0) {
                item.addons.forEach(addonText => {
                    const label = document.createElement('label');
                    label.className = 'addon-option';
                    label.innerHTML = `<input type="checkbox" class="addon-checkbox"> ${addonText}`;
                    addonContainer.appendChild(label);
                });
                addonContainer.style.display = "block"; 
            } else {
                addonContainer.style.display = "none";  // Hide if no add-ons
            }
            
            // Put item in the right section
            let gridId;
            if (item.cat === "classics") gridId = 'classics-grid';
            else if (item.cat === "addons") gridId = 'addons-grid';
            else if (item.cat === "drinks") gridId = 'drinks-grid';
            
            // Add to page
            document.getElementById(gridId).appendChild(clone);
        });
        
        // Show what's already in cart/liked
        restoreCart();
        restoreLikes();
    }
    
    // 6. UPDATE LIKED ITEMS PAGE
    showLikedItems();
    
    // 7. HANDLE ALL CLICKS
    document.addEventListener("click", function(e) {
        
        // 7A. ADD TO CART BUTTON CLICKED
        if (e.target.classList.contains("add-btn")) {
            const item = e.target.closest(".menu-item");
            const baseName = item.querySelector("h3").textContent;
            const basePrice = parseFloat(item.querySelector(".price").textContent.replace("S$", ""));
            
            let finalName = baseName;
            let totalPrice = basePrice;
            
            // Check which add-ons are selected
            item.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
                const labelText = cb.parentElement.textContent.trim();
                const addonName = labelText.split(" (+")[0];
                const addonPrice = parseFloat(labelText.replace(/[^\d.-]/g, ''));
                finalName += ` + ${addonName}`;
                totalPrice += addonPrice;
            });
            
            // Save to cart
            const cart = getCart();
            if (cart[finalName]) {
                cart[finalName].qty += 1;  // Already in cart → add 1 more
            } else {
                cart[finalName] = { qty: 1, price: totalPrice };  // New item
            }
            saveCart(cart);
            
            // Change button to quantity controls
            item.querySelector(".add-btn").style.display = "none";
            item.querySelector(".qty").style.display = "flex";
            item.querySelector(".qty span").textContent = cart[finalName].qty;
            item.querySelectorAll(".addon-checkbox").forEach(cb => cb.disabled = true);  // Can't change add-ons now
        }
        
        // 7B. QUANTITY BUTTONS (+/-) CLICKED
        if (e.target.classList.contains("qty-btn")) {
            const item = e.target.closest(".menu-item");
            const name = item.querySelector("h3").textContent;
            const cart = getCart();
            
            // Find this item in cart (might have add-ons in name)
            let cartKey = name;
            for (const key in cart) {
                if (key.startsWith(name + " ") || key === name) {
                    cartKey = key;
                    break;
                }
            }
            
            // + button → add 1 more
            if (e.target.textContent === "+") {
                cart[cartKey].qty++;
                item.querySelector(".qty span").textContent = cart[cartKey].qty;
            } 
            // - button → remove 1
            else {
                if (cart[cartKey].qty > 1) {
                    cart[cartKey].qty--;
                    item.querySelector(".qty span").textContent = cart[cartKey].qty;
                } else {
                    // Last one → remove from cart completely
                    delete cart[cartKey];
                    item.querySelector(".qty").style.display = "none";
                    item.querySelector(".add-btn").style.display = "block";
                    item.querySelectorAll(".addon-checkbox").forEach(cb => {
                        cb.disabled = false;
                        cb.checked = false;  // Reset add-ons
                    });
                }
            }
            saveCart(cart);
        }
        
        // 7C. LIKE BUTTON (HEART) CLICKED
        if (e.target.classList.contains("like")) {
            const item = e.target.closest(".menu-item");
            const name = item.querySelector("h3").textContent;
            const likes = getLikes();
            
            // Make sure we have a list for this stall
            if (!likes[stallName]) likes[stallName] = [];
            
            // Toggle like/unlike
            if (e.target.classList.contains("active")) {
                e.target.classList.remove("active");  // Unlike → white heart
                likes[stallName] = likes[stallName].filter(n => n !== name);  // Remove from list
            } else {
                e.target.classList.add("active");  // Like → red heart
                likes[stallName].push(name);  // Add to list
            }
            
            saveLikes(likes);
            showLikedItems();  // Update the liked items page
        }
    });
    
    // 8. HELPER FUNCTIONS
    
    // 8A. SHOW ITEMS ALREADY IN CART WHEN PAGE LOADS
    function restoreCart() {
        const cart = getCart();
        document.querySelectorAll(".menu-item").forEach(item => {
            const name = item.querySelector("h3").textContent;
            
            // Look for this item in cart (with or without add-ons)
            for (const cartKey in cart) {
                if (cartKey === name || cartKey.startsWith(name + " + ")) {
                    // Show quantity controls, not "Add to Cart"
                    item.querySelector(".add-btn").style.display = "none";
                    item.querySelector(".qty").style.display = "flex";
                    item.querySelector(".qty span").textContent = cart[cartKey].qty;
                    
                    // Disable add-on checkboxes
                    item.querySelectorAll(".addon-checkbox").forEach(cb => cb.disabled = true);
                    break;
                }
            }
        });
    }
    
    // 8B. SHOW ALREADY LIKED ITEMS WHEN PAGE LOADS
    function restoreLikes() {
        const likes = getLikes();
        const myLikes = likes[stallName] || [];  // Get likes for this stall
        document.querySelectorAll(".menu-item").forEach(item => {
            const name = item.querySelector("h3").textContent;
            if (myLikes.includes(name)) {
                item.querySelector(".like").classList.add("active");  // Make heart red
            }
        });
    }
    
    // 8C. BUILD THE LIKED ITEMS PAGE
    function showLikedItems() {
        const list = document.getElementById("likedItemsList");
        if (!list) return;  // Only run on liked items page
        
        const likes = getLikes();
        let total = 0;
        
        // Count all liked items
        for (const stall in likes) {
            total += likes[stall].length;
        }
        
        // Update the counter
        const totalEl = document.getElementById("totalCount");
        if (totalEl) totalEl.textContent = total;
        
        if (total === 0) return;  // No likes → keep "no items" message
        
        list.innerHTML = "";  // Clear the "no items" message
        
        // Create a box for each liked item
        for (const stall in likes) {
            likes[stall].forEach(item => {
                const div = document.createElement("div");
                div.className = "liked-item";
                div.innerHTML = `<div class="item-name">${item}</div><div class="item-stall">${stall}</div>`;
                list.appendChild(div);
            });
        }
    }
});