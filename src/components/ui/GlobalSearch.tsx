import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Clock, Sparkles, MapPin, Building2, 
  Globe, Landmark, ArrowRight, Check, Loader2 
} from '../../icons';
import { 
  searchGlobalDestinations, 
  resolveSearchResultToDestination,
  POPULAR_SEARCH_PRESETS,
  type SearchResultItem, 
  type SearchCategory 
} from '../../services/searchService';
import type { DestinationItem } from '../../services/destinationCatalog';
import { useLanguage } from '../../context/LanguageContext';

interface GlobalSearchProps {
  variant?: 'header' | 'globe' | 'modal';
  placeholder?: string;
  autoFocus?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSelectDestination?: (result: SearchResultItem, destination: DestinationItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

const RECENT_SEARCHES_STORAGE_KEY = 'tripmind_recent_searches';
const DEFAULT_RECENTS = ['France', 'Dubai', 'Tokyo', 'Uzbekistan', 'Paris', 'Burj Khalifa'];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  variant = 'header',
  placeholder,
  autoFocus = false,
  isOpen: externalIsOpen,
  onClose,
  onSelectDestination,
  className = '',
  style
}) => {
  const { t } = useLanguage();
  const effectivePlaceholder = placeholder || t('hero.searchPlaceholder');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isDropdownVisible = externalIsOpen !== undefined ? externalIsOpen : isFocused;

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(DEFAULT_RECENTS);
      }
    } catch {
      setRecentSearches(DEFAULT_RECENTS);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const next = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save recent search to localStorage', e);
      }
      return next;
    });
  }, []);

  // Remove single recent search
  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const next = prev.filter((item) => item.toLowerCase() !== termToRemove.toLowerCase());
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to update recent searches', e);
      }
      return next;
    });
  };

  // Clear all recent searches
  const clearAllRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches', e);
    }
  };

  // Debounced search query resolution
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const matched = searchGlobalDestinations(query, 8);
      setResults(matched);
      setIsLoading(false);
      setActiveIndex(matched.length > 0 ? 0 : -1);
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside detection to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Selection Handler
  const handleSelectResult = (item: SearchResultItem) => {
    saveRecentSearch(item.title);
    const destination = resolveSearchResultToDestination(item);
    
    // Store selected in localStorage for persistence across reloads
    try {
      localStorage.setItem('tripmind_selected_country', item.countryId);
      localStorage.setItem('tripmind_selected_destination', JSON.stringify({
        id: item.id,
        title: item.title,
        countryId: item.countryId,
        lat: item.lat,
        lng: item.lng
      }));
    } catch (e) {
      console.warn('Storage quota or disabled', e);
    }

    if (onSelectDestination) {
      onSelectDestination(item, destination);
    }

    setQuery('');
    setIsFocused(false);
    setActiveIndex(-1);
    if (onClose) onClose();
  };

  // Preset pill click
  const handleSelectPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    const matched = searchGlobalDestinations(presetQuery, 8);
    if (matched.length > 0) {
      handleSelectResult(matched[0]);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsFocused(false);
      setQuery('');
      if (onClose) onClose();
      return;
    }

    if (!isDropdownVisible) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        const targetIndex = activeIndex >= 0 && activeIndex < results.length ? activeIndex : 0;
        handleSelectResult(results[targetIndex]);
      } else if (query.trim()) {
        const matched = searchGlobalDestinations(query, 1);
        if (matched.length > 0) {
          handleSelectResult(matched[0]);
        }
      }
    }
  };

  // Auto scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  // Badge category helper
  const getCategoryConfig = (category: SearchCategory) => {
    switch (category) {
      case 'country':
        return {
          label: 'Country',
          icon: <Globe size={13} />,
          bg: 'rgba(59, 130, 246, 0.15)',
          color: '#60A5FA',
          border: 'rgba(59, 130, 246, 0.3)'
        };
      case 'city':
        return {
          label: 'City',
          icon: <Building2 size={13} />,
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#34D399',
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case 'landmark':
        return {
          label: 'Landmark',
          icon: <Landmark size={13} />,
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#FBBF24',
          border: 'rgba(245, 158, 11, 0.3)'
        };
      case 'destination':
      default:
        return {
          label: 'Destination',
          icon: <MapPin size={13} />,
          bg: 'rgba(168, 85, 247, 0.15)',
          color: '#C084FC',
          border: 'rgba(168, 85, 247, 0.3)'
        };
    }
  };

  // Styles tailored by variant
  const isGlobeVariant = variant === 'globe';
  const isModalVariant = variant === 'modal';

  return (
    <div 
      ref={containerRef} 
      className={`tripmind-global-search ${className}`}
      style={{
        position: 'relative',
        width: isModalVariant ? '100%' : isGlobeVariant ? '100%' : '440px',
        maxWidth: isGlobeVariant ? '100%' : '100%',
        ...style
      }}
    >
      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: isGlobeVariant 
            ? 'rgba(11, 23, 40, 0.85)' 
            : '#101E32',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDropdownVisible 
            ? '1.5px solid #3B82F6' 
            : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: isModalVariant ? '16px' : '100px',
          padding: isModalVariant ? '12px 18px' : '8px 16px',
          boxShadow: isDropdownVisible 
            ? '0 0 20px rgba(59, 130, 246, 0.25), 0 8px 24px rgba(0, 0, 0, 0.4)' 
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', color: isDropdownVisible ? '#60A5FA' : '#94A3B8', flexShrink: 0 }}>
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            >
              <Loader2 size={18} style={{ color: '#3B82F6' }} />
            </motion.div>
          ) : (
            <Search size={18} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={effectivePlaceholder}
          autoFocus={autoFocus}
          aria-label="Global Travel Search"
          aria-autocomplete="list"
          aria-expanded={isDropdownVisible}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: isModalVariant ? '1rem' : '0.86rem',
            color: '#F8FAFC',
            fontFamily: 'inherit',
            fontWeight: 500
          }}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear Search Input"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <X size={12} />
          </button>
        )}

        {/* Keyboard shortcut tag for desktop */}
        {!query && !isGlobeVariant && (
          <div 
            className="desktop-only" 
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#64748B',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 6px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            ⌘K
          </div>
        )}
      </div>

      {/* Dropdown Suggestions & History Menu */}
      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#0B1728',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              zIndex: 1000,
              overflow: 'hidden',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              maxHeight: '460px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 1. LOADING BAR INDICATOR */}
            {isLoading && (
              <div style={{ height: '2px', width: '100%', background: 'rgba(59, 130, 246, 0.2)', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#3B82F6', width: '40%' }}
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
                />
              </div>
            )}

            <div style={{ overflowY: 'auto', padding: '10px' }} ref={listRef}>
              
              {/* 2. RESULTS LIST (When search has query and matches) */}
              {query.trim() && results.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px 6px 8px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px' }}>
                      Suggested Destinations ({results.length})
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#64748B' }}>
                      Use ↑ ↓ and Enter
                    </span>
                  </div>

                  {results.map((item, idx) => {
                    const isSelected = activeIndex === idx;
                    const cat = getCategoryConfig(item.category);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                          border: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                          color: '#F8FAFC',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          {/* Flag / Image Avatar */}
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#101E32',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            flexShrink: 0,
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            {item.image ? (
                              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              item.flag
                            )}
                            <div style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              fontSize: '0.75rem',
                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
                            }}>
                              {item.flag}
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.title}
                              </strong>
                              {item.badge && (
                                <span style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  color: '#3B82F6',
                                  background: 'rgba(59, 130, 246, 0.12)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Category Chip & Action */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: cat.color,
                            background: cat.bg,
                            border: `1px solid ${cat.border}`,
                            padding: '3px 8px',
                            borderRadius: '100px'
                          }}>
                            {cat.icon}
                            <span>{cat.label}</span>
                          </span>

                          <span style={{
                            color: isSelected ? '#60A5FA' : '#64748B',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. EMPTY STATE (When query exists but no matches found) */}
              {query.trim() && !isLoading && results.length === 0 && (
                <div style={{ padding: '28px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EF4444'
                  }}>
                    <Search size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#F8FAFC', display: 'block' }}>
                      No destinations found for "{query}"
                    </strong>
                    <span style={{ fontSize: '0.76rem', color: '#94A3B8', maxWidth: '300px', display: 'block', margin: '4px auto 0 auto' }}>
                      Try searching for a country, city, or landmark like <strong>Dubai</strong>, <strong>France</strong>, <strong>Tokyo</strong>, or <strong>Burj Khalifa</strong>.
                    </span>
                  </div>

                  {/* Recommendations */}
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {POPULAR_SEARCH_PRESETS.slice(0, 4).map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleSelectPreset(p.query)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: '#101E32',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#60A5FA',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {p.flag} {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. DEFAULT INITIAL STATE (When query is empty: Recent + Popular Searches) */}
              {!query.trim() && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 2px' }}>
                  
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px' }}>
                          <Clock size={12} />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          type="button"
                          onClick={clearAllRecents}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.68rem',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '2px 4px'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                        >
                          Clear all
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {recentSearches.map((term, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectPreset(term)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#101E32',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '8px',
                              padding: '5px 8px 5px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#F8FAFC',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.background = '#101E32';
                            }}
                          >
                            <span>{term}</span>
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(e, term)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#64748B',
                                padding: '2px',
                                display: 'flex',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '0 6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px' }}>
                        <Sparkles size={12} style={{ color: '#F59E0B' }} />
                        <span>Popular & Trending</span>
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px' }}>
                      {POPULAR_SEARCH_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => handleSelectPreset(p.query)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            background: '#101E32',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: '#F8FAFC',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#101E32';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '1rem' }}>{p.flag}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{p.label}</span>
                          </div>
                          <span style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'capitalize' }}>
                            {p.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* 5. FOOTER SHORTCUT HINTS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.68rem',
              color: '#64748B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', color: '#94A3B8' }}>↑</kbd> <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', color: '#94A3B8' }}>↓</kbd> navigate</span>
                <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', color: '#94A3B8' }}>↵</kbd> select</span>
                <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', color: '#94A3B8' }}>esc</kbd> close</span>
              </div>
              <span style={{ color: '#3B82F6', fontWeight: 700 }}>TripMind Global Discovery</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
