import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Star, Compass, Shield, Sparkles, 
  ArrowRight, CreditCard, Navigation, Coffee, Landmark,
  Globe, Heart, Calendar, Users, DollarSign, X
} from '../icons';
import { useCurrency } from '../context/CurrencyContext';
import { PlaceDetailModal, type PlaceDetailData } from '../components/PlaceDetailModal';
import { CountryInfoPanel } from '../components/CountryInfoPanel';
import { CountryInfo, DestinationInfo } from '../types/destinationSystem';
import { 
  getAllCountries, 
  getCountryInfo, 
  searchCountriesAndDestinations 
} from '../services/countryDestinationService';

interface ExploreViewProps {
  onPlanTrip: (destination: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onPlanTrip }) => {
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountryForModal, setSelectedCountryForModal] = useState<CountryInfo | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetailData | null>(null);

  const allCountries = getAllCountries();

  // Search results from centralized service
  const { countries: searchedCountries, destinations: searchedDestinations } = searchCountriesAndDestinations(searchTerm);

  // Filter countries by region if set
  const filteredCountries = searchedCountries.filter(c => {
    if (selectedRegion === 'All') return true;
    return c.region?.toLowerCase().includes(selectedRegion.toLowerCase());
  });

  // Filter destinations
  const filteredDestinations = searchedDestinations.filter(dest => {
    if (selectedCategory === 'All') return true;
    return dest.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. HERO HEADER & GLOBAL SEARCH BAR */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.14) 0%, rgba(124, 58, 237, 0.08) 100%)',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent, #3B82F6)', letterSpacing: '0.6px' }}>
            Global Destination Intelligence Directory
          </span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
            Explore Verified Countries & Travel Hubs
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#94A3B8', maxWidth: '650px', lineHeight: 1.5 }}>
            Interactive encyclopedia of verified countries, cities, live weather, cultural monuments, and daily travel budgets.
          </p>
        </div>

        {/* Search input & filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              flex: '1 1 320px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#0B1728',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '100px',
              padding: '10px 18px',
            }}
          >
            <Search size={18} style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by country (France, Niger, Uzbekistan...) or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.9rem',
                color: '#FFFFFF',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'Outfit', sans-serif"
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {['All', 'Europe', 'Africa', 'Asia', 'Americas'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: selectedRegion === reg ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: selectedRegion === reg ? '#3B82F6' : '#0B1728',
                  color: selectedRegion === reg ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. FEATURED COUNTRIES GRID (France, Niger, Uzbekistan, Japan, Italy, Turkey, USA, etc.) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
              Verified Global Countries ({filteredCountries.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Select any country to view live telemetry, budget tiers, and signature destinations
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredCountries.map((country) => (
            <div
              key={country.id}
              onClick={() => setSelectedCountryForModal(country)}
              style={{
                background: '#101E32',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.18s ease, border-color 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Cover Photo */}
              <div style={{ position: 'relative', height: '140px', width: '100%' }}>
                <img
                  src={country.heroImage}
                  alt={country.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 20%, rgba(7, 17, 31, 0.9) 100%)'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.55)',
                  backdropFilter: 'blur(6px)',
                  padding: '3px 8px',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}>
                  {country.flag} {country.region}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  background: 'rgba(59, 130, 246, 0.25)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#60A5FA'
                }}>
                  {country.countryCode}
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '14px',
                  right: '14px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                    {country.name}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    Capital: {country.capital}
                  </span>
                </div>
              </div>

              {/* Body summary */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
                  <div style={{ background: '#0B1728', padding: '6px 8px', borderRadius: '8px' }}>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.62rem' }}>Weather</span>
                    <strong style={{ color: '#FFFFFF' }}>{country.weather.tempC}°C, {country.weather.condition}</strong>
                  </div>
                  <div style={{ background: '#0B1728', padding: '6px 8px', borderRadius: '8px' }}>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.62rem' }}>Average Budget</span>
                    <strong style={{ color: '#10B981' }}>{country.averageBudget.formatted || `$${country.averageBudget.perDayUSD}/d`}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#60A5FA', fontWeight: 700 }}>
                    {country.destinations.length} Hubs (e.g. {country.destinations.map(d => d.name).slice(0, 2).join(', ')})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Inspect <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIGNATURE DESTINATIONS CATALOG */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
              Signature Destinations ({filteredDestinations.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Verified hubs across France, Niger, Uzbekistan, Japan, Italy and beyond
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '18px'
        }}>
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id || dest.name}
              style={{
                background: '#101E32',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div style={{ position: 'relative', height: '170px', width: '100%' }}>
                <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(7, 17, 31, 0.95) 100%)' }} />
                
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(59, 130, 246, 0.85)',
                  padding: '3px 8px',
                  borderRadius: '100px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}>
                  {dest.category}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  borderRadius: '100px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  color: '#F59E0B',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Star size={12} fill="#F59E0B" /> {dest.rating}
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                    {dest.name}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {dest.city}, {dest.country}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.45 }}>
                  {dest.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>Estimated Daily Cost</span>
                    <strong style={{ fontSize: '0.85rem', color: '#10B981' }}>
                      {dest.estimatedCost.currencyFormatted || `$${dest.estimatedCost.perDayUSD} / day`}
                    </strong>
                  </div>

                  <button
                    onClick={() => onPlanTrip(`${dest.name}, ${dest.country}`)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} />
                    <span>Plan Trip</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MODAL DIALOG WHEN A COUNTRY IS SELECTED */}
      <AnimatePresence>
        {selectedCountryForModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedCountryForModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '480px',
                height: '640px',
                maxHeight: '90vh',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              <CountryInfoPanel
                country={selectedCountryForModal}
                onClose={() => setSelectedCountryForModal(null)}
                onCreateTrip={(dest) => {
                  setSelectedCountryForModal(null);
                  onPlanTrip(dest.name || selectedCountryForModal.name);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
