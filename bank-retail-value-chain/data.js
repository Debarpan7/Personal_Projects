const STORAGE_KEY = "retail_value_chain_config_v2";
const SOURCE_CHECK_KEY = "retail_value_chain_source_checked_v1"; // session-scoped fetch guard

const DEFAULT_CONFIG = {
  units: [
    { id: "branch", label: "Branch" },
    { id: "digital", label: "Digital" },
    { id: "cpc", label: "Central Processing Center" },
    { id: "rbo", label: "Regional Business Office" },
    { id: "contact", label: "Contact Center" },
    { id: "kyc", label: "KYC / AML Ops" },
  ],
  stages: [
    { id: "lead", label: "Lead Generation" },
    { id: "origination", label: "Origination" },
    { id: "assessment", label: "Assessment" },
    { id: "fulfillment", label: "Fulfillment" },
    { id: "service", label: "Servicing" },
    { id: "risk", label: "Risk / Compliance" },
    { id: "renewal", label: "Renewal / Exit" },
  ],
  lobs: [
    {
      id: "home-loans",
      name: "Home Loans",
      stages: {
        lead: [
          {
            id: "hl-lead-1",
            name: "Campaign Sourcing",
            activities: [
              {
                id: "a1",
                name: "Builder campaign lead capture",
                assignments: [
                  { unitId: "branch", person: "Sales Officer", system: "CRM", info: "Capture and qualify builder-sourced leads" },
                  { unitId: "digital", person: "", system: "Landing Funnel", info: "Collect self-service leads" },
                ],
              },
            ],
          },
          {
            id: "hl-lead-2",
            name: "Lead Qualification",
            activities: [
              {
                id: "a2",
                name: "Income and profile screening",
                assignments: [
                  { unitId: "branch", person: "Relationship Officer", system: "CRM", info: "Initial screening and data capture" },
                ],
              },
            ],
          },
        ],
        origination: [
          { id: "hl-orig-1", name: "Application Intake", activities: [{ id: "a3", name: "Application form + consent", assignments: [{ unitId: "digital", person: "", system: "Application Form", info: "Customer submits and consents" }] }] },
          { id: "hl-orig-2", name: "KYC Onboarding", activities: [{ id: "a4", name: "KYC validation", assignments: [{ unitId: "kyc", person: "KYC Analyst", system: "KYC Utility", info: "Validate and risk-tag customer" }] }] },
        ],
        assessment: [
          { id: "hl-assess-1", name: "Credit Decision", activities: [{ id: "a5", name: "Underwriting", assignments: [{ unitId: "cpc", person: "Credit Analyst", system: "LOS", info: "Evaluate eligibility and risk" }] }] },
          { id: "hl-assess-2", name: "Collateral Validation", activities: [{ id: "a6", name: "Property legal check", assignments: [{ unitId: "rbo", person: "Legal Reviewer", system: "Collateral Tracker", info: "Review legal/technical collateral docs" }] }] },
        ],
        fulfillment: [
          { id: "hl-ful-1", name: "Sanction Setup", activities: [{ id: "a7", name: "Sanction issue", assignments: [{ unitId: "cpc", person: "Ops Maker", system: "LOS", info: "Generate sanction and terms" }] }] },
          { id: "hl-ful-2", name: "Disbursal", activities: [{ id: "a8", name: "Fund release", assignments: [{ unitId: "cpc", person: "Payments Ops", system: "Core Banking", info: "Disburse loan funds" }] }] },
        ],
        service: [
          { id: "hl-ser-1", name: "Account Service", activities: [{ id: "a9", name: "EMI support", assignments: [{ unitId: "contact", person: "Service Agent", system: "Service CRM", info: "Respond to EMI and repayment queries" }] }] },
          { id: "hl-ser-2", name: "Requests", activities: [{ id: "a10", name: "Tenure / repayment change", assignments: [{ unitId: "branch", person: "Service Officer", system: "Loan Servicing", info: "Capture and process restructure requests" }] }] },
        ],
        risk: [
          { id: "hl-risk-1", name: "Monitoring", activities: [{ id: "a11", name: "EWS review", assignments: [{ unitId: "rbo", person: "Risk Manager", system: "EWS Dashboard", info: "Track early warning signals" }] }] },
          { id: "hl-risk-2", name: "Collections", activities: [{ id: "a12", name: "Delinquency follow-up", assignments: [{ unitId: "contact", person: "Collections Agent", system: "Collections CRM", info: "Follow-up delinquent accounts" }] }] },
        ],
        renewal: [
          { id: "hl-ren-1", name: "Top-up", activities: [{ id: "a13", name: "Top-up offer", assignments: [{ unitId: "digital", person: "", system: "Offer Engine", info: "Generate top-up proposals" }] }] },
          { id: "hl-ren-2", name: "Closure", activities: [{ id: "a14", name: "NOC issuance", assignments: [{ unitId: "branch", person: "Ops Officer", system: "Doc Hub", info: "Issue closure/NOC documents" }] }] },
        ],
      },
    },
    {
      id: "personal-loans",
      name: "Personal Loans",
      stages: {},
    },
    {
      id: "savings",
      name: "Savings Accounts",
      stages: {},
    },
  ],
};

