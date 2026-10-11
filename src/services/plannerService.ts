/**
 * TripMind AI Trip Planner Service Layer
 * 
 * Clean abstraction for AI-powered and algorithmic travel planning.
 * Designed to seamlessly interface with the real FastAPI backend (/api/v1/trips/generate or /api/v1/ai/plan)
 * with robust, realistic deterministic fallbacks when offline or unauthenticated.
 */

import { api } from './api';
import type { CurrencyCode } from '../context/CurrencyContext';

export interface TravelerCount {
  adults: number;
  children: number;
  total: number;
}

export type TravelStyle =
  | 'Relaxation'
  | 'Adventure'
  | 'Food'
  | 'Culture'
  | 'Nature'
  | 'Luxury'
  | 'Budget'
  | 'Family'
  | 'Romantic';

export interface PlannerInput {
  destination: string;
  dateType: 'flexible' | 'dates';
  flexibleDuration: number; // in days, e.g. 1-14
  startDate?: string;
  endDate?: string;
  travelers: {
    adults: number;
    children: number;
  };
  currency: CurrencyCode;
  budget: number; // Target total budget
  budgetTier?: 'budget' | 'moderate' | 'luxury' | 'custom';
  style: TravelStyle;
  interests: string[];
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
  currency: string;
}

export interface TimeSlotActivity {
  id: string;
  title: string;
  location: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  time: string;
  duration: string;
  estimatedCost: number;
  cuisine?: string;
  tip?: string;
  category: 'attraction' | 'food' | 'culture' | 'transport' | 'leisure';
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  dateStr: string;
  morning: TimeSlotActivity;
  afternoon: TimeSlotActivity;
  evening: TimeSlotActivity;
  hotel: {
    name: string;
    stars: number;
    pricePerNight: number;
    area: string;
  };
  dailyCost: number;
}

export interface GeneratedTripResult {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: TravelerCount;
  style: TravelStyle;
  interests: string[];
  currency: string;
  budgetBreakdown: BudgetBreakdown;
  days: DayItinerary[];
  shareToken: string;
  createdAt: string;
  isSaved?: boolean;
  rawTripData?: any;
}

// Curated destination data for realistic local synthesis
interface CitySights {
  city: string;
  country: string;
  flag: string;
  heroImage: string;
  mornings: Array<{ title: string; location: string; cost: number; tip: string }>;
  afternoons: Array<{ title: string; location: string; cost: number; tip: string }>;
  evenings: Array<{ restaurant: string; location: string; cuisine: string; cost: number; tip: string }>;
  hotels: Array<{ name: string; stars: number; priceRatio: number; area: string }>;
}

