import React from 'react';
import { Shield, RefreshCw } from '../../icons';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className = '',
  style
}) => {
  return (
    <div
      className={`tm-error-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '480px',
        margin: '0 auto',
        ...style
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <Shield size={28} />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginTop: '6px',
          marginBottom: '20px'
        }}
      >
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
