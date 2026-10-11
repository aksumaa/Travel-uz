'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../locales/translations';
import { 
  MyTripsView,
  SavedView, AIAssistantView, ProfileView, SettingsView 
} from './DashboardViews';
import { AiPlannerWizard } from '../components/AiPlannerWizard';
import { ExploreView } from './ExploreView';
import { ToursMarketplaceView } from './ToursMarketplaceView';
import { TripDetailsView } from './TripDetailsView';
import { AdminView } from './AdminView';
import { CrmPipelineView } from '../components/CrmPipelineView';
import { AgencyAnalyticsView } from '../components/AgencyAnalyticsView';
import { TelegramSettingsView } from '../components/TelegramSettingsView';
import { AgencyOnboardingModal } from '../components/AgencyOnboardingModal';
import { Globe3D } from '../components/Globe3D';
import { GlobalSearch } from '../components/ui/GlobalSearch';
import { 
  resolveDestination, 
  generateDestinationForCountry,
  type DestinationItem 
} from '../services/destinationCatalog';
import type { SearchResultItem } from '../services/searchService';
import { 
  Compass, Sparkles, Calendar, Heart, 
  Search, Sun, Moon, Bell, X, Globe,
  Users, User, ArrowRight, MapPin, Settings as SettingsIcon,
  MessageSquare, Check, Star, CloudSun, Clock, DollarSign,
  Languages, Plane
} from '../icons';

import { CountryInfo, DestinationInfo } from '../types/destinationSystem';
import { 
  getCountryInfo, 
  getAllCountries, 
  GLOBAL_COUNTRIES_DATA, 
  normalizeCountryKey 
} from '../services/countryDestinationService';
import { CountryInfoPanel } from '../components/CountryInfoPanel';

// Legacy compatibility alias
export type CountryOverviewData = CountryInfo;
export const COUNTRIES_DATA = GLOBAL_COUNTRIES_DATA;

// ==================== POPULAR DESTINATIONS LIST ====================
export interface PopularDestination {
  id: string;
  countryId: string;
  city: string;
  country: string;
  flag: string;
  region: 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania';
  rating: number;
  reviews: string;
  image: string;
  tag: string;
  priceStartUSD: number;
}

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    id: 'dest-paris',
    countryId: 'france',
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    rating: 4.9,
    reviews: '4.8k reviews',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tag: 'Culture & Romance',
    priceStartUSD: 180
  },
  {
    id: 'dest-tokyo',
    countryId: 'japan',
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    rating: 4.9,
    reviews: '5.2k reviews',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    tag: 'Futuristic & Food',
    priceStartUSD: 195
  },
  {
    id: 'dest-dubai',
    countryId: 'uae',
    city: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    region: 'Asia',
    rating: 4.8,
    reviews: '3.9k reviews',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tag: 'Luxury & Modernity',
    priceStartUSD: 230
  },
  {
    id: 'dest-istanbul',
    countryId: 'turkey',
    city: 'Istanbul',
    country: 'Turkey',
    flag: '🇹🇷',
    region: 'Europe',
    rating: 4.8,
    reviews: '4.1k reviews',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage & Bosphorus',
    priceStartUSD: 110
  },
  {
    id: 'dest-samarkand',
    countryId: 'uzbekistan',
    city: 'Samarkand',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    region: 'Asia',
    rating: 4.9,
    reviews: '2.8k reviews',
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
    tag: 'Silk Road Wonder',
    priceStartUSD: 75
  },
  {
    id: 'dest-bali',
    countryId: 'indonesia',
    city: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asia',
    rating: 4.9,
    reviews: '6.4k reviews',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tag: 'Island & Serenity',
    priceStartUSD: 85
  }
];

