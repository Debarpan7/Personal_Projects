const units = {
  branch: { label: "Branch", type: "Sales & Service" },
  dsa: { label: "DSA / Connectors", type: "Sourcing" },
  digital: { label: "Digital Channels", type: "Sourcing & Self-Service" },
  contactCenter: { label: "Contact Center", type: "Service" },
  racpc: { label: "RACPC", type: "Retail Assets Processing" },
  cpc: { label: "Central Processing Center", type: "Ops" },
  rbo: { label: "Regional Business Office", type: "Business Control" },
  collections: { label: "Collections Unit", type: "Risk & Recovery" },
  treasury: { label: "Treasury Desk", type: "Investment Ops" },
  kycOps: { label: "KYC / AML Ops", type: "Compliance" },
};

const valueChainStages = [
  { id: "lead", label: "Lead Generation" },
  { id: "origination", label: "Customer Onboarding / Origination" },
  { id: "assessment", label: "Assessment & Approval" },
  { id: "fulfillment", label: "Fulfillment / Disbursal / Booking" },
  { id: "service", label: "Servicing & Relationship" },
  { id: "risk", label: "Risk, Collections & Compliance" },
  { id: "renewal", label: "Renewal / Cross-sell / Exit" },
];

const retailLines = [
  {
    id: "home-loans",
    name: "Home Loans",
    stages: {
      lead: ["branch", "dsa", "digital"],
      origination: ["branch", "digital", "racpc"],
      assessment: ["racpc", "cpc", "kycOps"],
      fulfillment: ["racpc", "branch"],
      service: ["branch", "contactCenter", "digital"],
      risk: ["collections", "rbo", "kycOps"],
      renewal: ["branch", "dsa", "digital"],
    },
  },
  {
    id: "auto-loans",
    name: "Auto Loans",
    stages: {
      lead: ["branch", "dsa", "digital"],
      origination: ["branch", "dsa", "cpc"],
      assessment: ["cpc", "kycOps"],
      fulfillment: ["cpc", "branch"],
      service: ["branch", "contactCenter", "digital"],
      risk: ["collections", "rbo"],
      renewal: ["branch", "digital"],
    },
  },
  {
    id: "personal-loans",
    name: "Personal Loans",
    stages: {
      lead: ["digital", "branch", "contactCenter"],
      origination: ["digital", "branch", "cpc"],
      assessment: ["cpc", "kycOps"],
      fulfillment: ["cpc", "digital"],
      service: ["digital", "contactCenter", "branch"],
      risk: ["collections", "rbo", "kycOps"],
      renewal: ["digital", "branch"],
    },
  },
  {
    id: "savings-accounts",
    name: "Savings Accounts",
    stages: {
      lead: ["branch", "digital"],
      origination: ["branch", "digital", "kycOps"],
      assessment: ["kycOps", "cpc"],
      fulfillment: ["branch", "digital", "cpc"],
      service: ["branch", "digital", "contactCenter"],
      risk: ["kycOps", "rbo"],
      renewal: ["branch", "digital"],
    },
  },
  {
    id: "fixed-deposits",
    name: "Term / Fixed Deposits",
    stages: {
      lead: ["branch", "digital", "contactCenter"],
      origination: ["branch", "digital"],
      assessment: ["cpc", "kycOps"],
      fulfillment: ["branch", "digital", "treasury"],
      service: ["branch", "digital", "contactCenter"],
      risk: ["rbo", "kycOps", "treasury"],
      renewal: ["branch", "digital", "treasury"],
    },
  },
  {
    id: "cards",
    name: "Credit Cards",
    stages: {
      lead: ["digital", "branch", "dsa"],
      origination: ["digital", "branch", "cpc"],
      assessment: ["cpc", "kycOps", "rbo"],
      fulfillment: ["cpc", "digital"],
      service: ["contactCenter", "digital", "branch"],
      risk: ["collections", "kycOps", "rbo"],
      renewal: ["digital", "contactCenter", "branch"],
    },
  },
];

const detailFlows = {
  "home-loans|assessment": {
    title: "Home Loan - Assessment & Approval",
    mode: "parallel",
    steps: [
      {
        id: "doc-check",
        title: "Document & Eligibility Scrutiny",
        units: ["racpc", "cpc"],
        owners: ["Credit Officer", "Ops Analyst"],
        systems: ["Loan Origination System (LOS)", "Document Management System"],
      },
      {
        id: "bureau",
        title: "Credit Bureau + Risk Score",
        units: ["cpc", "rbo"],
        owners: ["Risk Analyst"],
        systems: ["Bureau API Hub", "Risk Scoring Engine"],
      },
      {
        id: "valuation",
        title: "Property Technical / Legal Check",
        units: ["racpc"],
        owners: ["Empaneled Valuer", "Legal Reviewer"],
        systems: ["Vendor Portal", "Collateral Tracker"],
      },
      {
        id: "decision",
        title: "Underwriting Decision & Sanction",
        units: ["racpc", "rbo"],
        owners: ["Underwriter", "Sanctioning Authority"],
        systems: ["Underwriting Workbench", "Approval Matrix Tool"],
      },
    ],
    connections: [
      ["doc-check", "decision"],
      ["bureau", "decision"],
      ["valuation", "decision"],
    ],
  },
  "personal-loans|origination": {
    title: "Personal Loan - Origination",
    mode: "linear",
    steps: [
      {
        id: "lead-capture",
        title: "Lead Capture & Pre-Offer",
        units: ["digital", "contactCenter"],
        owners: ["Campaign Manager", "Telecaller"],
        systems: ["CRM", "Pre-approved Offer Engine"],
      },
      {
        id: "application",
        title: "Application Form + Consent",
        units: ["digital", "branch"],
        owners: ["Relationship Officer", "Digital Journey Owner"],
        systems: ["Mobile Banking App", "E-sign Gateway"],
      },
      {
        id: "ekyc",
        title: "eKYC / CKYC Validation",
        units: ["kycOps", "cpc"],
        owners: ["KYC Analyst"],
        systems: ["CKYC Utility", "AML Screening Tool"],
      },
      {
        id: "submission",
        title: "Case Packaging & Queueing",
        units: ["cpc"],
        owners: ["Ops Queue Manager"],
        systems: ["LOS Queue Manager"],
      },
    ],
    connections: [
      ["lead-capture", "application"],
      ["application", "ekyc"],
      ["ekyc", "submission"],
    ],
  },
  defaultFlow(lineId, stageId) {
    const line = retailLines.find((item) => item.id === lineId);
    const stage = valueChainStages.find((item) => item.id === stageId);
    if (!line || !stage) return null;

    const stageUnits = line.stages[stage.id] || [];
    return {
      title: `${line.name} - ${stage.label}`,
      mode: "linear",
      steps: [
        {
          id: "s1",
          title: `${stage.label}: Intake`,
          units: stageUnits.slice(0, 2),
          owners: ["Frontline Manager"],
          systems: ["CRM / LOS"],
        },
        {
          id: "s2",
          title: `${stage.label}: Processing`,
          units: stageUnits.slice(1, 3),
          owners: ["Operations Officer"],
          systems: ["Workflow Engine"],
        },
        {
          id: "s3",
          title: `${stage.label}: Closure`,
          units: stageUnits,
          owners: ["Business / Service Owner"],
          systems: ["Core Banking System"],
        },
      ],
      connections: [
        ["s1", "s2"],
        ["s2", "s3"],
      ],
    };
  },
};
