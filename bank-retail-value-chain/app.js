const data = window.storyData;

const macroTicker = document.getElementById("macroTicker");
const macroGrid = document.getElementById("macroGrid");
const impactTrace = document.getElementById("impactTrace");
const layerStrip = document.getElementById("layerStrip");
const layerDetails = document.getElementById("layerDetails");
const stakeholderList = document.getElementById("stakeholderList");
const stakeholderDetail = document.getElementById("stakeholderDetail");
const themeCards = document.getElementById("themeCards");
const maturity = document.getElementById("maturity");
const maturityLabel = document.getElementById("maturityLabel");

let activeMacro = 0;
let activeLayer = 0;
let activeStakeholder = 0;

const maturityMap = ["pilot", "accelerate", "scale"];
const maturityNames = ["Pilot", "Accelerate", "Scale"];

function renderTicker() {
  macroTicker.innerHTML = data.macroTicker
    .map((item) => `<div class="stat"><span>${item.label}</span><b>${item.value}</b></div>`)
    .join("");
}

function renderMacro() {
  macroGrid.innerHTML = data.macroFactors
    .map(
      (factor, idx) => `
      <article class="macro-card ${idx === activeMacro ? "active" : ""}" data-macro="${idx}">
        <h3>${factor.name}</h3>
        <p><strong>Signal:</strong> ${factor.signal}</p>
      </article>`
    )
    .join("");

  const item = data.macroFactors[activeMacro];
  impactTrace.innerHTML = `
    <h3>Impact pathway</h3>
    <p><strong>Primary effects:</strong> ${item.effects.join(" → ")}</p>
    <p><strong>Where SBI struggles:</strong> ${item.sbiStruggle}</p>
  `;

  macroGrid.querySelectorAll("[data-macro]").forEach((node) => {
    node.addEventListener("click", () => {
      activeMacro = Number(node.dataset.macro);
      renderMacro();
    });
  });
}

function renderLayers() {
  layerStrip.innerHTML = data.layers
    .map((layer, idx) => `<button class="layer-btn ${idx === activeLayer ? "active" : ""}" data-layer="${idx}">${layer.name}</button>`)
    .join("");

  const current = data.layers[activeLayer];
  layerDetails.innerHTML = `
    <h3>${current.name}</h3>
    <p><strong>Primary focus:</strong> ${current.focus}</p>
    <p><strong>GenAI opportunity:</strong> ${current.ai}</p>
  `;

  layerStrip.querySelectorAll("[data-layer]").forEach((node) => {
    node.addEventListener("click", () => {
      activeLayer = Number(node.dataset.layer);
      renderLayers();
    });
  });
}

function renderStakeholders() {
  stakeholderList.innerHTML = data.stakeholders
    .map(
      (stakeholder, idx) =>
        `<button class="${idx === activeStakeholder ? "active" : ""}" data-stakeholder="${idx}">${stakeholder.role}</button>`
    )
    .join("");

  const current = data.stakeholders[activeStakeholder];
  stakeholderDetail.innerHTML = `
    <h3>${current.role}</h3>
    <p><strong>Main KPIs:</strong></p>
    <ul>${current.kpis.map((kpi) => `<li>${kpi}</li>`).join("")}</ul>
    <p><strong>Macro pressures:</strong> ${current.impactedBy.join(", ")}</p>
    <p><strong>KPI drivers:</strong></p>
    <ul>${current.drivers.map((driver) => `<li>${driver}</li>`).join("")}</ul>
    <p><strong>AI/GenAI impact levers:</strong></p>
    <ul>${current.aiImpact.map((impact) => `<li>${impact}</li>`).join("")}</ul>
  `;

  stakeholderList.querySelectorAll("[data-stakeholder]").forEach((node) => {
    node.addEventListener("click", () => {
      activeStakeholder = Number(node.dataset.stakeholder);
      renderStakeholders();
    });
  });
}

function renderThemes() {
  const mode = maturityMap[Number(maturity.value)];
  maturityLabel.textContent = maturityNames[Number(maturity.value)];

  themeCards.innerHTML = data.themes
    .map(
      (theme) => `
      <article class="theme-card">
        <h3>${theme.title}</h3>
        <p>${theme.why}</p>
        <ul>${theme.plays[mode].map((play) => `<li>${play}</li>`).join("")}</ul>
      </article>`
    )
    .join("");
}

maturity.addEventListener("input", renderThemes);

renderTicker();
renderMacro();
renderLayers();
renderStakeholders();
renderThemes();