const DESTINATION_DATABASE: Record<string, CitySights> = {
  samarkand: {
    city: 'Samarkand',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    heroImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Registan Ensemble & Sher-Dor Madrasah', location: 'Registan Square', cost: 12, tip: 'Early morning light is ideal for photography without tour bus crowds.' },
      { title: 'Shah-i-Zinda Tile Necropolis', location: 'Afrasiyab Hill', cost: 8, tip: 'Dress modestly with covered shoulders for this sacred pilgrimage site.' },
      { title: 'Gur-e-Amir Royal Timurid Mausoleum', location: 'Amir Timur St', cost: 7, tip: 'Inspect the deep jade cenotaph beneath the azure fluted dome.' },
      { title: 'Ulugh Beg Medieval Observatory & Museum', location: 'Chupan-Ata Hills', cost: 6, tip: 'Marvel at the massive 15th-century stone sextant.' },
      { title: 'Bibi-Khanym Grand Mosque', location: 'Bibikhanum St', cost: 7, tip: 'Historic gateway once one of the largest mosques in the Islamic world.' },
    ],
    afternoons: [
      { title: 'Siab Folk Bazaar Tasting & Silk Weaving', location: 'Bibikhanum Gate', cost: 15, tip: 'Sample Samarkand flatbread, halva, and sun-dried yellow raisins freely.' },
      { title: 'Koni Ghil Mulberry Artisan Paper Mill', location: 'Siyob River Valley', cost: 10, tip: 'See ancient water-wheel techniques making 1,000-year durable silk paper.' },
      { title: 'Afrasiyab Ancient Silk Road Museum', location: 'Northern Samarkand', cost: 8, tip: 'View the famous 7th-century Sogdian wall frescoes of arriving envoys.' },
      { title: 'Samarkand Silk Carpet Hand-Knotting Factory', location: 'Khujand St', cost: 5, tip: 'Observe natural dyes crafted from walnut bark, pomegranate & indigo.' },
    ],
    evenings: [
      { restaurant: 'Caravan Courtyard & Plov House', location: 'Old Jewish Quarter', cuisine: 'Slow-Cooked Samarkand Beef Plov & Manti', cost: 22, tip: 'Reserve an outdoor terrace table under the grapevine trellis.' },
      { restaurant: 'Platan Garden Bistro', location: 'Pushkin St', cuisine: 'Silk Road Shashlik, Wine & Grilled Eggplant', cost: 28, tip: 'Pair your meal with regional Bagizagan Samarkand vintage wine.' },
      { restaurant: 'Bibikhanum Teahouse Oasis', location: 'Bibi-Khanym Plaza', cuisine: 'Lagman Noodles, Fresh Tandir Bread & Green Tea', cost: 16, tip: 'Sunset views over the illuminated turquoise domes.' },
      { restaurant: 'Samarkand Restaurant Grand Hall', location: 'Mahmud Kashgari', cuisine: 'Uzbek Feast with Live Sitar Performance', cost: 30, tip: 'Enjoy traditional folk dancing and dessert tea sets.' },
    ],
    hotels: [
      { name: 'Registan Heritage Boutique Hotel', stars: 4, priceRatio: 0.35, area: 'Historic Center (Walking distance to Registan)' },
      { name: 'Emir Han Grand Palace', stars: 5, priceRatio: 0.55, area: 'Old Town Boulevard' },
      { name: 'Silk Road Chaykhana Inn', stars: 3, priceRatio: 0.22, area: 'Siab Bazaar Quarter' }
    ]
  },
  bukhara: {
    city: 'Bukhara',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    heroImage: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Kalon Minaret & Po-i-Kalyan Complex', location: 'Kalyan Square', cost: 10, tip: 'Spared by Genghis Khan due to its sheer geometric magnificence.' },
      { title: 'The Ark Citadel of the Bukharan Emirs', location: 'Registan Bukhara', cost: 9, tip: 'Explore royal throne rooms and ancient fortress ramparts.' },
      { title: 'Chor Minor Four-Towered Madrasah', location: 'Chor Minor Alley', cost: 5, tip: 'Climb the tiny interior staircase up to the roof for a rooftop tea.' },
      { title: 'Samanid Dynastic Brick Mausoleum', location: 'Samani Park', cost: 6, tip: 'Over 1,100 years old, built with intricate baked brickwork patterns.' },
    ],
    afternoons: [
      { title: 'Ancient Trading Domes (Toqi Sarrofon & Zargaron)', location: 'Covered Bazaars', cost: 15, tip: 'Watch master craftsmen forge Bukhara bird-scissors and Suzani embroidery.' },
      { title: 'Bolo Hauz Mosque of 40 Pillar Reflections', location: 'Opposite Ark Citadel', cost: 4, tip: 'Look up at the carved walnut ceiling painted in Persian lapis lazuli.' },
      { title: 'Sitorai Mokhi-Khosa Summer Palace of the Last Emir', location: '4km North Bukhara', cost: 12, tip: 'Fascinating blend of Russian imperial architecture and oriental tilework.' },
    ],
    evenings: [
      { restaurant: 'Lyabi-Hauz Poolside Chaykhana', location: 'Lyabi-Hauz Plaza', cuisine: 'Bukhara Oshi Sofi Plov & Lamb Kebabs', cost: 20, tip: 'Sit on cushioned tapchans under 500-year-old mulberry trees.' },
      { restaurant: 'Old Bukhara Rooftop Lounge', location: 'Samarkandskaya St', cuisine: 'Pumpkin Manti, Stuffed Quince & Green Tea', cost: 25, tip: 'Panoramic rooftop view of the Kalon Minaret glowing at dusk.' },
      { restaurant: 'Minzifa Heritage Courtyard', location: 'Eshoni Pir St', cuisine: 'Traditional Vegetarian & Lamb Delicacies', cost: 24, tip: 'Authentic 19th-century merchant courtyard atmosphere.' }
    ],
    hotels: [
      { name: 'Kalyan Heritage Boutique Caravanserai', stars: 4, priceRatio: 0.35, area: 'Lyabi-Hauz Historic District' },
      { name: 'Amulet Merchant House Hotel', stars: 4, priceRatio: 0.38, area: 'Old Jewish Quarter' },
    ]
  },
  tashkent: {
    city: 'Tashkent',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Hazrati Imam Complex & Uthman Quran', location: 'Old City (Eski Shahar)', cost: 10, tip: 'Home to the world\'s oldest original holy Quran on deer parchment.' },
      { title: 'Tashkent Metro Architectural Tour', location: 'Kosmonavtlar & Alisher Navoi Stations', cost: 2, tip: 'Each station is a marble and chandelier art gallery underground.' },
      { title: 'Amir Timur Square & State Museum', location: 'City Center', cost: 6, tip: 'Stroll through the shaded plane trees by the iconic Hotel Uzbekistan.' },
    ],
    afternoons: [
      { title: 'Chorsu Giant Turquoise Dome Bazaar', location: 'Navoi Avenue', cost: 12, tip: 'Vibrant center for dry fruits, mountain honey, spices, and fresh curds.' },
      { title: 'State Museum of Applied Arts', location: 'Rakatboshi St', cost: 8, tip: 'Ornate carving and gold-embroidery palace built for a Tsarist diplomat.' },
      { title: 'Tashkent TV Tower & Japanese Garden', location: 'Amir Timur St', cost: 10, tip: 'Offers 360-degree views across the green sprawling metropolis.' },
    ],
    evenings: [
      { restaurant: 'Besh Qozon Central Asian Plov Center', location: 'Gardens of TV Tower', cuisine: 'Gigantic Kazans of Wedding & Chaykhana Plov', cost: 15, tip: 'Watch master chefs stir 1,000kg cast-iron cauldrons.' },
      { restaurant: 'Afsona Contemporary Uzbek Dining', location: 'Taras Shevchenko St', cuisine: 'Modern Gourmet Silk Road Tasting Menu', cost: 32, tip: 'Great wine list and refined take on traditional flavors.' },
      { restaurant: 'Caravan Uzbek Art Restaurant', location: 'Kakhar St', cuisine: 'Home-style Chuchvara Dumplings & Somsa', cost: 22, tip: 'Filled with authentic carpets, ceramic plates and cozy alcoves.' }
    ],
    hotels: [
      { name: 'Hyatt Regency Tashkent', stars: 5, priceRatio: 0.50, area: 'Navoi Boulevard' },
      { name: 'Hotel Uzbekistan Historic Icon', stars: 4, priceRatio: 0.28, area: 'Amir Timur Square' },
    ]
  },
  khiva: {
    city: 'Khiva',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    heroImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Ichan-Kala Open-Air UNESCO Fortress', location: 'West Gate Khiva', cost: 15, tip: 'An entirely preserved walled medieval mud-brick desert oasis.' },
      { title: 'Kalta Minor Turquoise Turquoise Minaret', location: 'Ichan-Kala Center', cost: 5, tip: 'The iconic fat glazed minaret intended to reach Bukhara.' },
      { title: 'Juma Mosque of 218 Carved Wooden Columns', location: 'Central Alley', cost: 6, tip: 'No two columns have the exact same Islamic wood carving.' },
    ],
    afternoons: [
      { title: 'Kunya-Ark Fortress & Sunset Watchtower', location: 'Ichan-Kala Ramparts', cost: 8, tip: 'Climb the Ak-Sheikh Baba bastion for golden desert panoramas.' },
      { title: 'Tosh-Hovli Stone Palace of the Khan', location: 'East Gate', cost: 8, tip: 'Most lavish majolica blue tilework in Central Asia.' },
      { title: 'Islom Khodja Minaret Climb', location: 'South Gate', cost: 7, tip: 'Khiva\'s tallest minaret, offering dizzying 360-degree views.' },
    ],
    evenings: [
      { restaurant: 'Khorezm Art Restaurant & Yurt Terrace', location: 'Allakuli Khan Madrasah', cuisine: 'Green Shivit Oshi Dill Noodles & Khorezm Fish', cost: 18, tip: 'Unique regional pasta dish found only in Khiva oasis.' },
      { restaurant: 'Terrassa Cafe & Sunset Balcony', location: 'Opposite Kunya-Ark', cuisine: 'Tuhum Barak Egg Dumplings & Grilled Skewers', cost: 22, tip: 'The best golden hour cocktail and dinner perch in the city.' },
      { restaurant: 'Zarafshan Traditional Teahouse', location: 'Islam Khodja St', cuisine: 'Clay Oven Somsa & Mint Mountain Tea', cost: 14, tip: 'Live dutar lute playing as torches light the ancient walls.' }
    ],
    hotels: [
      { name: 'Orient Star Khiva Madrasah Hotel', stars: 4, priceRatio: 0.35, area: 'Inside Ichan-Kala Ancient Walls' },
      { name: 'Bek Khiva Boutique Resort', stars: 4, priceRatio: 0.30, area: 'Old Town North Gate' }
    ]
  },
  paris: {
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Louvre Museum & Tuileries Garden Stroll', location: '1st Arrondissement', cost: 22, tip: 'Enter via the Carrousel du Louvre underground to bypass plaza queues.' },
      { title: 'Sainte-Chapelle & Notre-Dame Island Walk', location: 'Île de la Cité', cost: 15, tip: 'Sunlight through the 13th-century stained glass windows is dazzling.' },
      { title: 'Montmartre & Sacré-Cœur Sunrise Ascent', location: '18th Arrondissement', cost: 0, tip: 'Start early before painters and tour crowds fill Place du Tertre.' },
    ],
    afternoons: [
      { title: 'Musée d\'Orsay Impressionist Masterpieces', location: 'Left Bank Seine', cost: 18, tip: 'Admire Monet, Van Gogh and Renoir inside a grand Beaux-Arts railway station.' },
      { title: 'Le Marais Historic Mansions & Artisan Boutiques', location: '4th Arrondissement', cost: 12, tip: 'Grab falafel on Rue des Rosiers and explore hidden courtyards.' },
      { title: 'Seine River Scenic Boat Cruise', location: 'Pont Neuf', cost: 17, tip: 'Glides under historic bridges with skyline views of landmark monuments.' },
    ],
    evenings: [
      { restaurant: 'Le Bouillon Chartier Classic Hall', location: 'Grands Boulevards', cuisine: 'Classic French Duck Confit & Escargots', cost: 28, tip: 'Historic 1896 Belle Époque hall with surprisingly accessible pricing.' },
      { restaurant: 'Chez Janou Provençal Bistro', location: 'Place des Vosges', cuisine: 'Provençal Ratatouille & Giant Chocolate Mousse', cost: 42, tip: 'Endless pastis selection and lively Parisian atmosphere.' },
      { restaurant: 'Terrasse Eiffel Skyline Dining', location: 'Trocadéro', cuisine: 'French Gastronomy with Sparkling Tower Views', cost: 65, tip: 'Watch the Eiffel Tower light show sparkle on the hour.' }
    ],
    hotels: [
      { name: 'Hotel Marais Heritage Boutique', stars: 4, priceRatio: 0.40, area: 'Le Marais' },
      { name: 'Saint-Germain Grand River Hotel', stars: 5, priceRatio: 0.60, area: 'Latin Quarter' }
    ]
  },
  tokyo: {
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Senso-ji Temple & Asakusa Nakamise Alley', location: 'Taito Ward', cost: 5, tip: 'Purify with incense smoke and sample fresh warm ningyo-yaki cakes.' },
      { title: 'Meiji Jingu Forest Shrine & Harajuku', location: 'Shibuya', cost: 0, tip: 'Walk under colossal cedar Torii gates through a tranquil 170-acre forest.' },
      { title: 'Tsukiji Outer Seafood Market Food Tour', location: 'Chuo City', cost: 20, tip: 'Sample tamagoyaki sweet omelets, wagyu skewers, and fresh sashimi.' },
    ],
    afternoons: [
      { title: 'Shibuya Crossing & Hachiko Plaza', location: 'Shibuya', cost: 5, tip: 'Watch thousands cross from the second-floor Shibuya Sky viewpoint.' },
      { title: 'Akihabara Electric Town & Retro Arcades', location: 'Chiyoda', cost: 15, tip: 'Explore multi-story electronics, anime figurines, and vintage games.' },
      { title: 'Shinjuku Gyoen National Garden & Greenhouses', location: 'Shinjuku', cost: 4, tip: 'Blend of traditional Japanese, English landscape, and French gardens.' },
    ],
    evenings: [
      { restaurant: 'Omoide Yokocho (Memory Lane) Izakaya', location: 'West Shinjuku', cuisine: 'Charcoal Yakitori, Cold Kirin & Edamame', cost: 25, tip: 'Atmospheric lanterns and smoky narrow lantern-lit alleyways.' },
      { restaurant: 'Ramen Street Tokyo Station', location: 'Marunouchi', cuisine: 'Rich Tonkotsu & Tsukemen Dipping Ramen', cost: 14, tip: 'Order via the vending ticket machine before sitting.' },
      { restaurant: 'Roppongi Hills Sunset Lounge', location: 'Minato', cuisine: 'Modern Japanese Fusion & Cocktails', cost: 48, tip: 'Stunning panorama with Tokyo Tower glowing orange.' }
    ],
    hotels: [
      { name: 'Shinjuku Prince Hotel', stars: 4, priceRatio: 0.38, area: 'Shinjuku Central' },
      { name: 'Asakusa Ryokan Heritage Stay', stars: 4, priceRatio: 0.42, area: 'Historic Asakusa' }
    ]
  },
  rome: {
    city: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Colosseum & Roman Forum Imperial Walk', location: 'Piazza del Colosseo', cost: 24, tip: 'Walk across ancient cobblestones where gladiators and senators once trod.' },
      { title: 'Vatican Museums & Sistine Chapel', location: 'Vatican City', cost: 28, tip: 'Book early entry tickets to admire Michelangelo\'s ceiling in quiet splendor.' },
      { title: 'Pantheon & Piazza Navona Fountains', location: 'Centro Storico', cost: 5, tip: 'Marvel at the ancient Roman oculus dome open to the blue sky.' },
    ],
    afternoons: [
      { title: 'Trevi Fountain & Spanish Steps Gelato Tour', location: 'Piazza di Trevi', cost: 10, tip: 'Toss a coin over your left shoulder to guarantee your return to Rome.' },
      { title: 'Trastevere Cobblestone Quarter & Artisan Studios', location: 'Trastevere', cost: 8, tip: 'Explore ivy-draped alleyways and hidden medieval basilicas.' },
      { title: 'Borghese Gallery & Villa Gardens', location: 'Pincian Hill', cost: 18, tip: 'Incredible Bernini marble sculptures in a private cardinal palace.' },
    ],
    evenings: [
      { restaurant: 'Osteria Da Enzo al 29', location: 'Trastevere', cuisine: 'Creamy Cacio e Pepe, Carbonara & Carciofi alla Giudia', cost: 30, tip: 'Arrive 15 minutes before opening for authentic Roman trattoria seating.' },
      { restaurant: 'Pizzeria Da Baffetto', location: 'Near Piazza Navona', cuisine: 'Thin-Crust Wood-Fired Roman Pizza & House Chianti', cost: 18, tip: 'Classic bustling pizzeria with century-old wood ovens.' },
      { restaurant: 'Terrazza Borromini Piazza Navona', location: 'Piazza Navona', cuisine: 'Fine Italian Seafood & Sunset Views over Bernini Fountains', cost: 55, tip: 'Breathtaking rooftop dining directly overlooking the piazza.' }
    ],
    hotels: [
      { name: 'Hotel Navona Palace Residenza', stars: 4, priceRatio: 0.38, area: 'Historic Center' },
      { name: 'Trastevere Boutique Suites', stars: 4, priceRatio: 0.34, area: 'Trastevere' }
    ]
  },
  istanbul: {
    city: 'Istanbul',
    country: 'Turkey',
    flag: '🇹🇷',
    heroImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Hagia Sophia Grand Mosque & Sultanahmet Square', location: 'Fatih District', cost: 25, tip: 'Remove shoes at entrance; admire 1,500-year-old Byzantine golden mosaics.' },
      { title: 'Topkapi Palace & Imperial Harem Gardens', location: 'Sultanahmet', cost: 20, tip: 'Visit the Ottoman treasury and panoramic Bosphorus pavilions.' },
      { title: 'Blue Mosque & Ancient Hippodrome', location: 'At Meydani', cost: 0, tip: 'Look up at over 20,000 handmade blue Iznik ceramic tiles.' },
    ],
    afternoons: [
      { title: 'Grand Bazaar & Spice Market (Misir Carsisi)', location: 'Eminonu', cost: 15, tip: 'Bargain gently for Turkish delight, apple tea, and handwoven kilim rugs.' },
      { title: 'Bosphorus Intercontinental Ferry Cruise', location: 'Eminonu Pier to Karakoy', cost: 4, tip: 'Cross between Europe and Asia with seagulls gliding alongside.' },
      { title: 'Galata Tower & Karakoy Art District', location: 'Beyoglu', cost: 18, tip: 'Climb the 14th-century Genoese tower for 360-degree Golden Horn views.' },
    ],
    evenings: [
      { restaurant: 'Pandeli Historical Restaurant', location: 'Above Spice Bazaar', cuisine: 'Ottoman Palace Cuisine, Eggplant Pie & Lamb Shank', cost: 28, tip: 'Audrey Hepburn and royal dignitaries dined in these turquoise tile halls.' },
      { restaurant: 'Ciya Sofrasi Anatolian Flavors', location: 'Kadikoy (Asian Side)', cuisine: 'Ancient Anatolian Stews, Mezze & Sun-Dried Spices', cost: 22, tip: 'Celebrated culinary institution featured by global gastronomy chefs.' },
      { restaurant: 'Mikla Rooftop Contemporary Dining', location: 'The Marmara Pera', cuisine: 'New Anatolian Gourmet Dining with Bosphorus Sunset', cost: 60, tip: 'World-renowned dining with spectacular illuminated mosque views.' }
    ],
    hotels: [
      { name: 'Sultanahmet Heritage Boutique Hotel', stars: 4, priceRatio: 0.32, area: 'Old City Center' },
      { name: 'Karakoy Pera Palace Icon', stars: 5, priceRatio: 0.50, area: 'Beyoglu Waterfront' }
    ]
  },
  dubai: {
    city: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    mornings: [
      { title: 'Burj Khalifa Observation Deck & Downtown Walk', location: 'Downtown Dubai', cost: 45, tip: 'Ascend the world\'s tallest skyscraper on levels 124 & 125.' },
      { title: 'Al Fahidi Historical Neighborhood & Abra Boat', location: 'Old Dubai Creek', cost: 5, tip: 'Take a traditional 1-AED wooden abra boat across Dubai Creek.' },
      { title: 'Museum of the Future Interactive Exploration', location: 'Sheikh Zayed Road', cost: 38, tip: 'Architectural marvel covered in Arabic calligraphy poetry.' },
    ],
    afternoons: [
      { title: 'Gold & Spice Souks Exploration', location: 'Deira', cost: 10, tip: 'Smell pure saffron, frankincense, and admire intricate gold jewellery.' },
      { title: 'Dubai Mall Aquarium & Underwater Zoo', location: 'Downtown Dubai', cost: 35, tip: 'Walk through the 270-degree acrylic viewing tunnel.' },
      { title: 'Palm Jumeirah & The View at The Palm', location: 'Palm Jumeirah', cost: 28, tip: 'Panoramic 360-degree vista of the world-famous palm-shaped archipelago.' },
    ],
    evenings: [
      { restaurant: 'Arabian Tea House Heritage Cafe', location: 'Al Fahidi', cuisine: 'Emirati Breakfast & Machboos Spiced Rice', cost: 25, tip: 'Charming turquoise courtyard beneath frangipani trees.' },
      { restaurant: 'Dubai Fountain Boardwalk Dining', location: 'Burj Lake', cuisine: 'Middle Eastern Mezze & Grill with Fountain Water Shows', cost: 45, tip: 'Enjoy dinner while water jets dance to world music.' },
      { restaurant: 'Atmosphere at Burj Khalifa', location: 'Level 122', cuisine: 'Ultra-Luxury Dining Above the Clouds', cost: 95, tip: 'Highest restaurant in the world overlooking the Arabian Gulf.' }
    ],
    hotels: [
      { name: 'Address Downtown Hotel', stars: 5, priceRatio: 0.50, area: 'Downtown Dubai' },
      { name: 'Al Seef Heritage Hotel Curio', stars: 4, priceRatio: 0.35, area: 'Dubai Creek' }
    ]
  }
};

