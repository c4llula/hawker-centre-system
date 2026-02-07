document.addEventListener("DOMContentLoaded", function() {
    const STORAGE_KEY = "hawkersgoCart";
    const LIKES_KEY = "hawkersgoLikes";

    // Initialize likes and cart on page load
    restoreLikedItems();
    updateLikeCounter();
    restoreCartUI();

    // 1. Helper: Convert "S$5.50" string to 5.50 number
    const parsePrice = (str) => parseFloat(str.replace(/[^\d.-]/g, ''));

    // 2. Add to Cart Logic
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-btn")) {
            console.log("Add button clicked"); // Debug log
            
            const item = e.target.closest(".menu-item");
            const baseName = item.querySelector("h3").textContent;
            const basePrice = parsePrice(item.querySelector(".price").textContent);
            const stallName = document.querySelector("h1").textContent;

            let finalName = baseName;
            let addedPrice = 0;
            let selectedAddons = [];

            // Find all checked boxes in THIS item
            const checkboxes = item.querySelectorAll(".addon-checkbox:checked");
            console.log("Checkboxes found:", checkboxes.length); // Debug
            
            checkboxes.forEach(cb => {
                const labelText = cb.parentElement.textContent.trim();
                console.log("Label text:", labelText); // Debug
                
                // Split to get addon name and price
                const nameOnly = labelText.split(" (+")[0].trim();
                const priceMatch = labelText.match(/\+S\$(\d+\.\d+)/);
                const priceOnly = priceMatch ? parseFloat(priceMatch[1]) : 0;
                
                console.log("Addon name:", nameOnly, "Price:", priceOnly); // Debug
                
                finalName += ` + ${nameOnly}`;
                addedPrice += priceOnly;
                selectedAddons.push(nameOnly);
            });

            const totalItemPrice = basePrice + addedPrice;
            
            console.log("Final name:", finalName); // Debug
            console.log("Total price:", totalItemPrice); // Debug
            console.log("Selected addons:", selectedAddons); // Debug

            // Save to localStorage
            let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            
            if (cart[finalName]) {
                cart[finalName].quantity += 1;
            } else {
                cart[finalName] = {
                    price: "S$" + totalItemPrice.toFixed(2),
                    quantity: 1,
                    stall: stallName,
                    baseName: baseName,
                    addons: selectedAddons
                };
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            
            console.log("Cart saved:", cart); // Debug log
            
            // Update UI
            e.target.style.display = "none";
            const qtyDiv = item.querySelector(".qty");
            qtyDiv.style.display = "flex";
            qtyDiv.querySelector("span").textContent = cart[finalName].quantity;
            item.setAttribute("data-cart-key", finalName);
        }

        // 3. Plus/Minus Logic
        if (e.target.classList.contains("qty-btn")) {
            const item = e.target.closest(".menu-item");
            const cartKey = item.getAttribute("data-cart-key");
            let cart = JSON.parse(localStorage.getItem(STORAGE_KEY));

            if (e.target.textContent === "+") {
                cart[cartKey].quantity += 1;
            } else {
                if (cart[cartKey].quantity > 1) {
                    cart[cartKey].quantity -= 1;
                } else {
                    delete cart[cartKey];
                    item.querySelector(".qty").style.display = "none";
                    item.querySelector(".add-btn").style.display = "block";
                    item.removeAttribute("data-cart-key");
                }
            }
            if (cart[cartKey]) {
                item.querySelector(".qty span").textContent = cart[cartKey].quantity;
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        }

        // 4. Like Button Logic
        if (e.target.classList.contains("like")) {
            const item = e.target.closest(".menu-item");
            const itemName = item.querySelector("h3").textContent;
            const stallName = document.querySelector("h1").textContent;
            
            e.target.classList.toggle("active");
            
            let allLikes = JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
            
            if (!allLikes[stallName]) {
                allLikes[stallName] = [];
            }
            
            if (e.target.classList.contains("active")) {
                if (!allLikes[stallName].includes(itemName)) {
                    allLikes[stallName].push(itemName);
                }
            } else {
                allLikes[stallName] = allLikes[stallName].filter(name => name !== itemName);
            }
            
            localStorage.setItem(LIKES_KEY, JSON.stringify(allLikes));
            updateLikeCounter();
        }
    });

    // 5. Restore liked items on page load
    function restoreLikedItems() {
        const allLikes = JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
        const stallName = document.querySelector("h1") ? document.querySelector("h1").textContent : "";
        const likedItems = allLikes[stallName] || [];
        
        document.querySelectorAll(".menu-item").forEach(item => {
            const itemName = item.querySelector("h3").textContent;
            if (likedItems.includes(itemName)) {
                item.querySelector(".like").classList.add("active");
            }
        });
    }

    // 6. Update like counter display
    function updateLikeCounter() {
        const allLikes = JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
        const stallName = document.querySelector("h1") ? document.querySelector("h1").textContent : "";
        const likeCount = (allLikes[stallName] || []).length;
        
        let counter = document.querySelector(".like-counter");
        if (!counter) {
            counter = document.createElement("div");
            counter.className = "like-counter";
            const subtitle = document.querySelector(".subtitle");
            if (subtitle) {
                subtitle.parentNode.insertBefore(counter, subtitle.nextSibling);
            }
        }
        
        counter.innerHTML = `<span class="heart-icon">♥</span> ${likeCount} ${likeCount === 1 ? 'like' : 'likes'} on this stall`;
    }

    // 7. Restore cart UI on page load
    function restoreCartUI() {
        const cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        const currentStall = document.querySelector("h1") ? document.querySelector("h1").textContent : "";
        
        if (!currentStall) return;
        
        document.querySelectorAll(".menu-item").forEach(item => {
            const itemName = item.querySelector("h3").textContent;
            let totalQuantity = 0;
            let matchingKey = null;
            
            Object.keys(cart).forEach(cartKey => {
                if (cart[cartKey].stall === currentStall && 
                    (cart[cartKey].baseName === itemName || cartKey === itemName)) {
                    totalQuantity += cart[cartKey].quantity;
                    if (!matchingKey) matchingKey = cartKey;
                }
            });
            
            if (totalQuantity > 0 && matchingKey) {
                item.querySelector(".add-btn").style.display = "none";
                
                const qtyDiv = item.querySelector(".qty");
                qtyDiv.style.display = "flex";
                qtyDiv.querySelector("span").textContent = totalQuantity;
                
                item.setAttribute("data-cart-key", matchingKey);
            }
        });
    }
});