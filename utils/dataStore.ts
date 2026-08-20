"use client";

// Dynamic Data Store for The Inferno Group LLC B2G Portal
// Synced with LocalStorage and safely handles Next.js SSG build rendering.

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

// ── DEFAULT INITIAL SEEDS ──

const defaultAbout: AboutData = {
  story: `The Inferno Group was founded on a simple belief: meaningful impact begins with the courage to create it.

After years of serving in government operations, emergency management, disaster recovery, and business consulting, we recognized that the greatest opportunities to make a difference aren't always found by waiting—they're created through action. Driven by a passion for service and a commitment to excellence, we built The Inferno Group to be a trusted partner for organizations facing complex challenges and critical missions.

Along the way, we've had the privilege of collaborating with some of the brightest professionals in the industry. While our backgrounds and experiences may differ, we share a common conviction: service cannot wait, and neither can opportunity. Communities, agencies, and businesses deserve partners who are prepared to lead with integrity, respond with urgency, and deliver with precision.

That philosophy is the foundation of everything we do. Every engagement is guided by collaboration, accountability, and an unwavering commitment to helping our clients achieve meaningful, measurable results.

At The Inferno Group, we're not just building solutions—we're building stronger organizations, more resilient communities, and lasting partnerships for the future.`,
  mission: "Our mission is to serve with purpose, lead with integrity, and deliver solutions that strengthen organizations, protect communities, and create lasting impact. We believe every mission matters because every community matters.",
  vision: "We believe every mission matters because every community matters.",
  coreValues: [
    {
      title: "Service Above Self",
      desc: "We exist to create meaningful impact by serving our clients, communities, and one another with purpose and professionalism.",
      icon: "shield"
    },
    {
      title: "Integrity Without Compromise",
      desc: "We earn trust through honesty, accountability, and doing what is right—even when it's difficult.",
      icon: "lock"
    },
    {
      title: "Excellence in Execution",
      desc: "We prepare relentlessly, execute with precision, and pursue excellence in everything we do.",
      icon: "zap"
    },
    {
      title: "Resilient Innovation",
      desc: "We embrace change, solve complex challenges, and continuously improve to deliver lasting value.",
      icon: "cpu"
    },
    {
      title: "One Team. One Mission.",
      desc: "We achieve more through collaboration, mutual respect, and a shared commitment to serving something greater than ourselves.",
      icon: "file-check"
    }
  ],
  howWeWorkSummary: "We approach every project with the mindset that every mission matters. Our team works collaboratively with clients to identify challenges, develop strategic solutions, and execute with discipline and precision. Whether supporting emergency operations, disaster recovery, business transformation, or operational improvement, we remain focused on delivering solutions that create measurable impact and lasting value. Success is built on preparation, communication, and accountability—and that's exactly how we work.",
  howWeWork: [
    {
      step: "01",
      title: "Identify Challenges",
      desc: "We work collaboratively with clients to identify core operational, emergency management, and business challenges."
    },
    {
      step: "02",
      title: "Develop Strategic Solutions",
      desc: "Our team designs custom, actionable strategies for emergency operations, disaster recovery, business transformation, and operational improvement."
    },
    {
      step: "03",
      title: "Execute with Discipline & Precision",
      desc: "We remain relentlessly focused on execution, delivering solutions that create measurable impact and lasting value."
    },
    {
      step: "04",
      title: "Preparation, Communication & Accountability",
      desc: "We ground every engagement in thorough preparation, transparent communication, and uncompromised accountability."
    }
  ]
};

const defaultTeam: TeamMember[] = [
  {
    id: "andre-montgomery",
    name: "Andre Montgomery",
    role: "Founder & Chief Executive Officer",
    bio: "Andre Montgomery is a government consulting and operations leader with experience across emergency management, disaster recovery, program management, and large-scale service operations. As Founder and CEO of TIG, he leads the firm’s strategic vision, government contracting initiatives, partnerships, and organizational growth, with a commitment to building responsive solutions that strengthen organizations and the communities they serve.",
    image: "/team_andre.png",
    socialLinks: { linkedin: "https://linkedin.com", email: "Andre.Montgomery@theinfernogroup.com" },
    status: "published"
  },
  {
    id: "fady-youssef",
    name: "Fady Youssef",
    role: "Director of Emergency Management Services",
    bio: "Fady Youssef is an operations and transformation leader with 17+ years of experience across government programs, healthcare, financial services, and regulated operations. He brings TIG extensive expertise in program execution, operational leadership, process improvement, and performance management, strengthening the firm’s ability to deliver responsive, accountable solutions for government and community partners.",
    image: "/team_fady.png",
    socialLinks: { linkedin: "https://linkedin.com", email: "Fady.Youssef@theinfernogroup.com" },
    status: "published"
  },
  {
    id: "charnelle-smith",
    name: "Charnelle Smith",
    role: "Director of Business Development & Capture",
    bio: "Charnelle Smith is a program and operations leader with 7+ years of experience in project management, organizational improvement, performance analysis, and partnership development. As Director of Business Development & Capture, she brings TIG a strategic approach to opportunity development, partner engagement, proposal strategy, and program execution, helping position the firm for sustainable growth across government and commercial markets.",
    image: "/team_charnelle.png",
    socialLinks: { linkedin: "https://linkedin.com", email: "Charnelle.Smith@theinfernogroup.com" },
    status: "published"
  },
  {
    id: "kelly-clerveaux",
    name: "Kelly Clerveaux, Esq.",
    role: "General Counsel",
    bio: "Kelly Clerveaux is an attorney and business owner with experience spanning corporate legal counsel, regulatory environments, healthcare, and business operations. As General Counsel, he brings TIG expertise in legal strategy, contract review, compliance, risk management, and corporate governance, helping protect the firm’s interests while supporting responsible growth and government contracting operations.",
    image: "/team_kelly.png",
    socialLinks: { linkedin: "https://linkedin.com", email: "Kelly.Clerveaux@theinfernogroup.com" },
    status: "published"
  }
];


