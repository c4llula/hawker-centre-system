
const chartData = {
  byDay: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    data: [120, 150, 145, 127, 151],
    title: "Sales by Day (Last Week)"
  },
  byHour: {
    labels: ["07 - 10", "10 - 13", "13 - 16", "16 - 19", "19 - 22"],
    data: [20, 39, 44, 41, 15],
    title: "Sales by Hour (Today)"
  }
};

const ctx = document.getElementById("salesChart");

const salesChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: chartData.byHour.labels,
    datasets: [{
      data: chartData.byHour.data,
      backgroundColor: "#59a96a",
      borderRadius: 6,
      barThickness: 40
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false }
    }
  }
});

const viewSelect = document.getElementById("view");

viewSelect.addEventListener("change", () => {
  const selectedView = viewSelect.value;
  const selectedData = chartData[selectedView];

  // Update chart data
  salesChart.data.labels = selectedData.labels;
  salesChart.data.datasets[0].data = selectedData.data;

  // Update title
  document.getElementById("salesChartTitle").textContent = selectedData.title;

  salesChart.update();
});

const data = [
  { img: "Menu Images/Rojak.jpg", text: "Rojak" },
  { img: "Menu Images/Cockle Laksa.jpg", text: "Laksa" },
  { img: "Menu Images/Popiah.jpeg", text: "Popiah" },
  { img: "Menu Images/Chicken Satay Sticks.jpg", text: "Chicken Satay" },
  { img: "Menu Images/Tau Pok.jpg", text: "Tau Pok" }
];

const container = document.getElementById("popularItems");

data.forEach(item => {
  const card = document.createElement("div");
  card.className = "popItem";

  card.innerHTML = `
    <img src="${item.img}" alt="">
    <p>${item.text}</p>
  `;

  container.appendChild(card);
});

const inspections = [
  {
    date: "2025-01-15",
    inspector: "NEA",
    score: 92,
    grade: "A"
  },
  {
    date: "2024-09-10",
    inspector: "NEA",
    score: 78,
    grade: "B"
  },
  {
    date: "2024-05-03",
    inspector: "NEA",
    score: 55,
    grade: "C"
  }
];

const inspectionTable = document.getElementById("inspectionHistory");

inspections.forEach(item => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${item.date}</td>
    <td>${item.inspector}</td>
    <td>${item.score}</td>
    <td>
      ${item.grade}
    </td>
  `;

  inspectionTable.appendChild(row);
});

const reviews = [
  {
    rating: 5,
    date: "2025-02-05",
    text: "Amazing food! The chicken rice was delicious and service was fast. Definitely coming back!",
    sentiment: "positive"
  },
  {
    rating: 4,
    date: "2025-02-04",
    text: "Good quality food, though the wait time was a bit long during lunch hour.",
    sentiment: "neutral"
  },
  {
    rating: 2,
    date: "2025-02-03",
    text: "Food was cold when it arrived and portion size was smaller than expected.",
    sentiment: "negative"
  },
  {
    rating: 5,
    date: "2025-02-02",
    text: "Best laksa in the area! Love the rich broth and generous toppings.",
    sentiment: "positive"
  },
  {
    rating: 3,
    date: "2025-02-01",
    text: "Food is okay but nothing special. Price is reasonable though.",
    sentiment: "neutral"
  }
];

const reviewsList = document.getElementById("reviewsList");

reviews.forEach(review => {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  
  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";
  
  reviewCard.innerHTML = `
    <div class="review-header">
      <span class="review-rating">${stars}</span>
      <span class="review-date">${review.date}</span>
    </div>
    <div class="review-text">${review.text}</div>
    <span class="review-sentiment sentiment-${review.sentiment}">
      ${review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
    </span>
  `;
  
  reviewsList.appendChild(reviewCard);
});

const complaintCategories = [
  {
    category: "Food Quality",
    count: 12,
    percentage: 43
  },
  {
    category: "Service Speed",
    count: 8,
    percentage: 29
  },
  {
    category: "Portion Size",
    count: 5,
    percentage: 18
  },
  {
    category: "Cleanliness",
    count: 3,
    percentage: 11
  }
];

const complaintsGrid = document.getElementById("complaintsGrid");

complaintCategories.forEach(complaint => {
  const categoryCard = document.createElement("div");
  categoryCard.className = "complaint-category";
  
  categoryCard.innerHTML = `
    <h5>${complaint.category}</h5>
    <div class="complaint-count">${complaint.count}</div>
    <div class="complaint-bar">
      <div class="complaint-fill" style="width: ${complaint.percentage}%"></div>
    </div>
    <div class="stat-subtext">${complaint.percentage}% of complaints</div>
  `;
  
  complaintsGrid.appendChild(categoryCard);
});