function displayVendors() {
  const container = document.getElementById("vendor-container");
  container.innerHTML = ""; // Clear existing "Vendor Name" cards

  // allVendors from vendors.js
  allVendors.forEach((vendor) => {
    // We create the HTML for a card using a "Template Literal"
    const cardHTML = `  
            <div class="col-md-6">
                <div class="card h-100 border-2 border-dark shadow-sm">
                    <div class="card-header bg-dark text-white text-center py-1 fw-bold">
                        ${vendor.name}
                    </div>
                    <div class="card-body small">
                        <p class="mb-1"><strong>Rating:</strong> ${vendor.rating}</p>
                        <p class="mb-0 text-muted">Reviews:</p>
                        <ul class="ps-3 mb-0">
                            ${vendor.reviews.map((r) => `<li>${r}</li>`).join("")}
                        </ul>
                        <button class="btn btn-link p-0 x-small mt-auto text-decoration-none" 
                                onclick="selectForReview('${vendor.name}')">Review this</button>
                    </div>
                </div>
            </div>
        `;
    container.innerHTML += cardHTML;
  });
}

// Helper to put the name into your Review Form automatically
function selectForReview(name) {
  document.getElementById("reviewVendorName").value = name;
}

// Run this when the page loads
window.onload = displayVendors;

function setRating(n) {
  // 1. Save the number to our hidden input
  document.getElementById("ratingValue").value = n;

  // 2. Get all the star icons
  const stars = document.querySelectorAll("#star-container .star-icon");

  // 3. Loop through them
  stars.forEach((star, index) => {
    if (index < n) {
      // Fill the star
      star.classList.replace("bi-star", "bi-star-fill");
    } else {
      // Empty the star
      star.classList.replace("bi-star-fill", "bi-star");
    }
  });
}

function submitReview() {
  const vendor = document.getElementById("reviewVendorName").value;
  if (!vendor) {
    alert("Please enter a vendor name!");
    return;
  }
  alert("Thank you! Your review for " + vendor + " has been submitted.");
  // Clear the form
  document.getElementById("reviewVendorName").value = "";
}
