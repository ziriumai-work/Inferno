"use client";

// Dynamic Data Store for The Inferno Group LLC B2G Portal
// Synced with LocalStorage and safely handles Next.js SSG build rendering.

import { faqData } from "@/lib/faqData";
import { contractsData } from "@/lib/contractsData";
import { capabilitiesData } from "@/lib/capabilitiesData";
import { resourcesData } from "@/lib/resourcesData";
import { knowledgeBase, KnowledgeBaseItem } from "@/lib/chatbotData";
import { partnerCardsData } from "@/lib/partnerCardsData";
import { quizQuestions } from "@/lib/quizQuestions";

export type { KnowledgeBaseItem };

export interface JobApplicationDetails {
  // Contact & Profile
  legalName: string;
  preferredName?: string;
  cityStateZip: string;
  linkedinUrl?: string;

  // Qualifications & Background
  yearsExperience: string; // e.g. "0-2 years" | "3-5 years" | "6-10 years" | "10+ years"
  educationLevel: string; // e.g. "High School / GED" | "Associate Degree" | "Bachelor's Degree" | "Master's Degree" | "Doctorate" | "Other"
  certifications: string[]; // e.g. ["FEMA ICS-100/200/700/800", "PMP", "CFM", "DCAA Compliance", "PE", "CPA", "OSHA"]
  customCertifications?: string;

  // Authorization & Clearances
  workAuthorization: "US Citizen" | "Permanent Resident" | "Authorized to Work" | "Requires Sponsorship" | string;
  requiresSponsorship: "Yes" | "No" | string;
  securityClearance: "None" | "Public Trust" | "Secret" | "Top Secret / SCI" | "Other" | string;
  willingToTravel: "No Travel" | "Up to 25%" | "Up to 50%" | "75-100% Emergency Disaster Deployment" | string;
  earliestStartDate: string;
  desiredCompensation: string;

  // Statement & Attestation
  statementOfInterest: string;
  attestationConfirmed: boolean;
  digitalSignature: string;
  signedAt: string;
}

export interface AdminLead {
  id: string;
  type: string;
  name?: string;
  contactName?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  org?: string;
  company?: string;
  partnerCompany?: string;
  service?: string;
  message?: string;
  notes?: string;
  reviewNotes?: string;
  jobId?: string;
  jobTitle?: string;
  targetEmail?: string;
  cover?: string;
  resumeName?: string;
  resumeData?: string;
  solicitation?: string;
  contractTitle?: string;
  agency?: string;
  teamingRole?: string;
  uei?: string;
  naics?: string;
  partnerType?: string;
  certStatus?: string;
  bondingCapacity?: string;
  consultType?: string;
  timezone?: string;
  date?: string;
  time?: string;
  answers?: Record<string, string>;
  recommendations?: string[];
  resourceId?: string;
  resourceTitle?: string;
  status?: "new" | "reviewed" | "contacted" | "archived";
  adminNotes?: string;
  createdAt: string;

  // Comprehensive Employment Application Parameters
  applicationDetails?: JobApplicationDetails;
  workAuthorization?: string;
  securityClearance?: string;
  yearsExperience?: string;
  educationLevel?: string;
  certifications?: string[];
  willingToTravel?: string;
  earliestStartDate?: string;
  desiredCompensation?: string;
  digitalSignature?: string;
  attestationConfirmed?: boolean;
  cityStateZip?: string;
  linkedinUrl?: string;
}

export interface ValueItem {
  title: string;
  desc: string;
  icon?: string;
}

export interface StepItem {
  step: string;
  title: string;
  desc: string;
}

export interface AboutData {
  story: string;
  mission: string;
  vision: string;
  coreValues: ValueItem[];
  howWeWorkSummary?: string;
  howWeWork: StepItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string; // Base64 or standard asset URL
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  status: "draft" | "published";
}

export interface ServiceItem {
  id: string;
  num: string;
  badge: string;
  title: string;
  headline?: string;
  desc: string;
  caps: string[];
  idealFor?: string[];
  status: "draft" | "published";
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

export interface TestimonialItem {
  id: string;
  rating: number;
  text: string;
  name: string;
  company: string;
  role: string;
  status: "draft" | "published";
  image?: string;
}

export interface CommunityStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string; // Base64 or standard asset URL
  videoUrl?: string; // Optional video asset or embed URL
  gallery?: string[]; // Optional supporting photo array
  featured: boolean;
  status: "draft" | "published";
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string; // Rich Text (can use newlines for paragraphs)
  publishedDate: string;
  author: string;
  status: "draft" | "published";
}

export interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  icon: string; // SVG icon key
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  lastDate?: string;
  status: "draft" | "published";
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: "draft" | "published";
}

export interface LegalPage {
  id: string;
  title: string;
  content: string;
}

export interface HeroData {
  eyebrow: string;
  headlineMain: string;
  headlineGradient: string;
  subheadline: string;
  videoUrl: string;
  fallbackImage: string;
  ctaText1: string;
  ctaLink1: string;
  ctaText2: string;
  ctaLink2: string;
}

export interface SiteSettings {
  companyName: string;
  phone: string;
  emergencyHotline: string;
  emergencyBannerActive: boolean;
  emergencyBannerMessage: string;
  contactEmail: string;
  careersEmail: string;
  communityEmail: string;
  address: string;
  coordinationWindow: string;
  uei: string;
  cageCode: string;
  primaryNaics: string;
  linkedinUrl: string;
  twitterUrl: string;
}

export interface PartnerCardItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  status: "draft" | "published";
}

export interface QuizQuestionItem {
  id: string;
  text: string;
  description: string;
  options: { label: string; value: string }[];
  status: "draft" | "published";
}

// ── DEFAULT INITIAL SEEDS ──

const defaultSiteSettings: SiteSettings = {
  companyName: "The Inferno Group LLC",
  phone: "(407) 555-0199",
  emergencyHotline: "1-800-555-TIG1",
  emergencyBannerActive: false,
  emergencyBannerMessage: "ACTIVE EMERGENCY DIRECTIVE: Emergency Incident Response Cadre stands ready for rapid nationwide deployment.",
  contactEmail: "Contact@theinfernogroup.com",
  careersEmail: "Jobs@theinfernogroup.com",
  communityEmail: "InfernoCares@theinfernogroup.com",
  address: "Orlando, Florida (Nationwide Deployments)",
  coordinationWindow: "Response within 12 business hours",
  uei: "QW6RHJACHA56",
  cageCode: "22VP2",
  primaryNaics: "541611",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://x.com",
};

const defaultPartnerCards: PartnerCardItem[] = partnerCardsData.map((p, idx) => ({
  id: `partner-${idx + 1}`,
  badge: p.badge,
  title: p.title,
  desc: p.desc,
  status: "published",
}));

const defaultQuizQuestions: QuizQuestionItem[] = quizQuestions.map((q) => ({
  id: q.id,
  text: q.text,
  description: q.description,
  options: q.options,
  status: "published",
}));

const defaultAbout: AboutData = {
  story: `The Inferno Group was founded on a simple belief: meaningful impact begins with action.

Drawing on deep experience across government operations, emergency management, disaster recovery, and small business consulting, we built TIG to help agencies and businesses tackle complex missions with speed and precision.

Service cannot wait, and neither can opportunity. Every engagement is guided by integrity, accountability, and measurable results—building stronger organizations and more resilient communities.`,
  mission:
    "To serve with purpose, lead with integrity, and deliver practical solutions that strengthen organizations and protect communities.",
  vision: "Every mission matters because every community matters.",
  coreValues: [
    {
      title: "Service Above Self",
      desc: "Serving clients, communities, and partners with purpose and professionalism.",
      icon: "shield",
    },
    {
      title: "Integrity Without Compromise",
      desc: "Earning trust through honesty, transparency, and full accountability.",
      icon: "lock",
    },
    {
      title: "Excellence in Execution",
      desc: "Preparing relentlessly and executing every mission with precision.",
      icon: "zap",
    },
    {
      title: "Resilient Innovation",
      desc: "Solving complex challenges with adaptable, forward-looking solutions.",
      icon: "cpu",
    },
    {
      title: "One Team. One Mission.",
      desc: "Collaborating with shared focus to deliver results that matter.",
      icon: "file-check",
    },
  ],
  howWeWorkSummary:
    "We partner closely with clients to pinpoint challenges, design practical strategies, and execute with discipline across emergency recovery, government programs, and small business growth.",
  howWeWork: [
    {
      step: "01",
      title: "Identify Challenges",
      desc: "Pinpoint core operational, compliance, and growth bottlenecks.",
    },
    {
      step: "02",
      title: "Develop Strategic Solutions",
      desc: "Design actionable roadmaps for disaster recovery, operations, and revenue growth.",
    },
    {
      step: "03",
      title: "Execute with Precision",
      desc: "Deploy disciplined teams and controls that deliver measurable results.",
    },
    {
      step: "04",
      title: "Sustain Accountability",
      desc: "Maintain clear communication, audit readiness, and continuous improvement.",
    },
  ],
};

const defaultTeam: TeamMember[] = [
  {
    id: "andre-montgomery",
    name: "Andre Montgomery",
    role: "Founder & Chief Executive Officer",
    bio: "Government consulting and operations leader experienced in emergency management, disaster recovery, and large-scale program execution. Andre leads TIG’s strategic vision, federal partnerships, and organizational growth.",
    image: "/team_andre.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      email: "Andre.Montgomery@theinfernogroup.com",
    },
    status: "published",
  },
  {
    id: "fady-youssef",
    name: "Fady Youssef",
    role: "Director of Emergency Management Services",
    bio: "Operations leader with 17+ years across government programs, healthcare, and regulated operations. Fady directs TIG’s program execution, process improvement, and emergency response delivery.",
    image: "/team_fady.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      email: "Fady.Youssef@theinfernogroup.com",
    },
    status: "published",
  },
  {
    id: "charnelle-smith",
    name: "Charnelle Smith",
    role: "Director of Business Development & Capture",
    bio: "Program and capture leader with 7+ years in project management, performance analysis, and strategic partnerships. Charnelle drives opportunity capture, partner engagement, and growth across public and commercial markets.",
    image: "/team_charnelle.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      email: "Charnelle.Smith@theinfernogroup.com",
    },
    status: "published",
  },
  {
    id: "kelly-clerveaux",
    name: "Kelly Clerveaux, Esq.",
    role: "General Counsel",
    bio: "Attorney and business owner experienced in corporate counsel, regulatory compliance, and healthcare operations. Kelly oversees TIG’s legal strategy, contract governance, and risk management.",
    image: "/team_kelly.png",
    socialLinks: {
      linkedin: "https://linkedin.com",
      email: "Kelly.Clerveaux@theinfernogroup.com",
    },
    status: "published",
  },
];

