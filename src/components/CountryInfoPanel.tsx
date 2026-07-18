import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Heart, CloudSun, Sun, CloudRain, Cloud, Compass, Calendar, Key, Sparkles, 
  MapPin, Globe, Languages, DollarSign, Clock 
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export interface CountryData {
  name: string;
  capital: string;
  language: string;
  currency: string;
  timezone: string;
  population: string;
  area: string;
  flag: string;
  weather: {
    temp: number;
    condition: string;
  };
  visa: string;
  bestTime: string;
  description: string;
  attractions: {
    name: string;
    city: string;
    image: string;
  }[];
  foods: {
    name: string;
    image: string;
  }[];
}

interface CountryInfoPanelProps {
  country: CountryData | { properties: { NAME: string; [key: string]: any } } | null;
  onClose: () => void;
  onCreateTrip?: (country: any) => void;
}

// Complete metadata dictionary for the core selectable countries
export const COUNTRY_DETAILS_DB: Record<string, CountryData> = {
  uzbekistan: {
    name: 'Uzbekistan',
    capital: 'Tashkent',
    language: 'Uzbek',
    currency: 'UZS',
    timezone: 'GMT+5',
    population: '36 Million',
    area: '448,978 km²',
    flag: '🇺🇿',
    weather: { temp: 23, condition: 'Sunny' },
    visa: 'Visa Free',
    bestTime: 'Mar - May, Sep - Nov',
    description: 'Uzbekistan is a gem of the Silk Road with stunning architecture, rich history, vibrant cities, and warm hospitality.',
    attractions: [
      { name: 'Registan Square', city: 'Samarkand', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80' },
      { name: 'Bukhara Old City', city: 'Bukhara', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80' },
      { name: 'Chorsu Bazaar', city: 'Tashkent', image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Plov', image: 'https://images.unsplash.com/photo-1614961909013-1e2212a2ca87?auto=format&fit=crop&w=400&q=80' },
      { name: 'Shashlik', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { name: 'Samsa', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  usa: {
    name: 'United States',
    capital: 'Washington D.C.',
    language: 'English',
    currency: 'USD',
    timezone: 'GMT-5 to -8',
    population: '332 Million',
    area: '9.8M km²',
    flag: '🇺🇸',
    weather: { temp: 20, condition: 'Partly Cloudy' },
    visa: 'ESTA Required',
    bestTime: 'Apr - Jun, Sep - Nov',
    description: 'The United States is a vast country spanning North America, known for its diverse landscapes, vibrant metropolitan cities, and major cultural influence.',
    attractions: [
      { name: 'Times Square', city: 'New York City', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Grand Canyon', city: 'Arizona', image: 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=400&q=80' },
      { name: 'Yosemite Valley', city: 'California', image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Gourmet Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
      { name: 'Apple Pie', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80' },
      { name: 'Hot Dog', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  france: {
    name: 'France',
    capital: 'Paris',
    language: 'French',
    currency: 'EUR',
    timezone: 'GMT+1',
    population: '68 Million',
    area: '551,695 km²',
    flag: '🇫🇷',
    weather: { temp: 19, condition: 'Rainy' },
    visa: 'Visa Free',
    bestTime: 'May - Sep',
    description: 'France is renowned globally for its world-class gastronomy, historical palaces, classical art museums, fashion houses, and romantic countryside.',
    attractions: [
      { name: 'Eiffel Tower', city: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
      { name: 'Louvre Museum', city: 'Paris', image: 'https://images.unsplash.com/photo-1499856871958-5b9647a6406a?auto=format&fit=crop&w=400&q=80' },
      { name: 'Chamonix Valley', city: 'Alps', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Butter Croissant', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80' },
      { name: 'Coq au Vin', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sweet Macarons', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  japan: {
    name: 'Japan',
    capital: 'Tokyo',
    language: 'Japanese',
    currency: 'JPY',
    timezone: 'GMT+9',
    population: '125 Million',
    area: '377,975 km²',
    flag: '🇯🇵',
    weather: { temp: 21, condition: 'Sunny' },
    visa: 'Visa Free',
    bestTime: 'Mar - May, Oct - Nov',
    description: 'Japan merges ancient historical temples and shrines with high-tech futuristic cities, cherry blossom vistas, and world-class culinary art.',
    attractions: [
      { name: 'Mount Fuji', city: 'Honshu', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80' },
      { name: 'Kinkaku-ji Temple', city: 'Kyoto', image: 'https://images.unsplash.com/photo-1490761908851-21209e858a63?auto=format&fit=crop&w=400&q=80' },
      { name: 'Shibuya Crossing', city: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Sushi Platter', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tonkotsu Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80' },
      { name: 'Shrimp Tempura', image: 'https://images.unsplash.com/photo-1615361413004-1ac33c2da008?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  brazil: {
    name: 'Brazil',
    capital: 'Brasília',
    language: 'Portuguese',
    currency: 'BRL',
    timezone: 'GMT-3',
    population: '214 Million',
    area: '8.5M km²',
    flag: '🇧🇷',
    weather: { temp: 27, condition: 'Humid' },
    visa: 'E-Visa Required',
    bestTime: 'Apr - Sep',
    description: 'Brazil is famous for its massive biodiverse Amazon rainforest, tropical white-sand beaches, energetic Carnival rhythms, and passionate football culture.',
    attractions: [
      { name: 'Christ the Redeemer', city: 'Rio de Janeiro', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=400&q=80' },
      { name: 'Copacabana Beach', city: 'Rio de Janeiro', image: 'https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Amazon River Guide', city: 'Manaus', image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Feijoada Stew', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pão de Queijo', image: 'https://images.unsplash.com/photo-1597839219216-a773cb2473e4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sweet Brigadeiro', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  australia: {
    name: 'Australia',
    capital: 'Canberra',
    language: 'English',
    currency: 'AUD',
    timezone: 'GMT+10',
    population: '26 Million',
    area: '7.6M km²',
    flag: '🇦🇺',
    weather: { temp: 16, condition: 'Windy' },
    visa: 'ETA Required',
    bestTime: 'Sep - Nov, Mar - May',
    description: 'Australia is a geographic wonder filled with unique indigenous wildlife, surfing beaches, and natural landmarks like the Great Barrier Reef.',
    attractions: [
      { name: 'Sydney Opera House', city: 'Sydney', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80' },
      { name: 'Barrier Reef Diving', city: 'Cairns', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
      { name: 'Uluru Outback', city: 'Red Centre', image: 'https://images.unsplash.com/photo-1529142618090-b4d048b5660d?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Meat Pie', image: 'https://images.unsplash.com/photo-1534080391025-a77c3e0dba72?auto=format&fit=crop&w=400&q=80' },
      { name: 'Lamingtons Cake', image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=400&q=80' },
      { name: 'Berry Pavlova', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  egypt: {
    name: 'Egypt',
    capital: 'Cairo',
    language: 'Arabic',
    currency: 'EGP',
    timezone: 'GMT+2',
    population: '109 Million',
    area: '1.0M km²',
    flag: '🇪🇬',
    weather: { temp: 31, condition: 'Sunny' },
    visa: 'Visa on Arrival',
    bestTime: 'Oct - Apr',
    description: 'Egypt links northeast Africa with the Middle East, dating back to the time of the Pharaohs with millenary desert pyramids and monuments.',
    attractions: [
      { name: 'Pyramids of Giza', city: 'Cairo', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=400&q=80' },
      { name: 'Valley of the Kings', city: 'Luxor', image: 'https://images.unsplash.com/photo-1568326344543-7ecfee7b3f4a?auto=format&fit=crop&w=400&q=80' },
      { name: 'Karnak Temple Sights', city: 'Luxor', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Koshary Platter', image: 'https://images.unsplash.com/photo-1614961909013-1e2212a2ca87?auto=format&fit=crop&w=400&q=80' },
      { name: 'Fava Falafel', image: 'https://images.unsplash.com/photo-1547058886-af77992d478e?auto=format&fit=crop&w=400&q=80' },
      { name: 'Honey Baklava', image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  turkey: {
    name: 'Turkey',
    capital: 'Ankara',
    language: 'Turkish',
    currency: 'TRY',
    timezone: 'GMT+3',
    population: '85 Million',
    area: '783,562 km²',
    flag: '🇹🇷',
    weather: { temp: 24, condition: 'Sunny' },
    visa: 'Visa Free',
    bestTime: 'Apr - May, Sep - Oct',
    description: 'Turkey is a historic crossroads of cultures, blending spectacular architecture, bustling bazaars, and beautiful turquoise coasts.',
    attractions: [
      { name: 'Hagia Sophia mosque', city: 'Istanbul', image: 'https://images.unsplash.com/photo-1568326344543-7ecfee7b3f4a?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cappadocia balloons', city: 'Nevsehir', image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ephesus Ruins historic', city: 'Izmir', image: 'https://images.unsplash.com/photo-1608958415700-1c3905cf78e6?auto=format&fit=crop&w=400&q=80' }
    ],
    foods: [
      { name: 'Adana Kebap', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pistachio Baklava', image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80' },
      { name: 'Turkish Pide', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' }
    ]
  }
};

// Helper function to resolve different input shapes (GeoJSON features or CountryData objects)
const getResolvedCountryData = (country: any, defaultSubregion = 'Global'): CountryData => {
  if (!country) return null as any;

  // Case 1: If it has properties (GeoJSON feature format)
  if (country.properties && country.properties.NAME) {
    const name = country.properties.NAME;
    const key = name.toLowerCase();
    
    // Find matching country in database
    const dbKey = Object.keys(COUNTRY_DETAILS_DB).find(
      k => k === key || key.includes(k) || k.includes(key)
    );

    if (dbKey && COUNTRY_DETAILS_DB[dbKey]) {
      return COUNTRY_DETAILS_DB[dbKey];
    }

    // Dynamic fallback builder if not found in dictionary
    return {
      name: name,
      capital: country.properties.FORMAL_EN?.split(' ').pop() || 'Unknown',
      language: 'English',
      currency: 'USD',
      timezone: 'GMT+0',
      population: country.properties.POP_EST ? `${(country.properties.POP_EST / 1000000).toFixed(1)} Million` : 'Unknown',
      area: 'Unknown',
      flag: '🌍',
      weather: { temp: 22, condition: 'Sunny' },
      visa: 'Visa Required',
      bestTime: 'Spring, Autumn',
      description: `${name} is a beautiful destination located in ${country.properties.SUBREGION || country.properties.CONTINENT || defaultSubregion}. Explore its scenic landmarks.`,
      attractions: [
        { name: 'Central Plaza', city: 'Capital City', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
        { name: 'Heritage Ruins', city: 'Historic District', image: 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=400&q=80' },
        { name: 'Coastal Reserve', city: 'Coastline', image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=400&q=80' }
      ],
      foods: [
        { name: 'Traditional Specialty', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
        { name: 'Local Sweet Pastry', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' }
      ]
    };
  }

  // Case 2: If it is already a CountryData shape
  if (country.name && country.capital) {
    return country as CountryData;
  }

  // Fallback default structure
  return {
    name: country.name || 'Unknown',
    capital: country.capital || 'Unknown',
    language: country.language || 'English',
    currency: country.currency || 'USD',
    timezone: country.timezone || 'GMT+0',
    population: country.population || 'Unknown',
    area: country.area || 'Unknown',
    flag: country.flag || '🌍',
    weather: country.weather || { temp: 22, condition: 'Sunny' },
    visa: country.visa || 'Visa Required',
    bestTime: country.bestTime || 'Spring, Autumn',
    description: country.description || '',
    attractions: country.attractions || [],
    foods: country.foods || []
  };
};

export const CountryInfoPanel: React.FC<CountryInfoPanelProps> = ({ country, onClose, onCreateTrip }) => {
  if (!country) return null;

  const { t } = useTranslation();
  
  // Extract values
  const rawSubregion = (country as any).properties ? ((country as any).properties.SUBREGION || (country as any).properties.CONTINENT) : 'Global';
  const meta = getResolvedCountryData(country, rawSubregion);

  // States
  const [isSaved, setIsSaved] = useState(false);
  const [aiText, setAiText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Dynamic Weather icon resolver
  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return <Sun size={18} className="text-amber-500 animate-pulse" />;
    if (c.includes('rain') || c.includes('shower')) return <CloudRain size={18} className="text-blue-400" />;
    if (c.includes('cloud')) return <Cloud size={18} className="text-slate-400" />;
    return <CloudSun size={18} className="text-amber-400" />;
  };

  // Visa badge styling helper
  const getVisaColorClass = (visa: string) => {
    const v = visa.toLowerCase();
    if (v.includes('free') || v.includes('arrival')) {
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        border: 'rgba(16, 185, 129, 0.25)'
      };
    }
    if (v.includes('esta') || v.includes('eta') || v.includes('e-visa')) {
      return {
        bg: 'rgba(59, 130, 246, 0.12)',
        color: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.25)'
      };
    }
    return {
      bg: 'rgba(245, 158, 11, 0.12)',
      color: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.25)'
    };
  };

  const visaColors = getVisaColorClass(meta.visa);

  // AI simulated description typing effect
  const handleAiDescribe = () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    setAiText('');
    
    // Geographical details to type out
    const fullMessage = `${meta.name} coordinates details: Located in the ${rawSubregion} zone. Capital coordinate is ${meta.capital}. Known for a population size of ${meta.population} and area spanning ${meta.area}. The climate is currently characterized as ${meta.weather.temp}°C ${meta.weather.condition}. Sayohat qilish uchun eng ma'qul vaqt: ${meta.bestTime}.`;

    let currentIndex = 0;
    const interval = setInterval(() => {
      setAiText((prev) => prev + fullMessage[currentIndex]);
      currentIndex++;
      if (currentIndex >= fullMessage.length - 1) {
        clearInterval(interval);
        setIsAiLoading(false);
      }
    }, 15);
  };

  const handleCreateTrip = () => {
    if (onCreateTrip) {
      // Find matching dbKey or default
      const key = meta.name.toLowerCase();
      onCreateTrip({ id: key, ...meta });
    } else {
      alert(`Initiating Travel plan for ${meta.name}... Navigate to the AI Itinerary planner tab.`);
    }
  };

  return (
    <>
      <style>{`
        .country-info-panel-container {
          position: absolute;
          z-index: 500;
          top: 0;
          bottom: 0;
          right: 0;
          width: 440px;
          padding: 24px;
          background: var(--glass-bg, rgba(255, 255, 255, 0.85)) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border-left: 1px solid var(--glass-border, rgba(15, 23, 42, 0.08)) !important;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.15) !important;
          color: var(--color-text-primary, #0f172a);
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .dark-theme .country-info-panel-container {
          background: var(--glass-bg, rgba(19, 27, 49, 0.6)) !important;
          border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08)) !important;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.45) !important;
          color: var(--color-text-primary, #f8fafc);
        }
        .panel-metric-card {
          background: rgba(15, 23, 42, 0.03);
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 14px;
          padding: 12px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dark-theme .panel-metric-card {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .panel-metric-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .detail-badge-pill {
          padding: 10px 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.03);
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 14px;
        }
        .dark-theme .detail-badge-pill {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .ai-textbox {
          background: rgba(99, 102, 241, 0.06);
          border: 1px solid rgba(99, 102, 241, 0.15);
          color: var(--color-text-secondary);
          border-radius: 12px;
          padding: 12px;
          font-size: 0.82rem;
          line-height: 1.5;
          margin-top: 10px;
          font-family: 'Outfit', sans-serif;
          position: relative;
        }
        .dark-theme .ai-textbox {
          background: rgba(124, 58, 237, 0.08);
          border-color: rgba(124, 58, 237, 0.2);
        }
        .attraction-card-premium {
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          height: 115px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
        .attraction-card-premium img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .attraction-card-premium:hover img {
          transform: scale(1.08);
        }
        @media (max-width: 768px) {
          .country-info-panel-container {
            top: auto !important;
            bottom: 0px !important;
            left: 0px !important;
            right: 0px !important;
            width: 100% !important;
            border-radius: 28px 28px 0 0 !important;
            padding: 24px 20px 85px 20px !important;
            border-left: none !important;
            border-top: 1px solid rgba(15, 23, 42, 0.08) !important;
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15) !important;
            max-height: 80vh;
          }
        }
      `}</style>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        className="country-info-panel-container"
      >
        {/* Header Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--glass-border, rgba(15, 23, 42, 0.08))', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{meta.flag}</span>
            <div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px', fontFamily: "'Outfit', sans-serif" }}>
                {meta.name}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted, #64748b)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {rawSubregion}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Heart Save Button */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              aria-label="Add to favorites"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isSaved ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.04)',
                color: '#ef4444',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Heart size={18} fill={isSaved ? "#ef4444" : "none"} stroke={isSaved ? "none" : "#ef4444"} />
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close details"
              style={{
                background: 'rgba(15, 23, 42, 0.04)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary, #0f172a)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.04)')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="panel-metric-card">
            <Globe size={16} style={{ color: 'var(--color-accent, #1a73e8)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 800 }}>{t('globeDrawer.capital')}</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{meta.capital}</strong>
            </div>
          </div>
          <div className="panel-metric-card">
            <Languages size={16} style={{ color: '#8b5cf6' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 800 }}>{t('globeDrawer.language')}</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{meta.language}</strong>
            </div>
          </div>
          <div className="panel-metric-card">
            <DollarSign size={16} style={{ color: '#10b981' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 800 }}>{t('globeDrawer.currency')}</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{meta.currency}</strong>
            </div>
          </div>
          <div className="panel-metric-card">
            <Clock size={16} style={{ color: '#f59e0b' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 800 }}>{t('globeDrawer.timezone')}</span>
              <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{meta.timezone}</strong>
            </div>
          </div>
        </div>

        {/* Weather, Best Season & Visa badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div className="detail-badge-pill">
            {getWeatherIcon(meta.weather.condition)}
            <strong style={{ fontSize: '0.82rem', fontWeight: 800 }}>{meta.weather.temp}°C</strong>
            <span style={{ fontSize: '0.58rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 700 }}>{t('globeDrawer.weather')}</span>
          </div>
          <div className="detail-badge-pill">
            <Calendar size={18} style={{ color: '#ec4899' }} />
            <strong style={{ fontSize: '0.74rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }} title={meta.bestTime}>
              {meta.bestTime.split(',')[0]}
            </strong>
            <span style={{ fontSize: '0.58rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 700 }}>{t('globeDrawer.bestSeason')}</span>
          </div>
          <div className="detail-badge-pill" style={{ 
            background: visaColors.bg, 
            borderColor: visaColors.border 
          }}>
            <Key size={18} style={{ color: visaColors.color }} />
            <strong style={{ fontSize: '0.74rem', fontWeight: 800, color: visaColors.color, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
              {meta.visa}
            </strong>
            <span style={{ fontSize: '0.58rem', color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', fontWeight: 700 }}>{t('globeDrawer.visaInfo')}</span>
          </div>
        </div>

        {/* Description & Sparkles AI Action */}
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>
            {t('globeDrawer.aboutCountry')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary, #475569)', lineHeight: 1.5, margin: 0 }}>
            {meta.description}
          </p>
          
          <button 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: 'var(--color-accent, #1a73e8)', 
              border: 'none', 
              background: 'none', 
              padding: 0, 
              marginTop: '10px', 
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onClick={handleAiDescribe}
          >
            <Sparkles size={13} className="animate-pulse" /> 
            {isAiLoading ? 'Loading AI...' : 'AI Description'}
          </button>

          {/* Typing AI Box */}
          <AnimatePresence>
            {(aiText || isAiLoading) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ai-textbox"
              >
                {aiText}
                {isAiLoading && (
                  <span style={{ display: 'inline-block', width: '3px', height: '12px', background: 'var(--color-accent, #1a73e8)', marginLeft: '3px', animation: 'blink 1s step-end infinite' }} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Attractions visual list */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              {t('globeDrawer.topAttractions')}
            </h3>
            <button style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent, #1a73e8)', background: 'none', border: 'none', cursor: 'pointer' }}>
              See all
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {meta.attractions.slice(0, 3).map((att, i) => (
              <div key={i} className="attraction-card-premium">
                <img src={att.image} alt={att.name} loading="lazy" />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff',
                }}>
                  <strong style={{ fontSize: '0.72rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={att.name}>
                    {att.name}
                  </strong>
                  <span style={{ fontSize: '0.58rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
                    <MapPin size={8} /> {att.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Foods visual list */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              {t('globeDrawer.popularFoods')}
            </h3>
            <button style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent, #1a73e8)', background: 'none', border: 'none', cursor: 'pointer' }}>
              See all
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {meta.foods.slice(0, 3).map((food, i) => (
              <div key={i} className="attraction-card-premium">
                <img src={food.image} alt={food.name} loading="lazy" />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff',
                }}>
                  <strong style={{ fontSize: '0.72rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={food.name}>
                    {food.name}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Trip CTA Button */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <button
            onClick={handleCreateTrip}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              background: 'var(--color-accent, #1a73e8)',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 4px 14px rgba(26,115,232,0.25)',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#155cb4'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-accent, #1a73e8)'}
          >
            <Compass size={16} /> 
            {t('globeDrawer.createTripBtn')}
          </button>
        </div>
      </motion.div>
    </>
  );
};
