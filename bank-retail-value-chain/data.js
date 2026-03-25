window.storyData = {
  macroTicker: [
    { label: "Net Interest Margin", value: "↘ 15-25 bps risk" },
    { label: "Cost-to-Income", value: "↗ under inflation + compliance" },
    { label: "Digital Fraud Exposure", value: "↗ real-time response needed" },
    { label: "Customer Switching", value: "↗ due to UX expectations" }
  ],
  macroFactors: [
    {
      name: "Rate-cycle volatility",
      signal: "Deposit repricing faster than loan repricing",
      effects: ["NIM compression", "ALM complexity", "Treasury decision latency"],
      sbiStruggle: "Large CASA base helps, but granular repricing + branch-level nudges are slow."
    },
    {
      name: "Regulatory and compliance intensity",
      signal: "More disclosures, tighter monitoring, stricter model governance",
      effects: ["Higher compliance FTE", "Manual control testing", "Audit burden"],
      sbiStruggle: "Control evidence is fragmented across teams and systems."
    },
    {
      name: "Digital-native customer behavior",
      signal: "Instant decisions, hyper-personalized offers, omnichannel continuity",
      effects: ["Higher service expectations", "Drop-off in onboarding", "Cross-sell dilution"],
      sbiStruggle: "Journeys still break between app, branch, and contact center."
    },
    {
      name: "Fintech and platform competition",
      signal: "Embedded finance + contextual journeys",
      effects: ["Fee pressure", "Lending turnaround pressure", "API expectations"],
      sbiStruggle: "Execution pace and partner orchestration at national scale."
    }
  ],
  layers: [
    {
      name: "Ecosystem",
      focus: "Partners, regulators, merchants, fintechs",
      ai: "Agentic partner onboarding, smart SLA monitoring, policy-aware API assistants"
    },
    {
      name: "Experience",
      focus: "Customer journeys across app, branch, call center",
      ai: "Conversational bankers, intent detection, proactive next-best-action"
    },
    {
      name: "Front Office",
      focus: "RM, branch sales, service advisors",
      ai: "Copilots for relationship managers, assisted selling, multilingual support"
    },
    {
      name: "Middle Office",
      focus: "Risk, underwriting, fraud, operations control",
      ai: "AI underwriting memo generation, anomaly triage, policy co-pilot"
    },
    {
      name: "Back Office",
      focus: "Processing, reconciliation, dispute management",
      ai: "Document AI, straight-through processing boosters, exception copilots"
    },
    {
      name: "Technology & Data",
      focus: "Platform, data quality, model operations, architecture",
      ai: "Synthetic data, code copilots, automated test + model drift sentinels"
    },
    {
      name: "Support Functions",
      focus: "HR, finance, legal, procurement, training",
      ai: "Policy Q&A agents, finance close copilots, role-based learning assistants"
    }
  ],
  stakeholders: [
    {
      role: "Retail Banking Head",
      kpis: ["NIM", "Cost-to-income", "Cross-sell per customer"],
      impactedBy: ["Rate-cycle volatility", "Digital-native customer behavior"],
      drivers: ["Deposit mix", "Pricing agility", "Offer personalization"],
      aiImpact: [
        "GenAI pricing cockpit with branch-level scenario prompts",
        "Next-best-offer engine grounded in customer context",
        "Daily margin-at-risk narrative with action recommendations"
      ]
    },
    {
      role: "Chief Risk Officer",
      kpis: ["Credit loss ratio", "Fraud loss", "Turnaround time"],
      impactedBy: ["Regulatory and compliance intensity", "Fintech and platform competition"],
      drivers: ["Risk policy adherence", "Underwriting quality", "Early warning alerts"],
      aiImpact: [
        "Agentic risk analyst generating explainable credit memos",
        "Real-time fraud graph triage with human-in-loop escalation",
        "Control testing assistant for audit-ready evidence trails"
      ]
    },
    {
      role: "Chief Operations Officer",
      kpis: ["STP rate", "SLA compliance", "Unit processing cost"],
      impactedBy: ["Regulatory and compliance intensity", "Digital-native customer behavior"],
      drivers: ["Exception volume", "Manual touchpoints", "Workflow orchestration"],
      aiImpact: [
        "Email + document intake agents auto-classifying requests",
        "Ops command center summarizing bottlenecks every hour",
        "Exception-handling co-pilot with policy-linked resolutions"
      ]
    },
    {
      role: "Chief Digital & Technology Officer",
      kpis: ["App conversion", "Release velocity", "Platform reliability"],
      impactedBy: ["Fintech and platform competition", "Digital-native customer behavior"],
      drivers: ["Legacy modernization", "API latency", "Data readiness"],
      aiImpact: [
        "Developer co-pilot tuned to internal code patterns",
        "AI QA agents for regression and journey break detection",
        "Architecture co-pilot mapping technical debt to business risk"
      ]
    }
  ],
  themes: [
    {
      title: "Theme A: Intelligent Service Resolution",
      why: "Cut service cost while lifting NPS through first-contact closure.",
      plays: {
        pilot: ["Deploy call summary + response drafting in contact center", "Enable multilingual branch assistant for 20 top intents"],
        accelerate: ["Link assistant to CRM and ticket context with guardrails", "Introduce proactive issue prediction on high-value segments"],
        scale: ["Run omni-channel agent mesh with branch + call center continuity", "Automate 35-45% routine queries with supervised autonomy"]
      }
    },
    {
      title: "Theme B: AI-Augmented Credit Factory",
      why: "Compress credit turnaround while improving risk consistency.",
      plays: {
        pilot: ["Auto-generate underwriting memo from submitted docs", "AI checklist for policy deviations"],
        accelerate: ["Pre-sanction risk signals from bureau + cashflow patterns", "Credit committee brief in narrative + sensitivity scenarios"],
        scale: ["Agentic underwriting orchestrator across retail + SME", "Continuous portfolio sentinel for early stress signatures"]
      }
    },
    {
      title: "Theme C: Margin Defense & Deposit Growth Copilot",
      why: "Protect NIM with dynamic pricing and retention interventions.",
      plays: {
        pilot: ["Branch-level churn risk heatmap", "RM assistant for tailored retention scripts"],
        accelerate: ["Customer-level deposit elasticity recommendations", "Treasury-retail decision room with daily narratives"],
        scale: ["Autonomous alerting for margin-at-risk cohorts", "Closed-loop experimentation engine for pricing actions"]
      }
    },
    {
      title: "Theme D: Compliance + Control Co-Pilot",
      why: "Reduce compliance burden without compromising rigor.",
      plays: {
        pilot: ["Policy Q&A bot for operations and branch teams", "Auto-extract control evidence from routine workflows"],
        accelerate: ["Test-of-control recommendation assistant", "Regulatory change summarization with impacted process map"],
        scale: ["Always-on compliance agent network across functions", "End-to-end audit pack generation with traceable lineage"]
      }
    }
  ]
};
