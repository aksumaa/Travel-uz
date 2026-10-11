import React, { useState, useEffect } from 'react';
import { 
  X, Heart, CloudSun, Sun, CloudRain, Cloud, Sparkles, 
  Globe, Compass, MapPin, Users, Languages, DollarSign, Clock, 
  Calendar, Star, Navigation, ArrowRight, ShieldCheck, Tag
} from '../icons';
import { CountryInfo, DestinationInfo } from '../types/destinationSystem';
import { getCountryInfo, normalizeCountryKey } from '../services/countryDestinationService';
import type { CountryData, GlobeCountryData } from '../types/travel';
import { useLanguage } from '../context/LanguageContext';

export type { CountryData, GlobeCountryData, CountryInfo, DestinationInfo };

export interface CountryInfoPanelProps {
  country: CountryInfo | { id?: string; name?: string; countryCode?: string; properties?: { NAME: string; [key: string]: any }; [key: string]: any } | string | null;
  onClose?: () => void;
  onCreateTrip?: (destination: any) => void;
  onExploreDestination?: (destination: any) => void;
  inline?: boolean;
  embedded?: boolean;
  isLoading?: boolean;
}

/**
 * Reusable Universal Country Information Panel
 * Displays standardized, verified travel telemetry and destinations for ANY country.
 * Guarantees zero stale state retention when switching between countries (e.g. France <-> Niger).
 */
