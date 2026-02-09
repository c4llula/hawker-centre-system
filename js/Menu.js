document.addEventListener("DOMContentLoaded", async function() {
    console.log("=== MENU LOADING ===");

    // 1. HARDCODED Image Map
    // TIP: Check your "Sugarcane Juice" file in your folder. 
    // Is it .jpg? .png? .webp? The spelling must be EXACT.
    const foodImageMap = {
        "Steam Chicken Rice": "../../../imgs/Steam Chicken Rice.jpg",
        "Roasted Chicken Rice": "../../../imgs/Roasted Chicken Rice.avif",
        "BBQ Chicken Rice": "../../../imgs/BBQ Chicken Rice.webp",
        "Chicken Gizzard": "../../../imgs/Chicken Gizzard.webp",
        "Extra Rice": "../../../imgs/Bowl of Rice.webp",
        "Roast Pork Slices": "../../../imgs/Roast Pork Slices.webp",
        "Iced Milo": "../../../imgs/Iced Chocolate.jpg",
        "Sugarcane Juice": "../../../imgs/Sugarcane Juice.jpg", 
        "Teh Tarik": "../../../imgs/Teh Tarik.jpg"
    };

    const classicsGrid = document.getElementById('classics-grid');
    const addonsGrid = document.getElementById('addons-grid');
    const drinksGrid = document.getElementById('drinks-grid');
    const template = document.getElementById('food-item-template');

    async function loadMenu() {
        try {
            const querySnapshot = await db.collection("vendors")
                                        .doc("Tian Tian Chicken Rice")
                                        .collection("Menu")
                                        .get();

            if (querySnapshot.empty) {
                console.warn("No menu items found!");
                return;
            }

            querySnapshot.forEach(doc => {
                const item = doc.data();
                const itemName = item.Name || "Unknown Item";
                
                // 1. Category Logic (Handles "Classic", "Classics", "classic ")
                let rawCategory = (item.Category || "").toLowerCase().trim();
                let category = rawCategory;

                if (rawCategory.includes("classic")) category = "classic";
                else if (rawCategory.includes("addon") || rawCategory.includes("side")) category = "addons";
                else if (rawCategory.includes("drink")) category = "drinks";

                // 2. Create Card
                const clone = template.content.cloneNode(true);
                clone.querySelector('h3').textContent = itemName;
                clone.querySelector('.description').textContent = item.Description || "";
                
                // Price formatting
                clone.querySelector('.price').textContent = `$${parseFloat(item.Price || 0).toFixed(2)}`;
                
                // 3. Image Logic with Fallback
                const imgTag = clone.querySelector('img');
                // Use trim() to fix database names with accidental spaces
                const cleanName = itemName.trim(); 
                imgTag.src = foodImageMap[cleanName] || "../../../imgs/placeholder-food.jpg";
                imgTag.alt = cleanName;
                imgTag.onerror = function() { 
                    console.warn("Image missing for:", cleanName);
                    this.src = "../../../imgs/placeholder-food.jpg"; 
                };

                // 4. SMART ADD-ON PARSER
                const addOnsContainer = clone.querySelector('.simple-addons');
                const rawAddons = item['Add Ons'];

                // Only show add-ons for Classics
                if (category === "classic" && Array.isArray(rawAddons) && rawAddons.length > 0) {
                    
                    let parsedAddons = [];

                    // DETECT DATA TYPE:
                    // Scenario A: The "Flat Pair" [ "Extra Chicken", 1 ] (This is what you have!)
                    if (rawAddons.length === 2 && typeof rawAddons[0] === 'string' && typeof rawAddons[1] === 'number') {
                        parsedAddons.push({ name: rawAddons[0], price: rawAddons[1] });
                    } 
                    // Scenario B: Standard List of Objects [ {name:..., price:...}, ... ]
                    else {
                        rawAddons.forEach(addon => {
                            if (typeof addon === 'object') {
                                // Handle both {name: "x", price: 1} AND {0: "x", 1: 1}
                                const name = addon.name || addon['0']; 
                                const price = addon.price || addon['1'];
                                if (name) parsedAddons.push({ name, price });
                            }
                        });
                    }

                    // Render the parsed add-ons
                    if (parsedAddons.length > 0) {
                        addOnsContainer.innerHTML = '<p class="add-ons-label"><strong>Add Ons:</strong></p>';
                        
                        parsedAddons.forEach((addon, index) => {
                            const addonLabel = document.createElement('label');
                            addonLabel.className = 'addon-checkbox';
                            const priceDisplay = addon.price ? `(+$${parseFloat(addon.price).toFixed(2)})` : '';
                            
                            addonLabel.innerHTML = `
                                <input type="checkbox" name="addon-${doc.id}-${index}" value="${addon.name}" data-price="${addon.price || 0}">
                                <span>${addon.name} ${priceDisplay}</span>
                            `;
                            addOnsContainer.appendChild(addonLabel);
                        });
                    }
                } else {
                    addOnsContainer.style.display = 'none'; // Hide empty container
                }

                // 5. Append to Grid
                if (category === "classic") classicsGrid.appendChild(clone);
                else if (category === "addons") addonsGrid.appendChild(clone);
                else if (category === "drinks") drinksGrid.appendChild(clone);
                else classicsGrid.appendChild(clone); // Fallback
            });

        } catch (error) {
            console.error("Error loading menu:", error);
        }
    }

    loadMenu();
});