import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe3D } from '../components/Globe3D';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, 
  Sparkles, Star, Users,
  Compass, Globe, Lock, Languages,
  MessageSquare, Hotel, Tag
} from 'lucide-react';

interface LandingPageProps {
  onStartPlanning: (countryId: string, initialView?: string) => void;
}

// Custom hook for count-up animations when element is in view
function useAnimatedCounter(target: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const totalMs = duration * 1000;
    const steps = 50;
    const intervalTime = totalMs / steps;
    const stepIncrement = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return { count, ref };
}

const getTranslation = (key: string, lang: string) => {
  const dict: Record<string, Record<'EN' | 'RU' | 'UZ', string>> = {
    'Explore World': { EN: 'Explore World', RU: 'Исследовать мир', UZ: 'Dunyoni o‘rganish' },
    'From City': { EN: 'From City', RU: 'Откуда', UZ: 'Qaysi shahardan' },
    'To City': { EN: 'To City', RU: 'Куда', UZ: 'Qaysi shaharga' },
    'Departure Date': { EN: 'Departure Date', RU: 'Дата вылета', UZ: 'Uchish sanasi' },
    'Return Date': { EN: 'Return Date', RU: 'Дата возвращения', UZ: 'Qaytish sanasi' },
    'Travelers': { EN: 'Travelers', RU: 'Пассажиры', UZ: 'Yo‘lovchilar' },
    'Class': { EN: 'Class', RU: 'Класс', UZ: 'Klass' },
    'Search': { EN: 'Search', RU: 'Поиск', UZ: 'Qidirish' },
    'City': { EN: 'City', RU: 'Город', UZ: 'Shahar' },
    'Check-in': { EN: 'Check-in', RU: 'Дата заезда', UZ: 'Kirish sanasi' },
    'Check-out': { EN: 'Check-out', RU: 'Дата выезда', UZ: 'Chiqish sanasi' },
    'Guests': { EN: 'Guests', RU: 'Гости', UZ: 'Mehmonlar' },
    'Rooms': { EN: 'Rooms', RU: 'Номера', UZ: 'Xonalar' },
    'Cuisine Type': { EN: 'Cuisine Type', RU: 'Тип кухни', UZ: 'Oshxona turi' },
    'Date': { EN: 'Date', RU: 'Дата', UZ: 'Sana' },
    'Time': { EN: 'Time', RU: 'Время', UZ: 'Vaqt' },
    'Find': { EN: 'Find', RU: 'Найти', UZ: 'Topish' },
    'Economy': { EN: 'Economy', RU: 'Эконом', UZ: 'Ekonom' },
    'Business': { EN: 'Business', RU: 'Бизнес', UZ: 'Biznes' },
    'First': { EN: 'First', RU: 'Первый', UZ: 'Birinchi klass' },
    'AI Itinerary Preview': { EN: 'AI Itinerary Preview', RU: 'Предпросмотр ИИ-Маршрута', UZ: 'AI Marshrut ko‘rinishi' },
    'Configure your next voyage': { EN: 'Configure your next voyage', RU: 'Настройте вашу следующую поездку', UZ: 'Sayohatni moslashtirish' },
    'Destination': { EN: 'Destination', RU: 'Направление', UZ: 'Boradigan shahar' },
    'Start': { EN: 'Start', RU: 'Начало', UZ: 'Boshlanishi' },
    'End': { EN: 'End', RU: 'Конец', UZ: 'Tugashi' },
    'Budget': { EN: 'Budget', RU: 'Бюджет', UZ: 'Byudjet' },
    'Travel Style': { EN: 'Travel Style', RU: 'Стиль поездки', UZ: 'Sayohat uslubi' },
    'Adventure': { EN: 'Adventure', RU: 'Приключения', UZ: 'Sarguzasht' },
    'Relaxation': { EN: 'Relaxation', RU: 'Релакс', UZ: 'Hordiq' },
    'Cultural': { EN: 'Cultural', RU: 'Культура', UZ: 'Madaniy' },
    'Food': { EN: 'Food', RU: 'Гастрономия', UZ: 'Gastro-sayohat' },
    'Luxury': { EN: 'Luxury', RU: 'Люкс', UZ: 'Lyuks' },
    'Generate My Trip': { EN: 'Generate My Trip', RU: 'Создать поездку', UZ: 'Sayohat yaratish' },
    'Start Free Planning': { EN: 'Start Free Planning', RU: 'Начать бесплатно', UZ: 'Bepul rejalashni boshlash' },
    'Sign In Now': { EN: 'Sign In Now', RU: 'Войти сейчас', UZ: 'Hisobga kirish' },
    'Flights': { EN: 'Flights', RU: 'Рейсы', UZ: 'Parvozlar' },
    'Hotels': { EN: 'Hotels', RU: 'Отели', UZ: 'Mehmonxonalar' },
    'Restaurants': { EN: 'Restaurants', RU: 'Рестораны', UZ: 'Restoranlar' },
    'AI Planner': { EN: 'AI Planner', RU: 'ИИ-Планировщик', UZ: 'AI Planner' },
    'Assistant': { EN: 'Assistant', RU: 'ИИ-Ассистент', UZ: 'AI Assistant' },
    'Saved': { EN: 'Saved', RU: 'Избранное', UZ: 'Saqlanganlar' },
  };
  const upperLang = (lang.toUpperCase() as 'EN' | 'RU' | 'UZ');
  return dict[key]?.[upperLang] || key;
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning }) => {
  const { t, language } = useLanguage();
  const { setShowAuthModal, user } = useAuth();
  
  // Tab switcher in Search Bar
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'restaurants'>('flights');

  // Flights Form State
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [flightDepDate, setFlightDepDate] = useState('');
  const [flightRetDate, setFlightRetDate] = useState('');
  const [flightTravelers, setFlightTravelers] = useState(1);
  const [flightClass, setFlightClass] = useState('Economy');

  // Hotels Form State
  const [hotelCity, setHotelCity] = useState('');
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [hotelGuests, setHotelGuests] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);

  // Restaurants Form State
  const [restCity, setRestCity] = useState('');
  const [restCuisine, setRestCuisine] = useState('');
  const [restDate, setRestDate] = useState('');
  const [restTime, setRestTime] = useState('');

  // AI Planner Preview Form State
  const [aiDest, setAiDest] = useState('');
  const [aiStartDate, setAiStartDate] = useState('');
  const [aiEndDate, setAiEndDate] = useState('');
  const [aiBudget, setAiBudget] = useState(1500);
  const [aiTravelers, setAiTravelers] = useState(2);
  const [aiStyle, setAiStyle] = useState('Adventure');

  // Helper to handle authenticated clicks
  const handleAuthGate = (destinationView: string) => {
    if (user) {
      onStartPlanning('uzbekistan', destinationView);
    } else {
      localStorage.setItem('auth_redirect_view', destinationView);
      setShowAuthModal(true);
    }
  };

  // Stats Counters
  const stat1 = useAnimatedCounter(200, 1.5);
  const stat2 = useAnimatedCounter(10, 1.5); // represents 10K+
  const stat3 = useAnimatedCounter(1, 1.5);  // represents 1M+

  // Section animation config
  const sectionAnimation = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' }
  } as const;

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: 'var(--color-bg)' }}>
      
      {/* SECTION 1 — HERO */}
      <motion.section 
        {...sectionAnimation}
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 24px',
          overflow: 'hidden',
          zIndex: 10
        }}
      >
        {/* Hero Top Title & Value Proposition */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '850px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Badge */}
          <span style={{
            background: 'rgba(37, 99, 235, 0.12)',
            color: '#60A5FA',
            padding: '6px 18px',
            borderRadius: '100px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} /> Global AI Travel Platform
          </span>

          {/* Headline */}
          <h1 className="text-gradient" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            margin: 0
          }}>
            {t('hero.headline')}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: 0
          }}>
            Explore global destinations on the interactive 3D Earth. Search cities, follow realistic flight paths, and craft tailored itineraries with AI intelligence.
          </p>
        </div>

        {/* INTERACTIVE 3D EARTH GLOBE ARENA */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: '1240px',
          height: '620px',
          borderRadius: '28px',
          border: '1px solid var(--glass-border)',
          background: 'radial-gradient(circle at 50% 50%, rgba(13, 21, 39, 0.7) 0%, rgba(6, 9, 20, 0.95) 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden'
        }}>
          <Globe3D 
            selectedCountryId="uzbekistan"
            showSearchBar={true}
            onSelectCountry={(id) => {
              // Country selected on globe
            }}
            onCreateTrip={(dest) => {
              handleAuthGate('planner');
            }}
          />
        </div>
      </motion.section>

      {/* SECTION 2 — SEARCH BAR */}
      <motion.section 
        {...sectionAnimation}
        style={{
          position: 'relative',
          zIndex: 20,
          padding: '0 24px 60px 24px',
          marginTop: '-60px'
        }}
      >
        <div 
          className="glass-panel" 
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '24px 32px',
            boxShadow: 'var(--glass-shadow)',
            background: 'var(--color-bg-surface)'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '24px' }}>
            {[
              { id: 'flights', label: '✈️ ' + getTranslation('Flights', language) },
              { id: 'hotels', label: '🏨 ' + getTranslation('Hotels', language) },
              { id: 'restaurants', label: '🍽️ ' + getTranslation('Restaurants', language) }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--color-accent)' : 'none',
                  paddingBottom: '12px',
                  marginBottom: '-14px',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div style={{ textAlign: 'left' }}>
            {activeTab === 'flights' && (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAuthGate('flights'); }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', alignItems: 'end' }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('From City', language)}</label>
                  <input type="text" required placeholder="Tashkent" value={flightFrom} onChange={(e) => setFlightFrom(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('To City', language)}</label>
                  <input type="text" required placeholder="Paris" value={flightTo} onChange={(e) => setFlightTo(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Departure Date', language)}</label>
                  <input type="date" required value={flightDepDate} onChange={(e) => setFlightDepDate(e.target.value)} style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Return Date', language)}</label>
                  <input type="date" required value={flightRetDate} onChange={(e) => setFlightRetDate(e.target.value)} style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Travelers', language)}</label>
                  <input type="number" min={1} max={10} value={flightTravelers} onChange={(e) => setFlightTravelers(parseInt(e.target.value))} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Class', language)}</label>
                  <select value={flightClass} onChange={(e) => setFlightClass(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }}>
                    <option value="Economy">{getTranslation('Economy', language)}</option>
                    <option value="Business">{getTranslation('Business', language)}</option>
                    <option value="First">{getTranslation('First', language)}</option>
                  </select>
                </div>
                <button type="submit" className="btn-premium" style={{ height: '45px', border: 'none', width: '100%' }}>
                  {getTranslation('Search', language)}
                </button>
              </form>
            )}

            {activeTab === 'hotels' && (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAuthGate('hotels'); }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', alignItems: 'end' }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('City', language)}</label>
                  <input type="text" required placeholder="Dubai" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Check-in', language)}</label>
                  <input type="date" required value={hotelCheckIn} onChange={(e) => setHotelCheckIn(e.target.value)} style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Check-out', language)}</label>
                  <input type="date" required value={hotelCheckOut} onChange={(e) => setHotelCheckOut(e.target.value)} style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Guests', language)}</label>
                  <input type="number" min={1} value={hotelGuests} onChange={(e) => setHotelGuests(parseInt(e.target.value))} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Rooms', language)}</label>
                  <input type="number" min={1} value={hotelRooms} onChange={(e) => setHotelRooms(parseInt(e.target.value))} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <button type="submit" className="btn-premium" style={{ height: '45px', border: 'none', width: '100%' }}>
                  {getTranslation('Search', language)}
                </button>
              </form>
            )}

            {activeTab === 'restaurants' && (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAuthGate('attractions'); }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', alignItems: 'end' }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('City', language)}</label>
                  <input type="text" required placeholder="Tokyo" value={restCity} onChange={(e) => setRestCity(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Cuisine Type', language)}</label>
                  <input type="text" placeholder="Sushi, Italian, local" value={restCuisine} onChange={(e) => setRestCuisine(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Date', language)}</label>
                  <input type="date" required value={restDate} onChange={(e) => setRestDate(e.target.value)} style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{getTranslation('Time', language)}</label>
                  <input type="time" required value={restTime} onChange={(e) => setRestTime(e.target.value)} style={{ padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', width: '100%' }} />
                </div>
                <button type="submit" className="btn-premium" style={{ height: '45px', border: 'none', width: '100%' }}>
                  {getTranslation('Find', language)}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 — CATEGORY PILLS */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center' }}
      >
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '10px 0', maxWidth: '100%', scrollbarWidth: 'none' }}>
          {[
            { label: '✈️ ' + getTranslation('Flights', language), view: 'flights' },
            { label: '🏨 ' + getTranslation('Hotels', language), view: 'hotels' },
            { label: '🍽️ ' + getTranslation('Restaurants', language), view: 'attractions' },
            { label: '🤖 ' + getTranslation('AI Planner', language), view: 'planner' },
            { label: '💬 ' + getTranslation('Assistant', language), view: 'assistant' },
            { label: '❤️ ' + getTranslation('Saved', language), view: 'saved' }
          ].map((pill, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05, borderColor: 'var(--color-accent)' }}
              onClick={() => handleAuthGate(pill.view)}
              className="glass-panel"
              style={{
                padding: '10px 20px',
                borderRadius: '50px',
                background: 'var(--glass-bg)',
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {pill.label}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* SECTION 4 — STATS BANNER */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px' }}
      >
        <div 
          className="glass-panel"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #091026 0%, #050815 100%)',
            color: '#ffffff',
            padding: '40px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {/* Col 1 */}
          <div ref={stat1.ref} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
              {stat1.count}+
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>{t('stats.countries')}</span>
          </div>

          {/* Col 2 */}
          <div ref={stat2.ref} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--color-purple)' }}>
              {stat2.count}K+
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>{t('stats.destinations')}</span>
          </div>

          {/* Col 3 */}
          <div ref={stat3.ref} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#10b981' }}>
              {stat3.count}M+
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>{t('stats.travelers')}</span>
          </div>

          {/* Col 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#f59e0b' }}>
              24/7
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>{t('stats.support')}</span>
          </div>
        </div>
      </motion.section>

      {/* SECTION 5 — POPULAR DESTINATIONS */}
      <motion.section 
        {...sectionAnimation}
        id="destinations"
        style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="section-title text-gradient" style={{ margin: 0, fontSize: '2.2rem', textAlign: 'left' }}>
            {t('destinations.title')}
          </h2>
          <a href="#explore" onClick={(e) => { e.preventDefault(); handleAuthGate('home'); }} style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            {t('destinations.seeAll')}
          </a>
        </div>

        {/* Horizontal Scroll list */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
          {[
            { city: 'Istanbul', country: 'Turkey', keyword: 'turkey,istanbul', flag: '🇹🇷', rating: '4.8', price: '$750', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80' },
            { city: 'Dubai', country: 'UAE', keyword: 'dubai,emirates', flag: '🇦🇪', rating: '4.8', price: '$850', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
            { city: 'Paris', country: 'France', keyword: 'paris,france', flag: '🇫🇷', rating: '4.7', price: '$900', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
            { city: 'Phuket', country: 'Thailand', keyword: 'thailand,phuket', flag: '🇹🇭', rating: '4.7', price: '$650', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80' },
            { city: 'Maldives', country: 'Maldives', keyword: 'maldives,beach', flag: '🇲🇻', rating: '4.9', price: '$1200', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80' },
            { city: 'Samarkand', country: 'Uzbekistan', keyword: 'samarkand,registan', flag: '🇺🇿', rating: '4.9', price: '$450', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80' }
          ].map((dest, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass-panel"
              style={{
                flex: '0 0 280px',
                overflow: 'hidden',
                borderRadius: '24px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
                cursor: 'pointer'
              }}
              onClick={() => handleAuthGate('planner')}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={dest.image}
                  alt={dest.city}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)'
                }} />
                
                {/* Rating */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Star size={12} fill="#d97706" stroke="none" /> {dest.rating}
                </div>

                {/* Price badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}>
                  From {dest.price}
                </div>
              </div>

              {/* Card Footer Details */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase' }}>
                  {dest.flag} {dest.country}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                  {dest.city}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 6 — AI PLANNER PREVIEW */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: '32px',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          boxShadow: 'var(--glass-shadow)'
        }}>
          {/* Left: configuration form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <span style={{ color: 'var(--color-purple)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Brain size={16} /> {getTranslation('AI Itinerary Preview', language)}
            </span>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              {getTranslation('Configure your next voyage', language)}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>{getTranslation('Destination', language)}</label>
                <input type="text" placeholder="Samarkand, Uzbekistan" value={aiDest} onChange={(e) => setAiDest(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>{getTranslation('Start', language)}</label>
                  <input type="date" value={aiStartDate} onChange={(e) => setAiStartDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>{getTranslation('End', language)}</label>
                  <input type="date" value={aiEndDate} onChange={(e) => setAiEndDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  <span>{getTranslation('Budget', language)}</span>
                  <span>${aiBudget}</span>
                </div>
                <input type="range" min={500} max={10000} step={250} value={aiBudget} onChange={(e) => setAiBudget(parseInt(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '4px', background: 'var(--glass-border)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>{getTranslation('Travelers', language)}</label>
                  <input type="number" min={1} max={10} value={aiTravelers} onChange={(e) => setAiTravelers(parseInt(e.target.value))} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>{getTranslation('Travel Style', language)}</label>
                  <select value={aiStyle} onChange={(e) => setAiStyle(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }}>
                    <option value="Adventure">{getTranslation('Adventure', language)}</option>
                    <option value="Relaxation">{getTranslation('Relaxation', language)}</option>
                    <option value="Cultural">{getTranslation('Cultural', language)}</option>
                    <option value="Food">{getTranslation('Food', language)}</option>
                    <option value="Luxury">{getTranslation('Luxury', language)}</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleAuthGate('planner')}
              className="btn-premium"
              style={{ border: 'none', background: 'linear-gradient(135deg, var(--color-purple), var(--color-accent))', width: '100%', marginTop: '8px' }}
            >
              <Sparkles size={16} /> {getTranslation('Generate My Trip', language)}
            </button>
          </div>

          {/* Right: SVG mapping visualizer */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            height: '350px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Grid lines background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(var(--glass-border) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.8
            }} />

            {/* Custom SVG mapping */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'relative', zIndex: 5 }}>
              {/* Path 1 */}
              <motion.path 
                d="M 15 80 Q 50 30 85 20" 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="1.5"
                strokeDasharray="4,4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Path 2 */}
              <motion.path 
                d="M 85 20 Q 75 75 40 85" 
                fill="none" 
                stroke="var(--color-purple)" 
                strokeWidth="1"
                strokeDasharray="3,3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />

              {/* Node A (Tashkent) */}
              <g transform="translate(15,80)">
                <circle r="4" fill="var(--color-accent)" />
                <circle r="8" fill="none" stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.6">
                  <animate attributeName="r" values="4;12;4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <text y="-8" fontSize="4.5" fontWeight="bold" fill="var(--color-text-primary)" textAnchor="middle">Tashkent</text>
              </g>

              {/* Node B (Paris) */}
              <g transform="translate(85,20)">
                <circle r="4" fill="#10b981" />
                <circle r="8" fill="none" stroke="#10b981" strokeWidth="0.75" opacity="0.6">
                  <animate attributeName="r" values="4;12;4" dur="3s" repeatCount="indefinite" />
                </circle>
                <text y="-8" fontSize="4.5" fontWeight="bold" fill="var(--color-text-primary)" textAnchor="middle">Paris</text>
              </g>

              {/* Node C (Samarkand) */}
              <g transform="translate(40,85)">
                <circle r="3" fill="var(--color-purple)" />
                <text y="8" fontSize="4.5" fontWeight="bold" fill="var(--color-text-muted)" textAnchor="middle">Samarkand</text>
              </g>
            </svg>
          </div>
        </div>
      </motion.section>

      {/* SECTION 7 — HOW IT WORKS */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <h2 className="section-title text-gradient">{t('howItWorks.title')}</h2>
        <p className="section-subtitle">{t('howItWorks.subtitle')}</p>

        {/* Steps Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          alignItems: 'stretch', 
          gap: '24px',
          position: 'relative'
        }} className="steps-container-landing">
          {[
            { id: '01', color: 'rgba(14, 165, 233, 0.1)', textCol: 'var(--color-accent)', titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc' },
            { id: '02', color: 'rgba(99, 102, 241, 0.1)', textCol: 'var(--color-purple)', titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc' },
            { id: '03', color: 'rgba(245, 158, 11, 0.1)', textCol: 'var(--color-accent-gold)', titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc' },
            { id: '04', color: 'rgba(16, 185, 129, 0.1)', textCol: '#10b981', titleKey: 'howItWorks.step4Title', descKey: 'howItWorks.step4Desc' },
            { id: '05', color: 'rgba(236, 72, 153, 0.1)', textCol: '#ec4899', titleKey: 'howItWorks.step5Title', descKey: 'howItWorks.step5Desc' },
            { id: '06', color: 'rgba(139, 92, 246, 0.1)', textCol: '#8b5cf6', titleKey: 'howItWorks.step6Title', descKey: 'howItWorks.step6Desc' }
          ].map((step, idx) => (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ 
                padding: '32px 20px', 
                textAlign: 'center', 
                background: 'var(--color-bg-surface)', 
                minHeight: '240px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px',
                border: '1px solid var(--glass-border)'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step.color, color: step.textCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                {step.id}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {t(step.titleKey)}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 8 — WHY TRAVELUZ */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <h2 className="section-title text-gradient">{t('why.title')}</h2>
        <p className="section-subtitle">{t('why.subtitle')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { title: t('why.card1Title'), desc: t('why.card1Desc'), icon: <Brain size={28} />, color: 'var(--color-purple)' },
            { title: t('why.card2Title'), desc: t('why.card2Desc'), icon: <Compass size={28} />, color: 'var(--color-accent)' },
            { title: t('why.card3Title'), desc: t('why.card3Desc'), icon: <Tag size={28} />, color: '#10b981' },
            { title: t('why.card4Title'), desc: t('why.card4Desc'), icon: <Hotel size={28} />, color: '#f59e0b' },
            { title: t('why.card5Title'), desc: t('why.card5Desc'), icon: <Globe size={28} />, color: '#06b6d4' },
            { title: t('why.card6Title'), desc: t('why.card6Desc'), icon: <Lock size={28} />, color: '#ef4444' },
            { title: t('why.card7Title'), desc: t('why.card7Desc'), icon: <Languages size={28} />, color: '#8b5cf6' },
            { title: t('why.card8Title'), desc: t('why.card8Desc'), icon: <MessageSquare size={28} />, color: '#ec4899' }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="glass-panel"
              style={{
                padding: '32px 24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <div style={{
                color: feat.color,
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '16px',
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 9 — USER STORIES */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <h2 className="section-title text-gradient">{t('userStories.title')}</h2>
        <p className="section-subtitle">{t('userStories.subtitle')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            { title: t('userStories.card1Title'), desc: t('userStories.card1Desc'), icon: <Users size={28} />, color: 'var(--color-accent)' },
            { title: t('userStories.card2Title'), desc: t('userStories.card2Desc'), icon: <Sparkles size={28} />, color: 'var(--color-purple)' },
            { title: t('userStories.card3Title'), desc: t('userStories.card3Desc'), icon: <Compass size={28} />, color: '#10b981' }
          ].map((story, idx) => (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{
                padding: '36px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <div style={{
                color: story.color,
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '16px',
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
              }}>
                {story.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {story.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {story.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 10 — CTA BANNER */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px' }}
      >
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '32px',
          maxWidth: '1200px',
          margin: '0 auto',
          boxShadow: 'var(--glass-shadow)',
          border: '1px solid var(--glass-border)',
          background: 'linear-gradient(-45deg, #1a73e8, #7c3aed, #ec4899, #10b981)',
          backgroundSize: '400% 400%',
          animation: 'gradientFlow 15s ease infinite',
        }} className="cta-banner-wrapper">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes gradientFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}} />

          {/* Transparent Backdrop Layer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5, 8, 20, 0.75)',
            backdropFilter: 'blur(4px)'
          }} />

          <div style={{
            position: 'relative',
            padding: '80px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            zIndex: 5
          }}>
            <Sparkles size={40} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#ffffff', margin: 0 }}>
              {t('cta.title')}
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '1.15rem', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
              {t('cta.subtitle')}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                onClick={() => handleAuthGate('planner')}
                className="btn-premium"
                style={{ padding: '16px 48px', border: 'none', background: '#ffffff', color: '#1f2937' }}
              >
                {t('cta.primaryButton')}
              </button>
              <button 
                onClick={() => handleAuthGate('planner')}
                className="btn-secondary"
                style={{ padding: '16px 48px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)', background: 'transparent' }}
              >
                {t('cta.secondaryButton')}
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 11 — APP DOWNLOAD */}
      <motion.section 
        {...sectionAnimation}
        style={{ padding: '60px 24px 100px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          textAlign: 'left'
        }}>
          {/* Mockup photo */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '280px',
              height: '560px',
              borderRadius: '40px',
              border: '12px solid #1f2937',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&h=1200&q=80"
                alt="App Interface"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Overlay elements */}
              <div style={{ position: 'absolute', top: '24px', left: '16px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800, color: '#111827' }}>
                📍 Maldives Golden Stay
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.2 }}>
              {t('appDownload.title')}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
              {t('appDownload.subtitle')}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button 
                onClick={() => alert('App Store redirecting...')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid #1f2937'
                }}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.08.3.08.92-.08 1.91-.6 2.51-1.41"/></svg>
                <span>App Store</span>
              </button>

              <button 
                onClick={() => alert('Play Store redirecting...')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid #1f2937'
                }}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M5.23 2.06c-.19.2-.3.5-.3.9v18.08c0 .4.11.7.3.9l.06.06L15.35 12l.06-.06L5.29 2 Z M18.42 8.94 l-3.01 3.06 3.01 3.06 3.55-2.02c1.01-.57 1.01-1.5 0-2.07l-3.55-2.03 Z M5.95 21.02L14.74 12.24 5.95 3.46Z"/></svg>
                <span>Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};
