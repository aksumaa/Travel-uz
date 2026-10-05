import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, DollarSign, Star, Shield, Sparkles, Navigation, Heart, Check } from '../icons';
import { useCurrency } from '../context/CurrencyContext';

export interface PlaceDetailData {
  id?: string | number;
  title: string;
  category?: string;
  location?: string;
  description?: string;
  cost?: number;
  duration?: string;
  rating?: number;
  reviewsCount?: number;
  openingHours?: string;
  tip?: string;
  image?: string;
  isVerified?: boolean;
  lat?: number;
  lng?: number;
}

interface PlaceDetailModalProps {
  place: PlaceDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (place: PlaceDetailData) => void;
  onAddToTrip?: (place: PlaceDetailData) => void;
  isSaved?: boolean;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  isOpen,
  onClose,
  onSaveToVault,
  onAddToTrip,
  isSaved = false,
}) => {
  const { formatPrice } = useCurrency();

  if (!isOpen || !place) return null;

  const defaultImg =
    place.image ||
    'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80';

  const openNavigation = () => {
    if (place.lat && place.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank');
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.title} ${place.location || ''}`)}`,
        '_blank'
      );
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            background: 'var(--color-bg-surface, #0f172a)',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
          }}
        >
          {/* Hero Image & Badges */}
          <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
            <img
              src={defaultImg}
              alt={place.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--color-bg-surface, #0f172a) 0%, transparent 60%)',
              }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {/* Badges in Image */}
            <div style={{ position: 'absolute', bottom: '16px', left: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  background: 'var(--color-accent, #2563eb)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                {place.category || 'Attraction'}
              </span>

              {place.isVerified ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    background: 'rgba(16, 185, 129, 0.85)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Shield size={12} /> Verified Heritage POI
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    background: 'rgba(124, 58, 237, 0.85)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} /> AI Recommendation
                </span>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary, #ffffff)', fontFamily: 'var(--font-heading, sans-serif)' }}>
                  {place.title}
                </h3>
                {place.rating && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem' }}>
                    <Star size={16} fill="#f59e0b" stroke="none" />
                    {place.rating} {place.reviewsCount ? `(${place.reviewsCount})` : ''}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted, #64748b)', fontSize: '0.85rem' }}>
                <MapPin size={14} style={{ color: 'var(--color-accent, #2563eb)' }} />
                <span>{place.location || 'Central Cultural Quarter'}</span>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div
                style={{
                  background: 'var(--color-bg, #090d1a)',
                  border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)', fontWeight: 700 }}>Est. Cost</span>
                <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>
                  {place.cost === undefined || place.cost === 0 ? 'Free' : formatPrice(place.cost)}
                </strong>
              </div>

              <div
                style={{
                  background: 'var(--color-bg, #090d1a)',
                  border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)', fontWeight: 700 }}>Dwell Time</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary, #ffffff)' }}>
                  {place.duration || '2 hours'}
                </strong>
              </div>

              <div
                style={{
                  background: 'var(--color-bg, #090d1a)',
                  border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted, #64748b)', fontWeight: 700 }}>Hours</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary, #ffffff)' }}>
                  {place.openingHours || '08:30 – 19:00'}
                </strong>
              </div>
            </div>

            {/* Description */}
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary, #94a3b8)', lineHeight: 1.6 }}>
              {place.description ||
                `${place.title} is a signature cultural highlight situated in ${place.location || 'the historic district'}. Highly recommended for its rich architectural heritage, authentic local encounters, and immersive photography opportunities.`}
            </p>

            {/* Local Insider Tip */}
            {place.tip && (
              <div
                style={{
                  background: 'rgba(37, 99, 235, 0.08)',
                  borderLeft: '4px solid var(--color-accent, #2563eb)',
                  borderRadius: '0 10px 10px 0',
                  padding: '12px 14px',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-primary, #ffffff)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)' }}>
                  💡 Local Traveler Pro-Tip
                </strong>
                <span>{place.tip}</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
              background: 'var(--color-bg, #090d1a)',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {onSaveToVault && (
              <button
                onClick={() => onSaveToVault(place)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: isSaved ? '1px solid #10b981' : '1px solid var(--glass-border, rgba(255,255,255,0.15))',
                  background: isSaved ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  color: isSaved ? '#10b981' : 'var(--color-text-primary, #ffffff)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                {isSaved ? <Check size={16} /> : <Heart size={16} />}
                <span>{isSaved ? 'Saved' : 'Save Place'}</span>
              </button>
            )}

            <button
              onClick={openNavigation}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.15))',
                background: 'var(--color-bg-surface, #0f172a)',
                color: 'var(--color-text-primary, #ffffff)',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Navigation size={16} />
              <span>Map Route</span>
            </button>

            {onAddToTrip && (
              <button
                onClick={() => onAddToTrip(place)}
                className="btn-primary"
                style={{
                  flex: 2,
                  minWidth: '160px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <span>Add to Day Schedule</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
