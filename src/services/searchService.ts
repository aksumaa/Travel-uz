import { 
  DESTINATIONS_CATALOG, 
  generateDestinationForCountry, 
  resolveDestination,
  type DestinationItem 
} from './destinationCatalog';

export type SearchCategory = 'country' | 'city' | 'destination' | 'landmark';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  country: string;
  countryCode: string;
  countryId: string;
  flag: string;
  lat: number;
  lng: number;
  image?: string;
  description: string;
  badge?: string;
  aliases?: string[];
  destinationItem?: DestinationItem;
}

/**
 * Verified Master Index of Global Travel Entities:
 * Countries, Major Hub Cities, World Destinations, and Signature Landmarks
 */
export const GLOBAL_SEARCH_INDEX: SearchResultItem[] = [
  // ==================== CITIES & DESTINATIONS: DUBAI / UAE ====================
  {
    id: 'city-dubai',
    title: 'Dubai',
    subtitle: 'Metropolis · United Arab Emirates',
    category: 'city',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    countryId: 'uae',
    flag: '🇦🇪',
    lat: 25.2048,
    lng: 55.2708,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-modern desert metropolis famous for world-record architecture, luxury resorts, and vibrant shopping.',
    badge: 'Global Aviation Hub',
    aliases: ['dxb', 'dubay', 'emirates', 'uae city', 'burj city']
  },
  {
    id: 'country-uae',
    title: 'United Arab Emirates',
    subtitle: 'Country · Middle East',
    category: 'country',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    countryId: 'uae',
    flag: '🇦🇪',
    lat: 23.4241,
    lng: 53.8478,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
    description: 'Federation of seven emirates spanning Dubai, Abu Dhabi, and pristine Arabian Gulf coastlines.',
    badge: 'Visa on Arrival',
    aliases: ['uae', 'emirates', 'abu dhabi', 'dubai country', 'arab emirates']
  },
  {
    id: 'landmark-burj-khalifa',
    title: 'Burj Khalifa',
    subtitle: 'Landmark · Dubai, UAE',
    category: 'landmark',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    countryId: 'uae',
    flag: '🇦🇪',
    lat: 25.1972,
    lng: 55.2744,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    description: 'The world’s tallest building at 828m, featuring 360-degree observation decks and fountain spectacles.',
    badge: '828m World Record',
    aliases: ['burj', 'khalifa tower', 'dubai tower', 'tallest building', 'burj dubai']
  },
  {
    id: 'landmark-future-museum',
    title: 'Museum of the Future',
    subtitle: 'Landmark · Dubai, UAE',
    category: 'landmark',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    countryId: 'uae',
    flag: '🇦🇪',
    lat: 25.2192,
    lng: 55.2819,
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic torus-shaped architectural marvel adorned with Arabic calligraphy poetry.',
    badge: 'Architectural Wonder',
    aliases: ['motf', 'future museum dubai', 'dubai calligraphy building']
  },
  {
    id: 'city-abu-dhabi',
    title: 'Abu Dhabi',
    subtitle: 'Capital City · United Arab Emirates',
    category: 'city',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    countryId: 'uae',
    flag: '🇦🇪',
    lat: 24.4539,
    lng: 54.3773,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
    description: 'UAE federal capital home to the Sheikh Zayed Grand Mosque and Louvre Abu Dhabi.',
    badge: 'Federal Capital',
    aliases: ['abudhabi', 'abu dabi', 'uae capital']
  },
  {
    id: 'landmark-sheikh-zayed-mosque',
    title: 'Sheikh Zayed Grand Mosque',
    subtitle: 'Landmark · Abu Dhabi, UAE',
    category: 'landmark',
    country: 'United Arab Emirates',
    countryCode: 'ARE',
    countryId: 'uae',
    flag: '🇦🇪',
    lat: 24.4128,
    lng: 54.4749,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
    description: 'Spectacular white Macedonian marble sanctuary with gold leaf accents and 82 domes.',
    badge: 'Grand Sanctuary',
    aliases: ['white mosque', 'abu dhabi mosque', 'grand mosque']
  },

  // ==================== FRANCE, PARIS & FRENCH RIVIERA ====================
  {
    id: 'country-france',
    title: 'France',
    subtitle: 'Country · Western Europe',
    category: 'country',
    country: 'France',
    countryCode: 'FRA',
    countryId: 'france',
    flag: '🇫🇷',
    lat: 46.2276,
    lng: 2.2137,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'World-renowned realm of art, haute gastronomy, wine regions, châteaux, and Mediterranean coasts.',
    badge: 'Schengen Hub',
    aliases: ['fra', 'french republic', 'francia', 'la france', 'paris country']
  },
  {
    id: 'city-paris',
    title: 'Paris',
    subtitle: 'Capital City · France',
    category: 'city',
    country: 'France',
    countryCode: 'FRA',
    countryId: 'france',
    flag: '🇫🇷',
    lat: 48.8566,
    lng: 2.3522,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'City of Light renowned for the Eiffel Tower, Louvre art collections, Seine bridges, and cafe culture.',
    badge: 'City of Light',
    aliases: ['parigi', 'french capital', 'ile de france']
  },
  {
    id: 'dest-french-riviera',
    title: 'French Riviera',
    subtitle: 'Destination · Côte d’Azur, France',
    category: 'destination',
    country: 'France',
    countryCode: 'FRA',
    countryId: 'france',
    flag: '🇫🇷',
    lat: 43.7102,
    lng: 7.2620,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    description: 'Glamorous Mediterranean coastline linking Nice, Cannes, Saint-Tropez, and the principality of Monaco.',
    badge: 'Côte d’Azur',
    aliases: ['cote dazur', 'riviera', 'cannes', 'nice france', 'saint tropez']
  },
  {
    id: 'landmark-eiffel-tower',
    title: 'Eiffel Tower',
    subtitle: 'Landmark · Paris, France',
    category: 'landmark',
    country: 'France',
    countryCode: 'FRA',
    countryId: 'france',
    flag: '🇫🇷',
    lat: 48.8584,
    lng: 2.2945,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
    description: 'Gustave Eiffel’s wrought-iron lattice tower standing as the universal symbol of France.',
    badge: 'World Icon',
    aliases: ['eiffel', 'tour eiffel', 'paris tower', 'champ de mars']
  },
  {
    id: 'landmark-louvre',
    title: 'Louvre Museum',
    subtitle: 'Landmark · Paris, France',
    category: 'landmark',
    country: 'France',
    countryCode: 'FRA',
    countryId: 'france',
    flag: '🇫🇷',
    lat: 48.8606,
    lng: 2.3376,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    description: 'World’s most visited museum, housing the Mona Lisa and Winged Victory inside a former royal palace.',
    badge: 'Masterpiece Collection',
    aliases: ['musee du louvre', 'mona lisa', 'louvre glass pyramid']
  },
  {
    id: 'landmark-versailles',
    title: 'Palace of Versailles',
    subtitle: 'Landmark · Île-de-France, France',
    category: 'landmark',
    country: 'France',
    countryCode: 'FRA',
    countryId: 'france',
    flag: '🇫🇷',
    lat: 48.8049,
    lng: 2.1204,
    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=600&q=80',
    description: 'Opulent royal residence of the Sun King Louis XIV featuring the Hall of Mirrors and grand fountain gardens.',
    badge: 'Royal Château',
    aliases: ['versailles', 'hall of mirrors', 'chateau de versailles']
  },

  // ==================== UZBEKISTAN & SILK ROAD ====================
  {
    id: 'country-uzbekistan',
    title: 'Uzbekistan',
    subtitle: 'Country · Central Asia',
    category: 'country',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 41.3775,
    lng: 64.5853,
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    description: 'Legendary crossroads of the Silk Road featuring turquoise-domed mosques, ancient minarets, and warm oriental hospitality.',
    badge: 'Silk Road Heart',
    aliases: ['uzb', 'ozbekiston', 'узбекистан', 'samarkand country', 'tashkent country']
  },
  {
    id: 'city-samarkand',
    title: 'Samarkand',
    subtitle: 'City · Samarkand Region, Uzbekistan',
    category: 'city',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 39.6542,
    lng: 66.9597,
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    description: 'Ancient Silk Road capital celebrated for Timurid majolica architecture, Registan square, and bread ovens.',
    badge: 'UNESCO World Heritage',
    aliases: ['samarqand', 'marakanda', 'самарканд', 'silk road pearl']
  },
  {
    id: 'landmark-registan',
    title: 'Registan Ensemble',
    subtitle: 'Landmark · Samarkand, Uzbekistan',
    category: 'landmark',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 39.6548,
    lng: 66.9757,
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    description: 'Trio of monumental 15th–17th century madrasahs adorned in azure mosaics framing Samarkand’s grand plaza.',
    badge: 'Architectural Masterpiece',
    aliases: ['registan', 'registon', 'samarkand square', 'tilakori', 'ulugbek madrasah']
  },
  {
    id: 'landmark-shahi-zinda',
    title: 'Shah-i-Zinda Necropolis',
    subtitle: 'Landmark · Samarkand, Uzbekistan',
    category: 'landmark',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 39.6631,
    lng: 66.9877,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
    description: 'Labyrinth of royal mausoleums dressed in iridescent shades of cobalt and turquoise tiles.',
    badge: 'Avenue of Domes',
    aliases: ['shohi zinda', 'shahi zinda', 'tomb of living king']
  },
  {
    id: 'city-bukhara',
    title: 'Bukhara',
    subtitle: 'City · Bukhara Region, Uzbekistan',
    category: 'city',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 39.7758,
    lng: 64.4154,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
    description: 'Intact medieval trade oasis boasting over 140 preserved architectural monuments and domed bazaars.',
    badge: 'Living Citadel',
    aliases: ['buxoro', 'boukhara', 'бухара']
  },
  {
    id: 'city-khiva',
    title: 'Khiva',
    subtitle: 'Citadel Oasis · Khorezm, Uzbekistan',
    category: 'city',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 41.3783,
    lng: 60.3582,
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=600&q=80',
    description: 'The ancient open-air citadel of Itchan Kala enclosed within formidable crenellated mudbrick walls.',
    badge: 'Preserved Fortress',
    aliases: ['xiwa', 'itchan kala', 'хива']
  },
  {
    id: 'city-tashkent',
    title: 'Tashkent',
    subtitle: 'Capital City · Uzbekistan',
    category: 'city',
    country: 'Uzbekistan',
    countryCode: 'UZB',
    countryId: 'uzbekistan',
    flag: '🇺🇿',
    lat: 41.2995,
    lng: 69.2401,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    description: 'Central Asia’s largest metropolis featuring ornate palatial metro stations and the Chorsu Bazaar.',
    badge: 'Silk Road Capital',
    aliases: ['toshkent', 'ташкент', 'chorsu']
  },

  // ==================== JAPAN & TOKYO ====================
  {
    id: 'country-japan',
    title: 'Japan',
    subtitle: 'Country · Eastern Asia',
    category: 'country',
    country: 'Japan',
    countryCode: 'JPN',
    countryId: 'japan',
    flag: '🇯🇵',
    lat: 36.2048,
    lng: 138.2529,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    description: 'Land of the Rising Sun blending ancient Shinto shrines, Zen temples, cutting-edge robotics, and culinary mastery.',
    badge: 'Cherry Blossom Realm',
    aliases: ['jpn', 'nippon', 'nihon', 'япония', 'tokyo country']
  },
  {
    id: 'city-tokyo',
    title: 'Tokyo',
    subtitle: 'Capital City · Japan',
    category: 'city',
    country: 'Japan',
    countryCode: 'JPN',
    countryId: 'japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    description: 'World’s most populous metropolis with neon-lit Shibuya crossings, historic Asakusa, and Michelin dining.',
    badge: 'Megacity Marvel',
    aliases: ['tokio', 'токио', 'shibuya', 'shinjuku', 'edo']
  },
  {
    id: 'landmark-sensoji',
    title: 'Senso-ji Temple',
    subtitle: 'Landmark · Tokyo, Japan',
    category: 'landmark',
    country: 'Japan',
    countryCode: 'JPN',
    countryId: 'japan',
    flag: '🇯🇵',
    lat: 35.7148,
    lng: 139.7967,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    description: 'Tokyo’s oldest Buddhist sanctuary founded in 645 AD, famed for the giant red Kaminarimon lantern.',
    badge: 'Ancient Temple',
    aliases: ['asakusa temple', 'sensoji', 'kaminarimon gate']
  },
  {
    id: 'city-kyoto',
    title: 'Kyoto',
    subtitle: 'Cultural Capital · Kansai, Japan',
    category: 'city',
    country: 'Japan',
    countryCode: 'JPN',
    countryId: 'japan',
    flag: '🇯🇵',
    lat: 35.0116,
    lng: 135.7681,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    description: 'Historic imperial capital endowed with thousands of classical Buddhist temples, geisha districts, and Zen gardens.',
    badge: 'Imperial Heart',
    aliases: ['kioto', 'fushimi inari', 'gion', 'arashiyama']
  },

  // ==================== TURKEY & CAPPADOCIA ====================
  {
    id: 'country-turkey',
    title: 'Turkey',
    subtitle: 'Country · Transcontinental Eurasia',
    category: 'country',
    country: 'Turkey',
    countryCode: 'TUR',
    countryId: 'turkey',
    flag: '🇹🇷',
    lat: 38.9637,
    lng: 35.2433,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80',
    description: 'Transcontinental bridge across the Bosphorus, laden with Byzantine domes, Ottoman palaces, and Mediterranean shores.',
    badge: 'Crossroads of Civilizations',
    aliases: ['turkiye', 'türkiye', 'турция', 'istanbul country']
  },
  {
    id: 'city-istanbul',
    title: 'Istanbul',
    subtitle: 'Metropolis · Marmara, Turkey',
    category: 'city',
    country: 'Turkey',
    countryCode: 'TUR',
    countryId: 'turkey',
    flag: '🇹🇷',
    lat: 41.0082,
    lng: 28.9784,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80',
    description: 'Historic imperial capital straddling Europe and Asia across the glittering Bosphorus strait.',
    badge: 'Bosphorus Capital',
    aliases: ['constantinople', 'stambul', 'стамбул', 'byzantium']
  },
  {
    id: 'dest-cappadocia',
    title: 'Cappadocia',
    subtitle: 'Destination · Central Anatolia, Turkey',
    category: 'destination',
    country: 'Turkey',
    countryCode: 'TUR',
    countryId: 'cappadocia',
    flag: '🇹🇷',
    lat: 38.6431,
    lng: 34.8289,
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
    description: 'Fairytale volcanic landscape famous for fairy chimneys, cave hotels, underground cities, and sunrise hot air balloons.',
    badge: 'Fairy Chimneys',
    aliases: ['goreme', 'uchisar', 'urgup', 'hot air balloons', 'kapadokya']
  },
  {
    id: 'landmark-hagia-sophia',
    title: 'Hagia Sophia Grand Mosque',
    subtitle: 'Landmark · Istanbul, Turkey',
    category: 'landmark',
    country: 'Turkey',
    countryCode: 'TUR',
    countryId: 'turkey',
    flag: '🇹🇷',
    lat: 41.0086,
    lng: 28.9802,
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80',
    description: 'Byzantine structural masterpiece of soaring golden mosaics and monumental domes.',
    badge: 'Byzantine Wonder',
    aliases: ['ayasofya', 'hagia sophia', 'holy wisdom', 'sultanahmet']
  },

  // ==================== UNITED STATES & NEW YORK ====================
  {
    id: 'country-usa',
    title: 'United States',
    subtitle: 'Country · North America',
    category: 'country',
    country: 'United States',
    countryCode: 'USA',
    countryId: 'usa',
    flag: '🇺🇸',
    lat: 37.0902,
    lng: -95.7129,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    description: 'Continent-spanning nation of iconic metropolises, diverse cultures, and world-class national parks.',
    badge: 'Global Hub',
    aliases: ['usa', 'us', 'america', 'united states of america', 'сша']
  },
  {
    id: 'city-new-york',
    title: 'New York City',
    subtitle: 'Metropolis · New York, USA',
    category: 'city',
    country: 'United States',
    countryCode: 'USA',
    countryId: 'usa',
    flag: '🇺🇸',
    lat: 40.7128,
    lng: -74.0060,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    description: 'The Big Apple: global center of finance, Broadway theatre, Central Park, and the Statue of Liberty.',
    badge: 'The Big Apple',
    aliases: ['nyc', 'new york', 'manhattan', 'brooklyn']
  },
  {
    id: 'landmark-statue-of-liberty',
    title: 'Statue of Liberty',
    subtitle: 'Landmark · New York, USA',
    category: 'landmark',
    country: 'United States',
    countryCode: 'USA',
    countryId: 'usa',
    flag: '🇺🇸',
    lat: 40.6892,
    lng: -74.0445,
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80',
    description: 'Colossal neoclassical copper sculpture welcoming travelers into New York Harbor.',
    badge: 'Symbol of Liberty',
    aliases: ['lady liberty', 'liberty island', 'ellis island']
  },

  // ==================== ITALY & ROME ====================
  {
    id: 'country-italy',
    title: 'Italy',
    subtitle: 'Country · Southern Europe',
    category: 'country',
    country: 'Italy',
    countryCode: 'ITA',
    countryId: 'italy',
    flag: '🇮🇹',
    lat: 41.8719,
    lng: 12.5674,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    description: 'Cradle of ancient Roman civilization and the Renaissance, with sun-drenched coasts and world-famous cuisine.',
    badge: 'Mediterranean Jewel',
    aliases: ['ita', 'italia', 'италия', 'rome country']
  },
  {
    id: 'city-rome',
    title: 'Rome',
    subtitle: 'Capital City · Lazio, Italy',
    category: 'city',
    country: 'Italy',
    countryCode: 'ITA',
    countryId: 'italy',
    flag: '🇮🇹',
    lat: 41.9028,
    lng: 12.4964,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    description: 'The Eternal City packed with ancient ruins like the Colosseum, Trevi Fountain, and Vatican City.',
    badge: 'The Eternal City',
    aliases: ['roma', 'рим', 'vatican city']
  },
  {
    id: 'landmark-colosseum',
    title: 'Colosseum & Roman Forum',
    subtitle: 'Landmark · Rome, Italy',
    category: 'landmark',
    country: 'Italy',
    countryCode: 'ITA',
    countryId: 'italy',
    flag: '🇮🇹',
    lat: 41.8902,
    lng: 12.4922,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    description: 'Largest ancient amphitheatre ever built, hosting gladiatorial games in the heart of Rome.',
    badge: 'Ancient Roman Wonder',
    aliases: ['colosseo', 'flavian amphitheatre', 'roman colosseum']
  },

  // ==================== EGYPT & PYRAMIDS ====================
  {
    id: 'country-egypt',
    title: 'Egypt',
    subtitle: 'Country · North Africa',
    category: 'country',
    country: 'Egypt',
    countryCode: 'EGY',
    countryId: 'egypt',
    flag: '🇪🇬',
    lat: 26.8206,
    lng: 30.8025,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
    description: 'Millennia of pharaonic wonders along the Nile River, from the Great Pyramids of Giza to Luxor temples.',
    badge: 'Pharaonic Heritage',
    aliases: ['egy', 'misr', 'египет', 'cairo country']
  },
  {
    id: 'city-cairo',
    title: 'Cairo',
    subtitle: 'Capital City · Egypt',
    category: 'city',
    country: 'Egypt',
    countryCode: 'EGY',
    countryId: 'egypt',
    flag: '🇪🇬',
    lat: 30.0444,
    lng: 31.2357,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant capital on the Nile featuring the Grand Egyptian Museum and medieval Islamic bazaars.',
    badge: 'Nile Capital',
    aliases: ['al qahirah', 'giza', 'каир']
  },
  {
    id: 'landmark-pyramids-giza',
    title: 'Great Pyramid of Giza & Sphinx',
    subtitle: 'Landmark · Giza, Egypt',
    category: 'landmark',
    country: 'Egypt',
    countryCode: 'EGY',
    countryId: 'egypt',
    flag: '🇪🇬',
    lat: 29.9792,
    lng: 31.1342,
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80',
    description: 'Last surviving monument of the Ancient Seven Wonders of the World, built around 2560 BC.',
    badge: 'Ancient World Wonder',
    aliases: ['pyramids', 'khufu pyramid', 'sphinx', 'giza pyramids']
  },

  // ==================== UNITED KINGDOM & LONDON ====================
  {
    id: 'country-uk',
    title: 'United Kingdom',
    subtitle: 'Country · Northern Europe',
    category: 'country',
    country: 'United Kingdom',
    countryCode: 'GBR',
    countryId: 'uk',
    flag: '🇬🇧',
    lat: 55.3781,
    lng: -3.4360,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    description: 'Historic kingdom comprising England, Scotland, Wales, and Northern Ireland, rich in royal heritage.',
    badge: 'Royal Heritage',
    aliases: ['uk', 'gbr', 'great britain', 'britain', 'england', 'scotland', 'london country']
  },
  {
    id: 'city-london',
    title: 'London',
    subtitle: 'Capital City · England, UK',
    category: 'city',
    country: 'United Kingdom',
    countryCode: 'GBR',
    countryId: 'uk',
    flag: '🇬🇧',
    lat: 51.5074,
    lng: -0.1278,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    description: 'Global financial and cultural hub with Big Ben, Tower Bridge, West End theatre, and royal palaces.',
    badge: 'Global Capital',
    aliases: ['londres', 'лондон', 'thames', 'big ben city']
  },
  {
    id: 'landmark-tower-london',
    title: 'Tower of London & Crown Jewels',
    subtitle: 'Landmark · London, UK',
    category: 'landmark',
    country: 'United Kingdom',
    countryCode: 'GBR',
    countryId: 'uk',
    flag: '🇬🇧',
    lat: 51.5081,
    lng: -0.0759,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    description: 'Nearly 1,000-year-old royal fortress housing the dazzling British Crown Jewels.',
    badge: 'Royal Fortress',
    aliases: ['tower of london', 'crown jewels', 'white tower london']
  },

  // ==================== GERMANY & BERLIN ====================
  {
    id: 'country-germany',
    title: 'Germany',
    subtitle: 'Country · Central Europe',
    category: 'country',
    country: 'Germany',
    countryCode: 'DEU',
    countryId: 'germany',
    flag: '🇩🇪',
    lat: 51.1657,
    lng: 10.4515,
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80',
    description: 'Heart of Europe boasting fairytale castles, Black Forest pine trails, and Berlin’s vibrant arts scene.',
    badge: 'Heart of Europe',
    aliases: ['deu', 'deutschland', 'germania', 'германия', 'berlin country']
  },
  {
    id: 'city-berlin',
    title: 'Berlin',
    subtitle: 'Capital City · Germany',
    category: 'city',
    country: 'Germany',
    countryCode: 'DEU',
    countryId: 'germany',
    flag: '🇩🇪',
    lat: 52.5200,
    lng: 13.4050,
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80',
    description: 'Dynamic cultural capital featuring Museum Island, Brandenburg Gate, and legendary club culture.',
    badge: 'Creative Capital',
    aliases: ['brandenburg', 'берлин']
  },

  // ==================== NIGER & SAHARA ====================
  {
    id: 'country-niger',
    title: 'Niger',
    subtitle: 'Country · Western Africa',
    category: 'country',
    country: 'Niger',
    countryCode: 'NER',
    countryId: 'niger',
    flag: '🇳🇪',
    lat: 17.6078,
    lng: 8.0817,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
    description: 'Sahelian cultural hub famed for the clay minaret of Agadez, the Niger River valley, and Sahara dunes.',
    badge: 'Sahelian Oasis',
    aliases: ['ner', 'republique du niger', 'sahel', 'нигер']
  },
  {
    id: 'landmark-agadez-mosque',
    title: 'Agadez Grand Mosque',
    subtitle: 'Landmark · Agadez, Niger',
    category: 'landmark',
    country: 'Niger',
    countryCode: 'NER',
    countryId: 'niger',
    flag: '🇳🇪',
    lat: 16.9739,
    lng: 7.9911,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
    description: 'World-famous 27-meter tall banco mud-brick minaret built in 1515, a UNESCO World Heritage treasure.',
    badge: 'UNESCO Mud Minaret',
    aliases: ['agadez minaret', 'great mosque agadez', 'banco mosque']
  }
];

