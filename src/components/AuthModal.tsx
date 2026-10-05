import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Compass } from '../icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    login, 
    isLoading,
    signInWithGoogle,
    signInWithApple 
  } = useAuth();
  const router = useRouter();
  
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset local state when modal visibility changes
  useEffect(() => {
    if (!showAuthModal) {
      setEmail('');
      setPassword('');
      setErrorMsg('');
      setSuccessMsg('');
      setShowPassword(false);
    }
  }, [showAuthModal]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAuthModal) {
        setShowAuthModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAuthModal, setShowAuthModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await login(email, password);
      const saved = JSON.parse(localStorage.getItem('travel_uz_user') || '{}');
      const requested = localStorage.getItem('auth_redirect_path');
      localStorage.removeItem('auth_redirect_path');
      const dest = requested || (saved.role === 'administrator' || saved.role === 'admin' ? '/admin' : '/dashboard');
      setSuccessMsg(t('auth.successLogin'));
      setTimeout(() => {
        setShowAuthModal(false);
        router.push(dest);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || t('auth.errorFields'));
    }
  };

  const handleOAuthClick = async (provider: 'google' | 'apple') => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      setSuccessMsg(t('auth.successLogin'));
      setTimeout(() => {
        setShowAuthModal(false);
        router.push('/dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'OAuth authentication failed.');
    }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 5, 12, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              padding: '40px 32px 32px 32px',
              overflow: 'hidden',
              boxShadow: 'var(--glass-shadow), 0 20px 50px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--glass-border)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              aria-label="Close dialog"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <X size={16} />
            </button>

            {/* Logo + Header */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={28} style={{ color: 'var(--color-accent)' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '1px', color: 'var(--color-text-primary)' }}>
                  Travel<span style={{ color: 'var(--color-accent)' }}>UZ</span>
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {t('auth.welcome')}
              </h2>
            </div>

            {/* OAuth buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleOAuthClick('google')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <span style={{ position: 'absolute', left: '16px', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.07-1.37-1.18-2.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </span>
                <span>Continue with Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleOAuthClick('apple')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #1f2937',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#111111'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              >
                <span style={{ position: 'absolute', left: '16px', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.08.3.08.92-.08 1.91-.6 2.51-1.41" />
                  </svg>
                </span>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Or Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            </div>

            {/* Feedback Messages */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                  }}
                >
                  {errorMsg}
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                  }}
                >
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Inputs Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label htmlFor="auth-email" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  {t('auth.email')}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} />
                  </span>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.03)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="auth-password" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    {t('auth.password')}
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setErrorMsg('Password recovery is disabled for demo accounts.');
                    }}
                    style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {t('auth.forgotPassword')}
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} />
                  </span>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.03)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.72rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
                Traveler: traveler@traveluz.com / travel123
                <br />
                Admin: admin@traveluz.com / admin123
              </p>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(var(--color-accent-raw), 0.3)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.8 : 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {isLoading ? (
                  <span>{t('auth.loading')}</span>
                ) : (
                  <span>{t('auth.signIn')}</span>
                )}
              </button>
            </form>

            {/* Terms of Service text */}
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              By signing in, you agree to our{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                Privacy Policy
              </a>.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
