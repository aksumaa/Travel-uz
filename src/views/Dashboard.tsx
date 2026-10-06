import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { Globe3D } from '../components/Globe3D';
import { CountryInfoPanel } from '../components/CountryInfoPanel';
import { 
  MyTripsView, FlightsView, HotelsView, AttractionsView, 
  SavedView, AIAssistantView, ProfileView, SettingsView 
} from './DashboardViews';
import { AiPlannerWizard } from '../components/AiPlannerWizard';
import { ExploreView } from './ExploreView';
import { ToursMarketplaceView } from './ToursMarketplaceView';
import { TripDetailsView } from './TripDetailsView';
import { AdminView } from './AdminView';
import { 
  Compass, Sparkles, Calendar, Map, Star, Heart, 
  Search, Sun, Moon, Bell, X, Globe,
  ChevronDown, Users, 
  ArrowRight, MapPin, Settings as SettingsIcon,
  ChevronRight, MessageSquare, Shield, TrendingUp, Building2
} from '../icons';
import { CrmPipelineView } from '../components/CrmPipelineView';
import { AgencyAnalyticsView } from '../components/AgencyAnalyticsView';
import { TelegramSettingsView } from '../components/TelegramSettingsView';
import { AgencyOnboardingModal } from '../components/AgencyOnboardingModal';
import { api } from '../services/api';
import { 
  resolveDestination, 
  generateDestinationForCountry,
  getDestinationSuggestions,
  type DestinationItem
} from '../services/destinationCatalog';

interface DashboardProps {
  initialView?: string;
  onViewChange?: (view: string) => void;
  variant?: 'user' | 'admin';
}

