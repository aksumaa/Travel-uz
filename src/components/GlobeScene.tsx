import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Html } from '@react-three/drei';
import gsap from 'gsap';
import { 
  DESTINATIONS_CATALOG, 
  type DestinationItem, 
  resolveDestination, 
  generateDestinationForCountry 
} from '../services/destinationCatalog';
import { FlightPathAnimation, toXYZ } from './FlightPathAnimation';

export interface CountryData {
  name: string;
  capital: string;
  language: string;
  currency: string;
  timezone: string;
  population: string;
  area: string;
  flag: string;
  weather: { temp: number; condition: string };
  visa: string;
  bestTime: string;
  description: string;
  attractions: Array<{ name: string; city: string; image: string }>;
  foods: Array<{ name: string; image: string }>;
}

export interface GlobeCountryData extends CountryData {
  id: string;
  lat: number;
  lon: number;
}

export const COUNTRIES: GlobeCountryData[] = DESTINATIONS_CATALOG.map(d => ({
  name: d.name,
  capital: d.capital || d.name,
  language: d.language,
  currency: d.currency,
  timezone: d.timezone,
  population: 'Verified Regional Hub',
  area: '450,000 km²',
  flag: d.flag,
  weather: d.weather ? { temp: d.weather.tempC, condition: d.weather.condition } : { temp: 22, condition: 'Sunny' },
  visa: d.visaVerified?.status || 'Verified Destination',
  bestTime: d.bestSeason || 'Spring & Autumn',
  description: d.description,
  attractions: d.places.map(p => ({
    name: p.name,
    city: d.name,
    image: p.imageUrl || d.popularDestinations[0]?.image || 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80'
  })),
  foods: d.restaurants.map(r => ({
    name: r.specialty,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80'
  })),
  id: d.id,
  lat: d.lat,
  lon: d.lng
}));

export interface City {
  name: string;
  lat: number;
  lng: number;
  type: 'capital' | 'popular';
}

const CITIES: City[] = [
  { name: 'Tashkent', lat: 41.2995, lng: 69.2401, type: 'capital' },
  { name: 'Samarkand', lat: 39.6542, lng: 66.9597, type: 'popular' },
  { name: 'Cappadocia', lat: 38.6431, lng: 34.8289, type: 'popular' },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, type: 'popular' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, type: 'popular' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, type: 'popular' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, type: 'popular' },
  { name: 'New York', lat: 40.7128, lng: -74.006, type: 'popular' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, type: 'popular' },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, type: 'popular' },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, type: 'popular' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, type: 'popular' }
];

export { toXYZ };

const xyzToLatLng = (x: number, y: number, z: number, r = 2.5): { lat: number; lng: number } => {
  const phi = Math.acos(Math.max(-1, Math.min(1, y / r)));
  const lat = 90 - (phi * 180) / Math.PI;
  let theta = Math.atan2(z, -x);
  if (theta < 0) theta += 2 * Math.PI;
  const lng = (theta * 180) / Math.PI - 180;
  return { lat, lng };
};

function isPointInPolygon(point: [number, number], polygon: [number, number][]) {
  const x = point[0]; // lng
  const y = point[1]; // lat
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function calculateBBox(geometry: any): [number, number, number, number] {
  let minLon = 180, maxLon = -180;
  let minLat = 90, maxLat = -90;

  const processPolygon = (polygon: number[][]) => {
    for (const point of polygon) {
      const lon = point[0];
      const lat = point[1];
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  };

  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates;
    if (rings && rings.length > 0) processPolygon(rings[0]);
  } else if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates;
    for (const polygon of polygons) {
      if (polygon && polygon.length > 0) processPolygon(polygon[0]);
    }
  }
  return [minLon, minLat, maxLon, maxLat];
}

const getResponsiveSegments = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 48 : 64);

/**
 * Procedural soft radial gradient texture for the contact shadow underneath the globe in light mode.
 */
function createContactShadowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
    gradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.22)');
    gradient.addColorStop(0.65, 'rgba(15, 23, 42, 0.06)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Subtle Realistic Rayleigh-inspired Atmosphere
interface AtmosphereProps {
  theme?: 'light' | 'dark';
}

const Atmosphere: React.FC<AtmosphereProps> = ({ theme = 'dark' }) => {
  const segments = useMemo(() => getResponsiveSegments(), []);
  const isLight = theme === 'light';

  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = isLight
    ? `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.62 - dot(vNormal, vec3(0, 0, 1.0)), 2.4);
        gl_FragColor = vec4(0.3, 0.6, 0.95, 0.45) * intensity;
      }
    `
    : `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.2, 0.5, 0.95, 0.8) * intensity;
      }
    `;

  return (
    <mesh>
      <sphereGeometry args={[2.58, segments, segments]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
};

// Realistic Cloud Layer with Gentle Spin
interface CloudsProps {
  theme?: 'light' | 'dark';
}

const Clouds: React.FC<CloudsProps> = ({ theme = 'dark' }) => {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsTexture = useTexture('/textures/earth_clouds.jpg');
  const segments = useMemo(() => getResponsiveSegments(), []);

  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[2.518, segments, segments]} />
      <meshPhongMaterial
        map={cloudsTexture}
        transparent={true}
        opacity={theme === 'light' ? 0.32 : 0.38}
        depthWrite={false}
      />
    </mesh>
  );
};

// Earth Base Sphere with NASA Blue Marble, Specular & Normal Maps
interface EarthMeshProps {
  theme?: 'light' | 'dark';
  onPointerMove: (e: any) => void;
  onPointerOut: () => void;
  onPointerDown: (e: any) => void;
  onPointerUp: (e: any) => void;
  earthRef: React.RefObject<THREE.Mesh | null>;
}

const EarthMesh: React.FC<EarthMeshProps> = ({ 
  theme = 'dark',
  onPointerMove, 
  onPointerOut, 
  onPointerDown, 
  onPointerUp, 
  earthRef 
}) => {
  const segments = useMemo(() => getResponsiveSegments(), []);
  const textures = useTexture({
    map: '/textures/earth_daymap.jpg',
    normalMap: '/textures/earth_normal.jpg',
    specularMap: '/textures/earth_specular.jpg'
  });

  const normalScale = useMemo(() => new THREE.Vector2(0.85, 0.85), []);
  const specularColor = useMemo(
    () => new THREE.Color(theme === 'light' ? 0x223344 : 0x446688),
    [theme]
  );

  return (
    <mesh
      ref={earthRef}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <sphereGeometry args={[2.5, segments, segments]} />
      <meshPhongMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        normalScale={normalScale}
        specularMap={textures.specularMap}
        specular={specularColor}
        shininess={24}
      />
    </mesh>
  );
};

// Dedicated Accurate Destination Marker Component with Photo Preview + Name
interface DestinationMarkerProps {
  destination: DestinationItem;
  isFocused?: boolean;
  theme?: 'light' | 'dark';
  onClick?: () => void;
}

const DestinationMarker: React.FC<DestinationMarkerProps> = ({ 
  destination, 
  isFocused = true, 
  theme = 'dark',
  onClick 
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => toXYZ(destination.lat, destination.lng, 2.522), [destination.lat, destination.lng]);
  const isLight = theme === 'light';

  // Preview thumbnail photo
  const photoUrl = destination.popularDestinations?.[0]?.image || 
                   destination.places?.[0]?.imageUrl || 
                   'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';

  useFrame((state) => {
    if (ringRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const scale = 1.0 + (elapsed * 2.0) % 1.8;
      const opacity = 1.0 - (scale - 1.0) / 1.8;
      ringRef.current.scale.setScalar(scale);
      if (ringRef.current.material) {
        (ringRef.current.material as THREE.Material).opacity = Math.max(0, opacity * 0.75);
      }
    }
  });

  return (
    <group position={pos}>
      <group ref={(el) => {
        if (el) {
          const target = new THREE.Vector3(...pos).multiplyScalar(2);
          el.lookAt(target);
        }
      }}>
        {/* Core Pin Needle */}
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.002, 0.08, 12]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>

        {/* Top Glowing Bead */}
        <mesh 
          position={[0, 0, 0.08]}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
        >
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
        </mesh>

        {/* Pulsing Radar Ring on Globe Surface */}
        <mesh ref={ringRef} position={[0, 0, 0.002]}>
          <ringGeometry args={[0.04, 0.085, 32]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.75} depthWrite={false} />
        </mesh>

        {/* Premium Floating Card Label with Photo + Flag + Name */}
        {isFocused && (
          <Html distanceFactor={4.6} center position={[0, 0.22, 0]}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              style={{
                background: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.94)',
                color: isLight ? '#0F172A' : '#FFFFFF',
                padding: '6px 10px 6px 6px',
                borderRadius: '14px',
                border: isLight ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(245, 158, 11, 0.5)',
                boxShadow: isLight ? '0 10px 25px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(245, 158, 11, 0.15)' : '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(245, 158, 11, 0.2)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'auto',
                cursor: 'pointer',
                fontFamily: "'Outfit', 'Inter', sans-serif",
                transform: 'translateZ(0)',
                userSelect: 'none',
                minWidth: '140px'
              }}
            >
              {/* Photo Thumbnail */}
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid rgba(245, 158, 11, 0.4)',
                background: '#0F172A'
              }}>
                <img
                  src={photoUrl}
                  alt={destination.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Text Info */}
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.85rem' }}>{destination.flag}</span>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: isLight ? '#0F172A' : '#FFFFFF',
                    whiteSpace: 'nowrap'
                  }}>
                    {destination.name}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  color: isLight ? '#64748B' : '#94A3B8',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  {destination.capital || destination.country} {destination.weather ? `• ${destination.weather.tempC}°C` : ''}
                </span>
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

