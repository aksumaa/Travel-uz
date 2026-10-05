'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, ChevronDown, Plus, Globe, CheckCircle2, 
  ShieldCheck, Menu, X, Sparkles, Building2, User
} from '../../icons';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface AgencyHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  onCreatePackage?: () => void;
}

export const AgencyHeader: React.FC<AgencyHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onCreatePackage,
}) => {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false);
      if (currRef.current && !currRef.current.contains(e.target as Node)) setIsCurrOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifications = [
    { id: 1, title: 'New lead from Sarah Jenkins', desc: 'Silk Road Grand Discovery (May 12, 2 pax)', time: '10m ago', unread: true },
    { id: 2, title: 'Tour verified by Admin', desc: 'Cappadocia Sunrise Balloon retreat is live', time: '1h ago', unread: false },
    { id: 3, title: 'Inquiry status updated', desc: 'Jean Dupont marked as Contacted', time: '1d ago', unread: false }
  ];

  return (
    <header style={{
      height: '74px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="agency-mobile-hamburger"
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
            }}
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              {title}
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '100px',
              background: '#ecfdf5',
              color: '#059669',
              fontSize: '0.68rem',
              fontWeight: 800
            }}>
              <ShieldCheck size={12} /> Verified
            </span>
          </div>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions, Currency, Language, Notifications, Create button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Quick Create Package CTA */}
        {onCreatePackage && (
          <button
            onClick={onCreatePackage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Plus size={15} />
            <span>Create Package</span>
          </button>
        )}

        {/* Currency Selector */}
        <div ref={currRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsCurrOpen(!isCurrOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>{currency}</span>
            <ChevronDown size={12} />
          </button>
          {isCurrOpen && (
            <div style={{
              position: 'absolute',
              top: '38px',
              right: 0,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              padding: '4px',
              minWidth: '120px',
              zIndex: 100
            }}>
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setIsCurrOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    textAlign: 'left',
                    background: c.code === currency ? '#f0f9ff' : 'transparent',
                    color: c.code === currency ? '#0284c7' : '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{c.code}</span>
                  <span>{c.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Globe size={13} color="#0284c7" />
            <span>{language.toUpperCase()}</span>
          </button>
          {isLangOpen && (
            <div style={{
              position: 'absolute',
              top: '38px',
              right: 0,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              padding: '4px',
              minWidth: '130px',
              zIndex: 100
            }}>
              {[
                { code: 'en', label: 'English (US)' },
                { code: 'ru', label: 'Русский' },
                { code: 'uz', label: 'Oʻzbekcha' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code as any); setIsLangOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    textAlign: 'left',
                    background: language === lang.code ? '#f0f9ff' : 'transparent',
                    color: language === lang.code ? '#0284c7' : '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0ea5e9'
            }} />
          </button>
          {isNotifOpen && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              width: '280px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              padding: '12px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Agency Notifications</strong>
                <span style={{ fontSize: '0.68rem', color: '#0ea5e9', fontWeight: 700 }}>3 unread</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '8px', borderRadius: '8px', background: n.unread ? '#f0f9ff' : '#f8fafc' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{n.desc}</div>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '2px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
