import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
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
  User, Search, Sun, Moon, Bell, X, 
  ChevronDown, Users, 
  ArrowRight, Utensils, MapPin, Settings as SettingsIcon,
  ChevronRight, Landmark, Plane, Tag, Luggage, Navigation,
  MessageSquare, Shield, TrendingUp, Building2
} from '../icons';
import { CrmPipelineView } from '../components/CrmPipelineView';
import { AgencyAnalyticsView } from '../components/AgencyAnalyticsView';
import { TelegramSettingsView } from '../components/TelegramSettingsView';
import { AgencyOnboardingModal } from '../components/AgencyOnboardingModal';
import { api } from '../services/api';
import { resolveDestination, generateDestinationForCountry } from '../services/destinationCatalog';

interface DashboardProps {
  initialView?: string;
  onViewChange?: (view: string) => void;
  variant?: 'user' | 'admin';
}

export const Dashboard: React.FC<DashboardProps> = ({ initialView = 'home', onViewChange, variant = 'user' }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, currencies, formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<string>(variant === 'admin' ? (initialView === 'home' ? 'admin' : initialView) : initialView);

  useEffect(() => {
    if (initialView && initialView !== 'home') {
      setActiveTab(initialView);
    }
  }, [initialView]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [plannerDestination, setPlannerDestination] = useState<string>('Samarkand, Uzbekistan');
  const [selectedCountryId, setSelectedCountryId] = useState('uzbekistan');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Active / Upcoming trip for Live Trip Cockpit
  const [activeTrip, setActiveTrip] = useState<any>(null);

  // Floating Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hello! I am your TripMind AI Copilot. Where in the world would you like to travel next?' }
  ]);
  const [sending, setSending] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check for active or upcoming trips in localStorage
  useEffect(() => {
    const aiSaved = localStorage.getItem('travel_uz_ai_trips');
    if (aiSaved) {
      try {
        const list = JSON.parse(aiSaved);
        if (list.length > 0) {
          setActiveTrip(list[0]);
        }
      } catch (e) {
        console.warn('Error reading saved trips for active cockpit');
      }
    }
  }, [activeTab]);

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

  // Mapped object representing current selected country for detail panel
  const resolvedDest = resolveDestination(selectedCountryId, selectedFeature?.properties);
  const selectedCountryObj = resolvedDest || selectedFeature || generateDestinationForCountry(selectedCountryId || 'uzbekistan');

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    highlight?: boolean;
  }

  const userNav: NavItem[] = [
    { id: 'home', label: t('dashboard.home') || 'Home', icon: <Compass size={17} /> },
    { id: 'explore', label: t('dashboard.explore') || 'Explore', icon: <Map size={17} /> },
    { id: 'planner', label: t('dashboard.planner') || 'AI Planner', icon: <Sparkles size={17} />, highlight: true },
    { id: 'my-trips', label: t('dashboard.myTrips') || 'My Trips', icon: <Calendar size={17} /> },
    { id: 'tours', label: t('dashboard.tours') || 'Tours', icon: <Luggage size={17} /> },
    { id: 'saved', label: t('dashboard.saved') || 'Saved', icon: <Heart size={17} /> },
    { id: 'community', label: t('dashboard.community') || 'Community', icon: <Users size={17} /> },
    { id: 'profile', label: 'Profile & Preferences', icon: <User size={17} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={17} /> },
  ];

  const adminNav: NavItem[] = [
    { id: 'admin', label: 'Admin Console', icon: <Shield size={17} /> },
    { id: 'crm', label: 'CRM Leads', icon: <Users size={17} /> },
    { id: 'analytics', label: 'Agency Analytics', icon: <TrendingUp size={17} /> },
    { id: 'telegram', label: 'Telegram Bot', icon: <MessageSquare size={17} /> },
    { id: 'home', label: 'Traveler Dashboard', icon: <Compass size={17} /> },
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
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 600));
      let reply = `TripMind Copilot is tracking weather, visa rules, and heritage spots for "${userText}". Tap 'AI Planner' to generate a full customized day-by-day plan!`;
      const textLower = userText.toLowerCase();
      if (textLower.includes('weather') || textLower.includes('time')) {
        reply = 'Spring (April-May) and Autumn (September-November) are ideal for Silk Road journeys (20-24°C).';
      } else if (textLower.includes('visa')) {
        reply = 'Uzbekistan grants 30-day visa-free entry to citizens of 85+ countries (EU, GCC, Americas).';
      } else if (textLower.includes('plov') || textLower.includes('food')) {
        reply = 'For authentic Samarkand plov, head to Osh Markazi at 12:00 sharp for fresh yellow carrot and tender lamb.';
      }
      setChatMessages([...updated, { sender: 'assistant', text: reply }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg, #090d1a)', position: 'relative' }}>
      
      {/* Agency Onboarding Modal */}
      <AgencyOnboardingModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={() => alert('Agency onboarded successfully!')}
      />

      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className="dashboard-sidebar-panel" style={{
        width: '240px',
        background: 'var(--color-bg-surface, #0f172a)',
        borderRight: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        padding: '24px 16px',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabChange('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 12px 8px', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-accent, #2563eb), #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            <Compass size={18} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.5px', color: 'var(--color-text-primary, #ffffff)' }}>
              Trip<span style={{ color: 'var(--color-accent, #2563eb)' }}>Mind</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              AI TRAVEL INTELLIGENCE
            </span>
          </div>
        </div>

        {variant === 'admin' && (
          <button
            onClick={() => setShowOnboardModal(true)}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.8rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Building2 size={16} /> Onboard Agency
          </button>
        )}

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }} className="sidebar-scrollable-links">
          {navItems.map(item => {
            const isActive = activeTab === item.id || (item.id === 'ready-trips' && activeTab === 'ready');
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: 'none',
                  background: isActive 
                    ? 'rgba(37, 99, 235, 0.12)' 
                    : 'transparent',
                  color: isActive 
                    ? '#2563eb' 
                    : item.highlight 
                      ? '#2563eb' 
                      : 'var(--color-text-secondary, #475569)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: isActive ? '#2563eb' : 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'var(--glass-border, rgba(15,23,42,0.08))', margin: '8px 4px' }} />

          {[
            { id: 'profile', label: t('dashboard.profile'), icon: <User size={17} /> },
            { id: 'settings', label: t('dashboard.settings'), icon: <SettingsIcon size={17} /> }
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: 'none',
                  background: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  color: isActive ? '#2563eb' : 'var(--color-text-muted, #64748b)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: isActive ? '#2563eb' : 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom AI Promo Card (Reference 3) */}
        <div style={{
          background: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%)',
          borderRadius: '16px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)'
        }}>
          <div style={{
            width: '100%',
            height: '70px',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #60a5fa, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plane size={32} style={{ color: '#ffffff', transform: 'rotate(-25deg)', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }} />
          </div>
          <div>
            <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
              Turn your travel ideas into amazing trips with AI
            </h5>
          </div>
          <button
            onClick={() => handleTabChange('planner')}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '100px',
              padding: '7px 12px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>Plan with AI</span>
            <ArrowRight size={12} />
          </button>
        </div>
        {/* Logout */}
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.05)',
            color: '#ef4444',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          {t('navbar.signOut')}
        </button>
      </aside>

      {/* ==================== MAIN VIEW WRAPPER ==================== */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="dashboard-content-wrapper">
        
        {/* Sticky Top Header Navigation */}
        <header style={{
          height: '70px',
          borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
          background: 'var(--color-bg-surface, #0f172a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Global Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg, #090d1a)', border: '1px solid var(--glass-border)', borderRadius: '100px', padding: '6px 16px', width: '320px' }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search cities, tours, sights..." 
              style={{ width: '100%', fontSize: '0.85rem', color: 'var(--color-text-primary, #ffffff)' }} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTabChange('explore');
              }}
            />
          </div>

          {/* Controls: Currency, Language, Dark Mode, Notifications, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Currency Selector Dropdown */}
            <div ref={currRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'var(--color-bg, #090d1a)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
              >
                <span>{currency}</span>
                <ChevronDown size={12} />
              </button>
              {isCurrencyDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '36px',
                  right: 0,
                  background: 'var(--color-bg-surface, #0f172a)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200,
                  boxShadow: 'var(--glass-shadow)',
                  minWidth: '130px'
                }}>
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setIsCurrencyDropdownOpen(false); }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        border: 'none',
                        background: currency === c.code ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                        color: currency === c.code ? '#10b981' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 700
                      }}
                    >
                      {c.symbol} {c.code} ({c.name})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div ref={langRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-bg, #090d1a)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
              >
                <span>{language.toUpperCase() === 'EN' ? '🇬🇧 EN' : language.toUpperCase() === 'RU' ? '🇷🇺 RU' : '🇺🇿 UZ'}</span>
                <ChevronDown size={12} />
              </button>
              {isLangDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '36px',
                  right: 0,
                  background: 'var(--color-bg-surface, #0f172a)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200,
                  boxShadow: 'var(--glass-shadow)'
                }}>
                  {(['EN', 'RU', 'UZ'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLanguage(l.toLowerCase() as any); setIsLangDropdownOpen(false); }}
                      style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', border: 'none', background: language.toUpperCase() === l ? 'var(--color-accent-glow)' : 'transparent', color: language.toUpperCase() === l ? 'var(--color-accent)' : 'var(--color-text-secondary)', cursor: 'pointer', textAlign: 'left', width: '110px' }}
                    >
                      {l === 'EN' ? 'English' : l === 'RU' ? 'Русский' : 'O‘zbekcha'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--glass-border)',
                background: 'var(--color-bg, #090d1a)',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} />}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--color-bg, #090d1a)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <Bell size={16} />
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', color: '#ffffff', fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '280px',
                  background: 'var(--color-bg-surface, #0f172a)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: 'var(--glass-shadow)',
                  zIndex: 200,
                  textAlign: 'left'
                }}>
                  <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block', marginBottom: '8px' }}>Traveler Alerts</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '6px 8px', background: 'rgba(37,99,235,0.1)', borderRadius: '8px' }}>
                      ✨ AI Plan ready for inspection in Samarkand.
                    </div>
                    <div style={{ padding: '6px 8px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px' }}>
                      🏷️ 3 Tour Agency packages matched your duration.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Mini */}
            <div 
              onClick={() => handleTabChange('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '16px', cursor: 'pointer' }}
            >
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'} 
                alt={user?.name} 
                loading="lazy"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--color-text-primary, #ffffff)' }}>{user?.name || 'Traveler'}</strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-accent, #2563eb)', fontWeight: 800 }}>TripMind Member</span>
              </div>
            </div>

          </div>
        </header>

        {/* Scrollable View Content */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          
          {/* ==================== HOME TAB ==================== */}
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* ACTIVE TRIP COCKPIT (Conditionally displayed when traveler has trip) */}
              {activeTrip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.1))',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: '20px',
                    padding: '20px 28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.5px' }}>
                        ACTIVE VOYAGE IN PROGRESS
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                      {activeTrip.destination} • Day 1 of {activeTrip.rawTripData?.days?.length || 5}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px', display: 'block' }}>
                      Next Up: Registan Ensemble (09:30 AM) • Estimated budget: {formatPrice(activeTrip.totalCost || 1200)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setSelectedTripId(activeTrip.id);
                        handleTabChange('trip-details');
                      }}
                      className="btn-primary"
                      style={{ padding: '9px 16px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Map size={14} /> Open Workspace
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTripId(activeTrip.id);
                        handleTabChange('trip-details');
                      }}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ "I'm Tired"
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Row 1: 3D Globe with 3 Metric Badges + Country Info Panel (Reference 3) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '24px' }} className="explore-main-grid">
                {/* Left: 3D Globe Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    height: '460px',
                    background: 'var(--color-bg-surface, #ffffff)',
                    border: '1px solid var(--border, rgba(15,23,42,0.08))',
                    boxShadow: '0 4px 20px -2px rgba(15,23,42,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '20px'
                  }}>
                    <Globe3D 
                      selectedCountryId={selectedCountryId}
                      compact={true}
                      onSelectCountry={(id) => setSelectedCountryId(id)}
                      onSelectedFeature={(feat) => setSelectedFeature(feat)}
                      onCreateTrip={() => handleStartPlanningFor(selectedCountryId)}
                    />
                  </div>

                  {/* 3 Metrics Badges under Globe (Reference 3) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                  }}>
                    <div style={{
                      background: 'var(--color-bg-surface, #ffffff)',
                      border: '1px solid var(--border, rgba(15,23,42,0.08))',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                        <Luggage size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>195</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)' }}>Countries</span>
                      </div>
                    </div>

                    <div style={{
                      background: 'var(--color-bg-surface, #ffffff)',
                      border: '1px solid var(--border, rgba(15,23,42,0.08))',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <MapPin size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>25,000+</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)' }}>Destinations</span>
                      </div>
                    </div>

                    <div style={{
                      background: 'var(--color-bg-surface, #ffffff)',
                      border: '1px solid var(--border, rgba(15,23,42,0.08))',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)', display: 'block' }}>AI Travel Planner</strong>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #64748b)' }}>Your personal assistant</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Destination Telemetry Panel (Inline Mode, Reference 3) */}
                <div style={{
                  height: '528px',
                  background: 'var(--color-bg-surface, #ffffff)',
                  border: '1px solid var(--border, rgba(15,23,42,0.08))',
                  boxShadow: '0 4px 20px -2px rgba(15,23,42,0.04)',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  <CountryInfoPanel 
                    country={selectedCountryObj}
                    inline={true}
                    onCreateTrip={() => handleStartPlanningFor(selectedCountryId)}
                  />
                </div>
              </div>

              {/* Row 2: Popular Destinations (50%) + Recommended For You (50%) (Reference 3) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="explore-main-grid">
                {/* Column A: Popular Destinations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-text-primary, #0f172a)', fontFamily: 'var(--font-heading)' }}>
                      Popular Destinations
                    </h3>
                    <button 
                      onClick={() => handleTabChange('explore')}
                      style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-accent, #2563eb)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* 4 Cards Grid (Istanbul, Paris, Dubai, Samarkand) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '12px' }}>
                    {[
                      { id: 'turkey', city: 'Istanbul', country: 'Türkiye', rating: '4.8 (12K)', tags: ['Culture', 'Food'], image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=400&q=80' },
                      { id: 'france', city: 'Paris', country: 'France', rating: '4.7 (18K)', tags: ['Art', 'Romance'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
                      { id: 'dubai', city: 'Dubai', country: 'UAE', rating: '4.8 (10K)', tags: ['Luxury', 'Modern'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80' },
                      { id: 'uzbekistan', city: 'Samarkand', country: 'Uzbekistan', rating: '4.9 (8K)', tags: ['History', 'Culture'], image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80' },
                    ].map((dest, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedCountryId(dest.id);
                          setPlannerDestination(`${dest.city}, ${dest.country}`);
                        }}
                        style={{
                          background: 'var(--color-bg-surface, #ffffff)',
                          border: selectedCountryId === dest.id ? '2px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(15,23,42,0.08))',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Card Image */}
                        <div style={{ position: 'relative', height: '105px', width: '100%', overflow: 'hidden' }}>
                          <img src={dest.image} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.85)',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#64748b',
                              cursor: 'pointer'
                            }}
                          >
                            <Heart size={13} />
                          </button>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '9px 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-primary, #0f172a)' }}>{dest.city}</strong>
                            <ChevronRight size={13} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #64748b)' }}>{dest.country}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <Star size={11} fill="#f59e0b" stroke="none" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)' }}>{dest.rating}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '3px' }}>
                            {dest.tags.map((t, idx) => (
                              <span key={idx} style={{ fontSize: '0.6rem', fontWeight: 600, background: 'var(--bg-secondary, #f1f5f9)', color: 'var(--color-text-secondary, #475569)', padding: '2px 5px', borderRadius: '5px' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column B: Recommended For You */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-text-primary, #0f172a)', fontFamily: 'var(--font-heading)' }}>
                        Recommended for you
                      </h3>
                      <div style={{ display: 'flex', gap: '3px', background: 'var(--bg-secondary, #f1f5f9)', padding: '3px', borderRadius: '100px' }}>
                        {['AI Picks', 'Ready Tours', 'Trending'].map((tab, idx) => (
                          <button
                            key={idx}
                            style={{
                              border: 'none',
                              background: idx === 0 ? 'var(--color-accent, #2563eb)' : 'transparent',
                              color: idx === 0 ? '#ffffff' : 'var(--color-text-muted, #64748b)',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '100px',
                              cursor: 'pointer'
                            }}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTabChange('tours')}
                      style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-accent, #2563eb)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* 3 Tour Cards (Cappadocia, Japan, Paris) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { 
                        title: '5 Days in Cappadocia', 
                        badge: 'By AI', 
                        badgeColor: '#7c3aed',
                        badgeBg: 'rgba(124, 58, 237, 0.12)',
                        rating: '4.8 (1.2K)', 
                        duration: '5 days', 
                        travelers: '2 travelers', 
                        tags: ['Nature', 'Adventure'], 
                        price: 750, 
                        image: 'https://images.unsplash.com/photo-1609137144822-44169542a222?auto=format&fit=crop&w=400&q=80',
                        dest: 'Cappadocia, Turkey'
                      },
                      { 
                        title: '7 Days in Japan', 
                        badge: 'Popular', 
                        badgeColor: '#2563eb',
                        badgeBg: 'rgba(37, 99, 235, 0.12)',
                        rating: '4.9 (2.1K)', 
                        duration: '7 days', 
                        travelers: '2 travelers', 
                        tags: ['Culture', 'Food'], 
                        price: 1250, 
                        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
                        dest: 'Tokyo, Japan'
                      },
                      { 
                        title: '4 Days in Paris', 
                        badge: 'Trending', 
                        badgeColor: '#10b981',
                        badgeBg: 'rgba(16, 185, 129, 0.12)',
                        rating: '4.7 (3.4K)', 
                        duration: '4 days', 
                        travelers: '2 travelers', 
                        tags: ['Art', 'City'], 
                        price: 900, 
                        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
                        dest: 'Paris, France'
                      }
                    ].map((tour, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--color-bg-surface, #ffffff)',
                          border: '1px solid var(--border, rgba(15,23,42,0.08))',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Tour Image */}
                        <div style={{ position: 'relative', height: '90px', width: '100%', overflow: 'hidden' }}>
                          <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            background: tour.badgeBg,
                            color: tour.badgeColor,
                            fontWeight: 800,
                            fontSize: '0.6rem',
                            padding: '2px 7px',
                            borderRadius: '100px'
                          }}>
                            {tour.badge}
                          </span>
                        </div>

                        {/* Tour Info */}
                        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'space-between' }}>
                          <div>
                            <strong style={{ fontSize: '0.78rem', color: 'var(--color-text-primary, #0f172a)', display: 'block', lineHeight: 1.2 }}>{tour.title}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <Star size={10} fill="#f59e0b" stroke="none" />
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)' }}>{tour.rating}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.62rem', color: 'var(--color-text-muted, #64748b)', marginTop: '2px' }}>
                              <span>🕒 {tour.duration}</span>
                              <span>👥 {tour.travelers}</span>
                            </div>
                          </div>

                          {/* Price & CTA Button */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border, rgba(15,23,42,0.06))' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>{formatPrice(tour.price)}</strong>
                            <button
                              onClick={() => handleStartPlanningFor(tour.dest)}
                              style={{
                                background: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '100px',
                                padding: '5px 8px',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <span>View trip</span>
                              <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Explore by Interest Carousel (Reference 3) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-text-primary, #0f172a)', fontFamily: 'var(--font-heading)' }}>
                    Explore by interest
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {[
                    { label: 'Culture', icon: <Landmark size={14} /> },
                    { label: 'Food', icon: <Utensils size={14} /> },
                    { label: 'Nature', icon: <Sparkles size={14} /> },
                    { label: 'Beaches', icon: <Compass size={14} /> },
                    { label: 'Mountains', icon: <Map size={14} /> },
                    { label: 'Adventure', icon: <Navigation size={14} /> },
                    { label: 'Luxury', icon: <Star size={14} /> },
                    { label: 'Family', icon: <Users size={14} /> },
                    { label: 'Budget', icon: <Tag size={14} /> },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTabChange('explore')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        background: 'var(--color-bg-surface, #ffffff)',
                        border: '1px solid var(--border, rgba(15,23,42,0.08))',
                        boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
                        color: 'var(--color-text-primary, #0f172a)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent, #2563eb)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border, rgba(15,23,42,0.08))')}
                    >
                      <span style={{ color: 'var(--color-accent, #2563eb)' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleTabChange('explore')}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--color-bg-surface, #ffffff)',
                      border: '1px solid var(--border, rgba(15,23,42,0.08))',
                      boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-primary, #0f172a)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
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
              className="glass-panel"
              style={{
                width: '320px',
                height: '420px',
                background: 'var(--color-bg-surface, #0f172a)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '20px'
              }}
            >
              {/* Header */}
              <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg, #090d1a)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} style={{ color: '#a855f7' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>TripMind Co-pilot</span>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ color: 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Message History */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--color-accent, #2563eb), #7c3aed)' : 'var(--color-bg, #090d1a)',
                      color: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      maxWidth: '85%',
                      textAlign: 'left',
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)'
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                {sending && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                    Claude is analyzing travel tradeoffs...
                  </span>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleFloatingChatSend} style={{ padding: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px', background: 'var(--color-bg, #090d1a)' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about sights, weather, pace..."
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-surface)', color: '#ffffff', fontSize: '0.8rem' }}
                />
                <button type="submit" className="btn-premium" style={{ padding: '8px 14px', borderRadius: '20px', border: 'none', fontSize: '0.75rem' }}>Send</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bubble Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent, #2563eb), #7c3aed)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Toggle AI Co-pilot Chat"
        >
          <Sparkles size={24} />
        </button>
      </div>

      {/* ==================== INTENTIONAL MOBILE BOTTOM NAVIGATION (< 768px) ==================== */}
      {/* Exactly the 5 items specified in UX spec (AC-01): Home, Explore, AI Planner (Elevated Center), Trips, Profile */}
      <nav className="mobile-bottom-tabs" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 999,
        padding: '0 8px',
      }}>
        {/* 1. Home */}
        <button
          onClick={() => handleTabChange('home')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'home' ? 'var(--color-accent, #2563eb)' : 'var(--color-text-muted, #64748b)',
            fontSize: '0.65rem',
            fontWeight: 800,
            cursor: 'pointer',
            flex: 1
          }}
        >
          <Compass size={20} />
          <span>{t('dashboard.home')}</span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => handleTabChange('explore')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'explore' ? 'var(--color-accent, #2563eb)' : 'var(--color-text-muted, #64748b)',
            fontSize: '0.65rem',
            fontWeight: 800,
            cursor: 'pointer',
            flex: 1
          }}
        >
          <Map size={20} />
          <span>{t('dashboard.explore')}</span>
        </button>

        {/* 3. AI Planner (Center Elevated 48px circle with gradient and glow) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <button
            onClick={() => handleTabChange('planner')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent, #2563eb), #7c3aed)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(37, 99, 235, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginTop: '-20px',
              cursor: 'pointer'
            }}
            aria-label="Launch AI Planner"
          >
            <Sparkles size={22} />
          </button>
        </div>

        {/* 4. Trips */}
        <button
          onClick={() => handleTabChange('my-trips')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'my-trips' || activeTab === 'trip-details' ? 'var(--color-accent, #2563eb)' : 'var(--color-text-muted, #64748b)',
            fontSize: '0.65rem',
            fontWeight: 800,
            cursor: 'pointer',
            flex: 1
          }}
        >
          <Calendar size={20} />
          <span>{t('dashboard.myTrips')}</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => handleTabChange('profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'profile' ? 'var(--color-accent, #2563eb)' : 'var(--color-text-muted, #64748b)',
            fontSize: '0.65rem',
            fontWeight: 800,
            cursor: 'pointer',
            flex: 1
          }}
        >
          <User size={20} />
          <span>{t('dashboard.profile')}</span>
        </button>
      </nav>

      {/* Responsive layout styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-bottom-tabs {
          display: none !important;
        }
        @media (max-width: 768px) {
          .dashboard-sidebar-panel {
            display: none !important;
          }
          .dashboard-content-wrapper {
            margin-left: 0 !important;
            padding-bottom: 74px !important;
          }
          .mobile-bottom-tabs {
            display: flex !important;
          }
          .explore-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

    </div>
  );
};