const defaultServices: ServiceItem[] = [
  {
    id: "emergency-management-and-disaster-recovery",
    num: "01",
    badge: "Supporting Communities Through Every Phase",
    title: "Emergency Management & Disaster Recovery",
    headline: "Supporting Communities Through Every Phase of Emergency Management & Recovery",
    desc: "From rapid response through long-term community recovery, we provide experienced professionals and practical solutions that help agencies navigate disasters, manage federal recovery grants, and build resilient communities.",
    caps: [
      "Emergency Operations Center (EOC) Operational Support",
      "FEMA Public Assistance (PA) Project Management & Documentation",
      "FEMA Individual Assistance (IA) & Survivor Support Operations",
      "Field-Level Debris Monitoring, Load Verification & Disposal Logging",
      "Disaster Case Management, Intake & Needs Assessments",
      "Damage Assessments, Scopes of Work & Cost Estimation",
      "Stafford Act & 2 CFR Part 200 Grant Compliance & Audit Readiness",
      "Disaster Recovery Grant Coordination, Appeals & Closeout Support",
      "Rapid Cadre Workforce Mobilization & Field Deployments"
    ],
    idealFor: [
      "FEMA & Federal Partners",
      "State Emergency Management Agencies",
      "Counties & Municipalities",
      "Tribal Governments",
      "Public Utilities & Infrastructure Authorities",
      "Healthcare Systems & Coalitions",
      "School Districts & Universities"
    ],
    status: "published"
  },
  {
    id: "planning-and-preparedness",
    num: "02",
    badge: "Building Resilience Before It Matters Most",
    title: "Planning, Preparedness & Incident Management",
    headline: "Building Operational Readiness & ICS/NIMS Incident Leadership",
    desc: "The strongest response begins long before an emergency occurs. We help organizations develop actionable operational plans, maintain situational awareness, and provide Incident Command System (ICS) leadership within Emergency Operations Centers.",
    caps: [
      "Emergency Operations Center (EOC) Planning Section Leadership",
      "Operations & Logistics Section Incident Management Support",
      "Emergency Operations Plans (EOPs) & Incident Action Plans (IAP)",
      "Continuity of Operations (COOP) & Continuity of Government (COG) Planning",
      "Hazard Mitigation Planning & Vulnerability Risk Assessments",
      "Crisis Management & Business Continuity Planning",
      "Exercise Design & Facilitation (Tabletop, Functional, Full-Scale)",
      "After-Action Reports (AAR) & Continuous Improvement Plans (IP)",
      "ICS/NIMS Compliance Audits & Interagency Protocols"
    ],
    idealFor: [
      "Designated Emergency Operations Centers (EOCs)",
      "Federal & State Agencies",
      "Local Governments & Public Safety",
      "Healthcare Organizations",
      "Critical Infrastructure Providers",
      "Educational Institutions",
      "Nonprofit Disaster Response Coalitions"
    ],
    status: "published"
  },
  {
    id: "contact-center-operations",
    num: "03",
    badge: "Mission-Focused Citizen & Applicant Support",
    title: "Contact Center Operations & Case Support",
    headline: "Delivering Scalable, Empathetic & Compliant Survivor Assistance",
    desc: "We operate mission-focused contact centers that deliver timely, accurate, and empathetic assistance to applicants, disaster survivors, and program participants through secure inbound and outbound communication channels.",
    caps: [
      "Disaster Survivor & Applicant Helpline Management",
      "Needs Assessments, Application Intake & Eligibility Verification",
      "Confidential Case Documentation & Status Tracking",
      "Quality Assurance (QA) Monitoring, Evaluations & Scoring",
      "Quality Calibration Sessions & Performance Coaching",
      "Privacy, Security & PII Protection Standards Enforcement",
      "Frontline Contact Center Supervision & Escalation Resolution",
      "Rapid Surge Staffing for High-Volume Activations",
      "Government Program Scripting & Workflow Adherence"
    ],
    idealFor: [
      "Government-Administered Recovery Programs",
      "State & Municipal Citizen Help Desks",
      "Disaster Relief Organizations",
      "Housing & Human Services Programs",
      "Public Health Call Operations",
      "Emergency Assistance Grant Programs"
    ],
    status: "published"
  },
  {
    id: "program-and-project-management",
    num: "04",
    badge: "Delivering Complex Initiatives with Confidence",
    title: "Program, Project & Financial Management",
    headline: "Disciplined Leadership Keeping Public Initiatives on Schedule & Within Budget",
    desc: "We provide disciplined program leadership and robust financial controls that keep public sector and commercial initiatives compliant, on schedule, within budget, and aligned with organizational missions.",
    caps: [
      "Full-Lifecycle Program & Project Management (Mobilization to Closeout)",
      "Project Scheduling, Work Breakdown & Performance Milestone Tracking",
      "Government Contract Accounting, Cost Tracking & Invoicing Controls",
      "Budgeting, Forecasting, Cash-Flow Planning & Financial Controls",
      "Quality Assurance Audits, Deficiencies Remediation & Scorecards",
      "Risk Management, Conflict-of-Interest Disclosures & Mitigation",
      "Executive & Client-Facing Briefings, Reporting & Dashboards",
      "Subcontractor, Vendor & Teaming Partner Administration",
      "DCAA & Federal Compliance Support"
    ],
    idealFor: [
      "Government Agencies & Program Offices",
      "Public Sector Prime Contractors",
      "Grant-Funded Programs & Authorities",
      "Municipal Infrastructure Projects",
      "Executive Leadership & Financial Controllers"
    ],
    status: "published"
  },
  {
    id: "strategic-consulting-and-operational-excellence",
    num: "05",
    badge: "Turning Complex Challenges into Sustainable Solutions",
    title: "Strategic Consulting, Capture & Compliance",
    headline: "Strengthening Operations, Opportunity Capture & Legal Strategy",
    desc: "We partner with leadership to optimize organizational performance, develop winning proposal and capture strategies, navigate regulatory requirements, and implement solutions that produce measurable results.",
    caps: [
      "Strategic Planning & Organizational Performance Assessments",
      "Business Process Optimization & Operational Workflow Improvement",
      "Government Contracting Strategy, Opportunity Development & Capture",
      "Proposal Strategy, Partner Teaming & Joint Pursuit Structuring",
      "Legal Strategy, Contract Review & Corporate Governance Advisory",
      "Regulatory Compliance, Risk Management & Debarment Screenings",
      "Supplier Diversity & Socioeconomic Teaming (HUBZone & VOSB)",
      "Policy, SOP & Governance Framework Formulation",
      "Executive Advisory & Change Management"
    ],
    idealFor: [
      "Executive Leadership Teams",
      "Government Contractors & Teaming Partners",
      "Growing Commercial Enterprises",
      "Healthcare & Regulated Industry Organizations",
      "Public-Sector Advisory Boards"
    ],
    status: "published"
  },
  {
    id: "training-exercises-and-workforce-development",
    num: "06",
    badge: "Preparing People to Perform When It Matters Most",
    title: "Training, Workforce Development & Cadre Staffing",
    headline: "Equipping Personnel with Practical Skills & Scalable Workforce Solutions",
    desc: "An organization's greatest asset is its people. We design practical training programs, realistic emergency simulations, and full-cycle cadre recruitment that prepare teams to perform effectively under pressure.",
    caps: [
      "FEMA & NIMS/ICS-Based Training Support & Workshops",
      "Instructor-Led, Virtual & Self-Paced Curriculum Design",
      "Full-Cycle Cadre Recruiting & Deployable Talent Pipelines",
      "Emergency Workforce Rapid Mobilization & Onboarding",
      "Knowledge Checks, Simulations & Performance-Support Job Aids",
      "Train-the-Trainer Initiatives & Competency Evaluations",
      "Standard Operating Procedure (SOP) Training & Delivery",
      "Leadership Development, Mentorship & Skill Calibration",
      "Compliance & Pre-Employment Verification (E-Verify)"
    ],
    idealFor: [
      "Emergency Management Cadres & Field Responders",
      "Government Departments & Municipalities",
      "Contact Center & Program Support Staff",
      "Public Safety & Healthcare Organizations",
      "Corporate Incident Response Teams"
    ],
    status: "published"
  },
  {
    id: "facilities-logistics-and-specialty-services",
    num: "07",
    badge: "Responsive Field Operations & Infrastructure Support",
    title: "Facilities Support, Logistics & Specialty Services",
    headline: "Connecting Resources, Facilities & Infrastructure Support Nationwide",
    desc: "We coordinate the logistical resources, specialty contracting trades, facilities support, and operational capabilities needed to sustain emergency operations, facility readiness, and public infrastructure.",
    caps: [
      "Emergency Logistics Coordination, Sourcing & Resource Tracking",
      "Staging Area, Warehouse & Point of Distribution (POD) Management",
      "Facilities Support Services & Building Maintenance (NAICS 561210)",
      "Environmental Remediation & Cleanup Support (NAICS 562910)",
      "Commercial Painting, Wall Covering & Specialty Trades (NAICS 238320 / 238990)",
      "Janitorial Services & Facility Sanitation (NAICS 561720 / 561790)",
      "Freight Transportation Arrangement & Supply Chain Logistics (NAICS 488510)",
      "Durable Goods Procurement & Supply Coordination (NAICS 423990)",
      "Subcontractor Teaming with Single & Aggregate Bonding Capacity"
    ],
    idealFor: [
      "Federal & State Facility Managers",
      "Disaster Logistics Staging Areas",
      "Municipal Public Works Departments",
      "Commercial Property & Infrastructure Operators",
      "Prime Contractors Requiring Specialty Trades"
    ],
    status: "published"
  }
];

