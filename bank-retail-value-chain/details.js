const query = new URLSearchParams(window.location.search);
const lineId = query.get("line");
const stageId = query.get("stage");
const l2Id = query.get("l2");
const selectedUnit = query.get("unit") || null;
const editMode = query.get("edit") === "1";

const detailTitle = document.getElementById("detailTitle");
const flowCanvas = document.getElementById("flowCanvas");
const activeFilterInfo = document.getElementById("activeFilterInfo");
const activityToolbar = document.getElementById("activityToolbar");
const backLink = document.getElementById("backLink");

let config = null;


async function bootstrap() {
  config = await loadPreferredConfig();
  setBackLink();
  renderFlow();
}


function setBackLink() {
  const params = new URLSearchParams();
  if (selectedUnit) params.set("unit", selectedUnit);
  if (editMode) params.set("edit", "1");
  const qs = params.toString();
  backLink.href = qs ? `index.html?${qs}` : "index.html";
}

function unitLabel(id) {
  return config.units.find((u) => u.id === id)?.label || id;
}

function saveAndRefresh() {
  const res = saveConfig(config);
  if (!res.ok) return alert(res.error);
  config = loadConfig();
  renderFlow();
}

function renderAssignments(activity, card, l2) {
  const assignmentWrap = document.createElement("div");
  assignmentWrap.className = "meta";

  activity.assignments.forEach((asg, idx) => {
    const row = document.createElement("div");
    row.className = "assignment-row";
    if (editMode) {
      row.innerHTML = `
        <select data-field="unitId">${config.units
          .map((u) => `<option value="${u.id}" ${u.id === asg.unitId ? "selected" : ""}>${u.label}</option>`)
          .join("")}</select>
        <input data-field="person" value="${asg.person || ""}" placeholder="Person (optional)" />
        <input data-field="system" value="${asg.system || ""}" placeholder="System (optional)" />
        <input data-field="info" value="${asg.info || ""}" placeholder="Brief info" />
        <button class="mini-btn danger">×</button>
      `;
      const [u, p, s, i, del] = row.children;
      u.onchange = () => (activity.assignments[idx].unitId = u.value);
      p.oninput = () => (activity.assignments[idx].person = p.value);
      s.oninput = () => (activity.assignments[idx].system = s.value);
      i.oninput = () => (activity.assignments[idx].info = i.value);
      del.onclick = () => {
        if (activity.assignments.length <= 1) return alert("At least one unit assignment is required.");
        activity.assignments.splice(idx, 1);
        saveAndRefresh();
      };
    } else {
      row.innerHTML = `<strong>${unitLabel(asg.unitId)}</strong> • ${asg.person || "No person"} • ${asg.system || "No system"}<br/><span>${asg.info || ""}</span>`;
    }
    assignmentWrap.appendChild(row);
  });

  if (editMode) {
    const addAssign = document.createElement("button");
    addAssign.className = "mini-btn";
    addAssign.textContent = "+ assignment";
    addAssign.onclick = () => {
      activity.assignments.push({ unitId: config.units[0]?.id || "", person: "", system: "", info: "" });
      saveAndRefresh();
    };
    assignmentWrap.appendChild(addAssign);
  }

  card.appendChild(assignmentWrap);
}

function renderFlow() {
  const l2 = findL2(config, lineId, stageId, l2Id);
  const lob = config.lobs.find((l) => l.id === lineId);
  const stage = config.stages.find((s) => s.id === stageId);
  if (!l2 || !lob || !stage) {
    detailTitle.textContent = "Invalid Selection";
    flowCanvas.textContent = "Please go back and pick an L2 item.";
    return;
  }

  detailTitle.textContent = `${lob.name} • ${stage.label} • ${l2.name}`;
  activeFilterInfo.textContent = editMode
    ? "Edit mode: drag activity cards to reorder; edit assignments inline."
    : selectedUnit
    ? `Unit focus: ${unitLabel(selectedUnit)}`
    : "Activity boxes shown side-by-side.";

  activityToolbar.innerHTML = "";
  if (editMode) {
    const addActivity = document.createElement("button");
    addActivity.className = "clear-btn";
    addActivity.textContent = "+ Add Activity";
    addActivity.onclick = () => {
      l2.activities.push({
        id: uid("act"),
        name: "New Activity",
        assignments: [{ unitId: config.units[0]?.id || "", person: "", system: "", info: "" }],
      });
      saveAndRefresh();
    };
    activityToolbar.appendChild(addActivity);
  }

  const track = document.createElement("div");
  track.className = "flow-track wrap";

  l2.activities.forEach((activity, index) => {
    const hasUnit = !selectedUnit || activity.assignments.some((x) => x.unitId === selectedUnit);
    const card = document.createElement("article");
    card.className = `flow-step ${hasUnit ? "" : "dimmed"}`;
    card.draggable = editMode;
    card.dataset.index = index;

    if (editMode) {
      card.ondragstart = (e) => e.dataTransfer.setData("text/plain", index);
      card.ondragover = (e) => e.preventDefault();
      card.ondrop = (e) => {
        e.preventDefault();
        const from = Number(e.dataTransfer.getData("text/plain"));
        const to = Number(card.dataset.index);
        if (from === to) return;
        const [moved] = l2.activities.splice(from, 1);
        l2.activities.splice(to, 0, moved);
        saveAndRefresh();
      };
    }

    const title = document.createElement("h3");
    if (editMode) {
      const titleInput = document.createElement("input");
      titleInput.value = activity.name;
      titleInput.oninput = () => (activity.name = titleInput.value);
      title.appendChild(titleInput);
    } else {
      title.textContent = activity.name;
    }
    card.appendChild(title);

    renderAssignments(activity, card, l2);

    if (editMode) {
      const removeActivity = document.createElement("button");
      removeActivity.className = "mini-btn danger";
      removeActivity.textContent = "Remove Activity";
      removeActivity.onclick = () => {
        l2.activities.splice(index, 1);
        saveAndRefresh();
      };
      const saveActivity = document.createElement("button");
      saveActivity.className = "mini-btn";
      saveActivity.textContent = "Save";
      saveActivity.onclick = saveAndRefresh;
      card.append(removeActivity, saveActivity);
    }

    track.appendChild(card);
  });

  flowCanvas.innerHTML = "";
  flowCanvas.appendChild(track);
}

bootstrap();
