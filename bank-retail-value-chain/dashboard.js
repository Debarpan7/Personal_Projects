async function loadFinancialData() {
  const fallback = await fetch("./sbi_financials.json").then((response) => response.json());
  return fallback;
}

function buildCharts(data) {
  const common = {
    responsive: true,
    plugins: { legend: { labels: { color: "#334155", font: { family: "Public Sans" } } } },
    scales: {
      x: { ticks: { color: "#475569" }, grid: { color: "#e2e8f0" } },
      y: { ticks: { color: "#475569" }, grid: { color: "#e2e8f0" } }
    }
  };

  new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
      labels: data.periods,
      datasets: [
        { label: "NIM %", data: data.nim_pct, borderColor: "#60a5fa", backgroundColor: "#60a5fa", tension: 0.3 },
        { label: "Cost-to-income %", data: data.cost_to_income_pct, borderColor: "#fda4af", backgroundColor: "#fda4af", tension: 0.3 },
        { label: "Gross NPA %", data: data.gross_npa_pct, borderColor: "#6ee7b7", backgroundColor: "#6ee7b7", tension: 0.3 }
      ]
    },
    options: common
  });

  new Chart(document.getElementById("pressureChart"), {
    type: "bar",
    data: {
      labels: Object.keys(data.pressure_by_layer),
      datasets: [{
        label: "Pressure Index",
        data: Object.values(data.pressure_by_layer),
        backgroundColor: "#c4b5fd"
      }]
    },
    options: common
  });

  new Chart(document.getElementById("aiImpactChart"), {
    type: "bar",
    data: {
      labels: Object.keys(data.ai_impact),
      datasets: [{
        label: "Estimated annual impact (₹ Cr equivalent index)",
        data: Object.values(data.ai_impact),
        backgroundColor: ["#93c5fd", "#f9a8d4", "#86efac", "#fde68a"]
      }]
    },
    options: { ...common, indexAxis: "y" }
  });
}

loadFinancialData().then(buildCharts);