const defaultServices: ServiceItem[] = [
  {
    id: "emergency-management-and-disaster-recovery",
    num: "01",
    badge: "Full-Lifecycle Disaster Recovery",
    title: "Emergency Management & Disaster Recovery",
    headline: "Rapid Response, Grant Compliance & Long-Term Community Recovery",
    desc: "Experienced field cadres and grant specialists helping agencies respond to disasters, manage FEMA recovery funding, and rebuild resilient communities.",
    caps: [
      "EOC Operational & Incident Support",
      "FEMA Public Assistance (PA) Grant Management",
      "FEMA Individual Assistance (IA) Survivor Support",
      "Field Debris Monitoring & Disposal Verification",
      "Disaster Case Management & Needs Intake",
      "Damage Assessments & Cost Estimation",
      "Stafford Act & 2 CFR Part 200 Audit Readiness",
      "Grant Appeals, Reimbursements & Closeout",
      "Rapid Cadre Mobilization & Field Deployment",
    ],
    idealFor: [
      "FEMA & Federal Partners",
      "State Emergency Agencies",
      "Counties & Municipalities",
      "Tribal Governments",
      "Public Utilities",
      "Healthcare Systems",
      "School Districts",
    ],
    status: "published",
  },
  {
    id: "planning-and-preparedness",
    num: "02",
    badge: "Proactive Operational Readiness",
    title: "Planning, Preparedness & Incident Management",
    headline: "Actionable Emergency Plans & ICS/NIMS Incident Leadership",
    desc: "We build operational readiness before crisis strikes—delivering compliant emergency plans, continuity frameworks, and certified EOC command leadership.",
    caps: [
      "EOC Planning, Operations & Logistics Leadership",
      "Emergency Operations & Incident Action Plans (EOP/IAP)",
      "Continuity of Operations & Government (COOP/COG)",
      "Hazard Mitigation & Vulnerability Assessments",
      "Crisis Management & Business Continuity",
      "HSEEP Tabletop, Functional & Full-Scale Exercises",
      "After-Action Reports (AAR) & Improvement Plans",
      "ICS/NIMS Compliance & Interagency Protocols",
    ],
    idealFor: [
      "Emergency Operations Centers",
      "Federal & State Agencies",
      "Local Governments",
      "Healthcare Networks",
      "Critical Infrastructure",
      "Universities & Schools",
    ],
    status: "published",
  },
  {
    id: "contact-center-operations",
    num: "03",
    badge: "Scalable Citizen & Survivor Support",
    title: "Contact Center Operations & Case Support",
    headline: "High-Capacity, Empathetic & Compliant Helpline Operations",
    desc: "Mission-focused contact centers delivering rapid, accurate, and compassionate intake and case support for disaster survivors and public programs.",
    caps: [
      "Disaster Survivor & Applicant Helplines",
      "Application Intake & Eligibility Verification",
      "Confidential Case Tracking & Documentation",
      "Quality Assurance (QA) Scoring & Calibration",
      "Strict PII & Data Privacy Enforcement",
      "Frontline Supervision & Escalation Resolution",
      "Rapid Surge Staffing for High-Volume Events",
    ],
    idealFor: [
      "Disaster Recovery Programs",
      "State & Municipal Help Desks",
      "Relief Organizations",
      "Housing & Human Services",
      "Public Health Operations",
    ],
    status: "published",
  },
  {
    id: "program-and-project-management",
    num: "04",
    badge: "Disciplined Program Execution",
    title: "Program, Project & Financial Management",
    headline:
      "Keeping Public & Commercial Initiatives On Schedule and Audit-Ready",
    desc: "Disciplined program leadership and financial controls that keep complex government and commercial initiatives compliant, on time, and on budget.",
    caps: [
      "Full-Lifecycle Program Management (Mobilization to Closeout)",
      "Work Breakdown Scheduling & Milestone Tracking",
      "Government Contract Accounting & Invoicing Controls",
      "Budgeting, Forecasting & Cash-Flow Management",
      "Quality Assurance Audits & Scorecards",
      "Risk Mitigation & Executive Dashboards",
      "Subcontractor & Vendor Administration",
      "DCAA & FAR Cost Compliance Support",
    ],
    idealFor: [
      "Government Program Offices",
      "Prime Contractors",
      "Grant-Funded Authorities",
      "Municipal Infrastructure",
      "Financial Controllers",
    ],
    status: "published",
  },
  {
    id: "strategic-consulting-and-operational-excellence",
    num: "05",
    badge: "Small Business Growth & Revenue Advisory",
    title: "Strategic Planning & Small Business Advisory",
    headline:
      "Operational Scaling, Commercial Revenue Growth & Capture Strategy",
    desc: "Beyond emergency management, TIG partners with independent and small businesses to streamline operations, diversify revenue, and win public and commercial contracts.",
    caps: [
      "Small Business Strategic Planning & Revenue Roadmaps",
      "Workflow Optimization & Process Engineering",
      "Commercial Growth & Market Diversification",
      "HUBZone & VOSB Teaming & Proposal Capture",
      "Business Continuity & Risk Mitigation",
      "Financial Readiness & Indirect Rate Structuring",
      "Contract Governance & Subcontracting Strategy",
      "SOP Development & Fractional Executive Advisory",
    ],
    idealFor: [
      "Independent & Small Businesses",
      "Growing Commercial Enterprises",
      "Certified Subcontractors",
      "GovCon Teaming Partners",
      "Executive Leadership Teams",
    ],
    status: "published",
  },
  {
    id: "training-exercises-and-workforce-development",
    num: "06",
    badge: "Deployable Cadres & Readiness Training",
    title: "Training, Workforce Development & Cadre Staffing",
    headline: "Practical Training Programs & Rapid Cadre Mobilization",
    desc: "We design hands-on training curriculums, realistic simulations, and deployable staffing pipelines that prepare teams to perform under pressure.",
    caps: [
      "FEMA & NIMS/ICS Training Workshops",
      "Instructor-Led & Virtual Curriculum Design",
      "Full-Cycle Deployable Cadre Recruitment",
      "Rapid Emergency Workforce Mobilization",
      "Simulations, Job Aids & Competency Checks",
      "Train-the-Trainer & SOP Delivery",
      "Leadership Development & E-Verify Onboarding",
    ],
    idealFor: [
      "Emergency Response Cadres",
      "Government Agencies",
      "Contact Center Operations",
      "Public Safety & Healthcare",
      "Corporate Response Teams",
    ],
    status: "published",
  },
  {
    id: "facilities-logistics-and-specialty-services",
    num: "07",
    badge: "Field Logistics & Facilities Support",
    title: "Facilities Support, Logistics & Specialty Services",
    headline:
      "Nationwide Resource Logistics, Facilities Maintenance & Specialty Trades",
    desc: "Coordinating supply chains, staging operations, facilities maintenance, and bonded trade partners to sustain emergency and infrastructure operations.",
    caps: [
      "Emergency Logistics & Resource Tracking",
      "Staging Area, Warehouse & POD Management",
      "Facilities Support & Maintenance (NAICS 561210)",
      "Environmental Remediation Support (NAICS 562910)",
      "Commercial Painting & Specialty Trades (NAICS 238320)",
      "Janitorial & Facility Sanitation (NAICS 561720)",
      "Freight & Supply Chain Coordination (NAICS 488510)",
      "Bonded Subcontractor Teaming & Procurement",
    ],
    idealFor: [
      "Federal & State Facilities",
      "Disaster Staging Operations",
      "Municipal Public Works",
      "Commercial Property Operators",
      "Prime Contractors",
    ],
    status: "published",
  },
];

const defaultStats: StatItem[] = [
  {
    id: "stat-1",
    value: "10",
    suffix: "+",
    label: "Years of Industry Experience",
  },
  {
    id: "stat-2",
    value: "50",
    suffix: "+",
    label: "Emergency Management & PA Programs",
  },
  { id: "stat-3", value: "50", label: "States Covered" },
  { id: "stat-4", value: "Virtual & Onsite", label: "Nationwide Operations" },
];

// TODO: FLAG FOR CLIENT - No testimonial content was provided in the source document. Testimonials pending client submission.
const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    rating: 5,
    text: "TIG's field oversight, debris monitoring, and Public Assistance compliance ensured seamless execution and full audit readiness.",
    name: "Disaster Recovery Partner",
    company: "Public Sector Recovery Network",
    role: "Operations Director",
    status: "published",
  },
  {
    id: "test-2",
    rating: 5,
    text: "As a HUBZone and VOSB partner, TIG brings disciplined leadership, rapid cadre staffing, and reliable execution to complex procurements.",
    name: "Federal Prime Contractor",
    company: "Defense & Advisory Teaming Partner",
    role: "VP of Growth",
    status: "published",
  },
  {
    id: "test-3",
    rating: 5,
    text: "Inferno Cares exemplifies service beyond the contract—delivering disaster relief and student scholarships across Greater Orlando.",
    name: "Community Program Leader",
    company: "Greater Orlando Community Alliance",
    role: "Executive Director",
    status: "published",
  },
];

