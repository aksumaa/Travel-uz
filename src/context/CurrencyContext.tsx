import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'UZS' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // Multiplier relative to 1 USD
  format: (amount: number) => string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1.0,
    format: (amt) => `$${Math.round(amt).toLocaleString()}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.92,
    format: (amt) => `€${Math.round(amt).toLocaleString()}`,
  },
  UZS: {
    code: 'UZS',
    symbol: 'soʻm',
    name: 'Uzbek Som',
    rate: 12800,
    format: (amt) => `${Math.round(amt).toLocaleString()} soʻm`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rate: 0.79,
    format: (amt) => `£${Math.round(amt).toLocaleString()}`,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rate: 155,
    format: (amt) => `¥${Math.round(amt).toLocaleString()}`,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number, code?: CurrencyCode) => string;
  convertPrice: (amountInUSD: number, code?: CurrencyCode) => number;
  currencies: CurrencyConfig[];
  currentConfig: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('tripmind_currency');
    if (saved && saved in CURRENCIES) {
      return saved as CurrencyCode;
    }
    return 'USD';
  });

  useEffect(() => {
    localStorage.setItem('tripmind_currency', currency);
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => {
    if (code in CURRENCIES) {
      setCurrencyState(code);
    }
  };

  const convertPrice = (amountInUSD: number, code?: CurrencyCode): number => {
    const targetCode = code || currency;
    const config = CURRENCIES[targetCode] || CURRENCIES.USD;
    return amountInUSD * config.rate;
  };

  const formatPrice = (amountInUSD: number, code?: CurrencyCode): string => {
    const targetCode = code || currency;
    const config = CURRENCIES[targetCode] || CURRENCIES.USD;
    const converted = amountInUSD * config.rate;
    return config.format(converted);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        currencies: Object.values(CURRENCIES),
        currentConfig: CURRENCIES[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
