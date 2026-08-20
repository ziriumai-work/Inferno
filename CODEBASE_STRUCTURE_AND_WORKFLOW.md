# The Inferno Group LLC — B2G Services Portal
## Complete Codebase Architecture, File & Folder Structure, and System Workflows Guide

---

## 1. Executive Summary & Technical Architecture

**The Inferno Group LLC B2G Portal** is an enterprise-grade Business-to-Government (B2G) consulting, disaster recovery, emergency management, and federal compliance platform. Built on modern Next.js 16 App Router architecture, the portal provides real-time emergency GIS tracking, consultation scheduling with multi-calendar synchronization, dynamic CMS administration, automated lead scoring, and AI-driven vector knowledge search.

### Core Technology Stack

| Layer | Technology / Library | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2.10 (App Router)** | Full-stack server and client rendering, API routes, dynamic route segments, metadata injection, and edge proxy middleware. |
| **UI Library** | **React 19.2.4 & TypeScript 5** | Functional component architecture, strict type safety (`types.d.ts`), custom hooks, and concurrent hydration. |
| **Styling & Theme** | **Vanilla CSS Design System + Tailwind CSS v4** | CSS Custom Properties (`app/globals.css`), glassmorphism cards, federal slate/emerald/amber color token system, smooth transitions, and responsive layouts. |
| **GIS & Weather Maps** | **Leaflet 1.9.4 & React-Leaflet 5.0.0** | Interactive Map rendering for tropical storm tracks, historical track paths, forecast cone geometry, and watch/warning polygons. |
| **GIS Archive Parsing** | **AdmZip 0.6.0 & @types/adm-zip** | Server-side unzipping and extraction of NOAA/NHC `.kmz` / `.kml` GIS files for real-time spatial calculations. |
| **Database & Auth** | **Supabase SSR (@supabase/ssr 0.12.3, @supabase/supabase-js 2.110.8)** | Server & Client SDK wrappers, PostgreSQL database, RLS security policies, OAuth/magic link auth, and pgvector embeddings. |
| **Email Dispatch** | **Resend API Integration (`lib/email/sendBookingConfirmation.ts`)** | Automated transactional email notifications with fallback security audit logging for consultation bookings. |
| **Security & Utilities** | **Custom Sliding Window Rate Limiter & Sanitizer** | Protection against brute-force/DoS attacks, XSS sanitization, open-redirect checks, and structured security event logging (`lib/security/`). |
| **Local State Engine** | **Dynamic Client LocalStorage Engine (`utils/dataStore.ts`)** | Browser persistence and fallback state engine ensuring complete UI operation even during database disconnects or SSG pre-rendering. |

---

## 2. Exhaustive Files & Folders Directory Structure

Below is the complete structural map of the repository, annotating every directory, dynamic route, component, API endpoint, utility, and documentation asset.

