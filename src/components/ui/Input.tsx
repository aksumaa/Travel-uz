import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  style,
  id,
  ...props
}, ref) => {
  const generatedId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={generatedId}
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.2px'
          }}
        >
          {label}
        </label>
      )}

      <div
        className={`tm-input-wrapper ${error ? 'tm-input-error' : ''}`}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface)',
          border: error ? '1px solid #EF4444' : '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {leftIcon && (
          <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={generatedId}
          className={`tm-input ${className}`}
          style={{
            flex: 1,
            padding: leftIcon ? '12px 14px 12px 10px' : '12px 16px',
            paddingRight: rightIcon ? '40px' : '16px',
            fontSize: '0.92rem',
            color: 'var(--text-primary)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            ...style
          }}
          {...props}
        />

        {rightIcon && (
          <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 500 }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
