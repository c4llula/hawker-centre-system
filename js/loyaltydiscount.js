// Global variables to track state
let currentPoints = 0;
let selectedItemName = "";
let selectedItemCost = 0;
let customerId =
  localStorage.getItem("loggedInCustomerId") || "C1k1qYywwIMGn3JAkvt3Ejynali2";

// 1. Fetch Points on Page Load
async function fetchUserPoints() {
  const pointsDisplay = document.getElementById("userPointsDisplay");

  try {
    const doc = await db.collection("customers").doc(customerId).get();
    if (doc.exists) {
      currentPoints = doc.data().Points || 0; // Matches 'Points' field in Firebase
      pointsDisplay.innerText = `${currentPoints} pts`;
    } else {
      pointsDisplay.innerText = "Points: N/A";
      console.error("No such customer document!");
    }
  } catch (error) {
    console.error("Error fetching points:", error);
    pointsDisplay.innerText = "Error";
  }
}

// 2. Prepare the Modal (Triggered by onclick in HTML)
function setRedeemItem(name, cost) {
  selectedItemName = name;
  selectedItemCost = cost;

  document.getElementById("itemName").innerText = name;
  document.getElementById("itemCost").innerText = cost;
}

// 3. Update Firebase after confirmation
async function confirmRedemption() {
  // Check if it's an exclusive deal (no cost) or if points are enough
  if (typeof selectedItemCost === "string") {
    alert("Deal unlocked! Show this screen to the vendor.");
    return;
  }

  if (currentPoints < selectedItemCost) {
    alert("Insufficient points! Keep ordering to earn more.");
    return;
  }

  try {
    const newPoints = currentPoints - selectedItemCost;

    // Update the points in Firestore
    await db.collection("customers").doc(customerId).update({
      Points: newPoints,
    });

    alert(`Successfully redeemed ${selectedItemName}!`);

    // Refresh local points and UI
    currentPoints = newPoints;
    document.getElementById("userPointsDisplay").innerText =
      `${currentPoints} pts`;
  } catch (error) {
    console.error("Redemption Error:", error);
    alert("Redemption failed. Please try again later.");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Wait for firebase-init.js to load the 'db' object
  setTimeout(() => {
    if (typeof db !== "undefined") {
      fetchUserPoints();
    }
  }, 500);
});
