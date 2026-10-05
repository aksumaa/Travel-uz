import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('traveluz-theme');
    if (saved === 'dark' || saved === 'light') {
      return saved as Theme;
    }
    return 'light'; // Default theme: LIGHT (TripMind design direction)
  });

  useEffect(() => {
    localStorage.setItem('traveluz-theme', theme);
    const root = document.documentElement;
    
    // Set smooth transition on root element style
    root.style.transition = 'all 0.3s';
    
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark-theme'); // for safety/legacy compat
    } else {
      root.classList.remove('light');
      root.classList.add('dark-theme'); // for safety/legacy compat
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
