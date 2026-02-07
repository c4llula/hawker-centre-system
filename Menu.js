document.addEventListener("DOMContentLoaded", function() {
    const STORAGE_KEY = "hawkersgoCart";
    const LIKES_KEY = "hawkersgoLikes";

    // Initialize likes on page load
    restoreLikedItems();
    updateLikeCounter();

    // 1. Helper: Convert "S$5.50" string to 5.50 number
    const parsePrice = (str) => parseFloat(str.replace(/[^\d.-]/g, ''));

    // 2. Add to Cart Logic
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-btn")) {
            const item = e.target.closest(".menu-item");
            const baseName = item.querySelector("h3").textContent;
            const basePrice = parsePrice(item.querySelector(".price").textContent);
            const stallName = document.querySelector("h1").textContent;

            let finalName = baseName;
            let addedPrice = 0;

            // Find all checked boxes in THIS item
            const checkboxes = item.querySelectorAll(".addon-checkbox:checked");
            checkboxes.forEach(cb => {
                const labelText = cb.parentElement.textContent.trim();
                const nameOnly = labelText.split(" (+")[0];
                const priceOnly = parsePrice(labelText.split("(+")[1] || "0");
                
                finalName += ` + ${nameOnly}`;
                addedPrice += priceOnly;
            });

            const totalItemPrice = basePrice + addedPrice;

            // Save to localStorage
            let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            
            if (cart[finalName]) {
                cart[finalName].quantity += 1;
            } else {
                cart[finalName] = {
                    price: "S$" + totalItemPrice.toFixed(2),
                    quantity: 1,
                    stall: stallName
                };
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            
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
            
            // Get all likes from localStorage
            let allLikes = JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
            
            // Initialize stall array if it doesn't exist
            if (!allLikes[stallName]) {
                allLikes[stallName] = [];
            }
            
            if (e.target.classList.contains("active")) {
                // Add to liked items
                if (!allLikes[stallName].includes(itemName)) {
                    allLikes[stallName].push(itemName);
                }
            } else {
                // Remove from liked items
                allLikes[stallName] = allLikes[stallName].filter(name => name !== itemName);
            }
            
            localStorage.setItem(LIKES_KEY, JSON.stringify(allLikes));
            updateLikeCounter();
        }
    });

    // 5. Restore liked items on page load
    function restoreLikedItems() {
        const allLikes = JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
        const stallName = document.querySelector("h1").textContent;
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
        const stallName = document.querySelector("h1").textContent;
        const likeCount = (allLikes[stallName] || []).length;
        
        // Update or create counter element
        let counter = document.querySelector(".like-counter");
        if (!counter) {
            counter = document.createElement("div");
            counter.className = "like-counter";
            const subtitle = document.querySelector(".subtitle");
            subtitle.parentNode.insertBefore(counter, subtitle.nextSibling);
        }
        
        counter.innerHTML = `<span class="heart-icon">♥</span> ${likeCount} ${likeCount === 1 ? 'like' : 'likes'} on this stall`;
    }
});