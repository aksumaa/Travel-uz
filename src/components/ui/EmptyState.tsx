import React from 'react';
import { Compass } from '../../icons';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  style
}) => {
  return (
    <div
      className={`tm-empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '520px',
        margin: '0 auto',
        ...style
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-subtle)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        {icon || <Compass size={32} />}
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)",
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginTop: '8px',
            marginBottom: '24px',
            maxWidth: '380px'
          }}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
