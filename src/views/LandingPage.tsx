'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Globe3D } from '../components/Globe3D';
import { DestinationStorytelling } from '../components/DestinationStorytelling';
import { DestinationExplorerSection } from '../components/DestinationExplorerSection';
import { CountryInfoPanel } from '../components/CountryInfoPanel';
import { AiPlannerSection } from '../components/AiPlannerSection';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, Star, Users, Compass, Globe, Lock, Languages, 
  Hotel, Tag, Calendar, MapPin, Search, ChevronRight, ChevronDown,
  ArrowRight, Check, Play, X, Shield, DollarSign, Brain, Clock, Plane, Utensils
} from '../icons';

interface LandingPageProps {
  onStartPlanning: (countryId: string, initialView?: string) => void;
}

// Custom hook for animated counter when scrolled into view
function useAnimatedCounter(target: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const totalMs = duration * 1000;
    const steps = 45;
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

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning }) => {
  const { t, language } = useLanguage();
  const { setShowAuthModal, user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Interactive Video / Walkthrough Demo Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Selected Country Info Modal State
  const [selectedCountryModal, setSelectedCountryModal] = useState<string | null>(null);

  // Active Hero Globe Selected Country
  const [selectedGlobeCountry, setSelectedGlobeCountry] = useState<string>('uzbekistan');

  // Product Preview Active Tab
  const [previewTab, setPreviewTab] = useState<'explore' | 'my-trips' | 'planner' | 'country'>('explore');

  // FAQ Active Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Stats Counters
  const stat1 = useAnimatedCounter(195, 1.6);
  const stat2 = useAnimatedCounter(10, 1.6); // 10K+
  const stat3 = useAnimatedCounter(1, 1.6);  // 1M+

  // Navigate / Auth Helper
  const handleAction = (destinationView: string = 'planner') => {
    localStorage.setItem('auth_redirect_view', destinationView);
    if (user) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const faqItems = [
    {
      q: t('faq.items.0.q'),
      a: t('faq.items.0.a')
    },
    {
      q: t('faq.items.1.q'),
      a: t('faq.items.1.a')
    },
    {
      q: t('faq.items.2.q'),
      a: t('faq.items.2.a')
    },
    {
      q: t('faq.items.3.q'),
      a: t('faq.items.3.a')
    },
    {
      q: t('faq.items.4.q'),
      a: t('faq.items.4.a')
    },
    {
      q: t('faq.items.5.q'),
      a: t('faq.items.5.a')
    },
    {
      q: t('faq.items.6.q'),
      a: t('faq.items.6.a')
    },
    {
      q: t('faq.items.7.q'),
      a: t('faq.items.7.a')
    }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden', background: 'var(--color-bg)' }}>
      
      {/* ======================================================== */}
      {/* SECTION 2 — HERO */}
      {/* ======================================================== */}
      <section 
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 60px 24px',
          background: theme === 'light'
            ? 'radial-gradient(ellipse at 50% 30%, rgba(219, 234, 254, 0.45) 0%, rgba(241, 245, 249, 0.9) 70%, var(--color-bg) 100%)'
            : 'radial-gradient(ellipse at 50% 20%, rgba(37, 99, 235, 0.12) 0%, rgba(6, 9, 20, 0.95) 70%, var(--color-bg) 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Background Glow Lines */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1200px, 95vw)',
          height: '400px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Hero Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '860px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '36px'
          }}
        >
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '100px',
            background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
            border: '1px solid var(--accent-subtle, rgba(37, 99, 235, 0.25))',
            color: 'var(--accent, #2563EB)',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: "var(--font-sans, 'Inter', sans-serif)"
          }}>
            <Sparkles size={14} />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', serif)",
            fontSize: 'clamp(3rem, 6.8vw, 5.2rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--color-text-primary)'
          }}>
            {t('hero.titleLine1')}<br />
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, var(--accent, #2563EB) 0%, #7C3AED 50%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              {t('hero.titleLine2')}
            </span>
          </h1>

          {/* Supporting Text */}
          <p style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '580px',
            margin: '6px 0 0 0'
          }}>
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginTop: '12px'
          }}>
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const el = document.getElementById('destinations');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '15px 34px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              <span>{t('hero.startExploring')}</span>
              <ArrowRight size={18} />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDemoModal(true)}
              style={{
                padding: '14px 28px',
                borderRadius: '14px',
                background: 'var(--glass-bg)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--glass-border)',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.15)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Play size={13} style={{ marginLeft: '2px' }} />
              </div>
              <span>{t('hero.watchDemo')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* HERO VISUAL — Highly Realistic Interactive 3D Earth Globe Arena */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            maxWidth: '1240px',
            height: 'min(640px, 75vh)',
            borderRadius: '32px',
            border: theme === 'light' ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            background: theme === 'light'
              ? 'radial-gradient(circle at 50% 45%, rgba(239, 246, 255, 0.7) 0%, rgba(219, 234, 254, 0.5) 60%, rgba(248, 250, 252, 0.9) 100%)'
              : 'radial-gradient(circle at 50% 45%, rgba(15, 23, 42, 0.9) 0%, rgba(6, 9, 20, 0.98) 100%)',
            boxShadow: theme === 'light'
              ? '0 25px 60px rgba(37, 99, 235, 0.12), 0 2px 10px rgba(0,0,0,0.04)'
              : '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Active Featured Destination Bar (Top-left inside Hero Globe) */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 30,
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            maxWidth: '85%'
          }}>
            <div style={{
              background: 'var(--color-bg-surface, rgba(255, 255, 255, 0.9))',
              backdropFilter: 'blur(16px)',
              padding: '6px 14px',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <MapPin size={13} style={{ color: '#2563EB' }} />
              <span>{t('hero.interactiveHubs')}</span>
            </div>
            {[
              { name: 'Paris', flag: '🇫🇷', id: 'paris' },
              { name: 'Tokyo', flag: '🇯🇵', id: 'tokyo' },
              { name: 'Dubai', flag: '🇦🇪', id: 'dubai' },
              { name: 'Samarkand', flag: '🇺🇿', id: 'samarkand' },
              { name: 'New York', flag: '🇺🇸', id: 'usa' }
            ].map(city => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedGlobeCountry(city.id);
                  const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = city.name;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                style={{
                  background: selectedGlobeCountry === city.id ? 'var(--accent, #2563EB)' : 'var(--glass-bg)',
                  backdropFilter: 'blur(14px)',
                  padding: '5px 12px',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: selectedGlobeCountry === city.id ? '#ffffff' : 'var(--color-text-primary)',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedGlobeCountry === city.id ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none'
                }}
              >
                <span>{city.flag}</span>
                <span>{city.name}</span>
              </button>
            ))}
          </div>

          <Globe3D 
            selectedCountry={selectedGlobeCountry}
            showSearchBar={true}
            onDestinationSelect={(dest) => {
              setSelectedGlobeCountry(dest.id);
            }}
          />
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3 — STATS */}
      {/* ======================================================== */}
      <section style={{ padding: '40px 24px 70px 24px', position: 'relative', zIndex: 10 }}>
        <div 
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            borderRadius: '28px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
            padding: '48px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}
        >
          {/* Stat 1 */}
          <div ref={stat1.ref} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#2563EB',
              lineHeight: 1
            }}>
              {stat1.count}+
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {t('stats.countries')}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {t('stats.countriesDesc')}
            </span>
          </div>

          {/* Stat 2 */}
          <div ref={stat2.ref} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#7C3AED',
              lineHeight: 1
            }}>
              {stat2.count}K+
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {t('stats.destinations')}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {t('stats.destinationsDesc')}
            </span>
          </div>

          {/* Stat 3 */}
          <div ref={stat3.ref} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#EC4899',
              lineHeight: 1
            }}>
              {stat3.count}M+
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {t('stats.travelers')}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {t('stats.travelersDesc')}
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4 — HOW IT WORKS */}
      {/* ======================================================== */}
      <section 
        id="how-it-works"
        style={{
          padding: '80px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            color: 'var(--accent, #2563EB)',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '0.14em',
            display: 'inline-block',
            marginBottom: '10px',
            fontFamily: "var(--font-sans, 'Inter', sans-serif)"
          }}>
            {t('howItWorks.badge')}
          </span>
          <h2 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', serif)",
            fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            margin: '0 0 14px 0'
          }}>
            {t('howItWorks.title')}
          </h2>
          <p style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            color: 'var(--color-text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* 3 Simple Steps Grid with Real Product UI Examples */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {/* Step 1 */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: 'var(--glass-shadow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'var(--accent-subtle, rgba(37, 99, 235, 0.12))',
              color: 'var(--accent, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 900,
              fontFamily: "var(--font-sans, 'Inter', sans-serif)"
            }}>
              01
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px 0', fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}>
                {t('howItWorks.step1Title')}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {t('howItWorks.step1Desc')}
              </p>
            </div>

            {/* Real Product UI Mock */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                <span>{t('howItWorks.step1PromptInput')}</span>
                <span style={{ color: 'var(--accent, #2563EB)' }}>{t('howItWorks.step1VerifiedNlp')}</span>
              </div>
              <div style={{
                background: 'var(--color-bg-surface)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                border: '1px solid var(--border)'
              }}>
                {t('howItWorks.step1SamplePrompt')}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', fontWeight: 700 }}>{t('howItWorks.step1Tag1')}</span>
                <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', fontWeight: 700 }}>{t('howItWorks.step1Tag2')}</span>
                <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 700 }}>{t('howItWorks.step1Tag3')}</span>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: 'var(--glass-shadow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 900,
              fontFamily: "var(--font-sans, 'Inter', sans-serif)"
            }}>
              02
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px 0', fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}>
                {t('howItWorks.step2Title')}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {t('howItWorks.step2Desc')}
              </p>
            </div>

            {/* Real Product UI Mock */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7C3AED' }}>{t('howItWorks.step2Generating')}</span>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>{t('howItWorks.step2Optimized')}</span>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--color-bg-surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🏛️</span>
                <div style={{ fontSize: '0.78rem', lineHeight: 1.2 }}>
                  <strong style={{ color: 'var(--color-text-primary)', display: 'block' }}>{t('howItWorks.step2MockDay')}</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>{t('howItWorks.step2MockDaySub')}</span>
                </div>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--color-bg-surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🏨</span>
                <div style={{ fontSize: '0.78rem', lineHeight: 1.2 }}>
                  <strong style={{ color: 'var(--color-text-primary)', display: 'block' }}>{t('howItWorks.step2MockHotel')}</strong>
                  <span style={{ color: '#10B981' }}>{t('howItWorks.step2MockHotelSub')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: 'var(--glass-shadow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(236, 72, 153, 0.12)',
              color: '#EC4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 900,
              fontFamily: "var(--font-sans, 'Inter', sans-serif)"
            }}>
              03
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px 0', fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}>
                {t('howItWorks.step3Title')}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {t('howItWorks.step3Desc')}
              </p>
            </div>

            {/* Real Product UI Mock */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                <span>{t('howItWorks.step3SyncShare')}</span>
                <span style={{ color: '#EC4899' }}>{t('howItWorks.step3LiveOffline')}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', display: 'block' }}>{t('howItWorks.step3OfflineSynced')}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{t('howItWorks.step3AppleWallet')}</span>
                </div>
                <div style={{ flex: 1, padding: '10px', background: 'rgba(37, 99, 235, 0.08)', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.2)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent, #2563EB)', display: 'block' }}>{t('howItWorks.step3SharedTrip')}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{t('howItWorks.step3CoTravelers')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5 — DESTINATIONS SCROLL STORYTELLING */}
      {/* ======================================================== */}
      <DestinationStorytelling 
        onSelectDestination={(id) => {
          setSelectedCountryModal(id);
        }}
      />

      {/* ======================================================== */}
      {/* SECTION 5B — DESTINATION EXPLORER (Continents & 3D Tilt) */}
      {/* ======================================================== */}
      <DestinationExplorerSection 
        onSelectCountry={(countryId) => {
          setSelectedCountryModal(countryId);
        }}
        onPlanTrip={(countryId) => {
          onStartPlanning(countryId, 'planner');
        }}
      />

      {/* ======================================================== */}
      {/* SECTION 6 — AI TRIP PLANNER (Interactive Generator) */}
      {/* ======================================================== */}
      <AiPlannerSection 
        onBuildTrip={(planData) => {
          localStorage.setItem('ai_preset_plan', JSON.stringify(planData));
          onStartPlanning(planData.destination.toLowerCase(), 'planner');
        }}
      />

      {/* ======================================================== */}
      {/* SECTION 7 — WHY TRIPMIND */}
      {/* ======================================================== */}
      <section 
        id="why-tripmind"
        style={{
          padding: '80px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            color: '#2563EB',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '2px',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            {t('why.badge')}
          </span>
          <h2 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', Georgia, serif)",
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 14px 0'
          }}>
            {t('why.title')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto' }}>
            {t('why.subtitle')}
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {[
            {
              title: t('why.pillars.itineraries.title'),
              desc: t('why.pillars.itineraries.desc'),
              icon: <Brain size={26} />,
              color: '#2563EB'
            },
            {
              title: t('why.pillars.recommendations.title'),
              desc: t('why.pillars.recommendations.desc'),
              icon: <Sparkles size={26} />,
              color: '#7C3AED'
            },
            {
              title: t('why.pillars.destinationInfo.title'),
              desc: t('why.pillars.destinationInfo.desc'),
              icon: <Globe size={26} />,
              color: '#10B981'
            },
            {
              title: t('why.pillars.savedDestinations.title'),
              desc: t('why.pillars.savedDestinations.desc'),
              icon: <Tag size={26} />,
              color: '#EC4899'
            },
            {
              title: t('why.pillars.tripManagement.title'),
              desc: t('why.pillars.tripManagement.desc'),
              icon: <Compass size={26} />,
              color: '#F59E0B'
            },
            {
              title: t('why.pillars.smartSearch.title'),
              desc: t('why.pillars.smartSearch.desc'),
              icon: <Search size={26} />,
              color: '#06B6D4'
            }
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, boxShadow: 'var(--glass-shadow)' }}
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '32px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: `${pillar.color}15`,
                color: pillar.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {pillar.icon}
              </div>

              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: 0
              }}>
                {pillar.title}
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                margin: 0
              }}>
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 8 — PRODUCT PREVIEW (Interactive UI Tabs) */}
      {/* ======================================================== */}
      <section 
        id="product-preview"
        style={{
          padding: '80px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            color: '#2563EB',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '2px',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            {t('productPreview.badge')}
          </span>
          <h2 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', Georgia, serif)",
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 14px 0'
          }}>
            {t('productPreview.title')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
            {t('productPreview.subtitle')}
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}>
          {[
            { id: 'explore', label: t('productPreview.tabs.explore') },
            { id: 'my-trips', label: t('productPreview.tabs.myTrips') },
            { id: 'planner', label: t('productPreview.tabs.planner') },
            { id: 'country', label: t('productPreview.tabs.country') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPreviewTab(tab.id as any)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: previewTab === tab.id ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'var(--color-bg-surface)',
                color: previewTab === tab.id ? '#ffffff' : 'var(--color-text-secondary)',
                border: previewTab === tab.id ? 'none' : '1px solid var(--glass-border)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: previewTab === tab.id ? '0 6px 18px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Realistic Interactive Mock Frame */}
        <div style={{
          background: 'var(--color-bg-surface)',
          borderRadius: '28px',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          minHeight: '480px'
        }}>
          {/* Mock Browser Header */}
          <div style={{
            padding: '14px 20px',
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <div style={{
              flex: 1,
              maxWidth: '380px',
              margin: '0 auto',
              background: 'var(--color-bg-surface)',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '0.74rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              https://tripmind.app/{previewTab}
            </div>
          </div>

          {/* Preview Tab Contents */}
          <div style={{ padding: '32px' }}>
            {previewTab === 'explore' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{t('productPreview.exploreTitle')}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 700 }}>{t('productPreview.exploreSub')}</span>
                </div>
                {[
                  { name: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80', status: t('productPreview.trendingHub') },
                  { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', status: t('productPreview.topRated') },
                  { name: 'Samarkand, Uzbekistan', img: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80', status: t('productPreview.culturalGem') }
                ].map((item, idx) => (
                  <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--color-bg)' }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '14px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 800 }}>{item.status}</span>
                      <h5 style={{ margin: '2px 0 0 0', fontSize: '1rem', color: 'var(--color-text-primary)' }}>{item.name}</h5>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {previewTab === 'my-trips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{t('productPreview.myTripsTitle')}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>{t('productPreview.confirmedVoyages')}</span>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--color-bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=120&q=80" alt="Italy" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', display: 'block' }}>{t('productPreview.amalfiTrip')}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('productPreview.amalfiTripSub')}</span>
                    </div>
                  </div>
                  <span style={{ padding: '6px 14px', borderRadius: '50px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '0.8rem', fontWeight: 800 }}>{t('productPreview.vouchersReady')}</span>
                </div>
              </div>
            )}

            {previewTab === 'planner' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{t('productPreview.wizardTitle')}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: 700 }}>{t('productPreview.step2of3')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800 }}>{t('productPreview.datesLabel')}</span>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{t('productPreview.datesValue')}</strong>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800 }}>{t('planner.budget')}</span>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#10B981', marginTop: '4px' }}>{t('productPreview.budgetMax')}</strong>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800 }}>{t('planner.style')}</span>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#2563EB', marginTop: '4px' }}>{t('productPreview.styleValue')}</strong>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'country' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{t('productPreview.dossierTitle')}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 700 }}>{t('productPreview.visaFree90')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{t('productPreview.capital')}</span>
                    <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>{t('productPreview.tashkent')}</strong>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{t('productPreview.currency')}</span>
                    <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>UZS (Soʻm)</strong>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{t('productPreview.bestSeason')}</span>
                    <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>{t('productPreview.springAutumn')}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 9 — FAQ */}
      {/* ======================================================== */}
      <section 
        id="faq"
        style={{
          padding: '80px 24px',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            color: '#2563EB',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '2px',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            {t('faq.badge')}
          </span>
          <h2 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', Georgia, serif)",
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 12px 0'
          }}>
            {t('faq.title')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: 0 }}>
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--color-bg-surface)',
                  borderRadius: '18px',
                  border: isOpen ? '1px solid #2563EB' : '1px solid var(--glass-border)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 8px 25px rgba(37, 99, 235, 0.1)' : '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--color-text-primary)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: isOpen ? '#2563EB' : 'var(--color-text-muted)',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div style={{
                        padding: '0 24px 22px 24px',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.65,
                        borderTop: '1px solid var(--border)',
                        paddingTop: '16px'
                      }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 10 — FINAL CTA */}
      {/* ======================================================== */}
      <section style={{ padding: '60px 24px 100px 24px' }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            borderRadius: '36px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 40%, #7C3AED 75%, #EC4899 100%)',
            boxShadow: '0 25px 60px rgba(37, 99, 235, 0.35)',
            padding: '70px 32px',
            textAlign: 'center',
            color: '#ffffff'
          }}
        >
          {/* Subtle Ambient Radial Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 5, maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Compass size={28} />
            </div>

            <h2 style={{
              fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', Georgia, serif)",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0
            }}>
              {t('cta.title')}
            </h2>

            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.92)',
              margin: 0
            }}>
              {t('cta.subtitle')}
            </p>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('planner')}
              style={{
                marginTop: '12px',
                padding: '16px 44px',
                borderRadius: '16px',
                background: '#ffffff',
                color: '#1E3A8A',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              <span>{t('cta.primaryButton')}</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* INTERACTIVE WALKTHROUGH DEMO MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--color-bg-surface, #ffffff)',
                borderRadius: '28px',
                border: '1px solid var(--border)',
                width: '100%',
                maxWidth: '680px',
                padding: '36px 32px',
                position: 'relative',
                boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
                textAlign: 'left'
              }}
            >
              <button
                onClick={() => setShowDemoModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563EB', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Play size={16} /> {t('demoModal.badge')}
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 16px 0', fontFamily: "'Outfit', sans-serif" }}>
                {t('demoModal.title')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '24px 0' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>1</div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)', display: 'block', fontSize: '0.95rem' }}>{t('demoModal.step1Title')}</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('demoModal.step1Desc')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7C3AED', color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 800, justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>2</div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)', display: 'block', fontSize: '0.95rem' }}>{t('demoModal.step2Title')}</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('demoModal.step2Desc')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EC4899', color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 800, justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>3</div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)', display: 'block', fontSize: '0.95rem' }}>{t('demoModal.step3Title')}</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('demoModal.step3Desc')}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDemoModal(false);
                  handleAction('planner');
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                {t('demoModal.tryPlannerBtn')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* INTERACTIVE COUNTRY DETAIL DOSSIER MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedCountryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.78)',
              backdropFilter: 'blur(16px)',
              zIndex: 2100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px'
            }}
            onClick={() => setSelectedCountryModal(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '920px',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '28px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <CountryInfoPanel 
                country={selectedCountryModal}
                onClose={() => setSelectedCountryModal(null)}
                onCreateTrip={(dest) => {
                  const targetCountry = (dest as any)?.countryId || (dest as any)?.country || selectedCountryModal;
                  setSelectedCountryModal(null);
                  onStartPlanning(typeof targetCountry === 'string' ? targetCountry : 'france', 'planner');
                }}
                onExploreDestination={(dest) => {
                  const targetCountry = (dest as any)?.countryId || (dest as any)?.country || selectedCountryModal;
                  setSelectedCountryModal(null);
                  onStartPlanning(typeof targetCountry === 'string' ? targetCountry : 'france', 'explore');
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
