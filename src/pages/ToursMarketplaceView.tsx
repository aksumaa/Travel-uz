import React, { useState } from 'react';
import { ReadyToursSection } from '../components/ReadyToursSection';
import { Shield, Sparkles, Filter, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ToursMarketplaceView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [filterDuration, setFilterDuration] = useState<number>(5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
      
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(37, 99, 235, 0.08))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.5px' }}>
            TripMind Ready Tours Marketplace
          </span>
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading, sans-serif)' }}>
          Vetted Turnkey Tour Packages by Licensed Agencies
        </h2>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary, #94a3b8)', maxWidth: '720px', lineHeight: 1.5 }}>
          Browse handpicked small-group and private tour packages with guaranteed accommodations, licensed Silk Road cultural guides, and high-speed rail transit included.
        </p>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
          {[
            { label: 'All Destinations', val: '' },
            { label: 'Samarkand', val: 'Samarkand' },
            { label: 'Bukhara', val: 'Bukhara' },
            { label: 'Khiva', val: 'Khiva' },
            { label: 'Grand Silk Road Loop', val: 'Uzbekistan' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setSelectedDestination(item.val)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: selectedDestination === item.val ? '1px solid #10b981' : '1px solid var(--glass-border)',
                background: selectedDestination === item.val ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-bg, #090d1a)',
                color: selectedDestination === item.val ? '#ffffff' : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ready Tours Grid Component */}
      <ReadyToursSection
        destination={selectedDestination}
        durationDays={filterDuration}
        travelersCount={2}
        estimatedBudgetUSD={1200}
        showComparisonOption={true}
      />

    </div>
  );
};