// City Pin Component
interface CityPinProps {
  city: City;
  isHovered: boolean;
  theme?: 'light' | 'dark';
  onHover: (name: string | null) => void;
  onClick: () => void;
}

const CityPin: React.FC<CityPinProps> = ({ city, isHovered, theme = 'dark', onHover, onClick }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => toXYZ(city.lat, city.lng, 2.512), [city.lat, city.lng]);
  const isLight = theme === 'light';

  useFrame((state) => {
    if (ringRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const scale = 1.0 + (elapsed * 2.2) % 1.8;
      const opacity = 1.0 - (scale - 1.0) / 1.8;
      ringRef.current.scale.setScalar(scale);
      if (ringRef.current.material) {
        (ringRef.current.material as THREE.Material).opacity = Math.max(0, opacity * 0.6);
      }
    }
  });

  const pinColor = city.type === 'capital' ? '#F59E0B' : (isLight ? '#2563EB' : '#60A5FA');

  return (
    <group position={pos}>
      <group ref={(el) => {
        if (el) {
          const target = new THREE.Vector3(...pos).multiplyScalar(2);
          el.lookAt(target);
        }
      }}>
        {/* Core Sphere */}
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(city.name);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHover(null);
            document.body.style.cursor = 'default';
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color={pinColor} />
        </mesh>

        {/* Pulsing ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.024, 0.046, 32]} />
          <meshBasicMaterial 
            color={pinColor} 
            transparent={true} 
            depthWrite={false}
          />
        </mesh>

        {/* Label Projected Html overlay */}
        {isHovered && (
          <Html distanceFactor={4.5} center position={[0, 0.12, 0]}>
            <div style={{
              background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
              color: isLight ? '#0F172A' : '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '8px',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.72rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontFamily: "'Outfit', sans-serif",
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              boxShadow: isLight ? '0 4px 14px rgba(0, 0, 0, 0.1)' : '0 4px 14px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: pinColor
              }} />
              {city.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

export interface HeroFeaturedDestination {
  id: string;
  name: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  image: string;
}

export const HERO_FEATURED_DESTINATIONS: HeroFeaturedDestination[] = [
  {
    id: 'france',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    lat: 48.8566,
    lng: 2.3522,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'japan',
    name: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.0116,
    lng: 135.7681,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'italy',
    name: 'Amalfi',
    country: 'Italy',
    flag: '🇮🇹',
    lat: 40.6340,
    lng: 14.6027,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'uzbekistan',
    name: 'Samarkand',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    lat: 39.6542,
    lng: 66.9597,
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80'
  }
];

interface FeaturedDestinationMarkerProps {
  item: HeroFeaturedDestination;
  isHovered: boolean;
  isThemeDark: boolean;
  onHover: (name: string | null) => void;
  onClick: (item: HeroFeaturedDestination) => void;
}

const FeaturedDestinationMarker: React.FC<FeaturedDestinationMarkerProps> = ({
  item,
  isHovered,
  isThemeDark,
  onHover,
  onClick
}) => {
  const pos = useMemo(() => toXYZ(item.lat, item.lng, 2.518), [item.lat, item.lng]);

  return (
    <group position={pos}>
      <group ref={(el) => {
        if (el) {
          const target = new THREE.Vector3(...pos).multiplyScalar(2);
          el.lookAt(target);
        }
      }}>
        {/* Core Pin Needle */}
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.002, 0.08, 12]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>

        {/* Top Pin Sphere */}
        <mesh
          position={[0, 0, 0.08]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(item.name);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHover(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
        >
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.8} />
        </mesh>

        {/* Floating Photo Preview Pill on Globe */}
        <Html distanceFactor={4.8} center position={[0, 0.16, 0]}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
            onMouseEnter={() => onHover(item.name)}
            onMouseLeave={() => onHover(null)}
            style={{
              background: isThemeDark ? 'rgba(11, 15, 23, 0.88)' : 'rgba(255, 255, 255, 0.94)',
              color: isThemeDark ? '#FFFFFF' : '#111827',
              padding: '4px 8px 4px 4px',
              borderRadius: '100px',
              border: isThemeDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(37, 99, 235, 0.25)',
              boxShadow: isThemeDark ? '0 8px 24px rgba(0,0,0,0.6)' : '0 6px 18px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              pointerEvents: 'auto',
              userSelect: 'none',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
              <span style={{ fontSize: '0.6rem', color: isThemeDark ? '#94A3B8' : '#6B7280', whiteSpace: 'nowrap' }}>
                {item.country}
              </span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};

interface GlobeSceneProps {
  theme?: 'light' | 'dark';
  activeSelectedId: string | null;
  activeDestination?: DestinationItem | null;
  previousDestination?: DestinationItem | null;
  flightActive?: boolean;
  selectedCountryFeature: any;
  hoveredCountryFeature: any;
  onHoverCountryFeatureChange: (feature: any) => void;
  onSelectCountryFeatureChange: (feature: any) => void;
  onCountrySelect?: (country: CountryData) => void;
  onDestinationSelect?: (destination: DestinationItem) => void;
  onSelectCountry?: (countryId: string) => void;
  onFlightArrival?: () => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  zoomLevel?: number;
}

export const GlobeScene: React.FC<GlobeSceneProps> = ({
  theme = 'dark',
  activeSelectedId,
  activeDestination,
  previousDestination,
  flightActive = false,
  selectedCountryFeature,
  hoveredCountryFeature,
  onHoverCountryFeatureChange,
  onSelectCountryFeatureChange,
  onCountrySelect,
  onDestinationSelect,
  onSelectCountry,
  onFlightArrival,
  autoRotate,
  setAutoRotate,
  zoomLevel = 1
}) => {
  const { camera } = useThree();
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [hoveredCityName, setHoveredCityName] = useState<string | null>(null);

  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const scaleRef = useRef(0.1);
  const hoverTimeoutRef = useRef<any>(null);

  const isLight = theme === 'light';

  // Contact shadow texture for light mode
  const shadowTexture = useMemo(() => {
    return isLight ? createContactShadowTexture() : null;
  }, [isLight]);

  // Smooth camera zoom response to zoomLevel prop
  useEffect(() => {
    if (zoomLevel) {
      const targetZ = THREE.MathUtils.clamp(5.8 / zoomLevel, 3.2, 7.8);
      gsap.to(camera.position, {
        z: targetZ,
        duration: 0.45,
        ease: 'power2.out'
      });
    }
  }, [zoomLevel, camera]);

  // Load Boundaries GeoJSON with resilient error catching
  useEffect(() => {
    let isMounted = true;
    fetch('/countries.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!isMounted || !data?.features) return;
        data.features.forEach((feature: any) => {
          feature.bbox = calculateBBox(feature.geometry);
        });
        setGeoJsonData(data);
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("Notice: GeoJSON boundaries fallback enabled:", err?.message || err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth camera/globe rotation whenever active destination or selected country changes
  useEffect(() => {
    let targetLat = 41.2995;
    let targetLng = 69.2401;
    let countryName = 'Uzbekistan';

    if (activeDestination) {
      targetLat = activeDestination.lat;
      targetLng = activeDestination.lng;
      countryName = activeDestination.country;
    } else if (activeSelectedId) {
      const resolved = resolveDestination(activeSelectedId);
      if (resolved) {
        targetLat = resolved.lat;
        targetLng = resolved.lng;
        countryName = resolved.country;
      }
    } else {
      if (selectedCountryFeature) {
        onSelectCountryFeatureChange(null);
      }
      return;
    }

    if (groupRef.current) {
      const latRad = (targetLat * Math.PI) / 180;
      const lonRad = (targetLng * Math.PI) / 180;
      const targetY = -lonRad;
      const targetX = latRad;

      setAutoRotate(false);
      gsap.killTweensOf(groupRef.current.rotation);
      gsap.to(groupRef.current.rotation, {
        x: targetX,
        y: targetY,
        duration: 1.5,
        ease: 'power2.out',
      });
    }

    // Resolve GeoJSON feature representation for boundary highlight
    if (geoJsonData) {
      const match = geoJsonData.features.find((f: any) => {
        const name = f.properties.NAME.toLowerCase();
        return name === countryName.toLowerCase() || countryName.toLowerCase().includes(name);
      });
      if (match && selectedCountryFeature?.properties?.ISO_A3 !== match.properties.ISO_A3) {
        onSelectCountryFeatureChange(match);
      }
    }
  }, [activeSelectedId, activeDestination, geoJsonData, setAutoRotate, onSelectCountryFeatureChange]);

  // Static borders geometry
  const bordersGeometry = useMemo(() => {
    if (!geoJsonData) return null;
    const points: number[] = [];

    geoJsonData.features.forEach((feature: any) => {
      const geom = feature.geometry;
      const processRing = (ring: number[][]) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const p1 = toXYZ(ring[i][1], ring[i][0], 2.52);
          const p2 = toXYZ(ring[i+1][1], ring[i+1][0], 2.52);
          points.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
        }
        if (ring.length > 0) {
          const pFirst = toXYZ(ring[0][1], ring[0][0], 2.52);
          const pLast = toXYZ(ring[ring.length - 1][1], ring[ring.length - 1][0], 2.52);
          points.push(pLast[0], pLast[1], pLast[2], pFirst[0], pFirst[1], pFirst[2]);
        }
      };

      if (geom.type === "Polygon") {
        const rings = geom.coordinates;
        if (rings && rings.length > 0) processRing(rings[0]);
      } else if (geom.type === "MultiPolygon") {
        const polygons = geom.coordinates;
        polygons.forEach((poly: any) => {
          if (poly && poly.length > 0) processRing(poly[0]);
        });
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, [geoJsonData]);

  // Selected borders highlight
  const selectedBordersGeom = useMemo(() => {
    if (!selectedCountryFeature) return null;
    const points: number[] = [];
    const geom = selectedCountryFeature.geometry;

    const processRing = (ring: number[][]) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const p1 = toXYZ(ring[i][1], ring[i][0], 2.53);
        const p2 = toXYZ(ring[i+1][1], ring[i+1][0], 2.53);
        points.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
      }
      if (ring.length > 0) {
        const pFirst = toXYZ(ring[0][1], ring[0][0], 2.53);
        const pLast = toXYZ(ring[ring.length - 1][1], ring[ring.length - 1][0], 2.53);
        points.push(pLast[0], pLast[1], pLast[2], pFirst[0], pFirst[1], pFirst[2]);
      }
    };

    if (geom.type === "Polygon") {
      const rings = geom.coordinates;
      if (rings && rings.length > 0) processRing(rings[0]);
    } else if (geom.type === "MultiPolygon") {
      const polygons = geom.coordinates;
      polygons.forEach((poly: any) => {
        if (poly && poly.length > 0) processRing(poly[0]);
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, [selectedCountryFeature]);

  // Hovered borders highlight
  const hoveredBordersGeom = useMemo(() => {
    if (!hoveredCountryFeature) return null;
    const points: number[] = [];
    const geom = hoveredCountryFeature.geometry;

    const processRing = (ring: number[][]) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const p1 = toXYZ(ring[i][1], ring[i][0], 2.525);
        const p2 = toXYZ(ring[i+1][1], ring[i+1][0], 2.525);
        points.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
      }
      if (ring.length > 0) {
        const pFirst = toXYZ(ring[0][1], ring[0][0], 2.525);
        const pLast = toXYZ(ring[ring.length - 1][1], ring[ring.length - 1][0], 2.525);
        points.push(pLast[0], pLast[1], pLast[2], pFirst[0], pFirst[1], pFirst[2]);
      }
    };

    if (geom.type === "Polygon") {
      const rings = geom.coordinates;
      if (rings && rings.length > 0) processRing(rings[0]);
    } else if (geom.type === "MultiPolygon") {
      const polygons = geom.coordinates;
      polygons.forEach((poly: any) => {
        if (poly && poly.length > 0) processRing(poly[0]);
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, [hoveredCountryFeature]);

  const findCountryAt = (lon: number, lat: number) => {
    if (!geoJsonData) return null;

    for (const feature of geoJsonData.features) {
      const bbox = feature.bbox;
      if (!bbox) continue;
      const [minLon, minLat, maxLon, maxLat] = bbox;

      if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) {
        const geom = feature.geometry;
        if (geom.type === "Polygon") {
          const rings = geom.coordinates;
          if (rings && rings.length > 0 && isPointInPolygon([lon, lat], rings[0])) {
            return feature;
          }
        } else if (geom.type === "MultiPolygon") {
          const polygons = geom.coordinates;
          for (const polygon of polygons) {
            if (polygon && polygon.length > 0 && isPointInPolygon([lon, lat], polygon[0])) {
              return feature;
            }
          }
        }
      }
    }
    return null;
  };

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (!earthRef.current || dragStartRef.current) return;

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    const point = e.point.clone();

    hoverTimeoutRef.current = setTimeout(() => {
      if (!earthRef.current) return;
      const localPoint = earthRef.current.worldToLocal(point);
      const { lat, lng } = xyzToLatLng(localPoint.x, localPoint.y, localPoint.z, 2.5);

      const country = findCountryAt(lng, lat);
      if (country) {
        onHoverCountryFeatureChange(country);
        document.body.style.cursor = 'pointer';
      } else {
        onHoverCountryFeatureChange(null);
        document.body.style.cursor = 'default';
      }
    }, 16);
  };

  const handlePointerOut = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    onHoverCountryFeatureChange(null);
    document.body.style.cursor = 'default';
  };

  const handlePointerDown = (e: any) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    if (!dragStartRef.current || !earthRef.current) return;
    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
    dragStartRef.current = null;

    if (deltaX < 6 && deltaY < 6) {
      const localPoint = earthRef.current.worldToLocal(e.point.clone());
      const { lat, lng } = xyzToLatLng(localPoint.x, localPoint.y, localPoint.z, 2.5);

      const countryFeature = findCountryAt(lng, lat);
      if (countryFeature) {
        onSelectCountryFeatureChange(countryFeature);
        setAutoRotate(false);

        const name = countryFeature.properties.NAME;
        const resolved = resolveDestination(name, countryFeature.properties) || generateDestinationForCountry(name, countryFeature.properties.ISO_A3, lat, lng);

        if (resolved && onDestinationSelect) {
          onDestinationSelect(resolved);
        }

        if (onSelectCountry) {
          onSelectCountry(resolved.id);
        }

        const details: CountryData = {
          name: resolved.name,
          capital: resolved.capital || 'Capital',
          language: resolved.language,
          currency: resolved.currency,
          timezone: resolved.timezone,
          population: countryFeature.properties.POP_EST ? `${(countryFeature.properties.POP_EST / 1000000).toFixed(1)} Million` : 'Regional Hub',
          area: '450,000 km²',
          flag: resolved.flag,
          weather: resolved.weather ? { temp: resolved.weather.tempC, condition: resolved.weather.condition } : { temp: 22, condition: 'Sunny' },
          visa: resolved.visaVerified?.status || 'Verified Destination',
          bestTime: resolved.bestSeason || 'Spring & Autumn',
          description: resolved.description,
          attractions: resolved.places.map(p => ({
            name: p.name,
            city: resolved.name,
            image: p.imageUrl || 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80'
          })),
          foods: resolved.restaurants.map(r => ({
            name: r.specialty,
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80'
          }))
        };

        if (onCountrySelect) {
          onCountrySelect(details);
        }
      }
    }
  };

  useFrame(() => {
    if (groupRef.current) {
      if (scaleRef.current < 0.999) {
        scaleRef.current += (1.0 - scaleRef.current) * 0.05;
        groupRef.current.scale.setScalar(scaleRef.current);
      } else if (scaleRef.current !== 1.0) {
        scaleRef.current = 1.0;
        groupRef.current.scale.setScalar(1.0);
      }
      
      if (autoRotate) {
        groupRef.current.rotation.y += 0.0014;
      }
    }
  });

  return (
    <>
      {/* 1. Realistic Balanced Lighting for Light Mode and Dark Mode */}
      {isLight ? (
        <>
          <ambientLight intensity={0.9} color="#FFFFFF" />
          <directionalLight position={[7, 5, 6]} intensity={1.65} color="#FFFDF2" />
          <directionalLight position={[-6, -2, -5]} intensity={0.45} color="#E0F2FE" />
          <pointLight position={[0, 6, -5]} intensity={0.25} color="#DBEAFE" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.38} color="#0F172A" />
          <directionalLight position={[7, 4, 5]} intensity={1.4} color="#FFF8E7" />
          <directionalLight position={[-8, -5, -6]} intensity={0.18} color="#1E3A8A" />
          <pointLight position={[-5, 5, -5]} intensity={0.22} color="#60A5FA" />
        </>
      )}

      {/* 2. Responsive Orbit Controls with smooth physics damping */}
      <OrbitControls
        enableZoom={true}
        minDistance={3.2}
        maxDistance={7.8}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.06}
        rotateSpeed={0.8}
      />

      {/* 3. Celestial Stars background ONLY rendered in Dark Mode */}
      {!isLight && (
        <Stars radius={120} depth={50} count={3500} factor={2.8} saturation={0} fade speed={0.8} />
      )}

      {/* 4. Soft Ground Contact Shadow disk underneath globe in Light Mode */}
      {isLight && shadowTexture && (
        <mesh position={[0, -2.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 5.2]} />
          <meshBasicMaterial
            map={shadowTexture}
            transparent={true}
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 5. 3D Planetary Globe Group */}
      <group ref={groupRef}>
        <EarthMesh
          theme={theme}
          earthRef={earthRef}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />

        <Clouds theme={theme} />

        <Atmosphere theme={theme} />

        {/* Global Political Boundaries */}
        {bordersGeometry && (
          <lineSegments geometry={bordersGeometry}>
            <lineBasicMaterial 
              color={isLight ? "#334155" : "#FFFFFF"} 
              transparent 
              opacity={isLight ? 0.14 : 0.18} 
              toneMapped={false} 
            />
          </lineSegments>
        )}

        {/* Hovered Country Border Highlight */}
        {hoveredBordersGeom && (
          <lineSegments geometry={hoveredBordersGeom}>
            <lineBasicMaterial 
              color={isLight ? "#2563EB" : "#60A5FA"} 
              transparent 
              opacity={0.7} 
              toneMapped={false} 
            />
          </lineSegments>
        )}

        {/* Selected Country Border Highlight (Amber Gold illuminated outline) */}
        {selectedBordersGeom && (
          <group>
            <lineSegments geometry={selectedBordersGeom}>
              <lineBasicMaterial color="#F59E0B" linewidth={2} transparent opacity={0.95} toneMapped={false} />
            </lineSegments>
          </group>
        )}

        {/* Prominent Real Photo Destination Markers (Paris, Tokyo, Dubai, Samarkand) */}
        {HERO_FEATURED_DESTINATIONS.map((dest) => (
          <FeaturedDestinationMarker
            key={dest.id}
            item={dest}
            isHovered={hoveredCityName === dest.name}
            onHover={setHoveredCityName}
            isThemeDark={theme === 'dark'}
            onClick={(item) => {
              const resolved = resolveDestination(item.id) || resolveDestination(item.name);
              if (resolved && onDestinationSelect) {
                onDestinationSelect(resolved);
              }
              if (onSelectCountry) onSelectCountry(item.id);
            }}
          />
        ))}

        {/* Major Hub City Pins */}
        {CITIES.map((city, idx) => (
          <CityPin
            key={idx}
            city={city}
            theme={theme}
            isHovered={hoveredCityName === city.name}
            onHover={setHoveredCityName}
            onClick={() => {
              const resolved = resolveDestination(city.name);
              if (resolved && onDestinationSelect) {
                onDestinationSelect(resolved);
              }
              const normalizedId = city.name.toLowerCase() === 'tashkent' ? 'uzbekistan' :
                                   city.name.toLowerCase() === 'samarkand' ? 'samarkand' :
                                   city.name.toLowerCase() === 'cappadocia' ? 'cappadocia' :
                                   city.name.toLowerCase() === 'istanbul' ? 'turkey' :
                                   city.name.toLowerCase() === 'paris' ? 'france' :
                                   city.name.toLowerCase() === 'tokyo' ? 'japan' : 'uzbekistan';
              
              if (onSelectCountry) onSelectCountry(normalizedId);
            }}
          />
        ))}

        {/* Focused Accurate Destination Marker Pin with Photo Preview */}
        {activeDestination && (
          <DestinationMarker 
            destination={activeDestination} 
            isFocused={true} 
            theme={theme}
            onClick={() => {
              if (onDestinationSelect) onDestinationSelect(activeDestination);
              if (onSelectCountry) onSelectCountry(activeDestination.id);
            }}
          />
        )}

        {/* Geographically Meaningful 3D Curved Flight Arc with Animated Aircraft */}
        {flightActive && previousDestination && activeDestination && (
          <FlightPathAnimation
            origin={{ lat: previousDestination.lat, lng: previousDestination.lng, name: previousDestination.name }}
            destination={{ lat: activeDestination.lat, lng: activeDestination.lng, name: activeDestination.name }}
            globeRadius={2.52}
            durationSeconds={2.5}
            onArrival={onFlightArrival}
          />
        )}
      </group>
    </>
  );
};