export class PlannerService {
  /**
   * Main generation entrypoint
   */
  async generateTrip(input: PlannerInput): Promise<GeneratedTripResult> {
    const durationDays = input.dateType === 'dates' && input.startDate && input.endDate
      ? Math.max(Math.ceil((new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) / (1000 * 3600 * 24)) + 1, 1)
      : (input.flexibleDuration || 4);

    const totalTravelers = (input.travelers.adults || 1) + (input.travelers.children || 0);
    const startDate = input.startDate || new Date().toISOString().split('T')[0];
    const endDate = input.endDate || new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString().split('T')[0];

    // 1. Try real backend integration first if reachable
    try {
      const payload = {
        destination: input.destination,
        days: durationDays,
        start_date: input.startDate || undefined,
        end_date: input.endDate || undefined,
        budget: input.budget,
        travelers: totalTravelers,
        style: input.style,
        language: 'en',
        interests: input.interests
      };

      const backendResponse = await api.post<any>('/trips/generate', payload);
      if (backendResponse && (backendResponse.itinerary || backendResponse.raw_trip_data)) {
        return this.normalizeBackendTrip(backendResponse, input, durationDays, startDate, endDate, totalTravelers);
      }
    } catch (err) {
      console.info('PlannerService: Backend API unavailable, utilizing local synthesis engine:', err);
    }

    // 2. High-fidelity Realistic Synthesis Fallback
    return this.synthesizeLocalTrip(input, durationDays, startDate, endDate, totalTravelers);
  }

