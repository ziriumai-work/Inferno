# The Inferno Group LLC (TIG) — External Services & Credentials Guide

This document details all third-party services, APIs, databases, authentication mechanisms, and environment variables used across the **The Inferno Group LLC** web platform. It includes direct links to official service websites, developer dashboards, setup steps, and security guidelines.

---

## 1. Quick Reference & Services Directory

| Service                       | Category                         | Environment Variables                                                                             | Official Website                                                             | Developer Portal / Dashboard                                 |
| :---------------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------- | :----------------------------------------------------------- |
| **Supabase**                  | Database, Auth & CMS Storage     | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`                                     | [supabase.com](https://supabase.com)                                         | [supabase.com/dashboard](https://supabase.com/dashboard)     |
| **Resend**                    | Transactional Email Delivery     | `RESEND_API_KEY`<br>`RESEND_FROM_EMAIL`<br>`ADMIN_NOTIFICATION_EMAIL`                             | [resend.com](https://resend.com)                                             | [resend.com/overview](https://resend.com/overview)           |
| **Google Cloud (Calendar)**   | Calendar Sync & Free/Busy API    | `GOOGLE_CALENDAR_API_KEY`<br>`GOOGLE_CALENDAR_ID`<br>`GOOGLE_CLIENT_ID`<br>`GOOGLE_CLIENT_SECRET` | [cloud.google.com](https://cloud.google.com)                                 | [console.cloud.google.com](https://console.cloud.google.com) |
| **Microsoft Graph (Outlook)** | Enterprise Calendar Sync         | `OUTLOOK_GRAPH_ACCESS_TOKEN`<br>`OUTLOOK_USER_EMAIL`                                              | [microsoft.com/microsoft-365](https://www.microsoft.com/en-us/microsoft-365) | [portal.azure.com](https://portal.azure.com)                 |
| **NOAA / NHC Weather API**    | Real-Time Hurricane Intelligence | _No API key required (Public US Gov)_                                                             | [nhc.noaa.gov](https://www.nhc.noaa.gov)                                     | [api.weather.gov](https://api.weather.gov)                   |
| **Admin CMS Auth**            | Application Control Room         | `NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL`<br>`NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD`                         | Local / Supabase Auth                                                        | `/infernollc/admin`                                          |
| **Canonical Domain**          | SEO & Metadata                   | `NEXT_PUBLIC_SITE_URL`                                                                            | [theinfernogroup.com](https://theinfernogroup.com)                           | Vercel / Cloudflare DNS                                      |

---

## 2. In-Depth Service Configurations

### 1. Supabase (Backend Database & Authentication)

- **Official Website:** [https://supabase.com](https://supabase.com)
- **Console / Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Documentation:** [https://supabase.com/docs](https://supabase.com/docs)

#### Purpose in Application

- **Content Management System (CMS):** Powers the `settings` table where public site definitions (Hero banner, About narrative, Services directory, FAQs, Community initiatives, and Contracting solicitations) are synchronized between `localStorage` and the database via `/api/cms`.
- **Administrative Authentication:** Authenticates authorized staff into the Admin Control Room at `/infernollc/admin`.
- **Lead & Consultation Storage:** Stores submitted proposals and booking records in the `leads` and `bookings` tables.
- **Middleware Session Management:** Validates and refreshes authentication tokens in [proxy.ts](file:///Users/muhammadrafiq/Desktop/Ziriumai/projects/The Inferno Group LLC - Services/proxy.ts) and [lib/supabase/server.ts](file:///Users/muhammadrafiq/Desktop/Ziriumai/projects/The Inferno Group LLC - Services/lib/supabase/server.ts).

#### Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

#### How to Obtain Keys

1. Create or log in to your account at [supabase.com](https://supabase.com).
2. Create a new project (e.g. `the-inferno-group`).
3. Navigate to **Project Settings** -> **API**.
4. Copy the **Project URL** and paste it into `NEXT_PUBLIC_SUPABASE_URL`.
5. Under **Project API keys**, copy the `anon` / `public` key and paste it into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

### 2. Resend (Transactional Email Delivery)

- **Official Website:** [https://resend.com](https://resend.com)
- **Dashboard:** [https://resend.com/overview](https://resend.com/overview)
- **API Documentation:** [https://resend.com/docs](https://resend.com/docs)

#### Purpose in Application

- **Client Booking Confirmations:** Dispatches styled HTML confirmation emails whenever a client schedules an operational consultation via `/calendar`.
- **ICS Calendar Attachments:** Generates and attaches `.ics` iCalendar invites so clients can automatically add meetings to Outlook, Google Calendar, or Apple Calendar.
- **Internal Operational Alerts:** Forwards new leads and booking requests directly to the operations desk (`ADMIN_NOTIFICATION_EMAIL`).

#### Variables Required

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="The Inferno Group <onboarding@resend.dev>" # Or verified domain: operations@theinfernogroup.com
ADMIN_NOTIFICATION_EMAIL="rafkhan9323@gmail.com"
```

