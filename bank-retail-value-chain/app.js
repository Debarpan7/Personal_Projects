const matrix = document.getElementById("matrix");
const unitFilters = document.getElementById("unitFilters");
const selectionInfo = document.getElementById("selectionInfo");
const clearFilterBtn = document.getElementById("clearFilter");

let selectedUnit = null;

function renderUnitFilters() {
  Object.entries(units).forEach(([id, meta]) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = meta.label;
    chip.dataset.unit = id;
    chip.onclick = () => {
      selectedUnit = selectedUnit === id ? null : id;
      renderUnitFilterState();
      renderMatrix();
    };
    unitFilters.appendChild(chip);
  });
}

function renderUnitFilterState() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.unit === selectedUnit);
  });
}

function buildUnitDots(unitIds) {
  return unitIds
    .map(
      (unitId) =>
        `<span class="unit-dot ${selectedUnit === unitId ? "selected" : ""}" title="${units[unitId].label}"></span>`
    )
    .join("");
}

function renderMatrix() {
  matrix.innerHTML = "";

  const head = document.createElement("tr");
  head.innerHTML = `<th class="row-head">Retail Product / Service</th>${valueChainStages
    .map((stage) => `<th>${stage.label}</th>`)
    .join("")}`;
  matrix.appendChild(head);

  retailLines.forEach((line) => {
    const tr = document.createElement("tr");
    const rowHead = document.createElement("td");
    rowHead.className = "row-head";
    rowHead.textContent = line.name;
    tr.appendChild(rowHead);

    valueChainStages.forEach((stage, stageIndex) => {
      const td = document.createElement("td");
      td.className = "cell available";
      td.style.setProperty("--d", `${stageIndex + 1}`);

      const l2List = line.stages[stage.id] || [];

      td.innerHTML = l2List
        .map((l2) => {
          const unitIds = uniqueUnitsForL2(l2);
          const l2Match = !selectedUnit || unitIds.includes(selectedUnit);
          return `<button class="l2-item ${l2Match ? "" : "dimmed"}" data-line="${line.id}" data-stage="${stage.id}" data-l2="${l2.id}">
              <div class="l2-title">${l2.name}</div>
              <div class="l2-meta">${l2.activities.length} activities</div>
              <div class="unit-dots">${buildUnitDots(unitIds)}</div>
            </button>`;
        })
        .join("");

      tr.appendChild(td);
    });

    matrix.appendChild(tr);
  });

  matrix.querySelectorAll(".l2-item").forEach((item) => {
    item.onclick = () => {
      const params = new URLSearchParams({
        line: item.dataset.line,
        stage: item.dataset.stage,
        l2: item.dataset.l2,
        unit: selectedUnit || "",
      });
      window.location.href = `details.html?${params.toString()}`;
    };
  });

  selectionInfo.textContent = selectedUnit
    ? `Unit filter active: ${units[selectedUnit].label}. Dots and L2 blocks linked to this unit remain emphasized.`
    : "Click a unit to highlight where that unit participates. Single-click any L2 block to open activity flow.";
}

clearFilterBtn.onclick = () => {
  selectedUnit = null;
  renderUnitFilterState();
  renderMatrix();
};

renderUnitFilters();
renderMatrix();
