import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'editorial';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 14px', fontSize: '0.8rem', borderRadius: '100px', height: '34px', gap: '6px' },
    md: { padding: '10px 20px', fontSize: '0.88rem', borderRadius: '100px', height: '44px', gap: '8px' },
    lg: { padding: '14px 28px', fontSize: '1rem', borderRadius: '100px', height: '52px', gap: '10px' }
  };

  const variantClassMap: Record<string, string> = {
    primary: 'tm-btn tm-btn-primary',
    secondary: 'tm-btn tm-btn-secondary',
    outline: 'tm-btn tm-btn-outline',
    ghost: 'tm-btn tm-btn-ghost',
    danger: 'tm-btn tm-btn-danger',
    editorial: 'tm-btn tm-btn-editorial'
  };

  return (
    <button
      className={`${variantClassMap[variant] || 'tm-btn-primary'} ${className}`}
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        textDecoration: 'none',
        border: 'none',
        outline: 'none',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...style
      }}
      {...props}
    >
      {isLoading ? (
        <span className="tm-spinner-inline" />
      ) : (
        <>
          {leftIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
