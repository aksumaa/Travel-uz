import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';
import type { Language } from '../locales/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('traveluz-lang');
    if (saved === 'uz' || saved === 'ru' || saved === 'en') {
      return saved as Language;
    }
    // Handle uppercase legacy settings if present
    if (saved === 'UZ') return 'uz';
    if (saved === 'RU') return 'ru';
    if (saved === 'EN') return 'en';
    
    // Detect browser language or fallback to 'uz'
    const systemLang = navigator.language.split('-')[0].toLowerCase();
    if (systemLang === 'ru') return 'ru';
    if (systemLang === 'en') return 'en';
    return 'uz';
  });

  useEffect(() => {
    localStorage.setItem('traveluz-lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    // Standardize to lowercase
    const normalized = lang.toLowerCase() as Language;
    setLanguageState(normalized);
  };

  // Helper function to resolve nested keys like "nav.explore"
  const t = (key: string): string => {
    // Fallback mapping for older keys to prevent page breakdown
    const legacyKeys: Record<string, string> = {
      'navbar.destinations': 'nav.explore',
      'navbar.planner': 'nav.planner',
      'navbar.about': 'nav.about',
      'navbar.signIn': 'nav.login',
      'navbar.signOut': 'common.back',
      'navbar.myTrips': 'nav.trips',
      'navbar.dashboard': 'dashboard.explore',
      'landing.heroTitle': 'hero.headline',
      'landing.heroSubtitle': 'hero.subheadline',
      'landing.heroCta': 'hero.startPlanning',
      'landing.heroExplore': 'hero.exploreWorld',
      'landing.searchPlaceholder': 'hero.searchPlaceholder',
      'landing.destinationsTitle': 'destinations.title',
      'landing.plannerHeading': 'planner.title',
      'dashboard.whereTo': 'planner.where',
      'dashboard.travelers': 'planner.travelers',
      'dashboard.budget': 'planner.budget',
      'dashboard.budgetLow': 'planner.budget',
      'dashboard.budgetMed': 'planner.budget',
      'dashboard.budgetHigh': 'planner.budget',
      'dashboard.style': 'planner.style',
      'dashboard.styleActive': 'planner.style',
      'dashboard.styleRelax': 'planner.style',
      'dashboard.styleHistory': 'planner.style',
      'dashboard.styleNature': 'planner.style',
      'auth.signIn': 'nav.login',
      'auth.signUp': 'nav.getStarted',
      'auth.welcomeBack': 'auth.welcome',
      'auth.joinUs': 'auth.subtitle',
      'auth.successLogin': 'common.confirm',
      'auth.successRegister': 'common.confirm',
      'auth.errorFields': 'common.error',
      'dashboard.sidebarHome': 'dashboard.explore',
      'dashboard.sidebarPlanner': 'dashboard.planner',
      'dashboard.sidebarMyTrips': 'dashboard.myTrips',
      'dashboard.sidebarReadyTrips': 'dashboard.readyTrips',
      'dashboard.sidebarFlights': 'dashboard.flights',
      'dashboard.sidebarHotels': 'dashboard.hotels',
      'dashboard.sidebarAttractions': 'dashboard.attractions',
      'dashboard.sidebarSaved': 'dashboard.saved',
      'dashboard.sidebarAssistant': 'dashboard.assistant',
      'dashboard.sidebarProfile': 'dashboard.profile',
      'dashboard.sidebarSettings': 'dashboard.settings',
    };

    const resolvedKey = legacyKeys[key] || key;
    const keys = resolvedKey.split('.');
    
    // Safety check on language
    const normalizedLang = (language.toLowerCase() as Language);
    let current: any = translations[normalizedLang] || translations['uz'];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // If not found using mapped legacy key, check if raw key exists in new translation object directly
        if (resolvedKey !== key) {
          const rawKeys = key.split('.');
          let rawCurrent: any = translations[normalizedLang] || translations['uz'];
          let foundRaw = true;
          for (const rk of rawKeys) {
            if (rawCurrent && typeof rawCurrent === 'object' && rk in rawCurrent) {
              rawCurrent = rawCurrent[rk];
            } else {
              foundRaw = false;
              break;
            }
          }
          if (foundRaw && typeof rawCurrent === 'string') {
            return rawCurrent;
          }
        }
        console.warn(`Translation key not found: ${key} (resolved to: ${resolvedKey}) for language: ${language}`);
        return key;
      }
    }

    if (typeof current === 'string') {
      return current;
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
