'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Calendar, ChevronRight, ChevronLeft } from '../icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../locales/translations';

export interface DestinationStoryItem {
  id: string;
  country: string;
  flag: string;
  cities: string;
  tagline: string;
  description: string;
  category: string;
  estimatedBudget: string;
  duration: string;
  bestSeason: string;
  image: string;
  highlights: string[];
}

export const STORY_DESTINATIONS: DestinationStoryItem[] = [
  {
    id: 'france',
    country: 'France',
    flag: '🇫🇷',
    cities: 'Paris · Nice · Bordeaux',
    tagline: 'Art, food and coastal elegance.',
    description: 'Wander through the golden halls of the Louvre, savor vintage Grand Crus among Bordeaux vineyards, and bask in the timeless azure glow of the French Riviera.',
    category: 'Art & Gastronomy',
    estimatedBudget: '$1,200',
    duration: '7–10 Days',
    bestSeason: 'May – October',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85',
    highlights: ['Louvre Private Tour', 'Bordeaux Vineyard Tasting', 'Nice Promenade des Anglais']
  },
  {
    id: 'japan',
    country: 'Japan',
    flag: '🇯🇵',
    cities: 'Tokyo · Kyoto · Mount Fuji',
    tagline: 'Tradition meets tomorrow.',
    description: 'Immerse yourself in neon-lit futuristic metropolises, tranquil moss-carpeted Shinto shrines, Shinkansen bullet train crossings, and Michelin-starred culinary artistry.',
    category: 'Culture & Modernity',
    estimatedBudget: '$1,450',
    duration: '9–14 Days',
    bestSeason: 'March – May, Oct – Nov',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    highlights: ['Shibuya Sky Observation', 'Kyoto Fushimi Inari Torii', 'Lake Kawaguchiko Fuji View']
  },
  {
    id: 'morocco',
    country: 'Morocco',
    flag: '🇲🇦',
    cities: 'Marrakech · Chefchaouen · Sahara',
    tagline: 'Vibrant spice medinas and starlit dunes.',
    description: 'Discover labyrinthine ancient spice souks, peaceful courtyard riads adorned with zellij tilework, and unforgettable desert camps under infinite Saharan starlight.',
    category: 'Desert & Heritage',
    estimatedBudget: '$850',
    duration: '6–9 Days',
    bestSeason: 'September – April',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85',
    highlights: ['Jemaa el-Fnaa Night Market', 'Merzouga Sahara Stargazing', 'Chefchaouen Blue Alleys']
  },
  {
    id: 'iceland',
    country: 'Iceland',
    flag: '🇮🇸',
    cities: 'Reykjavik · Vik · Blue Lagoon',
    tagline: 'Nordic fire and ice odyssey.',
    description: 'Witness roaring glacial waterfalls, geothermal mineral springs, volcanic black sand shores, and the celestial dancing ribbons of the Aurora Borealis.',
    category: 'Adventure & Nature',
    estimatedBudget: '$1,350',
    duration: '5–8 Days',
    bestSeason: 'Year-round (Auroras Sep–Mar)',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=85',
    highlights: ['Geysir & Gullfoss Golden Circle', 'Reynisfjara Black Beach', 'Silfra Glacial Snorkeling']
  },
  {
    id: 'italy',
    country: 'Italy',
    flag: '🇮🇹',
    cities: 'Amalfi Coast · Rome · Florence',
    tagline: 'Sun-drenched cliffs and timeless Renaissance.',
    description: 'Cruise along pastel Mediterranean coastal cliffs, walk among ancient Roman coliseums, and indulge in artisanal gelato and handmade pasta under olive groves.',
    category: 'Romance & Food',
    estimatedBudget: '$1,150',
    duration: '7–12 Days',
    bestSeason: 'April – October',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85',
    highlights: ['Positano Cliffside Cruise', 'Vatican & Colosseum Walk', 'Tuscan Hilltown Wine Route']
  },
  {
    id: 'uzbekistan',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    cities: 'Samarkand · Bukhara · Khiva',
    tagline: 'Turquoise domes along the Silk Road.',
    description: 'Marvel at the majestic tiled madrasahs of Registan Square, explore thousand-year-old desert fortress cities, and experience legendary Silk Road hospitality.',
    category: 'Ancient Silk Road',
    estimatedBudget: '$650',
    duration: '6–10 Days',
    bestSeason: 'April – June, Sep – Nov',
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=85',
    highlights: ['Registan Golden Hour Tour', 'Bukhara Ark Citadel', 'Khiva Ichan Kala Ancient City']
  }
];