#### How to Obtain Keys & Verify Domain

1. Register at [resend.com](https://resend.com).
2. Go to **API Keys** -> click **Create API Key**.
3. Choose **Full Access** or **Sending Access** and paste the key (`re_...`) into `RESEND_API_KEY`.
4. _(Production Recommended)_ Go to **Domains** -> click **Add Domain** (`theinfernogroup.com`). Add the provided DKIM and SPF records in your DNS provider (e.g., Cloudflare, GoDaddy). Once verified, update `RESEND_FROM_EMAIL` to `The Inferno Group <operations@theinfernogroup.com>`.

---

### 3. Google Cloud Console & Google Calendar API

- **Official Website:** [https://cloud.google.com](https://cloud.google.com)
- **Google Cloud Console:** [https://console.cloud.google.com](https://console.cloud.google.com)
- **Calendar API Documentation:** [https://developers.google.com/calendar](https://developers.google.com/calendar)

#### Purpose in Application

- **Real-Time Free/Busy Slot Detection:** Queries Google Calendar's `freeBusy` REST API via `/api/bookings/slots` to dynamically block out scheduled times and prevent double-booking.
- **1-Click Calendar Add:** Provides pre-filled event generation links for Google Calendar users upon booking completion.
- **Code Reference:** Implemented in [lib/calendarSync.ts](file:///Users/muhammadrafiq/Desktop/Ziriumai/projects/The Inferno Group LLC - Services/lib/calendarSync.ts) and [lib/calendarUtils.ts](file:///Users/muhammadrafiq/Desktop/Ziriumai/projects/The Inferno Group LLC - Services/lib/calendarUtils.ts).

#### Variables Required

```env
GOOGLE_CALENDAR_API_KEY="AIzaSy..."
GOOGLE_CALENDAR_ID="primary" # Or specific calendar email address
GOOGLE_CLIENT_ID="89916938013-...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."
```

#### How to Obtain Keys

1. Open [console.cloud.google.com](https://console.cloud.google.com) and create a project (e.g., `Inferno-Group-Web`).
2. Go to **APIs & Services** -> **Library** -> Search for **Google Calendar API** -> Click **Enable**.
3. Go to **APIs & Services** -> **Credentials** -> Click **Create Credentials** -> **API Key**. Copy this into `GOOGLE_CALENDAR_API_KEY`.
4. _(Optional for Full Two-Way OAuth Sync)_:
   - Click **Create Credentials** -> **OAuth client ID** -> Select **Web application**.
   - Add Authorized redirect URIs: `https://theinfernogroup.com/api/bookings/sync`.
   - Copy Client ID and Client Secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
5. Under Google Calendar settings, ensure the target calendar is shared with the API identity or set to public free/busy viewing.

---

### 4. Microsoft 365 / Microsoft Graph API (Outlook Calendar)

- **Official Website:** [https://www.microsoft.com/microsoft-365](https://www.microsoft.com/en-us/microsoft-365)
- **Azure Portal / Entra ID:** [https://portal.azure.com](https://portal.azure.com)
- **Microsoft Graph Docs:** [https://developer.microsoft.com/en-us/graph](https://developer.microsoft.com/en-us/graph)

#### Purpose in Application

- **Enterprise Outlook Availability:** Calls the Microsoft Graph `getSchedule` endpoint (`https://graph.microsoft.com/v1.0/users/{email}/calendar/getSchedule`) to inspect corporate availability.
- **Outlook Web Deep-Linking:** Generates 1-click compose URLs (`https://outlook.office.com/calendar/0/deeplink/compose?...`).
- **Code Reference:** Implemented in [lib/calendarSync.ts](file:///Users/muhammadrafiq/Desktop/Ziriumai/projects/The Inferno Group LLC - Services/lib/calendarSync.ts).

#### Variables Required

```env
OUTLOOK_GRAPH_ACCESS_TOKEN="" # Microsoft Graph OAuth Bearer Token
OUTLOOK_USER_EMAIL=""        # Corporate mailbox (e.g. operations@theinfernogroup.com)
```

#### How to Obtain Keys

1. Go to [portal.azure.com](https://portal.azure.com) -> Navigate to **Microsoft Entra ID** (formerly Azure AD).
2. Go to **App registrations** -> Click **New registration** (e.g. `Inferno-Calendar-Sync`).
3. Under **API permissions**, add **Microsoft Graph** -> Application or Delegated permission: `Calendars.Read` or `Calendars.ReadWrite`.
4. Generate a client secret under **Certificates & secrets** and exchange it for an access token or configure continuous token refresh.

---

### 5. NOAA / National Hurricane Center & National Weather Service (NWS)

- **National Hurricane Center:** [https://www.nhc.noaa.gov](https://www.nhc.noaa.gov)
- **National Weather Service API:** [https://api.weather.gov](https://api.weather.gov)
- **NOAA MapServices GIS Server:** [https://mapservices.weather.noaa.gov](https://mapservices.weather.noaa.gov)

#### Purpose in Application

- **Live Tropical Weather Tracking:** Powers the interactive Hurricane Tracker at `/tracker`.
- **Data Feeds Used:**
  - `https://www.nhc.noaa.gov/CurrentStorms.json`: Live tropical storms and disturbance inventories.
  - `https://mapservices.weather.noaa.gov/tropical/.../MapServer`: GIS forecast tracks, forecast cones of uncertainty, and wind speed probabilities.
  - `https://api.weather.gov/alerts/active`: Real-time hurricane and tropical storm warnings and watches for US coastlines.
- **Authentication:** **No private API keys needed**. Free public US Government scientific service. Requires a valid `User-Agent` HTTP header identifying the application (e.g. `TheInfernoGroup/1.0 (ops@theinfernogroup.com)`).

---

### 6. Admin Dashboard Authentication & Control Room

- **Access Route:** `/infernollc/admin`
- **Code Reference:** [app/infernollc/admin/page.tsx](file:///Users/muhammadrafiq/Desktop/Ziriumai/projects/The Inferno Group LLC - Services/app/infernollc/admin/page.tsx)

#### Purpose in Application

- Allows administrators to manage CMS content, upload and reorder Kickball tournament photos, change the Scholarship presentation video, modify service listings, publish bulletins, view incoming leads, and review booking slots.

#### Variables Required

```env
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=inferngroup@example.com
NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD=Infernot123..
```

> [!WARNING]
> Before deploying to a public production environment, change the default admin email and password in your hosting platform (Vercel, Netlify, or Railway) or configure authenticated users directly inside the Supabase Auth user directory.

---

#### Variables Required

```env
NEXT_PUBLIC_SITE_URL=https://theinfernogroup.com
```

- Sets absolute canonical tags for search engines, XML sitemap generation, and Open Graph card image URLs.

---

## 3. Complete Environment Template (`.env.example`)

Copy and paste the template below into your local `.env.local` or hosting provider environment variables dashboard:

```bash
# ── SUPABASE (DATABASE & AUTH) ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...

# ── ADMIN CMS ACCESS ──
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=admin@theinfernogroup.com
NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD=YourStrongPasswordHere!

# ── RESEND (TRANSACTIONAL EMAIL) ──
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL="The Inferno Group <onboarding@resend.dev>"
ADMIN_NOTIFICATION_EMAIL=operations@theinfernogroup.com

# ── GOOGLE CLOUD (CALENDAR FREE/BUSY API) ──
GOOGLE_CALENDAR_API_KEY=AIzaSy...
GOOGLE_CALENDAR_ID=primary
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret

# ── MICROSOFT GRAPH (OUTLOOK ENTERPRISE CALENDAR) ──
OUTLOOK_GRAPH_ACCESS_TOKEN=
OUTLOOK_USER_EMAIL=

# ── CANONICAL DEPLOYMENT ──
NEXT_PUBLIC_SITE_URL=https://theinfernogroup.com
```

---

## 4. Security & Production Checklist

- [ ] **Rotate Default Passwords:** Never use the development default credentials (`inferngroup@example.com`) in production.
- [ ] **Verify Sending Domain in Resend:** Replace `onboarding@resend.dev` with a verified company domain (`@theinfernogroup.com`) to avoid spam filters.
- [ ] **Restrict Google API Key:** In Google Cloud Console, restrict `GOOGLE_CALENDAR_API_KEY` to **HTTP referrers** (e.g. `https://theinfernogroup.com/*`) and scope it strictly to the **Google Calendar API**.
- [ ] **Supabase Row-Level Security (RLS):** Ensure tables containing client information (`leads`, `bookings`) have RLS enabled so public anon clients cannot read other users' sensitive contact data.
- [ ] **Never Commit `.env.local`:** Ensure `.env.local` remains in `.gitignore`.
