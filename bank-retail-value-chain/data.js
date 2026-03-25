const units = {
  branch: { label: "Branch" },
  dsa: { label: "DSA / Connectors" },
  digital: { label: "Digital Channels" },
  contactCenter: { label: "Contact Center" },
  racpc: { label: "RACPC" },
  cpc: { label: "Central Processing Center" },
  rbo: { label: "Regional Business Office" },
  collections: { label: "Collections Unit" },
  treasury: { label: "Treasury Desk" },
  kycOps: { label: "KYC / AML Ops" },
};

const valueChainStages = [
  { id: "lead", label: "Lead Generation" },
  { id: "origination", label: "Onboarding / Origination" },
  { id: "assessment", label: "Assessment & Approval" },
  { id: "fulfillment", label: "Booking / Disbursal" },
  { id: "service", label: "Servicing" },
  { id: "risk", label: "Risk & Compliance" },
  { id: "renewal", label: "Renewal / Exit" },
];

const retailLines = [
  {
    id: "home-loans",
    name: "Home Loans",
    stages: {
      lead: [
        {
          id: "l2-campaigns",
          name: "Campaign & Prospecting",
          activities: [
            { name: "Builder tie-up campaigns", units: ["branch", "dsa"], owner: "Sales Manager", systems: ["CRM"] },
            { name: "Digital pre-eligibility funnel", units: ["digital"], owner: "Digital Growth Lead", systems: ["Web Funnel", "Lead Engine"] },
          ],
        },
        {
          id: "l2-lead-qualification",
          name: "Lead Qualification",
          activities: [
            { name: "Income profile screening", units: ["branch", "contactCenter"], owner: "Relationship Officer", systems: ["CRM"] },
            { name: "Lead allocation to sales desk", units: ["rbo"], owner: "Sales Controller", systems: ["Lead Router"] },
          ],
        },
      ],
      origination: [
        {
          id: "l2-application-intake",
          name: "Application Intake",
          activities: [
            { name: "Application capture + consent", units: ["branch", "digital"], owner: "Relationship Officer", systems: ["LOS Frontend"] },
            { name: "Document upload", units: ["digital", "branch"], owner: "Customer / Branch Ops", systems: ["DMS"] },
          ],
        },
        {
          id: "l2-kyc-onboarding",
          name: "KYC & Customer Setup",
          activities: [
            { name: "KYC / CKYC validation", units: ["kycOps", "cpc"], owner: "KYC Analyst", systems: ["CKYC Utility"] },
            { name: "Customer ID creation", units: ["cpc"], owner: "Ops Maker", systems: ["CIF System"] },
          ],
        },
      ],
      assessment: [
        {
          id: "l2-credit-assessment",
          name: "Credit Assessment",
          activities: [
            { name: "Income and FOIR analysis", units: ["racpc", "cpc"], owner: "Credit Officer", systems: ["LOS", "Rule Engine"] },
            { name: "Bureau checks", units: ["cpc"], owner: "Risk Analyst", systems: ["Bureau API"] },
          ],
        },
        {
          id: "l2-collateral-assessment",
          name: "Property & Legal Assessment",
          activities: [
            { name: "Property valuation", units: ["racpc"], owner: "Valuation Coordinator", systems: ["Vendor Portal"] },
            { name: "Legal opinion", units: ["racpc", "rbo"], owner: "Legal Reviewer", systems: ["Collateral Tracker"] },
          ],
        },
      ],
      fulfillment: [
        {
          id: "l2-sanction-setup",
          name: "Sanction Setup",
          activities: [
            { name: "Sanction letter generation", units: ["racpc"], owner: "Sanction Desk", systems: ["LOS"] },
            { name: "Terms acceptance", units: ["branch", "digital"], owner: "Relationship Officer", systems: ["E-sign"] },
          ],
        },
        {
          id: "l2-disbursal",
          name: "Disbursal",
          activities: [
            { name: "Pre-disbursal checks", units: ["racpc", "cpc"], owner: "Ops Checker", systems: ["Disbursal Checklist Tool"] },
            { name: "Fund release", units: ["cpc"], owner: "Payments Ops", systems: ["Core Banking"] },
          ],
        },
      ],
      service: [
        {
          id: "l2-account-servicing",
          name: "Loan Account Servicing",
          activities: [
            { name: "EMI schedule updates", units: ["branch", "contactCenter"], owner: "Service Officer", systems: ["Loan Servicing"] },
            { name: "Statement requests", units: ["digital", "contactCenter"], owner: "Service Support", systems: ["Self-service Portal"] },
          ],
        },
        {
          id: "l2-modification",
          name: "Modifications / Requests",
          activities: [
            { name: "Part prepayment", units: ["branch", "digital"], owner: "Branch Ops", systems: ["Core Banking"] },
            { name: "Tenure change request", units: ["racpc", "branch"], owner: "Credit Ops", systems: ["LOS"] },
          ],
        },
      ],
      risk: [
        {
          id: "l2-monitoring",
          name: "Monitoring",
          activities: [
            { name: "EWS tracking", units: ["rbo", "racpc"], owner: "Risk Manager", systems: ["EWS Dashboard"] },
            { name: "Exception review", units: ["rbo"], owner: "Control Officer", systems: ["Exception Monitor"] },
          ],
        },
        {
          id: "l2-collections",
          name: "Collections & Recovery",
          activities: [
            { name: "DPD bucket follow-up", units: ["collections", "contactCenter"], owner: "Collections Lead", systems: ["Collections Suite"] },
            { name: "Settlement workflow", units: ["collections", "rbo"], owner: "Recovery Officer", systems: ["Recovery Tool"] },
          ],
        },
      ],
      renewal: [
        {
          id: "l2-topup",
          name: "Top-up / Balance Transfer",
          activities: [
            { name: "Top-up offer generation", units: ["digital", "branch"], owner: "Portfolio Manager", systems: ["Offer Engine"] },
            { name: "Refinance case handling", units: ["branch", "racpc"], owner: "Relationship Officer", systems: ["LOS"] },
          ],
        },
        {
          id: "l2-closure",
          name: "Closure",
          activities: [
            { name: "NOC issuance", units: ["racpc", "branch"], owner: "Ops Manager", systems: ["Document System"] },
            { name: "Lien release", units: ["racpc", "rbo"], owner: "Collateral Desk", systems: ["Collateral Tracker"] },
          ],
        },
      ],
    },
  },
  {
    id: "personal-loans",
    name: "Personal Loans",
    stages: {
      lead: [
        { id: "l2-trigger-campaigns", name: "Trigger Campaigns", activities: [
          { name: "Pre-approved campaigns", units: ["digital", "contactCenter"], owner: "Campaign Lead", systems: ["Campaign Manager"] },
          { name: "Branch walk-in conversion", units: ["branch"], owner: "Sales Officer", systems: ["CRM"] },
        ]},
        { id: "l2-lead-scoring", name: "Lead Scoring", activities: [
          { name: "Propensity scoring", units: ["digital", "rbo"], owner: "Analytics Manager", systems: ["Scoring Engine"] },
          { name: "Sales queue assignment", units: ["rbo"], owner: "Sales Controller", systems: ["Lead Router"] },
        ]},
      ],
      origination: [
        { id: "l2-form-consent", name: "Form & Consent", activities: [
          { name: "Journey-based application", units: ["digital"], owner: "Journey Owner", systems: ["App Journey"] },
          { name: "Branch assisted form", units: ["branch"], owner: "Branch Officer", systems: ["LOS"] },
        ]},
        { id: "l2-identity", name: "Identity Verification", activities: [
          { name: "eKYC + AML screening", units: ["kycOps", "cpc"], owner: "KYC Analyst", systems: ["KYC Hub"] },
          { name: "Fraud checks", units: ["cpc", "rbo"], owner: "Fraud Analyst", systems: ["Fraud Monitor"] },
        ]},
      ],
      assessment: [
        { id: "l2-policy-decision", name: "Policy Decisioning", activities: [
          { name: "Rule-based underwriting", units: ["cpc"], owner: "Underwriting Analyst", systems: ["Decision Engine"] },
          { name: "Manual override handling", units: ["rbo"], owner: "Approver", systems: ["Approval Workbench"] },
        ]},
        { id: "l2-offer-finalization", name: "Offer Finalization", activities: [
          { name: "Rate and tenure finalization", units: ["cpc", "rbo"], owner: "Pricing Officer", systems: ["Pricing Tool"] },
          { name: "Customer confirmation", units: ["contactCenter", "branch"], owner: "Sales Officer", systems: ["CRM"] },
        ]},
      ],
      fulfillment: [
        { id: "l2-disbursal-setup", name: "Disbursal Setup", activities: [
          { name: "Mandate registration", units: ["digital", "cpc"], owner: "Ops Officer", systems: ["E-mandate"] },
          { name: "Loan account creation", units: ["cpc"], owner: "Ops Maker", systems: ["Core Banking"] },
        ]},
        { id: "l2-payout", name: "Payout Execution", activities: [
          { name: "Funds transfer", units: ["cpc"], owner: "Payments Ops", systems: ["Payments Hub"] },
          { name: "Disbursal intimation", units: ["digital", "contactCenter"], owner: "Service Desk", systems: ["Notification Engine"] },
        ]},
      ],
      service: [
        { id: "l2-routine-service", name: "Routine Service", activities: [
          { name: "Statement / certificate", units: ["digital", "branch"], owner: "Service Officer", systems: ["Service Portal"] },
          { name: "Payment issue handling", units: ["contactCenter", "branch"], owner: "Service Desk", systems: ["CRM"] },
        ]},
        { id: "l2-restructuring", name: "Restructuring Requests", activities: [
          { name: "EMI date change", units: ["branch", "cpc"], owner: "Ops Officer", systems: ["Loan Servicing"] },
          { name: "Moratorium review", units: ["rbo", "cpc"], owner: "Credit Control", systems: ["Workflow"] },
        ]},
      ],
      risk: [
        { id: "l2-delinquency", name: "Delinquency Management", activities: [
          { name: "Reminder journeys", units: ["contactCenter", "digital"], owner: "Collections Supervisor", systems: ["Collections CRM"] },
          { name: "Field collections", units: ["collections"], owner: "Field Collector", systems: ["Field App"] },
        ]},
        { id: "l2-regulatory", name: "Regulatory Controls", activities: [
          { name: "AML alert closure", units: ["kycOps", "rbo"], owner: "Compliance Officer", systems: ["AML Tool"] },
          { name: "Audit evidence prep", units: ["cpc", "rbo"], owner: "Ops Control", systems: ["Audit Vault"] },
        ]},
      ],
      renewal: [
        { id: "l2-cross-sell", name: "Cross-sell", activities: [
          { name: "Insurance cross-sell", units: ["branch", "digital"], owner: "RM", systems: ["Offer Engine"] },
          { name: "Card upsell", units: ["contactCenter", "digital"], owner: "Campaign Lead", systems: ["Campaign Manager"] },
        ]},
        { id: "l2-loan-closure", name: "Loan Closure", activities: [
          { name: "Foreclosure quote", units: ["branch", "cpc"], owner: "Ops Officer", systems: ["Loan Servicing"] },
          { name: "Closure certificate", units: ["cpc", "digital"], owner: "Service Desk", systems: ["Document Hub"] },
        ]},
      ],
    },
  },
  {
    id: "savings-accounts",
    name: "Savings Accounts",
    stages: {
      lead: [
        { id: "l2-mass-acquisition", name: "Mass Acquisition", activities: [
          { name: "Local campaigns", units: ["branch", "dsa"], owner: "Branch Manager", systems: ["CRM"] },
          { name: "Digital acquisition ads", units: ["digital"], owner: "Growth Lead", systems: ["Ad Stack"] },
        ]},
        { id: "l2-segment-targeting", name: "Segment Targeting", activities: [
          { name: "Salary account sourcing", units: ["branch", "rbo"], owner: "Sales Lead", systems: ["CRM"] },
          { name: "Student account drive", units: ["branch", "digital"], owner: "Segment Manager", systems: ["Campaign Tool"] },
        ]},
      ],
      origination: [
        { id: "l2-account-opening", name: "Account Opening", activities: [
          { name: "AOF data capture", units: ["branch", "digital"], owner: "Relationship Officer", systems: ["Onboarding Platform"] },
          { name: "Nominee registration", units: ["branch", "digital"], owner: "Service Officer", systems: ["Core Banking"] },
        ]},
        { id: "l2-kyc-validation", name: "KYC Validation", activities: [
          { name: "KYC verification", units: ["kycOps", "cpc"], owner: "KYC Analyst", systems: ["KYC Hub"] },
          { name: "Risk categorization", units: ["kycOps"], owner: "Compliance Officer", systems: ["AML Monitor"] },
        ]},
      ],
      assessment: [
        { id: "l2-screening", name: "Screening", activities: [
          { name: "Sanctions / PEP screening", units: ["kycOps"], owner: "Compliance Analyst", systems: ["AML"] },
          { name: "Dedupe checks", units: ["cpc"], owner: "Ops Analyst", systems: ["CIF Dedupe"] },
        ]},
        { id: "l2-approval", name: "Approval", activities: [
          { name: "Exception approval", units: ["rbo"], owner: "Control Officer", systems: ["Exception Desk"] },
          { name: "Customer acceptance", units: ["branch", "digital"], owner: "RM", systems: ["Onboarding"] },
        ]},
      ],
      fulfillment: [
        { id: "l2-account-activation", name: "Account Activation", activities: [
          { name: "Account number generation", units: ["cpc"], owner: "Ops Maker", systems: ["Core Banking"] },
          { name: "Welcome kit / debit card request", units: ["branch", "digital"], owner: "Service Officer", systems: ["Card CMS"] },
        ]},
        { id: "l2-channel-enable", name: "Channel Enablement", activities: [
          { name: "Net banking activation", units: ["digital"], owner: "Digital Service", systems: ["IB Platform"] },
          { name: "UPI setup", units: ["digital", "contactCenter"], owner: "Customer Support", systems: ["UPI Switch"] },
        ]},
      ],
      service: [
        { id: "l2-day2-service", name: "Day-2 Service", activities: [
          { name: "Passbook / statement service", units: ["branch", "digital"], owner: "Service Officer", systems: ["Core Banking"] },
          { name: "Profile updates", units: ["branch", "contactCenter"], owner: "KYC Desk", systems: ["CIF"] },
        ]},
        { id: "l2-dispute", name: "Dispute Handling", activities: [
          { name: "Transaction dispute intake", units: ["contactCenter", "branch"], owner: "Dispute Officer", systems: ["Dispute CRM"] },
          { name: "Chargeback processing", units: ["cpc"], owner: "Card Ops", systems: ["Chargeback Tool"] },
        ]},
      ],
      risk: [
        { id: "l2-fraud-monitoring", name: "Fraud Monitoring", activities: [
          { name: "Anomaly alerts review", units: ["rbo", "cpc"], owner: "Fraud Analyst", systems: ["Fraud Monitor"] },
          { name: "Account freeze / unblock", units: ["cpc", "branch"], owner: "Control Desk", systems: ["Core Banking"] },
        ]},
        { id: "l2-compliance-review", name: "Compliance Review", activities: [
          { name: "Periodic KYC refresh", units: ["kycOps", "branch"], owner: "KYC Officer", systems: ["KYC Hub"] },
          { name: "Regulatory reporting", units: ["rbo", "kycOps"], owner: "Compliance Lead", systems: ["Reg Report Tool"] },
        ]},
      ],
      renewal: [
        { id: "l2-retention", name: "Retention", activities: [
          { name: "Dormancy reactivation", units: ["branch", "contactCenter"], owner: "Service Manager", systems: ["CRM"] },
          { name: "Program benefit nudges", units: ["digital"], owner: "Campaign Lead", systems: ["Engagement Engine"] },
        ]},
        { id: "l2-closure", name: "Closure", activities: [
          { name: "Closure request capture", units: ["branch", "contactCenter"], owner: "Service Officer", systems: ["Core Banking"] },
          { name: "Balance payout", units: ["branch", "cpc"], owner: "Ops Officer", systems: ["Payments Hub"] },
        ]},
      ],
    },
  },
  {
    id: "fixed-deposits",
    name: "Fixed Deposits",
    stages: {
      lead: [
        { id: "l2-fd-prospecting", name: "Deposit Prospecting", activities: [
          { name: "Maturity bucket campaigns", units: ["branch", "digital"], owner: "Deposit RM", systems: ["Campaign Manager"] },
          { name: "Senior citizen outreach", units: ["branch", "contactCenter"], owner: "Branch RM", systems: ["CRM"] },
        ]},
        { id: "l2-yield-positioning", name: "Yield Positioning", activities: [
          { name: "Rate communication", units: ["branch", "digital"], owner: "Product Specialist", systems: ["Rate Board"] },
          { name: "Competitor switch offers", units: ["rbo", "branch"], owner: "Regional Sales", systems: ["Offer Engine"] },
        ]},
      ],
      origination: [
        { id: "l2-booking-request", name: "Booking Request", activities: [
          { name: "FD request capture", units: ["branch", "digital"], owner: "Service Officer", systems: ["Deposit Module"] },
          { name: "Funding source check", units: ["cpc", "branch"], owner: "Ops Officer", systems: ["Core Banking"] },
        ]},
        { id: "l2-depositor-verification", name: "Depositor Verification", activities: [
          { name: "KYC validity check", units: ["kycOps", "cpc"], owner: "KYC Analyst", systems: ["KYC Hub"] },
          { name: "Joint holder validation", units: ["branch", "cpc"], owner: "Service Ops", systems: ["CIF"] },
        ]},
      ],
      assessment: [
        { id: "l2-interest-approval", name: "Rate / Tenure Confirmation", activities: [
          { name: "Special rate approval", units: ["rbo", "branch"], owner: "Regional Approver", systems: ["Approval Matrix"] },
          { name: "Tenure suitability check", units: ["branch"], owner: "RM", systems: ["Deposit Advisor"] },
        ]},
        { id: "l2-compliance-check", name: "Compliance Check", activities: [
          { name: "AML transaction checks", units: ["kycOps"], owner: "Compliance Analyst", systems: ["AML Tool"] },
          { name: "Tax form validation", units: ["cpc", "branch"], owner: "Tax Ops", systems: ["Tax Utility"] },
        ]},
      ],
      fulfillment: [
        { id: "l2-fd-creation", name: "FD Account Creation", activities: [
          { name: "Deposit booking", units: ["cpc", "branch"], owner: "Deposit Ops", systems: ["Core Banking"] },
          { name: "Receipt issuance", units: ["branch", "digital"], owner: "Service Desk", systems: ["Document Hub"] },
        ]},
        { id: "l2-treasury-booking", name: "Treasury Positioning", activities: [
          { name: "Liability booking", units: ["treasury"], owner: "Treasury Dealer", systems: ["ALM"] },
          { name: "Liquidity reporting", units: ["treasury", "rbo"], owner: "Treasury Ops", systems: ["Treasury MIS"] },
        ]},
      ],
      service: [
        { id: "l2-midterm-service", name: "Mid-term Service", activities: [
          { name: "Nominee updates", units: ["branch", "contactCenter"], owner: "Service Officer", systems: ["Core Banking"] },
          { name: "Lien marking", units: ["cpc", "branch"], owner: "Ops Officer", systems: ["Core Banking"] },
        ]},
        { id: "l2-interest-payout", name: "Interest Payout Service", activities: [
          { name: "Periodic payout processing", units: ["cpc"], owner: "Deposit Ops", systems: ["Payout Engine"] },
          { name: "Credit advice", units: ["digital", "contactCenter"], owner: "Customer Support", systems: ["Notification Engine"] },
        ]},
      ],
      risk: [
        { id: "l2-kyc-surveillance", name: "KYC Surveillance", activities: [
          { name: "Periodic review", units: ["kycOps", "branch"], owner: "KYC Officer", systems: ["KYC Hub"] },
          { name: "Alert closure", units: ["kycOps", "rbo"], owner: "Compliance Lead", systems: ["AML Tool"] },
        ]},
        { id: "l2-liability-risk", name: "Liability Risk Monitoring", activities: [
          { name: "Concentration monitoring", units: ["treasury", "rbo"], owner: "ALM Analyst", systems: ["ALM"] },
          { name: "Premature withdrawal risk", units: ["rbo", "branch"], owner: "Regional Control", systems: ["MIS"] },
        ]},
      ],
      renewal: [
        { id: "l2-auto-renewal", name: "Auto Renewal", activities: [
          { name: "Maturity intimation", units: ["digital", "contactCenter"], owner: "Service Desk", systems: ["Notification Engine"] },
          { name: "Auto rollover", units: ["cpc"], owner: "Deposit Ops", systems: ["Core Banking"] },
        ]},
        { id: "l2-exit", name: "Premature Exit", activities: [
          { name: "Exit request processing", units: ["branch", "contactCenter"], owner: "Service Officer", systems: ["Core Banking"] },
          { name: "Penalty computation", units: ["cpc", "treasury"], owner: "Deposit Control", systems: ["Rate Engine"] },
        ]},
      ],
    },
  },
];

function getL2(lineId, stageId, l2Id) {
  const line = retailLines.find((item) => item.id === lineId);
  if (!line) return null;
  const list = line.stages[stageId] || [];
  return list.find((entry) => entry.id === l2Id) || null;
}

function uniqueUnitsForL2(l2) {
  return [...new Set((l2.activities || []).flatMap((act) => act.units || []))];
}
