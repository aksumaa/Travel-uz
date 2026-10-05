import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Heart, CloudSun, Sun, CloudRain, Cloud, Sparkles, 
  MapPin, Globe, Languages, DollarSign, Clock, ShieldCheck, 
  Building2, Utensils, Compass, Star, ChevronRight, ArrowRight 
} from '../icons';
import { useTranslation } from '../context/LanguageContext';
import { type DestinationItem, resolveDestination, generateDestinationForCountry } from '../services/destinationCatalog';

export interface CountryData {
  name: string;
  capital: string;
  language: string;
  currency: string;
  timezone: string;
  population?: string;
  area?: string;
  flag: string;
  weather?: {
    temp: number;
    condition: string;
  };
  visa?: string;
  bestTime?: string;
  description: string;
  attractions?: {
    name: string;
    city: string;
    image: string;
  }[];
  foods?: {
    name: string;
    image: string;
  }[];
}

interface CountryInfoPanelProps {
  country: DestinationItem | CountryData | { properties: { NAME: string; [key: string]: any } } | null;
  onClose?: () => void;
  onCreateTrip?: (destination: any) => void;
  inline?: boolean;
  embedded?: boolean;
}

export const CountryInfoPanel: React.FC<CountryInfoPanelProps> = ({ 
  country, 
  onClose, 
  onCreateTrip, 
  inline = false,
  embedded = false 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'hotels' | 'food' | 'tours'>('overview');
  const [isSaved, setIsSaved] = useState(false);

  if (!country) return null;

  // Resolve into normalized data structure
  let item: DestinationItem | null = null;
  let countryName = '';

  if ((country as any).places && (country as any).countryCode) {
    item = country as DestinationItem;
    countryName = item.country;
  } else if ((country as any).properties?.NAME) {
    countryName = (country as any).properties.NAME;
    item = resolveDestination(countryName, (country as any).properties);
  } else if ((country as any).name) {
    countryName = (country as any).name;
    item = resolveDestination(countryName);
  } else if ((country as any).id) {
    countryName = (country as any).id;
    item = resolveDestination(countryName);
  }

  if (!item && countryName) {
    item = generateDestinationForCountry(countryName);
  }

  // Fallback metadata
  const name = item ? item.name : countryName || 'Destination';
  const capital = item?.capital || (country as any)?.capital || `${name} Capital`;
  const currency = item?.currency || (country as any)?.currency || 'USD';
  const currencySymbol = item?.currencySymbol || '$';
  const language = item?.language || (country as any)?.language || 'Local Language';
  const timezone = item?.timezone || (country as any)?.timezone || 'GMT+0';
  const flag = item?.flag || (country as any)?.flag || '🌍';
  const description = item?.description || (country as any)?.description || `Discover the cultural heritage, remarkable sights, and authentic travel experiences of ${name}.`;
  const weather = item?.weather ? { temp: item.weather.tempC, condition: item.weather.condition } : (country as any)?.weather || { temp: 24, condition: 'Sunny' };
  const bestSeason = item?.bestSeason || (country as any)?.bestTime || 'Spring & Autumn';
  const visaVerified = item?.visaVerified || { status: 'Visa Free', summary: `Standard travel entry for visiting ${name}.` };
  const places = item?.places || [];
  const hotels = item?.hotels || [];
  const restaurants = item?.restaurants || [];
  const tours = item?.tours || [];
  const popularDestinations = item?.popularDestinations || [];

  // Hero Cover Image
  const heroImage = item?.popularDestinations?.[0]?.image || 
                    item?.places?.[0]?.imageUrl || 
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <CloudSun size={16} style={{ color: '#f59e0b' }} />;
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return <Sun size={16} style={{ color: '#f59e0b' }} />;
    if (c.includes('rain')) return <CloudRain size={16} style={{ color: '#3b82f6' }} />;
    if (c.includes('cloud')) return <Cloud size={16} style={{ color: '#64748b' }} />;
    return <CloudSun size={16} style={{ color: '#f59e0b' }} />;
  };

  const handleStartPlanning = () => {
    if (onCreateTrip) {
      onCreateTrip(item || { name, id: name.toLowerCase() });
    }
  };

  const isInline = inline || embedded;

  const panelContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: 'var(--color-bg-surface, #ffffff)',
      color: 'var(--color-text-primary, #0f172a)',
      borderRadius: isInline ? '20px' : '0',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 1. HERO PHOTO HEADER */}
      <div style={{
        position: 'relative',
        height: '175px',
        width: '100%',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <img
          src={heroImage}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.72) 100%)'
        }} />

        {/* Top-Right Action Buttons: Favorite & Close */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          <button
            onClick={() => setIsSaved(!isSaved)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: isSaved ? '#ef4444' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isSaved ? 'Saved to Favorites' : 'Save Destination'}
          >
            <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} />
          </button>

          {!isInline && onClose && (
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Close panel"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Hero Title & Flag Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 5
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>{flag}</span>
              <h2 style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.15
              }}>
                {name}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <MapPin size={11} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.72rem', color: '#e2e8f0', fontWeight: 600 }}>
                {capital} • {currency} ({currencySymbol}) • {language.split(',')[0]}
              </span>
            </div>
          </div>

          <button
            onClick={handleStartPlanning}
            style={{
              padding: '6px 12px',
              borderRadius: '100px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 10px rgba(37,99,235,0.4)',
              flexShrink: 0
            }}
          >
            <Sparkles size={12} />
            <span>AI Plan</span>
          </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border, rgba(15, 23, 42, 0.08))',
        background: 'var(--color-bg-surface, #ffffff)',
        padding: '6px 12px',
        gap: '4px',
        overflowX: 'auto',
        flexShrink: 0
      }}>
        {(['overview', 'places', 'hotels', 'food', 'tours'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: isActive ? '1px solid var(--color-accent, #2563eb)' : '1px solid transparent',
                background: isActive ? 'var(--color-accent, #2563eb)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-secondary, #64748b)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'food' ? 'Food' : tab}
            </button>
          );
        })}
      </div>

      {/* 3. SCROLLABLE TAB CONTENT */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Description Paragraph */}
            <p style={{
              margin: 0,
              fontSize: '0.82rem',
              color: 'var(--color-text-secondary, #475569)',
              lineHeight: 1.55,
              fontWeight: 500
            }}>
              {description}
            </p>

            {/* 3 Telemetry Pill Cards (Weather, Best Season, Visa) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {/* Weather Pill */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border, rgba(15,23,42,0.08))',
                borderRadius: '12px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {getWeatherIcon(weather?.condition)}
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)' }}>
                    {weather?.temp || 24}°C
                  </span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)' }}>
                  {weather?.condition || 'Current'}
                </span>
              </div>

              {/* Season Pill */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border, rgba(15,23,42,0.08))',
                borderRadius: '12px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Compass size={14} style={{ color: '#2563eb' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bestSeason.split('(')[0].trim()}
                  </span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)' }}>
                  Best Season
                </span>
              </div>

              {/* Visa Pill */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border, rgba(15,23,42,0.08))',
                borderRadius: '12px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {visaVerified?.status || 'Visa Free'}
                  </span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted, #64748b)' }}>
                  Entry status
                </span>
              </div>
            </div>

            {/* Popular Destinations Mini Cards */}
            {popularDestinations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase' }}>
                  Popular Highlights in {name}
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px'
                }}>
                  {popularDestinations.map((dest, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        height: '80px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                      }}
                      onClick={() => handleStartPlanning()}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.8) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '6px'
                      }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                          {dest.name}
                        </span>
                        <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.8)' }}>
                          {dest.region || 'Top Destination'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: PLACES */}
        {activeTab === 'places' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {places.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                No places listed for {name}
              </div>
            ) : (
              places.map((place, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border, rgba(15,23,42,0.08))',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>
                      {place.name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)' }}>
                      {place.category} • {place.entryFeeUSD === 0 ? 'Free Entry' : `$${place.entryFeeUSD}`}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Star size={11} fill="#f59e0b" stroke="none" /> {place.rating}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: TOURS */}
        {activeTab === 'tours' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tours.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                No ready tours listed for {name}
              </div>
            ) : (
              tours.map((tour, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border, rgba(15,23,42,0.08))',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>
                      {tour.title}
                    </strong>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #64748b)' }}>
                      {tour.agencyName} • {tour.durationDays} Days
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#10b981' }}>
                    ${tour.priceUSD}
                  </strong>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: HOTELS */}
        {activeTab === 'hotels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hotels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                No hotel listings found for {name}
              </div>
            ) : (
              hotels.map((hotel, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border, rgba(15,23,42,0.08))',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>
                      {hotel.name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)' }}>
                      {hotel.type} • {hotel.stars}★
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', color: '#10b981' }}>
                    ${hotel.pricePerNightUSD}/night
                  </strong>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: FOOD */}
        {activeTab === 'food' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {restaurants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                No culinary recommendations listed for {name}
              </div>
            ) : (
              restaurants.map((rest, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border, rgba(15,23,42,0.08))',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>
                      {rest.name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>
                      Specialty: {rest.specialty}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent, #2563eb)', fontWeight: 800 }}>
                    {rest.priceRange}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 4. PRIMARY ACTION BUTTON: Explore [Destination] */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--glass-border, rgba(15,23,42,0.08))',
        background: 'var(--color-bg-surface, #ffffff)',
        flexShrink: 0
      }}>
        <button
          onClick={handleStartPlanning}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '12px',
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            transition: 'background 0.2s'
          }}
        >
          <span>Explore {name}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );

  if (isInline) {
    return panelContent;
  }

  return (
    <motion.aside
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      style={{
        position: 'absolute',
        zIndex: 500,
        top: 0,
        bottom: 0,
        right: 0,
        width: '420px',
        maxWidth: '100%',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.25)',
        borderLeft: '1px solid var(--glass-border, rgba(15,23,42,0.08))'
      }}
    >
      {panelContent}
    </motion.aside>
  );
};
