import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Navigation, X, Plus, Minus, Crosshair, Play, ChevronRight, Compass } from '../icons';
import { CountryInfoPanel } from './CountryInfoPanel';
import type { CountryData } from './CountryInfoPanel';
import { GlobeScene, COUNTRIES } from './GlobeScene';
import type { GlobeCountryData } from './GlobeScene';
import { 
  DESTINATIONS_CATALOG, 
  type DestinationItem, 
  resolveDestination, 
  getDestinationSuggestions 
} from '../services/destinationCatalog';

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

    // Check if we already are at this destination
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
    }, 4000);
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
        background: 'transparent'
      }}
    >
      {/* INTEGRATED FLOATING SEARCH BAR CONNECTED TO GLOBE */}
      {showSearchBar && (
        <div
          ref={searchContainerRef}
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 120,
            width: '92%',
            maxWidth: '480px'
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'var(--color-bg-surface, rgba(15, 23, 42, 0.9))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: isSearchFocused ? '1px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '100px',
              padding: '6px 14px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s ease'
            }}
          >
            <Search size={18} style={{ color: isSearchFocused ? '#60A5FA' : '#94A3B8', marginRight: '10px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search destination (e.g. Uzbekistan, Cappadocia, Paris)..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-primary, #ffffff)',
                fontSize: '0.88rem',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              style={{
                marginLeft: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0
              }}
            >
              <Navigation size={12} />
              <span>Fly</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isSearchFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute',
                  top: '52px',
                  left: 0,
                  right: 0,
                  background: 'var(--color-bg-surface, rgba(15, 23, 42, 0.95))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '18px',
                  padding: '8px',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  overflow: 'hidden'
                }}
              >
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleDestinationTransition(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-primary, #ffffff)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{item.flag}</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800 }}>{item.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.country} • {item.type}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <MapPin size={12} /> View on Globe
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* THREE.JS WEBGL CANVAS */}
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        style={{ background: 'transparent', outline: 'none' }}
      >
        <Suspense fallback={null}>
          <GlobeScene
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
              // Smoothly mark flight arrival
              setFlightActive(false);
            }}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            zoomLevel={zoomLevel}
          />
        </Suspense>
      </Canvas>

      {/* Top-Left Target Crosshair Button (Reference 3) */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 110 }}>
        <button
          onClick={() => {
            setAutoRotate(!autoRotate);
            triggerAutoRotatePause();
          }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(15, 23, 42, 0.1))',
            color: autoRotate ? '#2563eb' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
          title="Target recenter"
        >
          <Crosshair size={18} />
        </button>
      </div>

      {/* Top-Right Globe Controls (+, -, Recenter) (Reference 3) */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 110, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev * 1.25, 2.2))}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(15, 23, 42, 0.1))',
            color: 'var(--color-text-primary, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
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
            borderRadius: '8px',
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(15, 23, 42, 0.1))',
            color: 'var(--color-text-primary, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
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
            borderRadius: '8px',
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(15, 23, 42, 0.1))',
            color: 'var(--color-text-primary, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
          }}
          title="Recenter Globe"
        >
          <Compass size={16} />
        </button>
      </div>

      {/* Bottom-Left Photo Carousel Preview Overlay (Reference 3) */}
      {activeDestination?.popularDestinations && activeDestination.popularDestinations.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '5px 8px',
          borderRadius: '12px',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)'
        }}>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Play auto tour"
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
                border: idx === 0 ? '2px solid #2563eb' : '1px solid rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
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
              background: 'rgba(15, 23, 42, 0.06)',
              border: 'none',
              color: '#0f172a',
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
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            textAlign: 'center',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span style={{ fontSize: '0.65rem', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {hoveredCountryFeature.properties.SUBREGION || hoveredCountryFeature.properties.CONTINENT}
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            {hoveredCountryFeature.properties.NAME}
          </h4>
          <span style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '2px' }}>
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
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            backdropFilter: 'blur(12px)',
            padding: '8px 16px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
          }}
        >
          <Sparkles size={14} style={{ color: '#38BDF8' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
            Flight in progress: <strong style={{ color: '#38BDF8' }}>{previousDestination.name}</strong> ➔ <strong style={{ color: '#F59E0B' }}>{activeDestination.name}</strong>
          </span>
        </motion.div>
      )}

      {/* Selected Country / Destination Detail Panel Overlay */}
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
