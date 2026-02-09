document.addEventListener("DOMContentLoaded", function() {
    // Storage
    const cartKey = "hawkersgoCart";
    const likesKey = "hawkersgoLikes";
    
    function getCart() { return JSON.parse(localStorage.getItem(cartKey)) || {}; }
    function saveCart(cart) { localStorage.setItem(cartKey, JSON.stringify(cart)); }
    function getLikes() { return JSON.parse(localStorage.getItem(likesKey)) || {}; }
    function saveLikes(likes) { localStorage.setItem(likesKey, JSON.stringify(likes)); }
    
    // Menu data 
    const menus = {
        "rojak": [
            // Classics with Addons
            {name: "Rojak", price: 5.50, cat: "classics", img: "Menu Images/Rojak.jpg", desc: "Mixed fruits with shrimp paste sauce", addons: ["Extra Peanuts (+S$0.50)", "Extra Sauce (+S$0.50)"]},
            {name: "Popiah", price: 5.50, cat: "classics", img: "Menu Images/Popiah.jpeg", desc: "Fresh spring rolls with turnip & shrimp", addons: ["Extra Shrimp (+S$1.00)", "Extra Sauce (+S$0.50)"]},
            {name: "Cockle Laksa", price: 5.50, cat: "classics", img: "Menu Images/Cockle Laksa.jpg", desc: "Spicy coconut noodles with cockles", addons: ["Extra Cockles (+S$1.50)", "Extra Spicy (+S$0.50)"]},
            
            // Addons 
            {name: "Century Egg & Tofu", price: 2.50, cat: "addons", img: "Menu Images/Century Egg & Tofu.jpg", desc: "Preserved egg with silken tofu", addons: []},
            {name: "Chicken Satays", price: 5.50, cat: "addons", img: "Menu Images/Chicken Satay Sticks.jpg", desc: "Grilled chicken skewers", addons: []},
            {name: "Tau Pok", price: 3.00, cat: "addons", img: "Menu Images/Tau Pok.jpg", desc: "Fried tofu puffs in broth", addons: []},
            
            // Drinks
            {name: "Teh Tarik", price: 2.00, cat: "drinks", img: "Menu Images/Teh Tarik.jpg", desc: "Pulled milk tea", addons: []},
            {name: "Sugarcane Juice", price: 3.00, cat: "drinks", img: "Menu Images/Sugarcane Juice.jpg", desc: "Fresh sugarcane juice", addons: []},
            {name: "Iced Milo", price: 2.50, cat: "drinks", img: "Menu Images/Iced Chocolate.jpg", desc: "Chocolate malt drink", addons: []}
        ],
        "chicken": [
            // Classics with addons
            {name: "Steamed Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/steam chicken rice.jpg", desc: "Tender steamed chicken with rice", addons: ["Extra Chicken (+S$1.00)", "Extra Sauce (+S$0.50)"]},
            {name: "Roasted Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/Roasted Chicken Rice.avif", desc: "Crispy roasted chicken with rice", addons: ["Extra Chicken (+S$1.00)", "Extra Sauce (+S$0.50)"]},
            {name: "BBQ Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/BBQ Chicken Rice.webp", desc: "BBQ glazed chicken with rice", addons: ["Extra BBQ Sauce (+S$0.50)", "Extra Chicken (+S$1.00)"]},
            
            // Addons 
            {name: "Extra Rice", price: 2.50, cat: "addons", img: "Menu Images/Bowl of Rice.webp", desc: "Additional fragrant rice", addons: []},
            {name: "Chicken Gizzard", price: 5.50, cat: "addons", img: "Menu Images/Chicken Gizzard.webp", desc: "Seasoned chicken gizzard", addons: []},
            {name: "Roast Pork Slices", price: 3.00, cat: "addons", img: "Menu Images/Roast Pork Slices.webp", desc: "Crispy roast pork slices", addons: []},
            
            // Drinks
            {name: "Teh Tarik", price: 2.00, cat: "drinks", img: "Menu Images/Teh Tarik.jpg", desc: "Pulled milk tea", addons: []},
            {name: "Sugarcane Juice", price: 3.00, cat: "drinks", img: "Menu Images/Sugarcane Juice.jpg", desc: "Fresh sugarcane juice", addons: []},
            {name: "Iced Milo", price: 2.50, cat: "drinks", img: "Menu Images/Iced Chocolate.jpg", desc: "Chocolate malt drink", addons: []}
        ]
    };
    
    // Get stall info
    const title = document.querySelector("h1");
    const stallName = title ? title.textContent : "Menu";
    const menuData = title && title.textContent.includes("Chicken Rice") ? menus.chicken : menus.rojak;
    
    // Generate menu if on menu page
    const template = document.getElementById('food-item-template');
    if (template) {
        menuData.forEach(item => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('img').src = item.img;
            clone.querySelector('img').alt = item.name;
            clone.querySelector('h3').textContent = item.name;
            clone.querySelector('.description').textContent = item.desc;
            clone.querySelector('.price').textContent = `S$${item.price.toFixed(2)}`;
            
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
                addonContainer.style.display = "none";
            }
            
            let gridId;
            if (item.cat === "classics") gridId = 'classics-grid';
            else if (item.cat === "addons") gridId = 'addons-grid';
            else if (item.cat === "drinks") gridId = 'drinks-grid';
            
            document.getElementById(gridId).appendChild(clone);
        });
        
        restoreCart();
        restoreLikes();
    }
    
    showLikedItems();
    
    // Click handlers - UPDATED FOR ADDONS
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-btn")) {
            const item = e.target.closest(".menu-item");
            const baseName = item.querySelector("h3").textContent;
            const basePrice = parseFloat(item.querySelector(".price").textContent.replace("S$", ""));
            
            let finalName = baseName;
            let totalPrice = basePrice;
            
            item.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
                const labelText = cb.parentElement.textContent.trim();
                const addonName = labelText.split(" (+")[0];
                const addonPrice = parseFloat(labelText.replace(/[^\d.-]/g, ''));
                finalName += ` + ${addonName}`;
                totalPrice += addonPrice;
            });
            
            const cart = getCart();
            if (cart[finalName]) {
                cart[finalName].qty += 1;
            } else {
                cart[finalName] = { qty: 1, price: totalPrice };
            }
            saveCart(cart);
            
            item.querySelector(".add-btn").style.display = "none";
            item.querySelector(".qty").style.display = "flex";
            item.querySelector(".qty span").textContent = cart[finalName].qty;
            item.querySelectorAll(".addon-checkbox").forEach(cb => cb.disabled = true);
        }
        
        // quantity buttons
        if (e.target.classList.contains("qty-btn")) {
            const item = e.target.closest(".menu-item");
            const name = item.querySelector("h3").textContent;
            const cart = getCart();
            
            // find cart item (might have addons in name)
            let cartKey = name;
            for (const key in cart) {
                if (key.startsWith(name + " ") || key === name) {
                    cartKey = key;
                    break;
                }
            }
            
            if (e.target.textContent === "+") {
                cart[cartKey].qty++;
                item.querySelector(".qty span").textContent = cart[cartKey].qty;
            } else {
                if (cart[cartKey].qty > 1) {
                    cart[cartKey].qty--;
                    item.querySelector(".qty span").textContent = cart[cartKey].qty;
                } else {
                    delete cart[cartKey];
                    item.querySelector(".qty").style.display = "none";
                    item.querySelector(".add-btn").style.display = "block";
                    item.querySelectorAll(".addon-checkbox").forEach(cb => {
                        cb.disabled = false;
                        cb.checked = false;
                    });
                }
            }
            saveCart(cart);
        }
        
        // like button
        if (e.target.classList.contains("like")) {
            const item = e.target.closest(".menu-item");
            const name = item.querySelector("h3").textContent;
            const likes = getLikes();
            
            if (!likes[stallName]) likes[stallName] = [];
            
            if (e.target.classList.contains("active")) {
                e.target.classList.remove("active");
                likes[stallName] = likes[stallName].filter(n => n !== name);
            } else {
                e.target.classList.add("active");
                likes[stallName].push(name);
            }
            
            saveLikes(likes);
            showLikedItems();
        }
    });
    
    // helper functions
    function restoreCart() {
        const cart = getCart();
        document.querySelectorAll(".menu-item").forEach(item => {
            const name = item.querySelector("h3").textContent;
            
            // find if this item (with or without addons) is in cart
            for (const cartKey in cart) {
                if (cartKey === name || cartKey.startsWith(name + " + ")) {
                    item.querySelector(".add-btn").style.display = "none";
                    item.querySelector(".qty").style.display = "flex";
                    item.querySelector(".qty span").textContent = cart[cartKey].qty;
                    
                    // Disable checkboxes if in cart
                    item.querySelectorAll(".addon-checkbox").forEach(cb => cb.disabled = true);
                    break;
                }
            }
        });
    }
    
    function restoreLikes() {
        const likes = getLikes();
        const myLikes = likes[stallName] || [];
        document.querySelectorAll(".menu-item").forEach(item => {
            const name = item.querySelector("h3").textContent;
            if (myLikes.includes(name)) {
                item.querySelector(".like").classList.add("active");
            }
        });
    }
    
    function showLikedItems() {
        const list = document.getElementById("likedItemsList");
        if (!list) return;
        
        const likes = getLikes();
        let total = 0;
        
        for (const stall in likes) {
            total += likes[stall].length;
        }
        
        const totalEl = document.getElementById("totalCount");
        if (totalEl) totalEl.textContent = total;
        
        if (total === 0) return;
        
        list.innerHTML = "";
        
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