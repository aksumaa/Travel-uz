import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Compass, Shield, Sparkles } from '../icons';
import { useCurrency } from '../context/CurrencyContext';

declare global {
  interface Window {
    google?: any;
  }
}

export interface MapPoint {
  id: string;
  title: string;
  category?: 'attraction' | 'food' | 'cafe' | 'transport' | 'shopping' | 'entertainment' | 'lodging' | string;
  lat?: number;
  lng?: number;
  timeSlot?: string;
  cost?: number;
  address?: string;
  location?: string;
  isVerified?: boolean;
  order?: number;
}

interface TripMapProps {
  locations: MapPoint[];
  center?: { lat: number; lng: number };
  zoom?: number;
  activeLocationId?: string | null;
  onSelectLocation?: (id: string) => void;
  height?: string | number;
  interactive?: boolean;
}

export const TripMap: React.FC<TripMapProps> = ({
  locations,
  center,
  zoom = 14,
  activeLocationId,
  onSelectLocation,
  height = '100%',
  interactive = true,
}) => {
  const { formatPrice } = useCurrency();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [svgZoom, setSvgZoom] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  // Default coordinate center (fallback to Samarkand / Tashkent if not provided)
  const defaultCenter = center || {
    lat: locations.find((l) => l.lat && l.lng)?.lat || 39.6542,
    lng: locations.find((l) => l.lat && l.lng)?.lng || 66.9597,
  };

  const apiKey = (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env?.VITE_GOOGLE_MAPS_API_KEY)) || '';

  // Check if Google Maps is available
  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_KEY' || apiKey === '') {
      setUseGoogleMaps(false);
      return;
    }

    if (window.google?.maps) {
      setUseGoogleMaps(true);
      return;
    }

    // Try loading script tag
    const scriptId = 'google-maps-sdk-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setUseGoogleMaps(true);
      script.onerror = () => setUseGoogleMaps(false);
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // Google Maps Instance Effect
  useEffect(() => {
    if (!useGoogleMaps || !mapContainerRef.current || !window.google?.maps) return;

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: zoom,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#090d1a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#38bdf8' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#94a3b8' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#14253d' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#1e293b' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#0f172a' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0284c7' }],
          },
        ],
        disableDefaultUI: !interactive,
        zoomControl: interactive,
      });

      const bounds = new window.google.maps.LatLngBounds();
      const pathCoords: any[] = [];

      locations.forEach((loc, index) => {
        if (!loc.lat || !loc.lng) return;
        const pos = { lat: loc.lat, lng: loc.lng };
        bounds.extend(pos);
        pathCoords.push(pos);

        const marker = new window.google.maps.Marker({
          position: pos,
          map,
          title: loc.title,
          label: {
            text: String(index + 1),
            color: '#ffffff',
            fontWeight: 'bold',
          },
        });

        marker.addListener('click', () => {
          setSelectedPoint(loc);
          if (onSelectLocation) onSelectLocation(loc.id);
        });
      });

      // Draw polyline connecting day itinerary stops
      if (pathCoords.length > 1) {
        new window.google.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#2563eb',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map,
        });
      }

      if (locations.length > 1) {
        map.fitBounds(bounds);
      }
    } catch (e) {
      console.warn('Google maps rendering error, fallback to vector map', e);
      setUseGoogleMaps(false);
    }
  }, [useGoogleMaps, locations, defaultCenter, zoom, interactive]);

  // Keep selected point in sync with activeLocationId prop
  useEffect(() => {
    if (activeLocationId) {
      const match = locations.find((l) => l.id === activeLocationId);
      if (match) setSelectedPoint(match);
    }
  }, [activeLocationId, locations]);

  // Fallback Interactive Vector Map (Clean modern Canvas SVG)
  // Calculate relative coordinate layout for locations
  const validPoints = locations.filter((l) => l.lat !== undefined && l.lng !== undefined);
  const minLat = Math.min(...validPoints.map((p) => p.lat!), defaultCenter.lat - 0.04);
  const maxLat = Math.max(...validPoints.map((p) => p.lat!), defaultCenter.lat + 0.04);
  const minLng = Math.min(...validPoints.map((p) => p.lng!), defaultCenter.lng - 0.04);
  const maxLng = Math.max(...validPoints.map((p) => p.lng!), defaultCenter.lng + 0.04);

  const getSvgCoordinates = (lat?: number, lng?: number, index = 0) => {
    if (lat === undefined || lng === undefined) {
      // Offset positions if coordinates not provided
      const angle = (index / Math.max(locations.length, 1)) * 2 * Math.PI;
      return {
        x: 400 + Math.cos(angle) * 220,
        y: 280 + Math.sin(angle) * 160,
      };
    }
    const latSpan = Math.max(maxLat - minLat, 0.01);
    const lngSpan = Math.max(maxLng - minLng, 0.01);
    const padding = 100;
    const width = 800 - padding * 2;
    const height = 560 - padding * 2;

    const x = padding + ((lng - minLng) / lngSpan) * width;
    const y = 560 - (padding + ((lat - minLat) / latSpan) * height);
    return { x, y };
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'attraction':
        return '#2563eb'; // Blue
      case 'food':
      case 'cafe':
        return '#f59e0b'; // Amber
      case 'transport':
        return '#06b6d4'; // Cyan
      case 'shopping':
        return '#ec4899'; // Pink
      case 'entertainment':
        return '#8b5cf6'; // Purple
      case 'lodging':
        return '#10b981'; // Green
      default:
        return '#2563eb';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        minHeight: '360px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--color-bg-surface, #0f172a)',
        border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
      }}
    >
      {/* If Google Maps is active and supported, render GMaps container */}
      {useGoogleMaps ? (
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        /* Vector SVG Interactive Dark-Mode Canvas */
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at 50% 50%, #17223b 0%, #090d1a 100%)',
          }}
        >
          {/* Subtle Map Grid lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
            }}
          />

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 800 560"
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${svgZoom})`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Draw Sequential Transit Connecting Lines between nodes */}
            {locations.map((loc, idx) => {
              if (idx === locations.length - 1) return null;
              const currentCoord = getSvgCoordinates(loc.lat, loc.lng, idx);
              const nextLoc = locations[idx + 1];
              const nextCoord = getSvgCoordinates(nextLoc.lat, nextLoc.lng, idx + 1);

              return (
                <g key={`path-${idx}`}>
                  <line
                    x1={currentCoord.x}
                    y1={currentCoord.y}
                    x2={nextCoord.x}
                    y2={nextCoord.y}
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeOpacity="0.75"
                  />
                  {/* Midpoint walking distance label if available */}
                  <circle
                    cx={(currentCoord.x + nextCoord.x) / 2}
                    cy={(currentCoord.y + nextCoord.y) / 2}
                    r="4"
                    fill="#38bdf8"
                  />
                </g>
              );
            })}

            {/* Draw Interactive Location Pins */}
            {locations.map((loc, idx) => {
              const { x, y } = getSvgCoordinates(loc.lat, loc.lng, idx);
              const isSelected = selectedPoint?.id === loc.id;
              const color = getCategoryColor(loc.category);

              return (
                <g
                  key={loc.id || idx}
                  onClick={() => {
                    setSelectedPoint(loc);
                    if (onSelectLocation) onSelectLocation(loc.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse animation on active item */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="26"
                      fill={color}
                      fillOpacity="0.25"
                      style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                    />
                  )}

                  {/* Marker Pin Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? '18' : '14'}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '3' : '2'}
                    filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))"
                  />

                  {/* Order Number Text */}
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isSelected ? '13' : '11'}
                    fontWeight="800"
                    fontFamily="var(--font-heading, sans-serif)"
                    pointerEvents="none"
                  >
                    {idx + 1}
                  </text>

                  {/* Pin label preview */}
                  <text
                    x={x}
                    y={y + 30}
                    textAnchor="middle"
                    fill="var(--color-text-primary, #ffffff)"
                    fontSize="11"
                    fontWeight="700"
                    filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8))"
                    pointerEvents="none"
                  >
                    {loc.title.length > 20 ? `${loc.title.slice(0, 18)}…` : loc.title}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Map Status Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: '100px',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-text-secondary, #94a3b8)',
              zIndex: 10,
            }}
          >
            <Compass size={14} style={{ color: 'var(--color-accent, #2563eb)' }} />
            <span>Interactive Itinerary Route ({locations.length} stops)</span>
          </div>

          {/* Map Controls (+ / - / Reset) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setSvgZoom((z) => Math.min(z + 0.25, 2.2))}
              aria-label="Zoom in"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
                color: 'var(--color-text-primary, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setSvgZoom((z) => Math.max(z - 0.25, 0.75))}
              aria-label="Zoom out"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
                color: 'var(--color-text-primary, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setSvgZoom(1)}
              aria-label="Reset zoom"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
                color: 'var(--color-text-secondary, #94a3b8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Navigation size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Selected Node Floating Card Preview */}
      {selectedPoint && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            maxWidth: '420px',
            background: 'var(--color-bg-surface, #0f172a)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
            borderRadius: '14px',
            padding: '14px 18px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: getCategoryColor(selectedPoint.category),
                    background: 'rgba(37, 99, 235, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {selectedPoint.category || 'Sight'}
                </span>
                {selectedPoint.isVerified ? (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Shield size={10} /> Verified POI
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#a855f7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Sparkles size={10} /> AI Pick
                  </span>
                )}
              </div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-primary, #ffffff)' }}>
                {selectedPoint.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              aria-label="Close location card"
              style={{
                color: 'var(--color-text-muted, #64748b)',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary, #94a3b8)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} style={{ color: 'var(--color-accent, #2563eb)' }} />
              {selectedPoint.address || selectedPoint.location || 'Local District'}
            </span>
            {selectedPoint.cost !== undefined && (
              <strong style={{ color: '#10b981', fontSize: '0.85rem' }}>
                {selectedPoint.cost === 0 ? 'Free Entry' : formatPrice(selectedPoint.cost)}
              </strong>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