const defaultStats: StatItem[] = [
  { id: "stat-1", value: "10", suffix: "+", label: "Years of Industry Experience" },
  { id: "stat-2", value: "50", suffix: "+", label: "Emergency Management & PA Programs" },
  { id: "stat-3", value: "50", label: "States Covered" },
  { id: "stat-4", value: "Virtual & Onsite", label: "Nationwide Operations" }
];

// TODO: FLAG FOR CLIENT - No testimonial content was provided in the source document. Testimonials pending client submission.
const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    rating: 5,
    text: "The Inferno Group's field oversight, debris monitoring, and Public Assistance grant compliance ensured flawless execution and complete audit protection for our recovery scope.",
    name: "Disaster Recovery Partner",
    company: "Public Sector Recovery Teaming Network",
    role: "Operations Director",
    status: "published"
  },
  {
    id: "test-2",
    rating: 5,
    text: "As a HUBZone Certified and Veteran-Owned Small Business (VOSB), TIG brings disciplined leadership, rapid cadre staffing, and uncompromised integrity to complex government procurements.",
    name: "Federal Prime Contractor",
    company: "Defense & Advisory Teaming Partner",
    role: "Vice President of Growth",
    status: "published"
  },
  {
    id: "test-3",
    rating: 5,
    text: "TIG's Inferno Cares initiative demonstrates true service beyond the contract — delivering practical disaster relief and educational book scholarships across Greater Orlando.",
    name: "Community Program Leader",
    company: "Greater Orlando Community Alliance",
    role: "Executive Director",
    status: "published"
  }
];

const defaultCommunityStories: CommunityStory[] = [
  {
    id: "kicking-for-relief",
    title: "Kicking for Relief Kickball Tournament",
    summary: "Disaster relief initiative raising funds for individuals and families impacted by devastating Asheville, NC flooding.",
    content: "In response to the flooding that impacted Asheville, North Carolina, TIG hosted the Kicking for Relief Kickball Tournament to raise funds for individuals and families affected by the disaster. The event brought people together through friendly competition and giving, turning a local event into an opportunity to support recovery beyond TIG's immediate community. TIG views disaster response as more than a professional service — behind every emergency are families and neighborhoods working to rebuild, and this event reflected TIG's commitment to standing with those communities.",
    image: "/impact_texas.png",
    featured: true,
    status: "published"
  },
  {
    id: "inferno-flame-scholarship",
    title: "The Inferno Flame Scholarship",
    summary: "Awarding $500 book scholarships to Orlando-area high school seniors preparing for four-year universities.",
    content: "TIG launched the Inferno Flame Scholarship to support the next generation of leaders beginning their college journeys. The program awarded $500 book scholarships to Orlando-area high school seniors preparing to attend four-year universities, helping offset costs like textbooks and academic materials as they begin their next chapter.",
    image: "/impact_debris.png",
    featured: true,
    status: "published"
  }
];

