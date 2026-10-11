import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';
import type { Language, TranslationDictionary } from '../locales/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const STORAGE_KEY = 'tripmind-language';
const LEGACY_STORAGE_KEY = 'traveluz-lang';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      const normalized = saved.toLowerCase();
      if (normalized === 'uz' || normalized === 'ru' || normalized === 'en') {
        return normalized as Language;
      }
    }

    // Detect browser language
    const browserLang = (navigator.language || navigator.languages?.[0] || '').toLowerCase().split('-')[0];
    if (browserLang === 'uz' || browserLang === 'ru' || browserLang === 'en') {
      return browserLang as Language;
    }
  } catch (e) {
    console.error('Error retrieving initial language:', e);
  }
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      localStorage.setItem(LEGACY_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error('Error saving language to localStorage:', e);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    const normalized = lang.toLowerCase() as Language;
    if (normalized === 'uz' || normalized === 'ru' || normalized === 'en') {
      setLanguageState(normalized);
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
        localStorage.setItem(LEGACY_STORAGE_KEY, normalized);
        document.documentElement.lang = normalized;
      } catch (e) {
        console.error('Error saving language:', e);
      }
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    if (!obj || typeof obj !== 'object') return undefined;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Backward compatibility mapping for older legacy keys
    const legacyKeys: Record<string, string> = {
      'navbar.destinations': 'nav.destinations',
      'navbar.planner': 'nav.planner',
      'navbar.about': 'nav.about',
      'navbar.howItWorks': 'nav.howItWorks',
      'navbar.faq': 'nav.faq',
      'navbar.signIn': 'nav.login',
      'navbar.signOut': 'nav.signOut',
      'navbar.myTrips': 'nav.trips',
      'navbar.dashboard': 'nav.dashboard',
      'landing.heroTitle': 'hero.headline',
      'landing.heroSubtitle': 'hero.subtitle',
      'landing.heroCta': 'hero.startExploring',
      'landing.heroExplore': 'hero.exploreWorld',
      'landing.searchPlaceholder': 'hero.searchPlaceholder',
      'landing.destinationsTitle': 'destinations.title',
      'landing.plannerHeading': 'planner.title',
    };

    const targetKey = legacyKeys[key] || key;
    const currentDict = translations[language] || translations['en'];
    const fallbackDict = translations['en'];

    let result = getNestedValue(currentDict, targetKey);
    if (result === undefined && currentDict !== fallbackDict) {
      result = getNestedValue(fallbackDict, targetKey);
    }

    if (typeof result === 'string') {
      if (params) {
        let interpolated = result;
        for (const [paramKey, paramVal] of Object.entries(params)) {
          interpolated = interpolated.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        }
        return interpolated;
      }
      return result;
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export useTranslation hook as an alias for backwards compatibility
export const useTranslation = useLanguage;
