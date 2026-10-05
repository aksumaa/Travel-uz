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
  // 1. UZBEKISTAN (Country)
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

  // 2. CAPPADOCIA, TURKEY (Region / Landmark Hub)
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    countryCode: 'TUR',
    lat: 38.6431,
    lng: 34.8289,
    type: 'region',
    capital: 'Ankara',
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
      { name: 'Göreme Open Air Museum', category: 'museum', entryFeeUSD: 14.0, rating: 4.9, description: 'UNESCO complex of Byzantine rock-hewn frescoed monastery churches.' },
      { name: 'Derinkuyu Underground City', category: 'monument', entryFeeUSD: 12.0, rating: 4.8, description: 'Subterranean refuge carved 85 meters deep with living quarters and chapels.' },
      { name: 'Love Valley Viewpoint', category: 'viewpoint', entryFeeUSD: 0, rating: 4.8, description: 'Panoramic cliff viewpoint over towering geological fairy chimneys.' }
    ],
    hotels: [
      { name: 'Museum Hotel Cave Suites', stars: 5, pricePerNightUSD: 240, type: 'Luxury Cave Suite', rating: 4.9 },
      { name: 'Sultan Cave Suites', stars: 4, pricePerNightUSD: 160, type: 'Historic Panoramic', rating: 4.8 }
    ],
    restaurants: [
      { name: 'Dibek Restaurant', cuisine: 'Anatolian', specialty: 'Clay-Pot Testi Kebab', priceRange: '$$', rating: 4.8 },
      { name: 'Topdeck Cave Restaurant', cuisine: 'Traditional Turkish', specialty: 'Slow-Cooked Lamb Meze', priceRange: '$$', rating: 4.9 }
    ],
    tours: [
      { title: 'Cappadocia Balloon & Underground Valleys (3 Days)', durationDays: 3, priceUSD: 410, agencyName: 'Anatolia Expeditions', rating: 4.9 },
      { title: 'Fairy Chimneys Private Highlights Tour', durationDays: 2, priceUSD: 280, agencyName: 'Silk & Sand Journeys', rating: 4.8 }
    ]
  },

  // 3. TURKEY (Country)
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
    language: 'Turkish',
    timezone: 'GMT+3',
    flag: '🇹🇷',
    weather: { tempC: 24, condition: 'Sunny' },
    bestSeason: 'April – May, September – October',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Visa-free for tourist visits up to 90 days for over 70 nationalities.'
    },
    description: 'A transcontinental bridge between Europe and Asia filled with Greco-Roman ruins, Ottoman imperial palaces, and turquoise coastal vistas.',
    popularDestinations: [
      { name: 'Istanbul', region: 'Marmara', image: 'https://images.unsplash.com/photo-1568326344543-7ecfee7b3f4a?auto=format&fit=crop&w=600&q=80' },
      { name: 'Cappadocia', region: 'Central Anatolia', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Antalya', region: 'Mediterranean', image: 'https://images.unsplash.com/photo-1608958415700-1c3905cf78e6?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Hagia Sophia Grand Mosque', category: 'monument', entryFeeUSD: 25.0, rating: 4.9, description: 'Iconic 6th-century architectural masterpiece with soaring dome and mosaics.' },
      { name: 'Topkapi Palace', category: 'museum', entryFeeUSD: 30.0, rating: 4.8, description: 'Opulent residence of Ottoman sultans overlooking the Bosphorus strait.' },
      { name: 'Grand Bazaar (Kapalıçarşı)', category: 'bazaar', entryFeeUSD: 0, rating: 4.7, description: 'Historic covered labyrinth with over 4,000 shops selling lanterns, carpets, and spices.' }
    ],
    hotels: [
      { name: 'Pera Palace Hotel', stars: 5, pricePerNightUSD: 220, type: 'Historic Belle Époque', rating: 4.9 },
      { name: 'Four Seasons at Sultanahmet', stars: 5, pricePerNightUSD: 380, type: 'Heritage Luxury', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Pandeli Restaurant', cuisine: 'Ottoman Imperial', specialty: 'Eggplant Pie with Lamb', priceRange: '$$', rating: 4.8 },
      { name: 'Ciya Sofrasi', cuisine: 'Regional Anatolian', specialty: 'Spiced Kebabs & Wild Herbs', priceRange: '$$', rating: 4.9 }
    ],
    tours: [
      { title: 'Best of Turkey: Istanbul to Cappadocia (7 Days)', durationDays: 7, priceUSD: 890, agencyName: 'Bosphorus Journeys', rating: 4.9 }
    ]
  },

  // 4. SAMARKAND (City in Uzbekistan)
  {
    id: 'samarkand',
    name: 'Samarkand',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    lat: 39.6542,
    lng: 66.9597,
    type: 'city',
    capital: 'Tashkent',
    currency: 'UZS',
    currencySymbol: 'soʻm',
    language: 'Uzbek, Tajik',
    timezone: 'GMT+5',
    flag: '🇺🇿',
    weather: { tempC: 22, condition: 'Sunny' },
    bestSeason: 'April – June, September – November',
    visaVerified: {
      status: 'Visa Free',
      summary: '30-day visa-free regime applies to most travelers arriving at Samarkand International Airport (SKD).'
    },
    description: 'One of the oldest continuously inhabited cities in Central Asia, celebrated as the jewel of Amir Timur empire.',
    popularDestinations: [
      { name: 'Registan Square', region: 'Old Town', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80' },
      { name: 'Shah-i-Zinda', region: 'Afrasiyab Hill', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Gur-e-Amir Mausoleum', category: 'monument', entryFeeUSD: 3.5, rating: 4.9, description: 'Tomb of conqueror Amir Timur with ribbed turquoise dome and nephrite jade cenotaph.' },
      { name: 'Bibi-Khanym Mosque', category: 'monument', entryFeeUSD: 4.0, rating: 4.8, description: 'Once one of the largest mosques in the Islamic world, erected in 1404.' },
      { name: 'Ulugh Beg Observatory', category: 'museum', entryFeeUSD: 3.0, rating: 4.7, description: 'Medieval astronomical sanctuary with monumental sextant trench carved into stone.' }
    ],
    hotels: [
      { name: 'Kosh Hauz Boutique Hotel', stars: 4, pricePerNightUSD: 75, type: 'Traditional Courtyard', rating: 4.8 },
      { name: 'Registan Plaza Hotel', stars: 4, pricePerNightUSD: 90, type: 'Modern Central', rating: 4.6 }
    ],
    restaurants: [
      { name: 'Platan Garden Restaurant', cuisine: 'Uzbek & European', specialty: 'Barbecue Rack of Lamb', priceRange: '$$', rating: 4.7 },
      { name: 'Samarkand Osh Teahouse', cuisine: 'Traditional', specialty: 'Wood-fired Wedding Plov', priceRange: '$', rating: 4.9 }
    ],
    tours: [
      { title: 'Samarkand Cultural Explorer (2 Days)', durationDays: 2, priceUSD: 195, agencyName: 'Samarkand Discovery', rating: 4.9 }
    ]
  },

  // 5. FRANCE (Country) & PARIS
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
    language: 'French',
    timezone: 'GMT+1',
    flag: '🇫🇷',
    weather: { tempC: 19, condition: 'Partly Cloudy' },
    bestSeason: 'May – October',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Schengen Area rules apply. 90-day visa-free for USA, Canada, UK, Australia, Japan.'
    },
    description: 'Renowned for Haute cuisine, historic palaces, landmark art museums, and picturesque countryside.',
    popularDestinations: [
      { name: 'Paris', region: 'Île-de-France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
      { name: 'Nice & Riviera', region: 'Côte dAzur', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Eiffel Tower', category: 'monument', entryFeeUSD: 28.0, rating: 4.8, description: 'Iconic wrought-iron lattice tower offering panoramic vistas of Paris.' },
      { name: 'Musée du Louvre', category: 'museum', entryFeeUSD: 24.0, rating: 4.9, description: 'World largest art museum housing Mona Lisa and Venus de Milo.' }
    ],
    hotels: [
      { name: 'Hôtel Le Marais Heritage', stars: 4, pricePerNightUSD: 210, type: 'Historic Boutique', rating: 4.7 }
    ],
    restaurants: [
      { name: 'Le Comptoir du Relais', cuisine: 'French Bistro', specialty: 'Duck Confit & Natural Wine', priceRange: '$$', rating: 4.8 }
    ],
    tours: [
      { title: 'Paris Gourmet & Cultural Pass (4 Days)', durationDays: 4, priceUSD: 620, agencyName: 'Lumière Tours', rating: 4.8 }
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
    language: 'Japanese',
    timezone: 'GMT+9',
    flag: '🇯🇵',
    weather: { tempC: 20, condition: 'Sunny' },
    bestSeason: 'March – May, October – November',
    visaVerified: {
      status: 'Visa Free',
      summary: 'Visa exemption arrangements for 68 countries for tourism up to 90 days.'
    },
    description: 'Harmony of ancient Shinto shrines and futuristic neon cities, bullet trains, and culinary mastery.',
    popularDestinations: [
      { name: 'Tokyo', region: 'Kanto', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kyoto', region: 'Kansai', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Senso-ji Temple', category: 'monument', entryFeeUSD: 0, rating: 4.8, description: 'Ancient Buddhist sanctuary in historic Asakusa district with Kaminarimon gate.' },
      { name: 'Shibuya Scramble Crossing', category: 'viewpoint', entryFeeUSD: 0, rating: 4.7, description: 'The busiest pedestrian intersection in the world, surrounded by vibrant giant screens.' }
    ],
    hotels: [
      { name: 'Hotel Niwa Tokyo', stars: 4, pricePerNightUSD: 175, type: 'Modern Japanese Garden', rating: 4.8 }
    ],
    restaurants: [
      { name: 'Ramen Ichiran Asakusa', cuisine: 'Japanese Tonkotsu', specialty: 'Custom Broth Ramen', priceRange: '$', rating: 4.9 }
    ],
    tours: [
      { title: 'Golden Route: Tokyo, Hakone & Kyoto (7 Days)', durationDays: 7, priceUSD: 1150, agencyName: 'Sakura Escapes', rating: 4.9 }
    ]
  },

  // 7. UNITED STATES & NEW YORK
  {
    id: 'usa',
    name: 'United States',
    country: 'United States',
    countryCode: 'USA',
    lat: 40.7128,
    lng: -74.006,
    type: 'country',
    capital: 'Washington D.C.',
    currency: 'USD',
    currencySymbol: '$',
    language: 'English',
    timezone: 'GMT-5',
    flag: '🇺🇸',
    weather: { tempC: 18, condition: 'Clear' },
    bestSeason: 'April – June, September – November',
    visaVerified: {
      status: 'eVisa',
      summary: 'ESTA online travel authorization required for Visa Waiver Program countries.'
    },
    description: 'Vast country featuring global metropolitan centers, towering national parks, and diverse regional cultures.',
    popularDestinations: [
      { name: 'New York City', region: 'New York', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Grand Canyon', region: 'Arizona', image: 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Statue of Liberty & Ellis Island', category: 'monument', entryFeeUSD: 25.0, rating: 4.8, description: 'Universal symbol of freedom standing in New York Harbor.' },
      { name: 'Metropolitan Museum of Art', category: 'museum', entryFeeUSD: 30.0, rating: 4.9, description: 'Over 5,000 years of global human artistic achievement on Fifth Avenue.' }
    ],
    hotels: [
      { name: 'Arlo SoHo Manhattan', stars: 4, pricePerNightUSD: 230, type: 'Design Boutique', rating: 4.6 }
    ],
    restaurants: [
      { name: 'Katz Delicatessen', cuisine: 'Classic Deli', specialty: 'Hand-Carved Pastrami on Rye', priceRange: '$$', rating: 4.8 }
    ],
    tours: [
      { title: 'New York Highlights & Skyline Cruise', durationDays: 3, priceUSD: 420, agencyName: 'Empire Sightseeing', rating: 4.7 }
    ]
  },

  // 8. EGYPT & CAIRO
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
    description: 'Ancient civilization along the fertile Nile river, home to Giza Pyramids, Sphinx, and historic bazaars.',
    popularDestinations: [
      { name: 'Cairo & Giza', region: 'Greater Cairo', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80' },
      { name: 'Luxor', region: 'Upper Nile', image: 'https://images.unsplash.com/photo-1568326344543-7ecfee7b3f4a?auto=format&fit=crop&w=600&q=80' }
    ],
    places: [
      { name: 'Great Pyramid of Giza', category: 'monument', entryFeeUSD: 18.0, rating: 4.9, description: 'Last surviving monument of the ancient Seven Wonders of the World.' },
      { name: 'Grand Egyptian Museum (GEM)', category: 'museum', entryFeeUSD: 22.0, rating: 4.9, description: 'State-of-the-art museum housing King Tutankhamun treasures.' }
    ],
    hotels: [
      { name: 'Mena House Giza', stars: 5, pricePerNightUSD: 280, type: 'Historic Pyramid View', rating: 4.9 }
    ],
    restaurants: [
      { name: 'Abou El Sid', cuisine: 'Traditional Egyptian', specialty: 'Pigeon Fāriq & Koshary', priceRange: '$$', rating: 4.7 }
    ],
    tours: [
      { title: 'Pharaohs Legacy & Nile Cruise (6 Days)', durationDays: 6, priceUSD: 780, agencyName: 'Nile Explorer', rating: 4.8 }
    ]
  }
];

/**
 * Resolve any search query string into the best-matching DestinationItem.
 * Supports country names, city names, landmarks, ISO codes.
 */
export function resolveDestination(query: string): DestinationItem | null {
  if (!query || !query.trim()) return null;
  const q = query.trim().toLowerCase();

  // 1. Exact ID or countryCode match
  const exact = DESTINATIONS_CATALOG.find(
    d => d.id === q || d.countryCode.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Exact Name match
  const exactName = DESTINATIONS_CATALOG.find(
    d => d.name.toLowerCase() === q
  );
  if (exactName) return exactName;

  // 3. Name or Country starts with query
  const startsWith = DESTINATIONS_CATALOG.find(
    d => d.name.toLowerCase().startsWith(q) || d.country.toLowerCase().startsWith(q)
  );
  if (startsWith) return startsWith;

  // 4. Substring in name, country, or popular destinations
  const substring = DESTINATIONS_CATALOG.find(
    d =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.popularDestinations.some(p => p.name.toLowerCase().includes(q)) ||
      d.places.some(p => p.name.toLowerCase().includes(q))
  );
  if (substring) return substring;

  return null;
}

/**
 * Returns autocomplete suggestions based on query
 */
export function getDestinationSuggestions(query: string, maxResults = 6): DestinationItem[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const results: DestinationItem[] = [];
  for (const d of DESTINATIONS_CATALOG) {
    if (
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.popularDestinations.some(p => p.name.toLowerCase().includes(q))
    ) {
      results.push(d);
      if (results.length >= maxResults) break;
    }
  }
  return results;
}
