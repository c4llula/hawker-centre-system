// 1. start with 5000 points for simulation
let userPoints = 5000;

// 2. This function runs the moment you click a Reward/Deal box
function setRedeemItem(name, cost) {
  // We find the tags inside the modal and swap their text
  document.getElementById("itemName").innerText = name;
  document.getElementById("itemCost").innerText = cost;
}

// 3. This function runs when you click "Confirm & Redeem" inside the modal
function confirmRedemption() {
  // Get the cost from the modal (converted from text to a number)
  const costText = document.getElementById("itemCost").innerText;
  const cost = parseInt(costText);

  // Check if it's a "Member Deal" (which usually has no point cost)
  if (isNaN(cost)) {
    alert("Success! This deal has been added to your account.");
    return;
  }

  // Logic for Point Redemption
  if (userPoints >= cost) {
    userPoints -= cost; // Subtract points
    alert(
      `Redemption Successful! \nItem: ${document.getElementById("itemName").innerText} \nRemaining Points: ${userPoints}`,
    );
  } else {
    alert("Insufficient Points! Try earning more by ordering food.");
  }
}
