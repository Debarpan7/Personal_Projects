const matrix = document.getElementById("matrix");
const unitFilters = document.getElementById("unitFilters");
const selectionInfo = document.getElementById("selectionInfo");
const clearFilterBtn = document.getElementById("clearFilter");
const configEditor = document.getElementById("configEditor");
const editToggle = document.getElementById("editToggle");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const resetConfigBtn = document.getElementById("resetConfigBtn");
const downloadConfigBtn = document.getElementById("downloadConfigBtn");
const statusLine = document.getElementById("statusLine");

<<<<<<< HEAD
const pageQuery = new URLSearchParams(window.location.search);
let selectedUnit = pageQuery.get("unit") || localStorage.getItem("retail_selected_unit") || null;
=======
<<<<<<< codex/design-one-page-website-for-bank-services-mapping-0pvmkb
const pageQuery = new URLSearchParams(window.location.search);
let selectedUnit = pageQuery.get("unit") || localStorage.getItem("retail_selected_unit") || null;
=======
let selectedUnit = null;
>>>>>>> main
>>>>>>> main
let editMode = false;
let config = null;

function unitLabel(id) {
  return config.units.find((u) => u.id === id)?.label || id;
}

function renderUnitFilters() {
  unitFilters.innerHTML = "";
  const fragment = document.createDocumentFragment();
  config.units.forEach((unit) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = unit.label;
    chip.dataset.unit = unit.id;
    chip.onclick = () => {
      selectedUnit = selectedUnit === unit.id ? null : unit.id;
<<<<<<< HEAD
      if (selectedUnit) localStorage.setItem("retail_selected_unit", selectedUnit);
      else localStorage.removeItem("retail_selected_unit");
=======
<<<<<<< codex/design-one-page-website-for-bank-services-mapping-0pvmkb
      if (selectedUnit) localStorage.setItem("retail_selected_unit", selectedUnit);
      else localStorage.removeItem("retail_selected_unit");
=======
>>>>>>> main
>>>>>>> main
      render();
    };
    fragment.appendChild(chip);
  });
  unitFilters.appendChild(fragment);
}

function renderMatrix() {
  matrix.innerHTML = "";
  const head = document.createElement("tr");
  head.innerHTML = `<th class="row-head">Product / LOB / Service</th>${config.stages.map((s) => `<th>${s.label}</th>`).join("")}`;
  matrix.appendChild(head);

  const bodyFragment = document.createDocumentFragment();

  config.lobs.forEach((lob) => {
    const tr = document.createElement("tr");
    const rowHead = document.createElement("td");
    rowHead.className = "row-head";
    rowHead.textContent = lob.name;
    tr.appendChild(rowHead);

    config.stages.forEach((stage) => {
      const td = document.createElement("td");
      td.className = "cell available";
      const l2s = lob.stages[stage.id] || [];

      const l2Html = l2s
        .map((l2) => {
          const units = uniqueUnitsForL2(l2);
          const match = !selectedUnit || units.includes(selectedUnit);
          return `<button class="l2-item ${match ? "" : "dimmed"}" data-lob="${lob.id}" data-stage="${stage.id}" data-l2="${l2.id}">
            <div class="l2-title">${l2.name}</div>
            <div class="l2-meta">${(l2.activities || []).length} activities</div>
            <div class="unit-dots">${units
              .map((u) => `<span class="unit-dot ${u === selectedUnit ? "selected" : ""}" title="${unitLabel(u)}"></span>`)
              .join("")}</div>
          </button>`;
        })
        .join("");

      td.innerHTML = `${l2Html}${editMode ? `<button class="mini-btn" data-add-l2="${lob.id}|${stage.id}">+ L2</button>` : ""}`;
      tr.appendChild(td);
    });

    bodyFragment.appendChild(tr);
  });

  matrix.appendChild(bodyFragment);

  matrix.querySelectorAll(".l2-item").forEach((item) => {
    item.onclick = () => {
      const params = new URLSearchParams({
        line: item.dataset.lob,
        stage: item.dataset.stage,
        l2: item.dataset.l2,
        unit: selectedUnit || "",
        edit: editMode ? "1" : "",
      });
      window.location.href = `details.html?${params.toString()}`;
    };
  });

  matrix.querySelectorAll("[data-add-l2]").forEach((btn) => {
    btn.onclick = () => {
      const [lobId, stageId] = btn.dataset.addL2.split("|");
      const name = prompt("New L2 name:");
      if (!name) return;
      const lob = config.lobs.find((l) => l.id === lobId);
      lob.stages[stageId].push({ id: uid("l2"), name, activities: [] });
      persistAndRender();
    };
  });
}

function renderEditor() {
  configEditor.value = JSON.stringify(config, null, 2);
  configEditor.disabled = !editMode;
  saveConfigBtn.disabled = !editMode;
  resetConfigBtn.disabled = !editMode;
}

function persistAndRender() {
  const result = saveConfig(config);
  statusLine.textContent = result.ok ? "Saved" : result.error;
  render();
}

function render() {
  renderUnitFilters();
  renderMatrix();
  renderEditor();
  selectionInfo.textContent = selectedUnit
    ? `Unit filter: ${unitLabel(selectedUnit)}.`
    : "Click a unit to highlight mapped L2s. Single-click an L2 to open activities.";
  document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.unit === selectedUnit));
}

async function bootstrap() {
  config = await loadPreferredConfig();
  render();
}

editToggle.onclick = () => {
  editMode = !editMode;
  editToggle.textContent = editMode ? "Exit Edit Mode" : "Enter Edit Mode";
  statusLine.textContent = editMode
    ? "Edit mode ON: you can add L2, edit JSON, drag activities on details page."
    : "Edit mode OFF";
  render();
};

saveConfigBtn.onclick = () => {
  try {
    const parsed = JSON.parse(configEditor.value);
    const result = saveConfig(parsed);
    if (!result.ok) return (statusLine.textContent = result.error);
    config = loadConfig();
    statusLine.textContent = "Configuration saved.";
    render();
  } catch {
    statusLine.textContent = "Invalid JSON.";
  }
};

resetConfigBtn.onclick = () => {
  if (!confirm("Reset to default config?")) return;
  config = resetConfig();
  statusLine.textContent = "Reset to default.";
  render();
};

downloadConfigBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "retail-value-chain-config.json";
  a.click();
};

clearFilterBtn.onclick = () => {
  selectedUnit = null;
<<<<<<< HEAD
  localStorage.removeItem("retail_selected_unit");
=======
<<<<<<< codex/design-one-page-website-for-bank-services-mapping-0pvmkb
  localStorage.removeItem("retail_selected_unit");
=======
>>>>>>> main
>>>>>>> main
  render();
};

bootstrap();
