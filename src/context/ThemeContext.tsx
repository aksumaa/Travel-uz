import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const saved = localStorage.getItem('traveluz-theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved as Theme);
        return;
      }
    }
    localStorage.setItem('traveluz-theme', theme);
    const root = document.documentElement;
    root.style.transition = 'all 0.3s';
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark-theme');
    } else {
      root.classList.remove('light');
      root.classList.add('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
