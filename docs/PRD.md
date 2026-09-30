# TravelUZ — Product Requirements Document

MVP v1 • Uzbekistan-first, globally scalable travel platform

> Source: `TravelUZ_MVP_v1_PRD.pdf` (Версия 1.0, 28 сентября 2026, статус: MVP planning / implementation-ready), converted to Markdown without changing content.

**Core promise.** TravelUZ помогает человеку спланировать поездку с AI, найти готовый тур, найти попутчика, сохранить и изменить маршрут во время путешествия, а также сравнить предложения туристических агентств в одном месте.

Документ объединяет продуктовую концепцию, UX/UI, функциональные требования, AI-архитектуру, роли пользователей, B2B-модель, монетизацию, базу данных, API, метрики, MVP scope и roadmap.

## Содержание

| № | Раздел | Что внутри |
|---|---|---|
| 1 | Executive Summary | Продукт, миссия, позиционирование |
| 2 | Problem | Проблемы путешественников и агентств |
| 3 | Solution | Как TravelUZ решает проблему |
| 4 | Target Users | Traveler, Agency, Admin |
| 5 | Product Principles | Ключевые принципы MVP |
| 6 | Product Scope | Что входит и что не входит |
| 7 | Information Architecture | Структура приложения |
| 8 | Traveler UX | Экраны и user flow |
| 9 | AI Trip Planner | Wizard, itinerary, budget, live AI |
| 10 | Community | Public trips, reviews, travel friends |
| 11 | Agency Platform | Tours, leads, dashboard |
| 12 | Admin | Модерация, аналитика, управление |
| 13 | Design System | Светлый минималистичный UI + 3D globe |
| 14 | Technical Architecture | Frontend, FastAPI, PostgreSQL, AI |
| 15 | Data Model | Основные сущности и связи |
| 16 | API | Основные endpoint'ы |
| 17 | Integrations | Places, Maps, hotels, flights, activities |
| 18 | Monetization | AI, leads, promotion, affiliate |
| 19 | Analytics | North Star, funnel, events |
| 20 | Security & Moderation | Безопасность и trust |
| 21 | Roadmap | 8-недельный план |
| 22 | Acceptance Criteria | Definition of Done |
| 23 | Future Vision | После MVP |

## 1. Executive Summary

TravelUZ — AI-powered travel platform, запускаемая сначала в Узбекистане, но изначально проектируемая для международных путешествий. Пользователь может выбрать любую страну или город, указать бюджет, даты, стиль отдыха и интересы, после чего получить персональный маршрут.

Платформа объединяет четыре основных продуктовых столпа:

- **AI Trip Planner** — создание персонального маршрута на основе бюджета, дат, интересов и стиля поездки.
- **Ready Tours** — готовые туры от туристических агентств, которые можно сравнить и по которым можно связаться с агентством.
- **Community Trips** — публичные маршруты, созданные самими путешественниками; другой пользователь может использовать такой маршрут и адаптировать его с AI.
- **Travel Friends** — поиск людей, которые путешествуют в тот же город или страну примерно в те же даты.

Ключевое отличие продукта — не просто генерация красивого текста. AI должен работать поверх реальных travel-данных и превращать их в практический маршрут с локациями, временем, стоимостью, картой и внешними ссылками на бронирование.

Главная продуктовая петля:

```
DISCOVER → PLAN WITH AI → SAVE TRIP → FIND TOURS / TRAVELERS → TRAVEL → ADAPT WITH AI → SHARE / REVIEW
```

> Первый бизнес-ориентир MVP: получить первых 100 пользователей, подключить первых 10 бизнес-партнёров и получить первые деньги.

## 2. Problem

Сегодня самостоятельное планирование поездки часто разбросано по множеству сервисов. Человек отдельно ищет направление, места, рестораны, отели, маршруты, билеты, отзывы, туры и иногда попутчиков. Затем он вручную собирает всё в заметки или таблицы.

**Проблемы traveler:**

