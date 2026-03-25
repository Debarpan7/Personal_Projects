const query = new URLSearchParams(window.location.search);
const lineId = query.get("line");
const stageId = query.get("stage");
const l2Id = query.get("l2");
const selectedUnit = query.get("unit") || null;

const detailTitle = document.getElementById("detailTitle");
const flowCanvas = document.getElementById("flowCanvas");
const activeFilterInfo = document.getElementById("activeFilterInfo");

function renderFlow() {
  const line = retailLines.find((item) => item.id === lineId);
  const stage = valueChainStages.find((item) => item.id === stageId);
  const l2 = getL2(lineId, stageId, l2Id);

  if (!line || !stage || !l2) {
    detailTitle.textContent = "Activity Flow Not Found";
    flowCanvas.textContent = "Please go back and select a valid L2 block.";
    return;
  }

  detailTitle.textContent = `${line.name} • ${stage.label} • ${l2.name}`;

  activeFilterInfo.textContent = selectedUnit
    ? `Unit focus: ${units[selectedUnit].label}. Non-matching activities are dimmed.`
    : "All activities shown. Each activity can map to multiple units/channels.";

  const track = document.createElement("div");
  track.className = "flow-track";

  l2.activities.forEach((activity, index) => {
    const hasUnit = !selectedUnit || activity.units.includes(selectedUnit);
    const card = document.createElement("article");
    card.className = `flow-step ${hasUnit ? "" : "dimmed"}`;
    card.style.setProperty("--d", `${index + 1}`);

    card.innerHTML = `
      <h3>${activity.name}</h3>
      <div class="meta"><strong>Units:</strong> ${activity.units.map((u) => units[u].label).join(", ")}</div>
      <div class="meta"><strong>Responsible:</strong> ${activity.owner}</div>
      <div class="meta"><strong>System(s):</strong> ${(activity.systems || []).join(", ")}</div>
    `;

    track.appendChild(card);

    if (index < l2.activities.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      arrow.textContent = "⟶";
      track.appendChild(arrow);
    }
  });

  flowCanvas.innerHTML = "";
  flowCanvas.appendChild(track);
}

renderFlow();