  /**
   * Convert backend response into standardized GeneratedTripResult
   */
  private normalizeBackendTrip(
    backendData: any,
    input: PlannerInput,
    durationDays: number,
    startDate: string,
    endDate: string,
    totalTravelers: number
  ): GeneratedTripResult {
    const rawItin = backendData.itinerary || backendData.raw_trip_data || {};
    const tripId = backendData.id ? String(backendData.id) : `trip-${Date.now()}`;
    const shareToken = backendData.share_token || `share-${Date.now()}`;
    const totalBudget = Number(rawItin.totalCost || backendData.totalCost || input.budget || 1200);

    const breakdown = this.calculateBudgetBreakdown(totalBudget, input.style, totalTravelers, durationDays, input.currency);

    const days: DayItinerary[] = Array.from({ length: durationDays }, (_, i) => {
      const rawDay = rawItin.days?.[i] || {};
      const dayDate = new Date(new Date(startDate).getTime() + i * 24 * 3600 * 1000).toISOString().split('T')[0];

      return {
        dayNumber: i + 1,
        title: rawDay.title || `Day ${i + 1}: ${input.destination.split(',')[0]} Highlights`,
        dateStr: dayDate,
        morning: {
          id: `act-${i + 1}-m`,
          title: rawDay.morning?.activity || `${input.destination.split(',')[0]} Historic Monument`,
          location: rawDay.morning?.location || `${input.destination.split(',')[0]} Center`,
          timeSlot: 'morning',
          time: '09:00 AM',
          duration: rawDay.morning?.duration || '2.5 hours',
          estimatedCost: Number(rawDay.morning?.cost || 15),
          tip: rawDay.morning?.tip || 'Arrive early to enjoy peaceful morning ambiance.',
          category: 'attraction'
        },
        afternoon: {
          id: `act-${i + 1}-a`,
          title: rawDay.afternoon?.activity || `${input.destination.split(',')[0]} Artisan Bazaar & Craft Walk`,
          location: rawDay.afternoon?.location || `${input.destination.split(',')[0]} Bazaar Plaza`,
          timeSlot: 'afternoon',
          time: '02:00 PM',
          duration: rawDay.afternoon?.duration || '2.5 hours',
          estimatedCost: Number(rawDay.afternoon?.cost || 20),
          tip: rawDay.afternoon?.tip || 'Local currency cash is recommended for artisan purchases.',
          category: 'culture'
        },
        evening: {
          id: `act-${i + 1}-e`,
          title: rawDay.evening?.restaurant || `Dinner at ${input.destination.split(',')[0]} Heritage Dining`,
          location: rawDay.evening?.address || `${input.destination.split(',')[0]} Old Quarter`,
          timeSlot: 'evening',
          time: '07:30 PM',
          duration: '2.0 hours',
          cuisine: rawDay.evening?.cuisine || 'Regional & National Specialties',
          estimatedCost: Number(rawDay.evening?.cost || 28),
          tip: 'Advance table reservations are recommended during peak season.',
          category: 'food'
        },
        hotel: {
          name: rawDay.hotel?.name || `${input.destination.split(',')[0]} Boutique Hotel`,
          stars: rawDay.hotel?.stars || 4,
          pricePerNight: Number(rawDay.hotel?.price || Math.round(breakdown.accommodation / durationDays)),
          area: rawDay.hotel?.area || 'Historic Center'
        },
        dailyCost: Number(rawDay.dailyCost || Math.round(totalBudget / durationDays))
      };
    });

    return {
      id: tripId,
      title: rawItin.title || `${input.destination.split(',')[0]} — ${input.style} Voyage`,
      destination: input.destination,
      startDate,
      endDate,
      durationDays,
      travelers: {
        adults: input.travelers.adults,
        children: input.travelers.children,
        total: totalTravelers
      },
      style: input.style,
      interests: input.interests,
      currency: input.currency,
      budgetBreakdown: breakdown,
      days,
      shareToken,
      createdAt: new Date().toISOString(),
      rawTripData: rawItin
    };
  }