- Слишком много вкладок и приложений для одной поездки.
- Сложно понять, укладывается ли маршрут в реальный бюджет.
- Информация об объектах может быть устаревшей или находиться в разных источниках.
- Сложно оптимально расположить места по времени и географии.
- Планы ломаются из-за дождя, закрытия места, очередей, усталости или изменения бюджета.
- Solo travelers могут хотеть найти попутчика, но не имеют travel-specific пространства для поиска.
- Пользователь может не доверять первому найденному агентству и хочет сравнить несколько вариантов.

**Проблемы travel agencies:**

- Туры и предложения распределены по соцсетям, мессенджерам и разным сайтам.
- Нет единого места, где пользователь может сравнить предложения разных агентств.
- Агентствам нужны качественные входящие лиды, а не просто просмотры.
- Небольшим агентствам трудно получить дополнительную видимость без сложной рекламной системы.

> **Opportunity:** TravelUZ может стать связующим слоем между самостоятельным путешественником, AI-инструментами, travel inventory и локальными туристическими агентствами.

## 3. Solution

TravelUZ собирает ключевые действия путешественника в одном продукте: поиск направления, AI-планирование, реальные места, готовые туры, community-маршруты, travel buddies и адаптация поездки во время путешествия.

| Problem | TravelUZ response |
|---|---|
| Много источников | Единый travel dashboard |
| Сложно планировать | AI Trip Planner |
| Непонятный бюджет | Budget-aware itinerary |
| План изменился | Live AI Trip Modification |
| Нужен готовый тур | Agency Tours |
| Хочу сравнить | Единый каталог агентств |
| Путешествую один | Travel Friends |
| Нашёл хороший маршрут | Publish + Use this trip |

## 4. Target Users & Roles

### 4.1 Traveler

- Основной пользователь MVP.
- Может путешествовать solo, couple, friends или family.
- Ищет самостоятельный маршрут, готовый тур или попутчика.
- Использует AI бесплатно в рамках лимита и потенциально покупает дополнительные генерации.

### 4.2 Travel Agency

- Создаёт профиль агентства.
- Размещает туры, цены, скидки, фото и программу.
- Получает лиды от пользователей.
- Позже может покупать продвижение и дополнительные инструменты.

### 4.3 Admin / TravelUZ

- Модерирует пользователей, агентства, туры и community-контент.
- Управляет жалобами и статусом верификации.
- Следит за лидами, revenue и product analytics.

### 4.4 Future roles

Позже могут появиться гиды, локальные организаторы, premium providers и другие B2B-партнёры. Они не входят в обязательный MVP v1.

## 5. Product Principles

- **Useful over flashy.** Визуальный wow-эффект нужен для первого впечатления, но каждое действие должно помогать путешественнику.
- **Real data over hallucination.** AI должен по возможности выбирать места, часы работы и ссылки из проверяемых источников/API.
- **Budget first.** Бюджет является одним из основных ограничений маршрута.
- **Editable trip.** Маршрут не является статичным документом; пользователь должен легко менять его.
- **Community creates value.** Хорошие user-generated trips превращаются в повторно используемый контент.
- **Marketplace neutrality.** Пользователь должен видеть предложения нескольких агентств, а платное продвижение должно быть обозначено.
- **Uzbekistan-first, global-by-design.** Первый рынок локальный, география путешествий глобальная.

## 6. Product Scope

### 6.1 MVP Must Have

| Area | MVP requirement | Priority |
|---|---|---|
| Auth | Registration, login, profile, role | P0 |
| Explore | Destinations, places, search | P0 |
| AI Planner | Destination, dates, budget, travelers, style, interests | P0 |
| Trip | Generate, save, edit, view | P0 |
| Budget | Estimated total and category breakdown | P0 |
| Tours | Agency tours, filters, detail page | P0 |
| Agency | Profile, create/publish tour, leads | P0 |
| Community | Publish trip, copy/use trip | P1 |
| Travel Friends | Profile, search, connect | P1 |
| Chat | Basic 1:1 or trip chat | P1 |
| Admin | Users, agencies, tours, reports, moderation | P0 |

### 6.2 Explicitly Out of Scope for first MVP

- Полноценная собственная система авиабилетов.
- Полноценная hotel booking engine.
- Сложная loyalty/points system.
- Собственная глобальная карта.
- Десятки внешних API одновременно.
- Сложная CRM для агентств.
- Нативные iOS/Android приложения до проверки web MVP.

