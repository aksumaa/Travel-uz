'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Compass, Sparkles, Heart, Star, MapPin, ArrowRight, Sun, DollarSign, Calendar, Globe, Check } from '../icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export interface ExplorerDestination {
  id: string;
  countryId: string;
  name: string;
  country: string;
  flag: string;
  continent: 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania';
  capital: string;
  image: string;
  tagline: string;
  tag: string;
  rating: number;
  reviews: string;
  bestTime: string;
  weatherTemp: string;
  weatherCondition: string;
  budgetUSD: number;
  duration: string;
  highlights: string[];
}

export const CONTINENT_CATEGORIES = [
  'All',
  'Europe',
  'Asia',
  'Africa',
  'North America',
  'South America',
  'Oceania'
] as const;

export const EXPLORER_CATALOG: ExplorerDestination[] = [
  // Europe
  {
    id: 'france-paris',
    countryId: 'france',
    name: 'Paris & Côte d’Azur',
    country: 'France',
    flag: '🇫🇷',
    continent: 'Europe',
    capital: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85',
    tagline: 'Art museums, historic boulevards and Mediterranean glamour.',
    tag: 'Art & Gastronomy',
    rating: 4.9,
    reviews: '5.4k reviews',
    bestTime: 'April – October',
    weatherTemp: '19°C',
    weatherCondition: 'Partly Sunny',
    budgetUSD: 165,
    duration: '7–10 Days',
    highlights: ['Louvre Museum VIP', 'Bordeaux Grand Cru Wine', 'Promenade des Anglais']
  },
  {
    id: 'italy-amalfi',
    countryId: 'italy',
    name: 'Amalfi Coast & Rome',
    country: 'Italy',
    flag: '🇮🇹',
    continent: 'Europe',
    capital: 'Rome',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',
    tagline: 'Cliffside pastel villas, Roman history, and handmade pasta.',
    tag: 'Romance & Food',
    rating: 4.9,
    reviews: '4.8k reviews',
    bestTime: 'April – October',
    weatherTemp: '22°C',
    weatherCondition: 'Sunny & Coastal',
    budgetUSD: 155,
    duration: '7–12 Days',
    highlights: ['Positano Cliffside Cruise', 'Colosseum & Vatican', 'Capri Blue Grotto']
  },
  {
    id: 'iceland-aurora',
    countryId: 'iceland',
    name: 'Reykjavik & Golden Circle',
    country: 'Iceland',
    flag: '🇮🇸',
    continent: 'Europe',
    capital: 'Reykjavik',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=85',
    tagline: 'Cascading waterfalls, volcanic geysers, and dancing auroras.',
    tag: 'Adventure & Nature',
    rating: 4.9,
    reviews: '3.9k reviews',
    bestTime: 'Year-round',
    weatherTemp: '7°C',
    weatherCondition: 'Crisp & Clear',
    budgetUSD: 195,
    duration: '5–8 Days',
    highlights: ['Blue Lagoon Geothermal Spa', 'Reynisfjara Black Sands', 'Aurora Borealis Hunt']
  },

  // Asia
  {
    id: 'japan-tokyo-kyoto',
    countryId: 'japan',
    name: 'Tokyo & Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    capital: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85',
    tagline: 'Futuristic neon skyline alongside tranquil Zen gardens.',
    tag: 'Culture & Modernity',
    rating: 4.9,
    reviews: '6.1k reviews',
    bestTime: 'March – May, Oct – Nov',
    weatherTemp: '18°C',
    weatherCondition: 'Mild & Pleasant',
    budgetUSD: 175,
    duration: '9–14 Days',
    highlights: ['Shibuya Sky Observation', 'Fushimi Inari Shrines', 'Bullet Train Journey']
  },
  {
    id: 'uzbekistan-samarkand',
    countryId: 'uzbekistan',
    name: 'Samarkand & Bukhara',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    continent: 'Asia',
    capital: 'Tashkent',
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=900&q=85',
    tagline: 'Turquoise-tiled Silk Road monuments and legendary hospitality.',
    tag: 'Ancient Silk Road',
    rating: 4.9,
    reviews: '3.2k reviews',
    bestTime: 'April – June, Sep – Nov',
    weatherTemp: '24°C',
    weatherCondition: 'Sunny Skies',
    budgetUSD: 95,
    duration: '6–10 Days',
    highlights: ['Registan Square Mosaic Domes', 'Bukhara Ark Citadel', 'Afrosiyob Bullet Train']
  },
  {
    id: 'uae-dubai',
    countryId: 'uae',
    name: 'Dubai & Arabian Gulf',
    country: 'UAE',
    flag: '🇦🇪',
    continent: 'Asia',
    capital: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85',
    tagline: 'Record-setting architectural wonders, luxury dining and desert safaris.',
    tag: 'Luxury & Skyline',
    rating: 4.8,
    reviews: '5.9k reviews',
    bestTime: 'November – April',
    weatherTemp: '28°C',
    weatherCondition: 'Warm Sun',
    budgetUSD: 210,
    duration: '5–8 Days',
    highlights: ['Burj Khalifa Sky Lounge', 'Desert Dunes Safari', 'Palm Jumeirah Yacht Cruise']
  },

  // Africa
  {
    id: 'morocco-marrakech',
    countryId: 'morocco',
    name: 'Marrakech & Sahara Dunes',
    country: 'Morocco',
    flag: '🇲🇦',
    continent: 'Africa',
    capital: 'Rabat',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=85',
    tagline: 'Vibrant spice medinas, mountain passes, and desert starlight.',
    tag: 'Desert & Heritage',
    rating: 4.8,
    reviews: '4.2k reviews',
    bestTime: 'September – April',
    weatherTemp: '21°C',
    weatherCondition: 'Dry & Clear',
    budgetUSD: 110,
    duration: '6–9 Days',
    highlights: ['Jemaa el-Fnaa Night Food Market', 'Merzouga Sahara Camp', 'Majorelle Botanical Garden']
  },
  {
    id: 'egypt-cairo',
    countryId: 'egypt',
    name: 'Cairo & Giza Pyramids',
    country: 'Egypt',
    flag: '🇪🇬',
    continent: 'Africa',
    capital: 'Cairo',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=85',
    tagline: 'Timeless wonders of antiquity, Nile cruises, and grand bazaars.',
    tag: 'Ancient Wonders',
    rating: 4.8,
    reviews: '6.4k reviews',
    bestTime: 'October – April',
    weatherTemp: '25°C',
    weatherCondition: 'Desert Sun',
    budgetUSD: 105,
    duration: '5–8 Days',
    highlights: ['Giza Pyramids & Sphinx', 'Grand Egyptian Museum', 'Nile Sunset Felucca Sail']
  },

  // North America
  {
    id: 'usa-newyork',
    countryId: 'usa',
    name: 'New York City & Beyond',
    country: 'United States',
    flag: '🇺🇸',
    continent: 'North America',
    capital: 'Washington D.C.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=85',
    tagline: 'Global cultural epicenter, Broadway spectacles, and iconic skyline views.',
    tag: 'Metropolis & Arts',
    rating: 4.8,
    reviews: '7.8k reviews',
    bestTime: 'April – June, Sep – Nov',
    weatherTemp: '20°C',
    weatherCondition: 'Breezy & Sunny',
    budgetUSD: 240,
    duration: '5–8 Days',
    highlights: ['Central Park & The Met', 'Broadway Musical Premiere', 'High Line & Hudson Yards']
  },
  {
    id: 'canada-banff',
    countryId: 'canada',
    name: 'Banff & Rocky Mountains',
    country: 'Canada',
    flag: '🇨🇦',
    continent: 'North America',
    capital: 'Ottawa',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85',
    tagline: 'Turquoise glacial lakes, snow-capped peaks, and alpine wildlife.',
    tag: 'Alpine & Wilderness',
    rating: 4.9,
    reviews: '3.1k reviews',
    bestTime: 'June – September, Dec – March',
    weatherTemp: '16°C',
    weatherCondition: 'Crisp Mountain Air',
    budgetUSD: 185,
    duration: '6–9 Days',
    highlights: ['Lake Louise Glacial Canoe', 'Icefields Parkway Scenic Drive', 'Moraine Lake Sunrise']
  },

  // South America
  {
    id: 'peru-machupicchu',
    countryId: 'peru',
    name: 'Cusco & Machu Picchu',
    country: 'Peru',
    flag: '🇵🇪',
    continent: 'South America',
    capital: 'Lima',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=85',
    tagline: 'Lost Incan citadel, Sacred Valley terraces, and Andean gastronomy.',
    tag: 'Archaeology & Trekking',
    rating: 4.9,
    reviews: '4.5k reviews',
    bestTime: 'May – October',
    weatherTemp: '17°C',
    weatherCondition: 'Highland Sun',
    budgetUSD: 120,
    duration: '7–10 Days',
    highlights: ['Machu Picchu Sunrise Citadel', 'Sacred Valley Artisan Markets', 'Vistadome Scenic Rail']
  },
  {
    id: 'brazil-rio',
    countryId: 'brazil',
    name: 'Rio de Janeiro & Coast',
    country: 'Brazil',
    flag: '🇧🇷',
    continent: 'South America',
    capital: 'Brasília',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=85',
    tagline: 'Christ the Redeemer, golden Copacabana sands, and samba rhythms.',
    tag: 'Coastal & Vibrant',
    rating: 4.8,
    reviews: '3.8k reviews',
    bestTime: 'December – March, May – Sep',
    weatherTemp: '27°C',
    weatherCondition: 'Tropical Sun',
    budgetUSD: 130,
    duration: '5–8 Days',
    highlights: ['Sugarloaf Mountain Cableway', 'Christ the Redeemer Sanctuary', 'Ipanema Beach Promenade']
  },

  // Oceania
  {
    id: 'australia-sydney',
    countryId: 'australia',
    name: 'Sydney & Great Barrier Reef',
    country: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    capital: 'Canberra',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=85',
    tagline: 'Iconic Opera House harbor, Bondi waves, and coral reef diving.',
    tag: 'Harbor & Marine',
    rating: 4.9,
    reviews: '5.1k reviews',
    bestTime: 'September – November, March – May',
    weatherTemp: '23°C',
    weatherCondition: 'Warm Coastal Breeze',
    budgetUSD: 190,
    duration: '8–12 Days',
    highlights: ['Sydney Opera House Backstage', 'Great Barrier Reef Snorkel', 'Bondi to Bronte Coastal Walk']
  },
  {
    id: 'newzealand-queenstown',
    countryId: 'new-zealand',
    name: 'Queenstown & Fiordland',
    country: 'New Zealand',
    flag: '🇳🇿',
    continent: 'Oceania',
    capital: 'Wellington',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=85',
    tagline: 'Milford Sound dramatic fiords, alpine glaciers, and world-class adventure.',
    tag: 'Nature & Adventure',
    rating: 4.9,
    reviews: '3.6k reviews',
    bestTime: 'November – April',
    weatherTemp: '18°C',
    weatherCondition: 'Pure Alpine Clear',
    budgetUSD: 180,
    duration: '7–12 Days',
    highlights: ['Milford Sound Cruise & Waterfalls', 'Lake Wakatipu Helicopter Flight', 'Central Otago Pinot Noir Trail']
  }
];

