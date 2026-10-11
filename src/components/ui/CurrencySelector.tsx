import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { Dropdown } from './Dropdown';

export interface CurrencySelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ className = '', style }) => {
  const { currency, setCurrency, currencies } = useCurrency();

  const currencyOptions = currencies.map((curr) => ({
    id: curr.code,
    label: `${curr.code} (${curr.symbol})`,
    badge: curr.symbol
  }));

  const currentOption = currencyOptions.find((c) => c.id === currency) || currencyOptions[0];

  return (
    <Dropdown
      options={currencyOptions}
      selectedId={currentOption.id}
      onSelect={(opt) => setCurrency(opt.id as any)}
      trigger={
        <div
          className={`tm-selector-btn ${className}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease',
            ...style
          }}
        >
          <span>{currentOption.id}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{currentOption.badge}</span>
        </div>
      }
      align="right"
    />
  );
};
