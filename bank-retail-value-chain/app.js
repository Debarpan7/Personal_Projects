const data = window.storyData;
const macroCards = document.getElementById("macroCards");
const stakeholderTabs = document.getElementById("stakeholderTabs");
const stakeholderView = document.getElementById("stakeholderView");
const themeGrid = document.getElementById("themeGrid");
const mode = document.getElementById("mode");

let activeStakeholder = 0;

document.querySelectorAll(".reveal-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.target).classList.remove("hidden");
    document.getElementById(button.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function renderMacro() {
  macroCards.innerHTML = data.macro
    .map(
      (item) => `
      <article class="card">
        <h3>${item.icon} ${item.title}</h3>
        <p><strong>Pressure:</strong> ${item.pressure}</p>
        <p><strong>Impact:</strong> ${item.impact}</p>
      </article>`
    )
    .join("");
}

function renderStakeholders() {
  stakeholderTabs.innerHTML = data.stakeholders
    .map((s, i) => `<button data-i="${i}" class="${i === activeStakeholder ? "active" : ""}">${s.role}</button>`)
    .join("");

  const current = data.stakeholders[activeStakeholder];
  stakeholderView.innerHTML = `
    <h3>${current.role}</h3>
    <p><strong>Main KPIs</strong></p>
    <ul>${current.kpis.map((k) => `<li>${k}</li>`).join("")}</ul>
    <p><strong>KPI drivers</strong></p>
    <ul>${current.drivers.map((d) => `<li>${d}</li>`).join("")}</ul>
    <p><strong>AI leverage</strong></p>
    <ul>${current.ai.map((a) => `<li>${a}</li>`).join("")}</ul>
  `;

  stakeholderTabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeStakeholder = Number(btn.dataset.i);
      renderStakeholders();
    });
  });
}

function renderThemes() {
  const selected = mode.value;
  themeGrid.innerHTML = data.themes
    .map(
      (theme) => `
      <article class="card">
        <h3>${theme.icon} ${theme.title}</h3>
        <p>${theme.why}</p>
        <ul>${theme[selected].map((step) => `<li>${step}</li>`).join("")}</ul>
      </article>`
    )
    .join("");
}

mode.addEventListener("change", renderThemes);
renderMacro();
renderStakeholders();
renderThemes();