interface DestinationCard3DProps {
  item: ExplorerDestination;
  onExplore: (countryId: string) => void;
  onSave: (item: ExplorerDestination) => void;
  isSaved: boolean;
  formatPrice: (amountUSD: number) => string;
}

const DestinationCard3D: React.FC<DestinationCard3DProps> = ({
  item,
  onExplore,
  onSave,
  isSaved,
  formatPrice
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  // 3D physics spring tilt
  const springX = useSpring(0, { damping: 20, stiffness: 220 });
  const springY = useSpring(0, { damping: 20, stiffness: 220 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    springX.set(y * -10); // tilt X
    springY.set(x * 10);  // tilt Y
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        borderRadius: '24px',
        height: '100%'
      }}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          background: isLight ? '#FFFFFF' : 'var(--bg-surface, #131E32)',
          borderRadius: '24px',
          border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isLight
            ? '0 10px 30px -10px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)'
            : '0 16px 36px -8px rgba(0,0,0,0.4), 0 2px 6px -2px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
        }}
        whileHover={{
          borderColor: isLight ? '#2563EB' : 'rgba(56, 189, 248, 0.4)',
          boxShadow: isLight
            ? '0 20px 40px -12px rgba(37, 99, 235, 0.18)'
            : '0 24px 50px -12px rgba(56, 189, 248, 0.2)'
        }}
      >
        {/* Card Image Header with Zoom */}
        <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
          <motion.img
            src={item.image}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Continent / Style Tag Badge */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            display: 'flex',
            gap: '6px',
            zIndex: 5
          }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '100px',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {item.continent}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '100px',
              background: 'rgba(37, 99, 235, 0.85)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              {item.tag}
            </span>
          </div>

          {/* Save Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(item);
            }}
            aria-label={`Save ${item.name}`}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isSaved ? '#EF4444' : 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              border: isSaved ? 'none' : '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 5,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Heart size={18} fill={isSaved ? '#FFFFFF' : 'none'} />
          </button>

          {/* Bottom Title on Image */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            zIndex: 5,
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '1.1rem' }}>{item.flag}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
                {item.country} • {t('destExplorer.capital')} {item.capital}
              </span>
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              margin: 0,
              lineHeight: 1.2
            }}>
              {item.name}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div style={{
          padding: '18px 18px 20px 18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '14px'
        }}>
          {/* Tagline */}
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.5,
            color: isLight ? '#4B5563' : '#94A3B8',
            margin: 0
          }}>
            {item.tagline}
          </p>

          {/* Quick Telemetry Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: isLight ? '#F9FAFB' : 'rgba(15, 23, 42, 0.5)',
            padding: '10px 12px',
            borderRadius: '12px',
            border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun size={14} style={{ color: '#F59E0B' }} />
              <div style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <span style={{ color: isLight ? '#6B7280' : '#64748B', display: 'block' }}>{t('destExplorer.weather')}</span>
                <strong style={{ color: isLight ? '#111827' : '#F8FAFC' }}>{item.weatherTemp}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={14} style={{ color: '#10B981' }} />
              <div style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <span style={{ color: isLight ? '#6B7280' : '#64748B', display: 'block' }}>{t('planner.budget')}</span>
                <strong style={{ color: isLight ? '#111827' : '#F8FAFC' }}>
                  {formatPrice(item.budgetUSD)} {t('destExplorer.budgetPerDay')}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} style={{ color: '#3B82F6' }} />
              <div style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <span style={{ color: isLight ? '#6B7280' : '#64748B', display: 'block' }}>{t('destExplorer.bestTime')}</span>
                <strong style={{ color: isLight ? '#111827' : '#F8FAFC', fontSize: '0.72rem' }}>{item.bestTime.split('(')[0]}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} style={{ color: '#EAB308', fill: '#EAB308' }} />
              <div style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                <span style={{ color: isLight ? '#6B7280' : '#64748B', display: 'block' }}>{t('destinations.rating')}</span>
                <strong style={{ color: isLight ? '#111827' : '#F8FAFC' }}>{item.rating} ★</strong>
              </div>
            </div>
          </div>

          {/* Highlights Mini Pills */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {item.highlights.slice(0, 2).map((hl, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isLight ? 'rgba(37, 99, 235, 0.08)' : 'rgba(56, 189, 248, 0.1)',
                  color: isLight ? '#2563EB' : '#38BDF8',
                  fontWeight: 600
                }}
              >
                ✦ {hl}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: 'auto',
            paddingTop: '8px'
          }}>
            <button
              onClick={() => onExplore(item.countryId)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{t('destExplorer.exploreCountryBtn')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DestinationExplorerSection: React.FC<{
  onSelectCountry: (countryId: string) => void;
  onPlanTrip?: (countryId: string) => void;
}> = ({ onSelectCountry, onPlanTrip }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const isLight = theme === 'light';

  const [activeContinent, setActiveContinent] = useState<typeof CONTINENT_CATEGORIES[number]>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const filteredItems = activeContinent === 'All'
    ? EXPLORER_CATALOG
    : EXPLORER_CATALOG.filter(item => item.continent === activeContinent);

  const handleToggleSave = (item: ExplorerDestination) => {
    if (savedIds.includes(item.id)) {
      setSavedIds(prev => prev.filter(id => id !== item.id));
      setSaveToast(`${t('destExplorer.removedToast')} (${item.name})`);
    } else {
      setSavedIds(prev => [...prev, item.id]);
      setSaveToast(`${item.name} — ${t('destExplorer.savedToast')}`);
    }
    setTimeout(() => setSaveToast(null), 2400);
  };

  const getContinentLabel = (category: typeof CONTINENT_CATEGORIES[number]) => {
    switch (category) {
      case 'All': return t('destExplorer.continents.all');
      case 'Europe': return t('destExplorer.continents.europe');
      case 'Asia': return t('destExplorer.continents.asia');
      case 'Africa': return t('destExplorer.continents.africa');
      case 'North America': return t('destExplorer.continents.northAmerica');
      case 'South America': return t('destExplorer.continents.southAmerica');
      case 'Oceania': return t('destExplorer.continents.oceania');
      default: return category;
    }
  };

  return (
    <section
      id="destination-explorer"
      style={{
        padding: '90px 24px 80px 24px',
        maxWidth: '1380px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              fontSize: '0.88rem',
              fontWeight: 700,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Check size={16} style={{ color: '#10B981' }} />
            <span>{saveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 14px',
          borderRadius: '100px',
          background: 'var(--accent-subtle, rgba(37, 99, 235, 0.08))',
          color: 'var(--accent, #2563EB)',
          fontSize: '0.78rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          <Globe size={14} />
          <span>{t('destExplorer.badge')}</span>
        </div>

        <h2 style={{
          fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', Georgia, serif)",
          fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          margin: '0 0 12px 0'
        }}>
          {t('destExplorer.title')}
        </h2>

        <p style={{
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          color: 'var(--color-text-secondary)',
          fontSize: '1.05rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          {t('destExplorer.subtitle')}
        </p>
      </div>

      {/* Categories Tabs Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '42px'
      }}>
        {CONTINENT_CATEGORIES.map(category => {
          const isActive = activeContinent === category;
          return (
            <button
              key={category}
              onClick={() => setActiveContinent(category)}
              style={{
                padding: '9px 18px',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 800 : 600,
                border: isActive
                  ? '1px solid #2563EB'
                  : isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isActive
                  ? '#2563EB'
                  : isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.7)',
                color: isActive
                  ? '#FFFFFF'
                  : isLight ? '#4B5563' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none'
              }}
            >
              {getContinentLabel(category)}
            </button>
          );
        })}
      </div>

      {/* Grid of 3D Tilt Cards */}
      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px'
        }}
      >
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DestinationCard3D
                item={item}
                onExplore={onSelectCountry}
                onSave={handleToggleSave}
                isSaved={savedIds.includes(item.id)}
                formatPrice={formatPrice}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
