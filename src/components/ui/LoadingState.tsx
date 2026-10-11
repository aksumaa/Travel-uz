import React from 'react';

export interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton-card' | 'skeleton-list';
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading verified destinations...',
  variant = 'spinner',
  count = 3,
  className = '',
  style
}) => {
  if (variant === 'skeleton-card') {
    return (
      <div
        className={`tm-skeleton-grid ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
          width: '100%',
          ...style
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="tm-skeleton-card"
            style={{
              height: '300px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div className="tm-shimmer" style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-md)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="tm-shimmer" style={{ width: '60%', height: '18px', borderRadius: '4px' }} />
              <div className="tm-shimmer" style={{ width: '85%', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`tm-loading-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '16px',
        width: '100%',
        ...style
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'tm-spin 0.8s linear infinite'
        }}
      />
      {message && (
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            letterSpacing: '0.2px'
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
};