const defaultCommunityStories: CommunityStory[] = [
  {
    id: "kicking-for-relief",
    title: "Kicking for Relief Kickball Tournament",
    summary:
      "Annual charity tournament uniting community teams to fund direct relief for disaster-impacted families.",
    content:
      "TIG hosts the 'Kicking for Relief' Kickball Tournament to unite corporate partners, volunteers, and emergency professionals. 100% of proceeds go directly toward immediate relief for storm-displaced households.",
    image: "/kickball_tournament.png",
    gallery: ["/kickball_tournament.png", "/impact_texas.png"],
    featured: true,
    status: "published",
  },
  {
    id: "inferno-ignite-scholarship",
    title: "The Inferno Ignite Scholarship",
    summary:
      "Annual academic stipends and book scholarships for graduating high school seniors entering college.",
    content:
      "The Inferno Ignite Scholarship awards annual book stipends and micro-grants to Greater Orlando high school seniors entering college or technical programs—removing financial barriers for textbooks and essential coursework tools.",
    image: "/scholarship_ceremony.png",
    videoUrl: "/scholarship_video.mp4",
    gallery: [
      "/scholarship_ceremony.png",
      "/scholarship_recipients.png",
      "/impact_debris.png",
    ],
    featured: true,
    status: "published",
  },
];

const defaultArticles: Article[] = [
  {
    slug: "disaster-recovery-debris-monitoring",
    title:
      "Disaster Recovery & Debris Monitoring: Audit-Ready Field Operations",
    category: "Emergency Management",
    summary:
      "Field-level debris oversight, load ticket verification, and FEMA Public Assistance Category A compliance.",
    content:
      "Field oversight of disaster debris removal is essential for federal reimbursement compliance. The Inferno Group LLC (TIG) enforces strict load validation, disposal logging, and digital documentation across Category A debris missions.\n\nOur trained monitors verify cubic yardage and debris classifications in real time so municipal project worksheets withstand FEMA Public Assistance (PA) and 2 CFR Part 200 audits.",
    publishedDate: "2026-08-05",
    author: "Emergency Operations Desk",
    status: "published",
  },
  {
    slug: "socioeconomic-hubzone-vosb",
    title: "Federal Socioeconomic Contracting: HUBZone & VOSB Advantages",
    category: "Federal Credentials",
    summary:
      "How SBA HUBZone and Veteran-Owned Small Business (VOSB) credentials accelerate federal procurement and teaming.",
    content:
      "The Inferno Group LLC holds active SBA HUBZone Certified and Veteran-Owned Small Business (VOSB) credentials (UEI: QW6RHJACHA56, CAGE: 22VP2), helping agencies and primes meet statutory small business goals.\n\nHUBZone status provides a 10% price evaluation preference in full-and-open competitions and unlocks sole-source and set-aside awards alongside our operational capabilities.",
    publishedDate: "2026-08-10",
    author: "GovCon Advisory Desk",
    status: "published",
  },
  {
    slug: "disaster-survivor-contact-centers",
    title: "Disaster Survivor Contact Centers: Scalable & Empathetic Intake",
    category: "Emergency Management",
    summary:
      "Delivering rapid helpline support, QA calibration, and compassionate survivor intake during disaster recovery.",
    content:
      "When disasters strike, survivors need immediate, clear guidance. TIG staffs and manages high-capacity disaster helplines that scale rapidly during surge activations.\n\nOur model combines rigorous Quality Assurance (QA) calibration and strict PII protection to guide applicants through intake and eligibility verification while meeting agency SLAs.",
    publishedDate: "2026-08-12",
    author: "Contact Center Operations Desk",
    status: "published",
  },
  {
    slug: "b2g-accounting-dcaa-compliance",
    title: "Government Contract Accounting & DCAA Compliance",
    category: "B2G Accounting",
    summary:
      "Best practices for WBS cost tracking, indirect rate formulation, and FAR Part 31 audit readiness.",
    content:
      "Federal contracts require disciplined accounting controls. TIG implements transparent cost structures aligned with Defense Contract Audit Agency (DCAA) standards and FAR Part 31 principles.\n\nFrom segregating direct and indirect costs to structuring Fringe, Overhead, and G&A rates, we keep project expenditures defensible from award through closeout.",
    publishedDate: "2026-08-14",
    author: "Financial Controls Desk",
    status: "published",
  },
  {
    slug: "emergency-management-planning-exercises",
    title: "Planning, Preparedness & HSEEP Exercises",
    category: "Strategic Teaming",
    summary:
      "Developing compliant Emergency Operations Plans (EOP), COOP/COG frameworks, and HSEEP tabletop exercises.",
    content:
      "Resilience starts before the storm. TIG partners with counties, municipalities, and utilities to update Emergency Operations Plans (EOPs), COOP/COG continuity plans, and hazard mitigation strategies.\n\nWe facilitate HSEEP-compliant Tabletop, Functional, and Full-Scale exercises that test ICS communications and produce actionable After-Action Reports (AAR).",
    publishedDate: "2026-08-16",
    author: "Preparedness & Exercises Desk",
    status: "published",
  },
  {
    slug: "inferno-cares-community-resilience",
    title: "Inferno Cares: Relief & Youth Education Across Our Communities",
    category: "Community Impact",
    summary:
      "How TIG sponsors disaster relief tournaments, youth scholarships, and veteran career pathways.",
    content:
      "Our mission extends beyond contracts. Through Inferno Cares, TIG invests directly in local disaster relief, youth education, and veteran transitions.\n\nSignature initiatives include the 'Kicking for Relief' charity tournament, the 'Inferno Ignite Scholarship' for graduating seniors, and emergency management career pathways for veterans.",
    publishedDate: "2026-08-18",
    author: "Inferno Cares Community Desk",
    status: "published",
  },
];

const defaultAIInnovation: FeatureCard[] = [
  {
    id: "ai-1",
    title: "Procurement Analytics",
    desc: "Automated SAM.gov monitoring to match set-aside opportunities with partner capabilities.",
    icon: "search",
  },
  {
    id: "ai-2",
    title: "Weather Alert Syncing",
    desc: "Real-time NOAA tracking to anticipate storm paths and pre-stage response cadres.",
    icon: "cloud-lightning",
  },
  {
    id: "ai-3",
    title: "PII Compliant Gateways",
    desc: "Encrypted workflows protecting survivor case files, resumes, and procurement records.",
    icon: "lock",
  },
];

