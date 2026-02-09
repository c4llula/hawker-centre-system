document.addEventListener("DOMContentLoaded", async function() {
    const foodImageMap = {
        "Steam Chicken Rice": "/imgs/Steam Chicken Rice.jpg",
        "Roasted Chicken Rice": "/imgs/Roasted Chicken Rice.avif",
        "BBQ Chicken Rice": "/imgs/BBQ Chicken Rice.webp",
        "Chicken Gizzard": "/imgs/Chicken Gizzard.webp",
        "Extra Rice": "/imgs/Bowl of Rice.webp",
        "Roast Pork Slices": "/imgs/Roast Pork Slices.webp",
        "Rojak": "/imgs/rojak.jpg",
        "Popiah": "/imgs/popiah.jpeg",
        "Cockle Laksa": "/imgs/Cockle Laksa.jpg",
        "Chicken Satays": "/imgs/Chicken Satay Sticks.jpg",
        "Tau Pok": "/imgs/Tau Pok.jpg",
        "Century Egg & Tofu": "/imgs/Century Egg & Tofu.jpg",
        "Iced Milo": "/imgs/Iced Chocolate.jpg",
        "Sugarcane Juice": "/imgs/Sugarcane Juice.jpg",
        "Teh Tarik": "/imgs/Teh Tarik.jpg"
    };

    const classicsGrid = document.getElementById('classics-grid');
    const addonsGrid = document.getElementById('addons-grid');
    const drinksGrid = document.getElementById('drinks-grid');
    const template = document.getElementById('food-item-template');

    // Vendor Detection
    const pageTitle = document.querySelector('h1')?.textContent || "";
    let vendorDoc = "Tian Tian Chicken Rice"; 
    if (pageTitle.toLowerCase().includes("rojak") || pageTitle.toLowerCase().includes("cockle")) {
        vendorDoc = "Rojak, Popiah & Cockle"; 
    }

    async function loadMenu() {
        try {
            const querySnapshot = await db.collection("vendors")
                                        .doc(vendorDoc)
                                        .collection("Menu")
                                        .get();

            querySnapshot.forEach(doc => {
                const item = doc.data();
                const itemName = item.Name || "Unknown";
                const lowerName = itemName.toLowerCase();
                
                const clone = template.content.cloneNode(true);
                clone.querySelector('h3').textContent = itemName;
                clone.querySelector('.description').textContent = item.Description || "";
                
                const priceValue = parseFloat(item.Price || 0);
                clone.querySelector('.price').textContent = `$${priceValue.toFixed(2)}`;
                clone.querySelector('img').src = foodImageMap[itemName] || "/imgs/placeholder-food.jpg";

                const addonContainer = clone.querySelector('.simple-addons');
                
                // --- CLASSIFICATION ---
                const isDrink = ["milo", "sugarcane", "teh", "juice"].some(d => lowerName.includes(d));
                const isMain = ["laksa", "rojak", "popiah"].some(m => lowerName.includes(m)) || 
                               (lowerName.includes("rice") && !lowerName.includes("extra"));

                // --- FIREBASE ADD-ONS ---
                if (isMain) {
                    if (item.Addons && Array.isArray(item.Addons) && item.Addons.length >= 2) {
                        addonContainer.style.display = "block";
                        addonContainer.innerHTML = ""; 
                        
                        const label = document.createElement('label');
                        label.className = "d-block small mt-1";
                        // Added a specific class 'addon-checkbox' and data attributes for the script to find later
                        label.innerHTML = `<input type="checkbox" class="me-2 addon-checkbox" data-addon-name="${item.Addons[0]}" data-addon-price="${item.Addons[1]}"> ${item.Addons[0]} (+$${parseFloat(item.Addons[1]).toFixed(2)})`;
                        addonContainer.appendChild(label);
                    } else {
                        addonContainer.style.display = "none";
                    }
                } else {
                    addonContainer.style.display = "none";
                }

                // --- NEW: ADD TO CART LOGIC ---
                const addBtn = clone.querySelector('.add-btn') || clone.querySelector('button');
                if (addBtn) {
                    addBtn.addEventListener('click', function() {
                        let currentCart = JSON.parse(localStorage.getItem('hawkerCart')) || [];
                        
                        // Calculate price with addons
                        let finalPrice = priceValue;
                        let selectedAddons = [];
                        
                        // Look inside the specific card for checked boxes
                        const card = addBtn.closest('.food-item') || addBtn.parentElement;
                        const checkboxes = card.querySelectorAll('.addon-checkbox');
                        
                        checkboxes.forEach(cb => {
                            if (cb.checked) {
                                finalPrice += parseFloat(cb.dataset.addonPrice);
                                selectedAddons.push(cb.dataset.addonName);
                            }
                        });

                        // Create unique name if there are addons (to prevent stacking rice with gizzard on top of plain rice)
                        const cartItemName = selectedAddons.length > 0 ? `${itemName} (+${selectedAddons.join(', ')})` : itemName;

                        // Check if exact same item exists
                        const existingItem = currentCart.find(i => i.name === cartItemName);

                        if (existingItem) {
                            existingItem.quantity += 1;
                        } else {
                            currentCart.push({
                                name: cartItemName,
                                price: finalPrice,
                                quantity: 1
                            });
                        }

                        localStorage.setItem('hawkerCart', JSON.stringify(currentCart));
                        alert(`${cartItemName} added to cart!`);
                    });
                }

                // --- GRID ROUTING ---
                if (isDrink) {
                    drinksGrid.appendChild(clone);
                } else if (isMain) {
                    classicsGrid.appendChild(clone);
                } else {
                    addonsGrid.appendChild(clone);
                }
            });
        } catch (error) {
            console.error("Error loading menu:", error);
        }
    }
    loadMenu();
});