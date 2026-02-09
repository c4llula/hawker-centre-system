document.addEventListener("DOMContentLoaded", async function() {
    const stallsContainer = document.getElementById('stalls-container');
    const resetBtn = document.getElementById('reset-btn');
    let allStalls = [];

    const stallImageMap = {
        "Rojak, Popiah & Cockle": "/imgs/Rojak, Popiah & Cockle.webp",
        "Tian Tian Chicken Rice": "/imgs/Tian Tian Hainanese Chicken Rice.webp",
        "Oriental Stall": "/imgs/Oriental Stall.webp",
        "Zhen Zhen Porridge": "/imgs/Zhen Zhen Porridge.webp",
        "Jin Hua Sliced Fish Bee Hoon": "/imgs/Jin Hua Sliced Fish Bee Hoon.webp",
        "1980 Penang Prawn Noodle": "/imgs/1980 Penang Prawn Noodle.webp"
    };

    async function init() {
        try {
            const querySnapshot = await db.collection("vendors").get();
            allStalls = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const name = data.Name || doc.id;
                
                // --- CUSTOM LINK LOGIC ---
                let targetPage = "first-menu-user.html"; // Default for most stalls
                if (name === "Tian Tian Chicken Rice") {
                    targetPage = "Second Menu-user.html"; // Specific page for Tian Tian
                } else if (name === "Rojak, Popiah & Cockle") {
                    targetPage = "first-menu-user.html"; 
                }

                return {
                    name: name,
                    cuisine: (data.Cuisine || "").toLowerCase(),
                    rating: data.Rating || "0",
                    veg: data.Veg === true,
                    waitingTime: data["Waiting Time"] || 30,
                    image: stallImageMap[name] || "/imgs/placeholder.jpg",
                    page: targetPage
                };
            });
            renderStalls(allStalls);
            setupListeners();
        } catch (error) {
            console.error("Firebase Error:", error);
            stallsContainer.innerHTML = "<p>Error loading stalls.</p>";
        }
    }

    function renderStalls(stalls) {
        if (stalls.length === 0) {
            stallsContainer.innerHTML = '<p class="text-muted mt-4">No stalls match these filters.</p>';
            return;
        }

        stallsContainer.innerHTML = stalls.map(stall => `
            <a href="${stall.page}" class="stall-link">
                <article class="stall">
                    <img src="${stall.image}" alt="${stall.name}" onerror="this.src='/imgs/placeholder.jpg'">
                    <div class="stall-info">
                        <div class="stall-name">${stall.name}</div>
                        <div class="stall-time">Waiting Time: ${stall.waitingTime}m</div>
                        <div class="stall-rating">⭐ ${stall.rating}/5</div>
                    </div>
                </article>
            </a>
        `).join('');
    }

    function applyFilters() {
        const selectedCats = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        const selectedCuisines = Array.from(document.querySelectorAll('.filter-cuisine:checked')).map(cb => cb.value);

        const filtered = allStalls.filter(stall => {
            const stallCat = stall.veg ? "veg" : "no-veg";
            const matchesCat = selectedCats.length === 0 || selectedCats.includes(stallCat);
            const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.includes(stall.cuisine);
            return matchesCat && matchesCuisine;
        });
        renderStalls(filtered);
    }

    function setupListeners() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            renderStalls(allStalls);
        });
    }

    init();
});