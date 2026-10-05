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
    switch (lang.toLowerCase()) {
      case 'uz':
        return { flag: '🇺🇿', code: 'UZ', label: 'O‘zbekcha' };
      case 'ru':
        return { flag: '🇷🇺', code: 'RU', label: 'Русский' };
      case 'en':
      default:
        return { flag: '🇬🇧', code: 'EN', label: 'English' };
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
            fontWeight: 800,
            fontSize: '1.35rem',
            letterSpacing: '0.5px',
            color: 'var(--text-primary)',
          }}
        >
          Trip<span style={{ color: '#2563EB', fontWeight: 900 }}>Mind</span>
        </span>
      </div>

      {/* Center: Navigation Links */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <LayoutDashboard size={15} />
          <span>Traveler</span>
        </button>

        <button
          onClick={() => router.push('/agency/dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Building2 size={15} />
          <span>Agency</span>
        </button>

        <button
          onClick={() => router.push('/admin')}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Shield size={15} />
          <span>Admin</span>
        </button>
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
            <span style={{ fontSize: '0.95rem' }}>{currentLangDetails.flag}</span>
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
                  width: '140px',
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
                {(['uz', 'ru', 'en'] as Language[]).map((lang) => {
                  const details = getLanguageDetails(lang);
                  const isSelected = language.toLowerCase() === lang.toLowerCase();
                  return (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: isSelected ? 'var(--accent, #2563eb)' : 'var(--text-secondary)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{details.flag}</span>
                      <span>{details.label}</span>
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
          title="Toggle Theme"
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
                      <span>Traveler Dashboard</span>
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
                      <span>Agency Portal</span>
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
                      <span>Admin Console</span>
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
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Open Dashboard
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
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
          >
            <button
              onClick={() => { setIsMobileMenuOpen(false); router.push('/dashboard'); }}
              style={{ padding: '12px', borderRadius: '10px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LayoutDashboard size={16} /> Traveler Dashboard
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); router.push('/agency/dashboard'); }}
              style={{ padding: '12px', borderRadius: '10px', background: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: 'none', fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Building2 size={16} /> Agency Portal
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); router.push('/admin'); }}
              style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'none', fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Shield size={16} /> Admin Console
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