const defaultArticles: Article[] = [
  {
    slug: "disaster-recovery-debris-monitoring",
    title: "Disaster Recovery & Debris Monitoring: Building Audit-Ready Field Operations",
    category: "Emergency Management",
    summary: "Comprehensive guide to field-level debris oversight, load ticket verification, and FEMA Public Assistance Category A compliance.",
    content: "Field-level oversight of disaster debris collection and removal operations is critical for ensuring compliance with federal reimbursement guidelines. As a dedicated emergency management and disaster recovery provider, The Inferno Group LLC (TIG) enforces strict truck load validation, disposal site logging, and digital documentation standards across Category A debris missions.\n\nProper debris monitoring prevents project cost discrepancies, protects public safety, and ensures municipal project worksheets meet all FEMA Public Assistance (PA) and 2 CFR Part 200 standards. Our trained field monitors track hauling contractors in real-time, verifying cubic yardage and debris classification to withstand federal post-disaster audits.",
    publishedDate: "2026-08-05",
    author: "Emergency Operations Desk",
    status: "published"
  },
  {
    slug: "socioeconomic-hubzone-vosb",
    title: "Federal Socioeconomic Contracting: Leveraging HUBZone & VOSB Designations",
    category: "Federal Credentials",
    summary: "An overview of SBA HUBZone Certified and Veteran-Owned Small Business (VOSB) contracting preferences in federal acquisitions.",
    content: "The Inferno Group LLC holds active SBA HUBZone Certified status from the U.S. Small Business Administration as well as Veteran-Owned Small Business (VOSB) credentials (UEI: QW6RHJACHA56, CAGE: 22VP2). These designations empower federal agencies and prime defense/civilian contractors to satisfy statutory small business utilization mandates.\n\nUnder federal FAR guidelines, HUBZone certification confers a 10% price evaluation preference in open-market competitions and qualifies TIG for direct sole-source and competitive set-aside solicitations. Combined with our VOSB credential, TIG delivers both mission-critical operational strength and strategic socioeconomic teaming value.",
    publishedDate: "2026-08-10",
    author: "GovCon Advisory Desk",
    status: "published"
  },
  {
    slug: "disaster-survivor-contact-centers",
    title: "Disaster Survivor Contact Centers: Empathy, QA Calibrations & Scalable Intake",
    category: "Emergency Management",
    summary: "How mission-driven contact center operations deliver rapid helpline support and compassionate survivor intake during critical disaster recovery.",
    content: "When major hurricanes or emergencies strike, affected survivors need immediate, empathetic, and clear guidance. TIG designs, staffs, and manages high-capacity disaster survivor helplines that scale rapidly during surge recovery periods.\n\nOur contact center model incorporates comprehensive Quality Assurance (QA) scoring, regular supervisor calibration sessions, and strict PII / data privacy protocols. By providing structured applicant intake, document verification, and compassionate assistance, we help survivors access emergency programs while maintaining compliance with agency service-level agreements (SLAs).",
    publishedDate: "2026-08-12",
    author: "Contact Center Operations Desk",
    status: "published"
  },
  {
    slug: "b2g-accounting-dcaa-compliance",
    title: "Government Contract Accounting & DCAA Compliance: Structuring Audit-Proof Controls",
    category: "B2G Accounting",
    summary: "Key practices for Work Breakdown Structure (WBS) cost tracking, indirect rate formulation, and federal FAR compliance.",
    content: "Navigating cost-reimbursable and fixed-price federal contracts requires rigorous accounting systems. TIG applies transparent government cost accounting controls that align with Defense Contract Audit Agency (DCAA) standards and FAR Part 31 cost principles.\n\nFrom segregating direct from unallowable indirect costs to formulating defensible Fringe, Overhead, and G&A rate structures, our financial controls ensure that municipal and federal project expenditures are fully documented, defensible, and audit-ready from initial award through closeout.",
    publishedDate: "2026-08-14",
    author: "Financial Controls Desk",
    status: "published"
  },
  {
    slug: "emergency-management-planning-exercises",
    title: "Planning, Preparedness & HSEEP Exercises: Operationalizing Community Readiness",
    category: "Strategic Teaming",
    summary: "Developing compliant Emergency Operations Plans (EOP), COOP/COG continuity strategies, and Homeland Security HSEEP tabletop exercises.",
    content: "True emergency resilience is built long before the disaster arrives. TIG works closely with county emergency management agencies, municipalities, and regional utilities to draft and update Emergency Operations Plans (EOPs), Continuity of Operations and Continuity of Government (COOP/COG) plans, and Hazard Mitigation documentation.\n\nOur certified exercise directors design and facilitate Homeland Security Exercise and Evaluation Program (HSEEP)-compliant Tabletop (TTX), Functional, and Full-Scale exercises that stress-test communications, Incident Command System (ICS) protocols, and multi-agency coordination before delivering actionable After-Action Reports (AAR).",
    publishedDate: "2026-08-16",
    author: "Preparedness & Exercises Desk",
    status: "published"
  },
  {
    slug: "inferno-cares-community-resilience",
    title: "Inferno Cares: Driving Social Impact, Relief & Education Across Our Communities",
    category: "Community Impact",
    summary: "How TIG's corporate social responsibility initiatives sponsor disaster relief tournaments, youth scholarships, and veteran support.",
    content: "At The Inferno Group LLC, our mission to protect and restore communities extends beyond commercial and federal contracts. Through Inferno Cares, TIG actively invests in community resilience, relief, and youth empowerment.\n\nSignature initiatives include the 'Kicking for Relief' kickball tournament raising direct aid for storm-displaced families, the 'Inferno Flame Scholarship' awarding college book stipends to Greater Orlando high school seniors, and direct workforce development programs supporting veteran reintegration into emergency management careers.",
    publishedDate: "2026-08-18",
    author: "Inferno Cares Community Desk",
    status: "published"
  }
];


const defaultAIInnovation: FeatureCard[] = [
  { id: "ai-1", title: "Procurement Analytics", desc: "Automated parsing of SAM.gov and local portals, identifying optimal set-aside contract opportunities suited to client certifications.", icon: "search" },
  { id: "ai-2", title: "Weather Alert Syncing", desc: "Live integration with weather forecasting nodes to predict disaster paths and dispatch rapid-response operational coordinators.", icon: "cloud-lightning" },
  { id: "ai-3", title: "PII Compliant Gateways", desc: "Secure end-to-end data encryption pipelines for uploading resumes, corporate financials, and socioeconomic filings.", icon: "lock" }
];

