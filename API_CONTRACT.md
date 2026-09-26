# TravelUZ API Contract & OpenAPI Specification

Base Server URL: `http://localhost:8000/api/v1`

---

## 1. Authentication Service (`/api/v1/auth`)

### `POST /api/v1/auth/register`
- **Description**: Registers a new user account. Defaults to `agency_owner` role.
- **Request Body**:
  ```json
  {
    "email": "user@agency.com",
    "password": "SecurePassword123",
    "name": "Alex Mercer",
    "role": "agency_owner" // optional: "agency_owner", "agency_staff", "client", "admin"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "refresh_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@agency.com",
      "name": "Alex Mercer",
      "role": "agency_owner",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Alex%20Mercer"
    }
  }
  ```

### `POST /api/v1/auth/login`
- **Description**: Authenticates user credentials and returns access & refresh tokens.
- **Request Body**:
  ```json
  {
    "email": "user@agency.com",
    "password": "SecurePassword123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "refresh_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@agency.com",
      "name": "Alex Mercer",
      "role": "agency_owner",
      "avatar": "https://...",
      "agency_id": 1
    }
  }
  ```

### `POST /api/v1/auth/refresh`
- **Description**: Exposes token renewal via valid refresh token.
- **Query Parameter**: `refresh_token_str`
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "new_access_token_jwt",
    "refresh_token": "new_refresh_token_jwt",
    "token_type": "bearer"
  }
  ```

### `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "email": "user@agency.com",
    "name": "Alex Mercer",
    "role": "agency_owner",
    "avatar": "https://...",
    "agency_id": 1,
    "agency": {
      "id": 1,
      "name": "Silk Road Voyages",
      "subscription_tier": "starter"
    }
  }
  ```

---

## 2. Trips & Itineraries Service (`/api/v1/trips` & `/api/v1/itineraries`)

### `POST /api/v1/trips/generate`
- **Description**: Proxies to Anthropic Claude server-side using `ANTHROPIC_API_KEY` (never exposed to frontend). Auto-saves generated itinerary.
- **Headers**: Optional `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "destination": "Samarkand",
    "days": 3,
    "start_date": "2026-10-01", // optional
    "end_date": "2026-10-03",   // optional
    "budget": 1500.0,
    "travelers": 2,
    "style": "Cultural Heritage",
    "language": "en"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "id": 14,
    "share_token": "9a8b7c6d5e4f",
    "itinerary": {
      "title": "Samarkand Cultural Odyssey",
      "summary": "3-day immersion into Silk Road architecture and gastronomy.",
      "totalCost": 1425.0,
      "days": [
        {
          "day": 1,
          "date": "Day 1",
          "morning": { "activity": "Registan Square Tour", "location": "Registan", "duration": "3h", "cost": 40.0, "tip": "Comfortable shoes" },
          "afternoon": { "activity": "Bibi-Khanym Mosque & Siab Bazaar", "location": "Siab Bazaar", "duration": "3.5h", "cost": 30.0, "tip": "Bargaining welcomed" },
          "evening": { "restaurant": "Karimbek Restaurant", "cuisine": "Uzbek Plov", "cost": 50.0, "address": "Dagbitskaya St" },
          "hotel": { "name": "Samarkand Regency Gur Emir", "stars": 5, "price": 180.0, "area": "City Center" },
          "dailyCost": 300.0
        }
      ],
      "packingTips": ["Universal plug adapter", "Modest attire for religious sites"],
      "visaInfo": "e-Visa available online at evisa.mfa.uz",
      "bestTime": "September to November"
    },
    "created_at": "2026-09-26T20:45:00Z"
  }
  ```

### `GET /api/v1/trips`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (`200 OK`): Array of Itinerary objects.

### `GET /api/v1/trips/share/{share_token}`
- **Public Endpoint** (Client role / Anonymous view)
- **Response** (`200 OK`):
  ```json
  {
    "id": 14,
    "title": "Samarkand Cultural Odyssey",
    "destination": "Samarkand",
    "content_json": { ... },
    "share_token": "9a8b7c6d5e4f",
    "created_at": "2026-09-26T20:45:00Z",
    "agency_name": "Silk Road Voyages",
    "agency_logo": "https://...",
    "agency_contact_email": "info@silkroad.uz",
    "agency_contact_phone": "+998901234567"
  }
  ```

### `GET /api/v1/itineraries/{id}/pdf` & `GET /api/v1/trips/{id}/pdf`
- **Description**: Generates a high-definition PDF using WeasyPrint HTML/CSS rendering with ReportLab fallback.
- **Response**: Binary PDF file stream (`application/pdf`) with `Content-Disposition: attachment; filename=Itinerary.pdf`.

---

## 3. Leads & CRM Pipeline Service (`/api/v1/leads`)

### `POST /api/v1/leads/public`
- **Public Endpoint**: Submitted by prospective clients viewing shared itineraries. Triggers instant Telegram notification worker to agency's configured chat ID.
- **Request Body**:
  ```json
  {
    "share_token": "9a8b7c6d5e4f",
    "client_name": "Sarah Connor",
    "client_contact": "sarah@cyberdyne.com",
    "notes": "Looking for private transport for 2 people."
  }
  ```
- **Response** (`200 OK`): Lead Object

### `GET /api/v1/leads`
- **Headers**: `Authorization: Bearer <access_token>` (agency_owner / staff)
- **Response** (`200 OK`): List of agency leads filtered by RBAC.

### `PATCH /api/v1/leads/{lead_id}`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "status": "contacted", // "new", "contacted", "negotiating", "won", "lost"
    "notes": "Confirmed dates over phone."
  }
  ```
- **Response** (`200 OK`): Updated Lead Object

### `POST /api/v1/leads/{lead_id}/convert-to-booking`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "final_price": 1400.0,
    "currency": "USD"
  }
  ```
- **Response** (`200 OK`): Created Booking Object with lead marked as `won`.

---

## 4. Agency & Telemetry Service (`/api/v1/agencies`)

### `GET /api/v1/agencies/analytics`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (`200 OK`): Revenue metrics, lead pipeline conversion rate, top destinations, and monthly telemetry.

### `PATCH /api/v1/agencies/me`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "name": "Silk Road Voyages",
    "telegram_bot_token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyZ",
    "telegram_chat_id": "-100123456789"
  }
  ```
- **Response** (`200 OK`): Updated Agency Object (bot token is encrypted in DB).

---

## 5. Telegram Bot Worker
- Running as separate background worker (`python app/telegram_worker.py`).
- Listens for `/start` command to issue chat ID telemetry.
- Dispatches instant lead alerts when a new Lead record is created.
