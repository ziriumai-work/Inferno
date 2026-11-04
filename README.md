# The Inferno Group LLC — B2G Services & Emergency Management Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)

**The Inferno Group LLC (TIG)** B2G Services Portal is an enterprise-grade digital platform engineered for Business-to-Government (B2G) consulting, disaster recovery coordination, federal compliance, emergency management operations, and SAM.gov partner onboarding.

---

## 🏛️ Business & Government Credentials

- **Entity**: The Inferno Group LLC
- **UEI**: `QW6RHJACHA56`
- **Socio-Economic Certifications**: HUBZone Certified • Veteran-Owned Small Business (VOSB)
- **Primary Mission**: Disaster response coordination, Stafford Act audit compliance, FEMA Public & Individual Assistance, GSA Schedule onboarding, and DCAA indirect cost rate pool accounting.

---

## ✨ Key System Features & Portals

### 1. 🌪️ Live Emergency & Hurricane GIS Tracker (`/tracker`)
- **Real-Time NOAA & NHC Integration**: Live tracking of tropical storms, active disturbances, and 7-day weather outlooks.
- **Interactive GIS Map**: Rendered with **Leaflet** & **React-Leaflet**, featuring automated server-side unzipping of NOAA `.kmz`/`.kml` spatial layers via `adm-zip`.
- **Active Disturbance Warning Banner**: Viewport-sticky `TrackerAlert` component providing instant hazard status across all pages.

### 2. 📅 Consultation Scheduling & Calendar Engine (`/calendar`)
- **Interactive 30-Minute Time Slot Booking**: Direct reservation of government consulting briefings.
- **Two-Way Synchronization**: Supports Google Calendar API and Microsoft Graph (Outlook) integration.
- **Automated Transactional Emails**: Dispatches confirmation emails and notifications via the **Resend** API (`lib/email/sendBookingConfirmation.ts`).

### 3. 📑 Government Capabilities & Statement (`/capabilities`, `/capabilities/statement`)
- **Core Competencies**: Defense logistics, emergency management, critical infrastructure restoration, and program administration.
- **Official Capability Statement**: Fully formatted, print-optimized document available for digital viewing or PDF download (`public/documents/The_Inferno_Group_LLC_Capability_Statement.pdf`).
- **Federal Codes**: Quick reference for NAICS, PSC, CAGE, and UEI designations.

### 4. 💼 SAM.gov Contracts & Partnership Teaming (`/contracts`, `/partnerships`)
- **SAM.gov Opportunities Feed**: Live search and categorization of active federal solicitations.
- **Teaming Partner Onboarding**: Structured intake form for prime contractors and subcontractors with NAICS and past performance validation.

### 5. 👥 Community Impact & Inferno Cares (`/about#about-impact`)
- **Kicking for Relief**: Annual charity kickball tournament supporting storm-displaced families.
- **Inferno Ignite Scholarships**: Annual higher education book stipends and academic micro-grants.
- **Integrated Multimedia**: Embedded video player and multi-photo event gallery with aspect-ratio optimization.

### 6. 🔐 Operations Desk & CMS Admin Portal (`/infernollc/admin`)
- **Secure Authentication**: Supabase SSR authentication with password reset workflows and role-based access.
- **Dynamic Content Management**: Live editing for services, leadership profiles, community stories, news releases, testimonials, jobs, and platform stats.
- **Theme Switcher**: Instant light/dark mode toggle with persistent local storage.
- **Snapshot Backup & Restore**: One-click JSON data export and import for disaster-resilient CMS migration.

### 7. 🤖 AI Knowledge Assistant & Readiness Quiz (`components/Chatbot.tsx`, `/quiz`)
- **Interactive Chatbot**: Context-aware assistant trained on FEMA guidelines, SAM.gov registration, and company capabilities.
- **GovCon Readiness Quiz**: Interactive assessment tool evaluating small business eligibility for federal set-asides.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2.10** | App Router, Server & Client Components, Route Handlers |
| **Language** | **TypeScript 5 & React 19** | Strict type definitions (`types.d.ts`), modern hooks |
| **Styling** | **Tailwind CSS v4 + Vanilla CSS** | Design tokens, glassmorphism, responsive breakpoints (`globals.css`) |
| **Spatial / GIS** | **Leaflet & React-Leaflet** | NOAA storm cone rendering, coordinates mapping |
| **Archive Parsing**| **AdmZip** | Extraction and parsing of NHC KMZ/KML weather archives |
| **Backend & Auth** | **Supabase (@supabase/ssr)** | PostgreSQL database, RLS security policies, Auth sessions |
| **Email Service** | **Resend API** | Transactional booking confirmations and team alerts |
| **Security Layer** | **Custom Rate Limiter & Sanitizer**| Sliding-window DoS protection and XSS input hygiene (`lib/security/`) |

---

## 📂 Repository Directory Structure