```
inferno-group/
├── app/                                  # Next.js 16 App Router Pages, Layouts & Backend API Endpoints
│   ├── layout.tsx                        # Global root layout (Font injection, Background spotlights, Nav, Footer, Chatbot, Emergency Banner)
│   ├── page.tsx                          # Homepage route container (SEO Metadata export & HomeClient wrapper)
│   ├── globals.css                       # Centralized CSS Design System, Custom Properties, Glassmorphism, Animations & Utilities
│   ├── error.tsx                         # Global React Error Boundary component for graceful fallback UI rendering
│   ├── loading.tsx                       # Global page loading skeleton & spinner UI
│   ├── not-found.tsx                     # Custom 404 Page Not Found error state component
│   │
│   ├── about/                            # About & Leadership Directory
│   │   └── page.tsx                      # Server Page wrapper importing interactive AboutClient component
│   │
│   ├── admin/                            # CMS Admin & Lead Management Portal
│   │   └── page.tsx                      # CMS Admin dashboard with Supabase Auth check, tabbed navigation & CRUD controls
│   │
│   ├── api/                              # Backend Serverless API Route Handlers
│   │   ├── bookings/                     # Consultation Scheduler API
│   │   │   ├── route.ts                  # POST endpoint for booking reservations & triggering Resend confirmation email
│   │   │   ├── slots/                    # Live Slot Availability API
│   │   │   │   └── route.ts              # GET endpoint retrieving free consultation slots merged with external calendar busy windows
│   │   │   └── sync/                     # External Calendar Synchronization API
│   │   │       └── route.ts              # POST endpoint syncing availability with Google Calendar and Microsoft Graph APIs
│   │   ├── hurricane/                    # NOAA Proxy Alias Endpoint
│   │   │   └── route.ts              # GET proxy alias endpoint fetching /api/tracker/storms with security headers & logging
│   │   └── tracker/                      # Hurricane & Emergency Tracker APIs
│   │       ├── disturbances/             # Active Weather Disturbances Endpoint
│   │       │   └── route.ts              # GET endpoint serving NOAA active disturbances & high-probability formation zones
│   │       ├── outlook/                  # 7-Day Tropical Weather Outlook Endpoint
│   │       │   └── route.ts              # GET endpoint serving NOAA regional text outlook summaries
│   │       ├── storm/                    # Single Storm Telemetry API
│   │       │   └── [id]/                 # Dynamic storm ID route segment
│   │       │       └── route.ts          # GET endpoint fetching detailed storm telemetry, historical tracks, and forecast points
│   │       └── storms/                   # Active Tropical Storms List API
│   │           └── route.ts              # GET endpoint fetching and unzipping current NOAA active storm KMZ/KML payloads
│   │
│   ├── auth/                             # Authentication Callback Route
│   │   └── callback/                     # Supabase OAuth & Magic Link Redirection Handler
│   │       └── route.ts                  # GET handler exchanging auth codes for user session cookies
│   │
│   ├── calendar/                         # Consultation Booking Portal
│   │   └── page.tsx                      # Interactive calendar UI for scheduling 30-minute expert consultations
│   │
│   ├── capabilities/                     # Core Capabilities & Past Performance Showcase
│   │   └── page.tsx                      # Detailed page displaying Defense Logistics, Emergency Mgmt, GSA & SBA capabilities
│   │
│   ├── careers/                          # Careers & Recruitment Portal
│   │   ├── page.tsx                      # Job directory with department filtering and active listings
│   │   └── [id]/                         # Dynamic Job Details route segment
│   │       └── page.tsx                  # Dynamic page rendering role responsibilities, requirements, and job application form
│   │
│   ├── conduct/                          # Business Ethics & Standards of Conduct
│   │   └── page.tsx                      # Compliance policy document outlining corporate governance and ethical guidelines
│   │
│   ├── contact/                          # Contracting Desk & GIS Location Portal
│   │   └── page.tsx                      # Contact page featuring office locations, interactive Leaflet map, and lead submission form
│   │
│   ├── contracts/                        # SAM.gov Opportunities Explorer
│   │   └── page.tsx                      # Live feed and search interface for active federal contracting opportunities
│   │
│   ├── faq/                              # Federal Contracting Knowledge Base
│   │   └── page.tsx                      # Categorized accordion interface answering common SBA 8(a), DCAA, and FEMA questions
│   │
│   ├── news/                             # News, Press Releases & Solicitation Insights
│   │   ├── page.tsx                      # Articles listing page with category filters and search bar
│   │   └── [slug]/                       # Dynamic News Article route segment
│   │       └── page.tsx                  # Dynamic news reader page with rich article body and social share buttons
│   │
│   ├── partnerships/                     # Subcontractor & Teaming Partner Application
│   │   └── page.tsx                      # Teaming portal for prospective partners to submit NAICS codes, UEI, and capability profiles
│   │
│   ├── privacy/                          # Privacy Policy & Data Governance
│   │   └── page.tsx                      # Formal privacy policy documentation detailing data security and cookie policies
│   │
│   ├── quiz/                             # SBA 8(a) & Federal Certification Assessment Wizard
│   │   └── page.tsx                      # Interactive step-by-step wizard computing readiness scores for federal certifications
│   │
│   ├── resources/                        # Capability Download Center
│   │   └── page.tsx                      # Gated resource repository for downloading Capability Statements, Case Studies, and Compliance Checklists
│   │
│   ├── services/                         # Services Directory & Detail Portal
│   │   ├── page.tsx                      # Comprehensive grid listing all 6 core business service lines
│   │   └── [id]/                         # Dynamic Service Detail route segment
│   │       └── page.tsx                  # Dynamic service page displaying detailed capabilities, ideal client profiles, and case studies
│   │
│   └── tracker/                          # Live Hurricane & Emergency Weather Intelligence Dashboard
│       └── page.tsx                      # Full-screen GIS dashboard with Leaflet map, metric cards, emergency alerts, and data exports
│
├── components/                           # Modular React UI Components
│   ├── AboutClient.tsx                   # Client component rendering interactive team member cards, bio modals, and mission tabs
│   ├── AnimatedStats.tsx                 # Scroll-triggered count-up animation component for client numbers and success metrics
│   ├── Chatbot.tsx                       # Floating AI Chatbot widget with preset triggers, keyword search, and animated chat window
│   ├── HeroCanvas.tsx                    # HTML5 Canvas background rendering particle/wave ambient grid graphics
│   ├── HomeClient.tsx                    # Interactive client container for homepage video background, stats, and capabilities
│   ├── RevealOnMount.tsx                 # IntersectionObserver animation wrapper triggering smooth scroll fade-in effects
│   ├── StormOverviewCards.tsx            # Metric cards strip displaying active storm counts (Hurricanes, TS, TD, Disturbances)
│   ├── TestimonialsCarousel.tsx          # Interactive slideshow displaying verified customer testimonials and star ratings
│   ├── TrackerAlert.tsx                  # High-priority global emergency banner displayed when active Category 3+ storms occur
│   ├── TrackerMap.tsx                    # Leaflet Map component rendering storm positions, forecast paths, and watch/warning zones
│   ├── TypewriterText.tsx                # Dynamic typewriter animation component for hero headers and key slogans
│   └── Layouts/                          # Global Layout Navigation Components
│       ├── Navbar.tsx                    # Top navigation bar with multi-level dropdowns, emergency banner alert slot, and mobile drawer
│       └── Footer.tsx                    # Comprehensive footer with SAM.gov UEI/CAGE badges, sitemap, newsletter signup, and disclaimers
│
├── lib/                                  # Data Services, Security, Integration Clients & Data Feeds
│   ├── calendarSlots.ts                  # Consultation slot generation logic and time window availability calculators
│   ├── calendarSync.ts                   # Integration client querying Google Calendar FreeBusy and Microsoft Graph Outlook APIs
│   ├── calendarUtils.ts                  # Date formatting, timezone conversion, and calendar slot formatting utilities
│   ├── capabilitiesData.ts               # Capability statements, past performance case studies, and NAICS code reference data
│   ├── chatbotData.ts                    # AI Chatbot knowledge base dataset, vector query presets, and keyword response pairs
│   ├── contractsData.ts                  # Mock feed and interface data for SAM.gov contracting opportunities
│   ├── faqData.ts                        # Categorized FAQ data store for SBA 8(a), DCAA, FEMA, and SAM.gov inquiries
│   ├── partnerCardsData.ts               # Strategic teaming partner cards and subcontractor benefits data
│   ├── quizQuestions.ts                  # SBA 8(a) certification assessment wizard question tree and scoring logic
│   ├── resourcesData.ts                  # downloadable PDF and document assets metadata for the Resources download center
│   │
│   ├── email/                            # Transactional Email Services
│   │   └── sendBookingConfirmation.ts    # Resend API integration sending HTML confirmation emails with database fallback logging
│   │
│   ├── nhc/                              # NOAA National Hurricane Center Integration Engine
│   │   ├── apiService.ts                 # HTTP fetcher for CurrentStorms.json, MapServer REST APIs, and AdmZip KMZ/KML unzipper
│   │   ├── repository.ts                 # 45-second in-memory caching repository, metrics aggregator, and GeoJSON/CSV exporters
│   │   └── types.ts                      # Strict TypeScript definitions for NOAA storms, forecast points, track points, and GIS layers
│   │
│   ├── security/                         # Security & Audit Logging Pipeline
│   │   ├── logger.ts                     # Structured JSON audit log formatter for security events and API exceptions
│   │   ├── rateLimit.ts                  # In-memory sliding window rate limiter protecting endpoints against DoS & brute-force
│   │   └── sanitize.ts                   # Input escaping (`sanitizeInput`), rich text sanitizer (`sanitizeText`), and open-redirect validator
│   │
│   └── supabase/                         # Supabase SDK Wrappers & Types
│       ├── client.ts                     # Browser client SDK wrapper (`createBrowserClient`) for client-side state
│       ├── database.types.ts             # Auto-generated and custom TypeScript database schema interfaces
│       └── server.ts                     # Server client SDK wrapper (`createServerClient`) managing Next.js request/response cookies
│
├── utils/                                # Dynamic Data Store & Local Storage Persistence
│   └── dataStore.ts                      # Client-side state manager backed by LocalStorage for dynamic CMS CRUD and fallback mock data
│
├── Docs/                                 # Technical Specifications & Database Documentation
│   ├── API_CREDENTIALS.md                # Environment variable setup guide for Supabase, Resend, and NOAA APIs
│   ├── API_ENDPOINTS_SPECIFICATION.md    # API schema documentation covering parameters, response payloads, and error codes
│   ├── ARCHITECTURE_AND_DEVELOPMENT_GUIDE.md # Architectural guidelines, component rules, and design system specifications
│   ├── DATABASE_STRUCTURE.md             # Complete PostgreSQL DDL scripts and table creation queries for Supabase
│   ├── DATABASE_STRUCTURE_RELATIONSHIP.md# Entity Relationship Diagram (ERD) descriptions and foreign key relationship map
│   ├── INSTRUCTIONS.md                   # Operational guidelines and development setup requirements
│   ├── LIVE_CALENDAR_BOOKING_FLOW.md     # Step-by-step sequence documentation for the multi-calendar consultation booking flow
│   ├── REQUIREMENTS.md                   # Functional and non-functional requirements matrix for all portal features
│   └── erd.html                          # Visual HTML/SVG Entity Relationship Diagram for database visualization
│
├── public/                               # Static Public Assets & Media
│   ├── hero-video.mp4                    # Background ambient operational video for hero banner
│   ├── logo.jpeg                         # Official brand logo asset
│   ├── impact_debris.png                 # Debris removal capability showcase image asset
│   ├── impact_texas.png                  # Disaster response field deployment image asset
│   ├── team_david.png                    # Leadership profile photo: David Inferno (Managing Principal)
│   ├── team_marcus.png                   # Leadership profile photo: Marcus Vance (Director of Federal Services)
│   └── team_sarah.png                    # Leadership profile photo: Sarah Jenkins (VP of Emergency Logistics)
│
├── proxy.ts                              # Edge Middleware / Proxy checking Supabase authentication and attaching `X-Admin-Auth` headers
├── next.config.ts                        # Next.js config enforcing Content Security Policy (CSP), HSTS, frame options, and dev origins
├── postcss.config.mjs                    # PostCSS processor configuration loading Tailwind CSS v4
├── tsconfig.json                         # TypeScript compiler configuration with paths alias setup (`@/*`)
├── package.json                          # Dependencies, scripts (`dev`, `build`, `start`, `lint`), and framework versions
└── types.d.ts                            # Centralized master domain TypeScript interfaces (500+ lines of strict type contracts)
```

---

## 3. Detailed End-to-End System Workflows & Data Flows

### 3.1 Global Request Lifecycle & Edge Security Proxy Workflow

```
[ Incoming User / Client Request ]
               │
               ▼
┌──────────────────────────────────────────────┐
│             proxy.ts (Middleware)            │
│  - Refreshes Supabase session via Cookies     │
│  - Intercepts `/admin`, `/api`, `/auth`      │
│  - Inspects user auth & email confirmation    │
│  - Appends security header: X-Admin-Auth      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           next.config.ts Headers             │
│  - Injects Content-Security-Policy (CSP)     │
│  - Strict-Transport-Security (HSTS 2-Year)   │
│  - X-Frame-Options: DENY                      │
│  - X-Content-Type-Options: nosniff           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│         app/layout.tsx (Root Layout)         │
│  - Loads Outfit, Space Grotesk & JetBrains   │
│  - Renders Global CSS Canvas & Spotlight     │
│  - Mounts TrackerAlert, Navbar, Footer, Chat │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
             [ Target Page Rendered ]
```

1. **Request Interception**: Every incoming HTTP request passes through `proxy.ts`.
2. **Session Verification**: The proxy instantiates `createServerClient` from `@supabase/ssr`, accessing browser cookies to verify if the user possesses a valid, email-confirmed Supabase Auth session.
3. **Security Flagging**: If a request targets `/admin/*` without an active session, `proxy.ts` attaches `X-Admin-Auth: Unauthenticated`, preventing downstream access to restricted assets.
4. **Header Injection**: Next.js automatically applies strict security headers defined in `next.config.ts`, including CSP rules allowing trusted connections to Supabase and NOAA hosts.
5. **DOM Assembly**: `app/layout.tsx` wraps the requested page segment, injecting Google Fonts via CSS variables, rendering global ambient spotlights, and mounting persistent components (`Navbar`, `Footer`, `TrackerAlert`, `Chatbot`).

---

### 3.2 Live NOAA Hurricane & Emergency Weather GIS Intelligence Workflow

```
[ Browser / Tracker Dashboard ]
       │
       ├──────────────────────────────────────────┐
       │ (Polling GET /api/tracker/storms)        │
       ▼                                          ▼
┌────────────────────────────────┐   ┌────────────────────────────────┐
│ app/api/tracker/storms/route.ts│   │ app/api/tracker/disturbances/ │
└──────────────┬─────────────────┘   └──────────────┬─────────────────┘
               │                                    │
               ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       lib/nhc/repository.ts                          │
│  - Checks 45-Second In-Memory Cache                                 │
│  - If stale: Calls lib/nhc/apiService.ts                            │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      lib/nhc/apiService.ts                          │
│  1. Fetches https://www.nhc.noaa.gov/CurrentStorms.json            │
│  2. Downloads active storm .kmz archive payload                      │
│  3. Uses `AdmZip` to extract .kml spatial tracking data              │
│  4. Queries NOAA MapServer REST endpoints for Watch/Warning polygons│
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Data Normalization                            │
│  - Calculates storm category (TD, TS, Cat1-Cat5) via wind speeds    │
│  - Constructs forecast track vectors & historical coordinates       │
│  - Aggregates Overview Metrics (Hurricanes count, TS count, etc.)   │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Client Component Render                        │
│  - `StormOverviewCards.tsx`: Displays live counts & severity badges │
│  - `TrackerMap.tsx`: Renders Leaflet GIS map with storm icons,      │
│     historical line tracks, forecast cones, and alert polygons     │
│  - GeoJSON / CSV Export: Enables raw geospatial download            │
└─────────────────────────────────────────────────────────────────────┘
```

1. **Trigger & Cache Layer**: When a user accesses `/tracker`, `TrackerMap.tsx` and `StormOverviewCards.tsx` issue requests to `/api/tracker/storms` and `/api/tracker/disturbances`. `lib/nhc/repository.ts` checks its 45-second cache to prevent NOAA rate-limiting.
2. **External Retrieval**: On cache expiration, `lib/nhc/apiService.ts` fetches `CurrentStorms.json` directly from NOAA.
3. **GIS Extraction**: For each active storm, the server downloads the official `.kmz` GIS bundle. `AdmZip` unzips the archive in memory, parsing the contained XML/KML coordinate elements into structured forecast points and historical track lines.
4. **MapServer Integration**: The service queries NOAA’s Esri MapServer REST API (`https://mapservices.weather.noaa.gov/...`) to fetch active Tropical Storm/Hurricane Watch & Warning polygons in GeoJSON format.
5. **Client Presentation**: The normalized telemetry powers `TrackerMap.tsx` (rendering dynamic Leaflet markers and polyline layers) and enables instant export to GeoJSON or CSV via helper utilities in `lib/nhc/repository.ts`.

---

### 3.3 Interactive Consultation Scheduler & Multi-Calendar Booking Sync Workflow

```
[ User Selects Date & Time Slot on /calendar ]
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│      GET /api/bookings/slots?date=YYYY-MM-DD     │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│               lib/calendarSync.ts                │
│  - Fetches Supabase `booking_slots` for date     │
│  - Queries Google Calendar FreeBusy API          │
│  - Queries Microsoft Graph Outlook API           │
│  - Filters out external busy windows real-time   │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
[ Client Displays Verified Available Slots ]
                       │
 [ User Fills Form & Clicks "Confirm Consultation" ]
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│             POST /api/bookings                   │
│  Payload: { slot_id, full_name, email, ... }     │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│            Supabase Database Transaction         │
│  1. Check slot `is_available == true`            │
│  2. Atomically update slot `is_available = false` │
│  3. Insert record into `bookings` table          │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│       lib/email/sendBookingConfirmation.ts       │
│  - Sends HTML email via Resend API               │
│  - Fallback: Logs event to `audit_logs` if mail  │
│    delivery encounters network glitches          │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
[ UI Shows Confirmation Modal & Calendar Invite (.ics) ]
```

1. **Availability Aggregation**: Upon date selection on `/calendar`, the portal invokes `/api/bookings/slots`. `lib/calendarSync.ts` queries the Supabase database alongside external Google Calendar (`googleapis.com/calendar/v3/freeBusy`) and Microsoft Graph Outlook (`graph.microsoft.com/v1.0/me/calendar/getSchedule`) APIs, subtracting external busy blocks from available slots.
2. **Slot Selection**: The user selects an open time window and submits their corporate/agency contact information.
3. **Atomic DB Reservation**: `POST /api/bookings` verifies that `is_available` is still `true`. It executes an atomic update, marking `is_available = false` and creating a new record in the `bookings` table.
4. **Email Confirmation**: Upon successful database insertion, `sendBookingConfirmation.ts` triggers an automated email via Resend containing consultation details, meeting links, and calendar invitation attachments.

---

### 3.4 SBA 8(a) & Certification Eligibility Assessment Wizard Workflow

```
[ User Begins Wizard on /quiz ]
               │
               ▼
┌──────────────────────────────────────────────────┐
│               lib/quizQuestions.ts               │
│  - Step 1: Business Ownership (>= 51% Citizen)   │
│  - Step 2: Net Worth Audit (< $850k threshold)   │
│  - Step 3: Operational History (>= 2 Years)      │
│  - Step 4: Primary NAICS Code Selection          │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│             Real-Time Score Calculation          │
│  - Evaluates weighted values across answers      │
│  - Categorizes result: Eligible, Conditional,     │
│    or Ineligible                                 │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Lead Capture & Storage              │
│  - Saves assessment payload to Supabase `leads`   │
│  - Syncs state with `utils/dataStore.ts`         │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
[ Renders Actionable Roadmap & Consultation CTA ]
```

1. **Guided Assessment**: The user progresses through an interactive multi-step questionnaire defined in `lib/quizQuestions.ts`, answering questions regarding socio-economic status, personal net worth, corporate ownership, and revenue history.
2. **Real-Time Scoring Algorithm**: As answers are provided, the wizard calculates a readiness percentage.
3. **Lead Capture**: Before rendering the full diagnostic report, the form captures the user's name, email, and organization, saving the submission to the `leads` table in Supabase.
4. **Customized Action Plan**: The output screen provides a tailored roadmap outlining exact steps to achieve SBA 8(a), HUBZone, or SDVOSB certification.

---

### 3.5 CMS Administration & Lead Portal Workflow

```
[ Admin Navigates to /admin ]
               │
               ▼
┌──────────────────────────────────────────────────┐
│          proxy.ts Authentication Check           │
│  - Verifies Supabase session cookie & role       │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│           app/admin/page.tsx UI Tabs             │
│  ├── Tab 1: Submissions & Leads Management       │
│  ├── Tab 2: Consultation Bookings Inspector      │
│  ├── Tab 3: Content CMS (Services, Team, News)   │
│  └── Tab 4: Site Hero & Banner Settings          │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│                CRUD Operations                   │
│  - Create / Edit / Publish / Archive records     │
│  - Reads/Writes to Supabase database tables      │
│  - Auto-syncs with `utils/dataStore.ts`          │
└──────────────────────────────────────────────────┘
```

1. **Authentication Enforcement**: Navigating to `/admin` triggers `proxy.ts`, which enforces valid Supabase authentication.
2. **Dashboard Management**: Authorized administrators access tabs to inspect inbound leads from the certification quiz, consultation requests from the scheduler, and job applications.
3. **Live CMS Editing**: Admins can edit team member profiles, update capability statements, post news articles, and alter hero banner messaging.
4. **Dual Persistence**: Data edits write directly to Supabase tables while keeping `utils/dataStore.ts` in sync for immediate client-side UI updating.

---

### 3.6 AI Chatbot Knowledge Assistant Workflow

```
[ User Types Prompt in Chatbot Widget ]
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│              components/Chatbot.tsx              │
│  - Captures query string                         │
│  - Checks against PRESETS in `lib/chatbotData.ts`│
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Keyword & Vector Match              │
│  - Matches terms against `mockKnowledgeBase`     │
│  - Evaluates SBA 8(a), FEMA, DCAA, SAM.gov topics│
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Response Generation                 │
│  - Formats rich answer string                    │
│  - Appends actionable links (e.g. /contact)      │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
[ Animated Chat Bubble Rendered with Action Buttons ]
```

1. **User Interaction**: Users click the floating chatbot button on any page, selecting a preset prompt or typing a custom question.
2. **Knowledge Resolution**: The engine scans the knowledge base in `lib/chatbotData.ts` for matching keywords (e.g., "8(a)", "FEMA", "DCAA", "SAM.gov").
3. **Response Assembly**: The component returns an authoritative answer formatted with markdown links directing the user to relevant internal pages (such as `/services`, `/quiz`, or `/calendar`).

---

### 3.7 Security, Rate Limiting & Input Sanitization Pipeline

```
[ User Input / API Submission ]
               │
               ▼
┌──────────────────────────────────────────────────┐
│           lib/security/rateLimit.ts              │
│  - `checkRateLimit(key, maxHits, windowMs)`      │
│  - Enforces sliding window request limits        │
│  - Returns lockout status if exceeded            │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│           lib/security/sanitize.ts               │
│  - `sanitizeInput()`: Escapes HTML tags           │
│  - `sanitizeText()`: Removes scripts & iframes   │
│  - `validateRedirectUrl()`: Checks safe paths    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│            lib/security/logger.ts                │
│  - `logSecurityEvent()`: Writes JSON audit logs  │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
[ Sanitized Payload Passed to DB / Response ]
```

1. **Rate Limiting**: Before processing form submissions or API requests, `checkRateLimit()` checks the caller's identifier against an in-memory sliding window store (defaulting to 5 hits per 15 minutes).
2. **Input Sanitization**: Form inputs pass through `sanitizeInput()` and `sanitizeText()` to escape HTML tags (`<`, `>`, `&`, `"`, `'`) and strip malicious scripts (`<script>`, `javascript:` protocols).
3. **Redirect Protection**: URL redirects pass through `validateRedirectUrl()` to prevent Open Redirect attacks by validating that target strings begin with a single `/`.
4. **Audit Logging**: Security events and validation exceptions are formatted as structured JSON logs via `logger.ts`.

---

## 4. Comprehensive Data Models & Database Architecture

The application utilizes PostgreSQL on Supabase, supplemented by `utils/dataStore.ts` for LocalStorage sync and fallback state management.

### Key Database Tables Overview

| Table Name | Primary Key | Description & Role | Key Fields |
| :--- | :--- | :--- | :--- |
| `profiles` | `id` (uuid) | Extends `auth.users` for authenticated user accounts. | `full_name`, `role` ('visitor' \| 'admin' \| 'super_admin'), `avatar_url` |
| `admin_audit_log` | `id` (uuid) | Audit trail logging administrative actions. | `admin_id`, `action`, `table_name`, `previous_data`, `new_data`, `diff` |
| `site_hero` | `id` (uuid) | Homepage hero banner messaging and media assets. | `eyebrow`, `headline_main`, `headline_gradient`, `video_url`, `fallback_image_url` |
| `site_stats` | `id` (uuid) | Stat counter numbers displayed across the site. | `label`, `value`, `suffix`, `display_order` |
| `testimonials` | `id` (uuid) | Verified client reviews and star ratings. | `author_name`, `author_title`, `organization`, `rating`, `content`, `image_url` |
| `services` | `id` (uuid) | Core service offerings showcased on `/services`. | `num`, `badge`, `title`, `headline`, `desc`, `caps` (jsonb), `ideal_for` (jsonb) |
| `team_members` | `id` (uuid) | Executive leadership team profiles. | `name`, `role`, `bio`, `image_url`, `social_links` (jsonb) |
| `news_articles` | `id` (uuid) | News, press releases, and articles. | `slug`, `title`, `category`, `summary`, `content`, `published_date`, `author` |
| `job_listings` | `id` (uuid) | Careers page open job postings. | `title`, `department`, `location`, `type`, `description`, `responsibilities` (jsonb) |
| `faqs` | `id` (uuid) | FAQ questions and answers by category. | `question`, `answer`, `category`, `status` |
| `booking_slots` | `id` (uuid) | Consultation calendar time slots. | `start_time`, `end_time`, `is_available`, `timezone` |
| `bookings` | `id` (uuid) | Reserved consultation appointments. | `slot_id`, `full_name`, `email`, `company`, `phone`, `meeting_type`, `status` |
| `leads` | `id` (uuid) | Contact form and quiz submission leads. | `full_name`, `email`, `company`, `phone`, `source`, `score`, `metadata` (jsonb) |

---

## 5. Developer Guide & Operational Runbook

### Environment Variables Setup (`.env.local`)

To run the application locally or deploy to production, create a `.env.local` file containing:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Transactional Email (Resend)
RESEND_API_KEY=re_123456789_your_resend_key

# External Calendar Synchronization (Optional)
GOOGLE_CALENDAR_API_KEY=your-google-calendar-api-key
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
OUTLOOK_GRAPH_ACCESS_TOKEN=your-microsoft-graph-bearer-token
OUTLOOK_USER_EMAIL=consulting@infernogroup.com
```

### CLI Development Commands

```bash
# 1. Install all dependencies
npm install

# 2. Launch local Next.js development server
npm run dev

# 3. Compile production build & run TypeScript type checks
npm run build

# 4. Start production server
npm run start

# 5. Run ESLint code quality checks
npm run lint
```

---

*Document created for **The Inferno Group LLC**. Maintained by the Engineering & Architecture Team.*
