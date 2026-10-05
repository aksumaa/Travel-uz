import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Shield, Sparkles, Building2, Calendar, User, ArrowRight } from '../icons';
import { useCurrency } from '../context/CurrencyContext';
import type { ReadyTourPackage } from '../types/travel';

interface TripCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiTrip: {
    title: string;
    totalCostUSD: number;
    days: number;
    travelers: number;
    destination: string;
  };
  tourPackage: ReadyTourPackage | null;
  onSelectPackage?: (pkg: ReadyTourPackage) => void;
  onRequestQuote?: (pkg: ReadyTourPackage) => void;
}

export const TripCompareModal: React.FC<TripCompareModalProps> = ({
  isOpen,
  onClose,
  aiTrip,
  tourPackage,
  onRequestQuote,
}) => {
  const { formatPrice } = useCurrency();

  if (!isOpen || !tourPackage) return null;

  const comparisonRows = [
    {
      feature: 'Total Estimated Cost',
      ai: `${formatPrice(aiTrip.totalCostUSD)} total (${formatPrice(Math.round(aiTrip.totalCostUSD / (aiTrip.travelers || 2)))} / person)`,
      tour: `${formatPrice(tourPackage.priceUSD * (aiTrip.travelers || 2))} total (${formatPrice(tourPackage.priceUSD)} / person)`,
      advantage: aiTrip.totalCostUSD <= tourPackage.priceUSD * (aiTrip.travelers || 2) ? 'ai' : 'tour',
      note: 'All-inclusive agency rate includes taxes, transfers & guide',
    },
    {
      feature: '🏨 Accommodation',
      ai: 'Self-booked via online portals / Boutique stays',
      tour: tourPackage.hotelGrade || '4★ Heritage Boutique Hotel with breakfast',
      advantage: 'tour',
      note: 'Pre-vetted boutique rooms in city center',
    },
    {
      feature: '🚗 Logistics & Transport',
      ai: 'Self-managed taxis, walking & public transit',
      tour: tourPackage.transportIncluded || 'Private AC vehicle + High-speed rail tickets',
      advantage: 'tour',
      note: 'Door-to-door luggage and airport transfers included',
    },
    {
      feature: '🎫 Sight Admissions',
      ai: 'Pay on site at entrance kiosks',
      tour: 'VIP Skip-the-line admissions pre-arranged',
      advantage: 'tour',
      note: 'Zero waiting in queues at marquee historical monuments',
    },
    {
      feature: '👤 Cultural Guidance',
      ai: 'Self-guided with TripMind AI Notes',
      tour: tourPackage.guideLanguage || 'Dedicated licensed Silk Road historian guide',
      advantage: 'tour',
      note: 'In-depth storytelling and cultural context',
    },
    {
      feature: '⚖️ Planning Effort Required',
      ai: 'Moderate-High (Self-arranging tickets, routes, schedules)',
      tour: 'Zero (Turnkey delivery handled by licensed agency)',
      advantage: 'tour',
      note: 'Agency handles permits, train seats, and reservations',
    },
    {
      feature: '🕊️ Schedule Flexibility',
      ai: '100% Freeform (Change plans, sleep in, detour anytime)',
      tour: 'Fixed daily milestones and structured schedule',
      advantage: 'ai',
      note: 'DIY plan allows spontaneous exploration anytime',
    },
    {
      feature: '🛡️ Booking Security',
      ai: 'Dispersed across multiple hotel and taxi providers',
      tour: '1-Click Direct Escrow with Verified Partner Agency',
      advantage: 'tour',
      note: 'Full customer support and traveler guarantee',
    },
  ];

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1150,
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '860px',
            maxHeight: '92vh',
            background: 'var(--color-bg-surface, #0f172a)',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 28px',
              borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--color-bg, #090d1a)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--color-accent, #2563eb)',
                  letterSpacing: '0.5px',
                }}
              >
                Side-by-Side Comparison
              </span>
              <h3
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-heading, sans-serif)',
                }}
              >
                Self-Guided AI Plan vs Verified Agency Tour
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
                color: 'var(--color-text-secondary, #94a3b8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Top Entities Header (Sticky Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
              padding: '16px 28px',
              gap: '16px',
              alignItems: 'center',
            }}
            className="comparison-header-grid"
          >
            <div style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.8rem', fontWeight: 800 }}>
              DECISION CRITERIA
            </div>

            {/* AI Itinerary Card Mini */}
            <div
              style={{
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Sparkles size={12} style={{ color: 'var(--color-accent, #2563eb)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent, #2563eb)' }}>
                  YOUR CUSTOM AI PLAN
                </span>
              </div>
              <strong style={{ fontSize: '0.9rem', color: '#ffffff', display: 'block' }}>
                {aiTrip.title}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748b)' }}>
                {aiTrip.days} Days • {aiTrip.travelers} Travelers
              </span>
            </div>

            {/* Agency Tour Card Mini */}
            <div
              style={{
                background: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Shield size={12} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a855f7' }}>
                  {tourPackage.agencyName}
                </span>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                >
                  {tourPackage.matchScore}% Match
                </span>
              </div>
              <strong style={{ fontSize: '0.9rem', color: '#ffffff', display: 'block' }}>
                {tourPackage.title}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748b)' }}>
                {tourPackage.days} Days • Rated {tourPackage.agencyRating}★
              </span>
            </div>
          </div>

          {/* Comparison Rows Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.4fr 1.4fr',
                    gap: '16px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    alignItems: 'center',
                    border: '1px solid transparent',
                  }}
                  className="comparison-row-grid"
                >
                  {/* Criteria Label */}
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary, #ffffff)', display: 'block' }}>
                      {row.feature}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)', lineHeight: 1.3 }}>
                      {row.note}
                    </span>
                  </div>

                  {/* AI Column Value */}
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: row.advantage === 'ai' ? '#38bdf8' : 'var(--color-text-secondary, #94a3b8)',
                      fontWeight: row.advantage === 'ai' ? 700 : 500,
                    }}
                  >
                    {row.ai}
                  </div>

                  {/* Agency Tour Column Value */}
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: row.advantage === 'tour' ? '#10b981' : 'var(--color-text-secondary, #94a3b8)',
                      fontWeight: row.advantage === 'tour' ? 700 : 500,
                    }}
                  >
                    {row.tour}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Footer */}
          <div
            style={{
              padding: '18px 28px',
              borderTop: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
              background: 'var(--color-bg, #090d1a)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.15))',
                background: 'transparent',
                color: 'var(--color-text-secondary, #94a3b8)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Keep My AI Plan (Self-Guided)
            </button>

            <button
              onClick={() => {
                if (onRequestQuote) onRequestQuote(tourPackage);
              }}
              className="btn-premium"
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Contact {tourPackage.agencyName}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
