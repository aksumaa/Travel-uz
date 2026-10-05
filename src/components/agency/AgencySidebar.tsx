'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Compass, Luggage, Users, TrendingUp, User, 
  ShieldCheck, Settings, LogOut, ArrowLeft,
  X, Sparkles, Building2
} from '../../icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AgencySidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AgencySidebar: React.FC<AgencySidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { href: '/agency/dashboard', label: 'Overview', icon: <Compass size={18} /> },
    { href: '/agency/dashboard/packages', label: 'Packages', icon: <Luggage size={18} /> },
    { href: '/agency/dashboard/leads', label: 'Leads & Inquiries', icon: <Users size={18} /> },
    { href: '/agency/dashboard/analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
    { href: '/agency/dashboard/profile', label: 'Agency Profile', icon: <User size={18} /> },
    { href: '/agency/dashboard/verification', label: 'Verification', icon: <ShieldCheck size={18} /> },
    { href: '/agency/dashboard/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
          className="agency-mobile-backdrop"
        />
      )}

      <aside
        className={`agency-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: '#0f172a',
          color: '#f8fafc',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          padding: '24px 16px',
          gap: '16px',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link 
            href="/agency/dashboard"
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.3px', color: '#ffffff' }}>
                Trip<span style={{ color: '#38bdf8' }}>Mind</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Agency Workspace
              </div>
            </div>
          </Link>

          {/* Close for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="agency-sidebar-close-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'none',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Agency Badge */}
        <div style={{
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Marakanda Silk Road
            </div>
            <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>
              Verified Partner (PRO)
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  textDecoration: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.1))' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ color: isActive ? '#38bdf8' : 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Back to Traveler View & Sign Out */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} />
            <span>Switch to Traveler Mode</span>
          </Link>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            <LogOut size={14} />
            <span>{t('navbar.signOut') || 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
