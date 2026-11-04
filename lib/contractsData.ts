export type SolicitationStatus = "open" | "closing_soon" | "closed";

export interface SolicitationStatusResult {
  status: SolicitationStatus;
  label: string;
  badgeClass: string;
  isPast: boolean;
  daysRemaining: number;
}

/**
 * Derives solicitation status from deadline using UTC end-of-day comparison.
 * - closed: deadline end-of-day is before now
 * - closing_soon: deadline is within 7 days
 * - open: deadline is more than 7 days in the future
 */
export function getSolicitationStatus(
  deadlineStr: string,
  nowDate: Date = new Date()
): SolicitationStatusResult {
  // Support YYYY-MM-DD or ISO strings
  const dateParts = deadlineStr.split("T")[0].split("-");
  let deadlineUtc: Date;

  if (dateParts.length === 3) {
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    // End of day in UTC: 23:59:59.999Z
    deadlineUtc = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  } else {
    deadlineUtc = new Date(deadlineStr);
  }

  const diffMs = deadlineUtc.getTime() - nowDate.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return {
      status: "closed",
      label: "Closed / Concluded",
      badgeClass: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
      isPast: true,
      daysRemaining: 0,
    };
  }

  if (diffMs <= 7 * 24 * 60 * 60 * 1000) {
    return {
      status: "closing_soon",
      label: `Closing Soon (${daysRemaining}d left)`,
      badgeClass: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      isPast: false,
      daysRemaining,
    };
  }

  return {
    status: "open",
    label: "Active Solicitation",
    badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    isPast: false,
    daysRemaining,
  };
}

export const rawMockContracts: Contract[] = [
  {
    solicitation: "FEMA-2026-PA-0482",
    title: "Disaster Recovery Public Assistance (PA) & Project Formulation",
    agency: "Federal Emergency Management Agency (FEMA) / Region IV",
    naics: "541611",
    setAside: "HUBZone Set-Aside",
    postedDate: "2026-08-05",
    deadline: "2026-09-25",
    location: "Orlando, FL / Southeast Regional Deployments",
    status: "Closed / Concluded",
  },
  {
    solicitation: "FEMA-2026-IA-0914",
    title: "Disaster Survivor Case Management & Individual Assistance (IA)",
    agency: "Department of Homeland Security / FEMA",
    naics: "624230",
    setAside: "Veteran-Owned Small Business (VOSB) Set-Aside",
    postedDate: "2026-08-08",
    deadline: "2026-09-30",
    location: "Nationwide Field Cadres / Multi-State",
    status: "Closed / Concluded",
  },
  {
    solicitation: "USACE-2026-DEBRIS-112",
    title: "Field Debris Monitoring, Load Ticket Audit & Haul Verification",
    agency: "U.S. Army Corps of Engineers (USACE) - South Atlantic Division",
    naics: "562910",
    setAside: "HUBZone / Small Business Set-Aside",
    postedDate: "2026-08-10",
    deadline: "2026-10-05",
    location: "Gulf Coast & Coastal Region Field Operations",
    status: "Closed / Concluded",
  },
  {
    solicitation: "HHS-2026-CC-3301",
    title: "Disaster Helpline Contact Center Operations & Surge Intake Staffing",
    agency: "Department of Health & Human Services (HHS) / ASPR",
    naics: "561422",
    setAside: "HUBZone Set-Aside",
    postedDate: "2026-08-12",
    deadline: "2026-10-10",
    location: "Orlando, FL / Secure Remote Infrastructure",
    status: "Closed / Concluded",
  },
  {
    solicitation: "NAVFAC-2026-FAC-704",
    title: "Facilities Support, Remediation & Emergency Staging Management",
    agency: "Naval Facilities Engineering Systems Command (NAVFAC)",
    naics: "561210",
    setAside: "Veteran-Owned Small Business (VOSB)",
    postedDate: "2026-08-14",
    deadline: "2026-10-15",
    location: "Southeast Naval Base Installations",
    status: "Closed / Concluded",
  },
  {
    solicitation: "DOT-2026-LOG-882",
    title: "Emergency Freight Logistics, Staging Area & POD Transport Coordination",
    agency: "Department of Transportation / Federal Highway Administration",
    naics: "488510",
    setAside: "Total Small Business Set-Aside",
    postedDate: "2026-08-16",
    deadline: "2026-10-20",
    location: "Regional Staging Sites & Transit Corridors",
    status: "Closed / Concluded",
  },
  {
    solicitation: "FDEM-2026-EOP-055",
    title: "Comprehensive Emergency Management Planning & HSEEP TTX Exercises",
    agency: "Florida Division of Emergency Management (FDEM)",
    naics: "541690",
    setAside: "State / Local Socioeconomic Teaming",
    postedDate: "2026-08-17",
    deadline: "2026-10-25",
    location: "Tallahassee & Central Florida Districts",
    status: "Closed / Concluded",
  },
  {
    solicitation: "GSA-2026-OASIS-401",
    title: "Strategic Program Management, Cost Accounting & Operational Consulting",
    agency: "General Services Administration (GSA) - Federal Acquisition Service",
    naics: "541618",
    setAside: "HUBZone / VOSB Multiple-Award",
    postedDate: "2026-08-18",
    deadline: "2026-11-01",
    location: "Washington, D.C. / Remote",
    status: "Closed / Concluded",
  },
];

// In production, mock placeholder solicitations are gated out unless explicitly enabled.
// Real solicitations are retrieved via the SAM.gov live API integration stub.
export const contractsData: Contract[] =
  process.env.NODE_ENV === "production" ? [] : rawMockContracts;

export const mockContracts = contractsData;
