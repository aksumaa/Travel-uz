import React, { useState, useEffect, useRef } from 'react';
import { Plane, Sun, Moon, LogOut, Calendar, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { Language } from '../../locales/translations';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  const { user, logout, setShowAuthModal } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
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

  // Nav list configurations
  const navLinks = [
    { label: t('nav.explore'), href: '#destinations' },
    { label: t('nav.planner'), href: '#planner' },
    { label: t('nav.trips'), href: user ? '#trips' : '#planner' },
    { label: t('nav.about'), href: '#about' }
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
        padding: '0 40px',
        zIndex: 1000,
      }}
    >
      {/* Left: Brand Logo */}
      <div 
        onClick={onNavigateHome}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <Plane size={24} className="animate-float" style={{ color: 'var(--accent)', transform: 'rotate(45deg)' }} />
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            letterSpacing: '1px',
            color: 'var(--text-primary)',
          }}
        >
          Travel<span style={{ color: '#2563EB', fontWeight: 900 }}>UZ</span>
        </span>
      </div>

      {/* Center: Nav links (Desktop - Guest view) */}
      {!user && (
        <nav
          className="desktop-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {/* Right: Controls Panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Language dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '40px',
              padding: '0 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{currentLangDetails.flag}</span>
            <span>{currentLangDetails.code}</span>
            <ChevronDown size={14} style={{ opacity: 0.6 }} />
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
                  top: '50px',
                  right: 0,
                  width: '140px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 1001,
                  boxShadow: 'var(--glass-shadow)',
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
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
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
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'all 0.2s',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0, rotate: -40 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 40 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? (
                <Moon size={18} style={{ color: 'var(--text-primary)' }} />
              ) : (
                <Sun size={18} style={{ color: '#F59E0B' }} />
              )}
            </motion.div>
          </AnimatePresence>
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
                  height: '40px',
                  padding: '0 8px 0 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
                      top: '50px',
                      right: 0,
                      width: '180px',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      zIndex: 1001,
                    }}
                  >
                    <button
                      onClick={onNavigateHome}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LayoutDashboard size={14} />
                      <span>{t('dashboard.explore')}</span>
                    </button>
                    <button
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Calendar size={14} />
                      <span>{t('nav.trips')}</span>
                    </button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={14} />
                      <span>{t('common.back')}</span> {/*signOut maps to common.back in legacy keys */}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-primary"
              style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.85rem' }}
            >
              {t('nav.login')}
            </button>
          )}
        </div>

        {/* Mobile menu toggle (Only visible when not logged in) */}
        {!user && (
          <button
            className="mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
            }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>

      {/* Slide-down Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && !user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              background: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 40px',
              gap: '20px',
              overflow: 'hidden',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
