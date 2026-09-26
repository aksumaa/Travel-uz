import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe3D } from '../components/Globe3D';
import { CountryInfoPanel } from '../components/CountryInfoPanel';
import { 
  MyTripsView, FlightsView, HotelsView, AttractionsView, SavedView, AIAssistantView, ProfileView, SettingsView 
} from './DashboardViews';
import { AiTripGenerator } from '../components/AiTripGenerator';
import { TripDetailsView } from './TripDetailsView';
import { AdminView } from './AdminView';
import { 
  Globe, Brain, Calendar, Map, Plane, Hotel, Star, Heart, 
  MessageSquare, User, Settings, Search, Sun, Moon, Bell, X, Navigation, ChevronDown, Shield, Users, TrendingUp, Building2 
} from 'lucide-react';
import { CrmPipelineView } from '../components/CrmPipelineView';
import { AgencyAnalyticsView } from '../components/AgencyAnalyticsView';
import { TelegramSettingsView } from '../components/TelegramSettingsView';
import { AgencyOnboardingModal } from '../components/AgencyOnboardingModal';
import { api } from '../services/api';

interface DashboardProps {
  initialView?: string;
  onViewChange?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialView = 'home', onViewChange }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const getCustomText = (key: string) => {
    const dict: Record<string, Record<'EN' | 'RU' | 'UZ', string>> = {
      'Go Premium': { EN: 'Go Premium', RU: 'Премиум подписка', UZ: 'Premiumga o‘tish' },
      'Unlock custom flight arcs...': { 
        EN: 'Unlock custom flight arcs, climate statistics, and unlimited ClaudeSonnet trip telemetry generation.', 
        RU: 'Разблокируйте кастомные траектории полетов, климатическую статистику и безлимитную генерацию маршрутов ИИ.', 
        UZ: 'Maxsus parvoz chiziqlari, iqlim statistikasi va cheksiz sun’iy intellekt sayohat rejalarini oching.' 
      },
      'Upgrade Now': { EN: 'Upgrade Now', RU: 'Обновиться', UZ: 'Faollashtirish' },
      'Upgraded to Premium!': { EN: 'Upgraded to Premium!', RU: 'Подписка Premium активирована!', UZ: 'Premium hisob faollashtirildi!' },
      'Search destinations...': { EN: 'Search destinations...', RU: 'Поиск направлений...', UZ: 'Yo‘nalishlarni qidirish...' },
      'Quick Voyage Setup': { EN: 'Quick Voyage Setup', RU: 'Быстрая настройка поездки', UZ: 'Tezkor rejalashtirish' },
      'Where to?': { EN: 'Where to?', RU: 'Куда поедем?', UZ: 'Qayerga boramiz?' },
      'Setup Planner Itinerary': { EN: 'Setup Planner Itinerary', RU: 'Настроить планировщик', UZ: 'Plannerni sozlash' },
      'Trending Stops': { EN: 'Trending Stops', RU: 'Популярные остановки', UZ: 'Ommabop manzillar' },
      'Browse handpicked select itineraries': { EN: 'Browse handpicked select itineraries', RU: 'Просмотрите наши готовые туры', UZ: 'Tayyor sayohat paketlarini ko‘ring' },
      'Create dynamic day-by-day itineraries': { EN: 'Create dynamic day-by-day itineraries', RU: 'Создавайте индивидуальные маршруты с ИИ', UZ: 'AI yordamida batafsil marshrutlar tuzing' },
      'Manage active schedules and flight tickets': { EN: 'Manage active schedules and flight tickets', RU: 'Управляйте билетами и планами поездок', UZ: 'Sayohat chiptalari va rejalarini boshqaring' },
      'Car Rentals': { EN: 'Car Rentals', RU: 'Аренда авто', UZ: 'Avtomobil ijarasi' },
      'Travel Insurance': { EN: 'Travel Insurance', RU: 'Страхование', UZ: 'Sayohat sug‘urtasi' },
      '50+ Countries': { EN: '50+ Countries', RU: '50+ Стран', UZ: '50+ Davlatlar' },
      '10K+ Destinations': { EN: '10K+ Destinations', RU: '10K+ Направлений', UZ: '10K+ Shaharlar' },
      '1M+ Happy Travelers': { EN: '1M+ Happy Travelers', RU: '1M+ Довольных туристов', UZ: '1M+ Mamnun sayohatchilar' },
      '24/7 AI Support': { EN: '24/7 AI Support', RU: 'ИИ-Поддержка 24/7', UZ: '24/7 AI Qo‘llab-quvvatlash' },
      'TravelUZ Co-pilot': { EN: 'TravelUZ Co-pilot', RU: 'TravelUZ ИИ-Ассистент', UZ: 'TravelUZ AI Yordamchi' },
      'Claude is thinking...': { EN: 'Claude is thinking...', RU: 'Клод думает...', UZ: 'Claude o‘ylamoqda...' }
    };
    const upperLang = (language.toUpperCase() as 'EN' | 'RU' | 'UZ');
    return dict[key]?.[upperLang] || key;
  };

  const [activeTab, setActiveTab] = useState<string>(initialView);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState('uzbekistan');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Floating Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: t('dashboard.assistantIntro') }
  ]);
  const [sending, setSending] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update initial assistant chat message text dynamically when language switches
  useEffect(() => {
    if (chatMessages.length === 1) {
      setChatMessages([
        { sender: 'assistant', text: t('dashboard.assistantIntro') }
      ]);
    }
  }, [language]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onViewChange) {
      onViewChange(tab);
    }
  };

  // Mapped object representing current selected country for detail panel
  const selectedCountryObj = {
    properties: {
      NAME: selectedCountryId === 'uzbekistan' ? 'Uzbekistan' : selectedCountryId === 'usa' ? 'United States' : selectedCountryId === 'france' ? 'France' : selectedCountryId === 'japan' ? 'Japan' : selectedCountryId === 'brazil' ? 'Brazil' : selectedCountryId === 'australia' ? 'Australia' : 'Egypt',
      ISO_A3: selectedCountryId === 'uzbekistan' ? 'UZB' : selectedCountryId === 'usa' ? 'USA' : selectedCountryId === 'france' ? 'FRA' : selectedCountryId === 'japan' ? 'JPN' : selectedCountryId === 'brazil' ? 'BRA' : selectedCountryId === 'australia' ? 'AUS' : 'EGY',
      SUBREGION: selectedCountryId === 'uzbekistan' ? 'Central Asia' : selectedCountryId === 'usa' ? 'North America' : selectedCountryId === 'france' ? 'Western Europe' : selectedCountryId === 'japan' ? 'Eastern Asia' : selectedCountryId === 'brazil' ? 'South America' : selectedCountryId === 'australia' ? 'Oceania' : 'Northern Africa',
      CONTINENT: selectedCountryId === 'uzbekistan' ? 'Asia' : selectedCountryId === 'usa' ? 'North America' : selectedCountryId === 'france' ? 'Europe' : selectedCountryId === 'japan' ? 'Asia' : selectedCountryId === 'brazil' ? 'South America' : selectedCountryId === 'australia' ? 'Oceania' : 'Africa',
      POP_EST: 35000000,
      GDP_MD: 60000,
    }
  };

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
        days: 3
      });
      const itin = data.itinerary || data.raw_trip_data;
      const botText = itin?.summary || `Generated custom itinerary for ${userText}! Total cost: $${itin?.totalCost || 1500}`;
      setChatMessages([...updated, { sender: 'assistant', text: botText }]);
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 800));
      let reply = 'I am looking up meteorological trends and visa requirements for your query. Let me know which coordinates you want to map out!';
      const textLower = userText.toLowerCase();
      if (textLower.includes('weather') || textLower.includes('time')) {
        reply = 'Spring and Autumn are ideal for Central Asia (20-25°C). Europe has pleasant summers (June-August).';
      } else if (textLower.includes('visa')) {
        reply = 'Uzbekistan provides 30-day visa waivers to EU/GCC countries. Click coordinates on the globe to inspect detail regulations.';
      } else if (textLower.includes('plov') || textLower.includes('food')) {
        reply = 'Definitely try traditional Samarkand plov. In Japan, check out ramen stands near Shibuya crossing!';
      }
      setChatMessages([...updated, { sender: 'assistant', text: reply }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>
      
      {/* Agency Onboarding Modal */}
      <AgencyOnboardingModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={() => alert('Agency onboarded successfully!')}
      />

      {/* SIDEBAR (Desktop only) */}
      <aside className="dashboard-sidebar-panel" style={{
        width: '240px',
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        padding: '24px 16px',
        gap: '20px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 12px 8px', borderBottom: '1px solid var(--glass-border)' }}>
          <Globe size={24} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', color: 'var(--color-text-primary)' }}>
            Travel<span style={{ color: 'var(--color-accent)' }}>UZ</span>
          </span>
        </div>

        {/* Agency Onboarding Quick Button */}
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

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }} className="sidebar-scrollable-links">
          {[
            { id: 'home', label: t('dashboard.sidebarHome'), icon: <Globe size={16} /> },
            { id: 'planner', label: t('dashboard.sidebarPlanner'), icon: <Brain size={16} /> },
            { id: 'my-trips', label: t('dashboard.sidebarMyTrips'), icon: <Calendar size={16} /> },
            { id: 'crm', label: 'CRM Leads', icon: <Users size={16} /> },
            { id: 'analytics', label: 'Agency Analytics', icon: <TrendingUp size={16} /> },
            { id: 'telegram', label: 'Telegram Bot', icon: <MessageSquare size={16} /> },
            { id: 'ready-trips', label: t('dashboard.sidebarReadyTrips'), icon: <Map size={16} /> },
            { id: 'flights', label: t('dashboard.sidebarFlights'), icon: <Plane size={16} /> },
            { id: 'hotels', label: t('dashboard.sidebarHotels'), icon: <Hotel size={16} /> },
            { id: 'attractions', label: t('dashboard.sidebarAttractions'), icon: <Star size={16} /> },
            { id: 'saved', label: t('dashboard.sidebarSaved'), icon: <Heart size={16} /> },
            { id: 'profile', label: t('dashboard.sidebarProfile'), icon: <User size={16} /> },
            { id: 'settings', label: t('dashboard.sidebarSettings'), icon: <Settings size={16} /> },
            { id: 'admin', label: 'Admin Console', icon: <Shield size={16} /> }
          ].map(item => {
            const isActive = activeTab === item.id || (item.id === 'ready-trips' && activeTab === 'ready');
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Go Premium Upgrade Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-purple), var(--color-accent))',
          borderRadius: '16px',
          padding: '16px',
          color: '#ffffff',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>{getCustomText('Go Premium')}</h4>
          <p style={{ fontSize: '0.7rem', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>{getCustomText('Unlock custom flight arcs...')}</p>
          <button 
            onClick={() => alert(getCustomText('Upgraded to Premium!'))}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#ffffff', color: '#1f2937', fontWeight: 700, fontSize: '0.75rem', border: 'none', cursor: 'pointer', width: '100%', marginTop: '4px' }}
          >
            {getCustomText('Upgrade Now')}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
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

      {/* MAIN VIEW AREA */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="dashboard-content-wrapper">
        
        {/* TOP NAV */}
        <header style={{
          height: '70px',
          borderBottom: '1px solid var(--glass-border)',
          background: 'var(--color-bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '100px', padding: '4px 16px', width: '320px' }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder={getCustomText('Search destinations...')} 
              style={{ width: '100%', fontSize: '0.85rem', color: 'var(--color-text-primary)' }} 
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Language dropdown */}
            <div ref={langRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-bg)',
                  padding: '6px 14px',
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
                  background: 'var(--color-bg-surface)',
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

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--glass-border)',
                background: 'var(--color-bg)',
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
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--glass-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', color: '#ffffff', fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </div>

            {/* User Profile Mini */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '16px' }}>
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'} 
                alt={user?.name} 
                loading="lazy"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--color-text-primary)' }}>{user?.name}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 800, background: 'var(--color-accent-glow)', padding: '2px 6px', borderRadius: '4px' }}>Premium</span>
              </div>
            </div>

          </div>
        </header>

        {/* MAIN VIEW SCROLL AREA */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Row 1: Globe3D (60%) + CountryDetailPanel (40%) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }} className="explore-main-grid">
                <div className="glass-panel" style={{ height: '500px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                  {/* Floating Map Controls */}
                  <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 20 }}>
                    <button onClick={() => setSelectedCountryId('uzbekistan')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Navigation size={12} /></button>
                  </div>
                  <Globe3D 
                    selectedCountryId={selectedCountryId}
                    onSelectCountry={(id) => setSelectedCountryId(id)}
                    onCreateTrip={() => handleTabChange('planner')}
                  />
                </div>
                <div className="glass-panel" style={{ height: '500px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)' }}>
                  <CountryInfoPanel 
                    country={selectedCountryObj}
                    onClose={() => setSelectedCountryId('uzbekistan')}
                    onCreateTrip={() => handleTabChange('planner')}
                  />
                </div>
              </div>

              {/* Row 2: Quick AI Planner (40%) + Popular Destinations Mini Scroll (60%) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px' }} className="explore-main-grid">
                {/* Quick AI Planner Form */}
                <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>{getCustomText('Quick Voyage Setup')}</h4>
                  <input type="text" placeholder={getCustomText('Where to?')} value={selectedCountryId.toUpperCase()} onChange={() => {}} style={{ padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
                  <button onClick={() => handleTabChange('planner')} className="btn-premium" style={{ width: '100%', padding: '10px', fontSize: '0.8rem', border: 'none' }}>
                    {getCustomText('Setup Planner Itinerary')}
                  </button>
                </div>

                {/* Popular Mini Scroll */}
                <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>{getCustomText('Trending Stops')}</h4>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
                    {[
                      { city: 'Istanbul', price: '$750', score: '4.8' },
                      { city: 'Dubai', price: '$850', score: '4.8' },
                      { city: 'Paris', price: '$900', score: '4.7' },
                      { city: 'Samarkand', price: '$450', score: '4.9' }
                    ].map((dest, i) => (
                      <div key={i} style={{ flex: '0 0 130px', background: 'var(--color-bg)', borderRadius: '14px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{dest.city}</span>
                        <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={10} fill="#f59e0b" stroke="none" /> {dest.score}</span>
                        <strong style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '4px' }}>{dest.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: 3 Service Banners (Ready Trips | AI Generated | My Plans) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="explore-main-grid">
                {/* Banner 1 */}
                <div 
                  onClick={() => handleTabChange('ready-trips')}
                  style={{
                    height: '140px',
                    borderRadius: '20px',
                    background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80') center/cover",
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 4px 0' }}>{t('dashboard.sidebarReadyTrips')}</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{getCustomText('Browse handpicked select itineraries')}</span>
                </div>

                {/* Banner 2 */}
                <div 
                  onClick={() => handleTabChange('planner')}
                  style={{
                    height: '140px',
                    borderRadius: '20px',
                    background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=400&q=80') center/cover",
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 4px 0' }}>{t('dashboard.sidebarPlanner')}</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{getCustomText('Create dynamic day-by-day itineraries')}</span>
                </div>

                {/* Banner 3 */}
                <div 
                  onClick={() => handleTabChange('my-trips')}
                  style={{
                    height: '140px',
                    borderRadius: '20px',
                    background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=400&q=80') center/cover",
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 4px 0' }}>{t('dashboard.sidebarMyTrips')}</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{getCustomText('Manage active schedules and flight tickets')}</span>
                </div>
              </div>

              {/* Row 4: Service shortcuts grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="explore-main-grid">
                {[
                  { title: t('landing.pillFlights'), view: 'flights', color: 'var(--color-accent)' },
                  { title: t('landing.pillHotels'), view: 'hotels', color: 'var(--color-purple)' },
                  { title: getCustomText('Car Rentals'), view: 'home', color: '#f59e0b' },
                  { title: getCustomText('Travel Insurance'), view: 'home', color: '#10b981' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleTabChange(item.view)}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{item.title}</strong>
                  </div>
                ))}
              </div>

              {/* Bottom: Stats Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '100px',
                padding: '16px 20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                boxShadow: 'var(--glass-shadow)'
              }}>
                <span>🌐 {getCustomText('50+ Countries')}</span>
                <span>📍 {getCustomText('10K+ Destinations')}</span>
                <span>👥 {getCustomText('1M+ Happy Travelers')}</span>
                <span>💬 {getCustomText('24/7 AI Support')}</span>
              </div>

            </div>
          )}

          {activeTab === 'planner' && (
            <AiTripGenerator 
              onSave={(newTrip) => {
                setSelectedTripId(newTrip.id);
                handleTabChange('trip-details');
              }} 
            />
          )}
          {activeTab === 'my-trips' && (
            <MyTripsView 
              onViewTrip={(id) => {
                setSelectedTripId(id);
                handleTabChange('trip-details');
              }}
            />
          )}
          {activeTab === 'ready-trips' && (
            <MyTripsView 
              onViewTrip={(id) => {
                setSelectedTripId(id);
                handleTabChange('trip-details');
              }}
            />
          )}
          {activeTab === 'trip-details' && selectedTripId && (
            <TripDetailsView 
              tripId={selectedTripId}
              onBack={() => handleTabChange('my-trips')}
            />
          )}
          {activeTab === 'crm' && <CrmPipelineView />}
          {activeTab === 'analytics' && <AgencyAnalyticsView />}
          {activeTab === 'telegram' && <TelegramSettingsView />}
          {activeTab === 'flights' && <FlightsView />}
          {activeTab === 'hotels' && <HotelsView />}
          {activeTab === 'attractions' && <AttractionsView />}
          {activeTab === 'saved' && <SavedView />}
          {activeTab === 'assistant' && <AIAssistantView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'admin' && <AdminView />}
        </div>
      </div>

      {/* FLOATING AI CHAT BUBBLE (Bottom Right) */}
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
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Brain size={16} style={{ color: 'var(--color-purple)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{getCustomText('TravelUZ Co-pilot')}</span>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ color: 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Message History */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="floating-chat-scroll">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--color-accent), var(--color-purple))' : 'var(--color-bg)',
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--color-text-primary)',
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
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'left' }}>{getCustomText('Claude is thinking...')}</span>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleFloatingChatSend} style={{ padding: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px', background: 'var(--color-bg)' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('dashboard.chatPlaceholder')}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontSize: '0.8rem' }}
                />
                <button type="submit" className="btn-premium" style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', textTransform: 'none', fontSize: '0.75rem' }}>{t('dashboard.sendBtn')}</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bubble Toggle button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(var(--color-accent-raw), 0.3)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (< 768px) */}
      <nav className="mobile-bottom-tabs" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 999
      }}>
        {[
          { id: 'home', label: t('dashboard.sidebarHome'), icon: <Globe size={18} /> },
          { id: 'planner', label: t('dashboard.sidebarPlanner'), icon: <Brain size={18} /> },
          { id: 'my-trips', label: t('dashboard.sidebarMyTrips'), icon: <Calendar size={18} /> },
          { id: 'assistant', label: t('dashboard.sidebarAssistant'), icon: <MessageSquare size={18} /> },
          { id: 'profile', label: t('dashboard.sidebarProfile'), icon: <User size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* CSS adjustments for mobile styling */}
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
            padding-bottom: 60px !important;
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
