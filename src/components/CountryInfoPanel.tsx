import React, { useState } from 'react';
import { 
  X, Heart, CloudSun, Sun, CloudRain, Cloud, Sparkles, 
  Globe, Compass
} from '../icons';
import { type DestinationItem, resolveDestination, generateDestinationForCountry } from '../services/destinationCatalog';

export interface CountryData {
  name: string;
  capital: string;
  language: string;
  currency: string;
  timezone: string;
  population?: string;
  callingCode?: string;
  region?: string;
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
  onExploreDestination?: (destination: any) => void;
  inline?: boolean;
  embedded?: boolean;
}

export const CountryInfoPanel: React.FC<CountryInfoPanelProps> = ({ 
  country, 
  onClose, 
  onCreateTrip, 
  onExploreDestination,
  inline = false,
  embedded = false 
}) => {
  const [isSaved, setIsSaved] = useState(false);

  if (!country) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '32px',
        textAlign: 'center',
        color: 'var(--text-secondary, #94A3B8)',
        background: 'var(--bg-surface, #101E32)',
        borderRadius: inline ? '16px' : '0',
        border: '1px solid var(--border, rgba(255,255,255,0.08))'
      }}>
        <Globe size={36} style={{ color: 'var(--accent, #3B82F6)', marginBottom: '12px', opacity: 0.8 }} />
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary, #F8FAFC)' }}>
          Select a Country
        </h4>
        <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', maxWidth: '220px' }}>
          Interact with the 3D globe to inspect live travel telemetry, visa rules, and destinations.
        </p>
      </div>
    );
  }

  // Resolve into normalized data structure
  let item: DestinationItem | null = null;
  let countryName = '';

  if ((country as any).places && (country as any).countryCode) {
    item = country as DestinationItem;
    countryName = item.country || item.name;
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

  // Fallback metadata extracted cleanly
  const name = (item ? item.name : countryName || 'Destination').toUpperCase();
  const rawName = item ? item.name : countryName || 'Destination';
  const capital = item?.capital || (country as any)?.capital || `${rawName} Capital`;
  const currency = item?.currency || (country as any)?.currency || 'USD';
  const language = item?.language || (country as any)?.language || 'Local Language';
  const timezone = item?.timezone || (country as any)?.timezone || 'UTC+0';
  const population = item?.population || (country as any)?.population || ((country as any)?.properties?.POP_EST ? `${((country as any).properties.POP_EST / 1000000).toFixed(1)}M` : 'Verified');
  const callingCode = item?.callingCode || (country as any)?.callingCode || '+33';
  const region = item?.region || (country as any)?.region || ((country as any)?.properties?.CONTINENT ? `${(country as any).properties.CONTINENT} · ${(country as any).properties.SUBREGION || ''}`.trim() : 'Global Region');
  const flag = item?.flag || (country as any)?.flag || '🌍';
  const weather = item?.weather ? { temp: item.weather.tempC, condition: item.weather.condition } : (country as any)?.weather || { temp: 22, condition: 'Partly cloudy' };
  const popularDestinations = item?.popularDestinations || [
    { name: capital, region: 'Capital District', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80' }
  ];

  // Hero Cover Image
  const heroImage = item?.popularDestinations?.[0]?.image || 
                    item?.places?.[0]?.imageUrl || 
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <CloudSun size={18} style={{ color: '#60A5FA' }} />;
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return <Sun size={18} style={{ color: '#F59E0B' }} />;
    if (c.includes('rain')) return <CloudRain size={18} style={{ color: '#3B82F6' }} />;
    if (c.includes('cloud')) return <Cloud size={18} style={{ color: '#94A3B8' }} />;
    return <CloudSun size={18} style={{ color: '#60A5FA' }} />;
  };

  const handleStartPlanning = () => {
    if (onCreateTrip) {
      onCreateTrip(item || { name: rawName, id: rawName.toLowerCase() });
    }
  };

  const handleExplore = () => {
    if (onExploreDestination) {
      onExploreDestination(item || { name: rawName, id: rawName.toLowerCase() });
    } else if (onCreateTrip) {
      onCreateTrip(item || { name: rawName, id: rawName.toLowerCase() });
    }
  };

  const isInline = inline || embedded;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: 'var(--bg-surface, #101E32)',
      color: 'var(--text-primary, #F8FAFC)',
      borderRadius: isInline ? '16px' : '0',
      border: isInline ? '1px solid var(--border, rgba(255,255,255,0.08))' : 'none',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      {/* 1. HEADER SECTION */}
      <div style={{
        position: 'relative',
        height: '140px',
        width: '100%',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <img
          src={heroImage}
          alt={rawName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Dark Navy Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 17, 31, 0.3) 0%, rgba(16, 30, 50, 0.95) 100%)'
        }} />

        {/* Top-Right Favorite & Close */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '6px',
          zIndex: 10
        }}>
          <button
            onClick={() => setIsSaved(!isSaved)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(7, 17, 31, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: isSaved ? '#EF4444' : '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isSaved ? 'Saved' : 'Save Country'}
          >
            <Heart size={14} fill={isSaved ? '#EF4444' : 'none'} />
          </button>

          {!isInline && onClose && (
            <button
              onClick={onClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(7, 17, 31, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close panel"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Country Title & Region */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 5
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>{flag}</span>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#F8FAFC',
                margin: 0,
                letterSpacing: '0.5px',
                fontFamily: "'Outfit', sans-serif"
              }}>
                {name}
              </h2>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px', fontWeight: 600 }}>
              {capital} • {region}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#60A5FA',
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.25)'
            }}>
              {currency} • {callingCode}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE BODY */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Country Key Facts 4-Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          background: 'var(--bg-secondary, #0B1728)',
          padding: '10px 12px',
          borderRadius: '12px',
          border: '1px solid var(--border, rgba(255,255,255,0.08))'
        }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
              Capital
            </span>
            <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
              {capital}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
              Population
            </span>
            <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
              {population}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
              Language
            </span>
            <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              {language.split(',')[0]}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
              Timezone
            </span>
            <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
              {timezone}
            </strong>
          </div>
        </div>

        {/* Mini Weather Card Abstraction */}
        <div style={{
          background: 'var(--bg-secondary, #0B1728)',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getWeatherIcon(weather?.condition)}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary, #F8FAFC)' }}>
                {capital}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary, #94A3B8)' }}>
                {weather?.condition || 'Partly cloudy'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary, #F8FAFC)', fontFamily: "'Outfit', sans-serif" }}>
              {weather?.temp || 22}°C
            </span>
            <span style={{ display: 'block', fontSize: '0.62rem', color: '#60A5FA', fontWeight: 700 }}>
              Live Forecast
            </span>
          </div>
        </div>

        {/* Popular Destinations List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Popular Destinations
            </span>
            <span style={{ fontSize: '0.65rem', color: '#60A5FA', fontWeight: 700 }}>
              {popularDestinations.length} Hubs
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px'
          }}>
            {popularDestinations.slice(0, 3).map((dest, i) => (
              <div
                key={i}
                onClick={handleExplore}
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '74px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 30%, rgba(7, 17, 31, 0.9) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '5px 6px'
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>
                    {dest.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BUTTONS */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
        background: 'var(--bg-secondary, #0B1728)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 0.8fr',
        gap: '8px'
      }}>
        <button
          onClick={handleExplore}
          style={{
            padding: '8px 10px',
            borderRadius: '10px',
            background: 'var(--bg-surface, #101E32)',
            color: 'var(--text-primary, #F8FAFC)',
            border: '1px solid var(--border, rgba(255,255,255,0.12))',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover, #15263D)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-surface, #101E32)')}
        >
          <Compass size={13} style={{ color: '#60A5FA' }} />
          <span>Explore</span>
        </button>

        <button
          onClick={handleStartPlanning}
          style={{
            padding: '8px 10px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: '0 2px 10px rgba(59, 130, 246, 0.35)'
          }}
        >
          <Sparkles size={13} />
          <span>Plan a trip</span>
        </button>

        <button
          onClick={() => setIsSaved(!isSaved)}
          style={{
            padding: '8px 8px',
            borderRadius: '10px',
            background: isSaved ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface, #101E32)',
            color: isSaved ? '#EF4444' : 'var(--text-secondary, #94A3B8)',
            border: isSaved ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border, rgba(255,255,255,0.12))',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Heart size={13} fill={isSaved ? '#EF4444' : 'none'} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};
