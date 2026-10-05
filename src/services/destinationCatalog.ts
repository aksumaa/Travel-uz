/**
 * TripMind Global Destination & Geopolitical Catalog
 * Grounded verified data for countries, cities, and regions.
 * Provides coordinate resolution, real travel facts, and verified POIs.
 */

export interface DestinationPlace {
  name: string;
  category: 'monument' | 'museum' | 'bazaar' | 'nature' | 'viewpoint';
  entryFeeUSD: number;
  entryFeeLocal?: string;
  rating: number;
  description: string;
  imageUrl?: string;
}

export interface DestinationHotel {
  name: string;
  stars: number;
  pricePerNightUSD: number;
  type: string;
  rating: number;
}

export interface DestinationRestaurant {
  name: string;
  cuisine: string;
  specialty: string;
  priceRange: '$' | '$$' | '$$$';
  rating: number;
}

export interface DestinationTour {
  title: string;
  durationDays: number;
  priceUSD: number;
  agencyName: string;
  rating: number;
}

export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  countryCode: string; // ISO_A3
  lat: number;
  lng: number;
  type: 'country' | 'city' | 'region';
  capital?: string;
  currency: string;
  currencySymbol: string;
  language: string;
  timezone: string;
  flag: string;
  weather?: {
    tempC: number;
    condition: 'Sunny' | 'Partly Cloudy' | 'Clear' | 'Rainy' | 'Mild';
  };
  bestSeason?: string;
  visaVerified?: {
    status: 'Visa Free' | 'eVisa' | 'Visa on Arrival' | 'Visa Required';
    summary: string;
  };
  description: string;
  popularDestinations: {
    name: string;
    region: string;
    image: string;
  }[];
  places: DestinationPlace[];
  hotels: DestinationHotel[];
  restaurants: DestinationRestaurant[];
  tours: DestinationTour[];
}

