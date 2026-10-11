import React from 'react';

export interface CountryCardProps {
  id: string;
  name: string;
  flag?: string;
  imageUrl?: string;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'pill' | 'list-item' | 'grid-card';
  count?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const CountryCard: React.FC<CountryCardProps> = ({
  id,
  name,
  flag,
  imageUrl,
  isActive = false,
  onClick,
  variant = 'list-item',
  count,
  className = '',
  style
}) => {
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`tm-country-pill ${isActive ? 'active' : ''} ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px 6px 8px',
          borderRadius: 'var(--radius-full)',
          background: isActive ? 'var(--accent-subtle)' : 'var(--bg-surface)',
          border: isActive ? '1.5px solid var(--accent)' : '1px solid var(--border)',
          color: isActive ? 'var(--accent)' : 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)',
          ...style
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '1.1rem' }}>{flag}</span>
        )}
        <span>{name}</span>
        {count && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '2px' }}>
            ({count})
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`tm-country-nav-item ${isActive ? 'active' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: isActive ? 'var(--accent-subtle)' : 'transparent',
        border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
        color: isActive ? 'var(--accent)' : 'var(--text-primary)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '1rem' }}>{flag || '🌍'}</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.88rem', fontWeight: isActive ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </div>
      </div>

      {count !== undefined && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {count}
        </span>
      )}
    </button>
  );
};
