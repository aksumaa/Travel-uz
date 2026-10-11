import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ArrowRight, Plus } from '../../icons';

export interface DestinationCardProps {
  id: string;
  title: string;
  subtitle?: string;
  country?: string;
  imageUrl: string;
  price?: string | number;
  rating?: number | string;
  tag?: string;
  isSaved?: boolean;
  onSaveToggle?: (id: string, e: React.MouseEvent) => void;
  onClick?: () => void;
  variant?: 'featured' | 'compact' | 'editorial' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  id,
  title,
  subtitle,
  country,
  imageUrl,
  price,
  rating,
  tag,
  isSaved: initialSaved = false,
  onSaveToggle,
  onClick,
  variant = 'editorial',
  className = '',
  style
}) => {
  const [saved, setSaved] = useState(initialSaved);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    if (onSaveToggle) {
      onSaveToggle(id, e);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClick}
      className={`tm-destination-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        height: variant === 'compact' ? '220px' : '320px',
        minWidth: variant === 'compact' ? '180px' : '240px',
        flex: 1,
        ...style
      }}
    >
      {/* Background Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="tm-card-img"
        />

        {/* Gradient Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Badges / Wishlist */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          {tag ? (
            <span
              style={{
                background: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '100px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}
            >
              {tag}
            </span>
          ) : rating ? (
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                color: '#111827',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
              {rating}
            </span>
          ) : <div />}

          {/* Save / Favorite button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label="Save to wishlist"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: saved ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              transition: 'all 0.2s ease',
              padding: 0
            }}
          >
            <Heart size={15} fill={saved ? '#FFFFFF' : 'none'} stroke="#FFFFFF" />
          </button>
        </div>

        {/* Bottom Content Area */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 18px',
            color: '#FFFFFF',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '12px'
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {country && (
              <span style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: 600, display: 'block', marginBottom: '2px', opacity: 0.9 }}>
                {country}
              </span>
            )}
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)",
                fontSize: variant === 'compact' ? '1.1rem' : '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '4px 0 0 0',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {subtitle}
              </p>
            )}
            {price && (
              <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#38BDF8' }}>
                From {price}
              </span>
            )}
          </div>

          {/* Action Circle Button (Arrow / Plus) */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
            className="tm-card-action-btn"
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
