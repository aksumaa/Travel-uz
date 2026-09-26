import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { CountryInfoPanel } from './CountryInfoPanel';
import type { CountryData } from './CountryInfoPanel';
import { GlobeScene, COUNTRIES } from './GlobeScene';
import type { GlobeCountryData } from './GlobeScene';

export type { CountryData, GlobeCountryData };
export { COUNTRIES };

// Main Props
interface GlobeProps {
  onCountrySelect?: (country: CountryData) => void;
  selectedCountry?: string | null;
  compact?: boolean;

  // Compatibility overrides
  selectedCountryId?: string | null;
  onSelectCountry?: (countryId: string) => void;
  onCreateTrip?: (country: any) => void;
  onSelectedFeature?: (feature: any) => void;
}

export const Globe3D: React.FC<GlobeProps> = ({
  onCountrySelect,
  selectedCountry,
  compact = false,
  selectedCountryId,
  onSelectCountry,
  onCreateTrip,
  onSelectedFeature
}) => {
  
  // Resolve active states
  const activeSelectedId = selectedCountry || selectedCountryId || null;

  // Local state for overlays
  const [hoveredCountryFeature, setHoveredCountryFeature] = useState<any>(null);
  const [selectedCountryFeature, setSelectedCountryFeature] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  React.useEffect(() => {
    onSelectedFeature?.(selectedCountryFeature);
  }, [selectedCountryFeature, onSelectedFeature]);

  // Refs
  const autoRotateTimerRef = useRef<any>(null);

  // Auto rotate control pause/resume
  const triggerAutoRotatePause = () => {
    setAutoRotate(false);
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 3000);
  };

  // Close panel handler
  const handlePanelClose = () => {
    setSelectedCountryFeature(null);
    if (onSelectCountry) onSelectCountry('uzbekistan');
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
        minHeight: compact ? '300px' : '450px',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        style={{ background: 'transparent', outline: 'none' }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            activeSelectedId={activeSelectedId}
            selectedCountryFeature={selectedCountryFeature}
            hoveredCountryFeature={hoveredCountryFeature}
            onHoverCountryFeatureChange={setHoveredCountryFeature}
            onSelectCountryFeatureChange={setSelectedCountryFeature}
            onCountrySelect={onCountrySelect}
            onSelectCountry={onSelectCountry}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
          />
        </Suspense>
      </Canvas>

      {/* Floating 2D HUD Info on Country Hover */}
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
            padding: '12px 16px',
            borderRadius: '16px',
            background: 'var(--glass-bg, rgba(15, 23, 42, 0.85))',
            border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.12))',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            textAlign: 'center',
            color: 'var(--color-text-primary, #ffffff)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '0.65rem', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {hoveredCountryFeature.properties.SUBREGION || hoveredCountryFeature.properties.CONTINENT}
          </span>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 0 0', fontFamily: "'Outfit', sans-serif" }}>
            {hoveredCountryFeature.properties.NAME}
          </h4>
          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted, #94a3b8)', marginTop: '2px', fontWeight: 600 }}>
            Click country to view telemetry stats
          </span>
        </div>
      )}

      {/* Selected Country Drawer Overlay - Only when NOT compact (Dashboard has its own inline layout) */}
      {!compact && (
        <AnimatePresence>
          {selectedCountryFeature && (
            <CountryInfoPanel
              country={selectedCountryFeature}
              onClose={handlePanelClose}
              onCreateTrip={onCreateTrip}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
