document.addEventListener("DOMContentLoaded", function() {
    const STORAGE_KEY = "hawkersgoCart";
    const LIKES_KEY = "hawkersgoLikes";

    // ============================================
    // MENU DATA
    // ============================================
    const firstMenuData = [
        {
            name: "Rojak", price: 5.50, cat: "classics", img: "Menu Images/Rojak.jpg",
            desc: "Mixed fruits with shrimp paste sauce",
            addons: ["Extra Peanuts (+S$0.50)", "Extra Sauce (+S$0.50)"]
        },
        {
            name: "Popiah", price: 5.50, cat: "classics", img: "Menu Images/Popiah.jpeg",
            desc: "Fresh spring rolls with turnip & shrimp",
            addons: ["Extra Shrimp (+S$1.00)", "Extra Sauce (+S$0.50)"]
        },
        {
            name: "Cockle Laksa", price: 5.50, cat: "classics", img: "Menu Images/Cockle Laksa.jpg",
            desc: "Spicy coconut noodles with cockles",
            addons: ["Extra Cockles (+S$1.50)", "Extra Spicy (+S$0.50)"]
        },
        {
            name: "Century Egg & Tofu", price: 2.50, cat: "addons", img: "Menu Images/Century Egg & Tofu.jpg",
            desc: "Preserved egg with silken tofu",
            addons: []
        },
        {
            name: "Chicken Satays", price: 5.50, cat: "addons", img: "Menu Images/Chicken Satay Sticks.jpg",
            desc: "Grilled chicken skewers",
            addons: []
        },
        {
            name: "Tau Pok", price: 3.00, cat: "addons", img: "Menu Images/Tau Pok.jpg",
            desc: "Fried tofu puffs in broth",
            addons: []
        }
    ];

    const secondMenuData = [
        {
            name: "Steamed Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/steam chicken rice.jpg",
            desc: "Tender steamed chicken with rice",
            addons: ["Extra Chicken (+S$1.00)", "Extra Sauce (+S$0.50)"]
        },
        {
            name: "Roasted Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/Roasted Chicken Rice.avif",
            desc: "Crispy roasted chicken with rice",
            addons: ["Extra Chicken (+S$1.00)", "Extra Sauce (+S$0.50)"]
        },
        {   
            name: "BBQ Chicken Rice", price: 5.50, cat: "classics", img: "Menu Images/BBQ Chicken Rice.webp",
            desc: "BBQ glazed chicken with rice",
            addons: ["Extra BBQ Sauce (+S$0.50)", "Extra Chicken (+S$1.00)"]
        },
        {
            name: "Extra Rice", price: 2.50, cat: "addons", img: "Menu Images/Bowl of Rice.webp",
            desc: "Additional fragrant rice",
            addons: []
        },
        {
            name: "Chicken Gizzard", price: 5.50, cat: "addons", img: "Menu Images/Chicken Gizzard.webp",
            desc: "Seasoned chicken gizzard",
            addons: []
        },
        {
            name: "Roast Pork Slices", price: 3.00, cat: "addons", img: "Menu Images/Roast Pork Slices.webp",
            desc: "Crispy roast pork slices",
            addons: []
        }
    ];

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    const parsePrice = (str) => parseFloat(str.replace(/[^\d.-]/g, ''));
    
    const getCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    
    const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    
    const getLikes = () => JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
    
    const saveLikes = (likes) => localStorage.setItem(LIKES_KEY, JSON.stringify(likes));

    // ============================================
    // INITIALIZE MENU
    // ============================================
    const pageTitle = document.querySelector("h1").textContent;
    const menuData = (pageTitle.includes("Tian Tian") || pageTitle.includes("Chicken Rice")) 
        ? secondMenuData 
        : firstMenuData;
    
    const template = document.getElementById('food-item-template');
    const stallName = document.querySelector("h1").textContent;

    // Build menu items from data
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

        if (item.cat === "classics") document.getElementById('classics-grid').appendChild(clone);
        else if (item.cat === "addons") document.getElementById('addons-grid').appendChild(clone);
        else document.getElementById('drinks-grid').appendChild(clone);
    });

    // Restore saved states
    restoreCartState();
    restoreLikedItems();
    updateLikeCounter();

    // ============================================
    // EVENT HANDLERS
    // ============================================
    document.addEventListener("click", function(e) {
        
        // ADD TO CART
        if (e.target.classList.contains("add-btn")) {
            const item = e.target.closest(".menu-item");
            const baseName = item.querySelector("h3").textContent;
            const basePrice = parsePrice(item.querySelector(".price").textContent);

            // Calculate final name and price with addons
            let finalName = baseName;
            let totalPrice = basePrice;

            item.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
                const labelText = cb.parentElement.textContent.trim();
                const addonName = labelText.split(" (+")[0];
                const addonPrice = parsePrice(labelText);
                finalName += ` + ${addonName}`;
                totalPrice += addonPrice;
            });

            // Add to cart
            const cart = getCart();
            if (cart[finalName]) {
                cart[finalName].quantity += 1;
            } else {
                cart[finalName] = {
                    price: `S$${totalPrice.toFixed(2)}`,
                    quantity: 1,
                    stall: stallName
                };
            }
            saveCart(cart);

            // Update UI
            item.querySelector(".add-btn").style.display = "none";
            item.querySelector(".qty").style.display = "flex";
            item.querySelector(".qty span").textContent = cart[finalName].quantity;
            item.setAttribute("data-cart-key", finalName);
            item.querySelectorAll(".addon-checkbox").forEach(cb => cb.disabled = true);
        }

        // INCREASE/DECREASE QUANTITY
        if (e.target.classList.contains("qty-btn")) {
            const item = e.target.closest(".menu-item");
            const cartKey = item.getAttribute("data-cart-key");
            const cart = getCart();

            if (e.target.textContent === "+") {
                // Increase quantity
                cart[cartKey].quantity += 1;
                item.querySelector(".qty span").textContent = cart[cartKey].quantity;
            } else {
                // Decrease quantity
                if (cart[cartKey].quantity > 1) {
                    cart[cartKey].quantity -= 1;
                    item.querySelector(".qty span").textContent = cart[cartKey].quantity;
                } else {
                    // Remove item completely
                    delete cart[cartKey];
                    item.querySelector(".qty").style.display = "none";
                    item.querySelector(".add-btn").style.display = "block";
                    item.removeAttribute("data-cart-key");
                    item.querySelectorAll(".addon-checkbox").forEach(cb => {
                        cb.disabled = false;
                        cb.checked = false;
                    });
                }
            }
            saveCart(cart);
        }

        // LIKE BUTTON
        if (e.target.classList.contains("like")) {
            const item = e.target.closest(".menu-item");
            const itemName = item.querySelector("h3").textContent;
            const isLiked = e.target.classList.toggle("active");
            
            const allLikes = getLikes();
            if (!allLikes[stallName]) allLikes[stallName] = [];
            
            if (isLiked) {
                if (!allLikes[stallName].includes(itemName)) {
                    allLikes[stallName].push(itemName);
                }
            } else {
                allLikes[stallName] = allLikes[stallName].filter(name => name !== itemName);
            }
            
            saveLikes(allLikes);
            updateLikeCounter();
        }
    });

    // ============================================
    // RESTORE FUNCTIONS
    // ============================================
    function restoreCartState() {
        const cart = getCart();
        
        document.querySelectorAll(".menu-item").forEach(item => {
            const itemName = item.querySelector("h3").textContent;
            
            // Find if this item (or variant) is in cart
            for (const [cartKey, cartItem] of Object.entries(cart)) {
                if (cartItem.stall !== stallName) continue;
                
                if (cartKey === itemName || cartKey.startsWith(itemName + " + ")) {
                    // Show quantity controls
                    item.querySelector(".add-btn").style.display = "none";
                    item.querySelector(".qty").style.display = "flex";
                    item.querySelector(".qty span").textContent = cartItem.quantity;
                    item.setAttribute("data-cart-key", cartKey);
                    
                    // Restore and disable checkboxes
                    if (cartKey.includes(" + ")) {
                        const addons = cartKey.split(" + ").slice(1);
                        item.querySelectorAll(".addon-checkbox").forEach(cb => {
                            const addonName = cb.parentElement.textContent.split(" (+")[0];
                            if (addons.includes(addonName)) cb.checked = true;
                            cb.disabled = true;
                        });
                    } else {
                        item.querySelectorAll(".addon-checkbox").forEach(cb => cb.disabled = true);
                    }
                    break;
                }
            }
        });
    }

    function restoreLikedItems() {
        const allLikes = getLikes();
        const likedItems = allLikes[stallName] || [];
        
        document.querySelectorAll(".menu-item").forEach(item => {
            const itemName = item.querySelector("h3").textContent;
            if (likedItems.includes(itemName)) {
                item.querySelector(".like").classList.add("active");
            }
        });
    }

    function updateLikeCounter() {
        const allLikes = getLikes();
        const likeCount = (allLikes[stallName] || []).length;
        
        let counter = document.querySelector(".like-counter");
        if (!counter) {
            counter = document.createElement("div");
            counter.className = "like-counter text-center mb-3";
            const subtitle = document.querySelector(".subtitle");
            if (subtitle) subtitle.parentNode.insertBefore(counter, subtitle.nextSibling);
        }
        counter.innerHTML = `<span class="heart-icon">♥</span> ${likeCount} ${likeCount === 1 ? 'like' : 'likes'} on this stall`;
    }
});