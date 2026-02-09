function trackOrder() {
  const orderNumber = document.getElementById("orderInput").value;
  if (!orderNumber) {
    alert("Please enter a number!");
    return;
  }

  const statusModal = new bootstrap.Modal(
    document.getElementById("statusModal"),
  );
  const statuses = ["queue", "kitchen", "served"];
  const current = statuses[Math.floor(Math.random() * statuses.length)];

  const title = document.getElementById("statusTitle");
  const desc = document.getElementById("statusDescription");
  const progress = document.getElementById("statusProgress");
  const icon = document.getElementById("statusIcon");

  if (current === "queue") {
    title.innerText = "In the Queue";
    desc.innerText = "4 orders ahead of you.";
    progress.style.width = "33%";
    icon.innerHTML = "⏳";
  } else if (current === "kitchen") {
    title.innerText = "In the Kitchen";
    desc.innerText = "Chef is cooking!";
    progress.style.width = "66%";
    icon.innerHTML = "🔥";
  } else {
    title.innerText = "Ready!";
    desc.innerText = "Pick it up at the counter.";
    progress.style.width = "100%";
    icon.innerHTML = "✅";
  }
  statusModal.show();
}
