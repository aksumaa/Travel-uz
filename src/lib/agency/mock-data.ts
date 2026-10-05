import { AgencyPackage, AgencyLead, AgencyProfile, AgencyAnalytics, VerificationDocument } from './types';

export const INITIAL_PACKAGES: AgencyPackage[] = [
  {
    id: 'pkg-1',
    title: 'Silk Road Grand Discovery: Samarkand, Bukhara & Khiva',
    destination: 'Uzbekistan',
    shortDescription: 'Comprehensive 8-day UNESCO heritage expedition traversing Registan, Po-i-Kalyan, and the Ichan-Kala citadel.',
    fullDescription: 'Experience the crown jewels of Central Asian architecture. This signature itinerary is curated for cultural connoisseurs, featuring private masterclass ceramics in Gijduvan, sunrise photography access at Shah-i-Zinda, and high-speed Afrosiyob rail transfers between imperial oases.',
    durationDays: 8,
    startDate: '2026-05-10',
    endDate: '2026-05-18',
    groupSizeMin: 2,
    groupSizeMax: 12,
    priceUSD: 1250,
    currency: 'USD',
    hotelName: 'Orient Star Heritage & Kosh Havuz Boutique',
    hotelCategory: 'Heritage Riad',
    roomType: 'Deluxe Courtyard King',
    inclusions: {
      transfer: true,
      meals: true,
      guide: true,
      activities: true,
    },
    itinerary: [
      { day: 1, time: '09:00', activity: 'Tashkent Metro & Old City Chorsu Bazaar', location: 'Tashkent', description: 'Meet private guide at hotel lobby. Visit Hazrati Imam complex, admire 7th century Uthman Quran, followed by culinary lunch.' },
      { day: 2, time: '08:00', activity: 'Afrosiyob Bullet Train to Samarkand & Registan Square', location: 'Samarkand', description: 'Early high-speed train arrival. Private afternoon access to Registan Madrasahs and Gur-e-Amir mausoleum.' },
      { day: 3, time: '09:30', activity: 'Shah-i-Zinda Avenue of Mausoleums & Konigil Silk Paper', location: 'Samarkand', description: 'Morning guided walk through turquoise tileworks. Afternoon ancient watermill silk paper workshop.' },
      { day: 4, time: '09:00', activity: 'Scenic Drive through Kyzylkum Desert to Sacred Bukhara', location: 'Bukhara', description: 'Cross the ancient trade routes. Sunset tea on the Lyabi-Hauz pool plaza with local spiced almond pastries.' },
      { day: 5, time: '09:00', activity: 'Ark Fortress, Po-i-Kalyan Mosque & Trading Domes', location: 'Bukhara', description: 'Explore ancient royal citadel, 12th-century Kalyan Minaret, and artisan carpet weavers.' },
      { day: 6, time: '08:30', activity: 'Road to Khiva & Amu Darya River Crossing', location: 'Khiva', description: 'Journey along the Oxus River into the Khorezm oasis. Check-in to boutique hotel inside the ancient walled city.' },
      { day: 7, time: '09:00', activity: 'Ichan-Kala Citadel Open-Air Museum Exploration', location: 'Khiva', description: 'Climb Islom Khodja minaret for 360-degree panorama. Sunset dinner with traditional chorezmian music.' },
      { day: 8, time: '10:00', activity: 'Urgenc Airport Transfer & Departure Flight', location: 'Urgench', description: 'Private luxury transfer to Urgench International Airport (UGC) for onward connection.' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
    ],
    contactPhone: '+998 66 233 4545',
    contactEmail: 'tours@marakandatravel.uz',
    contactWebsite: 'https://marakandatravel.uz',
    contactTelegram: '@MarakandaToursBot',
    status: 'published',
    viewsCount: 2420,
    leadsCount: 54,
    rating: 4.95,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-04-01T14:30:00Z'
  },
  {
    id: 'pkg-2',
    title: 'Cappadocia Sunrise Balloon & Underground Cities Retreat',
    destination: 'Turkey',
    shortDescription: '4-day private cave suite experience with sunrise hot air balloon flight and Love Valley hiking.',
    fullDescription: 'Immerse in fairy chimneys and subterranean monasteries. Includes sunrise hot air balloon flight over Goreme, private sommelier wine tasting in Urgup, and private exploration of Derinkuyu subterranean city.',
    durationDays: 4,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    groupSizeMin: 2,
    groupSizeMax: 8,
    priceUSD: 680,
    currency: 'USD',
    hotelName: 'Museum Hotel & Sacred Cave Suites',
    hotelCategory: 'Boutique',
    roomType: 'Cave Terrace Suite with Heated Plunge Pool',
    inclusions: {
      transfer: true,
      meals: true,
      guide: true,
      activities: true,
    },
    itinerary: [
      { day: 1, time: '14:00', activity: 'Kayseri Airport Transfer & Sunset Rose Valley', location: 'Goreme', description: 'Check-in to luxury cave hotel. Champagne sunset toast overlooking Rose Valley.' },
      { day: 2, time: '05:30', activity: 'Hot Air Balloon Flight & Goreme Open Air Museum', location: 'Goreme', description: 'Sunrise basket flight followed by private guided frescoes tour in rock churches.' },
      { day: 3, time: '09:00', activity: 'Derinkuyu Underground City & Ihlara Canyon Hike', location: 'Ihlara', description: 'Descend 8 levels underground, followed by gentle riverside trail walk and trout lunch.' },
      { day: 4, time: '11:00', activity: 'Uchisar Castle Panorama & Airport Transfer', location: 'Nevsehir', description: 'Final viewpoint photography session and private transfer to airport.' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
    ],
    contactPhone: '+90 384 271 2233',
    contactEmail: 'concierge@cappadociavoyages.com',
    contactWebsite: 'https://cappadociavoyages.com',
    status: 'published',
    viewsCount: 3180,
    leadsCount: 82,
    rating: 5.0,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-03-25T11:20:00Z'
  },
  {
    id: 'pkg-3',
    title: 'Sahara Nomadic Camel Caravan & Star Gazing Expedition',
    destination: 'Niger & North Africa',
    shortDescription: '6-day deep desert dunes journey through the blue-veiled Tuareg routes of Tenere.',
    fullDescription: 'Venture into the heart of the Sahara. Sleep in luxury desert pavilions, hear ancestral Berber storytelling around cedarwood fires, and traverse golden Erg dunes by camel and 4x4.',
    durationDays: 6,
    startDate: '2026-11-12',
    endDate: '2026-11-18',
    groupSizeMin: 4,
    groupSizeMax: 10,
    priceUSD: 1100,
    currency: 'USD',
    hotelName: 'Tenere Oasis Royal Camp',
    hotelCategory: 'Eco-Lodge',
    roomType: 'Nomad Glamping Pavilion',
    inclusions: {
      transfer: true,
      meals: true,
      guide: true,
      activities: true,
    },
    itinerary: [
      { day: 1, time: '10:00', activity: 'Agadez Arrival & Grand Mosque Visit', location: 'Agadez', description: 'Welcome by Tuareg hosts, mudbrick architecture tour.' },
      { day: 2, time: '08:00', activity: '4x4 Departure into Tenere Sea of Sand', location: 'Tenere Desert', description: 'Dune navigation, setting up nomadic camp.' },
      { day: 3, time: '09:00', activity: 'Arbre du Tenere & Prehistoric Rock Petroglyphs', location: 'Air Mountains', description: 'Ancient rock art exploration in volcanic massifs.' },
      { day: 4, time: '16:00', activity: 'Sunset Camel Trekking & Night Astronomy', location: 'Timia Oasis', description: 'Zero-light-pollution telescope stargazing.' },
      { day: 5, time: '10:00', activity: 'Timia Waterfall Oasis & Citrus Orchards', location: 'Timia', description: 'Fresh dates harvest and local artisan silver market.' },
      { day: 6, time: '12:00', activity: 'Return to Agadez & Farewell Feast', location: 'Agadez', description: 'Traditional taguella bread baking and transfer to airport.' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    contactPhone: '+227 20 44 11 22',
    contactEmail: 'expeditions@sahelsafari.com',
    status: 'draft',
    viewsCount: 420,
    leadsCount: 9,
    rating: 4.85,
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-03-10T09:15:00Z'
  }
];

export const INITIAL_LEADS: AgencyLead[] = [
  {
    id: 'lead-101',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah.j@gmail.com',
    travelerPhone: '+1 (555) 234-8901',
    packageId: 'pkg-1',
    packageName: 'Silk Road Grand Discovery',
    destination: 'Samarkand, Uzbekistan',
    travelDates: 'May 12 – May 20, 2026',
    travelersCount: 2,
    budgetUSD: 2500,
    status: 'new',
    message: 'Hello! We are celebrating our 10th anniversary. Can we upgrade to a private suite with Registan balcony view?',
    notes: [
      { id: 'note-1', author: 'Dilshod (Agency Manager)', text: 'Checked Orient Star suite availability for May 12. Looks open. Preparing custom quote.', createdAt: '2026-04-02T10:15:00Z' }
    ],
    createdAt: '2026-04-02T09:30:00Z',
    updatedAt: '2026-04-02T10:15:00Z'
  },
  {
    id: 'lead-102',
    travelerName: 'Jean Dupont',
    travelerEmail: 'j.dupont@orange.fr',
    travelerPhone: '+33 6 12 34 56 78',
    packageId: 'pkg-2',
    packageName: 'Cappadocia Sunrise Balloon & Underground Cities',
    destination: 'Cappadocia, Turkey',
    travelDates: 'Jun 10 – Jun 14, 2026',
    travelersCount: 4,
    budgetUSD: 3200,
    status: 'contacted',
    message: 'We are a family of 4 (2 teenagers). Do you provide vegetarian meal options during the cave dinner?',
    notes: [
      { id: 'note-2', author: 'Elena (Tour Coordinator)', text: 'Sent email confirming vegetarian and Halal options at Sacred Cave restaurant. Awaiting dates reconfirmation.', createdAt: '2026-04-01T16:00:00Z' }
    ],
    createdAt: '2026-04-01T11:20:00Z',
    updatedAt: '2026-04-01T16:00:00Z'
  },
  {
    id: 'lead-103',
    travelerName: 'Tariq Al-Mansoor',
    travelerEmail: 'tariq@gulfmedia.ae',
    travelerPhone: '+971 50 889 1234',
    packageId: 'pkg-1',
    packageName: 'Silk Road Grand Discovery',
    destination: 'Uzbekistan',
    travelDates: 'Jul 04 – Jul 12, 2026',
    travelersCount: 6,
    budgetUSD: 9500,
    status: 'qualified',
    message: 'Executive VIP trip for our board partners. Need Mercedes Sprinter VIP transfer and English/Arabic bilingual certified heritage guide.',
    notes: [
      { id: 'note-3', author: 'Dilshod (Agency Manager)', text: 'VIP Mercedes Sprinter reserved with driver Shavkat. Guide Mansur assigned (fluent Arabic). Deposit invoice sent.', createdAt: '2026-03-29T14:10:00Z' }
    ],
    createdAt: '2026-03-28T18:40:00Z',
    updatedAt: '2026-03-29T14:10:00Z'
  },
  {
    id: 'lead-104',
    travelerName: 'Elena Rostova',
    travelerEmail: 'elena.rost@yandex.ru',
    travelerPhone: '+7 916 555-0199',
    packageId: 'pkg-1',
    packageName: 'Silk Road Grand Discovery',
    destination: 'Samarkand, Uzbekistan',
    travelDates: 'Sep 05 – Sep 13, 2026',
    travelersCount: 2,
    budgetUSD: 2400,
    status: 'closed',
    message: 'Confirmed booking for September autumn festival. All rail tickets and hotel vouchers received. Thank you!',
    notes: [
      { id: 'note-4', author: 'Dilshod (Agency Manager)', text: 'Payment received via bank transfer. Booking marked WON & CLOSED. Vouchers emailed.', createdAt: '2026-03-20T12:00:00Z' }
    ],
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z'
  },
  {
    id: 'lead-105',
    travelerName: 'Markus Lindholm',
    travelerEmail: 'markus@nordic-travels.fi',
    travelerPhone: '+358 40 123 4567',
    packageId: 'pkg-3',
    packageName: 'Sahara Nomadic Camel Caravan',
    destination: 'Niger Desert',
    travelDates: 'Nov 12 – Nov 18, 2026',
    travelersCount: 2,
    budgetUSD: 2200,
    status: 'archived',
    message: 'Inquired about photography equipment permits for commercial drone filming.',
    notes: [
      { id: 'note-5', author: 'Staff', text: 'Drone permits require military clearance not feasible in timeframe. Lead archived gracefully.', createdAt: '2026-03-12T15:00:00Z' }
    ],
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-12T15:00:00Z'
  }
];

export const INITIAL_PROFILE: AgencyProfile = {
  name: 'Marakanda Silk Road Travel DMC',
  logoUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=200&q=80',
  licenseNumber: 'UZ-TO-2024-8891-DMC',
  ownerName: 'Dilshod Akbarjonov',
  description: 'Premier accredited Destination Management Company (DMC) based in Samarkand and Tashkent. Specializing in bespoke cultural Silk Road itineraries, high-speed rail packages, luxury desert retreats, and verified private guides across Uzbekistan and Central Asia.',
  country: 'Uzbekistan',
  city: 'Samarkand',
  address: '14 University Boulevard, Registan Quarter',
  phone: '+998 66 233 4545',
  email: 'info@marakandatravel.uz',
  website: 'https://marakandatravel.uz',
  telegramContact: '@MarakandaAgencyAdmin',
  languages: ['English', 'Uzbek', 'Russian', 'French', 'German'],
  specializations: ['UNESCO Heritage Expeditions', 'VIP Train Journeys', 'Gastronomy & Culinary Tours', 'Small Group Adventures'],
  verificationStatus: 'verified',
  subscriptionTier: 'pro'
};

export const INITIAL_DOCUMENTS: VerificationDocument[] = [
  { id: 'doc-1', name: 'Tourism_Operator_License_2026.pdf', type: 'Official License', status: 'approved', uploadedAt: '2026-01-10' },
  { id: 'doc-2', name: 'Liability_Insurance_Certificate.pdf', type: 'Insurance Coverage', status: 'approved', uploadedAt: '2026-01-12' },
  { id: 'doc-3', name: 'Tax_Registration_Certificate.pdf', type: 'Tax Identification', status: 'approved', uploadedAt: '2026-01-15' }
];

export const INITIAL_ANALYTICS: AgencyAnalytics = {
  totalViews: 6020,
  newLeads: 145,
  publishedPackages: 2,
  draftPackages: 1,
  leadConversionRate: 8.4,
  topPackages: [
    { id: 'pkg-1', name: 'Silk Road Grand Discovery', views: 2420, leads: 54, conversion: 9.2 },
    { id: 'pkg-2', name: 'Cappadocia Sunrise Balloon', views: 3180, leads: 82, conversion: 8.8 },
    { id: 'pkg-3', name: 'Sahara Nomadic Caravan', views: 420, leads: 9, conversion: 4.5 }
  ],
  timeline: [
    { date: 'Mon', views: 540, leads: 14, conversions: 2 },
    { date: 'Tue', views: 720, leads: 19, conversions: 3 },
    { date: 'Wed', views: 880, leads: 24, conversions: 4 },
    { date: 'Thu', views: 950, leads: 22, conversions: 3 },
    { date: 'Fri', views: 1120, leads: 28, conversions: 5 },
    { date: 'Sat', views: 1040, leads: 21, conversions: 3 },
    { date: 'Sun', views: 770, leads: 17, conversions: 2 }
  ]
};