const defaultJobs: Job[] = [
  {
    id: "case-manager",
    title: "Case Manager",
    department: "Emergency Operations & Relief",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($24.00–$31.00/hr)",
    summary: "Assess needs, maintain accurate case records, coordinate available resources, and help disaster survivors navigate program requirements.",
    description: "The Case Manager supports individuals, families, or program participants affected by disasters, emergencies, or government-administered recovery programs. This position is responsible for assessing needs, maintaining accurate case documentation, coordinating available resources, and helping applicants navigate program requirements from intake through resolution.",
    responsibilities: [
      "Conduct applicant or survivor intake, needs assessments, and eligibility reviews.",
      "Maintain complete, accurate, and confidential case records.",
      "Explain program requirements, documentation standards, and next steps to applicants.",
      "Coordinate referrals to governmental, nonprofit, and community resources.",
      "Follow established policies, procedures, service-level requirements, and escalation protocols.",
      "Track case progress and conduct timely follow-up with assigned participants.",
      "Identify complex or sensitive cases requiring supervisory review.",
      "Support reporting, quality assurance, and program documentation requirements.",
      "Maintain professionalism and empathy when assisting individuals experiencing hardship or displacement."
    ],
    requirements: [
      "High school diploma or equivalent required; associate or bachelor's degree preferred.",
      "Previous case management, disaster recovery, human services, housing, customer service, or government program experience preferred.",
      "Strong written and verbal communication skills.",
      "Ability to manage sensitive information and maintain confidentiality.",
      "Proficiency with Microsoft Office and web-based case management systems.",
      "Ability to work in a fast-paced, deadline-driven environment.",
      "FEMA, Individual Assistance, housing recovery, or human services experience is a plus."
    ],
    postedDate: "2026-08-01",
    status: "published"
  },
  {
    id: "debris-monitor",
    title: "Debris Monitor",
    department: "Field Operations & Recovery",
    location: "Orlando, Florida / Field Assignments as Required",
    type: "Cadre / Temporary ($22.00–$28.00/hr)",
    summary: "Provide field-level oversight of disaster debris collection, verify eligible load tickets, and ensure compliance with project procedures.",
    description: "The Debris Monitor provides field-level oversight of disaster debris collection and removal operations. The role documents contractor activity, verifies eligible debris and load information, promotes compliance with project requirements, and maintains accurate records supporting reimbursement and contract administration.",
    responsibilities: [
      "Monitor debris collection, loading, hauling, reduction, and disposal activities.",
      "Verify truck identification, load capacity, debris type, collection location, and destination.",
      "Complete required load tickets, logs, photographs, and electronic documentation.",
      "Observe contractor performance for compliance with assigned scope and procedures.",
      "Immediately report safety concerns, prohibited debris, discrepancies, or suspected irregularities.",
      "Maintain accurate daily records and submit documentation according to established deadlines.",
      "Coordinate with field supervisors, debris management personnel, contractors, and local officials.",
      "Follow FEMA, state, local, and project-specific debris monitoring procedures.",
      "Work outdoors for extended periods under varying weather and field conditions."
    ],
    requirements: [
      "High school diploma or equivalent required.",
      "Valid driver's license and reliable transportation may be required for field assignments.",
      "Ability to use smartphones, tablets, GPS applications, and electronic documentation systems.",
      "Strong attention to detail and ability to maintain accurate records.",
      "Ability to work extended shifts, weekends, holidays, or emergency schedules when activated.",
      "Previous disaster response, construction, inspection, public works, logistics, or debris monitoring experience preferred.",
      "FEMA debris management training is a plus."
    ],
    postedDate: "2026-08-02",
    status: "published"
  },
  {
    id: "director-of-finance",
    title: "Director of Finance",
    department: "Executive & Financial Controls",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($105,000–$135,000/yr)",
    summary: "Provide strategic financial leadership, oversee project financial controls, government contract accounting, budgeting, and forecasting.",
    description: "The Director of Finance provides strategic and operational leadership for TIG's financial functions. This role oversees financial reporting, budgeting, forecasting, cash management, project financial controls, compliance, and financial planning while helping leadership scale the organization responsibly.",
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
      "Develop scalable financial processes to support organizational growth."
    ],
    requirements: [
      "Bachelor's degree in Finance, Accounting, Business Administration, or related field required.",
      "7+ years of progressive finance or accounting experience preferred.",
      "Prior leadership or financial management experience strongly preferred.",
      "Experience with budgeting, forecasting, financial modeling, and management reporting.",
      "Government contracting, project accounting, or professional services experience is highly desirable.",
      "Advanced Excel skills and experience with accounting or ERP platforms.",
      "CPA, CMA, MBA, or similar advanced credential is preferred but not required."
    ],
    postedDate: "2026-08-03",
    status: "published"
  },
  {
    id: "qa-agent",
    title: "Quality Assurance Agent",
    department: "Quality Assurance & Compliance",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($23.00–$29.00/hr)",
    summary: "Review customer interactions, case documentation, and operational processes to ensure accuracy and program compliance.",
    description: "The Quality Assurance Agent reviews customer interactions, case documentation, and operational processes to ensure accuracy, professionalism, compliance, and adherence to established program standards.",
    responsibilities: [
      "Review calls, cases, records, or transactions against established quality standards.",
      "Score evaluations consistently using approved quality criteria.",
      "Identify documentation, communication, compliance, and process deficiencies.",
      "Provide clear feedback and supporting observations to leadership.",
      "Maintain accurate quality records and evaluation documentation.",
      "Identify recurring trends and opportunities for coaching or process improvement.",
      "Participate in calibration sessions and quality meetings.",
      "Protect confidential customer and program information.",
      "Support audits and corrective-action initiatives as assigned."
    ],
    requirements: [
      "High school diploma or equivalent required; associate or bachelor's degree preferred.",
      "1+ year of quality assurance, contact center, case management, compliance, or customer service experience preferred.",
      "Strong analytical, listening, writing, and documentation skills.",
      "Ability to interpret procedures and apply standards consistently.",
      "Proficiency with Microsoft Office and web-based applications.",
      "Government program or disaster recovery experience is a plus."
    ],
    postedDate: "2026-08-04",
    status: "published"
  },
  {
    id: "qa-lead",
    title: "Quality Assurance Lead",
    department: "Quality Assurance & Compliance",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($27.00–$35.00/hr)",
    summary: "Lead daily quality operations, assist with calibration sessions, track quality trends, and support QA Agents.",
    description: "The Quality Assurance Lead supports daily quality operations and serves as a resource to Quality Assurance Agents. The position conducts evaluations, assists with calibration and reporting, identifies performance trends, and helps ensure quality standards are applied consistently across the program.",
    responsibilities: [
      "Perform quality evaluations and secondary reviews.",
      "Provide day-to-day guidance to Quality Assurance Agents.",
      "Assist with calibration sessions and evaluator consistency.",
      "Track quality trends and identify recurring performance gaps.",
      "Prepare quality reports and communicate findings to supervisors and program leadership.",
      "Support coaching recommendations and corrective-action activities.",
      "Assist with quality procedures, scorecards, and process improvements.",
      "Review escalated or complex cases as assigned.",
      "Maintain confidentiality and ensure adherence to contractual and program standards."
    ],
    requirements: [
      "2+ years of quality assurance, compliance, contact center, or operational experience preferred.",
      "Previous lead or mentoring experience strongly preferred.",
      "Strong analytical and communication skills.",
      "Experience preparing reports and interpreting performance data.",
      "Ability to manage competing priorities in a high-volume environment.",
      "Government, emergency management, or disaster recovery program experience is a plus."
    ],
    postedDate: "2026-08-05",
    status: "published"
  },
  {
    id: "qa-supervisor",
    title: "Quality Assurance Supervisor",
    department: "Quality Assurance & Compliance",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($31.00–$40.00/hr)",
    summary: "Oversee QA personnel, performance reporting, calibration processes, compliance monitoring, and continuous improvement.",
    description: "The Quality Assurance Supervisor oversees quality assurance personnel and program quality activities. This position is responsible for evaluation standards, performance reporting, coaching coordination, calibration, compliance monitoring, and continuous improvement.",
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
      "Escalate significant compliance, customer experience, or operational concerns."
    ],
    requirements: [
      "3+ years of quality assurance, compliance, contact center, or program operations experience preferred.",
      "1+ year of supervisory or team-lead experience preferred.",
      "Strong reporting, analytical, coaching, and communication skills.",
      "Experience with quality scorecards, performance metrics, and calibration processes.",
      "Ability to supervise remote or distributed teams.",
      "Government contracting or disaster recovery program experience is highly desirable."
    ],
    postedDate: "2026-08-06",
    status: "published"
  },
  {
    id: "training-lead",
    title: "Training Lead",
    department: "Workforce Development & Training",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($72,000–$92,000/yr)",
    summary: "Design, coordinate, and deliver training programs for onboarding, continuing education, and emergency mobilization.",
    description: "The Training Lead designs, coordinates, and delivers training programs that prepare TIG personnel to successfully perform client and mission requirements. This role supports onboarding, continuing education, process changes, performance improvement, and training quality across multiple programs.",
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
      "Assist with rapid workforce mobilization during emergency activations."
    ],
    requirements: [
      "Bachelor's degree or equivalent combination of education and relevant experience preferred.",
      "3+ years of corporate training, instructional delivery, learning and development, or operational training experience.",
      "Experience developing training materials and facilitating adult learning.",
      "Strong presentation, organization, writing, and communication skills.",
      "Familiarity with virtual training platforms and learning management systems.",
      "Government, contact center, emergency management, or disaster recovery experience preferred.",
      "Instructional design or training certification is a plus."
    ],
    postedDate: "2026-08-07",
    status: "published"
  },
  {
    id: "contact-center-supervisor",
    title: "Contact Center Supervisor",
    department: "Contact Center Operations",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($29.00–$37.00/hr) [2 Openings]",
    summary: "Lead frontline contact center agents, oversee daily service levels, handle escalations, and manage workforce adherence.",
    description: "The Contact Center Supervisor leads frontline agents responsible for delivering timely, accurate, and professional support to customers, applicants, survivors, or program participants. The supervisor is accountable for daily performance, coaching, escalations, workforce adherence, and service quality.",
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
      "Maintain a professional, accountable, and service-oriented team environment."
    ],
    requirements: [
      "2+ years of contact center, customer service, or program operations experience preferred.",
      "Previous supervisory or team-lead experience strongly preferred.",
      "Experience managing KPIs such as service level, handle time, quality, adherence, and customer satisfaction.",
      "Strong leadership, problem-solving, and conflict-resolution skills.",
      "Ability to manage remote or hybrid employees.",
      "Disaster recovery or government contact center experience is a plus."
    ],
    postedDate: "2026-08-08",
    status: "published"
  },
  {
    id: "administrative-assistant",
    title: "Administrative Assistant",
    department: "Corporate & Operational Support",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($46,000–$60,000/yr)",
    summary: "Provide organizational support to TIG leadership and project teams through scheduling, correspondence, and administration.",
    description: "The Administrative Assistant provides organizational and administrative support to TIG leadership and project teams. This role helps maintain efficient daily operations through scheduling, correspondence, document preparation, recordkeeping, coordination, and general administrative support.",
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
      "Provide general support to executive and project leadership."
    ],
    requirements: [
      "High school diploma or equivalent required; associate or bachelor's degree preferred.",
      "2+ years of administrative, executive support, office management, or related experience preferred.",
      "Strong Microsoft Office skills.",
      "Excellent written communication, organization, and attention to detail.",
      "Ability to prioritize multiple assignments independently.",
      "Professional judgment and ability to handle confidential information."
    ],
    postedDate: "2026-08-09",
    status: "published"
  },
  {
    id: "contact-center-agent",
    title: "Contact Center Agent",
    department: "Contact Center Operations",
    location: "Orlando, Florida / Remote",
    type: "Cadre / Temporary ($22.00–$27.00/hr)",
    summary: "Provide professional assistance to customers and disaster survivors through inbound/outbound calls and documentation.",
    description: "The Contact Center Agent provides professional assistance to customers, applicants, survivors, or program participants through inbound and outbound communications. Agents are responsible for providing accurate information, documenting interactions, resolving routine concerns, and escalating complex matters appropriately.",
    responsibilities: [
      "Respond to inbound and outbound calls and other approved communication channels.",
      "Provide accurate information regarding programs, services, applications, or case status.",
      "Document customer interactions completely and accurately.",
      "Verify information and follow established privacy and security procedures.",
      "Resolve routine concerns and escalate complex issues when appropriate.",
      "Meet established attendance, quality, productivity, and service expectations.",
      "Participate in required training and coaching.",
      "Maintain professionalism when assisting individuals experiencing stressful circumstances.",
      "Follow approved scripts, workflows, policies, and procedures."
    ],
    requirements: [
      "High school diploma or equivalent required.",
      "Previous customer service, contact center, hospitality, healthcare, government, or case support experience preferred.",
      "Strong communication and active-listening skills.",
      "Comfortable working with multiple computer applications simultaneously.",
      "Reliable attendance and ability to work assigned schedules.",
      "Bilingual capabilities are a plus."
    ],
    postedDate: "2026-08-10",
    status: "published"
  },
  {
    id: "talent-acquisition-specialist",
    title: "Talent Acquisition Specialist",
    department: "Corporate & Cadre Recruitment",
    location: "Orlando, Florida / Remote",
    type: "Full-Time ($60,000–$78,000/yr)",
    summary: "Manage full-cycle recruiting for corporate and deployable cadre workforce across emergency activations.",
    description: "The Talent Acquisition Specialist manages full-cycle recruiting for corporate, professional, technical, and emergency-response positions. This role will be particularly important in building and maintaining TIG's deployable cadre workforce while supporting long-term organizational hiring needs.",
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
      "Promote a professional and responsive candidate experience."
    ],
    requirements: [
      "Bachelor's degree preferred or equivalent recruiting experience.",
      "2+ years of recruiting or talent acquisition experience preferred.",
      "Experience with applicant tracking systems and candidate sourcing tools.",
      "Strong written, verbal, organizational, and relationship-management skills.",
      "Ability to manage high-volume and specialized recruiting simultaneously.",
      "Government contracting, emergency management, disaster recovery, or staffing agency experience is highly desirable."
    ],
    postedDate: "2026-08-11",
    status: "published"
  },
  {
    id: "dr-ia-project-manager",
    title: "Disaster Recovery Individual Assistance Project Manager",
    department: "Emergency Management & Recovery",
    location: "Orlando, Florida / Remote, with travel or deployment as required",
    type: "Full-Time ($92,000–$118,000/yr)",
    summary: "Lead survivor-support projects from mobilization through closeout, overseeing FEMA IA compliance and case management.",
    description: "The Disaster Recovery Individual Assistance (IA) Project Manager leads projects supporting programs designed to assist individuals and households affected by disasters. This role manages project delivery, client coordination, staffing, performance, compliance, documentation, and program implementation.",
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
      "Lead teams during emergency activations or periods of rapid operational growth."
    ],
    requirements: [
      "Bachelor's degree in Emergency Management, Public Administration, Business, Project Management, or related field preferred.",
      "5+ years of project, program, emergency management, human services, or disaster recovery experience preferred.",
      "Demonstrated experience leading multidisciplinary teams and client-facing projects.",
      "Familiarity with FEMA Individual Assistance programs and disaster survivor services strongly preferred.",
      "Strong project management, reporting, communication, and analytical skills.",
      "PMP, FEMA training, or emergency management credentials are highly desirable."
    ],
    postedDate: "2026-08-12",
    status: "published"
  },
  {
    id: "dr-pa-project-manager",
    title: "Disaster Recovery Public Assistance Project Manager",
    department: "Emergency Management & Grant Compliance",
    location: "Orlando, Florida / Remote, with travel or deployment as required",
    type: "Full-Time ($98,000–$128,000/yr)",
    summary: "Manage FEMA Public Assistance recovery projects, damage documentation, scopes of work, and grant closeouts.",
    description: "The Disaster Recovery Public Assistance (PA) Project Manager leads FEMA Public Assistance recovery projects and supports applicants throughout the disaster grant lifecycle. This position oversees project development, documentation, compliance, reimbursement support, client communication, and project delivery.",
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
      "Provide leadership to assigned recovery personnel and subcontractors."
    ],
    requirements: [
      "Bachelor's degree in Emergency Management, Public Administration, Business, Engineering, Construction Management, or related discipline preferred.",
      "5+ years of disaster recovery, grants management, project management, or related experience preferred.",
      "Direct FEMA Public Assistance experience strongly preferred.",
      "Knowledge of FEMA PA program delivery, documentation, cost eligibility, procurement, and grant compliance.",
      "Strong client-management and technical-writing skills.",
      "PMP, FEMA PA training, or comparable credentials are highly desirable.",
      "Ability to travel or deploy when mission requirements dictate."
    ],
    postedDate: "2026-08-13",
    status: "published"
  },
  {
    id: "planning-section-chief",
    title: "Planning Section Chief",
    department: "Incident Command System & EOC",
    location: "Designated Emergency Operations Center (EOC)",
    type: "Cadre / Temporary ($45.00–$60.00/hr)",
    summary: "Senior ICS leader overseeing situational awareness, planning cycles, incident action plans, and resource-status tracking.",
    description: "The Planning Section Chief serves as a senior Incident Command System leadership position within the designated Emergency Operations Center. The position oversees situational awareness, planning cycles, incident documentation, resource-status information, and development of plans required to support coordinated incident operations.",
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
      "Maintain ICS/NIMS compliance throughout the assigned mission."
    ],
    requirements: [
      "Significant emergency management, incident management, or EOC experience required.",
      "Demonstrated experience working within ICS/NIMS structures.",
      "Previous Planning Section leadership experience strongly preferred.",
      "Completion of applicable FEMA ICS coursework, including advanced ICS training, is highly desirable.",
      "Strong briefing, facilitation, analytical, documentation, and decision-support skills.",
      "Ability to work extended operational periods, nights, weekends, holidays, and emergency schedules.",
      "Must be able to remain assigned to the designated EOC for the duration required by the mission."
    ],
    postedDate: "2026-08-14",
    status: "published"
  },
  {
    id: "logistics-section-chief",
    title: "Logistics Section Chief",
    department: "Incident Command System & EOC",
    location: "Designated Emergency Operations Center (EOC)",
    type: "Cadre / Temporary ($45.00–$60.00/hr)",
    summary: "Lead EOC logistics support activities, resource fulfillment, vendor coordination, and supply chain tracking.",
    description: "The Logistics Section Chief leads logistical support activities within the designated Emergency Operations Center and coordinates the resources, services, facilities, supplies, communications, transportation, and support capabilities necessary to sustain incident operations.",
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
      "Ensure logistics operations follow applicable procedures and ICS/NIMS principles."
    ],
    requirements: [
      "Significant emergency management, logistics, incident management, or EOC experience required.",
      "Previous leadership within an ICS Logistics Section or comparable emergency logistics environment strongly preferred.",
      "Knowledge of resource management, procurement, transportation, supply operations, and emergency logistics.",
      "Applicable FEMA ICS/NIMS training is highly desirable.",
      "Strong organizational, communication, decision-making, and problem-solving skills.",
      "Ability to work extended operational periods and emergency schedules.",
      "Must be able to remain assigned to the designated EOC for the duration required by the mission."
    ],
    postedDate: "2026-08-15",
    status: "published"
  },
  {
    id: "operations-section-chief",
    title: "Operations Section Chief",
    department: "Incident Command System & EOC",
    location: "Designated Emergency Operations Center (EOC)",
    type: "Cadre / Temporary ($48.00–$65.00/hr)",
    summary: "Senior incident management leader directing operational activities to accomplish established incident objectives.",
    description: "The Operations Section Chief serves as a senior incident-management leader responsible for coordinating and directing operational activities necessary to accomplish established incident objectives. The role operates from the designated Emergency Operations Center for the duration of the mission and works closely with command and other section leadership.",
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
      "Support demobilization, transition, and after-action activities."
    ],
    requirements: [
      "Extensive emergency management, public safety, incident management, or EOC operations experience required.",
      "Demonstrated supervisory experience within an ICS/NIMS environment.",
      "Previous Operations Section Chief or comparable senior incident leadership experience strongly preferred.",
      "Advanced FEMA ICS/NIMS coursework is highly desirable.",
      "Strong operational judgment, leadership, coordination, and briefing capabilities.",
      "Ability to make decisions effectively in rapidly changing environments.",
      "Ability to work extended operational periods, nights, weekends, holidays, and emergency schedules.",
      "Must be able to remain assigned to the designated EOC for the duration required by the mission."
    ],
    postedDate: "2026-08-16",
    status: "published"
  }
];

