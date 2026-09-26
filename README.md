# 🌍 TravelUZ - B2B SaaS Platform for Tour Agencies

TravelUZ is an enterprise-grade B2B SaaS platform for tour agencies and travel operators. It equips agencies with AI-powered day-by-day itinerary generators, multi-tenant agency management, shareable client portals, CRM lead pipelines, Telegram bot notifications, and branded PDF brochure exports.

---

## 🏗️ Architecture & Stack

### Backend (`/backend`)
- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL 16 + SQLAlchemy 2.0 (asyncio + asyncpg) + Alembic migrations
- **Authentication**: JWT access & refresh tokens, password hashing via bcrypt
- **Security**: Server-side Anthropic Claude 3.5 Sonnet proxy (zero client-side API key exposure), Rate limiting via slowapi, CORS middleware, Fernet AES token encryption
- **PDF Engine**: ReportLab PDF generator
- **Telegram Bot**: Background worker service (`app/telegram_worker.py`) for real-time lead alerts

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS with modern Glassmorphism, CSS variables, dark/light themes
- **Graphics & Motion**: Three.js / React Three Fiber / GSAP 3D Interactive Globe (`GlobeScene.tsx`), Framer Motion
- **Analytics**: Recharts data visualization library

---

## 🌟 Key Features

1. **AI Itinerary Generator (Server-Side)**: Generates structured, day-by-day travel itineraries via Claude 3.5 Sonnet without exposing API keys.
2. **Agency Onboarding Flow**: Multi-step registration wizard creating multi-tenant Agency & AgencyMember records with subscription tier selection (Starter, Pro, Enterprise).
3. **Shareable Client Itinerary Links (`/trip/{share_token}`)**: Public, branded read-only itinerary page for clients with interactive "Book / Request Quote" lead submission.
4. **CRM Lead Pipeline**: Kanban board (`New` -> `Contacted` -> `Negotiating` -> `Won` -> `Lost`) for agency staff with direct "Confirm & Create Booking" workflow.
5. **Telegram Bot Integration**: Instant Telegram alerts delivered to agency staff chats when clients request quotes on public links.
6. **Branded PDF Export**: Downloadable PDF itineraries with agency branding, day-by-day schedules, pricing, and travel tips.
7. **Agency Analytics Dashboard**: Interactive charts tracking lead conversion rates, revenue by month, inquiries timeline, and top destinations.

---

## Run and deploy

The site is a Next.js app in this folder. It does not use a backend or environment variables. Trips, sign-in, and the admin panel are stored in the browser.

```bash
npm install
npm run dev
```

Open http://localhost:3000

- Website: `/`
- Traveler app: `/dashboard` — `traveler@traveluz.com` / `travel123`
- Admin panel: `/admin` — `admin@traveluz.com` / `admin123`
- Sample shared trip: `/trip/silk-road`

Deploy on Vercel by importing this repository. The build command is `npm run build`. No environment variables are required.

```bash
npm run build
npm start
```


---

## 🧪 API Verification & Testing Workflow

1. **Register User & Agency**: Call `POST /api/v1/auth/register` or complete Onboarding wizard.
2. **Generate AI Itinerary**: Call `POST /api/v1/trips/generate` with destination parameters.
3. **View Public Shareable Link**: Open `/trip/{share_token}` in browser.
4. **Submit Client Inquiry**: Click "Request Quote / Book Trip" on the public page.
5. **Manage CRM Pipeline**: Open Agency Dashboard `CRM Leads` tab to transition lead status and click "Confirm Booking".
6. **Export PDF Brochure**: Click "PDF Brochure" on itinerary view to download branded PDF.