const MY_DESTINATIONS_LIST = [
  { id: 'france', name: 'France', flag: '🇫🇷' },
  { id: 'niger', name: 'Niger', flag: '🇳🇪' },
  { id: 'uzbekistan', name: 'Uzbekistan', flag: '🇺🇿' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹' },
  { id: 'turkey', name: 'Turkey', flag: '🇹🇷' },
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  { id: 'uae', name: 'UAE', flag: '🇦🇪' },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷' },
  { id: 'uk', name: 'UK', flag: '🇬🇧' },
];

const REGION_FILTERS = [
  'All',
  'Europe',
  'Asia',
  'Africa',
  'North America',
  'South America',
  'Oceania'
] as const;

type RegionFilter = (typeof REGION_FILTERS)[number];

interface DashboardProps {
  initialView?: string;
  onViewChange?: (view: string) => void;
  variant?: 'user' | 'admin';
}

export const Dashboard: React.FC<DashboardProps> = ({ initialView = 'home', onViewChange, variant = 'user' }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies, formatPrice } = useCurrency();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>(variant === 'admin' ? (initialView === 'home' ? 'admin' : initialView) : initialView);

  useEffect(() => {
    if (initialView && initialView !== 'home') {
      setActiveTab(initialView);
    }
  }, [initialView]);

  // Current selected country for the large Country Overview Panel
  const [selectedCountryId, setSelectedCountryId] = useState<string>('france');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('All');
  const [savedCountries, setSavedCountries] = useState<string[]>(['france', 'niger', 'uzbekistan', 'japan']);
  const [showSaveToast, setShowSaveToast] = useState<string | null>(null);

  // Selected trip & planner destination
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [plannerDestination, setPlannerDestination] = useState<string>('France');

  // Dropdown & Modal states
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  // Search input and suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onViewChange) {
      onViewChange(tab);
    }
  };

  const handleSelectCountry = (countryId: string) => {
    const clean = normalizeCountryKey(countryId);
    setSelectedCountryId(clean);
    // Switch to home view so the overview panel is visible
    if (activeTab !== 'home') {
      handleTabChange('home');
    }
  };

  const handleStartPlanningFor = (destName: string) => {
    setPlannerDestination(destName);
    handleTabChange('planner');
  };

  const handleToggleSaveCountry = (countryId: string, name: string) => {
    const isSaved = savedCountries.includes(countryId);
    let updated: string[];
    if (isSaved) {
      updated = savedCountries.filter(id => id !== countryId);
      setShowSaveToast(`Removed ${name} from saved destinations`);
    } else {
      updated = [...savedCountries, countryId];
      setShowSaveToast(`Saved ${name} to your travel vault ❤️`);
    }
    setSavedCountries(updated);
    setTimeout(() => setShowSaveToast(null), 2500);
  };

  // Active country details directly from centralized service with active language
  const activeCountry: CountryInfo = getCountryInfo(selectedCountryId, undefined, language);
  const isCurrentCountrySaved = savedCountries.includes(activeCountry.id);

  // Filtered popular destinations based on active Region Filter
  const filteredPopularDestinations = POPULAR_DESTINATIONS.filter(item => {
    if (selectedRegion === 'All') return true;
    return item.region === selectedRegion;
  });

  // Filtered Search Results
  const searchResults = searchQuery.trim() ? [
    ...Object.values(COUNTRIES_DATA).filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.destinations && c.destinations.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.city?.toLowerCase().includes(searchQuery.toLowerCase())))
    ),
    ...POPULAR_DESTINATIONS.filter(d => 
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ].slice(0, 6) : [];

  // Notifications List
  const notifications = [
    { id: 1, title: 'AI Itinerary Ready', desc: 'Your 5-day route for Paris is generated.', time: '10m ago', unread: true },
    { id: 2, title: 'Seasonal Flight Alert', desc: 'Fares to Samarkand dropped by 18%.', time: '1h ago', unread: true },
    { id: 3, title: 'New Destination Added', desc: 'Kyoto autumn foliage guide is now live.', time: '1d ago', unread: false }
  ];

  // Colors based on theme for absolute accessibility & crispness
  const isDark = theme === 'dark';
  const colors = {
    bgPage: isDark ? '#07111F' : '#F8FAFC',
    bgSidebar: isDark ? '#0B1728' : '#FFFFFF',
    bgCard: isDark ? '#101E32' : '#FFFFFF',
    bgCardHover: isDark ? '#15263D' : '#F1F5F9',
    bgSubtle: isDark ? '#0B1728' : '#F1F5F9',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textSecondary: isDark ? '#94A3B8' : '#475569',
    textMuted: isDark ? '#64748B' : '#64748B',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
    borderHover: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(15, 23, 42, 0.18)',
    accent: '#3B82F6',
    accentLight: '#60A5FA',
    accentBg: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    shadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.35)' : '0 10px 30px rgba(15, 23, 42, 0.06)'
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: colors.bgPage, 
      color: colors.textPrimary, 
      fontFamily: "'Inter', sans-serif",
      position: 'relative' 
    }}>
      
      {/* Save Notification Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              background: isDark ? '#1E293B' : '#0F172A',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Sparkles size={16} style={{ color: '#60A5FA' }} />
            <span>{showSaveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agency Onboarding Modal */}
      <AgencyOnboardingModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={() => alert('Agency onboarded successfully!')}
      />

      {/* ============================================================ */}
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      {/* ============================================================ */}
      <aside 
        id="desktop-sidebar"
        className="dashboard-sidebar-desktop"
        style={{
          width: '240px',
          background: colors.bgSidebar,
          borderRight: `1px solid ${colors.border}`,
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          padding: '24px 16px',
          boxShadow: isDark ? 'none' : '2px 0 12px rgba(0,0,0,0.03)',
          overflowY: 'auto'
        }}
      >
        {/* BRAND / LOGO */}
        <div 
          onClick={() => handleTabChange('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '4px 8px 20px 8px',
            cursor: 'pointer',
            borderBottom: `1px solid ${colors.border}`,
            marginBottom: '16px'
          }}
          title="TripMind Travel Platform"
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            flexShrink: 0
          }}>
            <Compass size={22} />
          </div>
          <div>
            <span style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.8px',
              color: colors.textPrimary,
              display: 'block',
              lineHeight: 1
            }}>
              TRIPMIND
            </span>
            <span style={{ fontSize: '0.65rem', color: colors.accent, fontWeight: 700, letterSpacing: '0.4px' }}>
              TRAVEL PLATFORM
            </span>
          </div>
        </div>

        {/* PRIMARY NAVIGATION ITEMS */}
        {/* PRIMARY NAVIGATION ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'home', label: t('dashboard.explore') || 'Explore', icon: <Compass size={18} /> },
            { id: 'my-trips', label: t('dashboard.myTrips') || 'My Trips', icon: <Calendar size={18} /> },
            { id: 'saved', label: t('dashboard.saved') || 'Saved', icon: <Heart size={18} /> },
            { id: 'planner', label: t('dashboard.planner') || 'AI Planner', icon: <Sparkles size={18} /> },
            { id: 'assistant', label: t('dashboard.messages') || 'Messages', icon: <MessageSquare size={18} /> },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? colors.accentBg : 'transparent',
                  color: isActive ? colors.accent : colors.textSecondary,
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9';
                    e.currentTarget.style.color = colors.textPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colors.textSecondary;
                  }
                }}
              >
                {/* Obvious Selected Pill Indicator Bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '8px',
                    bottom: '8px',
                    width: '3.5px',
                    borderRadius: '0 4px 4px 0',
                    background: colors.accent
                  }} />
                )}
                <span style={{ color: isActive ? colors.accent : 'inherit', display: 'flex' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== MY DESTINATIONS SECTION ==================== */}
        <div style={{ marginTop: '24px', flex: 1 }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.8px',
            color: colors.textMuted,
            textTransform: 'uppercase',
            padding: '0 12px 10px 12px'
          }}>
            {t('dashboard.myDestinations') || 'MY DESTINATIONS'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {MY_DESTINATIONS_LIST.map((dest) => {
              const isSelected = selectedCountryId === dest.id && activeTab === 'home';
              const localizedName = t(`country.countries.${dest.id}`) !== `country.countries.${dest.id}`
                ? t(`country.countries.${dest.id}`)
                : dest.name;
              return (
                <button
                  key={dest.id}
                  id={`sidebar-dest-${dest.id}`}
                  onClick={() => handleSelectCountry(dest.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: isSelected ? `1px solid ${colors.accent}` : '1px solid transparent',
                    background: isSelected ? colors.accentBg : 'transparent',
                    color: isSelected ? colors.accent : colors.textSecondary,
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9';
                      e.currentTarget.style.color = colors.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = colors.textSecondary;
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>{dest.flag}</span>
                    <span>{localizedName}</span>
                  </div>
                  {isSelected && (
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      background: colors.accent 
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== BOTTOM ACTIONS ==================== */}
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Settings */}
          <button
            id="sidebar-btn-settings"
            onClick={() => handleTabChange('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'settings' ? colors.accentBg : 'transparent',
              color: activeTab === 'settings' ? colors.accent : colors.textSecondary,
              fontSize: '0.84rem',
              fontWeight: activeTab === 'settings' ? 700 : 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = activeTab === 'settings' ? colors.accent : colors.textSecondary)}
          >
            <SettingsIcon size={16} />
            <span>{t('dashboard.settings') || 'Settings'}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              id="sidebar-btn-language"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: colors.textSecondary,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Languages size={16} />
                <span>{t('dashboard.language') || 'Language'}</span>
              </div>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                color: colors.accent,
                background: colors.accentBg,
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {language}
              </span>
            </button>

            {isLangDropdownOpen && (
              <div style={{
                position: 'absolute',
                bottom: '38px',
                left: 0,
                right: 0,
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 300,
                boxShadow: colors.shadow
              }}>
                {[
                  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
                  { code: 'uz', label: 'Oʻzbekcha', flag: '🇺🇿' },
                  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as Language);
                      setIsLangDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: language === l.code ? colors.accentBg : 'transparent',
                      color: language === l.code ? colors.accent : colors.textPrimary,
                      fontSize: '0.78rem',
                      fontWeight: language === l.code ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{l.flag} {l.label}</span>
                    {language === l.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector Dropdown */}
          <div ref={currRef} style={{ position: 'relative' }}>
            <button
              id="sidebar-btn-currency"
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: colors.textSecondary,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DollarSign size={16} />
                <span>{t('dashboard.currency') || 'Currency'}</span>
              </div>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                color: colors.accent,
                background: colors.accentBg,
                padding: '2px 6px',
                borderRadius: '4px' 
              }}>
                {currency}
              </span>
            </button>

            {isCurrencyDropdownOpen && (
              <div style={{
                position: 'absolute',
                bottom: '38px',
                left: 0,
                right: 0,
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 300,
                boxShadow: colors.shadow
              }}>
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: currency === c.code ? colors.accentBg : 'transparent',
                      color: currency === c.code ? colors.accent : colors.textPrimary,
                      fontSize: '0.78rem',
                      fontWeight: currency === c.code ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{c.symbol} {c.code} ({c.name})</span>
                    {currency === c.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="sidebar-btn-theme"
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: colors.textSecondary,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isDark ? <Sun size={16} style={{ color: '#F59E0B' }} /> : <Moon size={16} />}
              <span>{t('dashboard.theme') || 'Theme'}</span>
            </div>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              color: colors.textPrimary,
              background: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'capitalize'
            }}>
              {theme}
            </span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* ==================== MAIN APPLICATION CONTAINER ============= */}
      {/* ============================================================ */}
      <div 
        className="dashboard-main-container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: colors.bgPage
        }}
      >

        {/* ==================== TOP BAR ==================== */}
        <header 
          id="top-bar"
          className="dashboard-header-responsive"
          style={{
            minHeight: '64px',
            background: colors.bgSidebar,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.02)',
            gap: '12px'
          }}
        >
          {/* Mobile Brand Logo Mark */}
          <div 
            className="mobile-only"
            onClick={() => handleTabChange('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
            }}>
              <Compass size={18} />
            </div>
            <span style={{
              fontSize: '1rem',
              fontWeight: 900,
              fontFamily: "'Outfit', sans-serif",
              color: colors.textPrimary,
              letterSpacing: '0.4px'
            }}>
              TripMind
            </span>
          </div>

          {/* UPGRADED GLOBAL SEARCH SYSTEM */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
            <GlobalSearch
              variant="header"
              placeholder="Search countries, cities, landmarks (e.g. Dubai, France, Burj Khalifa)..."
              onSelectDestination={(item, dest) => {
                handleSelectCountry(item.countryId || dest.id);
              }}
            />
          </div>

          {/* TOP RIGHT CONTROLS: Notification, Profile, Language, Theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* 1. Language Button */}
            <button
              id="topbar-btn-language"
              onClick={() => {
                const nextLang: Language = language === 'en' ? 'uz' : language === 'uz' ? 'ru' : 'en';
                setLanguage(nextLang);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '100px',
                border: `1px solid ${colors.border}`,
                background: colors.bgSubtle,
                color: colors.textPrimary,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
              title="Change Language"
            >
              <Languages size={15} style={{ color: colors.accent }} />
              <span>{language}</span>
            </button>

            {/* 2. Theme Toggle Button */}
            <button
              id="topbar-btn-theme"
              onClick={toggleTheme}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `1px solid ${colors.border}`,
                background: colors.bgSubtle,
                color: colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Toggle Theme"
            >
              {isDark ? <Sun size={17} style={{ color: '#F59E0B' }} /> : <Moon size={17} />}
            </button>

            {/* 3. Notification Button with Dropdown */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                id="topbar-btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.border}`,
                  background: colors.bgSubtle,
                  color: colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                title="Notifications"
              >
                <Bell size={17} />
                <span style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: colors.accent,
                  color: '#FFFFFF',
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  2
                </span>
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '280px',
                  background: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: colors.shadow,
                  zIndex: 200
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '0.88rem', color: colors.textPrimary }}>Notifications</strong>
                    <span style={{ fontSize: '0.7rem', color: colors.accent, fontWeight: 700, cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        style={{
                          padding: '8px 10px',
                          background: colors.bgSubtle,
                          borderRadius: '8px',
                          borderLeft: n.unread ? `3px solid ${colors.accent}` : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors.textPrimary }}>{n.title}</span>
                          <span style={{ fontSize: '0.65rem', color: colors.textMuted }}>{n.time}</span>
                        </div>
                        <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: colors.textSecondary, lineHeight: 1.3 }}>
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Profile Avatar & Name */}
            <div
              id="topbar-btn-profile"
              onClick={() => handleTabChange('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderLeft: `1px solid ${colors.border}`,
                paddingLeft: '14px',
                cursor: 'pointer'
              }}
              title="View Profile"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={user?.name || 'Traveler'}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.accent}` }}
              />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: colors.textPrimary }}>
                {user?.name || 'Traveler'}
              </span>
            </div>

          </div>
        </header>

        {/* ============================================================ */}
        {/* ==================== MAIN CONTENT AREA ===================== */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* ==================== MAIN CONTENT AREA ===================== */}
        {/* ============================================================ */}
        <main className="dashboard-content-responsive" style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', paddingBottom: '90px' }}>
          
          {/* ==================== TAB 1: EXPLORE / HOME DASHBOARD ==================== */}
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
              
              {/* 1. HEADING & SUBTITLE */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 900,
                    color: colors.textPrimary,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.3px',
                    lineHeight: 1.15
                  }}>
                    {t('dashboard.exploreWorld') || 'Explore the world'}
                  </h1>
                  <p style={{
                    margin: '6px 0 0 0',
                    fontSize: 'clamp(0.82rem, 1.5vw, 0.92rem)',
                    color: colors.textSecondary,
                    lineHeight: 1.4
                  }}>
                    {t('dashboard.exploreWorldSubtitle') || 'Discover countries, plan trips and get personalized AI recommendations.'}
                  </p>
                </div>

                {/* AI Trip Planner Quick Pill */}
                <button
                  id="header-ai-plan-btn"
                  onClick={() => handleStartPlanningFor(activeCountry.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
                    transition: 'transform 0.15s ease',
                    minHeight: '44px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Sparkles size={16} />
                  <span>{t('dashboard.planWithAi') || 'Plan with AI'}</span>
                </button>
              </div>

              {/* 2. REGION FILTERS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {REGION_FILTERS.map((region) => {
                  const isActive = selectedRegion === region;
                  const continentKey = region === 'All' ? 'all' : region === 'North America' ? 'northAmerica' : region === 'South America' ? 'southAmerica' : region.toLowerCase();
                  const localizedRegion = t(`destExplorer.continents.${continentKey}`) !== `destExplorer.continents.${continentKey}`
                    ? t(`destExplorer.continents.${continentKey}`)
                    : region;

                  return (
                    <button
                      key={region}
                      id={`region-filter-${region.toLowerCase().replace(' ', '-')}`}
                      onClick={() => setSelectedRegion(region)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '100px',
                        border: isActive ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                        background: isActive ? colors.accent : colors.bgCard,
                        color: isActive ? '#FFFFFF' : colors.textSecondary,
                        fontSize: '0.84rem',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        minHeight: '40px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = colors.borderHover;
                          e.currentTarget.style.color = colors.textPrimary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = colors.border;
                          e.currentTarget.style.color = colors.textSecondary;
                        }
                      }}
                    >
                      {localizedRegion}
                    </button>
                  );
                })}
              </div>

              {/* 3. INTERACTIVE 3D GLOBE OVERVIEW */}
              <div style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '20px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: colors.shadow
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  padding: '0 8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: colors.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.accent }}>
                      <Globe size={16} />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: colors.textPrimary, fontFamily: "'Outfit', sans-serif" }}>
                      {t('dashboard.interactiveHub') || 'Interactive 3D Earth Hub'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: colors.textSecondary, background: colors.bgSubtle, padding: '4px 10px', borderRadius: '100px', border: `1px solid ${colors.border}` }}>
                    {t('dashboard.tapPins') || 'Tap pins to explore'}
                  </span>
                </div>

                <div style={{ height: '320px', width: '100%', position: 'relative', borderRadius: '14px', overflow: 'hidden' }}>
                  <Globe3D 
                    selectedCountryId={selectedCountryId}
                    onSelectCountry={(countryId) => {
                      if (countryId) {
                        setSelectedCountryId(countryId);
                      }
                    }}
                  />
                </div>
              </div>

              {/* 4. LARGE COUNTRY OVERVIEW & AI COPILOT GRID */}
              <div className="country-overview-grid">

                {/* ==================== LARGE COUNTRY OVERVIEW PANEL ==================== */}
                <div 
                  id="country-overview-panel"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: colors.shadow,
                    position: 'relative'
                  }}
                >
                  {/* Hero Image Banner with Gradient & Badges */}
                  <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={activeCountry.heroImage} 
                      alt={activeCountry.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(7, 17, 31, 0.88) 100%)'
                    }} />

                    {/* Top Overlay Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>{activeCountry.flag}</span>
                        <span>{activeCountry.region}</span>
                      </div>

                      <button
                        id="country-panel-save-top-btn"
                        onClick={() => handleToggleSaveCountry(activeCountry.id, activeCountry.name)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isCurrentCountrySaved ? '#EF4444' : 'rgba(0,0,0,0.5)',
                          backdropFilter: 'blur(8px)',
                          border: 'none',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title={isCurrentCountrySaved ? 'Saved in vault' : 'Save destination'}
                      >
                        <Heart size={18} fill={isCurrentCountrySaved ? '#FFFFFF' : 'none'} />
                      </button>
                    </div>

                    {/* Bottom Header inside Cover */}
                    <div style={{
                      position: 'absolute',
                      bottom: '14px',
                      left: '18px',
                      right: '18px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h2 style={{
                          margin: 0,
                          fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          fontFamily: "'Outfit', sans-serif",
                          lineHeight: 1.1,
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                        }}>
                          {activeCountry.name}
                        </h2>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#60A5FA',
                          background: 'rgba(59, 130, 246, 0.25)',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {activeCountry.countryCode}
                        </span>
                      </div>
                      <p style={{
                        margin: '6px 0 0 0',
                        fontSize: 'clamp(0.78rem, 1.5vw, 0.86rem)',
                        color: 'rgba(255, 255, 255, 0.92)',
                        fontWeight: 500,
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                        lineHeight: 1.35
                      }}>
                        {activeCountry.description}
                      </p>
                    </div>
                  </div>

                  {/* 8 Information Metrics Grid (Responsive Stacked on mobile) */}
                  <div style={{ padding: '18px' }}>
                    <div className="country-metrics-grid" style={{ marginBottom: '18px' }}>
                      {[
                        { label: t('country.capital') || 'Capital', value: activeCountry.capital, icon: <MapPin size={14} /> },
                        { label: t('country.population') || 'Population', value: activeCountry.population, icon: <Users size={14} /> },
                        { label: t('country.language') || 'Language', value: Array.isArray(activeCountry.languages) ? activeCountry.languages.join(', ') : activeCountry.languages, icon: <Languages size={14} /> },
                        { label: t('country.currency') || 'Currency', value: activeCountry.currency.formatted || `${activeCountry.currency.code} (${activeCountry.currency.symbol})`, icon: <DollarSign size={14} /> },
                        { label: t('country.timezone') || 'Timezone', value: activeCountry.timezone, icon: <Clock size={14} /> },
                        { label: t('country.weather') || 'Weather', value: `${activeCountry.weather.tempC}°C, ${activeCountry.weather.condition}`, icon: <CloudSun size={14} /> },
                        { label: t('country.bestTime') || 'Best time', value: activeCountry.bestTime, icon: <Calendar size={14} /> },
                        { label: t('country.avgBudget') || 'Avg budget', value: activeCountry.averageBudget.formatted || `${formatPrice(activeCountry.averageBudget.perDayUSD)}/d`, icon: <DollarSign size={14} /> },
                      ].map((info, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: colors.bgSubtle,
                            borderRadius: '12px',
                            padding: '9px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: colors.textMuted }}>
                            <span style={{ color: colors.accent }}>{info.icon}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                              {info.label}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: colors.textPrimary,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {info.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Verified Destinations in Active Country (Swipeable Carousel on mobile) */}
                    {activeCountry.destinations && activeCountry.destinations.length > 0 && (
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {t('country.destinationsIn') || 'Destinations in'} {activeCountry.name} ({activeCountry.destinations.length})
                          </span>
                          <span style={{ fontSize: '0.72rem', color: colors.accent, fontWeight: 700 }}>
                            {t('country.swipeToExplore') || 'Swipe to explore'}
                          </span>
                        </div>

                        <div className="mobile-swipe-carousel">
                          {activeCountry.destinations.map((dest) => (
                            <div
                              key={dest.id || dest.name}
                              onClick={() => handleStartPlanningFor(`${dest.name}, ${activeCountry.name}`)}
                              style={{
                                minWidth: '180px',
                                maxWidth: '220px',
                                flex: '0 0 auto',
                                background: colors.bgSubtle,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                scrollSnapAlign: 'start',
                                transition: 'transform 0.15s ease, border-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = colors.accent;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = colors.border;
                              }}
                            >
                              <div style={{ position: 'relative', height: '100px', width: '100%' }}>
                                <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'linear-gradient(180deg, transparent 30%, rgba(7, 17, 31, 0.85) 100%)'
                                }} />
                                <div style={{
                                  position: 'absolute',
                                  top: '6px',
                                  right: '6px',
                                  background: 'rgba(0,0,0,0.6)',
                                  borderRadius: '6px',
                                  padding: '2px 6px',
                                  fontSize: '0.65rem',
                                  color: '#F59E0B',
                                  fontWeight: 800
                                }}>
                                  ★ {dest.rating}
                                </div>
                                <div style={{
                                  position: 'absolute',
                                  bottom: '6px',
                                  left: '8px',
                                  right: '8px'
                                }}>
                                  <strong style={{ fontSize: '0.82rem', color: '#FFFFFF', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {dest.name}
                                  </strong>
                                </div>
                              </div>
                              <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.68rem', color: colors.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {dest.category}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800 }}>
                                  ${dest.estimatedCost.perDayUSD}/d
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons: Explore, Plan a trip, Save */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      paddingTop: '14px',
                      borderTop: `1px solid ${colors.border}`,
                      flexWrap: 'wrap'
                    }}>
                      {/* Explore Button */}
                      <button
                        id="country-panel-explore-btn"
                        onClick={() => handleTabChange('explore')}
                        style={{
                          flex: '1 1 120px',
                          padding: '11px 16px',
                          borderRadius: '10px',
                          background: colors.bgSubtle,
                          border: `1px solid ${colors.border}`,
                          color: colors.textPrimary,
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          minHeight: '44px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Compass size={16} />
                        <span>{t('country.explore') || 'Explore'}</span>
                      </button>

                      {/* Plan a trip Button */}
                      <button
                        id="country-panel-plan-btn"
                        onClick={() => handleStartPlanningFor(activeCountry.name)}
                        style={{
                          flex: '2 1 160px',
                          padding: '11px 16px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          minHeight: '44px',
                          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Sparkles size={16} />
                        <span>{t('country.planTrip') || 'Plan a trip'}</span>
                      </button>

                      {/* Save Button */}
                      <button
                        id="country-panel-save-btn"
                        onClick={() => handleToggleSaveCountry(activeCountry.id, activeCountry.name)}
                        style={{
                          flex: '1 1 90px',
                          padding: '11px 16px',
                          borderRadius: '10px',
                          background: isCurrentCountrySaved ? 'rgba(239, 68, 68, 0.15)' : colors.bgSubtle,
                          border: isCurrentCountrySaved ? '1px solid #EF4444' : `1px solid ${colors.border}`,
                          color: isCurrentCountrySaved ? '#EF4444' : colors.textSecondary,
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          minHeight: '44px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Heart size={16} fill={isCurrentCountrySaved ? '#EF4444' : 'none'} />
                        <span>{isCurrentCountrySaved ? (t('country.saved') || 'Saved') : (t('country.save') || 'Save')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ==================== AI COPILOT CARD ==================== */}
                <div 
                  id="ai-copilot-card"
                  style={{
                    background: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: colors.shadow,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Badge & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: colors.accentBg,
                        color: colors.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.98rem', color: colors.textPrimary, display: 'block' }}>
                          {t('dashboard.aiPlanner') || 'AI Trip Planner'}
                        </strong>
                        <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                          {t('dashboard.instantGenerator') || 'Instant Itinerary Generator'}
                        </span>
                      </div>
                    </div>

                    <p style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      color: colors.textSecondary,
                      lineHeight: 1.45
                    }}>
                      {t('dashboard.aiPlannerPrompt') || 'Tell me where you want to go, your dates, budget and travel style.'}
                    </p>

                    {/* Mini Quick Prompts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        `3 days in ${activeCountry.capital}`,
                        `Budget trip to ${activeCountry.name}`,
                        'Luxury weekend gateway'
                      ].map((promptText, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleStartPlanningFor(activeCountry.name)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: colors.bgSubtle,
                            border: `1px solid ${colors.border}`,
                            fontSize: '0.78rem',
                            color: colors.textSecondary,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: '40px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{promptText}</span>
                          <ArrowRight size={12} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI CTA Button */}
                  <div style={{ marginTop: '16px' }}>
                    <button
                      id="ai-copilot-plan-btn"
                      onClick={() => handleStartPlanningFor(activeCountry.name)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: colors.accent,
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        minHeight: '46px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Sparkles size={16} />
                      <span>{t('dashboard.planWithAi') || 'Plan with AI'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* 5. POPULAR DESTINATIONS (Horizontal Carousel on Mobile) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      color: colors.textPrimary,
                      fontFamily: "'Outfit', sans-serif"
                    }}>
                      Popular Destinations
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: colors.textSecondary }}>
                      Top-rated travel spots curated by global explorers
                    </span>
                  </div>

                  <button
                    id="popular-dest-view-all"
                    onClick={() => handleTabChange('explore')}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: colors.accent,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px'
                    }}
                  >
                    <span>View all</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* 6 Popular Cards: Swipe Carousel */}
                <div className="mobile-swipe-carousel">
                  {filteredPopularDestinations.map((dest) => {
                    const isSelected = selectedCountryId === dest.countryId;
                    return (
                      <div
                        key={dest.id}
                        id={`card-${dest.id}`}
                        onClick={() => handleSelectCountry(dest.countryId)}
                        style={{
                          minWidth: '190px',
                          maxWidth: '240px',
                          flex: '0 0 auto',
                          background: colors.bgCard,
                          border: isSelected ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: colors.shadow,
                          scrollSnapAlign: 'start',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                      >
                        {/* Image */}
                        <div style={{ position: 'relative', height: '120px', width: '100%', overflow: 'hidden' }}>
                          <img
                            src={dest.image}
                            alt={dest.city}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(4px)',
                            padding: '2px 6px',
                            borderRadius: '100px',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <Star size={10} fill="#F59E0B" stroke="none" />
                            <span>{dest.rating}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '0.88rem', color: colors.textPrimary }}>{dest.city}</strong>
                            <span style={{ fontSize: '0.88rem' }}>{dest.flag}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: colors.textSecondary }}>{dest.country}</span>
                          <div style={{
                            marginTop: '6px',
                            paddingTop: '6px',
                            borderTop: `1px solid ${colors.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.68rem', color: colors.textMuted }}>From</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: colors.accent }}>
                              {formatPrice(dest.priceStartUSD)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. BOTTOM STATS */}
              <div 
                id="bottom-stats-grid"
                className="bottom-stats-grid"
              >
                {[
                  { label: 'Countries explored', value: '14', icon: <Globe size={18} />, color: '#3B82F6' },
                  { label: 'Cities viewed', value: '42', icon: <MapPin size={18} />, color: '#60A5FA' },
                  { label: 'Saved destinations', value: String(savedCountries.length), icon: <Heart size={18} />, color: '#EF4444' },
                  { label: 'Trips planned', value: '3', icon: <Sparkles size={18} />, color: '#10B981' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    id={`stat-card-${idx}`}
                    style={{
                      background: colors.bgCard,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: colors.shadow
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.74rem', color: colors.textSecondary, display: 'block', fontWeight: 500 }}>
                        {stat.label}
                      </span>
                      <strong style={{
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: colors.textPrimary,
                        fontFamily: "'Outfit', sans-serif"
                      }}>
                        {stat.value}
                      </strong>
                    </div>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: colors.bgSubtle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color
                    }}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================== TAB 2: EXPLORE VIEW ==================== */}
          {activeTab === 'explore' && (
            <ExploreView onPlanTrip={handleStartPlanningFor} />
          )}

          {/* ==================== TAB 3: AI PLANNER WIZARD ==================== */}
          {activeTab === 'planner' && (
            <AiPlannerWizard 
              initialDestination={plannerDestination}
              onTripGenerated={(newTrip) => {
                setSelectedTripId(newTrip.id);
                handleTabChange('trip-details');
              }}
            />
          )}

          {/* ==================== TAB 4: MY TRIPS ==================== */}
          {activeTab === 'my-trips' && (
            <MyTripsView 
              onViewTrip={(id) => {
                setSelectedTripId(id);
                handleTabChange('trip-details');
              }}
            />
          )}

          {/* ==================== TAB 5: SAVED DESTINATIONS ==================== */}
          {activeTab === 'saved' && <SavedView />}

          {/* ==================== TAB 6: MESSAGES / ASSISTANT ==================== */}
          {activeTab === 'assistant' && <AIAssistantView />}

          {/* ==================== TAB 7: PROFILE ==================== */}
          {activeTab === 'profile' && <ProfileView />}

          {/* ==================== TAB 8: SETTINGS ==================== */}
          {activeTab === 'settings' && <SettingsView />}

          {/* ==================== TAB 9: TOURS MARKETPLACE ==================== */}
          {(activeTab === 'tours' || activeTab === 'ready-trips') && <ToursMarketplaceView />}

          {/* ==================== TAB 10: TRIP DETAILS ==================== */}
          {activeTab === 'trip-details' && selectedTripId && (
            <TripDetailsView 
              tripId={selectedTripId}
              onBack={() => handleTabChange('my-trips')}
            />
          )}

          {/* ==================== ADMIN & OPERATIONS ==================== */}
          {activeTab === 'admin' && <AdminView />}
          {activeTab === 'crm' && <CrmPipelineView />}
          {activeTab === 'analytics' && <AgencyAnalyticsView />}
          {activeTab === 'telegram' && <TelegramSettingsView />}

        </main>

        {/* ==================== FIXED MOBILE BOTTOM NAVIGATION ==================== */}
        <nav id="mobile-bottom-navigation" className="tm-bottom-nav">
          <button
            id="mobile-nav-explore"
            className={`tm-bottom-nav-item ${(activeTab === 'home' || activeTab === 'explore') ? 'active' : ''}`}
            onClick={() => handleTabChange('home')}
            aria-label="Explore"
          >
            <Compass size={20} />
            <span>Explore</span>
          </button>

          <button
            id="mobile-nav-trips"
            className={`tm-bottom-nav-item ${(activeTab === 'my-trips' || activeTab === 'trip-details' || activeTab === 'ready-trips') ? 'active' : ''}`}
            onClick={() => handleTabChange('my-trips')}
            aria-label="Trips"
          >
            <Plane size={20} />
            <span>Trips</span>
          </button>

          <button
            id="mobile-nav-saved"
            className={`tm-bottom-nav-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => handleTabChange('saved')}
            aria-label="Saved"
          >
            <Heart size={20} />
            <span>Saved</span>
          </button>

          <button
            id="mobile-nav-ai"
            className={`tm-bottom-nav-item ${(activeTab === 'planner' || activeTab === 'assistant') ? 'active' : ''}`}
            onClick={() => handleTabChange('planner')}
            aria-label="AI Planner"
          >
            <Sparkles size={20} />
            <span>AI</span>
          </button>

          <button
            id="mobile-nav-profile"
            className={`tm-bottom-nav-item ${(activeTab === 'profile' || activeTab === 'settings') ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
            aria-label="Profile"
          >
            <User size={20} />
            <span>Profile</span>
          </button>
        </nav>
      </div>

    </div>
  );
};

export default Dashboard;