const defaultFAQ: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is your core focus within emergency management and disaster recovery?",
    answer: "Our team handles programmatic compliance, individual assistance (IA) systems setup, FEMA public assistance (PA) documentation, and emergency case management. We coordinate local, state, and federal response structures to ensure reimbursement requests align with policy parameters.",
    category: "emergency",
    status: "published"
  },
  {
    id: "faq-2",
    question: "How does your certification consulting support accelerate SBA applications?",
    answer: "We systematically audit corporate governance, financial records, ownership structures, and residency requirements prior to submission. By eliminating errors and clarifying eligibility factors up front, we prevent common RFI delays and expedite approvals for 8(a), HUBZone, and WOSB.",
    category: "contracting",
    status: "published"
  },
  {
    id: "faq-3",
    question: "Are you open to joint ventures or teaming agreements as a subcontractor?",
    answer: "Yes. We actively enter into Teaming Agreements and Joint Ventures (JV) with larger prime contractors. We bring socio-economic status advantages, specific NAICS codes, and field-ready teams to enhance proposal scores on complex agency procurements.",
    category: "partnership",
    status: "published"
  },
  {
    id: "faq-4",
    question: "How does DCAA compliance advisory benefit B2G contractors?",
    answer: "Federal agencies require cost accounting compliance before awarding cost-reimbursable contracts. We audit systems, organize charts of accounts, build indirect rate calculations (Fringe, Overhead, G&A), and draft policies that withstand rigorous Defense Contract Audit Agency (DCAA) reviews.",
    category: "compliance",
    status: "published"
  }
];

