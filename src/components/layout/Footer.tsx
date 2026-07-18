import React from 'react';
import { Plane, Send, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        padding: '80px 40px 40px 40px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        zIndex: 10,
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
        }}
      >
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plane size={22} style={{ color: 'var(--accent)', transform: 'rotate(45deg)' }} />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '1px',
                color: 'var(--text-primary)',
              }}
            >
              Travel<span style={{ color: '#2563EB', fontWeight: 900 }}>UZ</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '280px', color: 'var(--text-muted)' }}>
            {t('footer.tagline')}
          </p>
          
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
            <a
              href="#twitter"
              aria-label="Twitter link"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <TwitterIcon />
            </a>
            <a
              href="#instagram"
              aria-label="Instagram link"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <InstagramIcon />
            </a>
            <a
              href="#telegram"
              aria-label="Telegram link"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <Send size={16} />
            </a>
            <a
              href="#youtube"
              aria-label="YouTube link"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>

        {/* Column 1: Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>
            {t('footer.company')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <li>
              <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.about')}
              </a>
            </li>
            <li>
              <a href="#blog" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.blog')}
              </a>
            </li>
            <li>
              <a href="#careers" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.careers')}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Help */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>
            {t('footer.help')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <li>
              <a href="#faq" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.faq')}
              </a>
            </li>
            <li>
              <a href="#support" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.support')}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>
            {t('footer.resources')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <li>
              <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.privacy')}
              </a>
            </li>
            <li>
              <a href="#terms" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                {t('footer.terms')}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Download */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>
            {t('footer.download')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* iOS App Store Badge */}
            <a
              href="#download-ios"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.88-2.33 3-5.34 3-9.07 0-3.29-1.28-6.06-3-7.58C10.28 5.81 9 8.58 9 11.87c0 3.73 1.12 6.74 3 9.07z"/><path d="M12 2.06c-1.88 2.33-3 5.34-3 9.07 0 3.29 1.28 6.06 3 7.58 1.72-1.52 3-4.29 3-7.58 0-3.73-1.12-6.74-3-9.07z"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>App Store</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{t('footer.ios')}</span>
              </div>
            </a>

            {/* Android Play Store Badge */}
            <a
              href="#download-android"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Google Play</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{t('footer.android')}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          © {new Date().getFullYear()} TravelUZ. {t('footer.copyright')}
        </div>

        {/* Back to Top button */}
        <button
          onClick={handleScrollToTop}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>Scroll to Top</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </footer>
  );
};