export const CountryInfoPanel: React.FC<CountryInfoPanelProps> = ({ 
  country, 
  onClose, 
  onCreateTrip, 
  onExploreDestination,
  inline = false,
  embedded = false,
  isLoading = false
}) => {
  const { t, language } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'destinations'>('overview');
  const [imgError, setImgError] = useState(false);

  // Derive resolved CountryInfo
  let resolvedCountry: CountryInfo | null = null;

  if (country) {
    if (typeof country === 'string') {
      resolvedCountry = getCountryInfo(country, undefined, language);
    } else if ((country as any).destinations && (country as any).countryCode && (country as any).averageBudget) {
      resolvedCountry = country as CountryInfo;
    } else if ((country as any).properties?.NAME) {
      resolvedCountry = getCountryInfo((country as any).properties.NAME, (country as any).properties, language);
    } else if ((country as any).id) {
      resolvedCountry = getCountryInfo((country as any).id, (country as any).properties, language);
    } else if ((country as any).name) {
      resolvedCountry = getCountryInfo((country as any).name, (country as any).properties, language);
    }
  }

  // Reset internal selection & states when country ID or countryCode changes
  const countryId = resolvedCountry?.id || resolvedCountry?.countryCode || 'none';
  useEffect(() => {
    setSelectedDestination(null);
    setIsSaved(false);
    setActiveTab('overview');
    setImgError(false);
  }, [countryId]);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'var(--bg-surface, #101E32)',
        borderRadius: inline || embedded ? '16px' : '0',
        padding: '24px',
        gap: '16px',
        border: '1px solid var(--border, rgba(255,255,255,0.08))'
      }}>
        <div style={{ height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '24px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
        </div>
        <div style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
      </div>
    );
  }

  // Empty / No Country Selected Fallback
  if (!resolvedCountry) {
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
        borderRadius: inline || embedded ? '16px' : '0',
        border: '1px solid var(--border, rgba(255,255,255,0.08))'
      }}>
        <Globe size={38} style={{ color: 'var(--accent, #3B82F6)', marginBottom: '12px', opacity: 0.8 }} />
        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary, #F8FAFC)' }}>
          {t('countryInfo.selectCountry')}
        </h4>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary, #94A3B8)', maxWidth: '240px', lineHeight: 1.4 }}>
          {t('countryInfo.selectCountryDesc')}
        </p>
      </div>
    );
  }

  const {
    name,
    countryCode,
    capital,
    population,
    languages,
    currency,
    timezone,
    weather,
    bestTime,
    averageBudget,
    description,
    heroImage,
    destinations,
    coordinates,
    flag,
    region,
    callingCode,
    visaStatus
  } = resolvedCountry;

  const fallbackHero = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <CloudSun size={18} style={{ color: '#60A5FA' }} />;
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return <Sun size={18} style={{ color: '#F59E0B' }} />;
    if (c.includes('rain')) return <CloudRain size={18} style={{ color: '#3B82F6' }} />;
    if (c.includes('cloud')) return <Cloud size={18} style={{ color: '#94A3B8' }} />;
    return <CloudSun size={18} style={{ color: '#60A5FA' }} />;
  };

  const handleStartPlanning = (destName?: string) => {
    const target = destName || name;
    if (onCreateTrip) {
      onCreateTrip({
        name: target,
        country: name,
        countryCode,
        capital,
        id: target.toLowerCase().replace(/[^a-z0-9]/g, '-')
      });
    }
  };

  const handleExplore = (dest?: DestinationInfo) => {
    const target = dest ? dest.name : name;
    if (onExploreDestination) {
      onExploreDestination({
        name: target,
        country: name,
        id: target.toLowerCase().replace(/[^a-z0-9]/g, '-')
      });
    } else if (onCreateTrip) {
      onCreateTrip({
        name: target,
        country: name,
        id: target.toLowerCase().replace(/[^a-z0-9]/g, '-')
      });
    }
  };

  const isInline = inline || embedded;

  return (
    <div 
      key={`country-panel-${countryCode}-${name}`}
      style={{
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
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* 1. HERO HEADER WITH REAL IMAGERY & TELEMETRY BADGES */}
      <div style={{
        position: 'relative',
        height: '155px',
        width: '100%',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <img
          src={imgError ? fallbackHero : heroImage}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Navy Gradient Scrim */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 17, 31, 0.4) 0%, rgba(16, 30, 50, 0.95) 100%)'
        }} />

        {/* Top Controls: Favorite & Close */}
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
              background: isSaved ? '#EF4444' : 'rgba(7, 17, 31, 0.75)',
              backdropFilter: 'blur(8px)',
              border: isSaved ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            title={isSaved ? t('countryInfo.savedInVault') : t('countryInfo.saveCountry')}
          >
            <Heart size={15} fill={isSaved ? '#FFFFFF' : 'none'} />
          </button>

          {!isInline && onClose && (
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(7, 17, 31, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={t('countryInfo.closePanel')}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Header Country Title, Code & Region */}
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
              <span style={{ fontSize: '1.35rem' }}>{flag}</span>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '0.4px',
                fontFamily: "'Outfit', sans-serif"
              }}>
                {name}
              </h2>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                background: 'rgba(59, 130, 246, 0.25)',
                color: '#60A5FA',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                letterSpacing: '0.5px'
              }}>
                {countryCode}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '3px', fontWeight: 600 }}>
              {capital} • {region || 'Global'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#34D399',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-block'
            }}>
              {averageBudget.formatted || `${averageBudget.perDayUSD} / day`}
            </span>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR (Overview vs Destinations) */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
        background: 'var(--bg-secondary, #0B1728)',
        padding: '0 16px'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 14px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #3B82F6' : '2px solid transparent',
            color: activeTab === 'overview' ? '#60A5FA' : '#94A3B8',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {t('countryInfo.countryTelemetry')}
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          style={{
            padding: '10px 14px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'destinations' ? '2px solid #3B82F6' : '2px solid transparent',
            color: activeTab === 'destinations' ? '#60A5FA' : '#94A3B8',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <span>{t('countryInfo.destinationsTab')}</span>
          <span style={{
            fontSize: '0.65rem',
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '1px 6px',
            borderRadius: '10px',
            color: '#60A5FA'
          }}>
            {destinations.length}
          </span>
        </button>
      </div>

      {/* 2. SCROLLABLE BODY (CONTENT) */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {activeTab === 'overview' ? (
          <>
            {/* Standard Telemetry 4-Fact Grid */}
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
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} style={{ color: '#60A5FA' }} /> {t('countryInfo.capital')}
                </span>
                <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
                  {capital}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={11} style={{ color: '#34D399' }} /> {t('stats.travelers')}
                </span>
                <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
                  {population}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Languages size={11} style={{ color: '#F59E0B' }} /> {t('countryInfo.officialLanguage')}
                </span>
                <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {Array.isArray(languages) ? languages.join(', ') : languages}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={11} style={{ color: '#EC4899' }} /> {t('countryInfo.currency')}
                </span>
                <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
                  {currency.formatted || `${currency.code} (${currency.symbol})`}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} style={{ color: '#A78BFA' }} /> {t('countryInfo.timezone')}
                </span>
                <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700 }}>
                  {timezone}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={11} style={{ color: '#38BDF8' }} /> {t('countryInfo.bestTimeToVisit')}
                </span>
                <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary, #F8FAFC)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {bestTime}
                </strong>
              </div>
            </div>

            {/* Weather & Live Telemetry Strip */}
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getWeatherIcon(weather?.condition)}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary, #F8FAFC)' }}>
                    {capital} Weather
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #94A3B8)' }}>
                    {weather?.condition || 'Clear Skies'}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary, #F8FAFC)', fontFamily: "'Outfit', sans-serif" }}>
                  {weather?.tempC}°C
                </span>
                <span style={{ display: 'block', fontSize: '0.62rem', color: '#60A5FA', fontWeight: 700 }}>
                  Coordinates: {coordinates.lat.toFixed(1)}°, {coordinates.lng.toFixed(1)}°
                </span>
              </div>
            </div>

            {/* Country Description */}
            <div style={{
              background: 'var(--bg-secondary, #0B1728)',
              border: '1px solid var(--border, rgba(255,255,255,0.08))',
              borderRadius: '12px',
              padding: '10px 14px'
            }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                Destination Overview
              </span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', lineHeight: 1.45 }}>
                {description}
              </p>
            </div>

            {/* Popular Destinations Mini Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Signature Hubs in {name}
                </span>
                <button
                  onClick={() => setActiveTab('destinations')}
                  style={{ background: 'transparent', border: 'none', color: '#60A5FA', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  View all ({destinations.length}) <ArrowRight size={11} />
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(destinations.length, 3)}, 1fr)`,
                gap: '8px'
              }}>
                {destinations.slice(0, 3).map((dest) => (
                  <div
                    key={dest.id || dest.name}
                    onClick={() => setSelectedDestination(dest)}
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '80px',
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
                      background: 'linear-gradient(180deg, transparent 20%, rgba(7, 17, 31, 0.95) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '6px'
                    }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>
                        {dest.name}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: '#38BDF8', fontWeight: 700 }}>
                        ★ {dest.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ALL DESTINATIONS TAB */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              All {destinations.length} Verified Destinations in {name}
            </span>

            {destinations.map((dest) => (
              <div
                key={dest.id || dest.name}
                onClick={() => setSelectedDestination(dest)}
                style={{
                  background: 'var(--bg-secondary, #0B1728)',
                  border: '1px solid var(--border, rgba(255,255,255,0.08))',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  padding: '10px',
                  alignItems: 'center',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>
                      {dest.name}
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={10} fill="#F59E0B" /> {dest.rating}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#60A5FA', fontWeight: 700, margin: '2px 0' }}>
                    {dest.category} • {dest.city}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dest.description}
                  </p>
                  <div style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 800, marginTop: '3px' }}>
                    Est. {dest.estimatedCost.currencyFormatted || `$${dest.estimatedCost.perDayUSD} / day`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. DESTINATION DETAIL MODAL OVERLAY (IF A SPECIFIC DESTINATION IS CLICKED) */}
      {selectedDestination && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-surface, #101E32)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', height: '140px', flexShrink: 0 }}>
            <img src={selectedDestination.image} alt={selectedDestination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7, 17, 31, 0.4) 0%, rgba(16, 30, 50, 0.95) 100%)' }} />
            <button
              onClick={() => setSelectedDestination(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(7, 17, 31, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={15} />
            </button>
            <div style={{ position: 'absolute', bottom: '10px', left: '16px', right: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase' }}>
                {selectedDestination.category}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                {selectedDestination.name}
              </h3>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: 'var(--bg-secondary, #0B1728)', padding: '8px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block' }}>Rating</span>
                <strong style={{ fontSize: '0.8rem', color: '#F59E0B' }}>★ {selectedDestination.rating}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block' }}>Best Time</span>
                <strong style={{ fontSize: '0.75rem', color: '#FFFFFF' }}>{selectedDestination.bestTime}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block' }}>Est. Cost</span>
                <strong style={{ fontSize: '0.8rem', color: '#34D399' }}>${selectedDestination.estimatedCost.perDayUSD}/d</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.45, margin: 0 }}>
              {selectedDestination.description}
            </p>

            {selectedDestination.highlights && (
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#F8FAFC', display: 'block', marginBottom: '6px' }}>
                  Signature Highlights
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedDestination.highlights.map((h, i) => (
                    <span key={i} style={{ fontSize: '0.68rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border, rgba(255,255,255,0.08))', background: 'var(--bg-secondary, #0B1728)', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedDestination(null)}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                background: 'var(--bg-surface, #101E32)',
                color: '#F8FAFC',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Back to {name}
            </button>
            <button
              onClick={() => handleStartPlanning(selectedDestination.name)}
              style={{
                flex: 1.4,
                padding: '9px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={13} />
              <span>Plan for {selectedDestination.name}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. BOTTOM ACTION TOOLBAR */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
        background: 'var(--bg-secondary, #0B1728)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 0.8fr',
        gap: '8px'
      }}>
        <button
          onClick={() => handleExplore()}
          style={{
            padding: '9px 10px',
            borderRadius: '10px',
            background: 'var(--bg-surface, #101E32)',
            color: 'var(--text-primary, #F8FAFC)',
            border: '1px solid var(--border, rgba(255,255,255,0.12))',
            fontSize: '0.75rem',
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
          <Compass size={14} style={{ color: '#60A5FA' }} />
          <span>{t('nav.explore')}</span>
        </button>

        <button
          onClick={() => handleStartPlanning()}
          style={{
            padding: '9px 10px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: '0 2px 10px rgba(59, 130, 246, 0.35)'
          }}
        >
          <Sparkles size={14} />
          <span>{t('hero.startPlanning')}</span>
        </button>

        <button
          onClick={() => setIsSaved(!isSaved)}
          style={{
            padding: '9px 8px',
            borderRadius: '10px',
            background: isSaved ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface, #101E32)',
            color: isSaved ? '#EF4444' : 'var(--text-secondary, #94A3B8)',
            border: isSaved ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border, rgba(255,255,255,0.12))',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Heart size={14} fill={isSaved ? '#EF4444' : 'none'} />
          <span>{isSaved ? t('common.saved') : t('common.save')}</span>
        </button>
      </div>
    </div>
  );
};
