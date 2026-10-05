# 🎨 TripMind — UI/UX Specification & Design System Guide

> **Document Status**: APPROVED SPECIFICATION  
> **Role**: AGENT 2: TRIPMIND PRODUCT ARCHITECT + SENIOR UI/UX DESIGNER  
> **Target Version**: TripMind 2.0 (Milestone 1 — Traveler Experience & Core AI Planning Loop)  
> **Companion Document**: [`docs/product/TRIPMIND_PRODUCT_ARCHITECTURE.md`](file:///Users/shoabbosovamuslima/Desktop/Travel%20uz/docs/product/TRIPMIND_PRODUCT_ARCHITECTURE.md)  
> **Operating Constraint**: Strict UI/UX Specification Phase — Zero Code Modification  

---

## Table of Contents
1. [UX Vision & Design Principles](#1-ux-vision--design-principles)
2. [Information Architecture & Screen Hierarchy](#2-information-architecture--screen-hierarchy)
3. [User Journeys](#3-user-journeys)
4. [Traveler Dashboard UX](#4-traveler-dashboard-ux)
5. [AI Planner UX (Filter-First & Conversational Tradeoffs)](#5-ai-planner-ux)
6. [Trip Workspace UX (List, Calendar, Map)](#6-trip-workspace-ux)
7. [Ready Tours UX (Agency Match Engine)](#7-ready-tours-ux)
8. [Side-by-Side Comparison UX](#8-side-by-side-comparison-ux)
9. [Travel AI UX (In-Trip Contextual Adaptation)](#9-travel-ai-ux)
10. [Saved Items UX (Multi-Entity Vault)](#10-saved-items-ux)
11. [Adaptive Global City Guide UX](#11-adaptive-global-city-guide-ux)
12. [Navigation Systems (Desktop & Mobile)](#12-navigation-systems)
13. [Design System & Visual Language](#13-design-system--visual-language)
14. [Component Library Specifications](#14-component-library-specifications)
15. [Responsive Rules & Breakpoints](#15-responsive-rules--breakpoints)
16. [State Handlers: Empty, Loading, and Error States](#16-state-handlers)
17. [Accessibility (A11y) Requirements](#17-accessibility-requirements)
18. [UX Acceptance Criteria & Validation Matrix](#18-ux-acceptance-criteria)

---

## 1. UX Vision & Design Principles

TripMind creates an inspiring, trustworthy, and frictionless travel experience. The design avoids overwhelming users with dense walls of text, gimmick animations, or washed-out glassmorphism. Instead, it offers a **clean, spacious, visual, mobile-first, and map-centric** environment.

### Core Design Principles:
1. **Trust Over Hype**: Travel planning involves significant time and money. Every recommendation must display verified proof, realistic pricing, explicit operating hours, and transparent distinctions between vetted database data and AI heuristics.
2. **Restrained Modern Aesthetics**: Clean geometric cards, crisp 1px borders, subtle depth, and intentional whitespace. Opaque, high-contrast surfaces take precedence over blurry, illegible glass effects.
3. **Map-Centric Pacing**: Travelers navigate geographically. Every schedule item connects directly to map coordinates, walking/transit times, and neighborhood clusters.
4. **Mobile-First Realities**: While itineraries are drafted on desktops or tablets, they are executed on smartphones while walking down bustling streets. All key controls must be thumb-accessible within reach zones.
5. **Progressive Disclosure**: High-level summaries first, granular details on demand. Users should never feel trapped in endless forms.

---

## 2. Information Architecture & Screen Hierarchy

```
TRIPMIND SCREEN FLOW & HIERARCHY
│
├── 1. DISCOVERY LAYER
│   ├── Home Dashboard (Global Globe, Live Trip Status, Trending Stops)
│   ├── Explore Hub (Country/City Guides, Adaptive Transit & Cultural Specs)
│   └── Community Portal (Shared Traveler Trips, Guide Directory)
│
├── 2. PLANNING & SYNTHESIS LAYER
│   ├── AI Planner Wizard (Filter-First Inputs: Dates, Party, Budget, Pace)
│   ├── Clarification Drawer (1–3 Contextual Follow-Up Tradeoff Prompts)
│   └── Strategy Selection View (Local Explorer vs Balanced vs Relaxed Premium)
│
├── 3. OPERATIONAL WORKSPACE LAYER
│   ├── Trip Workspace Header (Title, Telemetry, Mode Toggle, Export/Share)
│   ├── Timeline View (Morning / Afternoon / Evening Collapsible Slots)
│   ├── Calendar View (Interactive Time-Blocked Multi-Day Grid)
│   └── Map View (Synchronized Google Maps with Route Polylines & Clustering)
│
├── 4. COMMERCIAL & SELECTION BRIDGE
│   ├── Ready Tours Drawer ("Trips You May Prefer" — 3–4 Vetted Packages)
│   ├── Side-by-Side Comparison Modal (Custom Itinerary vs Agency Tour)
│   └── Agency Direct Lead Modal (Quote Request / Contact Agency Escrow)
│
├── 5. ON-THE-GROUND EXECUTION LAYER
│   ├── Mobile Live Trip Mode (Current Slot Focus, GPS Proximity)
│   └── In-Trip AI Adaptation Drawer ("I'm tired", "Raining", "$40 left", etc.)
│
└── 6. UTILITY & PERSISTENCE
    ├── Universal Saved Vault (Trips, Tours, Hotels, Restaurants, Sights)
    └── Traveler Profile & Global Settings (Currency, Language, Dietary)
```

---

## 3. User Journeys

### Journey 1: The Curious Dreamer to Structured Itinerary
- **Trigger**: Traveler wants to explore Istanbul for 5 days with a friend on a $400 budget.
- **Path**:
  1. Opens TripMind → Taps **AI Planner** in Mobile Bottom Nav (or Desktop Sidebar).
  2. Selects filters: Destination `Istanbul`, 5 Days, 2 Travelers, Budget `$400`, Interests: `Culture + Food`.
  3. AI synthesizes 3 instant tradeoff questions:
     - *Question 1*: "More places or slower trip?" → Traveler selects `[Balanced Pacing]`.
     - *Question 2*: "Street food/cafes or premium restaurants?" → Traveler selects `[Street Food & Cafes]`.
     - *Question 3*: "Walking/public transit or taxi?" → Traveler selects `[Walking & Ferries]`.
  4. AI presents 3 distinct strategy cards. Traveler selects **Local Explorer**.
  5. Workspace immediately opens with 5 days pre-mapped across European & Asian shores.

### Journey 2: The Itinerary Workspace Operator
- **Trigger**: Traveler wants to inspect Day 2 in Samarkand and re-route their afternoon.
- **Path**:
  1. Traveler navigates to **My Trips** → Opens *"Samarkand Silk Road Discovery"*.
  2. Workspace opens in split view: Left side displays Day 2 timeline; right side displays interactive map.
  3. Traveler clicks the Afternoon activity (*Siab Folk Bazaar*). The map smooth-zooms to the bazaar pin and highlights the walking route from the morning site (*Bibi-Khanym*).
  4. Traveler clicks **Add Activity** to insert a 1-hour coffee stop at *Chaykhana Oasis*. The daily budget and time slots automatically recalculate.
  5. Traveler toggles to **Calendar View** to check free time before their evening dinner reservation.

### Journey 3: The Tour Shopper (Ready Tours Bridge)
- **Trigger**: Traveler realizes managing transit and language barriers in Bukhara might be tricky.
- **Path**:
  1. Below the AI Day 3 itinerary, traveler sees a curated banner: **"Trips You May Prefer (3 Agency Packages Match Your Trip)"**.
  2. Clicks **"Compare"** on *Marakanda Tours: 5-Day Silk Road Express ($520/person)*.
  3. Side-by-side modal opens:
     - Left column: DIY Itinerary (Estimated $460 self-spend, self-navigated taxis, unguided sights).
     - Right column: Agency Tour ($520, 4-star boutique hotel, high-speed rail included, licensed historian guide).
  4. Traveler clicks **"Contact Agency"** → Simple 3-field modal sends verified inquiry to agency's CRM Kanban pipeline.

### Journey 4: The In-Trip Real-Time Pivot
- **Trigger**: Traveler is on Day 3 in Paris at 14:30. Sudden heavy downpour begins.
- **Path**:
  1. Traveler opens TripMind on mobile → Active trip banner shows *"Day 3: Montmartre Walking Tour (In Progress)"*.
  2. Traveler taps the floating **In-Trip AI Copilot** → Taps quick prompt: **"It's raining"**.
  3. AI diagnoses the remaining slots (Outdoor Montmartre walk + outdoor cafe).
  4. AI suggests: *"Swap open-air Montmartre walk for the covered passages of Galerie Vivienne and Musee de l'Orangerie (15 min transit via Metro 12)"*.
  5. Traveler taps **[Apply Changes]**. The schedule, map pins, and walking directions update instantly.

---

## 4. Traveler Dashboard UX

The Traveler Dashboard serves as the central hub, balancing inspiring exploration with direct utility.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🧭 TRIPMIND                      [🔍 Search destinations...]   [🇬🇧 EN ▼] [$ USD ▼] [🔔] [👤]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🟢 ACTIVE TRIP COCKPIT (Conditionally displayed when traveling)                             │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📍 CURRENTLY IN ISTANBUL • Day 3 of 5                                                   │ │
│ │ ☀️ 22°C Clear • Next: Ferry to Kadikoy (16:30) • 💰 $142 / $400 Spent                   │ │
│ │ [🗺️ Open Live Workspace]   [⚡ "I'm Tired"]   [🌧️ "It's Raining"]   [🍽️ "Food Near Me"]  │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ 🌍 EXPLORE THE GLOBE & UPCOMING VOYAGES                                                     │
│ ┌───────────────────────────────────────────────┬─────────────────────────────────────────┐ │
│ │                                               │ ✈️ QUICK VOYAGE SETUP                   │ │
│ │                                               │ ┌─────────────────────────────────────┐ │ │
│ │                                               │ │ Destination: Where to?              │ │ │
│ │             3D INTERACTIVE GLOBE              │ │ Dates: Select travel window         │ │ │
│ │             (Three.js / WebGL)                │ │ Travelers: 2 Adults                 │ │ │
│ │                                               │ │ [✨ Launch AI Planner Wizard]        │ │ │
│ │       • Real-time day/night shader            │ └─────────────────────────────────────┘ │ │
│ │       • Pins for bucket list & past trips     │                                         │ │
│ │       • Country hover statistics card         │ 🎒 UPCOMING TRIPS                       │ │
│ │                                               │ • Kyoto & Tokyo (In 24 days)  [View]    │ │
│ │                                               │ • Samarkand Explorer (Draft)   [Edit]   │ │
│ └───────────────────────────────────────────────┴─────────────────────────────────────────┘ │
│                                                                                             │
│ 🔥 TRENDING GLOBAL DESTINATIONS                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────┐ │
│ │ 🖼️ Paris, France     │ │ 🖼️ Samarkand, UZB    │ │ 🖼️ Tokyo, Japan      │ │ 🖼️ Rome, ITA │ │
│ │ Culture • Gastronomy │ │ Silk Road Heritage   │ │ High-Tech & Tradition│ │ Ancient Sights│ │
│ │ From $120/day        │ │ From $45/day         │ │ From $110/day        │ │ From $95/day  │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Layout Specifications:
- **Desktop (>= 1024px)**: 240px fixed left sidebar + sticky 64px top navigation + fluid dual-column discovery grid (3D Globe 60% width, Quick Setup & Upcoming Trips 40% width).
- **Mobile (< 768px)**: Top bar with brand mark, currency selector, and profile avatar. 3D Globe renders in compact 240px viewport. Upcoming trip and quick planner stack into single-column swipeable cards.

---

## 5. AI Planner UX (Filter-First & Conversational Tradeoffs)

The AI Planner rejects unguided prompts. It guides travelers through a 3-step structured funnel:

### Step 1: Filter-First Baseline Setup
A structured, visually engaging wizard:
- **Destination Selector**: Autocomplete with country badges and popular city presets.
- **Date Selector**: Dual-month calendar picker with flexible "I don't have exact dates yet (e.g. 5 days)" toggle.
- **Travelers Counter**: Segmented incrementor (`Solo (1)`, `Couple (2)`, `Family (3-5)`, `Group (6+)`).
- **Budget Bracket**: Dynamic slider showing total and daily per-person allocation in chosen currency.
- **Pacing Selector**:
  - `Leisurely`: 1–2 key highlights per day, extended pauses.
  - `Balanced`: 2–3 highlights with comfortable transition buffers.
  - `Fast-Paced`: 4+ sights per day, early morning starts.
- **Comfort Level**: `Backpacker ($)` | `Boutique Mid-Scale ($$)` | `Luxury Heritage ($$$)`.
- **Interests Multi-Select**: Clickable pills with icons (🏛️ History, 🍲 Food & Wine, 🎨 Art & Museums, 🌿 Nature & Hikes, 🛍️ Markets, 📸 Photography).
- **Food & Dining Preferences**: `Street Food & Markets`, `Traditional Lokantas/Chaykhanas`, `Halal Certified`, `Vegetarian/Vegan`, `Fine Dining`.
- **Transport Preference**: `Walking & Public Transit`, `Taxis & Rideshare`, `Rental Car`, `Private Chauffeur`.

### Step 2: 1–3 Smart Follow-Up Questions (Conversational Calibration)
A focused slide-over drawer or modal that appears before generation:
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ✨ AI TRIPMIND COPILOT: Let's fine-tune your Istanbul voyage                     │
│ Based on your 5-day stay, 2 travelers, and $400 budget, help us balance your trip:│
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. Pacing & Exploration:                                                        │
│    ( ) See maximum highlights across Europe & Asia sides                        │
│    (*) Slower, immersive exploration focused on historic core                   │
│                                                                                 │
│ 2. Dining Style:                                                                │
│    (*) Authentic street food, Simit carts, and historic tea gardens             │
│    ( ) Upscale Bosphorus seafood dining with views                              │
│                                                                                 │
│ 3. Getting Around:                                                              │
│    (*) Scenic public ferries & walking (Budget-friendly & scenic)               │
│    ( ) Taxis & private car (Convenient, but subject to bridge traffic)          │
│                                                                                 │
│ [ Back to Filters ]                               [ ✨ Generate 3 Strategies ]  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Tri-Tier Strategy Selection Cards
The AI outputs three distinct strategies, allowing the user to select the approach that fits their travel philosophy:

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│ 🌿 LOCAL EXPLORER         │ ⚖️ BALANCED (RECOMMENDED)  │ ✨ RELAXED PREMIUM        │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ "Authentic & Budget-Wise" │ "The Curated Standard"    │ "Comfort & Zero Stress"   │
│                           │                           │                           │
│ 💰 Est. Cost: $340 / total│ 💰 Est. Cost: $410 / total│ 💰 Est. Cost: $620 / total│
│ 🚶 Pace: Active Walking   │ 🚶 Pace: Moderate (3 POIs)│ 🚶 Pace: Leisurely (2 POIs│
│ 🚇 Transit: Ferries/Trams │ 🚇 Transit: Transit+Taxis │ 🚗 Transit: Private Taxis │
│ 🍲 Dining: Street Lokantas│ 🍲 Dining: Mix of Bazaars │ 🍲 Dining: Waterfront Res.│
│                           │   & Traditional Taverns   │                           │
│ Key Tradeoff: High walking│ Key Tradeoff: Best balance│ Key Tradeoff: Higher cost,│
│ mileage, zero luxury stops│ of top sites and comfort  │ less spontaneous roaming  │
│                           │                           │                           │
│ [ Select Local Explorer ] │ [ Select Balanced ]       │ [ Select Relaxed Premium ]│
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 6. Trip Workspace UX (List, Calendar, Map)

The Trip Workspace is a responsive, synchronized multi-view environment.

### 6.1 Desktop Workspace Architecture (Split-Screen)
On screens >= 1024px, the workspace uses a synchronized two-panel layout:
- **Left Panel (50% width)**: Scrollable itinerary schedule with Day Tabs, Slot Cards, and inline editing.
- **Right Panel (50% width)**: Sticky Google Maps canvas with geocoded pins, numbered day markers, and transit polylines.

### 6.2 Mobile Workspace Architecture (Stacked Sheet)
On screens < 768px, mobile users toggle between two primary views:
- **Floating View Switcher Pill (Bottom Center)**: `[📋 Schedule (3)]` ⟷ `[🗺️ Map View]`.
- Map View provides an expandable bottom sheet previewing the selected activity. Tapping "Directions" opens native Google Maps / Apple Maps.

### 6.3 Day Slots & Activity Cards

Each day contains structured, collapsible slots:
- **Morning (08:30 – 12:30)**: Key monuments, guided visits, active walking.
- **Lunch Break (12:30 – 14:00)**: Curated food spots near the morning site.
- **Afternoon (14:00 – 17:30)**: Bazaars, artisan workshops, scenic views.
- **Evening / Dinner (17:30 – 21:30)**: Sunset viewpoints, authentic dining, cultural performances.
- **Night Stay**: Hotel node with check-in info and neighborhood advice.

```
ACTIVITY CARD WIREFRAME:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [09:30 AM]  🏛️ ATTRACTION                                    [🛡️ Verified POI]  │
│ Registan Ensemble & Sher-Dor Madrasah                         ⭐ 4.9 (1.2k)     │
│ 📍 Samarkand Historic Center • Open 08:00 – 19:00                               │
│ ⏱️ Recommended: 2.5 hrs • 💰 65,000 UZS ($5.20) per person                     │
│ 💡 Pro-Tip: Enter via Tilakori courtyard for the best morning light.           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🚶 TRANSIT LEG: 12 min walk (950m) through Registan pedestrian park to next stop│
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Tri-View Switcher:
1. **Timeline (List) View**: Sequential vertical feed with collapsible morning/afternoon/evening slots and inline action buttons.
2. **Calendar View**: Hourly time-block grid (08:00 to 22:00) showing dwell times, travel gaps, and overlapping activities.
3. **Map View**: Full-screen interactive map with numbered pins matching day schedule items, category color-coding, and route lines.

---

## 7. Ready Tours UX (Agency Match Engine)

Directly integrated into the itinerary view, the Ready Tours engine suggests commercial tour packages that match the user's destination, duration, and budget.

```
READY TOURS SECTION WIREFRAME:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🎒 TRIPS YOU MAY PREFER                                                         │
│ Love this itinerary but prefer zero logistical stress? 3 vetted agency packages │
│ match your Samarkand route:                                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏷️ MARAKANDA TRAVEL • Verified Silk Road Tour Operator      ⭐ 4.9 (420 rev) │ │
│ │ "Classic Samarkand & Bukhara Heritage Express" — 5 Days / 4 Nights          │ │
│ │ 💰 $540 / traveler (All-Inclusive)                                          │ │
│ │                                                                             │ │
│ │ 🏨 4★ Boutique Heritage Hotels    🚗 High-Speed Afrosiyob Train Included    │ │
│ │ 🍽️ Breakfasts & 3 Feast Dinners   👤 Licensed English Cultural Guide        │ │
│ │                                                                             │ │
│ │ 🛡️ 94% Match: Covers Registan, Siab Bazaar & Shah-i-Zinda with zero hassle. │ │
│ │                                                                             │ │
│ │ [ 📊 Compare Side-by-Side ]                [ 📩 Contact Agency / Quote ]    │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Side-by-Side Comparison UX

When a user clicks "Compare Side-by-Side", a modal opens comparing the self-guided AI plan against the agency package across key decision criteria:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📊 SIDE-BY-SIDE TRIP COMPARISON                                             [X] │
├──────────────────────────────┬────────────────────────┬─────────────────────────┤
│ CRITERIA                     │ YOUR AI DIY ITINERARY  │ MARAKANDA AGENCY TOUR   │
├──────────────────────────────┼────────────────────────┼─────────────────────────┤
│ Total Estimated Cost         │ $460 / person          │ $540 / person           │
│ Accommodation                │ Self-booked hotels     │ 4★ Heritage Boutique    │
│ Transportation               │ Street taxis & walking │ Private AC van + Train  │
│ Sight Tickets                │ Pay at entrance kiosks │ VIP Skip-the-line incl. │
│ Guided Experience            │ Self-guided AI notes   │ Dedicated historian     │
│ Planning Effort              │ High (Self-managed)    │ Zero (Turnkey delivery) │
│ Schedule Flexibility         │ 100% Modifiable        │ Fixed daily milestones  │
│ Booking Security             │ Multiple platforms     │ Escrow via TripMind     │
├──────────────────────────────┼────────────────────────┼─────────────────────────┤
│ ACTIONS                      │ [ Keep My AI Plan ]    │ [ Book Agency Tour ]    │
└──────────────────────────────┴────────────────────────┴─────────────────────────┘
```

---

## 9. Travel AI UX (In-Trip Contextual Adaptation)

The In-Trip AI Adaptation engine offers one-tap solutions for unexpected changes while traveling.

### 9.1 Mobile Entry Points
When a trip is active, the mobile dashboard features a dedicated quick-action carousel:
- `⚡ "I'm tired"`: Reduces walking distance, swaps active walking tours for tea lounges or gardens, and moves dinner closer to the hotel.
- `🌧️ "It's raining"`: Replaces open-air sights with covered bazaars, museums, art galleries, or historic indoor tea houses.
- `💵 "$40 left today"`: Recalculates dinner and evening activities to fit within the remaining cash balance.
- `📍 "Cheap food near me"`: Uses GPS to locate top-rated budget dining within 800 meters.
- `🕒 "Is this open today?"`: Checks live operating hours and flags upcoming closures.
- `🎯 "Move activities closer"`: Clusters remaining stops into a single neighborhood to avoid cross-city transit.

### 9.2 Adaptation Diff & Confirmation Drawer
When a quick prompt is triggered, the AI presents a clear before-and-after preview before making changes:
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🌧️ RAIN ADAPTATION PROPOSAL: Day 3 Afternoon                                    │
│ Swapping 2 outdoor walking activities for indoor cultural stops:                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🔴 REMOVING:                                                                    │
│   • 14:30 – Montmartre Open-Air Artist Square (Outdoor)                         │
│   • 16:00 – Parc des Buttes-Chaumont Walk (Outdoor)                             │
│                                                                                 │
│ 🟢 ADDING INSTEAD:                                                              │
│   • 14:30 – Covered Passages of Galerie Vivienne & Tea Salon (Indoor)           │
│   • 16:15 – Musée de l'Orangerie Water Lilies Exhibition (Indoor)               │
│                                                                                 │
│ 💰 Budget impact: +$4.00 total • 🚶 Walking saved: 2.8 km                       │
│                                                                                 │
│ [ Discard & Keep Original ]                       [ ✅ Apply Schedule Swap ]    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Saved Items UX (Multi-Entity Vault)

The Saved Vault organizes bookmarked content into five dedicated categories:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ❤️ SAVED VAULT                                                                  │
│ [ All (24) ]  [ 🗺️ Trips (4) ]  [ 🎒 Tours (3) ]  [ 🏨 Hotels (6) ]              │
│ [ 🍽️ Food (7) ]  [ 🏛️ Attractions (4) ]                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ FILTER BY DESTINATION: [ All Cities ▼ ]   SORT: [ Recently Saved ▼ ]            │
│                                                                                 │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌───────────────────────────┐ │
│ │ 🏛️ REGISTAN ENSEMBLE │ │ 🍽️ BIBIKHANUM TEA    │ │ 🎒 SILK ROAD 5-DAY TOUR   │ │
│ │ Samarkand, UZB       │ │ Samarkand, UZB       │ │ Marakanda Travel Operator │ │
│ │ ⭐ 4.9 • Attraction  │ │ ⭐ 4.8 • Chaykhana   │ │ $540 / person • 94% Match │ │
│ │ [Add to Active Trip] │ │ [Add to Active Trip] │ │ [Compare] [Contact Agency]│ │
│ └──────────────────────┘ └──────────────────────┘ └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Interactions:
- **Add to Active Trip**: Drag-and-drop or one-tap modal to insert any saved attraction or dining spot directly into a specific day slot in the workspace.
- **Collaborative Sharing**: Share a collection with travel companions via private link.

---

## 11. Adaptive Global City Guide UX

The user experience dynamically adapts to each destination's unique characteristics without hardcoded templates:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🌐 ADAPTIVE CITY BAR: PARIS                     🌐 ADAPTIVE CITY BAR: SAMARKAND │
├─────────────────────────────────────────────────┼───────────────────────────────┤
│ 🚇 Transit: Navigo / RER contactless tap        │ 🚕 Transit: Yandex Taxi & cash│
│ 💳 Payments: 98% Card & Apple Pay               │ 💵 Payments: Cash for bazaars │
│ 🏛️ Sight Entry: Timed reservations required    │ 🕌 Etiquette: Modest dress req│
│ 🍽️ Dining: Dinner starts at 19:30               │ 🍲 Gastronomy: Plov at 12:30  │
└─────────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 12. Navigation Systems

### 12.1 Mobile Navigation Architecture (< 768px)
The mobile navigation bar features a prominent, elevated AI trigger at its center:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│    [ 🏠 ]        [ 🌍 ]         ( ✨ )         [ 📅 ]        [ 👤 ]             │
│     Home        Explore           AI           Trips        Profile             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Height**: 64px + safe-area-inset-bottom.
- **AI Button**: 48px circle, elevated by 8px, styled in brand blue/purple gradient (`#2563eb` to `#7c3aed`) with subtle ambient glow.
- **Active States**: High-contrast active tab indicator with 2px dot indicator.

### 12.2 Desktop Navigation Architecture (>= 1024px)
- **Left Sidebar**: 240px fixed width, structured into:
  - Top: Brand Logo + Mode Badge (`Traveler` vs `Agency`).
  - Section 1: Core Navigation (Home, Explore, AI Planner, My Trips).
  - Section 2: Catalog & Ecosystem (Ready Tours, Community, Saved Vault).
  - Bottom: Currency Selector, Dark/Light Mode Toggle, Profile avatar & Logout.
- **Top Bar**: Sticky 64px header containing global search, currency toggle, language dropdown, and notification bell.

---

## 13. Design System & Visual Language

TripMind uses a clean, modern aesthetic with strong typography, structured elevation, and a curated color palette.

### 13.1 Color Palette & Semantic Tokens

```css
:root {
  /* Brand Primaries */
  --tm-blue-600: #2563eb;      /* Primary Action & Brand Accent */
  --tm-blue-700: #1d4ed8;      /* Hover / Active Primary */
  --tm-purple-600: #7c3aed;    /* AI Synthetics & Copilot Gradient */
  
  /* Surfaces - Dark Mode (Default) */
  --tm-bg-base: #090d1a;       /* Canvas Background */
  --tm-bg-surface: #0f172a;    /* Card & Modal Surface */
  --tm-bg-elevated: #1e293b;   /* Nested Panels & Hover States */
  
  /* Surfaces - Light Mode */
  --tm-light-base: #f8fafc;
  --tm-light-surface: #ffffff;
  --tm-light-elevated: #f1f5f9;
  
  /* Typography Tokens */
  --tm-text-primary: #f8fafc;  /* 90% contrast */
  --tm-text-secondary: #94a3b8;/* 70% contrast */
  --tm-text-muted: #64748b;    /* 50% contrast */
  
  /* Semantic Badges */
  --tm-verified-green: #10b981;/* Grounded Database Places */
  --tm-ai-purple: #8b5cf6;     /* AI Heuristic Suggestion */
  --tm-warning-amber: #f59e0b; /* Closing soon / High temperature */
  --tm-error-red: #ef4444;     /* Closed / Over budget */
  
  /* Crisp 1px Borders */
  --tm-border-subtle: rgba(255, 255, 255, 0.08);
  --tm-border-focus: rgba(37, 99, 235, 0.5);
}
```

### 13.2 Typography Scale
- **Headings Font**: `'Outfit', sans-serif` (Bold, modern geometric feel).
- **Body & Controls Font**: `'Inter', system-ui, sans-serif` (High legibility at small sizes).
- **Numbers & Budgets**: Tabular figures enabled (`font-variant-numeric: tabular-nums`) for clean financial alignment.

---

## 14. Component Library Specifications

### 14.1 Card Components
1. **Activity Node Card**: Rounded 12px, 1px border (`--tm-border-subtle`), background (`--tm-bg-surface`). Features time badge, category icon, verified pill, rating, and transit interstitial.
2. **Ready Tour Card**: Rounded 16px, subtle hover lift (translateY -2px), verified agency pill, inclusion checklist with icons, match explanation banner.
3. **Comparison Matrix Cell**: Tabular grid card with contrasting highlights for pros and cons.

### 14.2 Interactive Controls
- **Date Range Picker**: Two-month view on desktop; vertical calendar list on mobile.
- **Segmented Filter Pills**: 32px height, 100px pill radius, single/multi-select toggle states.
- **Currency Switcher**: Accessible dropdown with real-time conversion multipliers.

---

## 15. Responsive Rules & Breakpoints

| Breakpoint | Window Width | Layout Behaviors |
| :--- | :--- | :--- |
| **Mobile (Small)** | `< 480px` | Single column; bottom navigation bar (64px); 3D Globe height 220px; activity cards stack vertically; map available via view toggle. |
| **Mobile (Standard)**| `480px – 767px` | Single column; bottom navigation; full-width itinerary cards; floating action button for AI Copilot. |
| **Tablet** | `768px – 1023px` | Collapsible sidebar; split-screen workspace with adjustable split ratio (60% list / 40% map); bottom navigation hides. |
| **Desktop** | `1024px – 1439px`| 240px fixed sidebar; 50/50 split-screen workspace (List on left, sticky Map on right); top navigation active. |
| **Wide Desktop** | `>= 1440px` | 260px sidebar; 3-column workspace capability (Day Selector + List + Full Map & Ready Tours panel). |

---

## 16. State Handlers

### 16.1 Empty States
- **No Trips Created**: Friendly illustration of travel luggage + 3D globe prompt + *"Your travel canvas is empty. Launch our AI Planner to map your next adventure in 60 seconds."* + Primary CTA button: `[ Plan a Trip with AI ]`.
- **No Saved Items in Category**: *"You haven't bookmarked any hotels yet. Explore top boutique stays on the map."* + Secondary CTA: `[ Browse Hotels ]`.

### 16.2 Loading States
- **Itinerary Generation**: Progress meter cycling through travel milestones:
  1. *"Searching authentic sights in [Destination]..."*
  2. *"Calculating walking distances & transit routes..."*
  3. *"Checking local gastronomy & opening hours..."*
  4. *"Matching verified tour agency packages..."*
- **Card Skeletons**: Smooth pulse animation (`#1e293b` to `#334155`) matching exact card dimensions to prevent layout shifts (CLS < 0.05).

### 16.3 Error & Fallback States
- **AI Timeout / Network Offline**: Graceful notification: *"AI synthesis timed out. We've loaded verified destination highlights from our offline directory."* + Retry button.
- **Map Quota / Offline**: Static interactive SVG map fallback with coordinate markers and step-by-step turn directions.

---

## 17. Accessibility (A11y) Requirements

TripMind adheres to **WCAG 2.1 Level AA** standards:
1. **Color Contrast**: All body text maintains a minimum contrast ratio of 4.5:1 against surfaces; headings and badges maintain 3:1.
2. **Keyboard Navigation**: Full tab order traversal across planner filters, workspace timeline nodes, and modal dialogs. Active focus rings use 2px solid `--tm-blue-600` with 2px offset.
3. **Screen Reader Landmarks**: Semantic HTML5 elements (`<main>`, `<nav>`, `<aside>`, `<header>`, `<article>`) with descriptive `aria-label` tags for icon buttons.
4. **Touch Target Sizing**: All interactive touch targets on mobile are at least 44x44 CSS pixels.
5. **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling smooth camera transitions on the 3D Globe and fading cards immediately without layout shifts.

---

## 18. UX Acceptance Criteria & Validation Matrix

| ID | Feature Area | User Acceptance Criteria |
| :--- | :--- | :--- |
| **AC-01** | Mobile Navigation | Mobile viewport (< 768px) must render bottom bar with exactly: Home, Explore, AI (centered & elevated), Trips, Profile. Desktop sidebar must hide. |
| **AC-02** | Filter-First Planner | User must be able to configure: Destination, Dates/Duration, Travelers, Budget, Pace, Comfort, Interests, Food, Transport before any AI call occurs. |
| **AC-03** | Conversational Follow-Up | AI must prompt 1–3 specific tradeoff questions (e.g. fast vs slow pace, street food vs dining, transit vs taxi) before final itinerary generation. |
| **AC-04** | Tri-Tier Strategies | Planner must return 3 distinct options: "Local Explorer", "Balanced", and "Relaxed Premium" with clear tradeoff explanations. |
| **AC-05** | Workspace Views | Workspace must provide Timeline (List), Calendar, and Map views with real-time state synchronization when items are edited. |
| **AC-06** | Day Slots Structure | Each day must contain explicit Morning, Afternoon, Evening, and Night Stay slots with transit times between activities. |
| **AC-07** | Data Tiering Badges | Activities must display an explicit visual badge distinguishing verified database places from AI heuristic suggestions. |
| **AC-08** | Ready Tours Match | Workspace must display 3–4 verified agency packages matching destination/budget with an explanation pill and match percentage. |
| **AC-09** | Side-by-Side Compare | Clicking "Compare" must open a side-by-side modal contrasting the DIY AI plan with the agency package across cost, hotels, and logistics. |
| **AC-10** | In-Trip AI Adaptation | Mobile trip mode must support quick prompts ("I'm tired", "It's raining", "$40 left") that propose a schedule diff without deleting future bookings. |
| **AC-11** | Universal Saved Vault | Saved screen must support filtering across 5 distinct categories: Trips, Tours, Hotels, Food, and Attractions. |
| **AC-12** | Global Currency Context | Switching currency (USD, EUR, UZS, GBP, JPY) in the header must instantly re-calculate all budgets and prices across all views. |

---

*UI/UX Specification authored by AGENT 2 (TripMind Product Architect + Senior UI/UX Designer).*