## 7. Information Architecture

**Traveler navigation:** Explore, AI Planner, My Trips, Tours, Travel Friends, Places, Saved, Profile.

**Agency navigation:** Overview, My Tours, Create Tour, Leads, Analytics, Profile.

**Admin navigation:** Overview, Users, Agencies, Tours, Trips, Leads, Reports, Moderation, Settings.

> Ключевое правило: traveler dashboard, agency dashboard и admin area должны быть разделены по ролям. Не смешивать B2B и B2C интерфейсы.

## 8. Traveler UX

### 8.1 Home / Explore

- Главный CTA: Plan my trip with AI.
- 3D globe и анимированный маршрут A → B как visual identity.
- Популярные направления.
- Travel styles.
- Popular tours.
- Trips from travelers.
- Traveling alone? / Find a travel buddy.

### 8.2 Suggested hero copy

```
PLAN • EXPLORE • TRAVEL
Your next adventure starts here.
Plan your trip with AI, discover amazing places, find ready-made tours and connect with travelers.
```

### 8.3 Destination detail

- Страна/город.
- Краткое описание.
- Язык, валюта, часовой пояс, столица при необходимости.
- Weather/season data только при наличии реального источника.
- Places и activities.
- Hotels / flights / tours через соответствующие интеграции или внешние ссылки.

### 8.4 My Trips

- Upcoming trips.
- Past trips.
- Drafts.
- Published trips.
- Карточка: destination, dates, days, estimated budget, status.

## 9. AI Trip Planner

AI Planner является главным продуктовым модулем MVP.

### 9.1 Wizard

| Step | Input | Example |
|---|---|---|
| 1 | Destination | Paris, France |
| 2 | Dates | 12–19 October |
| 3 | Travelers | 2 people |
| 4 | Budget | $1,200 |
| 5 | Budget includes | Food + hotels + activities; flights optional |
| 6 | Travel style | Culture + Food |
| 7 | Interests | Museums, architecture, restaurants |

Travel styles: Relax, City & Culture, Adventure, Luxury, Food, Romantic, Family, Budget.

### 9.2 Generated itinerary

Каждый день должен быть структурирован, а не просто написан как длинный текст.

```
Day 1
09:00 Breakfast
10:00 Attraction
13:00 Lunch
15:00 Museum
19:00 Dinner
```

For each item:

```
- type
- place_id
- location
- start_time
- duration
- estimated_price
- opening_hours
- booking_url
- source
```

### 9.3 Budget engine

```
Accommodation      $180
Food               $120
Activities          $70
Transport           $50
Other               $30
-----------------------
Estimated total    $450
Remaining           $50
```

Если маршрут превышает бюджет, пользователь должен видеть это явно и иметь действие Optimize trip.

### 9.4 Live AI Trip Modification

- It's raining today → заменить outdoor activities на indoor.
- This museum is closed → найти альтернативу.
- I only have $30 today → оптимизировать день по бюджету.
- I'm tired, make today more relaxed → уменьшить количество активностей и расстояния.

### 9.5 AI output

Backend должен получать структурированный результат, предпочтительно JSON schema/structured output, чтобы frontend мог отображать itinerary без парсинга свободного текста.

## 10. Community Trips & Travel Friends

### 10.1 Public trips

- Пользователь нажимает Publish trip.
- Trip получает публичную страницу.
- Другие могут View trip.
- Use this trip копирует маршрут в собственный draft.
- AI затем адаптирует маршрут под новый бюджет, даты и интересы.

### 10.2 Reviews

- После поездки пользователь может оставить оценку.
- Review относится к trip/месту/тур-опыту, а не только к пользователю.
- Нужны report и moderation.

### 10.3 Travel Friends

Функция предназначена именно для поиска попутчиков, а не как dating product.

- Destination.
- Dates.
- Budget.
- Travel style.
- Language.
- Connect / Message.
- Block / Report.

Профиль не должен публично раскрывать лишние персональные данные.

## 11. Agency Platform

### 11.1 Agency onboarding

