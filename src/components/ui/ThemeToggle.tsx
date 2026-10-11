import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from '../../icons';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', style }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={`tm-theme-toggle ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        color: isLight ? '#D97706' : '#60A5FA',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: 0,
        ...style
      }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isLight ? <Sun size={19} /> : <Moon size={19} />}
      </motion.div>
    </button>
  );
};