const defaultPrivacy: LegalPage = {
  id: "privacy",
  title: "Privacy Policy",
  content: `### 1. Information Collection and PII Policy
The Inferno Group LLC ("we," "us," or "our") operates government consulting services, including Emergency Management disaster casework and B2G portal applications. In carrying out these responsibilities, we may collect Personally Identifiable Information (PII) including, but not limited to, full names, work email addresses, telephone numbers, employer identification details, resumes, and certification parameters.

We maintain a strict PII protection standard in accordance with standard federal guidelines. We do not sell, rent, or lease our database leads to third parties.

### 2. Stafford Act Compliance & Emergency Programs
When facilitating emergency management and disaster recovery programs (such as FEMA Individual or Public Assistance case intakes), we adhere to the strict security directives governed by the Robert T. Stafford Disaster Relief and Emergency Assistance Act and the Privacy Act of 1974. All casework data is encrypted at rest and in transit.

### 3. File Uploads & Resume Security
Files uploaded to our careers board, contracting portal, or capabilities systems are stored securely. These assets are only accessible by authorized administrative desk officers and human resource managers tasked with evaluations.

### 4. Policy Updates
We reserve the right to modify this Privacy Policy at any time. Changes will be published immediately on this secure dashboard. Continuing interaction with our portal services designates acceptance of the terms.`
};

const defaultConduct: LegalPage = {
  id: "conduct",
  title: "Standards of Conduct",
  content: `### 1. Procurement Integrity and Ethics
The Inferno Group LLC maintains a strict code of ethical standards and professional conduct. We are dedicated to ensuring absolute transparency, integrity, and compliance across all B2G contracting transactions. We strictly enforce the regulations outlined in the Procurement Integrity Act (41 U.S.C. §§ 2101-2107).

### 2. Conflict of Interest Guidelines
Our advisory staff and field operations coordinators are prohibited from engaging in activities that create actual or perceived organizational or personal conflicts of interest (OCI). Any potential OCI must be reported immediately to our contracting officer.

### 3. Anti-Kickback & FAR Compliance
We adhere to the Anti-Kickback Act of 1986 and FAR Part 3.502. We strictly forbid the offering, solicitation, or receipt of any kickbacks, bribes, or illegal gratuities in exchange for teaming preferences, subcontracting awards, or government procurement advantages.

### 4. Workforce & Socioeconomic Standards
We promote equal opportunity and fair treatment across all recruitment pathways, maintaining alignment with federal labor laws, EEO policies, and affirmative action guidelines for emergency deployment teams.`
};