- Create agency account.
- Agency profile.
- Contact information.
- Verification status.

### 11.2 Create Tour

| Field | Requirement |
|---|---|
| Tour name | Required |
| Destination | Required |
| Duration | Required |
| Dates | Optional / required depending on tour |
| Price | Required |
| Discount | Optional |
| Photos | Required |
| Itinerary | Recommended |
| Included services | Recommended |
| Excluded services | Recommended |
| Contact | Required |

### 11.3 Agency dashboard

| Section | Contents |
|---|---|
| Overview | Views, Tour views, Leads, Contacts, Bookings (future) |
| My Tours | Published, Draft, Paused |
| Leads | New, Contacted, Interested, Booked (future) |
| Analytics | Views, CTR, Leads, Conversion (future) |

### 11.4 Lead flow

```
User views tour → Contact Agency → Lead created → Agency receives lead → Contacted → Interested → Booked (future)
```

## 12. Admin Platform

Admin dashboard нужен для управления marketplace и community.

| Module | Functions |
|---|---|
| Users | Search, status, reports, moderation |
| Agencies | Verification, status, profile review |
| Tours | Approve, reject, edit status, feature |
| Trips | Moderate public trips |
| Leads | Track lead volume and status |
| Reports | User/content reports |
| Analytics | Acquisition, activation, marketplace, revenue |
| Settings | Categories, limits, system settings |

## 13. Design System & Visual Direction

> TravelUZ должен выглядеть как premium travel technology, а не как generic admin dashboard.

### 13.1 Visual identity

- Светлый интерфейс: white + very light blue/white background.
- 2–3 основных цвета: white, deep navy, TravelUZ blue.
- Без purple-heavy gradients.
- Без rainbow/neon palette.
- Минимум glassmorphism.
- Soft shadows и тонкие borders.
- Большое количество whitespace.

### 13.2 3D globe

- Сохранить 3D globe как ключевой visual anchor.
- Глобус медленно вращается.
- Есть две точки A и B.
- Между ними проходит curved flight path.
- Маленький 3D airplane движется по маршруту.
- Location markers имеют аккуратное свечение.
- Анимация спокойная, не игровая.

Пример:

```
Tashkent ● ───────── ✈ ───────── ● Istanbul
```

### 13.3 Hero

- Left: copy + AI CTA.
- Right: 3D globe + airplane route.
- Primary CTA: Plan my trip with AI.
- Secondary CTA: Explore destinations.

### 13.4 Responsive

- Desktop: sidebar + content.
- Tablet: compact sidebar.
- Mobile: bottom navigation или hamburger.
- Глобус должен масштабироваться без horizontal overflow.
- Карточки переходят в vertical/horizontal responsive layout.

## 14. Technical Architecture

```
Frontend
  ↓
FastAPI Backend
  ↓
PostgreSQL
  ↓
Services
├── AI Planner
├── Places
├── Routes
├── Hotels
├── Activities
├── Flights
└── Marketplace
```

### 14.1 Recommended stack

| Layer | Technology |
|---|---|
| Frontend | Existing web stack; preserve current working framework |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Auth | JWT / secure session strategy |
| Cache / jobs | Redis later if required |
| AI | LLM via backend tool-calling / structured output |
| Maps / places | External provider such as Google Maps Platform |
| Hosting | Current Vercel frontend + suitable backend hosting |

### 14.2 AI architecture rule

```
Frontend
  ↓
FastAPI
  ↓
Planner Service
  ↓
AI Model
  ↓
Tools
├── search_places()
├── get_place_details()
├── get_route()
├── search_hotels()
├── search_activities()
└── calculate_budget()
```

> Не делать прямой вызов AI provider из frontend. API keys и business rules должны оставаться на backend.

## 15. Data Model

Основные таблицы MVP:

```
users
profiles
agencies
agency_members
destinations
places
tours
tour_days
tour_places
trips
trip_days
trip_items
travel_buddy_profiles
travel_buddy_requests
chats
chat_members
messages
leads
reviews
favorites
ai_generations
subscriptions
payments
reports
notifications
```

### 15.1 Relationships

