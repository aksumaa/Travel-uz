import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
  style
}) => {
  return (
    <div
      className={`tm-section-heading ${className}`}
      style={{
        display: 'flex',
        flexDirection: action ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: action ? (align === 'center' ? 'center' : 'flex-end') : (align === 'center' ? 'center' : 'flex-start'),
        textAlign: align,
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap',
        ...style
      }}
    >
      <div style={{ maxWidth: action ? '700px' : '100%' }}>
        {eyebrow && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '6px'
            }}
          >
            {eyebrow}
          </span>
        )}
        <h2
          style={{
            fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            lineHeight: 1.18,
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            margin: 0
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginTop: '8px',
              marginBottom: 0
            }}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div style={{ flexShrink: 0 }}>
          {action}
        </div>
      )}
    </div>
  );
};
