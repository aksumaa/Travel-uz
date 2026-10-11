import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Dropdown } from './Dropdown';
import type { Language } from '../../locales/translations';

export interface LanguageSelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', style }) => {
  const { language, setLanguage } = useLanguage();

  const langOptions = [
    { id: 'en', label: 'English', icon: <span>🇺🇸</span>, badge: 'EN' },
    { id: 'uz', label: 'O‘zbekcha', icon: <span>🇺🇿</span>, badge: 'UZ' },
    { id: 'ru', label: 'Русский', icon: <span>🇷🇺</span>, badge: 'RU' }
  ];

  const currentOption = langOptions.find(o => o.id.toLowerCase() === language?.toLowerCase()) || langOptions[0];

  return (
    <Dropdown
      options={langOptions}
      selectedId={currentOption.id}
      onSelect={(opt) => setLanguage(opt.id as Language)}
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
          <span>{currentOption.icon}</span>
          <span>{currentOption.badge}</span>
        </div>
      }
      align="right"
    />
  );
};