  /**
   * Synthesize realistic, highly tailored trip data
   */
  private synthesizeLocalTrip(
    input: PlannerInput,
    durationDays: number,
    startDate: string,
    endDate: string,
    totalTravelers: number
  ): GeneratedTripResult {
    const cleanKey = input.destination.toLowerCase().trim().split(',')[0].trim();
    const cityData = DESTINATION_DATABASE[cleanKey] || this.createGenericCityData(input.destination);

    const totalBudget = input.budget || (durationDays * 200 * totalTravelers);
    const breakdown = this.calculateBudgetBreakdown(totalBudget, input.style, totalTravelers, durationDays, input.currency);

    const days: DayItinerary[] = Array.from({ length: durationDays }, (_, i) => {
      const dayDate = new Date(new Date(startDate).getTime() + i * 24 * 3600 * 1000).toISOString().split('T')[0];
      const morningData = cityData.mornings[i % cityData.mornings.length];
      const afternoonData = cityData.afternoons[i % cityData.afternoons.length];
      const eveningData = cityData.evenings[i % cityData.evenings.length];
      const hotelData = cityData.hotels[i % cityData.hotels.length];

      const dailySpend = Math.round(totalBudget / durationDays);

      return {
        dayNumber: i + 1,
        title: `Day ${i + 1}: ${morningData.title.split('&')[0].trim()} & ${cityData.city} Culture`,
        dateStr: dayDate,
        morning: {
          id: `act-${i + 1}-m`,
          title: morningData.title,
          location: morningData.location,
          timeSlot: 'morning',
          time: '09:00 AM',
          duration: '2.5 hours',
          estimatedCost: morningData.cost,
          tip: morningData.tip,
          category: 'attraction'
        },
        afternoon: {
          id: `act-${i + 1}-a`,
          title: afternoonData.title,
          location: afternoonData.location,
          timeSlot: 'afternoon',
          time: '02:00 PM',
          duration: '2.5 hours',
          estimatedCost: afternoonData.cost,
          tip: afternoonData.tip,
          category: 'culture'
        },
        evening: {
          id: `act-${i + 1}-e`,
          title: `Dinner at ${eveningData.restaurant}`,
          location: eveningData.location,
          timeSlot: 'evening',
          time: '07:30 PM',
          duration: '2.0 hours',
          cuisine: eveningData.cuisine,
          estimatedCost: eveningData.cost,
          tip: eveningData.tip,
          category: 'food'
        },
        hotel: {
          name: hotelData.name,
          stars: hotelData.stars,
          pricePerNight: Math.round(breakdown.accommodation / durationDays),
          area: hotelData.area
        },
        dailyCost: dailySpend
      };
    });

    const tripId = `trip-${Date.now()}`;
    const shareToken = `share-${Date.now().toString(36)}`;

    const result: GeneratedTripResult = {
      id: tripId,
      title: `${cityData.city} ${cityData.flag || ''} — ${input.style} Discovery`,
      destination: input.destination,
      startDate,
      endDate,
      durationDays,
      travelers: {
        adults: input.travelers.adults,
        children: input.travelers.children,
        total: totalTravelers
      },
      style: input.style,
      interests: input.interests,
      currency: input.currency,
      budgetBreakdown: breakdown,
      days,
      shareToken,
      createdAt: new Date().toISOString()
    };

    return result;
  }

