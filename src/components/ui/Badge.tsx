import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'editorial' | 'glow';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  dot = false,
  className = '',
  style
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: '#FFFFFF',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)'
    },
    accent: {
      background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
      color: 'var(--accent)',
      border: '1px solid var(--border-subtle, rgba(37, 99, 235, 0.2))'
    },
    success: {
      background: 'rgba(16, 185, 129, 0.12)',
      color: '#10B981',
      border: '1px solid rgba(16, 185, 129, 0.25)'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.12)',
      color: '#F59E0B',
      border: '1px solid rgba(245, 158, 11, 0.25)'
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.12)',
      color: '#EF4444',
      border: '1px solid rgba(239, 68, 68, 0.25)'
    },
    editorial: {
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)'
    },
    glow: {
      background: 'rgba(56, 189, 248, 0.15)',
      color: 'var(--accent)',
      border: '1px solid rgba(56, 189, 248, 0.4)',
      boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)'
    }
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '0.72rem', borderRadius: '100px', height: '22px', gap: '4px' },
    md: { padding: '4px 12px', fontSize: '0.78rem', borderRadius: '100px', height: '28px', gap: '6px' }
  };

  return (
    <span
      className={`tm-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 700,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'currentColor'
          }}
        />
      )}
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
