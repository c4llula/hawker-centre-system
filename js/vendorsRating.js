async function displayVendors() {
  const container = document.getElementById("vendor-container");

  container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-dark" role="status"></div>
            <p class="mt-2">Fetching Hawker Data...</p>
        </div>`;

  try {
    const vendorSnapshot = await db.collection("vendors").get();

    if (vendorSnapshot.empty) {
      container.innerHTML =
        "<p class='text-center'>No vendors found in database.</p>";
      return;
    }

    container.innerHTML = "";

    for (const vendorDoc of vendorSnapshot.docs) {
      const vendorData = vendorDoc.data();
      const vendorId = vendorDoc.id;

      // Fetch the 'Reviews' subcollection
      const reviewsSnapshot = await db
        .collection("vendors")
        .doc(vendorId)
        .collection("Reviews")
        .get();

      // auto avg
      let totalRating = 0;
      const reviewsList = reviewsSnapshot.docs.map((doc) => {
        const rData = doc.data();

        // Add this review's rating to total
        totalRating += Number(rData.rating) || 0;

        return rData.comment || rData.text || rData.review || "No review text";
      });

      // Calculate the actual average based on reviews
      // If no reviews exist, fall back to the base 'Rating' in the vendor doc
      let finalRating = 0;
      if (reviewsList.length > 0) {
        finalRating = Math.round(totalRating / reviewsList.length);
      } else {
        finalRating = vendorData.Rating || 0;
      }
      // --- END OF AUTO-AVERAGE LOGIC ---

      // Handle Stars based on our NEW finalRating
      const starsHTML = "★".repeat(finalRating) + "☆".repeat(5 - finalRating);

      const cardHTML = `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 border-2 border-dark shadow-sm">
                        <div class="card-header bg-dark text-white text-center py-1 fw-bold">
                            ${vendorData.Name || vendorId}
                        </div>
                        <div class="card-body small d-flex flex-column">
                            <p class="mb-1"><strong>Rating:</strong> <span class="text-warning">${starsHTML}</span> (${reviewsList.length} reviews)</p>
                            <p class="mb-0 text-muted">Reviews:</p>
                            <ul class="ps-3 mb-2 flex-grow-1">
                                ${
                                  reviewsList.length > 0
                                    ? reviewsList
                                        .map((r) => `<li>${r}</li>`)
                                        .join("")
                                    : "<li>No reviews yet, be the first!</li>"
                                }
                            </ul>
                            <button class="btn btn-link p-0 x-small mt-auto text-decoration-none" 
                                    onclick="selectForReview('${vendorId}')">
                                Review this
                            </button>
                        </div>
                    </div>
                </div>`;

      container.innerHTML += cardHTML;
    }
  } catch (error) {
    console.error("Firebase Read Error:", error);
    container.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  }
}

//  function: Submit a new review
async function submitReview() {
  const vendorId = document.getElementById("reviewVendorName").value;
  const ratingNum = document.getElementById("ratingValue").value;
  const commentBox = document.querySelector("textarea");
  const commentText = commentBox.value;

  if (!vendorId) {
    alert("Please click 'Review this' on a card first!");
    return;
  }

  if (!commentText.trim()) {
    alert("Please enter a comment!");
    return;
  }

  try {
    await db
      .collection("vendors")
      .doc(vendorId)
      .collection("Reviews")
      .add({
        comment: commentText,
        rating: Number(ratingNum),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    alert("Review submitted to " + vendorId + "!");
    document.getElementById("reviewVendorName").value = "";
    commentBox.value = "";
    setRating(0);
    displayVendors();
  } catch (error) {
    console.error("Submit Error:", error);
    alert("Failed to save review.");
  }
}

function selectForReview(name) {
  document.getElementById("reviewVendorName").value = name;
  document
    .getElementById("reviewVendorName")
    .scrollIntoView({ behavior: "smooth" });
}

function setRating(n) {
  document.getElementById("ratingValue").value = n;
  const stars = document.querySelectorAll("#star-container .star-icon");
  stars.forEach((star, index) => {
    if (index < n) {
      star.classList.replace("bi-star", "bi-star-fill");
    } else {
      star.classList.replace("bi-star-fill", "bi-star");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof db !== "undefined") {
      displayVendors();
    }
  }, 400);
});
