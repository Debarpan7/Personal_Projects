const stack = window.storyData.stack;
const stackEl = document.getElementById("stack");
const detailEl = document.getElementById("stackDetail");

let active = 0;

function renderStack() {
  stackEl.innerHTML = stack
    .map(
      (item, idx) => `
      <button class="stack-layer ${idx === active ? "active" : ""}" data-i="${idx}">
        <span>${item.icon}</span>
        <strong>${item.layer}</strong>
      </button>`
    )
    .join("");

  const current = stack[active];
  detailEl.innerHTML = `
    <h2>${current.icon} ${current.layer}</h2>
    <p><strong>Where SBI struggles:</strong></p>
    <ul>${current.issues.map((i) => `<li>${i}</li>`).join("")}</ul>
    <p><strong>KPI damage:</strong></p>
    <ul>${current.kpiDamage.map((k) => `<li>${k}</li>`).join("")}</ul>
    <p><strong>AI actions:</strong></p>
    <ul>${current.ai.map((a) => `<li>${a}</li>`).join("")}</ul>
  `;

  stackEl.querySelectorAll(".stack-layer").forEach((node) => {
    node.addEventListener("click", () => {
      active = Number(node.dataset.i);
      renderStack();
    });
  });
}

renderStack();