interface DestinationStorytellingProps {
  onSelectDestination: (countryId: string) => void;
}

export const DestinationStorytelling: React.FC<DestinationStorytellingProps> = ({ onSelectDestination }) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // 3D Card tilt state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringVisual, setIsHoveringVisual] = useState(false);

  // Smooth spring physics for 3D tilt
  const springConfig = { damping: 24, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Limit rotation to max 7 degrees for subtle premium physical feel
    rotateX.set(-offsetY * 7);
    rotateY.set(offsetX * 7);
    setMousePosition({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
    setIsHoveringVisual(false);
    rotateX.set(0);
    rotateY.set(0);
    setMousePosition({ x: 0, y: 0 });
  };

  const totalDestinations = STORY_DESTINATIONS.length;
  const current = STORY_DESTINATIONS[activeIndex];

  // Resolve translated destination properties
  const translatedDest = (translations[language]?.storytelling?.destinations as any)?.[current.id] 
    || (translations['en']?.storytelling?.destinations as any)?.[current.id];
  const cities = translatedDest?.cities || current.cities;
  const tagline = translatedDest?.tagline || current.tagline;
  const description = translatedDest?.description || current.description;
  const category = translatedDest?.category || current.category;
  const duration = translatedDest?.duration || current.duration;
  const bestSeason = translatedDest?.bestSeason || current.bestSeason;
  const highlights = translatedDest?.highlights || current.highlights;

  // Jump to specific destination smoothly
  const scrollToDestination = (index: number) => {
    setActiveIndex(index);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % totalDestinations;
    setActiveIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + totalDestinations) % totalDestinations;
    setActiveIndex(prevIdx);
  };

  return (
    <div
      ref={containerRef}
      id="destinations"
      style={{
        position: 'relative',
        width: '100%',
        padding: '72px 24px',
        background: isLight ? 'var(--bg-primary, #FAF9F6)' : 'var(--bg-primary, #0B0F17)',
        transition: 'background-color 0.3s ease',
        overflow: 'hidden'
      }}
    >
      {/* Interactive Storytelling Viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1380px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Subtle Ambient Background Gradient that tints slightly per destination */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isLight
              ? 'radial-gradient(ellipse at 70% 40%, rgba(37, 99, 235, 0.05) 0%, rgba(250, 249, 246, 0.95) 75%)'
              : 'radial-gradient(ellipse at 70% 40%, rgba(37, 99, 235, 0.12) 0%, rgba(11, 15, 23, 0.98) 75%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Section Header: Premium Editorial Hierarchy */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1380px',
            width: '100%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: '#2563EB',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              {t('storytelling.badge')}
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--color-text-primary)',
                margin: 0,
                letterSpacing: '-0.5px'
              }}
            >
              {t('storytelling.title')}
            </h2>
          </div>

          {/* Desktop & Tablet Progress Bar with Clickable Destination Labels */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            {/* Desktop Full Navigation List */}
            <div
              className="desktop-progress-track"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(19, 30, 50, 0.85)',
                backdropFilter: 'blur(16px)',
                padding: '6px 12px',
                borderRadius: '50px',
                border: isLight ? '1px solid rgba(229, 231, 235, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.04)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              {STORY_DESTINATIONS.map((dest, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={dest.id}
                    onClick={() => scrollToDestination(idx)}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.74rem',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      padding: '5px 12px',
                      borderRadius: '50px',
                      border: 'none',
                      background: isActive
                        ? isLight
                          ? '#111827'
                          : '#FFFFFF'
                        : 'transparent',
                      color: isActive
                        ? isLight
                          ? '#FFFFFF'
                          : '#0B0F17'
                        : isLight
                        ? '#6B7280'
                        : '#94A3B8',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.6 }}>{`0${idx + 1}`}</span>
                    <span className="dest-pill-name">{dest.country}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Step Controls */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handlePrev}
                aria-label={t('storytelling.prev')}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(19, 30, 50, 0.9)',
                  border: isLight ? '1px solid rgba(229, 231, 235, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                aria-label={t('storytelling.next')}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(19, 30, 50, 0.9)',
                  border: isLight ? '1px solid rgba(229, 231, 235, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Interactive Destination Canvas: Left Editorial Column + Right 3D Visual */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1380px',
            width: '100%',
            margin: '0 auto',
            minHeight: '520px',
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 460px) 1fr',
            gap: 'clamp(20px, 3.5vw, 48px)',
            alignItems: 'center'
          }}
          className="dest-story-grid"
        >
          {/* LEFT: Editorial Content & Metadata Panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 'clamp(12px, 1.8vh, 22px)',
              height: '100%',
              padding: '10px 0'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(10px, 1.6vh, 18px)'
                }}
              >
                {/* Micro Category & Number Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#2563EB',
                      letterSpacing: '1.5px'
                    }}
                  >
                    {`0${activeIndex + 1} / 0${totalDestinations}`}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>•</span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      background: isLight ? 'rgba(37, 99, 235, 0.08)' : 'rgba(56, 189, 248, 0.12)',
                      color: isLight ? '#2563EB' : '#38BDF8',
                      padding: '4px 12px',
                      borderRadius: '50px'
                    }}
                  >
                    {category}
                  </span>
                </div>

                {/* Country Name: High-impact Serif Headline */}
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
                      fontSize: 'clamp(2.4rem, 4.6vw, 4.4rem)',
                      fontWeight: 800,
                      letterSpacing: '-1px',
                      lineHeight: 1.02,
                      color: 'var(--color-text-primary)',
                      margin: '0 0 6px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span>{current.country}</span>
                    <span style={{ fontSize: '0.7em' }}>{current.flag}</span>
                  </h3>

                  {/* City Examples */}
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
                      fontWeight: 600,
                      color: isLight ? '#4B5563' : '#94A3B8',
                      margin: 0,
                      letterSpacing: '0.2px'
                    }}
                  >
                    {cities}
                  </p>
                </div>

                {/* Short Editorial Tagline & Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.4,
                      margin: 0,
                      fontWeight: 500
                    }}
                  >
                    "{tagline}"
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(0.86rem, 1.05vw, 0.96rem)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      margin: 0
                    }}
                  >
                    {description}
                  </p>
                </div>

                {/* Highlights List */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '2px'
                  }}
                >
                  {highlights.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        background: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)',
                        border: isLight ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '4px 10px',
                        borderRadius: '8px'
                      }}
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>

                {/* Metadata & Explore CTA Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: isLight ? '1px solid rgba(229, 231, 235, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: 'var(--color-text-muted)',
                        display: 'block'
                      }}
                    >
                      {t('storytelling.estimatedBudget')}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)',
                        fontWeight: 900,
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      {current.estimatedBudget}
                      <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                        {t('storytelling.perPerson')}
                      </span>
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectDestination(current.id)}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      padding: '12px 26px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
                      transition: 'box-shadow 0.2s ease'
                    }}
                  >
                    <span>{t('storytelling.exploreCountry', { country: current.country })}</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Large Cinematic 3D Interactive Photograph */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxHeight: 'min(580px, 72vh)',
              perspective: '1200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringVisual(true)}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%',
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: isLight
                  ? '0 25px 60px -10px rgba(0, 0, 0, 0.16), 0 8px 24px -5px rgba(37, 99, 235, 0.12)'
                  : '0 30px 70px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(37, 99, 235, 0.2)',
                border: isLight
                  ? '1px solid rgba(255, 255, 255, 0.8)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer'
              }}
              onClick={() => onSelectDestination(current.id)}
            >
              {/* Cinematic Photographic Stage with smooth Crossfade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img
                    src={current.image}
                    alt={`${current.country} Travel Visual`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isHoveringVisual ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />

                  {/* High-end Multi-Layer Vignette & Atmospheric Gradients */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(11, 15, 23, 0.85) 0%, rgba(11, 15, 23, 0.2) 40%, rgba(0, 0, 0, 0.05) 100%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* 3D Floating Glass Badge (Top Right) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      transform: 'translateZ(35px)',
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px)',
                      padding: '8px 16px',
                      borderRadius: '50px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <Calendar size={14} style={{ color: '#2563EB' }} />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#0F172A'
                      }}
                    >
                      {duration} • {bestSeason}
                    </span>
                  </div>

                  {/* 3D Bottom Floating Overlay Info */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      right: '24px',
                      transform: 'translateZ(40px)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#38BDF8',
                          display: 'block',
                          marginBottom: '2px'
                        }}
                      >
                        {t('storytelling.curatedOdyssey')}
                      </span>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          margin: 0,
                          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}
                      >
                        {current.country}
                      </h4>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        width: '46px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transform: isHoveringVisual ? 'scale(1.1) translateX(3px)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dynamic 3D Glare effect on mouse move */}
              {isHoveringVisual && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`,
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