/**
 * Top Recommended / Popular searches displayed when search is empty
 */
export const POPULAR_SEARCH_PRESETS = [
  { label: 'Dubai', query: 'Dubai', type: 'city', flag: '🇦🇪' },
  { label: 'Paris', query: 'Paris', type: 'city', flag: '🇫🇷' },
  { label: 'Japan', query: 'Japan', type: 'country', flag: '🇯🇵' },
  { label: 'Beaches', query: 'beaches', type: 'destination', flag: '🏖️' },
  { label: 'Food', query: 'food', type: 'destination', flag: '🍷' },
  { label: 'Mountains', query: 'mountains', type: 'destination', flag: '🏔️' },
  { label: 'Samarkand', query: 'Samarkand', type: 'city', flag: '🇺🇿' },
  { label: 'Iceland', query: 'Iceland', type: 'country', flag: '🇮🇸' },
  { label: 'Italy', query: 'Italy', type: 'country', flag: '🇮🇹' },
  { label: 'New York', query: 'New York', type: 'city', flag: '🇺🇸' }
];

/**
 * Comprehensive Multi-Facet Search Function:
 * Accurately scores and filters countries, cities, destinations, and landmarks.
 */
export function searchGlobalDestinations(query: string, limit = 8): SearchResultItem[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  // Scoring function
  const scoredItems: { item: SearchResultItem; score: number }[] = [];

  for (const item of GLOBAL_SEARCH_INDEX) {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const countryLower = item.country.toLowerCase();
    const codeLower = item.countryCode.toLowerCase();
    const subLower = item.subtitle.toLowerCase();
    const descLower = item.description.toLowerCase();

    // 1. Exact match on title or ISO code
    if (titleLower === q || codeLower === q) {
      score += 200;
    }
    // 2. Exact start of title (e.g. "du" -> "Dubai", "fra" -> "France", "par" -> "Paris")
    else if (titleLower.startsWith(q)) {
      score += 120;
    }
    // 3. Word starts with query in title (e.g. "khalifa" -> "Burj Khalifa", "riviera" -> "French Riviera")
    else if (titleLower.split(/\s+/).some(w => w.startsWith(q))) {
      score += 90;
    }
    // 4. Substring in title
    else if (titleLower.includes(q)) {
      score += 70;
    }

    // 5. Query matching Country name or Country prefix
    if (countryLower === q) {
      score += 80;
    } else if (countryLower.startsWith(q)) {
      score += 65;
    } else if (countryLower.includes(q)) {
      score += 35;
    }

    // 6. Aliases match
    if (item.aliases && item.aliases.some(a => a.toLowerCase() === q)) {
      score += 110;
    } else if (item.aliases && item.aliases.some(a => a.toLowerCase().startsWith(q))) {
      score += 85;
    } else if (item.aliases && item.aliases.some(a => a.toLowerCase().includes(q))) {
      score += 45;
    }

    // 7. Subtitle / category / description matching
    if (subLower.includes(q)) {
      score += 25;
    }
    if (descLower.includes(q)) {
      score += 15;
    }

    // Special query enhancements:
    // When typing "du":
    // "Dubai" (score ~120+), "United Arab Emirates" should appear with high relevance!
    if (q === 'du' || q === 'dub') {
      if (item.id === 'city-dubai') score += 50;
      if (item.id === 'country-uae') score += 45; // UAE contains Dubai
      if (item.id === 'landmark-burj-khalifa') score += 30;
    }

    // When typing "fra":
    // "France", "Paris", "French Riviera" should be top
    if (q === 'fra' || q === 'fran') {
      if (item.id === 'country-france') score += 60;
      if (item.id === 'dest-french-riviera') score += 50;
      if (item.id === 'city-paris') score += 40; // Paris is capital of France
      if (item.id === 'landmark-eiffel-tower') score += 30;
    }

    if (score > 0) {
      scoredItems.push({ item, score });
    }
  }

  // Sort by highest score descending
  scoredItems.sort((a, b) => b.score - a.score);

  // If no static results or fewer than limit, also consult dynamic destinationCatalog
  const results: SearchResultItem[] = scoredItems.map(s => s.item).slice(0, limit);

  // Check if we need fallback from catalog or dynamic country generator
  if (results.length < limit) {
    const catalogMatches = DESTINATIONS_CATALOG.filter(
      d => !results.some(r => r.countryId === d.id || r.id === `country-${d.id}`) &&
           (d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))
    );

    for (const d of catalogMatches) {
      results.push({
        id: `catalog-${d.id}`,
        title: d.name,
        subtitle: `${d.type === 'country' ? 'Country' : 'Destination'} · ${d.region || d.country}`,
        category: d.type === 'country' ? 'country' : 'destination',
        country: d.country,
        countryCode: d.countryCode,
        countryId: d.id,
        flag: d.flag,
        lat: d.lat,
        lng: d.lng,
        image: d.popularDestinations[0]?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        description: d.description,
        badge: d.visaVerified?.status || 'Verified Destination',
        destinationItem: d
      });
      if (results.length >= limit) break;
    }
  }

  return results;
}

/**
 * Resolves a SearchResultItem into a fully hydrated DestinationItem for the app state
 */
export function resolveSearchResultToDestination(result: SearchResultItem): DestinationItem {
  if (result.destinationItem) {
    return result.destinationItem;
  }

  const resolved = resolveDestination(result.countryId) || resolveDestination(result.country) || resolveDestination(result.title);
  if (resolved) {
    // If selecting a specific landmark/city, adapt the coordinates and places focus
    return {
      ...resolved,
      lat: result.lat,
      lng: result.lng,
      name: result.category === 'country' ? resolved.name : result.title
    };
  }

  // Fallback to generator
  return generateDestinationForCountry(result.country || result.title, result.countryCode, result.lat, result.lng);
}