function ensureShape(cfg) {
  cfg.lobs.forEach((lob) => {
    if (!lob.stages) lob.stages = {};
    cfg.stages.forEach((stage) => {
      if (!Array.isArray(lob.stages[stage.id])) lob.stages[stage.id] = [];
    });
  });
  return cfg;
}

function validateConfig(cfg) {
  if (!cfg || !Array.isArray(cfg.units) || !Array.isArray(cfg.stages) || !Array.isArray(cfg.lobs)) {
    return { ok: false, error: "Config must contain units, stages, and lobs arrays." };
  }
  const unitIds = new Set(cfg.units.map((u) => u.id));
  for (const lob of cfg.lobs) {
    for (const stage of cfg.stages) {
      const l2s = (lob.stages && lob.stages[stage.id]) || [];
      for (const l2 of l2s) {
        for (const act of l2.activities || []) {
          if (!Array.isArray(act.assignments) || act.assignments.length < 1) {
            return { ok: false, error: `Activity '${act.name || act.id}' must have at least one unit assignment.` };
          }
          for (const asg of act.assignments) {
            if (!unitIds.has(asg.unitId)) {
              return { ok: false, error: `Unknown unit '${asg.unitId}' in activity '${act.name || act.id}'.` };
            }
          }
        }
      }
    }
  }
  return { ok: true };
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ensureShape(structuredClone(DEFAULT_CONFIG));
    const parsed = JSON.parse(raw);
    const check = validateConfig(parsed);
    if (!check.ok) return ensureShape(structuredClone(DEFAULT_CONFIG));
    return ensureShape(parsed);
  } catch {
    return ensureShape(structuredClone(DEFAULT_CONFIG));
  }
}

function saveConfig(cfg) {
  const check = validateConfig(cfg);
  if (!check.ok) return check;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  return { ok: true };
}

function resetConfig() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SOURCE_CHECK_KEY);
  return ensureShape(structuredClone(DEFAULT_CONFIG));
}

function findL2(cfg, lineId, stageId, l2Id) {
  const lob = cfg.lobs.find((l) => l.id === lineId);
  if (!lob) return null;
  const l2s = lob.stages[stageId] || [];
  return l2s.find((x) => x.id === l2Id) || null;
}

function uniqueUnitsForL2(l2) {
  const ids = new Set();
  (l2.activities || []).forEach((a) => (a.assignments || []).forEach((x) => ids.add(x.unitId)));
  return [...ids];
}


async function loadPreferredConfig(fileName = "value_chain.json") {
  const alreadyChecked = sessionStorage.getItem(SOURCE_CHECK_KEY) === "1";
  if (alreadyChecked) return loadConfig();

  try {
    const response = await fetch(fileName, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = await response.json();
    const check = validateConfig(parsed);
    if (!check.ok) throw new Error(check.error);

    saveConfig(parsed);
    sessionStorage.setItem(SOURCE_CHECK_KEY, "1");
    return ensureShape(parsed);
  } catch {
    sessionStorage.setItem(SOURCE_CHECK_KEY, "1");
    return loadConfig();
  }
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
