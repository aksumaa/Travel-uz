const TOKEN_KEY = 'travel_uz_jwt_token';
const DB_KEY = 'travel_uz_local_db';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  agency_id: number | null;
  agency: Record<string, unknown> | null;
};

type StoredTrip = {
  id: number;
  title: string;
  destination: string;
  share_token: string;
  content_json: Record<string, unknown>;
  agency_name: string;
  agency_logo?: string;
};

type StoredLead = {
  id: number;
  agency_id: number;
  client_name: string;
  client_contact: string;
  source: string;
  itinerary_id: number | null;
  itinerary_title: string | null;
  status: 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
  notes: string | null;
  created_at: string;
  final_price?: number;
  currency?: string;
};

type LocalDb = {
  users: StoredUser[];
  trips: StoredTrip[];
  leads: StoredLead[];
  nextTripId: number;
  nextLeadId: number;
};

export function buildItinerary(destination: string, days: number, budget = 1200, style = 'Adventure', travelers = 2) {
  const city = destination.split(',')[0] || destination;
  return {
    title: `${city} — ${style} Voyage`,
    summary: `Custom ${days}-day ${style.toLowerCase()} itinerary for ${travelers} travelers in ${destination}. Handpicked sights, local food, and a place to stay each night.`,
    totalCost: budget,
    travelers,
    style,
    budget: String(budget),
    startDate: new Date().toISOString().split('T')[0],
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      date: `Day ${i + 1}`,
      morning: {
        activity: `Historic quarter walk in ${city}`,
        location: `${city} Center`,
        duration: '3 hours',
        cost: 25,
        tip: 'Carry a little cash for small shops.',
      },
      afternoon: {
        activity: 'Craft workshops and a local tasting',
        location: `${city} Bazaar`,
        duration: '2.5 hours',
        cost: 20,
        tip: 'Photos are welcome in open workshops.',
      },
      evening: {
        restaurant: 'Chaykhana Oasis Grill',
        cuisine: 'Regional grill',
        cost: 35,
        address: `${city} Main Square`,
      },
      hotel: {
        name: 'Silk Road Heritage Boutique Hotel',
        stars: 4,
        price: 90,
        area: 'Downtown',
      },
      dailyCost: 170,
    })),
    packingTips: [
      'Pack a universal power adapter.',
      'Keep small cash for souvenirs.',
      'Dress modestly at historic sites.',
    ],
    visaInfo: 'Many passports get a short visa-free stay. Check your passport before you fly.',
    bestTime: 'Spring (April–May) and autumn (September–November).',
    emergencyNumbers: { police: '102', ambulance: '103', embassy: '+998 (71) 120-3000' },
  };
}

function defaultDb(): LocalDb {
  const samarkand = buildItinerary('Samarkand, Uzbekistan', 4, 980, 'Culture', 2);
  return {
    users: [
      {
        id: 'user-traveler',
        name: 'Dilshod Akbarjonov',
        email: 'traveler@traveluz.com',
        password: 'travel123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=traveler',
        role: 'traveler',
        agency_id: null,
        agency: null,
      },
      {
        id: 'user-admin',
        name: 'Muslima Shoabbosova',
        email: 'admin@traveluz.com',
        password: 'admin123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
        role: 'administrator',
        agency_id: 1,
        agency: {
          id: 1,
          name: 'TravelUZ',
          subscription_tier: 'enterprise',
          contact_email: 'hello@traveluz.com',
          contact_phone: '+998 71 200 00 00',
          has_telegram_bot: false,
          telegram_chat_id: '',
        },
      },
    ],
    trips: [
      {
        id: 1,
        title: 'Samarkand Silk Road',
        destination: 'Samarkand, Uzbekistan',
        share_token: 'silk-road',
        content_json: samarkand,
        agency_name: 'TravelUZ',
      },
    ],
    leads: [
      {
        id: 1,
        agency_id: 1,
        client_name: 'Elena Petrova',
        client_contact: 'elena@mail.com',
        source: 'public_link',
        itinerary_id: 1,
        itinerary_title: 'Samarkand Silk Road',
        status: 'new',
        notes: 'Interested in a 4-day cultural trip.',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        agency_id: 1,
        client_name: 'John Doe',
        client_contact: '+1 415 555 0199',
        source: 'public_link',
        itinerary_id: 1,
        itinerary_title: 'Samarkand Silk Road',
        status: 'contacted',
        notes: 'Asked about hotel upgrades.',
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        agency_id: 1,
        client_name: 'Lola Sarkorova',
        client_contact: 'lola@traveluz.com',
        source: 'public_link',
        itinerary_id: 1,
        itinerary_title: 'Samarkand Silk Road',
        status: 'negotiating',
        notes: 'Comparing two departure dates.',
        created_at: new Date().toISOString(),
      },
    ],
    nextTripId: 2,
    nextLeadId: 4,
  };
}

