'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from '../views/Dashboard';

function isAdmin(role?: string) {
  return role === 'administrator' || role === 'admin';
}

export function AdminApp() {
  const { user, isLoading, setShowAuthModal } = useAuth();

  useEffect(() => {
    localStorage.setItem('auth_redirect_path', '/admin');
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-accent)' }}>
        Opening admin panel...
      </div>
    );
  }

  if (!user || !isAdmin(user.role)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
        <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '36px 28px', textAlign: 'center', borderRadius: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: '0 0 8px' }}>Admin panel</h1>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 20px' }}>
            Sign in with the admin account to manage leads, analytics, and agency settings.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 20px' }}>
            admin@traveluz.com · admin123
          </p>
          <button className="btn-primary" style={{ padding: '12px 18px', borderRadius: '12px', fontWeight: 800 }} onClick={() => setShowAuthModal(true)}>
            Admin sign in
          </button>
          <div style={{ marginTop: '16px' }}>
            <a href="/" style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.85rem' }}>Back to the website</a>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard variant="admin" initialView="admin" />;
}
