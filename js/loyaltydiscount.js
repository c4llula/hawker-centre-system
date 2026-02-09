let currentPoints = 0;
let selectedItemName = "";
let selectedItemCost = 0;

const userDataString = localStorage.getItem("currentUser");
const userData = userDataString ? JSON.parse(userDataString) : null;

let customerId =
  userData && userData.uid ? userData.uid : "C1k1qYywwIMGn3JAkvt3Ejynali2";

async function fetchUserPoints() {
  const pointsDisplay = document.getElementById("userPointsDisplay");

  try {
    const doc = await db.collection("customers").doc(customerId).get();

    if (doc.exists) {
      const data = doc.data();
      currentPoints = data.Points !== undefined ? data.Points : 0;
      pointsDisplay.innerHTML = `<i class="bi bi-coin"></i> ${currentPoints} pts`;
    } else {
      pointsDisplay.innerText = "0 pts";
    }
  } catch (error) {
    console.error(error);
    pointsDisplay.innerText = "Error Loading";
  }
}

function setRedeemItem(name, cost) {
  selectedItemName = name;
  selectedItemCost = cost;

  document.getElementById("itemName").innerText = name;
  document.getElementById("itemCost").innerText = cost;
}

async function confirmRedemption() {
  if (typeof selectedItemCost === "string") {
    alert("Deal unlocked! Please show this to the vendor.");
    return;
  }

  if (currentPoints < selectedItemCost) {
    alert(
      "Insufficient points! You need " +
        (selectedItemCost - currentPoints) +
        " more points.",
    );
    return;
  }

  try {
    const newPoints = currentPoints - selectedItemCost;

    await db.collection("customers").doc(customerId).update({
      points: newPoints,
    });

    alert(
      `Successfully redeemed ${selectedItemName}! Your new balance is ${newPoints} pts.`,
    );

    currentPoints = newPoints;
    document.getElementById("userPointsDisplay").innerHTML =
      `<i class="bi bi-coin"></i> ${currentPoints} pts`;
  } catch (error) {
    console.error(error);
    alert("Transaction failed. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkFirebase = setInterval(() => {
    if (typeof db !== "undefined") {
      fetchUserPoints();
      clearInterval(checkFirebase);
    }
  }, 100);
});
