const query = new URLSearchParams(window.location.search);
const lineId = query.get("line");
const stageId = query.get("stage");
const selectedUnit = query.get("unit") || null;

const detailTitle = document.getElementById("detailTitle");
const flowCanvas = document.getElementById("flowCanvas");
const activeFilterInfo = document.getElementById("activeFilterInfo");

function drawStep(step, highlightUnit) {
  const card = document.createElement("article");
  const hasUnit = !highlightUnit || step.units.includes(highlightUnit);
  card.className = `flow-step ${hasUnit ? "" : "dimmed"}`;

  card.innerHTML = `
    <h3>${step.title}</h3>
    <div class="meta"><strong>Unit(s):</strong> ${step.units
      .map((u) => units[u]?.label || u)
      .join(", ")}</div>
    <div class="meta"><strong>Responsible Role(s):</strong> ${step.owners.join(", ")}</div>
    <div class="meta"><strong>Core System(s):</strong> ${step.systems.join(", ")}</div>
  `;

  return card;
}

function getFlowData() {
  const key = `${lineId}|${stageId}`;
  return detailFlows[key] || detailFlows.defaultFlow(lineId, stageId);
}

function renderFlow() {
  const flow = getFlowData();
  if (!flow) {
    detailTitle.textContent = "Flow Not Found";
    flowCanvas.textContent = "No activity map is available for this selection.";
    return;
  }

  detailTitle.textContent = flow.title;

  activeFilterInfo.textContent = selectedUnit
    ? `Unit focus: ${units[selectedUnit].label}. Activities not handled by this unit are grayed out.`
    : "No unit-specific focus applied.";

  const track = document.createElement("div");
  track.className = "flow-track";

  if (flow.mode === "parallel") {
    const inputNodes = flow.steps.filter((s) => s.id !== "decision");
    const decisionNode = flow.steps.find((s) => s.id === "decision") || flow.steps[flow.steps.length - 1];

    const group = document.createElement("div");
    group.className = "parallel-group";
    inputNodes.forEach((step) => group.appendChild(drawStep(step, selectedUnit)));

    track.appendChild(group);

    const mergeArrow = document.createElement("div");
    mergeArrow.className = "arrow";
    mergeArrow.textContent = "⟶";
    track.appendChild(mergeArrow);

    track.appendChild(drawStep(decisionNode, selectedUnit));
  } else {
    flow.steps.forEach((step, index) => {
      track.appendChild(drawStep(step, selectedUnit));
      if (index < flow.steps.length - 1) {
        const arrow = document.createElement("div");
        arrow.className = "arrow";
        arrow.textContent = "⟶";
        track.appendChild(arrow);
      }
    });
  }

  flowCanvas.innerHTML = "";
  flowCanvas.appendChild(track);
}

renderFlow();