export const Dashboard: React.FC<DashboardProps> = ({ initialView = 'home', onViewChange, variant = 'user' }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies, formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<string>(variant === 'admin' ? (initialView === 'home' ? 'admin' : initialView) : initialView);

  useEffect(() => {
    if (initialView && initialView !== 'home') {
      setActiveTab(initialView);
    }
  }, [initialView]);

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [plannerDestination, setPlannerDestination] = useState<string>('France');
  const [selectedCountryId, setSelectedCountryId] = useState('france');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search input and suggestions
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [headerSuggestions, setHeaderSuggestions] = useState<DestinationItem[]>([]);
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const headerSearchRef = useRef<HTMLDivElement>(null);

  // Recent Searches List
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'France', 'Japan', 'Niger', 'Istanbul', 'Samarkand', 'Dubai'
  ]);

  // Floating Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hello! I am your TripMind AI Copilot. Where in the world would you like to travel next?' }
  ]);
  const [sending, setSending] = useState(false);

  const currRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (headerSearchRef.current && !headerSearchRef.current.contains(event.target as Node)) {
        setIsHeaderSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync suggestions when header search query changes
  useEffect(() => {
    if (!headerSearchQuery.trim()) {
      setHeaderSuggestions([]);
      return;
    }
    const results = getDestinationSuggestions(headerSearchQuery, 5);
    setHeaderSuggestions(results);
  }, [headerSearchQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onViewChange) {
      onViewChange(tab);
    }
  };

  const handleStartPlanningFor = (dest: string) => {
    setPlannerDestination(dest);
    handleTabChange('planner');
  };

  const handleSelectCountry = (countryKey: string) => {
    const clean = countryKey.toLowerCase().trim();
    setSelectedCountryId(clean);
    
    // Add to recent searches if not already present
    const capitalized = countryKey.charAt(0).toUpperCase() + countryKey.slice(1);
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== clean);
      return [capitalized, ...filtered].slice(0, 6);
    });
  };

  // Mapped object representing current selected country for detail panel
  const resolvedDest = resolveDestination(selectedCountryId, selectedFeature?.properties);
  const selectedCountryObj = resolvedDest || selectedFeature || generateDestinationForCountry(selectedCountryId || 'france');

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
  }

  const userNav: NavItem[] = [
    { id: 'home', label: 'Explore', icon: <Compass size={18} /> },
    { id: 'explore', label: 'Discover', icon: <Map size={18} /> },
    { id: 'my-trips', label: 'My Trips', icon: <Calendar size={18} /> },
    { id: 'saved', label: 'Saved', icon: <Heart size={18} /> },
  ];

  const adminNav: NavItem[] = [
    { id: 'admin', label: 'Admin', icon: <Shield size={18} /> },
    { id: 'crm', label: 'CRM', icon: <Users size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
    { id: 'telegram', label: 'Telegram', icon: <MessageSquare size={18} /> },
    { id: 'home', label: 'Traveler', icon: <Compass size={18} /> },
  ];

  const navItems: NavItem[] = variant === 'admin' ? adminNav : userNav;

  const [showOnboardModal, setShowOnboardModal] = useState(false);

  const handleFloatingChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sending) return;

    const userText = chatInput;
    setChatInput('');
    setSending(true);

    const updated = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(updated);

    try {
      const data = await api.post<any>('/trips/generate', {
        destination: userText,
        days: 3,
        budget: 900
      });
      const itin = data.itinerary || data.raw_trip_data;
      const botText = itin?.summary || `I have mapped out verified highlights for ${userText}! Total budget estimate: ${formatPrice(itin?.totalCost || 900)}.`;
      setChatMessages([...updated, { sender: 'assistant', text: botText }]);
    } catch {
      await new Promise(resolve => setTimeout(resolve, 600));
      let reply = `TripMind Copilot is tracking weather, visa rules, and heritage spots for "${userText}". Tap 'AI Planner' to generate a full customized day-by-day plan!`;
      const textLower = userText.toLowerCase();
      if (textLower.includes('weather') || textLower.includes('time')) {
        reply = 'Spring and Autumn are ideal seasons across most destinations (18-24°C).';
      } else if (textLower.includes('france') || textLower.includes('paris')) {
        reply = 'France offers 90-day visa-free entry for EU, US, UK, and GCC citizens. Best highlights: Eiffel Tower, Louvre, and Provence.';
      } else if (textLower.includes('niger')) {
        reply = 'Niger features the UNESCO World Heritage Agadez Grand Mosque and rich Sahelian cultural heritage.';
      }
      setChatMessages([...updated, { sender: 'assistant', text: reply }]);
    } finally {
      setSending(false);
    }
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) return;
    const resolved = resolveDestination(headerSearchQuery);
    if (resolved) {
      handleSelectCountry(resolved.id);
      setHeaderSearchQuery('');
      setIsHeaderSearchFocused(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07111F', color: '#F8FAFC', position: 'relative' }}>
      
      {/* Agency Onboarding Modal */}
      <AgencyOnboardingModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={() => alert('Agency onboarded successfully!')}
      />

      {/* ==================== COMPACT LEFT SIDEBAR (78px) ==================== */}
      <aside style={{
        width: '78px',
        background: '#0B1728',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        padding: '20px 0',
        gap: '20px'
      }}>
        {/* Brand Logo / Mark */}
        <div 
          onClick={() => handleTabChange('home')}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
          }}
          title="TripMind Home"
        >
          <Compass size={22} />
        </div>

        {variant === 'admin' && (
          <button
            onClick={() => setShowOnboardModal(true)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3B82F6',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Onboard Agency"
          >
            <Building2 size={18} />
          </button>
        )}

        {/* Main Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, width: '100%' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                style={{
                  width: '54px',
                  height: '52px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: isActive ? '#3B82F6' : '#94A3B8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
                title={item.label}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: '2px',
                    top: '12px',
                    bottom: '12px',
                    width: '3px',
                    borderRadius: '4px',
                    background: '#3B82F6'
                  }} />
                )}
                <span>{item.icon}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2px' }}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ width: '36px', height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '8px 0' }} />

          {/* Settings Nav Item */}
          <button
            onClick={() => handleTabChange('settings')}
            style={{
              width: '54px',
              height: '52px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'settings' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeTab === 'settings' ? '#3B82F6' : '#94A3B8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Settings"
          >
            <SettingsIcon size={18} />
            <span style={{ fontSize: '0.62rem', fontWeight: 700 }}>Settings</span>
          </button>
        </div>

        {/* Profile Avatar at Bottom */}
        <div 
          onClick={() => handleTabChange('profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '4px'
          }}
          title="User Profile"
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: activeTab === 'profile' ? '2px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'} 
              alt={user?.name || 'User'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div style={{ flex: 1, marginLeft: '78px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* TOP HEADER */}
        <header style={{
          height: '72px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#07111F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Left: Heading & Subtitle */}
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#F8FAFC',
              fontFamily: "'Outfit', sans-serif",
              lineHeight: 1.15
            }}>
              Explore the world
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Discover destinations, places and experiences.
            </span>
          </div>

          {/* Center / Large: Search Input */}
          <div ref={headerSearchRef} style={{ position: 'relative', width: '420px', maxWidth: '40vw' }}>
            <form
              onSubmit={handleHeaderSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#101E32',
                border: isHeaderSearchFocused ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '100px',
                padding: '7px 16px',
                transition: 'border 0.2s ease'
              }}
            >
              <Search size={16} style={{ color: isHeaderSearchFocused ? '#60A5FA' : '#94A3B8', marginRight: '10px', flexShrink: 0 }} />
              <input 
                type="text" 
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                onFocus={() => setIsHeaderSearchFocused(true)}
                placeholder="Search countries, cities or destinations..." 
                style={{
                  width: '100%',
                  fontSize: '0.82rem',
                  color: '#F8FAFC',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none'
                }} 
              />
              {headerSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHeaderSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', display: 'flex' }}
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {isHeaderSearchFocused && headerSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    position: 'absolute',
                    top: '46px',
                    left: 0,
                    right: 0,
                    background: '#101E32',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    padding: '6px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  {headerSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleSelectCountry(item.id);
                        setHeaderSearchQuery('');
                        setIsHeaderSearchFocused(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#F8FAFC',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{item.flag}</span>
                        <div>
                          <strong style={{ fontSize: '0.82rem', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{item.country}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#60A5FA', fontWeight: 700 }}>
                        Select
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Currency, Language, Notifications, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Currency Selector */}
            <div ref={currRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#60A5FA',
                  background: '#101E32',
                  padding: '5px 10px',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
              >
                <span>{currency}</span>
                <ChevronDown size={11} />
              </button>
              {isCurrencyDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '34px',
                  right: 0,
                  background: '#101E32',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  zIndex: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  minWidth: '120px'
                }}>
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setIsCurrencyDropdownOpen(false); }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        border: 'none',
                        background: currency === c.code ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: currency === c.code ? '#60A5FA' : '#94A3B8',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 700
                      }}
                    >
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#101E32',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} style={{ color: '#F59E0B' }} /> : <Moon size={15} />}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: '#101E32',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <Bell size={15} />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#3B82F6',
                  color: '#FFFFFF',
                  fontSize: '0.55rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>2</span>
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '260px',
                  background: '#101E32',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                  zIndex: 200,
                  textAlign: 'left'
                }}>
                  <strong style={{ fontSize: '0.8rem', color: '#F8FAFC', display: 'block', marginBottom: '6px' }}>
                    Notifications
                  </strong>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ padding: '6px 8px', background: 'rgba(59,130,246,0.1)', borderRadius: '6px', color: '#F8FAFC' }}>
                      ✨ AI Itinerary generated for Paris.
                    </div>
                    <div style={{ padding: '6px 8px', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', color: '#F8FAFC' }}>
                      🌍 4 new destinations added to catalog.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Mini */}
            <div 
              onClick={() => handleTabChange('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                paddingLeft: '12px',
                cursor: 'pointer'
              }}
            >
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'} 
                alt={user?.name} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>
                {user?.name || 'Traveler'}
              </span>
            </div>

          </div>
        </header>

        {/* VIEW CONTENT */}
        <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
          
          {/* ==================== HOME TAB ==================== */}
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* MAIN HERO EXPLORATION AREA: 3-Column Layout with Center 3D Globe */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '260px 1.4fr 340px',
                gap: '20px',
                alignItems: 'stretch'
              }} className="explore-main-grid">
                
                {/* 1. LEFT CONTEXTUAL PANEL */}
                <div style={{
                  background: '#101E32',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}>
                  <div>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#3B82F6',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px'
                    }}>
                      Interactive Orbit
                    </span>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#F8FAFC',
                      fontFamily: "'Outfit', sans-serif",
                      lineHeight: 1.2
                    }}>
                      Explore the world
                    </h2>
                    <p style={{
                      margin: '6px 0 0 0',
                      fontSize: '0.78rem',
                      color: '#94A3B8',
                      lineHeight: 1.5
                    }}>
                      Select any country on the 3D globe to discover destinations, telemetry, and live facts.
                    </p>
                  </div>

                  {/* Recent Searches Tags */}
                  <div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Recent searches
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {recentSearches.map((item, idx) => {
                        const isCurrent = selectedCountryId.toLowerCase() === item.toLowerCase();
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectCountry(item)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: isCurrent ? 'rgba(59, 130, 246, 0.2)' : '#0B1728',
                              border: isCurrent ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: isCurrent ? '#60A5FA' : '#F8FAFC',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isCurrent) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isCurrent) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            }}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Quick CTA */}
                  <div style={{
                    background: '#0B1728',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA' }}>
                      <Sparkles size={14} />
                      <strong style={{ fontSize: '0.75rem' }}>AI Trip Copilot</strong>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      Ready to build a customized daily itinerary for {selectedCountryObj.name || 'your journey'}?
                    </span>
                    <button
                      onClick={() => handleStartPlanningFor(selectedCountryId)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#3B82F6',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Plan with AI</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>

                {/* 2. CENTER: 3D GLOBE CANVAS (Dominates exploration area) */}
                <div style={{
                  height: '490px',
                  background: '#0B1728',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.35)'
                }}>
                  <Globe3D 
                    selectedCountryId={selectedCountryId}
                    compact={true}
                    onSelectCountry={(id) => handleSelectCountry(id)}
                    onSelectedFeature={(feat) => setSelectedFeature(feat)}
                    onCreateTrip={() => handleStartPlanningFor(selectedCountryId)}
                  />
                </div>

                {/* 3. RIGHT: DYNAMIC COUNTRY INFORMATION PANEL */}
                <div style={{
                  height: '490px',
                  background: '#101E32',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}>
                  <CountryInfoPanel 
                    country={selectedCountryObj}
                    inline={true}
                    onCreateTrip={() => handleStartPlanningFor(selectedCountryId)}
                    onExploreDestination={() => handleTabChange('explore')}
                  />
                </div>

              </div>

              {/* TRAVEL STATS (Minimal Compact Cards) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px'
              }}>
                {[
                  { label: 'Countries explored', value: '12', icon: <Globe size={16} />, color: '#3B82F6' },
                  { label: 'Cities viewed', value: '38', icon: <MapPin size={16} />, color: '#60A5FA' },
                  { label: 'Saved destinations', value: '8', icon: <Heart size={16} />, color: '#EF4444' },
                  { label: 'Trips planned', value: '3', icon: <Sparkles size={16} />, color: '#10B981' }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#101E32',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>
                        {stat.label}
                      </span>
                      <strong style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F8FAFC', fontFamily: "'Outfit', sans-serif" }}>
                        {stat.value}
                      </strong>
                    </div>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
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

              {/* POPULAR DESTINATIONS (Horizontal Cards) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', fontFamily: "'Outfit', sans-serif" }}>
                    Popular destinations
                  </h3>
                  <button 
                    onClick={() => handleTabChange('explore')}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#60A5FA',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>View all</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '14px',
                  overflowX: 'auto'
                }}>
                  {[
                    { id: 'france', city: 'Paris', country: 'France', rating: '4.8', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
                    { id: 'japan', city: 'Tokyo', country: 'Japan', rating: '4.9', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80' },
                    { id: 'uae', city: 'Dubai', country: 'UAE', rating: '4.8', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80' },
                    { id: 'turkey', city: 'Istanbul', country: 'Türkiye', rating: '4.8', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=400&q=80' },
                    { id: 'usa', city: 'New York', country: 'USA', rating: '4.7', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80' },
                    { id: 'uzbekistan', city: 'Samarkand', country: 'Uzbekistan', rating: '4.9', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80' }
                  ].map((dest, idx) => {
                    const isSelected = selectedCountryId.toLowerCase() === dest.id;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectCountry(dest.id)}
                        style={{
                          background: '#101E32',
                          border: isSelected ? '2px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                      >
                        <div style={{ position: 'relative', height: '110px', width: '100%', overflow: 'hidden' }}>
                          <img src={dest.image} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>{dest.city}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Star size={11} fill="#F59E0B" stroke="none" />
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F8FAFC' }}>{dest.rating}</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{dest.country}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TRENDING NOW (3-4 Discovery Cards) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', fontFamily: "'Outfit', sans-serif" }}>
                    Trending now
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px'
                }}>
                  {[
                    {
                      id: 'japan',
                      title: 'Explore Japan',
                      subtitle: 'Tokyo · Kyoto · Osaka',
                      description: 'Ancient shrines, cherry blossoms, and neon metropolises.',
                      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'turkey',
                      title: 'Cappadocia Skies',
                      subtitle: 'Göreme · Uchisar · Valley of Fairies',
                      description: 'Hot air balloon flights over lunar landscape rock formations.',
                      image: 'https://images.unsplash.com/photo-1609137144822-44169542a222?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'uzbekistan',
                      title: 'Silk Road Marvels',
                      subtitle: 'Samarkand · Bukhara · Khiva',
                      description: 'Turquoise majolica madrasahs and ancient caravanserais.',
                      image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'france',
                      title: 'French Riviera & Provence',
                      subtitle: 'Nice · Cannes · Monaco',
                      description: 'Glamorous Mediterranean beaches and lavender fields.',
                      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectCountry(item.id)}
                      style={{
                        background: '#101E32',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div style={{ position: 'relative', height: '130px', width: '100%', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent 40%, rgba(7, 17, 31, 0.9) 100%)'
                        }} />
                        <span style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '12px',
                          fontSize: '0.68rem',
                          color: '#60A5FA',
                          fontWeight: 700
                        }}>
                          {item.subtitle}
                        </span>
                      </div>
                      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#F8FAFC', display: 'block' }}>{item.title}</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.4 }}>{item.description}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            Inspect <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECOMMENDED SECTION (Compact Itineraries) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', fontFamily: "'Outfit', sans-serif" }}>
                    Recommended for you
                  </h3>
                  <button 
                    onClick={() => handleTabChange('tours')}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#60A5FA',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>View all packages</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px'
                }}>
                  {[
                    { title: 'Weekend in Paris', duration: '5 days', price: 900, countryId: 'france', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
                    { title: 'Explore Istanbul', duration: '4 days', price: 620, countryId: 'turkey', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=400&q=80' },
                    { title: 'Discover Tokyo', duration: '7 days', price: 1250, countryId: 'japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80' },
                    { title: 'Silk Road Odyssey', duration: '6 days', price: 890, countryId: 'uzbekistan', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#101E32',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: '#F8FAFC', display: 'block' }}>{item.title}</strong>
                          <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>⏱ {item.duration} • {formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartPlanningFor(item.countryId)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60A5FA',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== EXPLORE VIEW ==================== */}
          {activeTab === 'explore' && (
            <ExploreView onPlanTrip={handleStartPlanningFor} />
          )}

          {/* ==================== AI PLANNER WIZARD ==================== */}
          {activeTab === 'planner' && (
            <AiPlannerWizard 
              initialDestination={plannerDestination}
              onTripGenerated={(newTrip) => {
                setSelectedTripId(newTrip.id);
                handleTabChange('trip-details');
              }}
            />
          )}

          {/* ==================== MY TRIPS ==================== */}
          {activeTab === 'my-trips' && (
            <MyTripsView 
              onViewTrip={(id) => {
                setSelectedTripId(id);
                handleTabChange('trip-details');
              }}
            />
          )}

          {/* ==================== READY TOURS MARKETPLACE ==================== */}
          {(activeTab === 'tours' || activeTab === 'ready-trips') && (
            <ToursMarketplaceView />
          )}

          {/* ==================== TRIP WORKSPACE ==================== */}
          {activeTab === 'trip-details' && selectedTripId && (
            <TripDetailsView 
              tripId={selectedTripId}
              onBack={() => handleTabChange('my-trips')}
            />
          )}

          {/* ==================== SAVED VAULT ==================== */}
          {activeTab === 'saved' && <SavedView />}

          {/* ==================== PROFILE ==================== */}
          {activeTab === 'profile' && <ProfileView />}

          {/* ==================== OPERATIONS & ADMIN ==================== */}
          {activeTab === 'crm' && <CrmPipelineView />}
          {activeTab === 'analytics' && <AgencyAnalyticsView />}
          {activeTab === 'telegram' && <TelegramSettingsView />}
          {activeTab === 'admin' && <AdminView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'flights' && <FlightsView />}
          {activeTab === 'hotels' && <HotelsView />}
          {activeTab === 'attractions' && <AttractionsView />}
          {activeTab === 'assistant' && <AIAssistantView />}

        </div>
      </div>

      {/* ==================== FLOATING AI CHAT COPILOT ==================== */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              style={{
                width: '320px',
                height: '420px',
                background: '#101E32',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                overflow: 'hidden'
              }}
            >
              {/* Chat Header */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#0B1728',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: '#F8FAFC', display: 'block' }}>TripMind Copilot</strong>
                    <span style={{ fontSize: '0.62rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> Live Travel AI
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '8px 12px',
                      borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: msg.sender === 'user' ? '#3B82F6' : '#0B1728',
                      color: msg.sender === 'user' ? '#ffffff' : '#F8FAFC',
                      fontSize: '0.78rem',
                      lineHeight: 1.4,
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                {sending && (
                  <div style={{ alignSelf: 'flex-start', padding: '6px 10px', background: '#0B1728', borderRadius: '12px', fontSize: '0.7rem', color: '#94A3B8' }}>
                    Thinking...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={handleFloatingChatSend}
                style={{
                  padding: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  gap: '6px',
                  background: '#0B1728'
                }}
              >
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about travel..."
                  style={{
                    flex: 1,
                    background: '#101E32',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    color: '#F8FAFC'
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !chatInput.trim()}
                  style={{
                    background: '#3B82F6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: sending || !chatInput.trim() ? 0.6 : 1
                  }}
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Copilot Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            height: '46px',
            padding: '0 16px',
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.45)'
          }}
        >
          <Sparkles size={16} />
          <span>Ask AI Copilot</span>
        </button>
      </div>

    </div>
  );
};