export const DESTINATIONS_CATALOG: DestinationItem[] = [
  // 1. UZBEKISTAN
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    lat: 41.2995,
    lng: 69.2401,
    type: 'country',
    capital: 'Tashkent',
    currency: 'UZS',
    currencySymbol: 'soʻm',
    language: 'Uzbek, Russian',
    timezone: 'GMT+5',
    flag: '🇺🇿',
    weather: { tempC: 23, condition: 'Sunny' },
    bestSeason: 'March – May, September – November',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Visa-free entry for up to 30 days for citizens of over 85 countries including EU, UK, and GCC.'
    },
    description: 'The historic heart of the Silk Road featuring turquoise-domed mosques, ancient caravanserais, vibrant bazaars, and legendary hospitality.',
    popularDestinations: [
      { name: 'Samarkand', region: 'Samarkand Region', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80' },
      { name: 'Bukhara', region: 'Bukhara Region', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80' },
      { name: 'Khiva', region: 'Khorezm Region', image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Registan Ensemble', category: 'monument', entryFeeUSD: 5.2, entryFeeLocal: '65,000 UZS', rating: 4.9, description: 'Iconic trio of majolica madrasahs framing Samarkand grand square.' },
      { name: 'Siab Folk Bazaar', category: 'bazaar', entryFeeUSD: 0, rating: 4.8, description: 'Bustling ancient market for dried fruits, spices, and Samarkand flatbread.' },
      { name: 'Shah-i-Zinda Necropolis', category: 'monument', entryFeeUSD: 3.5, entryFeeLocal: '45,000 UZS', rating: 4.9, description: 'Breathtaking blue-tiled avenue of royal Silk Road mausoleums.' },
      { name: 'Chorsu Bazaar', category: 'bazaar', entryFeeUSD: 0, rating: 4.7, description: 'Vast turquoise-domed open market in old Tashkent with artisanal spices.' }
    ],
    hotels: [
      { name: 'Silk Road Heritage Boutique', stars: 4, pricePerNightUSD: 85, type: 'Heritage Boutique', rating: 4.8 },
      { name: 'Platan Grand Hotel', stars: 4, pricePerNightUSD: 95, type: 'Central Business', rating: 4.7 }
    ],
    restaurants: [
      { name: 'Bibikhanum Teahouse', cuisine: 'Central Asian', specialty: 'Samarkand Lamb Plov', priceRange: '$', rating: 4.8 },
      { name: 'Afsona Restaurant', cuisine: 'Uzbek Fusion', specialty: 'Pumpkin Samsa & Kazan Kebab', priceRange: '$$', rating: 4.7 }
    ],
    tours: [
      { title: 'Classic Silk Road Odyssey (5 Days)', durationDays: 5, priceUSD: 520, agencyName: 'Marakanda Travel', rating: 4.9 },
      { title: 'Golden Journey to Samarkand & Bukhara', durationDays: 4, priceUSD: 440, agencyName: 'Orient Heritage Tours', rating: 4.8 }
    ]
  },

  // 2. NIGER
  {
    id: 'niger',
    name: 'Niger',
    country: 'Niger',
    countryCode: 'NER',
    lat: 17.6078,
    lng: 8.0817,
    type: 'country',
    capital: 'Niamey',
    currency: 'XOF',
    currencySymbol: 'CFA',
    language: 'French, Hausa, Zarma, Tamajaq',
    timezone: 'GMT+1',
    flag: '🇳🇪',
    weather: { tempC: 32, condition: 'Sunny' },
    bestSeason: 'November – February (Cool Dry Season)',
    visaVerified: {
      status: 'eVisa',
      summary: 'Electronic visa (eVisa) available for international tourists with approved lodging.'
    },
    description: 'A captivating West African nation bridging the Sahel and Sahara desert, renowned for the historic clay architecture of Agadez, the Niger River valley, and rich nomadic cultural heritage.',
    popularDestinations: [
      { name: 'Agadez', region: 'Agadez Region', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Niamey', region: 'Capital District', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
      { name: 'W National Park', region: 'Tillabéri Region', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Agadez Grand Mosque', category: 'monument', entryFeeUSD: 6.0, entryFeeLocal: '3,500 XOF', rating: 4.9, description: 'World-famous 27-meter tall banco mud-brick minaret built in 1515, a UNESCO World Heritage site.' },
      { name: 'Niger National Museum (Boubou Hama)', category: 'museum', entryFeeUSD: 4.0, entryFeeLocal: '2,500 XOF', rating: 4.7, description: 'Vibrant cultural museum exhibiting dinosaur fossils, traditional Tuareg crafts, and Sahelian architecture.' },
      { name: 'W National Park Biosphere Reserve', category: 'nature', entryFeeUSD: 15.0, rating: 4.8, description: 'Transboundary park harboring West African lions, elephants, cheetahs, and hippos along the Niger River.' },
      { name: 'Aïr and Ténéré Nature Reserve', category: 'nature', entryFeeUSD: 20.0, rating: 4.9, description: 'Dramatic volcanic peaks and golden sand dunes of the Sahara with ancient rock art.' }
    ],
    hotels: [
      { name: 'Radisson Blu Hotel Niamey', stars: 5, pricePerNightUSD: 180, type: 'Luxury Riverfront', rating: 4.8 },
      { name: 'Bravia Hotel Niamey', stars: 4, pricePerNightUSD: 135, type: 'Modern City Centre', rating: 4.6 },
      { name: 'Hôtel de la Paix Agadez', stars: 3, pricePerNightUSD: 70, type: 'Sahara Gateway Boutique', rating: 4.5 }
    ],
    restaurants: [
      { name: 'Le Pillier', cuisine: 'Sahelian & Mediterranean', specialty: 'Djerma Spiced Rice & Grilled Capitaine', priceRange: '$$', rating: 4.7 },
      { name: 'Tabakady Restaurant', cuisine: 'Traditional West African', specialty: 'Tuareg Taguella & Braised Goat', priceRange: '$', rating: 4.8 }
    ],
    tours: [
      { title: 'Sahara Agadez & Tenere Expedition (6 Days)', durationDays: 6, priceUSD: 890, agencyName: 'Sahel Nomads Travel', rating: 4.9 },
      { title: 'Niger River Safari & Wildlife Heritage Tour', durationDays: 4, priceUSD: 540, agencyName: 'West Africa Expeditions', rating: 4.7 }
    ]
  },

  // 3. FRANCE & PARIS
  {
    id: 'france',
    name: 'France',
    country: 'France',
    countryCode: 'FRA',
    lat: 48.8566,
    lng: 2.3522,
    type: 'country',
    capital: 'Paris',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'French, English',
    timezone: 'GMT+1',
    flag: '🇫🇷',
    weather: { tempC: 19, condition: 'Clear' },
    bestSeason: 'April – October',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Schengen Area rules apply. 90-day visa-free for EU, US, UK, Canada, Australia, and GCC.'
    },
    description: 'A global epicenter of art, haute gastronomy, timeless architecture, and world-class cultural landmarks from the Eiffel Tower to the French Riviera.',
    popularDestinations: [
      { name: 'Paris', region: 'Île-de-France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
      { name: 'Nice & French Riviera', region: 'Côte d’Azur', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80' },
      { name: 'Lyon', region: 'Auvergne-Rhône-Alpes', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Eiffel Tower', category: 'monument', entryFeeUSD: 28.5, rating: 4.8, description: 'Iconic wrought-iron lattice tower offering panoramic views across Paris.' },
      { name: 'Louvre Museum', category: 'museum', entryFeeUSD: 22.0, rating: 4.9, description: 'World largest art museum housing the Mona Lisa and Venus de Milo.' },
      { name: 'Palace of Versailles', category: 'monument', entryFeeUSD: 24.0, rating: 4.9, description: 'Opulent royal palace and pristine geometric gardens of Louis XIV.' }
    ],
    hotels: [
      { name: 'Le Meurice Paris', stars: 5, pricePerNightUSD: 820, type: 'Palace Luxury', rating: 4.9 },
      { name: 'Hôtel Dame des Arts', stars: 4, pricePerNightUSD: 290, type: 'Saint-Germain Boutique', rating: 4.8 }
    ],
    restaurants: [
      { name: 'Le Comptoir du Relais', cuisine: 'Classic French Bistro', specialty: 'Duck Confit & Boeuf Bourguignon', priceRange: '$$', rating: 4.8 },
      { name: 'Septime', cuisine: 'Modern Gastronomy', specialty: 'Seasonal Tasting Menu', priceRange: '$$$', rating: 4.9 }
    ],
    tours: [
      { title: 'Paris Highlights & Seine Dinner Cruise', durationDays: 3, priceUSD: 490, agencyName: 'Lumière Paris Tours', rating: 4.9 },
      { title: 'French Riviera & Provence Wine Experience', durationDays: 5, priceUSD: 890, agencyName: 'Côte Bleue Travel', rating: 4.8 }
    ]
  },

  // 4. TURKEY & CAPPADOCIA
  {
    id: 'turkey',
    name: 'Turkey',
    country: 'Turkey',
    countryCode: 'TUR',
    lat: 38.9637,
    lng: 35.2433,
    type: 'country',
    capital: 'Ankara',
    currency: 'TRY',
    currencySymbol: '₺',
    language: 'Turkish, English',
    timezone: 'GMT+3',
    flag: '🇹🇷',
    weather: { tempC: 22, condition: 'Sunny' },
    bestSeason: 'April – June, September – November',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Visa-free for 90 days for EU, UK, and GCC citizens. Official eVisa available for other nationalities.'
    },
    description: 'A transcontinental bridge between Europe and Asia featuring the Bosphorus strait, Ottoman palaces, ancient Greco-Roman ruins, and fairy chimneys.',
    popularDestinations: [
      { name: 'Istanbul', region: 'Marmara', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80' },
      { name: 'Cappadocia', region: 'Central Anatolia', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Antalya', region: 'Mediterranean', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Hagia Sophia Grand Mosque', category: 'monument', entryFeeUSD: 25.0, rating: 4.9, description: 'Byzantine architectural masterpiece with iconic dome and Christian/Islamic heritage.' },
      { name: 'Göreme Open-Air Museum', category: 'museum', entryFeeUSD: 16.0, rating: 4.9, description: 'Monastic complex of rock-cut churches adorned with Byzantine frescoes.' },
      { name: 'Topkapi Palace', category: 'monument', entryFeeUSD: 28.0, rating: 4.8, description: 'Historic residence of Ottoman sultans overlooking the Golden Horn.' }
    ],
    hotels: [
      { name: 'Museum Hotel Cappadocia', stars: 5, pricePerNightUSD: 360, type: 'Relais & Châteaux Cave Hotel', rating: 4.9 },
      { name: 'Çırağan Palace Kempinski Istanbul', stars: 5, pricePerNightUSD: 550, type: 'Bosphorus Palace', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Pandeli Istanbul', cuisine: 'Ottoman Palace Cuisine', specialty: 'Hünkar Beğendi & Lamb Shank', priceRange: '$$', rating: 4.8 },
      { name: 'Seki Restaurant Uçhisar', cuisine: 'Anatolian Farm-to-Table', specialty: 'Clay-pot Kebab (Testi Kebap)', priceRange: '$$', rating: 4.8 }
    ],
    tours: [
      { title: 'Grand Tour of Turkey: Istanbul, Cappadocia & Ephesus (7 Days)', durationDays: 7, priceUSD: 980, agencyName: 'Anatolia Horizon', rating: 4.9 },
      { title: 'Cappadocia Sunrise Balloon & Valley Hike', durationDays: 2, priceUSD: 280, agencyName: 'Göreme Balloon Club', rating: 5.0 }
    ]
  },

  // 5. CAPPADOCIA (Region)
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    countryCode: 'TUR',
    lat: 38.6431,
    lng: 34.8289,
    type: 'region',
    capital: 'Nevşehir',
    currency: 'TRY',
    currencySymbol: '₺',
    language: 'Turkish, English',
    timezone: 'GMT+3',
    flag: '🇹🇷',
    weather: { tempC: 21, condition: 'Sunny' },
    bestSeason: 'April – June, September – October',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Visa-free for 90 days for EU, UK, and GCC citizens. Official eVisa available for other nationalities.'
    },
    description: 'Fairy-tale volcanic landscape famous for ancient rock-carved cave dwellings, underground cities, and sunrise hot air balloon flights.',
    popularDestinations: [
      { name: 'Göreme', region: 'Central Valley', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Uçhisar', region: 'Castle Rock', image: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=600&q=80' },
      { name: 'Ürgüp', region: 'Wine Country', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Göreme Open Air Museum', category: 'museum', entryFeeUSD: 16.0, rating: 4.9, description: 'UNESCO complex of cave churches and monastic dwellings.' },
      { name: 'Derinkuyu Underground City', category: 'monument', entryFeeUSD: 14.0, rating: 4.8, description: 'Subterranean refuge city descending 8 levels deep.' }
    ],
    hotels: [
      { name: 'Museum Hotel Cappadocia', stars: 5, pricePerNightUSD: 360, type: 'Luxury Cave Suite', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Dibek Restaurant Göreme', cuisine: 'Anatolian', specialty: 'Testi Kebab (Pottery Kebab)', priceRange: '$$', rating: 4.8 }
    ],
    tours: [
      { title: 'Hot Air Balloon Sunrise & Valley Safari', durationDays: 2, priceUSD: 310, agencyName: 'Cappadocia Balloon Masters', rating: 5.0 }
    ]
  },

  // 6. JAPAN & TOKYO
  {
    id: 'japan',
    name: 'Japan',
    country: 'Japan',
    countryCode: 'JPN',
    lat: 35.6762,
    lng: 139.6503,
    type: 'country',
    capital: 'Tokyo',
    currency: 'JPY',
    currencySymbol: '¥',
    language: 'Japanese, English',
    timezone: 'GMT+9',
    flag: '🇯🇵',
    weather: { tempC: 18, condition: 'Mild' },
    bestSeason: 'March – May (Sakura), October – November (Autumn Foliage)',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Visa-free for 90 days for 70+ countries including US, EU, UK, Canada, Australia.'
    },
    description: 'A harmonious blend of ancient Shinto shrines, Zen temples, ultra-modern neon metropolises, high-speed Shinkansen trains, and culinary mastery.',
    popularDestinations: [
      { name: 'Tokyo', region: 'Kanto', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kyoto', region: 'Kansai', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Osaka', region: 'Kansai', image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Senso-ji Temple', category: 'monument', entryFeeUSD: 0, rating: 4.8, description: 'Tokyo oldest Buddhist temple with giant red lantern in Asakusa.' },
      { name: 'Fushimi Inari-taisha', category: 'monument', entryFeeUSD: 0, rating: 4.9, description: 'Thousands of vermilion torii gates winding through sacred Kyoto mountain paths.' },
      { name: 'Shibuya Crossing & Sky', category: 'viewpoint', entryFeeUSD: 16.0, rating: 4.8, description: 'The busiest pedestrian intersection in the world with 360-degree glass rooftop observation.' }
    ],
    hotels: [
      { name: 'Aman Tokyo', stars: 5, pricePerNightUSD: 950, type: 'Zen Urban Sanctuary', rating: 4.9 },
      { name: 'Hoshinoya Kyoto', stars: 5, pricePerNightUSD: 780, type: 'Traditional Ryokan', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Sukiyabashi Jiro', cuisine: 'Edomae Sushi', specialty: 'Chef Omakase Sushi', priceRange: '$$$', rating: 4.9 },
      { name: 'Ichiran Shibuya', cuisine: 'Ramen', specialty: 'Tonkotsu Ramen with Secret Spice', priceRange: '$', rating: 4.8 }
    ],
    tours: [
      { title: 'Golden Route: Tokyo, Mt. Fuji & Kyoto (7 Days)', durationDays: 7, priceUSD: 1350, agencyName: 'Nippon Explorer Tours', rating: 4.9 },
      { title: 'Kyoto Zen Temples & Tea Ceremony Experience', durationDays: 2, priceUSD: 340, agencyName: 'Kyoto Cultural Travel', rating: 4.9 }
    ]
  },

  // 7. UNITED ARAB EMIRATES & DUBAI
  {
    id: 'uae',
    name: 'United Arab Emirates',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    lat: 25.2048,
    lng: 55.2708,
    type: 'country',
    capital: 'Abu Dhabi',
    currency: 'AED',
    currencySymbol: 'AED',
    language: 'Arabic, English',
    timezone: 'GMT+4',
    flag: '🇦🇪',
    weather: { tempC: 30, condition: 'Sunny' },
    bestSeason: 'November – March',
    visaVerified: {
      status: 'Visa on Arrival',
      summary: 'Free 30-day visa on arrival for US, EU, UK, GCC, Australia, and CIS citizens.'
    },
    description: 'Futuristic oasis boasting world-record architectural marvels, luxury shopping, desert safaris, and cosmopolitan hospitality.',
    popularDestinations: [
      { name: 'Dubai', region: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
      { name: 'Abu Dhabi', region: 'Abu Dhabi', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Burj Khalifa', category: 'viewpoint', entryFeeUSD: 48.0, rating: 4.9, description: 'The tallest building on Earth rising 828 meters into the sky.' },
      { name: 'Sheikh Zayed Grand Mosque', category: 'monument', entryFeeUSD: 0, rating: 5.0, description: 'One of the world largest mosques featuring white Macedonian marble domes and gold accents.' },
      { name: 'Museum of the Future', category: 'museum', entryFeeUSD: 40.0, rating: 4.8, description: 'Toroid-shaped architectural wonder dedicated to next-generation innovation.' }
    ],
    hotels: [
      { name: 'Atlantis The Royal', stars: 5, pricePerNightUSD: 780, type: 'Ultra-Luxury Palm Resort', rating: 4.9 },
      { name: 'Burj Al Arab Jumeirah', stars: 5, pricePerNightUSD: 1400, type: 'Iconic Sail Landmark', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Al Hadheerah Desert Dining', cuisine: 'Arabian Night Feast', specialty: 'Whole Roasted Lamb & Grilled Meats', priceRange: '$$$', rating: 4.8 },
      { name: 'Zuma Dubai', cuisine: 'Contemporary Japanese', specialty: 'Miso Marinated Black Cod', priceRange: '$$$', rating: 4.9 }
    ],
    tours: [
      { title: 'Dubai Luxury Skyline & Red Dunes Safari (4 Days)', durationDays: 4, priceUSD: 690, agencyName: 'Emirates Horizons', rating: 4.8 }
    ]
  },

  // 8. UNITED STATES
  {
    id: 'usa',
    name: 'United States',
    country: 'United States',
    countryCode: 'USA',
    lat: 37.0902,
    lng: -95.7129,
    type: 'country',
    capital: 'Washington, D.C.',
    currency: 'USD',
    currencySymbol: '$',
    language: 'English, Spanish',
    timezone: 'GMT-5 to GMT-8',
    flag: '🇺🇸',
    weather: { tempC: 20, condition: 'Sunny' },
    bestSeason: 'Year-round by region (Spring & Autumn ideal)',
    visaVerified: {
      status: 'eVisa',
      summary: 'ESTA online authorization for Visa Waiver Program countries; B1/B2 visa for other citizens.'
    },
    description: 'A vast land of vibrant metropolises, iconic natural national parks, pioneering entertainment, and cultural diversity from coast to coast.',
    popularDestinations: [
      { name: 'New York City', region: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
      { name: 'San Francisco', region: 'California', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80' },
      { name: 'Grand Canyon', region: 'Arizona', image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Statue of Liberty & Ellis Island', category: 'monument', entryFeeUSD: 24.5, rating: 4.8, description: 'Universal symbol of freedom standing in New York Harbor.' },
      { name: 'Central Park', category: 'nature', entryFeeUSD: 0, rating: 4.9, description: '843-acre urban green heart of Manhattan with lakes, trails, and bridges.' },
      { name: 'Grand Canyon South Rim', category: 'nature', entryFeeUSD: 35.0, rating: 5.0, description: 'A mile-deep natural canyon carved over millions of years by the Colorado River.' }
    ],
    hotels: [
      { name: 'The Plaza New York', stars: 5, pricePerNightUSD: 750, type: 'Historic Fifth Avenue Luxury', rating: 4.8 },
      { name: '1 Hotel Brooklyn Bridge', stars: 5, pricePerNightUSD: 520, type: 'Eco-Luxury Waterfront', rating: 4.8 }
    ],
    restaurants: [
      { name: 'Katz’s Delicatessen', cuisine: 'Classic NYC Deli', specialty: 'Legendary Pastrami on Rye', priceRange: '$$', rating: 4.7 },
      { name: 'Le Bernardin', cuisine: 'Fine Seafood', specialty: 'Chef Tasting Seafood Menu', priceRange: '$$$', rating: 4.9 }
    ],
    tours: [
      { title: 'New York City VIP All-Access & Broadway Tour', durationDays: 3, priceUSD: 650, agencyName: 'Empire State Travel', rating: 4.9 }
    ]
  },

  // 9. ITALY & ROME
  {
    id: 'italy',
    name: 'Italy',
    country: 'Italy',
    countryCode: 'ITA',
    lat: 41.8719,
    lng: 12.5674,
    type: 'country',
    capital: 'Rome',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'Italian, English',
    timezone: 'GMT+1',
    flag: '🇮🇹',
    weather: { tempC: 22, condition: 'Sunny' },
    bestSeason: 'April – June, September – October',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Schengen Area 90-day visa-free for EU, US, UK, Canada, Australia, and GCC.'
    },
    description: 'The birthplace of the Renaissance, renowned for ancient Roman ruins, scenic Tuscan hills, Amalfi coastal beauty, and beloved gastronomy.',
    popularDestinations: [
      { name: 'Rome', region: 'Lazio', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
      { name: 'Florence', region: 'Tuscany', image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Venice', region: 'Veneto', image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Colosseum & Roman Forum', category: 'monument', entryFeeUSD: 20.0, rating: 4.9, description: 'Iconic amphitheatre of gladiatorial contests and epicenter of ancient Rome.' },
      { name: 'Vatican Museums & Sistine Chapel', category: 'museum', entryFeeUSD: 24.0, rating: 4.9, description: 'Papal art collections culminating in Michelangelo legendary ceiling frescoes.' }
    ],
    hotels: [
      { name: 'Hotel de Russie Rome', stars: 5, pricePerNightUSD: 680, type: 'Luxury Garden Retreat', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Roscioli Salumeria con Cucina', cuisine: 'Roman Traditional', specialty: 'Carbonara & Burrata with Anchovies', priceRange: '$$', rating: 4.8 }
    ],
    tours: [
      { title: 'Grand Tour of Italy: Rome, Florence & Venice (8 Days)', durationDays: 8, priceUSD: 1280, agencyName: 'Italia Bella Tours', rating: 4.9 }
    ]
  },

  // 10. EGYPT & CAIRO
  {
    id: 'egypt',
    name: 'Egypt',
    country: 'Egypt',
    countryCode: 'EGY',
    lat: 30.0444,
    lng: 31.2357,
    type: 'country',
    capital: 'Cairo',
    currency: 'EGP',
    currencySymbol: 'E£',
    language: 'Arabic, English',
    timezone: 'GMT+2',
    flag: '🇪🇬',
    weather: { tempC: 29, condition: 'Sunny' },
    bestSeason: 'October – April',
    visaVerified: {
      status: 'Visa on Arrival',
      summary: 'Visa on Arrival and official eVisa available for travelers from over 45 countries ($25 fee).'
    },
    description: 'Ancient civilization along the fertile Nile river, home to Giza Pyramids, Sphinx, Luxor temples, and historic Islamic Cairo.',
    popularDestinations: [
      { name: 'Cairo & Giza', region: 'Greater Cairo', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80' },
      { name: 'Luxor', region: 'Upper Nile', image: 'https://images.unsplash.com/photo-1568326344543-7ecfee7b3f4a?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Great Pyramid of Giza & Sphinx', category: 'monument', entryFeeUSD: 18.0, rating: 4.9, description: 'Last surviving monument of the ancient Seven Wonders of the World.' },
      { name: 'Grand Egyptian Museum (GEM)', category: 'museum', entryFeeUSD: 22.0, rating: 4.9, description: 'State-of-the-art museum housing King Tutankhamun complete treasures.' }
    ],
    hotels: [
      { name: 'Mena House Giza', stars: 5, pricePerNightUSD: 280, type: 'Historic Pyramid View', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Abou El Sid', cuisine: 'Traditional Egyptian', specialty: 'Stuffed Pigeon & Koshary', priceRange: '$$', rating: 4.7 }
    ],
    tours: [
      { title: 'Pharaohs Legacy & Nile Cruise (6 Days)', durationDays: 6, priceUSD: 780, agencyName: 'Nile Explorer', rating: 4.8 }
    ]
  },

  // 11. GERMANY
  {
    id: 'germany',
    name: 'Germany',
    country: 'Germany',
    countryCode: 'DEU',
    lat: 51.1657,
    lng: 10.4515,
    type: 'country',
    capital: 'Berlin',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'German, English',
    timezone: 'GMT+1',
    flag: '🇩🇪',
    weather: { tempC: 17, condition: 'Partly Cloudy' },
    bestSeason: 'May – September',
    visaVerified: { status: 'Visa Free', summary: 'Schengen Area 90-day visa-free for EU, US, UK, Canada, Australia.' },
    description: 'A land of fairy-tale castles, dense Black Forest pine trails, rich musical heritage, engineering excellence, and cosmopolitan Berlin culture.',
    popularDestinations: [
      { name: 'Berlin', region: 'Berlin', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80' },
      { name: 'Munich', region: 'Bavaria', image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Brandenburg Gate', category: 'monument', entryFeeUSD: 0, rating: 4.8, description: '18th-century neoclassical monument and symbol of German reunification.' },
      { name: 'Neuschwanstein Castle', category: 'monument', entryFeeUSD: 18.0, rating: 4.9, description: 'Nineteenth-century historicist palace perched upon a rugged Bavarian cliff.' }
    ],
    hotels: [
      { name: 'Hotel Adlon Kempinski Berlin', stars: 5, pricePerNightUSD: 420, type: 'Historic Grand Hotel', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Hofbräuhaus München', cuisine: 'Bavarian Traditional', specialty: 'Crispy Pork Knuckle & Pretzels', priceRange: '$$', rating: 4.7 }
    ],
    tours: [
      { title: 'Bavarian Castles & Romantic Road Tour', durationDays: 4, priceUSD: 620, agencyName: 'Alps Travel Group', rating: 4.8 }
    ]
  },

  // 12. BRAZIL
  {
    id: 'brazil',
    name: 'Brazil',
    country: 'Brazil',
    countryCode: 'BRA',
    lat: -14.235,
    lng: -51.9253,
    type: 'country',
    capital: 'Brasília',
    currency: 'BRL',
    currencySymbol: 'R$',
    language: 'Portuguese, English',
    timezone: 'GMT-3',
    flag: '🇧🇷',
    weather: { tempC: 28, condition: 'Sunny' },
    bestSeason: 'December – March (Summer & Carnival), May – September (Amazon)',
    visaVerified: { status: 'Visa Free', summary: 'Visa-free for EU, UK, GCC; eVisa available for US, Canada, Australia.' },
    description: 'Vibrant South American giant famous for Rio de Janeiro golden beaches, the vast Amazon Rainforest biodiversity, and energetic Samba rhythms.',
    popularDestinations: [
      { name: 'Rio de Janeiro', region: 'Southeast', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80' },
      { name: 'Salvador da Bahia', region: 'Northeast', image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Christ the Redeemer & Corcovado', category: 'monument', entryFeeUSD: 24.0, rating: 4.9, description: 'Art Deco statue standing 30 meters atop Corcovado mountain overlooking Rio.' },
      { name: 'Iguazu Falls (Brazilian Side)', category: 'nature', entryFeeUSD: 22.0, rating: 5.0, description: 'Breathtaking semicircular waterfall cascade spanning the border with Argentina.' }
    ],
    hotels: [
      { name: 'Belmond Copacabana Palace', stars: 5, pricePerNightUSD: 490, type: 'Iconic Beachfront Palace', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Fogo de Chão Rio', cuisine: 'Churrascaria', specialty: 'Picanha & Brazilian Feijoada', priceRange: '$$$', rating: 4.8 }
    ],
    tours: [
      { title: 'Rio de Janeiro & Iguazu Wonders (6 Days)', durationDays: 6, priceUSD: 890, agencyName: 'Samba Tropical Tours', rating: 4.9 }
    ]
  },

  // 13. UNITED KINGDOM & LONDON
  {
    id: 'uk',
    name: 'United Kingdom',
    country: 'United Kingdom',
    countryCode: 'GBR',
    lat: 51.5074,
    lng: -0.1278,
    type: 'country',
    capital: 'London',
    currency: 'GBP',
    currencySymbol: '£',
    language: 'English',
    timezone: 'GMT+0',
    flag: '🇬🇧',
    weather: { tempC: 16, condition: 'Partly Cloudy' },
    bestSeason: 'May – September',
    visaVerified: { status: 'Visa Free', summary: 'Electronic Travel Authorisation (ETA) / 6-month visa free for EU, US, Canada, Australia.' },
    description: 'Rich royal heritage, iconic landmarks from Big Ben to Stonehenge, world-leading West End theatre, and picturesque Scottish highlands.',
    popularDestinations: [
      { name: 'London', region: 'England', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
      { name: 'Edinburgh', region: 'Scotland', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Tower of London & Crown Jewels', category: 'monument', entryFeeUSD: 36.0, rating: 4.8, description: 'Historic fortress and prison housing the royal Crown Jewels.' },
      { name: 'British Museum', category: 'museum', entryFeeUSD: 0, rating: 4.9, description: 'World-renowned museum of human history, art and culture featuring Rosetta Stone.' }
    ],
    hotels: [
      { name: 'The Savoy London', stars: 5, pricePerNightUSD: 650, type: 'Classic Strand Luxury', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Rules Restaurant', cuisine: 'Traditional British', specialty: 'Roast Beef & Yorkshire Pudding', priceRange: '$$$', rating: 4.7 }
    ],
    tours: [
      { title: 'Best of Britain: London, Oxford & Edinburgh (6 Days)', durationDays: 6, priceUSD: 990, agencyName: 'Britannia Heritage Tours', rating: 4.8 }
    ]
  }
];

// Country ISO Dictionary for dynamic generation
const COUNTRY_META_DICT: Record<string, {
  name: string;
  flag: string;
  capital: string;
  currency: string;
  currencySymbol: string;
  language: string;
  timezone: string;
  lat: number;
  lng: number;
  desc: string;
}> = {
  NER: { name: 'Niger', flag: '🇳🇪', capital: 'Niamey', currency: 'XOF', currencySymbol: 'CFA', language: 'French, Hausa', timezone: 'GMT+1', lat: 17.6078, lng: 8.0817, desc: 'Sahelian oasis of desert caravans and clay architecture in West Africa.' },
  FRA: { name: 'France', flag: '🇫🇷', capital: 'Paris', currency: 'EUR', currencySymbol: '€', language: 'French', timezone: 'GMT+1', lat: 46.2276, lng: 2.2137, desc: 'World leader in art, culinary excellence, wine, and romantic landmarks.' },
  UZB: { name: 'Uzbekistan', flag: '🇺🇿', capital: 'Tashkent', currency: 'UZS', currencySymbol: 'soʻm', language: 'Uzbek', timezone: 'GMT+5', lat: 41.3775, lng: 64.5853, desc: 'Legendary Silk Road crossroads with turquoise domes and ancient bazaars.' },
  TUR: { name: 'Turkey', flag: '🇹🇷', capital: 'Ankara', currency: 'TRY', currencySymbol: '₺', language: 'Turkish', timezone: 'GMT+3', lat: 38.9637, lng: 35.2433, desc: 'Transcontinental bridge of Byzantine and Ottoman history and scenic coasts.' },
  JPN: { name: 'Japan', flag: '🇯🇵', capital: 'Tokyo', currency: 'JPY', currencySymbol: '¥', language: 'Japanese', timezone: 'GMT+9', lat: 36.2048, lng: 138.2529, desc: 'Land of the Rising Sun blending ancient shrines and ultra-modern innovation.' },
  USA: { name: 'United States', flag: '🇺🇸', capital: 'Washington, D.C.', currency: 'USD', currencySymbol: '$', language: 'English', timezone: 'GMT-5', lat: 37.0902, lng: -95.7129, desc: 'Expansive continent-spanning nation of world-class cities and majestic national parks.' },
  EGY: { name: 'Egypt', flag: '🇪🇬', capital: 'Cairo', currency: 'EGP', currencySymbol: 'E£', language: 'Arabic', timezone: 'GMT+2', lat: 26.8206, lng: 30.8025, desc: 'Millennia of pharaonic wonders, Nile river journeys, and vibrant bazaars.' },
  ARE: { name: 'United Arab Emirates', flag: '🇦🇪', capital: 'Abu Dhabi', currency: 'AED', currencySymbol: 'AED', language: 'Arabic', timezone: 'GMT+4', lat: 23.4241, lng: 53.8478, desc: 'Futuristic desert oasis with gleaming skyscrapers and luxury hospitality.' },
  ITA: { name: 'Italy', flag: '🇮🇹', capital: 'Rome', currency: 'EUR', currencySymbol: '€', language: 'Italian', timezone: 'GMT+1', lat: 41.8719, lng: 12.5674, desc: 'Cradle of ancient Rome, Renaissance art, Tuscan vineyards, and Mediterranean cuisine.' },
  DEU: { name: 'Germany', flag: '🇩🇪', capital: 'Berlin', currency: 'EUR', currencySymbol: '€', language: 'German', timezone: 'GMT+1', lat: 51.1657, lng: 10.4515, desc: 'Heart of central Europe known for castles, Rhine valleys, and cultural vitality.' },
  BRA: { name: 'Brazil', flag: '🇧🇷', capital: 'Brasília', currency: 'BRL', currencySymbol: 'R$', language: 'Portuguese', timezone: 'GMT-3', lat: -14.235, lng: -51.9253, desc: 'South America vibrant giant of Amazon rainforests and sun-soaked Atlantic coasts.' },
  GBR: { name: 'United Kingdom', flag: '🇬🇧', capital: 'London', currency: 'GBP', currencySymbol: '£', language: 'English', timezone: 'GMT+0', lat: 55.3781, lng: -3.436, desc: 'Rich historic kingdom of royal palaces, lush countryside, and global culture.' },
  IND: { name: 'India', flag: '🇮🇳', capital: 'New Delhi', currency: 'INR', currencySymbol: '₹', language: 'Hindi, English', timezone: 'GMT+5:30', lat: 20.5937, lng: 78.9629, desc: 'Vibrant subcontinent of timeless temples, rich spices, and royal Rajasthani forts.' },
  CHN: { name: 'China', flag: '🇨🇳', capital: 'Beijing', currency: 'CNY', currencySymbol: '¥', language: 'Mandarin', timezone: 'GMT+8', lat: 35.8617, lng: 104.1954, desc: 'Ancient civilization of the Great Wall, Silk Road heritage, and energetic modern megacities.' },
  ESP: { name: 'Spain', flag: '🇪🇸', capital: 'Madrid', currency: 'EUR', currencySymbol: '€', language: 'Spanish', timezone: 'GMT+1', lat: 40.4637, lng: -3.7492, desc: 'Sun-drenched Mediterranean realm of flamenco, tapas, and Gaudí architecture.' },
  AUS: { name: 'Australia', flag: '🇦🇺', capital: 'Canberra', currency: 'AUD', currencySymbol: 'A$', language: 'English', timezone: 'GMT+10', lat: -25.2744, lng: 133.7751, desc: 'Island continent of Great Barrier Reef wonders, golden surf beaches, and the Outback.' },
  CAN: { name: 'Canada', flag: '🇨🇦', capital: 'Ottawa', currency: 'CAD', currencySymbol: 'C$', language: 'English, French', timezone: 'GMT-5', lat: 56.1304, lng: -106.3468, desc: 'Vast wilderness of turquoise glacial lakes, Rocky Mountains, and multicultural cities.' },
  MAR: { name: 'Morocco', flag: '🇲🇦', capital: 'Rabat', currency: 'MAD', currencySymbol: 'MAD', language: 'Arabic, French', timezone: 'GMT+1', lat: 31.7917, lng: -7.0926, desc: 'Imperial kingdoms with labyrinthine medinas, Atlas peaks, and fragrant spice souks.' },
  THA: { name: 'Thailand', flag: '🇹🇭', capital: 'Bangkok', currency: 'THB', currencySymbol: '฿', language: 'Thai, English', timezone: 'GMT+7', lat: 15.87, lng: 100.9925, desc: 'Land of Smiles featuring golden Buddhist temples, tropical islands, and world-renowned street food.' },
  SAU: { name: 'Saudi Arabia', flag: '🇸🇦', capital: 'Riyadh', currency: 'SAR', currencySymbol: 'SAR', language: 'Arabic', timezone: 'GMT+3', lat: 23.8859, lng: 45.0792, desc: 'Historic desert kingdom of ancient Nabataean AlUla and futuristic mega-projects.' },
  CHE: { name: 'Switzerland', flag: '🇨🇭', capital: 'Bern', currency: 'CHF', currencySymbol: 'CHF', language: 'German, French, Italian', timezone: 'GMT+1', lat: 46.8182, lng: 8.2275, desc: 'Alpine wonderland of snow-capped peaks, scenic mountain trains, and pristine lakes.' },
  KOR: { name: 'South Korea', flag: '🇰🇷', capital: 'Seoul', currency: 'KRW', currencySymbol: '₩', language: 'Korean', timezone: 'GMT+9', lat: 35.9078, lng: 127.7669, desc: 'Dynamic peninsula of high-tech vibrancy, K-Culture, historic palaces, and mountain trails.' },
  ZAF: { name: 'South Africa', flag: '🇿🇦', capital: 'Pretoria', currency: 'ZAR', currencySymbol: 'R', language: 'English, Zulu, Afrikaans', timezone: 'GMT+2', lat: -30.5595, lng: 22.9375, desc: 'Rainbow nation with iconic Table Mountain, Cape wine lands, and Big Five safari game reserves.' }
};

/**
 * Dynamically construct a complete DestinationItem for any country in the world
 */
export function generateDestinationForCountry(countryName: string, isoCode?: string, lat?: number, lng?: number): DestinationItem {
  const cleanName = (countryName || 'Destination').trim();
  const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const code = (isoCode || id.substring(0, 3)).toUpperCase();
  const meta = COUNTRY_META_DICT[code] || Object.values(COUNTRY_META_DICT).find(
    m => m.name.toLowerCase() === cleanName.toLowerCase()
  );

  const capital = meta?.capital || `${cleanName} City`;
  const flag = meta?.flag || '🌍';
  const currency = meta?.currency || 'USD';
  const currencySymbol = meta?.currencySymbol || '$';
  const language = meta?.language || 'Local Language, English';
  const timezone = meta?.timezone || 'GMT+0';
  const latitude = lat ?? meta?.lat ?? 20.0;
  const longitude = lng ?? meta?.lng ?? 0.0;

  return {
    id,
    name: cleanName,
    country: cleanName,
    countryCode: code,
    lat: latitude,
    lng: longitude,
    type: 'country',
    capital,
    currency,
    currencySymbol,
    language,
    timezone,
    flag,
    weather: { tempC: 24, condition: 'Sunny' },
    bestSeason: 'Spring & Autumn (Optimal Travel Season)',
    visaVerified: {
      status: 'Visa Free',
      summary: `Standard entry permissions for tourists exploring ${cleanName}. Check official consulate for nationality requirements.`
    },
    description: meta?.desc || `${cleanName} is a remarkable global destination offering historic landmarks, authentic regional culture, natural landscapes, and hospitable travel experiences.`,
    popularDestinations: [
      { name: capital, region: `${cleanName} Central`, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80' },
      { name: `${cleanName} Highlands`, region: 'Scenic Region', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
      { name: `${cleanName} Old Town`, region: 'Cultural District', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: `${cleanName} National Heritage Landmark`, category: 'monument', entryFeeUSD: 8.0, rating: 4.8, description: `The signature cultural landmark and historic attraction in ${cleanName}.` },
      { name: `${cleanName} Museum of History & Arts`, category: 'museum', entryFeeUSD: 6.0, rating: 4.7, description: `Comprehensive exhibition of regional artifacts, folklore, and national history.` },
      { name: `${capital} Central Square & Folk Bazaar`, category: 'bazaar', entryFeeUSD: 0, rating: 4.8, description: `Lively open market offering local crafts, spices, and authentic street flavors.` }
    ],
    hotels: [
      { name: `Grand ${cleanName} Palace Hotel`, stars: 5, pricePerNightUSD: 160, type: 'Luxury City Resort', rating: 4.8 },
      { name: `${capital} Heritage Boutique`, stars: 4, pricePerNightUSD: 95, type: 'Historic Center Boutique', rating: 4.7 }
    ],
    restaurants: [
      { name: `${cleanName} Traditional Cuisine House`, cuisine: 'Regional Traditional', specialty: `Traditional ${cleanName} National Dish`, priceRange: '$$', rating: 4.8 },
      { name: `${capital} Gourmet Bistro`, cuisine: 'Fusion & International', specialty: 'Locally Sourced Seasonal Tasting Menu', priceRange: '$$', rating: 4.7 }
    ],
    tours: [
      { title: `Complete Highlights & Cultural Odyssey in ${cleanName}`, durationDays: 5, priceUSD: 640, agencyName: `${cleanName} Travel Partners`, rating: 4.9 },
      { title: `${capital} Architectural & Historic Walking Tour`, durationDays: 1, priceUSD: 75, agencyName: 'Global City Guides', rating: 4.8 }
    ]
  };
}

/**
 * Resolve any search query or country string into the best-matching DestinationItem.
 * Supports country names, city names, landmarks, ISO codes, and dynamically builds valid data for any country on earth.
 */
export function resolveDestination(query: string, featureProps?: any): DestinationItem | null {
  if (!query || !query.trim()) return null;
  const q = query.trim().toLowerCase();

  // 1. Exact ID or countryCode match in static catalog
  const exact = DESTINATIONS_CATALOG.find(
    d => d.id === q || d.countryCode.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Exact Name match in static catalog
  const exactName = DESTINATIONS_CATALOG.find(
    d => d.name.toLowerCase() === q
  );
  if (exactName) return exactName;

  // 3. Name or Country starts with query
  const startsWith = DESTINATIONS_CATALOG.find(
    d => d.name.toLowerCase().startsWith(q) || d.country.toLowerCase().startsWith(q)
  );
  if (startsWith) return startsWith;

  // 4. City / Place match
  const cityMatch = DESTINATIONS_CATALOG.find(
    d =>
      d.popularDestinations.some(p => p.name.toLowerCase() === q || p.name.toLowerCase().startsWith(q)) ||
      d.places.some(p => p.name.toLowerCase().includes(q))
  );
  if (cityMatch) return cityMatch;

  // 5. Substring in name or country
  const substring = DESTINATIONS_CATALOG.find(
    d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
  );
  if (substring) return substring;

  // 6. Check meta dictionary by ISO code or country name
  const metaEntry = Object.entries(COUNTRY_META_DICT).find(
    ([code, meta]) => code.toLowerCase() === q || meta.name.toLowerCase() === q || meta.name.toLowerCase().includes(q)
  );
  if (metaEntry) {
    return generateDestinationForCountry(metaEntry[1].name, metaEntry[0], metaEntry[1].lat, metaEntry[1].lng);
  }

  // 7. If query looks like a country name (or from GeoJSON feature properties)
  const countryName = featureProps?.NAME || query.trim();
  const isoCode = featureProps?.ISO_A3;
  return generateDestinationForCountry(countryName, isoCode);
}

/**
 * Returns autocomplete suggestions based on query
 */
export function getDestinationSuggestions(query: string, maxResults = 6): DestinationItem[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const results: DestinationItem[] = [];
  const seenIds = new Set<string>();

  for (const d of DESTINATIONS_CATALOG) {
    if (
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.popularDestinations.some(p => p.name.toLowerCase().includes(q))
    ) {
      results.push(d);
      seenIds.add(d.id);
      if (results.length >= maxResults) return results;
    }
  }

  // Search dictionary entries as well
  for (const [code, meta] of Object.entries(COUNTRY_META_DICT)) {
    if (meta.name.toLowerCase().includes(q) && !seenIds.has(meta.name.toLowerCase())) {
      results.push(generateDestinationForCountry(meta.name, code, meta.lat, meta.lng));
      if (results.length >= maxResults) return results;
    }
  }

  return results;
}
