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
    chip.title = meta.type;
    chip.onclick = () => {
      selectedUnit = selectedUnit === id ? null : id;
      renderUnitFiltersState();
      renderMatrix();
    };
    unitFilters.appendChild(chip);
  });
}

function renderUnitFiltersState() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.unit === selectedUnit);
  });
}

function getCellClass(cellUnits) {
  if (!cellUnits || !cellUnits.length) return "cell";
  if (!selectedUnit) return "cell available";
  return cellUnits.includes(selectedUnit)
    ? "cell available highlight"
    : "cell available dimmed";
}

function renderMatrix() {
  matrix.innerHTML = "";

  const head = document.createElement("tr");
  head.innerHTML = `<th class="row-head">Retail Line of Business</th>${valueChainStages
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
      td.style.setProperty("--d", `${stageIndex + 1}`);
      const stageUnits = line.stages[stage.id] || [];
      td.className = getCellClass(stageUnits);

      if (stageUnits.length) {
        td.innerHTML = `<strong>${stage.label}</strong>
          <div class="unit-tags">${stageUnits
            .map((u) => `<span class="unit-tag">${units[u].label}</span>`)
            .join("")}</div>`;

        td.ondblclick = () => {
          const params = new URLSearchParams({
            line: line.id,
            stage: stage.id,
            unit: selectedUnit || "",
          });
          window.location.href = `details.html?${params.toString()}`;
        };
      }
      tr.appendChild(td);
    });

    matrix.appendChild(tr);
  });

  selectionInfo.textContent = selectedUnit
    ? `Active Unit Filter: ${units[selectedUnit].label}. Double-click highlighted L1 blocks to view detailed flow.`
    : "No unit filter selected. Click a unit above to instantly highlight where that unit participates.";
}

clearFilterBtn.onclick = () => {
  selectedUnit = null;
  renderUnitFiltersState();
  renderMatrix();
};

renderUnitFilters();
renderMatrix();
