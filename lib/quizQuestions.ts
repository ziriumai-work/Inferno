export const quizQuestions: Question[] = [
  {
    id: "ownership",
    text: "Is your business at least 51% owned and controlled by one or more women?",
    description: "Required for Woman-Owned Small Business (WOSB) status.",
    options: [
      { label: "Yes, 51%+ female-owned", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "econDisadv",
    text: "Is the primary owner's personal net worth under $850,000?",
    description: "Excludes primary residence and business equity. Critical for SBA 8(a) and EDWOSB.",
    options: [
      { label: "Yes, under $850k limit", value: "yes" },
      { label: "No, above $850k", value: "no" },
    ],
  },
  {
    id: "veteran",
    text: "Is your business at least 51% owned and controlled by one or more military veterans?",
    description: "Base requirement for VOSB or SDVOSB credentials.",
    options: [
      { label: "Yes, veteran-owned", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "disabled",
    text: "If veteran-owned, is the owner a service-disabled veteran?",
    description: "Determines eligibility for Service-Disabled Veteran-Owned Small Business (SDVOSB).",
    options: [
      { label: "Yes, service-disabled status", value: "yes" },
      { label: "No / Not Applicable", value: "no" },
    ],
  },
  {
    id: "location",
    text: "Is your principal corporate office located in a HUBZone area?",
    description: "Historically Underutilized Business Zone maps are defined by SBA.gov.",
    options: [
      { label: "Yes, office is in a HUBZone", value: "yes" },
      { label: "No / Not Sure", value: "no" },
    ],
  },
  {
    id: "employees",
    text: "Do at least 35% of your employees reside within an SBA HUBZone?",
    description: "Mandatory ongoing residency ratio compliance check for HUBZone status.",
    options: [
      { label: "Yes, 35%+ of staff reside in HUBZone", value: "yes" },
      { label: "No / Not Sure", value: "no" },
    ],
  },
  {
    id: "social",
    text: "Is the primary owner a member of a socially disadvantaged group?",
    description: "Includes Black Americans, Hispanic Americans, Native Americans, or Asian Pacific Americans.",
    options: [
      { label: "Yes, group member", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "businessAge",
    text: "Has your business been operating for at least 2 years in your primary industry?",
    description: "SBA 8(a) typically requires two years of tax returns, though waivers exist.",
    options: [
      { label: "Yes, 2+ years of operation", value: "yes" },
      { label: "No, under 2 years", value: "no" },
    ],
  },
];