const defaultJobs: Job[] = [
  {
    id: "case-manager",
    title: "Case Manager",
    department: "Emergency Operations & Relief",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($24.00–$31.00/hr)",
    summary:
      "Assess needs, maintain accurate case records, coordinate available resources, and help disaster survivors navigate program requirements.",
    description:
      "The Case Manager supports individuals, families, or program participants affected by disasters, emergencies, or government-administered recovery programs. This position is responsible for assessing needs, maintaining accurate case documentation, coordinating available resources, and helping applicants navigate program requirements from intake through resolution.",
    responsibilities: [
      "Conduct applicant or survivor intake, needs assessments, and eligibility reviews.",
      "Maintain complete, accurate, and confidential case records.",
      "Explain program requirements, documentation standards, and next steps to applicants.",
      "Coordinate referrals to governmental, nonprofit, and community resources.",
      "Follow established policies, procedures, service-level requirements, and escalation protocols.",
      "Track case progress and conduct timely follow-up with assigned participants.",
      "Identify complex or sensitive cases requiring supervisory review.",
      "Support reporting, quality assurance, and program documentation requirements.",
      "Maintain professionalism and empathy when assisting individuals experiencing hardship or displacement.",
    ],
    requirements: [
      "High school diploma or equivalent required; associate or bachelor's degree preferred.",
      "Previous case management, disaster recovery, human services, housing, customer service, or government program experience preferred.",
      "Strong written and verbal communication skills.",
      "Ability to manage sensitive information and maintain confidentiality.",
      "Proficiency with Microsoft Office and web-based case management systems.",
      "Ability to work in a fast-paced, deadline-driven environment.",
      "FEMA, Individual Assistance, housing recovery, or human services experience is a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-01",
    status: "published",
  },
  {
    id: "debris-monitor",
    title: "Debris Monitor",
    department: "Field Operations & Recovery",
    location: "Orlando, Florida / Field Assignments as Required",
    type: "Cadre / Temporary ($22.00–$28.00/hr)",
    summary:
      "Provide field-level oversight of disaster debris collection, verify eligible load tickets, and ensure compliance with project procedures.",
    description:
      "The Debris Monitor provides field-level oversight of disaster debris collection and removal operations. The role documents contractor activity, verifies eligible debris and load information, promotes compliance with project requirements, and maintains accurate records supporting reimbursement and contract administration.",
    responsibilities: [
      "Monitor debris collection, loading, hauling, reduction, and disposal activities.",
      "Verify truck identification, load capacity, debris type, collection location, and destination.",
      "Complete required load tickets, logs, photographs, and electronic documentation.",
      "Observe contractor performance for compliance with assigned scope and procedures.",
      "Immediately report safety concerns, prohibited debris, discrepancies, or suspected irregularities.",
      "Maintain accurate daily records and submit documentation according to established deadlines.",
      "Coordinate with field supervisors, debris management personnel, contractors, and local officials.",
      "Follow FEMA, state, local, and project-specific debris monitoring procedures.",
      "Work outdoors for extended periods under varying weather and field conditions.",
    ],
    requirements: [
      "High school diploma or equivalent required.",
      "Valid driver's license and reliable transportation may be required for field assignments.",
      "Ability to use smartphones, tablets, GPS applications, and electronic documentation systems.",
      "Strong attention to detail and ability to maintain accurate records.",
      "Ability to work extended shifts, weekends, holidays, or emergency schedules when activated.",
      "Previous disaster response, construction, inspection, public works, logistics, or debris monitoring experience preferred.",
      "FEMA debris management training is a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-02",
    status: "published",
  },
  {
    id: "director-of-finance",
    title: "Director of Finance",
    department: "Executive & Financial Controls",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($105,000–$135,000/yr)",
    summary:
      "Provide strategic financial leadership, oversee project financial controls, government contract accounting, budgeting, and forecasting.",
    description:
      "The Director of Finance provides strategic and operational leadership for TIG's financial functions. This role oversees financial reporting, budgeting, forecasting, cash management, project financial controls, compliance, and financial planning while helping leadership scale the organization responsibly.",
    responsibilities: [
      "Lead budgeting, forecasting, cash-flow planning, and financial reporting.",
      "Establish and maintain internal financial controls, policies, and procedures.",
      "Monitor company and project-level revenue, expenses, profitability, and performance.",
      "Support government contract accounting, invoicing, documentation, and cost tracking.",
      "Oversee accounts payable, accounts receivable, reconciliations, and financial close activities.",
      "Provide executive leadership with financial analyses and recommendations.",
      "Support pricing strategies, indirect cost analysis, proposal budgets, and project profitability reviews.",
      "Coordinate with tax professionals, auditors, banking partners, payroll providers, and outside advisors.",
      "Monitor compliance with applicable federal, state, contractual, and accounting requirements.",
      "Develop scalable financial processes to support organizational growth.",
    ],
    requirements: [
      "Bachelor's degree in Finance, Accounting, Business Administration, or related field required.",
      "7+ years of progressive finance or accounting experience preferred.",
      "Prior leadership or financial management experience strongly preferred.",
      "Experience with budgeting, forecasting, financial modeling, and management reporting.",
      "Government contracting, project accounting, or professional services experience is highly desirable.",
      "Advanced Excel skills and experience with accounting or ERP platforms.",
      "CPA, CMA, MBA, or similar advanced credential is preferred but not required.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-03",
    status: "published",
  },
  {
    id: "qa-agent",
    title: "Quality Assurance Agent",
    department: "Quality Assurance & Compliance",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($23.00–$29.00/hr)",
    summary:
      "Review customer interactions, case documentation, and operational processes to ensure accuracy and program compliance.",
    description:
      "The Quality Assurance Agent reviews customer interactions, case documentation, and operational processes to ensure accuracy, professionalism, compliance, and adherence to established program standards.",
    responsibilities: [
      "Review calls, cases, records, or transactions against established quality standards.",
      "Score evaluations consistently using approved quality criteria.",
      "Identify documentation, communication, compliance, and process deficiencies.",
      "Provide clear feedback and supporting observations to leadership.",
      "Maintain accurate quality records and evaluation documentation.",
      "Identify recurring trends and opportunities for coaching or process improvement.",
      "Participate in calibration sessions and quality meetings.",
      "Protect confidential customer and program information.",
      "Support audits and corrective-action initiatives as assigned.",
    ],
    requirements: [
      "High school diploma or equivalent required; associate or bachelor's degree preferred.",
      "1+ year of quality assurance, contact center, case management, compliance, or customer service experience preferred.",
      "Strong analytical, listening, writing, and documentation skills.",
      "Ability to interpret procedures and apply standards consistently.",
      "Proficiency with Microsoft Office and web-based applications.",
      "Government program or disaster recovery experience is a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-04",
    status: "published",
  },
  {
    id: "qa-lead",
    title: "Quality Assurance Lead",
    department: "Quality Assurance & Compliance",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($27.00–$35.00/hr)",
    summary:
      "Lead daily quality operations, assist with calibration sessions, track quality trends, and support QA Agents.",
    description:
      "The Quality Assurance Lead supports daily quality operations and serves as a resource to Quality Assurance Agents. The position conducts evaluations, assists with calibration and reporting, identifies performance trends, and helps ensure quality standards are applied consistently across the program.",
    responsibilities: [
      "Perform quality evaluations and secondary reviews.",
      "Provide day-to-day guidance to Quality Assurance Agents.",
      "Assist with calibration sessions and evaluator consistency.",
      "Track quality trends and identify recurring performance gaps.",
      "Prepare quality reports and communicate findings to supervisors and program leadership.",
      "Support coaching recommendations and corrective-action activities.",
      "Assist with quality procedures, scorecards, and process improvements.",
      "Review escalated or complex cases as assigned.",
      "Maintain confidentiality and ensure adherence to contractual and program standards.",
    ],
    requirements: [
      "2+ years of quality assurance, compliance, contact center, or operational experience preferred.",
      "Previous lead or mentoring experience strongly preferred.",
      "Strong analytical and communication skills.",
      "Experience preparing reports and interpreting performance data.",
      "Ability to manage competing priorities in a high-volume environment.",
      "Government, emergency management, or disaster recovery program experience is a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-05",
    status: "published",
  },
  {
    id: "qa-supervisor",
    title: "Quality Assurance Supervisor",
    department: "Quality Assurance & Compliance",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($31.00–$40.00/hr)",
    summary:
      "Oversee QA personnel, performance reporting, calibration processes, compliance monitoring, and continuous improvement.",
    description:
      "The Quality Assurance Supervisor oversees quality assurance personnel and program quality activities. This position is responsible for evaluation standards, performance reporting, coaching coordination, calibration, compliance monitoring, and continuous improvement.",
    responsibilities: [
      "Supervise assigned Quality Assurance Agents and Leads.",
      "Manage quality monitoring schedules, productivity, and evaluation standards.",
      "Conduct calibration sessions and ensure scoring consistency.",
      "Analyze quality results and develop actionable performance recommendations.",
      "Partner with operations and training leadership to address identified deficiencies.",
      "Produce recurring reports for program and executive leadership.",
      "Support audits, corrective-action plans, and compliance reviews.",
      "Maintain and improve quality procedures and evaluation tools.",
      "Coach quality personnel and support professional development.",
      "Escalate significant compliance, customer experience, or operational concerns.",
    ],
    requirements: [
      "3+ years of quality assurance, compliance, contact center, or program operations experience preferred.",
      "1+ year of supervisory or team-lead experience preferred.",
      "Strong reporting, analytical, coaching, and communication skills.",
      "Experience with quality scorecards, performance metrics, and calibration processes.",
      "Ability to supervise remote or distributed teams.",
      "Government contracting or disaster recovery program experience is highly desirable.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-06",
    status: "published",
  },
  {
    id: "training-lead",
    title: "Training Lead",
    department: "Workforce Development & Training",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($72,000–$92,000/yr)",
    summary:
      "Design, coordinate, and deliver training programs for onboarding, continuing education, and emergency mobilization.",
    description:
      "The Training Lead designs, coordinates, and delivers training programs that prepare TIG personnel to successfully perform client and mission requirements. This role supports onboarding, continuing education, process changes, performance improvement, and training quality across multiple programs.",
    responsibilities: [
      "Develop and maintain instructor-led, virtual, and self-paced training materials.",
      "Facilitate new-hire training and recurring professional development.",
      "Coordinate training schedules, attendance, assessments, and completion records.",
      "Partner with operations and quality leadership to identify training needs.",
      "Update training materials following policy, process, system, or contractual changes.",
      "Develop knowledge checks, simulations, job aids, and performance-support resources.",
      "Evaluate training effectiveness and recommend improvements.",
      "Support trainer development and train-the-trainer initiatives.",
      "Maintain organized training documentation and compliance records.",
      "Assist with rapid workforce mobilization during emergency activations.",
    ],
    requirements: [
      "Bachelor's degree or equivalent combination of education and relevant experience preferred.",
      "3+ years of corporate training, instructional delivery, learning and development, or operational training experience.",
      "Experience developing training materials and facilitating adult learning.",
      "Strong presentation, organization, writing, and communication skills.",
      "Familiarity with virtual training platforms and learning management systems.",
      "Government, contact center, emergency management, or disaster recovery experience preferred.",
      "Instructional design or training certification is a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-07",
    status: "published",
  },
  {
    id: "contact-center-supervisor",
    title: "Contact Center Supervisor",
    department: "Contact Center Operations",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($29.00–$37.00/hr) [2 Openings]",
    summary:
      "Lead frontline contact center agents, oversee daily service levels, handle escalations, and manage workforce adherence.",
    description:
      "The Contact Center Supervisor leads frontline agents responsible for delivering timely, accurate, and professional support to customers, applicants, survivors, or program participants. The supervisor is accountable for daily performance, coaching, escalations, workforce adherence, and service quality.",
    responsibilities: [
      "Supervise and coach assigned Contact Center Agents.",
      "Monitor attendance, schedule adherence, productivity, service levels, and quality performance.",
      "Handle escalated customer or applicant concerns.",
      "Conduct individual coaching sessions and team meetings.",
      "Ensure employees follow approved scripts, procedures, documentation standards, and privacy requirements.",
      "Coordinate with quality, training, workforce, and program leadership.",
      "Review performance data and implement corrective or developmental actions.",
      "Support staffing adjustments during periods of increased call volume.",
      "Prepare operational reports and communicate emerging issues to leadership.",
      "Maintain a professional, accountable, and service-oriented team environment.",
    ],
    requirements: [
      "2+ years of contact center, customer service, or program operations experience preferred.",
      "Previous supervisory or team-lead experience strongly preferred.",
      "Experience managing KPIs such as service level, handle time, quality, adherence, and customer satisfaction.",
      "Strong leadership, problem-solving, and conflict-resolution skills.",
      "Ability to manage remote or hybrid employees.",
      "Disaster recovery or government contact center experience is a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-08",
    status: "published",
  },
  {
    id: "administrative-assistant",
    title: "Administrative Assistant",
    department: "Corporate & Operational Support",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($46,000–$60,000/yr)",
    summary:
      "Provide organizational support to TIG leadership and project teams through scheduling, correspondence, and administration.",
    description:
      "The Administrative Assistant provides organizational and administrative support to TIG leadership and project teams. This role helps maintain efficient daily operations through scheduling, correspondence, document preparation, recordkeeping, coordination, and general administrative support.",
    responsibilities: [
      "Manage calendars, meetings, appointments, and scheduling requests.",
      "Prepare correspondence, reports, presentations, and business documents.",
      "Maintain electronic records, files, and administrative documentation.",
      "Support travel coordination, expense documentation, and meeting logistics.",
      "Assist with data entry, document tracking, and project administration.",
      "Coordinate communications with employees, vendors, partners, and clients.",
      "Support procurement, recruiting, onboarding, and operational activities as assigned.",
      "Monitor deadlines and follow up on outstanding administrative items.",
      "Handle confidential business information with discretion.",
      "Provide general support to executive and project leadership.",
    ],
    requirements: [
      "High school diploma or equivalent required; associate or bachelor's degree preferred.",
      "2+ years of administrative, executive support, office management, or related experience preferred.",
      "Strong Microsoft Office skills.",
      "Excellent written communication, organization, and attention to detail.",
      "Ability to prioritize multiple assignments independently.",
      "Professional judgment and ability to handle confidential information.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-09",
    status: "published",
  },
  {
    id: "contact-center-agent",
    title: "Contact Center Agent",
    department: "Contact Center Operations",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($22.00–$27.00/hr)",
    summary:
      "Provide professional assistance to customers and disaster survivors through inbound/outbound calls and documentation.",
    description:
      "The Contact Center Agent provides professional assistance to customers, applicants, survivors, or program participants through inbound and outbound communications. Agents are responsible for providing accurate information, documenting interactions, resolving routine concerns, and escalating complex matters appropriately.",
    responsibilities: [
      "Respond to inbound and outbound calls and other approved communication channels.",
      "Provide accurate information regarding programs, services, applications, or case status.",
      "Document customer interactions completely and accurately.",
      "Verify information and follow established privacy and security procedures.",
      "Resolve routine concerns and escalate complex issues when appropriate.",
      "Meet established attendance, quality, productivity, and service expectations.",
      "Participate in required training and coaching.",
      "Maintain professionalism when assisting individuals experiencing stressful circumstances.",
      "Follow approved scripts, workflows, policies, and procedures.",
    ],
    requirements: [
      "High school diploma or equivalent required.",
      "Previous customer service, contact center, hospitality, healthcare, government, or case support experience preferred.",
      "Strong communication and active-listening skills.",
      "Comfortable working with multiple computer applications simultaneously.",
      "Reliable attendance and ability to work assigned schedules.",
      "Bilingual capabilities are a plus.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-10",
    status: "published",
  },
  {
    id: "talent-acquisition-specialist",
    title: "Talent Acquisition Specialist",
    department: "Corporate & Cadre Recruitment",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($60,000–$78,000/yr)",
    summary:
      "Manage full-cycle recruiting for corporate and deployable cadre workforce across emergency activations.",
    description:
      "The Talent Acquisition Specialist manages full-cycle recruiting for corporate, professional, technical, and emergency-response positions. This role will be particularly important in building and maintaining TIG's deployable cadre workforce while supporting long-term organizational hiring needs.",
    responsibilities: [
      "Manage full-cycle recruiting from requisition through accepted offer.",
      "Source candidates through job boards, professional networks, referrals, outreach, and recruiting platforms.",
      "Build and maintain talent pipelines for emergency management and disaster recovery activations.",
      "Screen candidates and coordinate interviews with hiring managers.",
      "Maintain candidate records and recruiting documentation.",
      "Support offer preparation, pre-employment requirements, and onboarding coordination.",
      "Develop relationships with industry professionals, universities, workforce organizations, and recruiting partners.",
      "Track recruiting metrics, vacancies, time-to-fill, and candidate pipeline activity.",
      "Support rapid staffing initiatives during emergency mobilizations.",
      "Promote a professional and responsive candidate experience.",
    ],
    requirements: [
      "Bachelor's degree preferred or equivalent recruiting experience.",
      "2+ years of recruiting or talent acquisition experience preferred.",
      "Experience with applicant tracking systems and candidate sourcing tools.",
      "Strong written, verbal, organizational, and relationship-management skills.",
      "Ability to manage high-volume and specialized recruiting simultaneously.",
      "Government contracting, emergency management, disaster recovery, or staffing agency experience is highly desirable.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-11",
    status: "published",
  },
  {
    id: "dr-ia-project-manager",
    title: "Disaster Recovery Individual Assistance Project Manager",
    department: "Emergency Management & Recovery",
    location:
      "Orlando, Florida / Remote, with travel or deployment as required",
    type: "Full-Time ($92,000–$118,000/yr)",
    summary:
      "Lead survivor-support projects from mobilization through closeout, overseeing FEMA IA compliance and case management.",
    description:
      "The Disaster Recovery Individual Assistance (IA) Project Manager leads projects supporting programs designed to assist individuals and households affected by disasters. This role manages project delivery, client coordination, staffing, performance, compliance, documentation, and program implementation.",
    responsibilities: [
      "Lead Individual Assistance and survivor-support projects from mobilization through closeout.",
      "Manage project schedules, deliverables, staffing, risks, budgets, and performance.",
      "Coordinate with government clients, program leadership, community organizations, and project teams.",
      "Ensure program activities comply with applicable FEMA, state, local, and contractual requirements.",
      "Oversee case management, applicant support, housing assistance, contact center, or related IA functions as assigned.",
      "Develop project procedures, reporting structures, and performance controls.",
      "Monitor operational metrics and implement corrective actions as needed.",
      "Prepare executive and client-facing reports, briefings, and status updates.",
      "Support proposal development and recovery program planning.",
      "Lead teams during emergency activations or periods of rapid operational growth.",
    ],
    requirements: [
      "Bachelor's degree in Emergency Management, Public Administration, Business, Project Management, or related field preferred.",
      "5+ years of project, program, emergency management, human services, or disaster recovery experience preferred.",
      "Demonstrated experience leading multidisciplinary teams and client-facing projects.",
      "Familiarity with FEMA Individual Assistance programs and disaster survivor services strongly preferred.",
      "Strong project management, reporting, communication, and analytical skills.",
      "PMP, FEMA training, or emergency management credentials are highly desirable.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-12",
    status: "published",
  },
  {
    id: "dr-pa-project-manager",
    title: "Disaster Recovery Public Assistance Project Manager",
    department: "Emergency Management & Grant Compliance",
    location:
      "Orlando, Florida / Remote, with travel or deployment as required",
    type: "Full-Time ($98,000–$128,000/yr)",
    summary:
      "Manage FEMA Public Assistance recovery projects, damage documentation, scopes of work, and grant closeouts.",
    description:
      "The Disaster Recovery Public Assistance (PA) Project Manager leads FEMA Public Assistance recovery projects and supports applicants throughout the disaster grant lifecycle. This position oversees project development, documentation, compliance, reimbursement support, client communication, and project delivery.",
    responsibilities: [
      "Manage FEMA Public Assistance projects from initial assessment through closeout.",
      "Support applicants with damage documentation, scopes of work, cost development, and reimbursement activities.",
      "Coordinate project documentation and maintain organized records supporting eligibility and compliance.",
      "Assist clients with FEMA Requests for Information and project-related correspondence.",
      "Monitor project schedules, budgets, deliverables, risks, and recovery milestones.",
      "Interpret applicable FEMA guidance, Stafford Act requirements, 2 CFR Part 200 principles, and client requirements.",
      "Coordinate with engineers, cost estimators, grant specialists, finance teams, and client personnel.",
      "Prepare project reports, briefings, and executive updates.",
      "Support appeals, amendments, closeout, and audit readiness as needed.",
      "Provide leadership to assigned recovery personnel and subcontractors.",
    ],
    requirements: [
      "Bachelor's degree in Emergency Management, Public Administration, Business, Engineering, Construction Management, or related discipline preferred.",
      "5+ years of disaster recovery, grants management, project management, or related experience preferred.",
      "Direct FEMA Public Assistance experience strongly preferred.",
      "Knowledge of FEMA PA program delivery, documentation, cost eligibility, procurement, and grant compliance.",
      "Strong client-management and technical-writing skills.",
      "PMP, FEMA PA training, or comparable credentials are highly desirable.",
      "Ability to travel or deploy when mission requirements dictate.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-13",
    status: "published",
  },
  {
    id: "planning-section-chief",
    title: "Planning Section Chief",
    department: "Incident Command System & EOC",
    location: "Designated Emergency Operations Center (EOC)",
    type: "Cadre / Temporary ($45.00–$60.00/hr)",
    summary:
      "Senior ICS leader overseeing situational awareness, planning cycles, incident action plans, and resource-status tracking.",
    description:
      "The Planning Section Chief serves as a senior Incident Command System leadership position within the designated Emergency Operations Center. The position oversees situational awareness, planning cycles, incident documentation, resource-status information, and development of plans required to support coordinated incident operations.",
    responsibilities: [
      "Lead Planning Section activities within the EOC or incident management structure.",
      "Facilitate the operational planning cycle and planning meetings.",
      "Coordinate development of Incident Action Plans or EOC operational plans.",
      "Maintain situational awareness and provide leadership with accurate incident information.",
      "Oversee situation, resource, documentation, demobilization, and technical planning functions as assigned.",
      "Develop projections, contingency plans, and future operational considerations.",
      "Ensure incident records and planning products are accurate and timely.",
      "Coordinate closely with Command, Operations, Logistics, Finance/Administration, and external partners.",
      "Support transition, demobilization, and after-action activities.",
      "Maintain ICS/NIMS compliance throughout the assigned mission.",
    ],
    requirements: [
      "Significant emergency management, incident management, or EOC experience required.",
      "Demonstrated experience working within ICS/NIMS structures.",
      "Previous Planning Section leadership experience strongly preferred.",
      "Completion of applicable FEMA ICS coursework, including advanced ICS training, is highly desirable.",
      "Strong briefing, facilitation, analytical, documentation, and decision-support skills.",
      "Ability to work extended operational periods, nights, weekends, holidays, and emergency schedules.",
      "Must be able to remain assigned to the designated EOC for the duration required by the mission.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-14",
    status: "published",
  },
  {
    id: "logistics-section-chief",
    title: "Logistics Section Chief",
    department: "Incident Command System & EOC",
    location: "Designated Emergency Operations Center (EOC)",
    type: "Cadre / Temporary ($45.00–$60.00/hr)",
    summary:
      "Lead EOC logistics support activities, resource fulfillment, vendor coordination, and supply chain tracking.",
    description:
      "The Logistics Section Chief leads logistical support activities within the designated Emergency Operations Center and coordinates the resources, services, facilities, supplies, communications, transportation, and support capabilities necessary to sustain incident operations.",
    responsibilities: [
      "Lead Logistics Section activities within the EOC or incident management structure.",
      "Coordinate requests for personnel, equipment, supplies, facilities, transportation, and services.",
      "Track resource requests from initiation through fulfillment and demobilization.",
      "Coordinate with vendors, government agencies, staging areas, warehouses, and external partners.",
      "Identify resource shortages and develop alternative sourcing strategies.",
      "Support logistics planning for shelters, points of distribution, emergency operations, and field missions as applicable.",
      "Maintain accurate records of resource assignments and logistical activities.",
      "Participate in operational planning meetings and brief leadership on logistical capabilities and constraints.",
      "Coordinate demobilization and return of assigned resources.",
      "Ensure logistics operations follow applicable procedures and ICS/NIMS principles.",
    ],
    requirements: [
      "Significant emergency management, logistics, incident management, or EOC experience required.",
      "Previous leadership within an ICS Logistics Section or comparable emergency logistics environment strongly preferred.",
      "Knowledge of resource management, procurement, transportation, supply operations, and emergency logistics.",
      "Applicable FEMA ICS/NIMS training is highly desirable.",
      "Strong organizational, communication, decision-making, and problem-solving skills.",
      "Ability to work extended operational periods and emergency schedules.",
      "Must be able to remain assigned to the designated EOC for the duration required by the mission.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-15",
    status: "published",
  },
  {
    id: "operations-section-chief",
    title: "Operations Section Chief",
    department: "Incident Command System & EOC",
    location: "Designated Emergency Operations Center (EOC)",
    type: "Cadre / Temporary ($48.00–$65.00/hr)",
    summary:
      "Senior incident management leader directing operational activities to accomplish established incident objectives.",
    description:
      "The Operations Section Chief serves as a senior incident-management leader responsible for coordinating and directing operational activities necessary to accomplish established incident objectives. The role operates from the designated Emergency Operations Center for the duration of the mission and works closely with command and other section leadership.",
    responsibilities: [
      "Lead operational coordination within the EOC or incident management structure.",
      "Translate incident objectives into coordinated operational assignments.",
      "Supervise assigned branches, divisions, groups, units, or operational functions as applicable.",
      "Monitor mission execution and adjust operational priorities based on evolving conditions.",
      "Coordinate mutual aid, field operations, response resources, and interagency activities.",
      "Participate in the operational planning cycle and provide input to incident action planning.",
      "Identify operational risks, resource needs, and emerging mission requirements.",
      "Maintain effective communication with Planning, Logistics, Finance/Administration, Command, and external agencies.",
      "Ensure operational activities comply with safety requirements and incident objectives.",
      "Support demobilization, transition, and after-action activities.",
    ],
    requirements: [
      "Extensive emergency management, public safety, incident management, or EOC operations experience required.",
      "Demonstrated supervisory experience within an ICS/NIMS environment.",
      "Previous Operations Section Chief or comparable senior incident leadership experience strongly preferred.",
      "Advanced FEMA ICS/NIMS coursework is highly desirable.",
      "Strong operational judgment, leadership, coordination, and briefing capabilities.",
      "Ability to make decisions effectively in rapidly changing environments.",
      "Ability to work extended operational periods, nights, weekends, holidays, and emergency schedules.",
      "Must be able to remain assigned to the designated EOC for the duration required by the mission.",
    ],
    lastDate: "December 15, 2026",
    postedDate: "2026-08-16",
    status: "published",
  },
];

const defaultFAQ: FAQItem[] = faqData.map((item, idx) => ({
  id: `faq-${idx + 1}`,
  question: item.question,
  answer: item.answer,
  category: item.category,
  status: "published" as const,
}));

const defaultPrivacy: LegalPage = {
  id: "privacy",
  title: "Privacy Policy",
  content: `### 1. Information Collection and PII Policy
The Inferno Group LLC ("we," "us," or "our") collects contact, business, and application details necessary to deliver consulting, emergency management, and partnering services. We enforce strict PII safeguards and never sell or lease data to third parties.

### 2. Stafford Act Compliance & Emergency Programs
During disaster recovery programs (including FEMA Individual and Public Assistance intake), we comply with the Robert T. Stafford Act and the Privacy Act of 1974. All casework data is encrypted at rest and in transit.

### 3. File Uploads & Resume Security
Resumes and partner documents uploaded to our portals are stored securely and restricted to authorized recruiting and contracting personnel.

### 4. Policy Updates
We may update this Privacy Policy periodically. Continued use of our portals constitutes acceptance of the current terms.`,
};

const defaultConduct: LegalPage = {
  id: "conduct",
  title: "Standards of Conduct",
  content: `### 1. Procurement Integrity and Ethics
The Inferno Group LLC enforces strict transparency, integrity, and compliance across all government and commercial engagements in accordance with the Procurement Integrity Act (41 U.S.C. §§ 2101-2107).

### 2. Conflict of Interest Guidelines
Personnel must avoid actual or perceived organizational or personal conflicts of interest (OCI) and immediately disclose any potential conflict to leadership.

### 3. Anti-Kickback & FAR Compliance
We adhere to the Anti-Kickback Act of 1986 and FAR Part 3.502, strictly prohibiting kickbacks, bribes, or improper gratuities in any procurement or teaming activity.

### 4. Workforce & Equal Opportunity
We uphold equal opportunity and fair treatment across all hiring and deployment pathways in compliance with federal labor laws and E-Verify standards.`,
};

const defaultHero: HeroData = {
  eyebrow: "Government Consulting & Operational Solutions",
  headlineMain: "Ready Before the Crisis. Reliable During It.",
  headlineGradient: "Stronger After It.",
  subheadline:
    "Ideas don't solve problems—execution does. Practical consulting and disaster recovery solutions with measurable impact.",
  videoUrl: "",
  fallbackImage: "/hero-bg.jpg",
  ctaText1: "Explore Services",
  ctaLink1: "/services",
  ctaText2: "Partner With Us",
  ctaLink2: "/partnerships",
};

// ── UTILITY FUNCTIONS ──

// In-memory storage fallback to prevent crashes in iOS Safari Private Browsing mode or under strict privacy constraints
const memoryFallbackStorage: Record<string, string> = {};

// SENSITIVE KEYS: Strict security guarantee - user leads, inquiries, bookings, and PII are NEVER stored in localStorage
const SENSITIVE_STORAGE_KEYS = new Set([
  "inferno_leads",
  "inferno_bookings",
  "inferno_applications",
  "inferno_subcontractors",
]);

// Proactive purge on client initialization to remove any legacy keys
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("inferno_leads");
    localStorage.removeItem("inferno_bookings");
    localStorage.removeItem("inferno_applications");
    localStorage.removeItem("inferno_partner_cards_v1");
  } catch {
    // ignore
  }
}

function isSensitiveKey(key: string): boolean {
  return (
    SENSITIVE_STORAGE_KEYS.has(key) ||
    key.includes("lead") ||
    key.includes("booking") ||
    key.includes("applicant")
  );
}

function safeGetStorage(key: string): string | null {
  if (typeof window === "undefined") return null;

  // Sensitive user data is strictly memory-only
  if (isSensitiveKey(key)) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return memoryFallbackStorage[key] ?? null;
  }

  try {
    return localStorage.getItem(key);
  } catch {
    return memoryFallbackStorage[key] ?? null;
  }
}

function safeSetStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;

  // Never write user leads, submissions, or sensitive user data into localStorage
  if (isSensitiveKey(key)) {
    memoryFallbackStorage[key] = value;
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    memoryFallbackStorage[key] = value;
  }
}

function getStoreItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const stored = safeGetStorage(key);
  if (!stored) {
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(stored);
    let migrated = false;

    // Runtime migration: Ensure hero uses high-definition hero-bg.jpg asset with no static video overlay
    if (
      key.startsWith("inferno_hero") &&
      parsed &&
      typeof parsed === "object"
    ) {
      const p = parsed as Partial<HeroData>;
      if (p.fallbackImage !== "/hero-bg.jpg" || p.videoUrl) {
        migrated = true;
        p.fallbackImage = "/hero-bg.jpg";
        p.videoUrl = "";
      }
    }

    if (key.startsWith("inferno_team") && Array.isArray(parsed)) {
      (parsed as TeamMember[]).forEach((m) => {
        if (
          m.id === "andre-montgomery" &&
          m.image !== "/team_andre.png" &&
          !m.image.startsWith("data:")
        ) {
          m.image = "/team_andre.png";
          migrated = true;
        }
        if (
          m.id === "fady-youssef" &&
          m.image !== "/team_fady.png" &&
          !m.image.startsWith("data:")
        ) {
          m.image = "/team_fady.png";
          migrated = true;
        }
        if (
          m.id === "charnelle-smith" &&
          m.image !== "/team_charnelle.png" &&
          !m.image.startsWith("data:")
        ) {
          m.image = "/team_charnelle.png";
          migrated = true;
        }
        if (
          m.id === "kelly-clerveaux" &&
          m.image !== "/team_kelly.png" &&
          !m.image.startsWith("data:")
        ) {
          m.image = "/team_kelly.png";
          migrated = true;
        }
        if (m.image && m.image.includes("placeholder")) {
          m.image = "/logo.png";
          migrated = true;
        }
      });
    }

    if (key.startsWith("inferno_community") && Array.isArray(parsed)) {
      (parsed as CommunityStory[]).forEach((s) => {
        const needsCorrection =
          !s.image ||
          s.image.includes("placeholder") ||
          (s.id === "story-1" &&
            s.image !== "/impact_texas.png" &&
            !s.image.startsWith("data:")) ||
          (s.id === "story-2" &&
            s.image !== "/impact_debris.png" &&
            !s.image.startsWith("data:"));

        if (needsCorrection) {
          migrated = true;
          if (s.id === "story-1") s.image = "/impact_texas.png";
          else if (s.id === "story-2") s.image = "/impact_debris.png";
          else s.image = "/logo.png";
        }
      });
    }

    if (migrated) {
      safeSetStorage(key, JSON.stringify(parsed));
    }

    return parsed as T;
  } catch {
    return defaultValue;
  }
}

function setStoreItem<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    safeSetStorage(key, JSON.stringify(value));
    // Immediately notify local components listening in the same window/tab
    window.dispatchEvent(new CustomEvent("cms-update", { detail: { key, value } }));
    try {
      window.dispatchEvent(new StorageEvent("storage", { key }));
    } catch {
      window.dispatchEvent(new Event("storage"));
    }

    // Signal auto-sync in progress to admin dashboard
    window.dispatchEvent(
      new CustomEvent("cms-sync-state", {
        detail: { status: "syncing", key },
      })
    );

    // Asynchronously push to Supabase /api/cms without blocking UI
    try {
      fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })
        .then(async (res) => {
          if (res.ok) {
            window.dispatchEvent(
              new CustomEvent("cms-sync-state", {
                detail: { status: "synced", key, timestamp: Date.now() },
              })
            );
          } else {
            console.warn(`[Supabase Sync] Non-200 push response for ${key}:`, res.status);
            window.dispatchEvent(
              new CustomEvent("cms-sync-state", {
                detail: { status: "error", key },
              })
            );
          }
        })
        .catch((err) => {
          console.warn(`[Supabase Sync] Non-blocking push notice for ${key}:`, err);
          window.dispatchEvent(
            new CustomEvent("cms-sync-state", {
              detail: { status: "error", key },
            })
          );
        });
    } catch {
      // offline/SSG safe
    }
  }
}

// ── EXPORTED DATA STORE INTERFACES ──

export const dataStore = {
  // About Content
  getAbout: (): AboutData =>
    getStoreItem<AboutData>("inferno_about_v4", defaultAbout),
  saveAbout: (about: AboutData): void =>
    setStoreItem<AboutData>("inferno_about_v4", about),

  // Team members
  getTeam: (): TeamMember[] =>
    getStoreItem<TeamMember[]>("inferno_team_v7", defaultTeam),
  saveTeam: (team: TeamMember[]): void =>
    setStoreItem<TeamMember[]>("inferno_team_v7", team),

  // Services
  getServices: (): ServiceItem[] =>
    getStoreItem<ServiceItem[]>("inferno_services_v5", defaultServices),
  saveServices: (services: ServiceItem[]): void =>
    setStoreItem<ServiceItem[]>("inferno_services_v5", services),

  // Stats
  getStats: (): StatItem[] =>
    getStoreItem<StatItem[]>("inferno_stats_v3", defaultStats),
  saveStats: (stats: StatItem[]): void =>
    setStoreItem<StatItem[]>("inferno_stats_v3", stats),

  // Testimonials
  getTestimonials: (): TestimonialItem[] =>
    getStoreItem<TestimonialItem[]>(
      "inferno_testimonials_v5",
      defaultTestimonials,
    ),
  saveTestimonials: (testimonials: TestimonialItem[]): void =>
    setStoreItem<TestimonialItem[]>("inferno_testimonials_v5", testimonials),

  // Community stories
  getCommunityStories: (): CommunityStory[] =>
    getStoreItem<CommunityStory[]>(
      "inferno_community_v6",
      defaultCommunityStories,
    ),
  saveCommunityStories: (stories: CommunityStory[]): void =>
    setStoreItem<CommunityStory[]>("inferno_community_v6", stories),

  // News
  getArticles: (): Article[] =>
    getStoreItem<Article[]>("inferno_articles_v5", defaultArticles),
  saveArticles: (articles: Article[]): void =>
    setStoreItem<Article[]>("inferno_articles_v5", articles),

  // AI & Innovation
  getAIInnovation: (): FeatureCard[] =>
    getStoreItem<FeatureCard[]>(
      "inferno_ai_innovation_v2",
      defaultAIInnovation,
    ),
  saveAIInnovation: (features: FeatureCard[]): void =>
    setStoreItem<FeatureCard[]>("inferno_ai_innovation_v2", features),

  // Careers Jobs
  getJobs: (): Job[] => {
    const list = getStoreItem<Job[]>("inferno_jobs_v5", defaultJobs);
    return list.map((j) => ({
      ...j,
      lastDate: j.lastDate || "December 15, 2026",
    }));
  },
  saveJobs: (jobs: Job[]): void => setStoreItem<Job[]>("inferno_jobs_v5", jobs),

  // FAQs
  getFAQs: (): FAQItem[] =>
    getStoreItem<FAQItem[]>("inferno_faqs_v3", defaultFAQ),
  saveFAQs: (faqs: FAQItem[]): void =>
    setStoreItem<FAQItem[]>("inferno_faqs_v3", faqs),

  // Contracts
  getContracts: (): Contract[] =>
    getStoreItem<Contract[]>("inferno_contracts_v1", contractsData),
  saveContracts: (contracts: Contract[]): void =>
    setStoreItem<Contract[]>("inferno_contracts_v1", contracts),

  // Capabilities
  getCapabilities: (): Capability[] =>
    getStoreItem<Capability[]>("inferno_capabilities_v1", capabilitiesData),
  saveCapabilities: (capabilities: Capability[]): void =>
    setStoreItem<Capability[]>("inferno_capabilities_v1", capabilities),

  // Resources
  getResources: (): Resource[] =>
    getStoreItem<Resource[]>("inferno_resources_v1", resourcesData),
  saveResources: (resources: Resource[]): void =>
    setStoreItem<Resource[]>("inferno_resources_v1", resources),

  // Chatbot Q&A
  getChatbotQA: (): KnowledgeBaseItem[] =>
    getStoreItem<KnowledgeBaseItem[]>("inferno_chatbot_qa_v1", knowledgeBase),
  saveChatbotQA: (qa: KnowledgeBaseItem[]): void =>
    setStoreItem<KnowledgeBaseItem[]>("inferno_chatbot_qa_v1", qa),

  // Leads & Inbound Submissions (in-memory only, strictly segregated from CMS settings)
  getLeads: (): AdminLead[] => {
    try {
      const stored = safeGetStorage("inferno_leads");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  saveLeads: (leads: AdminLead[]): void => {
    safeSetStorage("inferno_leads", JSON.stringify(leads));
  },

  // Legal Pages
  getLegalPrivacy: (): LegalPage =>
    getStoreItem<LegalPage>("inferno_legal_privacy_v2", defaultPrivacy),
  saveLegalPrivacy: (privacy: LegalPage): void =>
    setStoreItem<LegalPage>("inferno_legal_privacy_v2", privacy),

  getLegalConduct: (): LegalPage =>
    getStoreItem<LegalPage>("inferno_legal_conduct_v2", defaultConduct),
  saveLegalConduct: (conduct: LegalPage): void =>
    setStoreItem<LegalPage>("inferno_legal_conduct_v2", conduct),

  // Hero Content
  getHero: (): HeroData =>
    getStoreItem<HeroData>("inferno_hero_v5", defaultHero),
  saveHero: (hero: HeroData): void =>
    setStoreItem<HeroData>("inferno_hero_v5", hero),

  // Site & Brand Settings
  getSiteSettings: (): SiteSettings =>
    getStoreItem<SiteSettings>("inferno_site_settings_v1", defaultSiteSettings),
  saveSiteSettings: (settings: SiteSettings): void =>
    setStoreItem<SiteSettings>("inferno_site_settings_v1", settings),

  // Partnerships & Teaming Cards
  getPartnerCards: (): PartnerCardItem[] =>
    getStoreItem<PartnerCardItem[]>("inferno_partner_cards_v1", defaultPartnerCards),
  savePartnerCards: (cards: PartnerCardItem[]): void =>
    setStoreItem<PartnerCardItem[]>("inferno_partner_cards_v1", cards),

  // Diagnostic Quiz Questions
  getQuizQuestions: (): QuizQuestionItem[] =>
    getStoreItem<QuizQuestionItem[]>("inferno_quiz_questions_v1", defaultQuizQuestions),
  saveQuizQuestions: (questions: QuizQuestionItem[]): void =>
    setStoreItem<QuizQuestionItem[]>("inferno_quiz_questions_v1", questions),

  // Reset all CMS collections to factory defaults
  resetAllToDefaults: (): void => {
    if (typeof window === "undefined") return;
    setStoreItem("inferno_about_v4", defaultAbout);
    setStoreItem("inferno_team_v7", defaultTeam);
    setStoreItem("inferno_services_v5", defaultServices);
    setStoreItem("inferno_stats_v3", defaultStats);
    setStoreItem("inferno_testimonials_v5", defaultTestimonials);
    setStoreItem("inferno_community_v6", defaultCommunityStories);
    setStoreItem("inferno_articles_v5", defaultArticles);
    setStoreItem("inferno_ai_innovation_v2", defaultAIInnovation);
    setStoreItem("inferno_jobs_v5", defaultJobs);
    setStoreItem("inferno_faqs_v3", defaultFAQ);
    setStoreItem("inferno_contracts_v1", contractsData);
    setStoreItem("inferno_capabilities_v1", capabilitiesData);
    setStoreItem("inferno_resources_v1", resourcesData);
    setStoreItem("inferno_chatbot_qa_v1", knowledgeBase);
    setStoreItem("inferno_legal_privacy_v2", defaultPrivacy);
    setStoreItem("inferno_legal_conduct_v2", defaultConduct);
    setStoreItem("inferno_hero_v5", defaultHero);
    setStoreItem("inferno_site_settings_v1", defaultSiteSettings);
    setStoreItem("inferno_partner_cards_v1", defaultPartnerCards);
    setStoreItem("inferno_quiz_questions_v1", defaultQuizQuestions);
  },

  // Export full CMS state snapshot
  exportFullSnapshot: () => ({
    exportedAt: new Date().toISOString(),
    siteSettings: dataStore.getSiteSettings(),
    hero: dataStore.getHero(),
    stats: dataStore.getStats(),
    aiInnovation: dataStore.getAIInnovation(),
    about: dataStore.getAbout(),
    team: dataStore.getTeam(),
    services: dataStore.getServices(),
    capabilities: dataStore.getCapabilities(),
    contracts: dataStore.getContracts(),
    partnerCards: dataStore.getPartnerCards(),
    articles: dataStore.getArticles(),
    jobs: dataStore.getJobs(),
    communityStories: dataStore.getCommunityStories(),
    testimonials: dataStore.getTestimonials(),
    faqs: dataStore.getFAQs(),
    resources: dataStore.getResources(),
    quizQuestions: dataStore.getQuizQuestions(),
    chatbotQA: dataStore.getChatbotQA(),
    legalPrivacy: dataStore.getLegalPrivacy(),
    legalConduct: dataStore.getLegalConduct(),
    leads: dataStore.getLeads(),
  }),

  // Import full CMS state snapshot
  importFullSnapshot: (snapshot: Record<string, unknown>): void => {
    if (!snapshot || typeof snapshot !== "object") return;
    if (snapshot.siteSettings) dataStore.saveSiteSettings(snapshot.siteSettings as SiteSettings);
    if (snapshot.hero) dataStore.saveHero(snapshot.hero as HeroData);
    if (Array.isArray(snapshot.stats)) dataStore.saveStats(snapshot.stats as StatItem[]);
    if (Array.isArray(snapshot.aiInnovation)) dataStore.saveAIInnovation(snapshot.aiInnovation as FeatureCard[]);
    if (snapshot.about) dataStore.saveAbout(snapshot.about as AboutData);
    if (Array.isArray(snapshot.team)) dataStore.saveTeam(snapshot.team as TeamMember[]);
    if (Array.isArray(snapshot.services)) dataStore.saveServices(snapshot.services as ServiceItem[]);
    if (Array.isArray(snapshot.capabilities)) dataStore.saveCapabilities(snapshot.capabilities as Capability[]);
    if (Array.isArray(snapshot.contracts)) dataStore.saveContracts(snapshot.contracts as Contract[]);
    if (Array.isArray(snapshot.partnerCards)) dataStore.savePartnerCards(snapshot.partnerCards as PartnerCardItem[]);
    if (Array.isArray(snapshot.articles)) dataStore.saveArticles(snapshot.articles as Article[]);
    if (Array.isArray(snapshot.jobs)) dataStore.saveJobs(snapshot.jobs as Job[]);
    if (Array.isArray(snapshot.communityStories)) dataStore.saveCommunityStories(snapshot.communityStories as CommunityStory[]);
    if (Array.isArray(snapshot.testimonials)) dataStore.saveTestimonials(snapshot.testimonials as TestimonialItem[]);
    if (Array.isArray(snapshot.faqs)) dataStore.saveFAQs(snapshot.faqs as FAQItem[]);
    if (Array.isArray(snapshot.resources)) dataStore.saveResources(snapshot.resources as Resource[]);
    if (Array.isArray(snapshot.quizQuestions)) dataStore.saveQuizQuestions(snapshot.quizQuestions as QuizQuestionItem[]);
    if (Array.isArray(snapshot.chatbotQA)) dataStore.saveChatbotQA(snapshot.chatbotQA as KnowledgeBaseItem[]);
    if (snapshot.legalPrivacy) dataStore.saveLegalPrivacy(snapshot.legalPrivacy as LegalPage);
    if (snapshot.legalConduct) dataStore.saveLegalConduct(snapshot.legalConduct as LegalPage);
    if (Array.isArray(snapshot.leads)) dataStore.saveLeads(snapshot.leads as AdminLead[]);
  },

  // ── SUPABASE DATABASE SYNCHRONIZATION ──

  // Pull all CMS content and leads from Supabase PostgreSQL database
  syncFromSupabase: async (): Promise<{ success: boolean; count: number }> => {
    if (typeof window === "undefined") return { success: false, count: 0 };
    try {
      const res = await fetch("/api/cms");
      if (!res.ok) return { success: false, count: 0 };
      const json = await res.json();
      if (json.success && json.data) {
        const remoteData = json.data as Record<string, any>;
        const keys = Object.keys(remoteData);

        // If remote Supabase database is completely empty, initialize it with current snapshot
        if (keys.length === 0) {
          await dataStore.pushAllToSupabase();
          return { success: true, count: 0 };
        }

        // Hydrate localStorage with remote values (non-sensitive CMS keys only)
        for (const [k, v] of Object.entries(remoteData)) {
          if (isSensitiveKey(k)) continue;
          if (v !== undefined && v !== null) {
            safeSetStorage(k, JSON.stringify(v));
          }
        }

        // Notify all open tabs and active React hooks
        window.dispatchEvent(new CustomEvent("cms-update", { detail: { all: true } }));
        try {
          window.dispatchEvent(new StorageEvent("storage", { key: null }));
        } catch {
          window.dispatchEvent(new Event("storage"));
        }
        return { success: true, count: keys.length };
      }
      return { success: false, count: 0 };
    } catch (err) {
      console.warn("[Supabase Sync] Sync from database error:", err);
      return { success: false, count: 0 };
    }
  },

  // Push complete CMS state to Supabase PostgreSQL in a single batch
  pushAllToSupabase: async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    window.dispatchEvent(
      new CustomEvent("cms-sync-state", { detail: { status: "syncing" } })
    );
    try {
      const batch = [
        { key: "inferno_site_settings_v1", value: dataStore.getSiteSettings() },
        { key: "inferno_partner_cards_v1", value: dataStore.getPartnerCards() },
        { key: "inferno_quiz_questions_v1", value: dataStore.getQuizQuestions() },
        { key: "inferno_about_v4", value: dataStore.getAbout() },
        { key: "inferno_team_v7", value: dataStore.getTeam() },
        { key: "inferno_services_v5", value: dataStore.getServices() },
        { key: "inferno_stats_v3", value: dataStore.getStats() },
        { key: "inferno_testimonials_v5", value: dataStore.getTestimonials() },
        { key: "inferno_community_v6", value: dataStore.getCommunityStories() },
        { key: "inferno_articles_v5", value: dataStore.getArticles() },
        { key: "inferno_ai_innovation_v2", value: dataStore.getAIInnovation() },
        { key: "inferno_jobs_v5", value: dataStore.getJobs() },
        { key: "inferno_faqs_v3", value: dataStore.getFAQs() },
        { key: "inferno_contracts_v1", value: dataStore.getContracts() },
        { key: "inferno_capabilities_v1", value: dataStore.getCapabilities() },
        { key: "inferno_resources_v1", value: dataStore.getResources() },
        { key: "inferno_chatbot_qa_v1", value: dataStore.getChatbotQA() },
        { key: "inferno_legal_privacy_v2", value: dataStore.getLegalPrivacy() },
        { key: "inferno_legal_conduct_v2", value: dataStore.getLegalConduct() },
        { key: "inferno_hero_v5", value: dataStore.getHero() },
      ];

      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch }),
      });
      if (res.ok) {
        window.dispatchEvent(
          new CustomEvent("cms-sync-state", {
            detail: { status: "synced", timestamp: Date.now() },
          })
        );
        return true;
      } else {
        window.dispatchEvent(
          new CustomEvent("cms-sync-state", { detail: { status: "error" } })
        );
        return false;
      }
    } catch (err) {
      console.warn("[Supabase Sync] Batch push error:", err);
      window.dispatchEvent(
        new CustomEvent("cms-sync-state", { detail: { status: "error" } })
      );
      return false;
    }
  },

  // Submit a lead transmission: immediate local storage + background sync to Supabase
  submitLead: async (lead: Partial<AdminLead>): Promise<AdminLead> => {
    const newLead: AdminLead = {
      id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: lead.type || "contact",
      name: lead.name || lead.contactName || "Portal Inquirer",
      contactName: lead.contactName || lead.name,
      email: lead.email || lead.contactEmail || "",
      contactEmail: lead.contactEmail || lead.email,
      phone: lead.phone || "",
      company: lead.company || lead.org || lead.partnerCompany || "",
      partnerCompany: lead.partnerCompany || lead.company,
      org: lead.org || lead.company,
      service: lead.service || "",
      message: lead.message || lead.notes || "",
      notes: lead.notes || lead.message || "",
      jobId: lead.jobId,
      jobTitle: lead.jobTitle,
      cover: lead.cover,
      resumeName: lead.resumeName,
      resumeData: lead.resumeData,
      solicitation: lead.solicitation,
      contractTitle: lead.contractTitle,
      agency: lead.agency,
      teamingRole: lead.teamingRole,
      partnerType: lead.partnerType,
      certStatus: lead.certStatus,
      bondingCapacity: lead.bondingCapacity,
      consultType: lead.consultType,
      timezone: lead.timezone,
      date: lead.date,
      time: lead.time,
      answers: lead.answers,
      recommendations: lead.recommendations,
      resourceId: lead.resourceId,
      resourceTitle: lead.resourceTitle,
      status: lead.status || "new",
      adminNotes: lead.adminNotes || "",
      createdAt: lead.createdAt || new Date().toISOString(),
    };

    // Persist to Supabase database via API
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
    } catch (err) {
      console.warn("[Supabase Sync] Failed to post lead to database:", err);
    }

    return newLead;
  },
};