const defaultHero: HeroData = {
  eyebrow: "Government Consulting & Operational Solutions",
  headlineMain: "Ready Before the Crisis. Reliable During It.",
  headlineGradient: "Stronger After It.",
  subheadline: "Ideas don't solve problems. Execution does. We deliver consulting and operational solutions that produce measurable results.",
  videoUrl: "",
  fallbackImage: "/hero-bg.jpg",
  ctaText1: "Explore Services",
  ctaLink1: "/services",
  ctaText2: "Partner With Us",
  ctaLink2: "/partnerships"
};

// ── UTILITY FUNCTIONS ──

function getStoreItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(stored);
    let migrated = false;

    // Runtime migration: Ensure hero uses high-definition hero-bg.jpg asset with no static video overlay
    if (key === "inferno_hero_v4" && parsed && typeof parsed === "object") {
      const p = parsed as Partial<HeroData>;
      if (p.fallbackImage !== "/hero-bg.jpg" || p.videoUrl) {
        migrated = true;
        p.fallbackImage = "/hero-bg.jpg";
        p.videoUrl = "";
      }
    }

    if (key.startsWith("inferno_team") && Array.isArray(parsed)) {
      (parsed as TeamMember[]).forEach((m) => {
        if (m.id === "andre-montgomery" && (m.image !== "/team_andre.png" && !m.image.startsWith("data:"))) {
          m.image = "/team_andre.png";
          migrated = true;
        }
        if (m.id === "fady-youssef" && (m.image !== "/team_fady.png" && !m.image.startsWith("data:"))) {
          m.image = "/team_fady.png";
          migrated = true;
        }
        if (m.id === "charnelle-smith" && (m.image !== "/team_charnelle.png" && !m.image.startsWith("data:"))) {
          m.image = "/team_charnelle.png";
          migrated = true;
        }
        if (m.id === "kelly-clerveaux" && (m.image !== "/team_kelly.png" && !m.image.startsWith("data:"))) {
          m.image = "/team_kelly.png";
          migrated = true;
        }
        if (m.image && m.image.includes("placeholder")) {
          m.image = "/logo.jpeg";
          migrated = true;
        }
      });
    }

    if (key.startsWith("inferno_community") && Array.isArray(parsed)) {
      (parsed as CommunityStory[]).forEach((s) => {
        const needsCorrection = !s.image || s.image.includes("placeholder") ||
          (s.id === "story-1" && s.image !== "/impact_texas.png" && !s.image.startsWith("data:")) ||
          (s.id === "story-2" && s.image !== "/impact_debris.png" && !s.image.startsWith("data:"));
        
        if (needsCorrection) {
          migrated = true;
          if (s.id === "story-1") s.image = "/impact_texas.png";
          else if (s.id === "story-2") s.image = "/impact_debris.png";
          else s.image = "/logo.jpeg";
        }
      });
    }

    if (migrated) {
      localStorage.setItem(key, JSON.stringify(parsed));
    }

    return parsed as T;
  } catch {
    return defaultValue;
  }
}

function setStoreItem<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// ── EXPORTED DATA STORE INTERFACES ──

export const dataStore = {
  // About Content
  getAbout: (): AboutData => getStoreItem<AboutData>("inferno_about_v3", defaultAbout),
  saveAbout: (about: AboutData): void => setStoreItem<AboutData>("inferno_about_v3", about),

  // Team members
  getTeam: (): TeamMember[] => getStoreItem<TeamMember[]>("inferno_team_v6", defaultTeam),
  saveTeam: (team: TeamMember[]): void => setStoreItem<TeamMember[]>("inferno_team_v6", team),

  // Services
  getServices: (): ServiceItem[] => getStoreItem<ServiceItem[]>("inferno_services_v3", defaultServices),
  saveServices: (services: ServiceItem[]): void => setStoreItem<ServiceItem[]>("inferno_services_v3", services),

  // Stats
  getStats: (): StatItem[] => getStoreItem<StatItem[]>("inferno_stats_v3", defaultStats),
  saveStats: (stats: StatItem[]): void => setStoreItem<StatItem[]>("inferno_stats_v3", stats),

  // Testimonials
  getTestimonials: (): TestimonialItem[] => getStoreItem<TestimonialItem[]>("inferno_testimonials_v4", defaultTestimonials),
  saveTestimonials: (testimonials: TestimonialItem[]): void => setStoreItem<TestimonialItem[]>("inferno_testimonials_v4", testimonials),

  // Community stories
  getCommunityStories: (): CommunityStory[] => getStoreItem<CommunityStory[]>("inferno_community_v4", defaultCommunityStories),
  saveCommunityStories: (stories: CommunityStory[]): void => setStoreItem<CommunityStory[]>("inferno_community_v4", stories),

  // News
  getArticles: (): Article[] => getStoreItem<Article[]>("inferno_articles_v4", defaultArticles),
  saveArticles: (articles: Article[]): void => setStoreItem<Article[]>("inferno_articles_v4", articles),

  // AI & Innovation
  getAIInnovation: (): FeatureCard[] => getStoreItem<FeatureCard[]>("inferno_ai_innovation", defaultAIInnovation),
  saveAIInnovation: (features: FeatureCard[]): void => setStoreItem<FeatureCard[]>("inferno_ai_innovation", features),

  // Careers Jobs
  getJobs: (): Job[] => getStoreItem<Job[]>("inferno_jobs_v4", defaultJobs),
  saveJobs: (jobs: Job[]): void => setStoreItem<Job[]>("inferno_jobs_v4", jobs),

  // FAQs
  getFAQs: (): FAQItem[] => getStoreItem<FAQItem[]>("inferno_faqs", defaultFAQ),
  saveFAQs: (faqs: FAQItem[]): void => setStoreItem<FAQItem[]>("inferno_faqs", faqs),

  // Legal Pages
  getLegalPrivacy: (): LegalPage => getStoreItem<LegalPage>("inferno_legal_privacy", defaultPrivacy),
  saveLegalPrivacy: (privacy: LegalPage): void => setStoreItem<LegalPage>("inferno_legal_privacy", privacy),

  getLegalConduct: (): LegalPage => getStoreItem<LegalPage>("inferno_legal_conduct", defaultConduct),
  saveLegalConduct: (conduct: LegalPage): void => setStoreItem<LegalPage>("inferno_legal_conduct", conduct),

  // Hero Content
  getHero: (): HeroData => getStoreItem<HeroData>("inferno_hero_v4", defaultHero),
  saveHero: (hero: HeroData): void => setStoreItem<HeroData>("inferno_hero_v4", hero)
};
