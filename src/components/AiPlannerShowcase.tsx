'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Calendar, DollarSign, Compass, Utensils, Check, Brain, Clock } from '../icons';
import { useTheme } from '../context/ThemeContext';

interface AiPlannerShowcaseProps {
  onStartPlanning: (destination?: string, customParams?: any) => void;
}

interface PlannerPreset {
  id: string;
  destination: string;
  duration: string;
  budget: string;
  style: string;
  interests: string[];
  itinerarySummary: {
    title: string;
    highlights: string[];
    stay: string;
    route: string;
    dailyPreview: { day: string; title: string; desc: string }[];
  };
}

const PLANNER_PRESETS: PlannerPreset[] = [
  {
    id: 'japan',
    destination: 'Japan (Tokyo & Kyoto)',
    duration: '7 Days',
    budget: '$1,500',
    style: 'Balanced Culture & Food',
    interests: ['Food & Gastronomy', 'Ancient Temples', 'Futuristic Tech', 'Nature'],
    itinerarySummary: {
      title: '7-Day Neon Skylines & Historic Shrines',
      highlights: ['Tsukiji Outer Market Food Tour', 'Fushimi Inari Torii Gate Sunrise', 'teamLab Planets Immersive Art'],
      stay: 'Park Hotel Tokyo (Tokyo Tower view) — $145/night',
      route: 'Tokyo (3d) → Shinkansen Bullet Train → Kyoto (3d) → Nara Day Trip (1d)',
      dailyPreview: [
        { day: 'Day 1', title: 'Arrival & Shibuya Sky Lights', desc: 'Evening crossing, cocktail observation deck, ramen tasting in Shinjuku' },
        { day: 'Day 2', title: 'Ancient Asakusa & Akihabara Tech', desc: 'Senso-ji temple morning ritual, electric town gadgets, tea ceremony' },
        { day: 'Day 3-4', title: 'Shinkansen to Kyoto Imperial Heart', desc: 'Arashiyama bamboo grove, Gion geisha district, traditional Kaiseki dinner' },
        { day: 'Day 5-7', title: 'Fushimi Inari & Historic Nara', desc: '10,000 vermilion torii gates, Nara deer park, return bullet train' }
      ]
    }
  },
  {
    id: 'italy',
    destination: 'Italy (Amalfi Coast & Rome)',
    duration: '8 Days',
    budget: '$1,800',
    style: 'Romance & Gastronomy',
    interests: ['Seaside & Beaches', 'Michelin Pasta', 'Renaissance Art', 'Wine Tasting'],
    itinerarySummary: {
      title: '8-Day Mediterranean Coast & Eternal City',
      highlights: ['Private Capri Boat Cruise', 'Colosseum Gladiator Gate Tour', 'Positano Cliffside Cooking Class'],
      stay: 'Villa TreVille Boutique Resort (Positano) — $160/night',
      route: 'Rome (3d) → High-speed Frecciarossa → Naples → Amalfi Coast (5d)',
      dailyPreview: [
        { day: 'Day 1-2', title: 'Eternal Rome & Trastevere Evenings', desc: 'Colosseum VIP sunrise tour, Pantheon espresso, handmade cacio e pepe' },
        { day: 'Day 3', title: 'Vatican & Scenic High-Speed Train', desc: 'Sistine Chapel private entrance, sunset coastal drive to Positano' },
        { day: 'Day 4-6', title: 'Amalfi Coastline & Capri Cruise', desc: 'Private wooden boat to Blue Grotto, Ravello panoramic gardens' },
        { day: 'Day 7-8', title: 'Path of the Gods & Farewell Feast', desc: 'Cliffside coastal hike, limoncello tasting, sunset aperitivo over the bay' }
      ]
    }
  },
  {
    id: 'uzbekistan',
    destination: 'Uzbekistan (Silk Road Oasis)',
    duration: '6 Days',
    budget: '$750',
    style: 'Heritage & Architecture',
    interests: ['Silk Road History', 'Mosaic Architecture', 'Local Bazaars', 'Culinary'],
    itinerarySummary: {
      title: '6-Day Turquoise Domes & Silk Road Wonders',
      highlights: ['Registan Square Golden Hour', 'Bukhara Ancient Ark Fortress', 'Siab Traditional Spice Market'],
      stay: 'Boutique Silk Road Caravanserai Hotel — $65/night',
      route: 'Tashkent (1d) → Afrosiyob Bullet Train → Samarkand (3d) → Bukhara (2d)',
      dailyPreview: [
        { day: 'Day 1', title: 'Tashkent Modern Meets History', desc: 'Hazrati Imam Complex, modern underground metro architecture tour' },
        { day: 'Day 2-3', title: 'Magical Samarkand & Registan', desc: 'Gur-e-Amir mausoleum, Shah-i Zinda azure tilework, authentic plov dinner' },
        { day: 'Day 4-5', title: 'Bukhara Silk Road Living Museum', desc: 'Kalyan Minaret, historic trading domes, hammam bathhouse ritual' },
        { day: 'Day 6', title: 'Palace of Moon & Stars', desc: 'Last royal residence of Bukhara emirs, artisan carpet workshop' }
      ]
    }
  },
  {
    id: 'france',
    destination: 'France (Paris & French Riviera)',
    duration: '7 Days',
    budget: '$1,600',
    style: 'Art & Coastal Luxury',
    interests: ['Louvre & Art', 'French Bakeries', 'Riviera Strolls', 'Wine Vineyards'],
    itinerarySummary: {
      title: '7-Day Parisian Charm & Cote d’Azur Radiance',
      highlights: ['Seine River Sunset Cruise', 'Louvre Museum Guided Masterpieces', 'Nice Promenade & Eze Village'],
      stay: 'Hotel Saint-Germain Boutique (Paris) — $150/night',
      route: 'Paris (4d) → TGV High-Speed Rail → Nice & Monaco (3d)',
      dailyPreview: [
        { day: 'Day 1-2', title: 'Iconic Paris & Montmartre', desc: 'Eiffel Tower champagne cruise, Sacré-Cœur painters square, fresh croissants' },
        { day: 'Day 3-4', title: 'The Louvre & Marais Boutiques', desc: 'Skip-the-line gallery access, vintage bistro dining, Latin Quarter' },
        { day: 'Day 5-7', title: 'Sunny Cote d’Azur & Medieval Eze', desc: 'Promenade des Anglais bike ride, panoramic cliffside garden views' }
      ]
    }
  }
];

