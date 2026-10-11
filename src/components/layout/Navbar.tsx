import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Sun, Moon, LogOut, Calendar, Menu, X, ChevronDown, LayoutDashboard, Compass, Shield, Building2, DollarSign } from '../../icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { Language } from '../../locales/translations';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  const { user, logout, setShowAuthModal } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies, currentConfig } = useCurrency();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Monitor page scroll to update style state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const getLanguageDetails = (lang: Language) => {
    switch (lang?.toLowerCase()) {
      case 'uz':
        return { flag: '🇺🇿', code: 'UZ', label: 'O‘zbekcha' };
      case 'ru':
        return { flag: '🇷🇺', code: 'RU', label: 'Русский' };
      case 'en':
      default:
        return { flag: '🇺🇸', code: 'EN', label: 'English' };
    }
  };

  const currentLangDetails = getLanguageDetails(language);

  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      router.push('/');
    }
  };

  const navLinks = [
    { label: t('nav.destinations'), href: '#destinations' },
    { label: t('nav.planner'), href: '#ai-planner' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.about'), href: '#why-tripmind' },
    { label: t('nav.faq'), href: '#faq' }
  ];

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? 'var(--glass)' : 'rgba(0, 0, 0, 0.0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.15)' : 'none',
      }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        zIndex: 1000,
      }}
    >
      {/* Left: Brand Logo */}
      <div 
        onClick={handleHomeClick}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent, #2563eb), #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
        }}>
          <Compass size={19} />
        </div>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: '1.35rem',
            letterSpacing: '1px',
            color: 'var(--text-primary)',
            textTransform: 'uppercase'
          }}
        >
          TRIP<span style={{ color: '#2563EB' }}>MIND</span>
        </span>
      </div>

      {/* Center: Navigation Links */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
        }}
      >
        {navLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              if (window.location.pathname === '/' || window.location.pathname === '') {
                const el = document.querySelector(item.href);
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
            style={{
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Right: Controls Panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* Currency dropdown */}
        <div ref={currencyRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '38px',
              padding: '0 10px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span>{currentConfig?.symbol || '$'}</span>
            <span>{currency}</span>
            <ChevronDown size={13} style={{ opacity: 0.6 }} />
          </button>

          <AnimatePresence>
            {isCurrencyDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '160px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  zIndex: 1001,
                  boxShadow: 'var(--glass-shadow)',
                  background: 'var(--color-bg-surface, #ffffff)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px'
                }}
              >
                {currencies.map((curr) => {
                  const isSelected = currency === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: isSelected ? 'var(--accent, #2563eb)' : 'var(--text-secondary)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{curr.code} ({curr.symbol})</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{curr.name}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            id="lang-selector-button"
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '38px',
              padding: '0 10px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{currentLangDetails.flag}</span>
            <span>{currentLangDetails.code}</span>
            <ChevronDown size={13} style={{ opacity: 0.6 }} />
          </button>

          <AnimatePresence>
            {isLangDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '150px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 1001,
                  boxShadow: 'var(--glass-shadow)',
                  background: 'var(--color-bg-surface, #ffffff)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px'
                }}
              >
                {(['en', 'uz', 'ru'] as Language[]).map((lang) => {
                  const details = getLanguageDetails(lang);
                  const isSelected = (language || 'en').toLowerCase() === lang.toLowerCase();
                  return (
                    <button
                      key={lang}
                      id={`lang-option-${lang}`}
                      onClick={() => changeLanguage(lang)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? 'var(--accent, #2563eb)' : 'var(--text-secondary)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{details.flag}</span>
                      <span>{details.code} - {details.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme mode toggle button */}
        <button
          onClick={toggleTheme}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
        >
          {theme === 'dark' ? (
            <Moon size={16} style={{ color: 'var(--text-primary)' }} />
          ) : (
            <Sun size={16} style={{ color: '#F59E0B' }} />
          )}
        </button>

        {/* Authentication Section */}
        <div ref={profileRef}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '38px',
                  padding: '0 8px 0 10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      top: '46px',
                      right: 0,
                      width: '200px',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      zIndex: 1001,
                      background: 'var(--color-bg-surface, #ffffff)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      boxShadow: 'var(--glass-shadow)'
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push('/dashboard');
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <LayoutDashboard size={14} />
                      <span>{t('nav.dashboard')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push('/agency/dashboard');
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <Building2 size={14} />
                      <span>{t('nav.agencyPortal')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push('/admin');
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <Shield size={14} />
                      <span>{t('nav.adminConsole')}</span>
                    </button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                        router.push('/');
                      }}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={14} />
                      <span>{t('nav.signOut')}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowAuthModal(true);
                }}
                className="btn-primary"
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.2px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.35)';
                }}
              >
                {t('nav.getStarted')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Slide-down Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              background: 'var(--color-bg-surface, #ffffff)',
              borderBottom: '1px solid var(--border)',
              zIndex: 999,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
            }}
          >
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  const el = document.querySelector(item.href);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: 'rgba(37, 99, 235, 0.05)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{item.label}</span>
                <span style={{ color: '#2563EB', fontSize: '0.85rem' }}>→</span>
              </a>
            ))}

            {/* Mobile Language Selector */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {(['en', 'uz', 'ru'] as Language[]).map((lang) => {
                const details = getLanguageDetails(lang);
                const isSelected = (language || 'en').toLowerCase() === lang.toLowerCase();
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'var(--color-bg)',
                      color: isSelected ? '#2563EB' : 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{details.flag}</span>
                    <span>{details.code}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowAuthModal(true);
              }}
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {t('nav.getStarted')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
