import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Navigation, X, Plus, Minus, Crosshair, Play, ChevronRight, Compass } from '../icons';
import { CountryInfoPanel } from './CountryInfoPanel';
import { GlobeScene, COUNTRIES, type CountryData, type GlobeCountryData } from './GlobeScene';
import { GlobalSearch } from './ui/GlobalSearch';
import { 
  DESTINATIONS_CATALOG, 
  type DestinationItem, 
  resolveDestination, 
  getDestinationSuggestions 
} from '../services/destinationCatalog';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export type { CountryData, GlobeCountryData, DestinationItem };
export { COUNTRIES };

interface GlobeProps {
  onCountrySelect?: (country: CountryData) => void;
  onSelectCountry?: (countryId: string) => void;
  onDestinationSelect?: (destination: DestinationItem) => void;
  selectedCountry?: string | null;
  selectedCountryId?: string | null;
  onCreateTrip?: (destination: any) => void;
  compact?: boolean;
  showSearchBar?: boolean;
  initialDestinationId?: string;
  onSelectedFeature?: (feature: any) => void;
}

class GlobeErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Globe 3D WebGL render fallback activated:", error?.message || error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Interactive Elegant 2D/SVG Orbital Fallback Globe when WebGL is unavailable
const FallbackGlobeView: React.FC<{
  activeDestination: DestinationItem | null;
  onDestinationSelect: (dest: DestinationItem) => void;
  autoRotate?: boolean;
  theme?: 'light' | 'dark';
}> = ({ activeDestination, onDestinationSelect, autoRotate = true, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isLight 
        ? 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, rgba(241, 245, 249, 0.8) 70%)'
        : 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
      pointerEvents: 'auto'
    }}>
      <div style={{
        position: 'relative',
        width: 'min(380px, 80vw)',
        height: 'min(380px, 80vw)',
        borderRadius: '50%',
        background: isLight 
          ? 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #cbd5e1 100%)'
          : 'radial-gradient(circle at 35% 35%, #1e293b 0%, #090d1a 100%)',
        border: isLight ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: isLight 
          ? '0 0 50px rgba(37, 99, 235, 0.15), inset 0 0 30px rgba(37, 99, 235, 0.1)'
          : '0 0 60px rgba(14, 165, 233, 0.2), inset 0 0 40px rgba(37, 99, 235, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Atmosphere Rings */}
        <div style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: '50%',
          border: isLight ? '1px dashed rgba(37, 99, 235, 0.2)' : '1px dashed rgba(56, 189, 248, 0.2)',
          animation: autoRotate ? 'spin 40s linear infinite' : 'none'
        }} />
        <div style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          border: isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)'
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '1px',
          background: isLight 
            ? 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), transparent)'
        }} />
        <div style={{
          position: 'absolute',
          height: '100%',
          width: '1px',
          background: isLight
            ? 'linear-gradient(180deg, transparent, rgba(37, 99, 235, 0.3), transparent)'
            : 'linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.4), transparent)'
        }} />

        {/* Global Key Hub Nodes */}
        {DESTINATIONS_CATALOG.slice(0, 6).map((dest, idx) => {
          const angle = (idx / 6) * 2 * Math.PI - Math.PI / 2;
          const radiusPercent = 34; // from center
          const x = 50 + radiusPercent * Math.cos(angle);
          const y = 50 + radiusPercent * Math.sin(angle);
          const isSelected = activeDestination?.id === dest.id;

          return (
            <button
              key={dest.id}
              onClick={() => onDestinationSelect(dest)}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                background: isSelected 
                  ? (isLight ? '#2563EB' : '#38BDF8') 
                  : (isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)'),
                border: isSelected 
                  ? '2px solid #ffffff' 
                  : (isLight ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid rgba(56, 189, 248, 0.4)'),
                borderRadius: '100px',
                padding: '4px 8px',
                color: isSelected ? '#ffffff' : (isLight ? '#0F172A' : '#ffffff'),
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 10,
                boxShadow: isSelected 
                  ? '0 0 15px rgba(37, 99, 235, 0.5)' 
                  : (isLight ? '0 2px 6px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.5)'),
                transition: 'all 0.2s ease'
              }}
            >
              <span>{dest.flag}</span>
              <span>{dest.name}</span>
            </button>
          );
        })}

        {/* Center telemetry */}
        <div style={{ textAlign: 'center', zIndex: 5, padding: '12px', pointerEvents: 'none' }}>
          <div style={{ fontSize: '0.62rem', color: isLight ? '#2563EB' : '#38BDF8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Interactive Telemetry
          </div>
          <div style={{ fontSize: '0.9rem', color: isLight ? '#0F172A' : '#ffffff', fontWeight: 800 }}>
            {activeDestination?.name || 'Silk Road Hub'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Globe3D: React.FC<GlobeProps> = ({
  onCountrySelect,
  onDestinationSelect,
  selectedCountry,
  selectedCountryId,
  onSelectCountry,
  onCreateTrip,
  compact = false,
  showSearchBar = true,
  initialDestinationId = 'uzbekistan',
  onSelectedFeature
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  // Mounting state for SSR safety
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setAutoRotate(false);
      }
    }
  }, []);

  // Destination and flight states
  const [activeDestination, setActiveDestination] = useState<DestinationItem | null>(() => {
    return resolveDestination(selectedCountry || selectedCountryId || initialDestinationId) || DESTINATIONS_CATALOG[0];
  });
  const [previousDestination, setPreviousDestination] = useState<DestinationItem | null>(null);
  const [flightActive, setFlightActive] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DestinationItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Hover & selection overlays
  const [hoveredCountryFeature, setHoveredCountryFeature] = useState<any>(null);
  const [selectedCountryFeature, setSelectedCountryFeature] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  React.useEffect(() => {
    onSelectedFeature?.(selectedCountryFeature);
  }, [selectedCountryFeature, onSelectedFeature]);

  // Refs
  const autoRotateTimerRef = useRef<any>(null);

  // Synchronize when external props change
  useEffect(() => {
    const extId = selectedCountry || selectedCountryId;
    if (extId && (!activeDestination || activeDestination.id !== extId.toLowerCase())) {
      const resolved = resolveDestination(extId);
      if (resolved && resolved.id !== activeDestination?.id) {
        handleDestinationTransition(resolved);
      }
    }
  }, [selectedCountry, selectedCountryId]);

  // Handle Autocomplete Suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const results = getDestinationSuggestions(searchQuery, 5);
    setSuggestions(results);
  }, [searchQuery]);

  // Click outside listener for search autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Transition to target destination with curved flight animation if changing locations
  const handleDestinationTransition = (target: DestinationItem) => {
    if (!target) return;

    if (activeDestination && activeDestination.id === target.id) {
      return;
    }

    triggerAutoRotatePause();

    if (activeDestination) {
      setPreviousDestination(activeDestination);
      setFlightActive(true);
    }

    setActiveDestination(target);
    setSearchQuery('');
    setIsSearchFocused(false);

    if (onDestinationSelect) {
      onDestinationSelect(target);
    }
    if (onSelectCountry) {
      onSelectCountry(target.id);
    }
  };

  // Auto rotate pause on user interaction
  const triggerAutoRotatePause = () => {
    setAutoRotate(false);
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 4500);
  };

  // Close info panel
  const handlePanelClose = () => {
    setActiveDestination(null);
    setSelectedCountryFeature(null);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const resolved = resolveDestination(searchQuery);
    if (resolved) {
      handleDestinationTransition(resolved);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Background styling strictly matching theme requirement
  const containerBackground = isLight
    ? 'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #F8FAFC 55%, #E2E8F0 100%)'
    : 'radial-gradient(circle at 50% 45%, #0B1728 0%, #07111F 65%, #030712 100%)';

  return (
    <div
      onPointerDown={triggerAutoRotatePause}
      onWheel={triggerAutoRotatePause}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: compact ? '320px' : (isMobile ? '380px' : '520px'),
        overflow: 'hidden',
        background: containerBackground,
        transition: 'background 0.3s ease'
      }}
    >
      {/* INTEGRATED FLOATING SEARCH BAR CONNECTED TO GLOBE */}
      {showSearchBar && (
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 120,
            width: '92%',
            maxWidth: '480px'
          }}
        >
          <GlobalSearch
            variant="globe"
            placeholder={t('hero.searchPlaceholder')}
            onSelectDestination={(item, dest) => {
              handleDestinationTransition(dest);
              if (onSelectCountry) {
                onSelectCountry(item.countryId || dest.id);
              }
            }}
          />
        </div>
      )}

      {/* THREE.JS WEBGL CANVAS WITH CRASH-RESISTANT ERROR BOUNDARY */}
      {isMounted ? (
        <GlobeErrorBoundary
          fallback={
            <FallbackGlobeView
              activeDestination={activeDestination}
              onDestinationSelect={handleDestinationTransition}
              autoRotate={autoRotate}
              theme={theme}
            />
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={isMobile ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
            style={{ background: 'transparent', outline: 'none' }}
          >
            <Suspense fallback={null}>
              <GlobeScene
                theme={theme}
                activeSelectedId={activeDestination?.id || selectedCountry || selectedCountryId || null}
                activeDestination={activeDestination}
                previousDestination={previousDestination}
                flightActive={flightActive}
                selectedCountryFeature={selectedCountryFeature}
                hoveredCountryFeature={hoveredCountryFeature}
                onHoverCountryFeatureChange={setHoveredCountryFeature}
                onSelectCountryFeatureChange={setSelectedCountryFeature}
                onCountrySelect={onCountrySelect}
                onDestinationSelect={(dest) => {
                  if (activeDestination?.id !== dest.id) {
                    setPreviousDestination(activeDestination);
                    setFlightActive(true);
                    setActiveDestination(dest);
                  }
                  if (onDestinationSelect) onDestinationSelect(dest);
                }}
                onSelectCountry={onSelectCountry}
                onFlightArrival={() => {
                  setFlightActive(false);
                }}
                autoRotate={autoRotate}
                setAutoRotate={setAutoRotate}
                zoomLevel={zoomLevel}
              />
            </Suspense>
          </Canvas>
        </GlobeErrorBoundary>
      ) : (
        <FallbackGlobeView
          activeDestination={activeDestination}
          onDestinationSelect={handleDestinationTransition}
          autoRotate={false}
          theme={theme}
        />
      )}

      {/* Top-Left Target Crosshair Button (Auto-Rotate / Recenter toggle) */}
      <div style={{ position: 'absolute', top: '18px', left: '18px', zIndex: 110 }}>
        <button
          onClick={() => {
            setAutoRotate(!autoRotate);
            triggerAutoRotatePause();
          }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: autoRotate ? '#2563EB' : (isLight ? '#64748B' : '#94A3B8'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
          title={autoRotate ? "Pause auto-rotation" : "Enable auto-rotation"}
        >
          <Crosshair size={18} />
        </button>
      </div>

      {/* Top-Right Globe Controls (+, -, Recenter) */}
      <div style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 110, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev * 1.25, 2.2))}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: isLight ? '#0F172A' : '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 6px rgba(0, 0, 0, 0.06)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
          title="Zoom in"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev * 0.8, 0.65))}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: isLight ? '#0F172A' : '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 6px rgba(0, 0, 0, 0.06)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
          title="Zoom out"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            triggerAutoRotatePause();
          }}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: isLight ? '#0F172A' : '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 6px rgba(0, 0, 0, 0.06)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
          title="Recenter Globe"
        >
          <Compass size={16} />
        </button>
      </div>

      {/* Bottom-Left Photo Carousel Preview Overlay */}
      {activeDestination?.popularDestinations && activeDestination.popularDestinations.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          padding: '5px 8px',
          borderRadius: '14px',
          border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isLight ? '0 4px 14px rgba(0, 0, 0, 0.08)' : '0 4px 16px rgba(0, 0, 0, 0.35)'
        }}>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#2563EB',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Auto rotation"
          >
            <Play size={10} fill="#ffffff" />
          </button>
          {activeDestination.popularDestinations.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: idx === 0 ? '2px solid #2563EB' : (isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)'),
                cursor: 'pointer'
              }}
              title={item.name}
            >
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
          <button
            onClick={() => {
              const currIdx = DESTINATIONS_CATALOG.findIndex(d => d.id === activeDestination.id);
              const nextDest = DESTINATIONS_CATALOG[(currIdx + 1) % DESTINATIONS_CATALOG.length];
              handleDestinationTransition(nextDest);
            }}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: isLight ? '#0F172A' : '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Next Destination"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Lightweight Country Hover Tooltip */}
      {hoveredCountryFeature && (!selectedCountryFeature || selectedCountryFeature.properties.ISO_A3 !== hoveredCountryFeature.properties.ISO_A3) && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 100,
            width: '90%',
            maxWidth: '280px',
            padding: '10px 16px',
            borderRadius: '16px',
            background: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.92)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: isLight ? '0 8px 24px rgba(0, 0, 0, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            textAlign: 'center',
            color: isLight ? '#0F172A' : '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span style={{ fontSize: '0.65rem', color: isLight ? '#2563EB' : '#60A5FA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {hoveredCountryFeature.properties.SUBREGION || hoveredCountryFeature.properties.CONTINENT}
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            {hoveredCountryFeature.properties.NAME}
          </h4>
          <span style={{ fontSize: '0.62rem', color: isLight ? '#64748B' : '#94A3B8', marginTop: '2px' }}>
            Click country to inspect telemetry
          </span>
        </div>
      )}

      {/* Flight in progress indicator badge */}
      {flightActive && previousDestination && activeDestination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            zIndex: 100,
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.88)',
            border: isLight ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid rgba(56, 189, 248, 0.4)',
            backdropFilter: 'blur(12px)',
            padding: '8px 16px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.35)'
          }}
        >
          <Sparkles size={14} style={{ color: isLight ? '#2563EB' : '#38BDF8' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isLight ? '#0F172A' : '#ffffff' }}>
            Flight in progress: <strong style={{ color: isLight ? '#2563EB' : '#38BDF8' }}>{previousDestination.name}</strong> ➔ <strong style={{ color: '#F59E0B' }}>{activeDestination.name}</strong>
          </span>
        </motion.div>
      )}

      {/* Selected Country / Destination Detail Panel Overlay (when not compact) */}
      {!compact && (
        <AnimatePresence>
          {activeDestination && (
            <CountryInfoPanel
              country={activeDestination}
              onClose={handlePanelClose}
              onCreateTrip={onCreateTrip}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
