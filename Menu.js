document.addEventListener("DOMContentLoaded", function() {
    const STORAGE_KEY = "hawkersgoCart";

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
                // Extract name and price from text like "Extra Peanuts (+S$0.50)"
                const nameOnly = labelText.split(" (+")[0];
                const priceOnly = parsePrice(labelText.split("(+")[1] || "0");
                
                finalName += ` + ${nameOnly}`;
                addedPrice += priceOnly;
            });

            const totalItemPrice = basePrice + addedPrice;

            // Save to localStorage
            let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            
            // If this exact combo exists, increase qty, else create new
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
    });
});