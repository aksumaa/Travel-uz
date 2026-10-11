import React from 'react';
import { Search, X } from '../../icons';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search countries, cities, or experiences...',
  className = '',
  style,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div
      className="tm-search-wrapper"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding: '8px 16px',
        width: '100%',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
    >
      <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '10px', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`tm-search-input ${className}`}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            background: 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '6px',
            transition: 'opacity 0.2s'
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