export const AiPlannerShowcase: React.FC<AiPlannerShowcaseProps> = ({ onStartPlanning }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Interactive Form State
  const [selectedPreset, setSelectedPreset] = useState<string>('japan');
  const [customDestination, setCustomDestination] = useState('Japan');
  const [customDays, setCustomDays] = useState('7 days');
  const [customBudget, setCustomBudget] = useState('$1,500');
  const [customStyle, setCustomStyle] = useState('Food · Culture · Nature');

  const activePreset = PLANNER_PRESETS.find(p => p.id === selectedPreset) || PLANNER_PRESETS[0];

  const handleSelectPreset = (preset: PlannerPreset) => {
    setSelectedPreset(preset.id);
    setCustomDestination(preset.destination);
    setCustomDays(preset.duration);
    setCustomBudget(preset.budget);
    setCustomStyle(preset.interests.slice(0, 3).join(' · '));
  };

  return (
    <section
      id="ai-planner"
      style={{
        padding: '100px 24px',
        maxWidth: '1380px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Editorial Section Headline Block */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '920px',
          margin: '0 auto 60px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: '#7C3AED',
            background: isLight ? 'rgba(124, 58, 237, 0.08)' : 'rgba(129, 140, 248, 0.12)',
            padding: '6px 18px',
            borderRadius: '50px'
          }}
        >
          AUTONOMOUS TRIP SYNTHESIS
        </span>

        {/* Editorial Exact Two-Tier Headline */}
        <h2
          style={{
            fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1px',
            color: 'var(--color-text-primary)',
            margin: 0
          }}
        >
          YOU CHOOSE<br />
          <span style={{ color: '#2563EB' }}>THE DESTINATION.</span><br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>TRIPMIND</span><br />
          BUILDS THE JOURNEY.
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: '640px',
            margin: 0,
            lineHeight: 1.6
          }}
        >
          State-of-the-art travel intelligence algorithms map flights, boutique hotels, route pacing, opening hours, and budget allocations in seconds.
        </p>

        {/* Quick Sample Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px'
          }}
        >
          {PLANNER_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  padding: '8px 16px',
                  borderRadius: '50px',
                  border: isSelected
                    ? '2px solid #2563EB'
                    : isLight
                    ? '1px solid rgba(229, 231, 235, 0.9)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  background: isSelected
                    ? isLight
                      ? 'rgba(37, 99, 235, 0.1)'
                      : 'rgba(37, 99, 235, 0.25)'
                    : 'var(--color-bg-surface)',
                  color: isSelected ? '#2563EB' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                ✨ {preset.destination.split(' ')[0]} ({preset.duration})
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic Interactive Planner UI Stage */}
      <div
        style={{
          background: 'var(--color-bg-surface)',
          borderRadius: '32px',
          border: isLight ? '1px solid rgba(229, 231, 235, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isLight
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(37, 99, 235, 0.04)'
            : '0 30px 80px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(37, 99, 235, 0.15)',
          padding: 'clamp(24px, 3.5vw, 44px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 420px) 1fr',
          gap: 'clamp(24px, 3.5vw, 48px)',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="planner-showcase-grid"
      >
        {/* LEFT COLUMN: Input Form Interface */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: isLight ? '#FAF9F6' : 'rgba(11, 15, 23, 0.7)',
            padding: '28px',
            borderRadius: '24px',
            border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: '#2563EB' }} />
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: 0
              }}
            >
              Trip Parameter Configuration
            </h3>
          </div>

          {/* Field 1: Where do you want to go? */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MapPin size={14} style={{ color: '#2563EB' }} />
              Where do you want to go?
            </label>
            <input
              type="text"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
              placeholder="e.g. Japan, Italy, Uzbekistan..."
              style={{
                fontFamily: "'Inter', sans-serif",
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--color-bg-surface)',
                border: isLight ? '1px solid #D1D5DB' : '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--color-text-primary)',
                fontSize: '0.92rem',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            />
          </div>

          {/* Field 2: When & Duration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={14} style={{ color: '#7C3AED' }} />
              Duration / When?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['5 days', '7 days', '10 days'].map((days) => (
                <button
                  key={days}
                  onClick={() => setCustomDays(days)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    padding: '8px 10px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: customDays.toLowerCase().includes(days.split(' ')[0]) ? 800 : 600,
                    background: customDays.toLowerCase().includes(days.split(' ')[0])
                      ? '#2563EB'
                      : 'var(--color-bg-surface)',
                    color: customDays.toLowerCase().includes(days.split(' ')[0])
                      ? '#FFFFFF'
                      : 'var(--color-text-primary)',
                    border: isLight ? '1px solid #D1D5DB' : '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>

          {/* Field 3: Budget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <DollarSign size={14} style={{ color: '#10B981' }} />
              Estimated Budget
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['$800', '$1,500', '$2,500'].map((b) => (
                <button
                  key={b}
                  onClick={() => setCustomBudget(b)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    padding: '8px 10px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: customBudget === b ? 800 : 600,
                    background: customBudget === b
                      ? '#10B981'
                      : 'var(--color-bg-surface)',
                    color: customBudget === b ? '#FFFFFF' : 'var(--color-text-primary)',
                    border: isLight ? '1px solid #D1D5DB' : '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Field 4: Travel Style & Interests */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={14} style={{ color: '#EC4899' }} />
              Travel Style & Interests
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Food & Dining', 'Culture & History', 'Nature & Scenic', 'Beaches', 'Adventure'].map((interest) => (
                <span
                  key={interest}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: 'var(--color-bg-surface)',
                    border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  ✓ {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartPlanning(customDestination)}
            style={{
              fontFamily: "'Inter', sans-serif",
              marginTop: '8px',
              padding: '16px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)'
            }}
          >
            <span>Build my trip</span>
            <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* RIGHT COLUMN: Live Generated AI Blueprint */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'space-between'
          }}
        >
          {/* Header Card */}
          <div
            style={{
              background: isLight ? '#FAF9F6' : 'rgba(11, 15, 23, 0.6)',
              padding: '24px',
              borderRadius: '20px',
              border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                ✓ SYNTHESIZED ITINERARY BLUEPRINT
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                {customDays} • {customBudget} Limit
              </span>
            </div>

            <h4
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 6px 0'
              }}
            >
              {activePreset.itinerarySummary.title}
            </h4>

            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <strong>Transit Flow:</strong> {activePreset.itinerarySummary.route}
            </p>
          </div>

          {/* Daily Schedule Step Flow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-text-muted)'
              }}
            >
              Day-by-Day Schedule Highlights
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {activePreset.itinerarySummary.dailyPreview.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: isLight ? '#FAF9F6' : 'rgba(11, 15, 23, 0.6)',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: '#2563EB',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {item.day}
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                      {item.title}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel & Transport Verification Footer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              paddingTop: '12px',
              borderTop: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🏨</span>
              <div style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>
                <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>Curated Boutique Stay</strong>
                <span style={{ color: 'var(--color-text-secondary)' }}>{activePreset.itinerarySummary.stay}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <div style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>
                <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>Budget Verified</strong>
                <span style={{ color: '#10B981', fontWeight: 700 }}>Optimal balance • 100% within range</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .planner-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