```
User
├── Trips
│   └── Trip Days
│       └── Trip Items
├── Favorites
├── Reviews
├── Chats
└── AI Generations

Agency
├── Members
├── Tours
└── Leads
```

### 15.2 Trip item

Рекомендуемые поля: id, trip_day_id, type, place_id, title, start_time, duration_minutes, latitude, longitude, estimated_price, booking_url, source, status.

## 16. Backend API

Примерный API contract для MVP:

| Domain | Endpoint | Purpose |
|---|---|---|
| Auth | `POST /auth/register` | Registration |
| Auth | `POST /auth/login` | Login |
| Auth | `GET /auth/me` | Current user |
| Planner | `POST /planner/generate` | Generate trip |
| Planner | `POST /planner/{trip_id}/regenerate` | Regenerate |
| Planner | `POST /planner/{trip_id}/optimize` | Optimize budget/route |
| Planner | `POST /planner/{trip_id}/ask` | Live AI modification |
| Trips | `GET /trips` | List trips |
| Trips | `GET /trips/{id}` | Trip detail |
| Trips | `PATCH /trips/{id}` | Edit trip |
| Trips | `POST /trips/{id}/publish` | Publish |
| Trips | `POST /trips/{id}/clone` | Use this trip |
| Places | `GET /places/search` | Search places |
| Tours | `GET /tours` | List tours |
| Tours | `GET /tours/{id}` | Tour detail |
| Tours | `POST /tours` | Create tour |
| Tours | `PATCH /tours/{id}` | Edit tour |
| Leads | `POST /tours/{id}/contact` | Create lead |
| Leads | `GET /agency/leads` | Agency leads |
| Buddies | `GET /buddies` | Search buddies |
| Buddies | `POST /buddies/profile` | Create buddy profile |
| Buddies | `POST /buddies/{id}/connect` | Connect |
| Chat | `GET /chats` | List chats |
| Chat | `GET /chats/{id}/messages` | Messages |
| Chat | `POST /chats/{id}/messages` | Send message |

## 17. External Integrations & APIs

Интеграции должны подключаться постепенно. Не нужно строить MVP вокруг десятков API.

| Category | MVP approach | Purpose |
|---|---|---|
| Places | Google Places Platform or equivalent | POI, restaurants, attractions, details |
| Routes | Maps / Routes provider | Distance, travel time, route order |
| Hotels | Affiliate / partner API | Hotel search + external booking |
| Activities | Travel activities API | Tours, activities, tickets |
| Flights | Flight search / affiliate | Search + external booking |
| Payments | Payment provider | AI packs / agency monetization |
| Analytics | Product analytics | Events and funnel |

> Правило интеграций: если партнёрский доступ ещё не получен, интерфейс должен работать через mock/demo data, но архитектура должна позволять заменить источник без переписывания UI.

## 18. Monetization

> На MVP цены являются гипотезами, которые нужно проверять на реальных пользователях и агентствах.

| Revenue stream | Initial hypothesis | Notes |
|---|---|---|
| AI Pack | $5 / 10 generations | После 3 free generations |
| Agency leads | $2 / contact | Простая модель для старта |
| Confirmed booking | $8–10 | Позже, если можно достоверно подтверждать booking |
| Promotion | $10 / 7 days | Featured tour; clearly labeled |
| Affiliate | Commission | Hotels / activities / flights |
| Agency subscription | $20–30/month later | После проверки ценности |

### 18.1 Traveler limits

- Free: 3 AI trip generations.
- Paid pack: 10 generations за $5 как первая гипотеза.
- Не обязательно списывать полноценную генерацию за каждое небольшое изменение маршрута; usage policy можно сделать granular.

### 18.2 Agency model

- Первые 3 тура бесплатно.
- Дополнительные размещения/продвижение — платно.
- Lead monetization — отдельный revenue stream.

## 19. Analytics & Metrics

> **North Star metric для MVP:** количество successful trip planning sessions, в которых пользователь создал и сохранил пригодный для поездки маршрут.

Основная воронка:

```
Visitors → Sign up → First trip generated → Trip saved → Trip published/used → Agency contact → Paid action
```

### 19.1 Product metrics

