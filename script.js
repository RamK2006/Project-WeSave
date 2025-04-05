let userData = JSON.parse(localStorage.getItem("userData")) || {
  budget: 0,
  expenditures: []
};

function saveData() {
  localStorage.setItem("userData", JSON.stringify(userData));
}

function setBudget() {
  const input = document.getElementById("budgetInput").value;
  const budget = parseFloat(input);
  if (!isNaN(budget) && budget >= 0) {
    userData.budget = budget;
    saveData();
    document.getElementById("currentBudget").textContent = `Budget: ₹${budget}`;
  }
}

function addExpenditure() {
  const amountInput = document.getElementById("amountInput").value;
  const reasonInput = document.getElementById("reasonInput").value.trim();
  const amount = parseFloat(amountInput);
  const reason = reasonInput || "Others";

  if (!isNaN(amount) && amount > 0) {
    userData.expenditures.push({ amount, reason });
    saveData();
    updateMonthlyExpenditureSection();
  }
}

function updateMonthlyExpenditureSection() {
  const categories = ["Friends", "Stationary", "Travel", "Food & Meals", "Others"];
  const categoryTotals = {
    Friends: 0,
    Stationary: 0,
    Travel: 0,
    "Food & Meals": 0,
    Others: 0
  };

  userData.expenditures.forEach(item => {
    const key = categories.includes(item.reason) ? item.reason : "Others";
    categoryTotals[key] += item.amount;
  });

  const tbody = document.querySelector("#monthlyExpenditureTable tbody");
  tbody.innerHTML = "";
  categories.forEach(cat => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${cat}</td><td>₹${categoryTotals[cat].toFixed(2)}</td>`;
    tbody.appendChild(row);
  });

  const ctx = document.getElementById("monthlyExpenditureChart").getContext("2d");
  if (window.monthlyChart) window.monthlyChart.destroy();

  window.monthlyChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        data: categories.map(c => categoryTotals[c]),
        backgroundColor: ["#1b98e0", "#76c7c0", "#383e56", "#bbe1fa", "#0f4c75"],
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ₹${context.raw.toFixed(2)}`;
            }
          }
        },
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// Initialize on load
window.onload = function () {
  document.getElementById("currentBudget").textContent = `Budget: ₹${userData.budget}`;
  updateMonthlyExpenditureSection();
};