function loadDb(): LocalDb {
  if (typeof window === 'undefined') return defaultDb();
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const db = defaultDb();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }
  try {
    const parsed = JSON.parse(raw) as LocalDb;
    if (!parsed.users || !parsed.trips || !parsed.leads) return defaultDb();
    return parsed;
  } catch {
    return defaultDb();
  }
}

function saveDb(db: LocalDb) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function publicUser(user: StoredUser) {
  const { password: _password, ...rest } = user;
  return rest;
}

function currentUser(db: LocalDb): StoredUser {
  const token = getAuthToken();
  if (!token || !token.startsWith('local:')) {
    throw new Error('Please sign in to continue.');
  }
  const user = db.users.find((item) => item.id === token.slice('local:'.length));
  if (!user) throw new Error('Please sign in to continue.');
  return user;
}

function handle(method: string, path: string, body: Record<string, unknown> | undefined): unknown {
  const db = loadDb();

  if (method === 'POST' && path === '/auth/login') {
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const user = db.users.find((item) => item.email.toLowerCase() === email && item.password === password);
    if (!user) throw new Error('Incorrect email or password.');
    return { access_token: `local:${user.id}`, user: publicUser(user) };
  }

  if (method === 'POST' && path === '/auth/register') {
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const name = String(body?.name || email.split('@')[0] || 'Traveler');
    if (!email || !password) throw new Error('Name, email, and password are required.');
    if (db.users.some((item) => item.email.toLowerCase() === email)) {
      throw new Error('An account with this email already exists.');
    }
    const user: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      role: 'traveler',
      agency_id: null,
      agency: null,
    };
    db.users.push(user);
    saveDb(db);
    return { access_token: `local:${user.id}`, user: publicUser(user) };
  }

  if (method === 'GET' && path === '/auth/me') {
    return publicUser(currentUser(db));
  }

  if (method === 'POST' && path === '/agencies/onboard') {
    const user = currentUser(db);
    const agency = {
      id: Date.now(),
      name: String(body?.name || 'New Agency'),
      logo_url: body?.logo_url,
      contact_email: body?.contact_email || user.email,
      contact_phone: body?.contact_phone || '',
      subscription_tier: body?.subscription_tier || 'pro',
      has_telegram_bot: false,
      telegram_chat_id: '',
    };
    user.agency = agency;
    user.agency_id = agency.id;
    user.role = 'administrator';
    saveDb(db);
    return agency;
  }

  if (method === 'GET' && path === '/agencies/me') {
    const user = currentUser(db);
    return user.agency || {
      id: 1,
      name: 'TravelUZ',
      has_telegram_bot: false,
      telegram_chat_id: '',
      subscription_tier: 'pro',
    };
  }

  if (method === 'PATCH' && path === '/agencies/me') {
    const user = currentUser(db);
    const agency = { ...(user.agency || { id: 1, name: 'TravelUZ', subscription_tier: 'pro' }), ...body };
    if (body?.telegram_bot_token || body?.telegram_chat_id) {
      agency.has_telegram_bot = Boolean(body.telegram_bot_token || body.telegram_chat_id);
    }
    user.agency = agency;
    saveDb(db);
    return agency;
  }

  if (method === 'GET' && path === '/agencies/analytics') {
    const won = db.leads.filter((lead) => lead.status === 'won').length;
    return {
      total_leads: db.leads.length,
      new_leads: db.leads.filter((lead) => lead.status === 'new').length,
      contacted_leads: db.leads.filter((lead) => lead.status === 'contacted').length,
      negotiating_leads: db.leads.filter((lead) => lead.status === 'negotiating').length,
      won_leads: won,
      lost_leads: db.leads.filter((lead) => lead.status === 'lost').length,
      conversion_rate: db.leads.length ? Math.round((won / db.leads.length) * 100) : 0,
      total_bookings: won,
      total_revenue: db.leads.reduce((sum, lead) => sum + (lead.final_price || 0), 0) || 14500,
      leads_by_month: [
        { month: 'Apr', leads: 4, won: 1 },
        { month: 'May', leads: 6, won: 2 },
        { month: 'Jun', leads: 9, won: 2 },
        { month: 'Jul', leads: 12, won: 3 },
        { month: 'Aug', leads: 15, won: 4 },
        { month: 'Sep', leads: db.leads.length, won },
      ],
      revenue_by_month: [
        { month: 'Apr', revenue: 1500 },
        { month: 'May', revenue: 3200 },
        { month: 'Jun', revenue: 4500 },
        { month: 'Jul', revenue: 6800 },
        { month: 'Aug', revenue: 9400 },
        { month: 'Sep', revenue: 14500 },
      ],
      top_destinations: [
        { destination: 'Samarkand, Uzbekistan', requests: 12 },
        { destination: 'Bukhara, Uzbekistan', requests: 8 },
        { destination: 'Khiva, Uzbekistan', requests: 5 },
        { destination: 'Tashkent, Uzbekistan', requests: 3 },
      ],
    };
  }

  if (method === 'GET' && path === '/trips') {
    currentUser(db);
    return db.trips.map((trip) => ({
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      share_token: trip.share_token,
      content_json: trip.content_json,
    }));
  }

  if (method === 'POST' && path === '/trips/generate') {
    const destination = String(body?.destination || 'Uzbekistan');
    const days = Number(body?.days || 3);
    const budget = Number(body?.budget || 1200);
    const style = String(body?.style || 'Adventure');
    const travelers = Number(body?.travelers || 2);
    const itinerary = buildItinerary(destination, Math.max(days, 1), budget, style, travelers);
    const trip: StoredTrip = {
      id: db.nextTripId++,
      title: itinerary.title,
      destination,
      share_token: `trip-${tripIdToken()}`,
      content_json: itinerary,
      agency_name: 'TravelUZ',
    };
    db.trips.unshift(trip);
    saveDb(db);
    return { id: trip.id, share_token: trip.share_token, itinerary, raw_trip_data: itinerary };
  }

  if (method === 'POST' && path === '/trips') {
    currentUser(db);
    const content = (body?.content_json || {}) as Record<string, unknown>;
    const trip: StoredTrip = {
      id: db.nextTripId++,
      title: String(body?.title || content.title || 'New trip'),
      destination: String(body?.destination || content.title || 'Uzbekistan'),
      share_token: `trip-${tripIdToken()}`,
      content_json: content,
      agency_name: 'TravelUZ',
    };
    db.trips.unshift(trip);
    saveDb(db);
    return { id: trip.id, share_token: trip.share_token, title: trip.title, destination: trip.destination, content_json: trip.content_json };
  }

  const tripMatch = path.match(/^\/trips\/(\d+)$/);
  if (tripMatch && (method === 'PUT' || method === 'PATCH')) {
    const trip = db.trips.find((item) => item.id === Number(tripMatch[1]));
    if (!trip) throw new Error('Trip not found.');
    if (body?.title) trip.title = String(body.title);
    if (body?.content_json) trip.content_json = body.content_json as Record<string, unknown>;
    saveDb(db);
    return trip;
  }

  if (tripMatch && method === 'DELETE') {
    db.trips = db.trips.filter((item) => item.id !== Number(tripMatch[1]));
    saveDb(db);
    return { ok: true };
  }

  const shareMatch = path.match(/^\/trips\/share\/([^/]+)$/);
  if (shareMatch && method === 'GET') {
    const trip = db.trips.find((item) => item.share_token === decodeURIComponent(shareMatch[1]));
    if (!trip) throw new Error('This share link was not found on this browser.');
    return trip;
  }

  if (method === 'GET' && path === '/leads') {
    currentUser(db);
    return db.leads;
  }

  if (method === 'POST' && path === '/leads/public') {
    const shareToken = String(body?.share_token || '');
    const trip = db.trips.find((item) => item.share_token === shareToken);
    const lead: StoredLead = {
      id: db.nextLeadId++,
      agency_id: 1,
      client_name: String(body?.client_name || 'Guest'),
      client_contact: String(body?.client_contact || ''),
      source: 'public_link',
      itinerary_id: trip?.id || null,
      itinerary_title: trip?.title || null,
      status: 'new',
      notes: body?.notes ? String(body.notes) : null,
      created_at: new Date().toISOString(),
    };
    db.leads.unshift(lead);
    saveDb(db);
    return lead;
  }

  const convertMatch = path.match(/^\/leads\/(\d+)\/convert-to-booking$/);
  if (convertMatch && method === 'POST') {
    const lead = db.leads.find((item) => item.id === Number(convertMatch[1]));
    if (!lead) throw new Error('Lead not found.');
    lead.status = 'won';
    lead.final_price = Number(body?.final_price || 0);
    lead.currency = String(body?.currency || 'USD');
    saveDb(db);
    return lead;
  }

  const leadMatch = path.match(/^\/leads\/(\d+)$/);
  if (leadMatch && method === 'PATCH') {
    const lead = db.leads.find((item) => item.id === Number(leadMatch[1]));
    if (!lead) throw new Error('Lead not found.');
    if (body?.status) lead.status = body.status as StoredLead['status'];
    if (body?.notes !== undefined) lead.notes = body.notes ? String(body.notes) : null;
    saveDb(db);
    return lead;
  }

  throw new Error('This action is not available.');
}

function tripIdToken() {
  return Math.random().toString(36).slice(2, 8);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  let body: Record<string, unknown> | undefined;
  if (typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body) as Record<string, unknown>;
    } catch {
      body = undefined;
    }
  }
  const path = endpoint.startsWith('http') ? new URL(endpoint).pathname.replace(/^\/api\/v1/, '') : endpoint.split('?')[0];
  return handle(method, path, body) as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: 'DELETE', ...options }),
};