  /**
   * Distribute total budget realistically across 5 core travel pillars
   */
  private calculateBudgetBreakdown(
    total: number,
    style: TravelStyle,
    travelers: number,
    days: number,
    currency: string
  ): BudgetBreakdown {
    // Style weighted splits
    let flightPct = 0.28;
    let hotelPct = 0.32;
    let foodPct = 0.18;
    let transportPct = 0.10;
    let activitiesPct = 0.12;

    if (style === 'Luxury') {
      flightPct = 0.25;
      hotelPct = 0.40;
      foodPct = 0.20;
      transportPct = 0.08;
      activitiesPct = 0.07;
    } else if (style === 'Budget') {
      flightPct = 0.35;
      hotelPct = 0.22;
      foodPct = 0.20;
      transportPct = 0.13;
      activitiesPct = 0.10;
    } else if (style === 'Food') {
      flightPct = 0.25;
      hotelPct = 0.28;
      foodPct = 0.30;
      transportPct = 0.07;
      activitiesPct = 0.10;
    } else if (style === 'Adventure') {
      flightPct = 0.25;
      hotelPct = 0.25;
      foodPct = 0.18;
      transportPct = 0.12;
      activitiesPct = 0.20;
    }

    const flights = Math.round(total * flightPct);
    const accommodation = Math.round(total * hotelPct);
    const food = Math.round(total * foodPct);
    const transport = Math.round(total * transportPct);
    const activities = Math.max(total - (flights + accommodation + food + transport), 0);

    return {
      flights,
      accommodation,
      food,
      transport,
      activities,
      total,
      currency
    };
  }