- Registered users.
- Users who generated first trip.
- Trips generated.
- Trips saved.
- Trips published.
- Trips copied/used.
- AI regeneration count.
- Travel buddy searches.
- Connections and chats.

### 19.2 Marketplace metrics

- Agency views.
- Tour views.
- Contact clicks.
- Qualified leads.
- Agency response rate.
- Booked status, когда появится подтверждаемая модель.

### 19.3 Revenue metrics

- AI pack purchases.
- Lead revenue.
- Promotion revenue.
- Affiliate revenue.
- Revenue per active user.
- Revenue per agency.

## 20. Security, Privacy & Moderation

- API keys никогда не хранить во frontend.
- Password hashing и secure authentication.
- Role-based authorization: traveler / agency / admin.
- Rate limiting для AI endpoints.
- Лимиты AI usage должны проверяться на backend.
- User-generated content должен иметь report/block механизмы.
- Agency content должен проходить базовую moderation/verification.
- Не показывать лишние персональные данные travel buddy.
- Публичные маршруты не должны автоматически раскрывать private profile information.
- Логи ошибок не должны содержать секреты и чувствительные данные.

**Travel Friends moderation:**

- Report user.
- Block user.
- Admin review.
- Basic anti-spam.
- Ограничения на массовую отправку сообщений.

## 21. MVP Roadmap

| Phase | Week | Deliverables |
|---|---|---|
| 1. Core | 1 | Auth, roles, DB, destinations, places, dashboard structure |
| 2. AI | 2 | Planner wizard, generation, JSON itinerary, budget, save trip |
| 3. Real data | 3 | Places, routes, map, details, external links |
| 4. Community | 4 | Publish trip, public trips, copy/use, reviews |
| 5. Agencies | 5 | Agency account, profile, create tour, publish, leads |
| 6. Travel Friends | 6 | Buddy profiles, search, connect, chat, report/block |
| 7. Monetization | 7 | AI limits, AI pack, lead tracking, promotion |
| 8. Launch | 8 | Responsive polish, analytics, moderation, QA, first partners/users |

### 21.1 First launch target

```
MVP → first 100 users → first 10 business partners → first money
```

### 21.2 Recommended development order

- **P0:** roles, AI Planner, My Trips, real places, budget, Ready Tours, Agency Dashboard, Leads.
- **P1:** Publish Trip, Copy Trip, Travel Friends, Chat, Reviews.
- **P2:** Hotels API, Flights API, Affiliate, paid AI generations, promoted tours.

## 22. MVP Acceptance Criteria

MVP считается готовым к закрытому запуску, если:

- Traveler может зарегистрироваться и создать профиль.
- Traveler может пройти AI Planner wizard.
- Traveler получает структурированный multi-day itinerary.
- В маршруте есть реальные/проверяемые места там, где интеграция подключена.
- Есть estimated budget и category breakdown.
- Trip можно сохранить, открыть и изменить.
- Trip можно опубликовать.
- Другой пользователь может открыть public trip и использовать его как основу.
- Есть каталог агентских туров.
- Agency может зарегистрироваться и создать tour.
- Agency может получить lead после Contact Agency.
- Admin может модерировать users/agencies/tours/public trips.
- Travel Friends имеет базовый search/connect/report flow.
- UI работает на desktop и mobile.
- AI API keys не доступны клиенту.
- AI usage limits работают на backend.
- Базовые product events собираются.
- Есть empty, loading и error states.

> **Definition of Done для каждой функции:** UI + backend contract + validation + error state + responsive behavior + analytics event + basic test.

## 23. Future Vision

После подтверждения MVP TravelUZ может развиваться в более широкий travel ecosystem.

### 23.1 Possible product expansion

- Deep hotel booking.
- Flight booking.
- Activities/tickets marketplace.
- Local guides.
- Group trips.
- Trip groups and communities.
- AI travel companion during the entire trip.
- Real-time disruption handling.
- Personal travel wallet.
- Travel documents and reminders.
- Visa / entry information.
- Currency and expense tracking.
- Family travel management.
- Corporate travel.

### 23.2 Network effect

```
More travelers → more trips → better community content → more discovery → more agency leads → more agencies → more offers → more travelers
```