```
The Inferno Group LLC - Services/
├── app/                                 # Next.js App Router Pages & API Routes
│   ├── about/                           # About page & leadership profiles
│   ├── api/                             # Serverless API route handlers
│   │   ├── bookings/                    # Consultation booking & slot availability
│   │   ├── cms/                         # Real-time CMS sync endpoint
│   │   ├── hurricane/                   # NOAA weather proxy
│   │   ├── leads/                       # Contact & consultation lead ingestion
│   │   └── tracker/                     # Storms, disturbances & outlook feeds
│   ├── auth/callback/                   # Supabase authentication redirect handler
│   ├── calendar/                        # Consultation scheduling portal
│   ├── capabilities/                    # Capabilities overview & formal statement
│   │   └── statement/                   # Printable GovCon Capability Statement
│   ├── careers/                         # Careers directory & [id] application view
│   ├── conduct/                         # Standards of Business Conduct & Ethics
│   ├── contact/                         # Contracting Desk & interactive GIS map
│   ├── contracts/                       # SAM.gov active federal solicitations
│   ├── faq/                             # Federal contracting knowledge base
│   ├── infernollc/admin/                # Operations Desk & Enterprise CMS Admin
│   ├── news/                            # Newsroom & dynamic [slug] article reader
│   ├── partnerships/                    # Subcontractor & teaming partner application
│   ├── privacy/                         # Privacy policy & data governance
│   ├── quiz/                            # Federal contracting readiness quiz
│   ├── resources/                       # Downloadable briefs & procurement guides
│   ├── services/                        # Service catalogue & dynamic [id] views
│   ├── tracker/                         # Live NOAA Hurricane Tracker
│   ├── error.tsx                        # Global error boundary
│   ├── global-error.tsx                 # Root layout error boundary
│   ├── globals.css                      # Central design system & color variables
│   ├── layout.tsx                       # Root layout (Nav, Footer, Chatbot, Banner)
│   ├── loading.tsx                      # Modern radar-themed loading component
│   ├── not-found.tsx                    # Custom 404 error page
│   ├── robots.ts                        # Search engine crawling rules
│   └── sitemap.ts                       # Automated XML sitemap generator
│
├── components/                          # Reusable Client & Server Components
│   ├── Layouts/                         # Navbar and Footer components
│   ├── AboutClient.tsx                  # Interactive About & Impact stories view
│   ├── AnimatedStats.tsx                # Metric counters with viewport triggers
│   ├── Chatbot.tsx                      # Floating AI Knowledge Assistant
│   ├── CMSRealtimeProvider.tsx          # Real-time multi-tab CMS synchronizer
│   ├── HeroCanvas.tsx                   # Interactive canvas particle visualizer
│   ├── HomeClient.tsx                   # Main interactive homepage client
│   ├── JobApplicationForm.tsx           # Multi-step recruitment application form
│   ├── RevealOnMount.tsx                # Intersection-observer scroll animations
│   ├── StormOverviewCards.tsx           # Weather metric telemetry display
│   ├── TestimonialsCarousel.tsx         # Client endorsement slider
│   ├── TrackerAlert.tsx                 # Sticky storm disturbance alert bar
│   ├── TrackerMap.tsx                   # Leaflet spatial hurricane radar map
│   └── TypewriterText.tsx               # Terminal-style text typewriter effect
│
├── lib/                                 # Shared Business Logic & Integrations
│   ├── email/                           # Resend email templates & dispatcher
│   ├── nhc/                             # National Hurricane Center API & historical repository
│   ├── security/                        # Rate limiting, input sanitizer, and security logger
│   └── supabase/                        # Supabase client, server, and database types
│
├── public/                              # Static Assets (Images, Logos, PDFs, Media)
│   ├── documents/                       # Official capability statement PDFs
│   ├── hero-bg.jpg                      # High-definition command center hero banner
│   ├── kickball_tournament.png          # Kicking for Relief tournament photograph
│   └── logo.png                         # Official corporate emblem
│
├── utils/                               # Client State Management
│   ├── dataStore.ts                     # LocalStorage CMS state engine & fallback data
│   └── useCMS.ts                        # React hook for subscribing to CMS updates
│
├── CODEBASE_STRUCTURE_AND_WORKFLOW.md   # Detailed engineering reference guide
├── next.config.ts                       # Next.js compiler & webpack configuration
├── package.json                         # Project dependencies & scripts
└── tsconfig.json                        # TypeScript strict compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/inferno-group.git
cd "The Inferno Group LLC - Services"
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

> 📖 **Full Credentials & Services Reference**: For in-depth documentation, official service links, developer dashboards, setup steps, and security guidelines for Supabase, Resend, Google Cloud, Microsoft Graph, and NOAA NHC, see **[CREDENTIALS_AND_INTEGRATIONS.md](./CREDENTIALS_AND_INTEGRATIONS.md)**.

Populate the required configuration keys:

```ini
# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Database & Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Clearance (Optional Defaults for Local Dev)
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=admin@theinfernogroup.com
NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD=your-secure-password

# Email Dispatch (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=The Inferno Group <no-reply@theinfernogroup.com>
ADMIN_NOTIFICATION_EMAIL=operations@theinfernogroup.com

# External Calendar Synchronization (Optional)
GOOGLE_CALENDAR_API_KEY=
GOOGLE_CALENDAR_ID=
OUTLOOK_GRAPH_ACCESS_TOKEN=
OUTLOOK_USER_EMAIL=
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Webpack compiler |
| `npm run build` | Compiles optimized production bundle and pre-renders static routes |
| `npm run start` | Boots the Node.js production server for standalone deployments |
| `npm run lint` | Runs ESLint 9 checks across all source files |

---

## 🔒 Security Best Practices

- **Role-Based Clearance**: Admin operations under `/infernollc/admin` require authenticated Supabase sessions.
- **Sliding-Window Rate Limiting**: Protects consultation booking endpoints (`/api/bookings`) and lead form handlers (`/api/leads`) against spam and brute-force traffic.
- **XSS Sanitization**: User-submitted form inputs are sanitized before persistence via `lib/security/sanitize.ts`.
- **Audit Logging**: Structured security events are emitted via `lib/security/logger.ts` for monitoring access anomalies.

---

## 📄 License & Corporate Notice

Copyright © 2026 The Inferno Group LLC. All rights reserved.  
Proprietary government contracting software and B2G infrastructure. Unauthorized copying, distribution, or reverse engineering is strictly prohibited.