  /**
   * Generates dynamic rich template for any custom destination entered by the user
   */
  private createGenericCityData(destination: string): CitySights {
    const city = destination.split(',')[0].trim() || 'Destination';
    return {
      city,
      country: destination.split(',')[1]?.trim() || '',
      flag: '🗺️',
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      mornings: [
        { title: `${city} Old Town & Heritage Monuments`, location: `${city} Historic Core`, cost: 15, tip: 'Morning is the quietest time for photography.' },
        { title: `${city} Architectural Landmark & Panoramic Point`, location: `${city} High View`, cost: 12, tip: 'Check weather forecast for clear horizon visibility.' },
        { title: `${city} National Museum of History & Culture`, location: `${city} Cultural Quarter`, cost: 10, tip: 'Audio guide headsets available in multiple languages.' },
        { title: `${city} Central Botanical Garden & Shaded Park`, location: `${city} Green Belt`, cost: 6, tip: 'Peaceful walking paths away from traffic.' },
      ],
      afternoons: [
        { title: `${city} Traditional Bazaar & Artisan Craft Workshops`, location: `${city} Artisan Square`, cost: 20, tip: 'Support local craftsmen by purchasing handmade souvenirs.' },
        { title: `${city} Waterfront Promenade & Scenic Sightseeing`, location: `${city} Waterfront`, cost: 14, tip: 'Great spot for afternoon coffee and snacks.' },
        { title: `${city} Contemporary Art Gallery & Design District`, location: `${city} Design Hub`, cost: 12, tip: 'Explore modern installations and local design shops.' },
      ],
      evenings: [
        { restaurant: `${city} Traditional Gastronomy Courtyard`, location: `${city} Old Center`, cuisine: 'Local Signature Dishes & Tasting Menu', cost: 30, tip: 'Try the house specialty and pairing beverage.' },
        { restaurant: `${city} Terrace Lounge & Panoramic View`, location: `${city} Skyline Plaza`, cuisine: 'Fusion Grill & Craft Beverages', cost: 40, tip: 'Sunset views over the city rooftops.' },
        { restaurant: `Charming ${city} Local Taverna`, location: `${city} Backstreets`, cuisine: 'Home-Style Local Comfort Food', cost: 22, tip: 'Warm friendly atmosphere with local families.' }
      ],
      hotels: [
        { name: `${city} Heritage Boutique Hotel`, stars: 4, priceRatio: 0.35, area: 'City Center' },
        { name: `${city} Grand Palace & Spa`, stars: 5, priceRatio: 0.55, area: 'Central Promenade' }
      ]
    };
  }
}

export const plannerService = new PlannerService();