### 23.3 Global strategy

- Launch market: Uzbekistan.
- Expansion: Central Asia.
- International destinations from day one.
- Global traveler audience after product-market validation.

### 23.4 Positioning

Working positioning statement:

> TravelUZ is an AI-powered travel platform that helps people plan, discover and experience trips, find travel companions and connect with travel agencies.

Короткая формулировка для pitch: **Uzbekistan-first, globally scalable travel platform.**

## 24. End-to-End User Flows

### 24.1 First-time traveler

```
Landing / Explore → Create my trip → Destination → Dates → Travelers → Budget → Style + Interests
→ AI generates itinerary → Review budget → Save trip → Explore / modify / publish
```

### 24.2 Agency lead

```
Tours → Filter destination / price / style → Open tour → Agency profile → Contact Agency
→ Lead created → Agency receives lead → Contacted → Interested → Booked (future)
```

### 24.3 Community trip reuse

```
Trips from travelers → Open public trip → Use this trip → Set own dates / budget / travelers
→ AI adapts itinerary → Save as own trip
```

### 24.4 Travel buddy

```
Travel Friends → Destination + dates + style → Results → Open profile → Connect → Chat → Block / Report if necessary
```

## 25. Core UX Copy

| Context | Suggested copy |
|---|---|
| Hero | Your next adventure starts here. |
| AI CTA | Plan my trip with AI |
| Secondary CTA | Explore destinations |
| Planner | Where do you want to go? |
| Budget | What's your trip budget? |
| Travel style | What kind of trip do you want? |
| AI assistant | Ask TravelUZ AI |
| Live change | Something changed? Let AI adapt your trip. |
| Travel buddy | Traveling alone? Find people going your way. |
| Community | Trips from travelers |
| Reuse | Use this trip |
| Agency | Compare tours from travel agencies |

## 26. Risks & Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| AI hallucinations | Wrong places/prices/hours | Tool-based real data + source metadata + backend validation |
| API cost | Travel data and AI can be expensive | Caching, limits, phased integrations |
| Cold start | Few users / few trips | Seed destinations and demo trips; recruit first agencies manually |
| Agency trust | Low-quality offers | Verification and moderation |
| Spam in Travel Friends | User safety and trust | Rate limits, report/block, moderation |
| Complex booking | Legal/payment complexity | External redirect first |
| Feature overload | Slow MVP | Strict P0/P1/P2 prioritization |

## 27. Launch Checklist

**Product:**

- AI Planner works end-to-end.
- At least several destinations have reliable demo data.
- Tours can be created and published.
- Leads are recorded.
- Public trips work.
- Travel Friends basic flow works.

**Business:**

- At least 5 initial agencies contacted.
- Target 10 business partners.
- Lead pricing hypothesis prepared.
- AI pack pricing hypothesis prepared.
- Agency onboarding message prepared.

**Growth:**

- Landing page.
- Instagram/TikTok/Telegram content.
- Referral/share link for public trips.
- Analytics installed.
- Feedback form.

**Technical:**

- Production environment.
- Database backups.
- Error monitoring.
- Rate limits.
- Secrets management.
- Mobile QA.

## 28. Final Product Definition

> TravelUZ MVP v1 — это не просто каталог стран и не просто AI chatbot.

Это travel platform с одной понятной системой:

```
PLAN → DISCOVER → COMPARE → CONNECT → TRAVEL → ADAPT → SHARE
```

Пользователь может начать с AI, с готового тура или с чужого маршрута. Агентство получает витрину и лиды. TravelUZ получает комиссионные/affiliate/promotion opportunities. Community постепенно создаёт собственную библиотеку travel-маршрутов.

Самая важная задача MVP — не построить весь travel industry за один релиз. Задача — доказать три вещи:

- Люди действительно используют TravelUZ для создания поездок.
- Агентства готовы размещать предложения и обрабатывать лиды.
- Хотя бы один monetization loop приносит первые реальные деньги.

Если эти три гипотезы подтверждаются, TravelUZ получает основание для следующего этапа: более глубокие API, affiliate booking, расширение B2B, мобильный продукт и международная экспансия.
