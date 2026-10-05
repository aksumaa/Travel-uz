import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Html } from '@react-three/drei';
import gsap from 'gsap';
import type { CountryData } from './CountryInfoPanel';
import { DESTINATIONS_CATALOG, type DestinationItem, resolveDestination } from '../services/destinationCatalog';
import { FlightPathAnimation, toXYZ } from './FlightPathAnimation';

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
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, type: 'popular' }
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

const getResponsiveSegments = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 64);

// Subtle Realistic Rayleigh-inspired Atmosphere
const Atmosphere: React.FC = () => {
  const segments = useMemo(() => getResponsiveSegments(), []);
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0,0,1.0)), 2.2);
      gl_FragColor = vec4(0.2, 0.45, 0.9, 0.75) * intensity;
    }
  `;

  return (
    <mesh>
      <sphereGeometry args={[2.57, segments, segments]} />
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
const Clouds: React.FC = () => {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsTexture = useTexture('/textures/earth_clouds.jpg');
  const segments = useMemo(() => getResponsiveSegments(), []);

  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.00025;
    }
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[2.518, segments, segments]} />
      <meshPhongMaterial
        map={cloudsTexture}
        transparent={true}
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
};

// Earth Base Sphere with NASA Blue Marble & Normal Maps
interface EarthMeshProps {
  onPointerMove: (e: any) => void;
  onPointerOut: () => void;
  onPointerDown: (e: any) => void;
  onPointerUp: (e: any) => void;
  earthRef: React.RefObject<THREE.Mesh | null>;
}

const EarthMesh: React.FC<EarthMeshProps> = ({ 
  onPointerMove, onPointerOut, onPointerDown, onPointerUp, earthRef 
}) => {
  const segments = useMemo(() => getResponsiveSegments(), []);
  const textures = useTexture({
    map: '/textures/earth_daymap.jpg',
    normalMap: '/textures/earth_normal.jpg',
    specularMap: '/textures/earth_specular.jpg'
  });

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
        specularMap={textures.specularMap}
        shininess={18}
      />
    </mesh>
  );
};

// Dedicated Accurate Destination Marker Component
interface DestinationMarkerProps {
  destination: DestinationItem;
  isFocused?: boolean;
}

const DestinationMarker: React.FC<DestinationMarkerProps> = ({ destination, isFocused = true }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => toXYZ(destination.lat, destination.lng, 2.52), [destination.lat, destination.lng]);

  useFrame((state) => {
    if (ringRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const scale = 1.0 + (elapsed * 2.2) % 2.0;
      const opacity = 1.0 - (scale - 1.0) / 2.0;
      ringRef.current.scale.setScalar(scale);
      if (ringRef.current.material) {
        (ringRef.current.material as THREE.Material).opacity = opacity;
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
          <cylinderGeometry args={[0.008, 0.003, 0.08, 12]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>

        {/* Top Bead */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} />
        </mesh>

        {/* Pulsing Radar Ring */}
        <mesh ref={ringRef} position={[0, 0, 0.002]}>
          <ringGeometry args={[0.04, 0.08, 32]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} depthWrite={false} />
        </mesh>

        {/* Floating Label */}
        {isFocused && (
          <Html distanceFactor={4.5} center position={[0, 0.16, 0]}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.92)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              fontSize: '0.75rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              fontFamily: "'Outfit', sans-serif",
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>{destination.flag}</span>
              <span style={{ color: '#F59E0B' }}>{destination.name}</span>
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
  onHover: (name: string | null) => void;
  onClick: () => void;
}

const CityPin: React.FC<CityPinProps> = ({ city, isHovered, onHover, onClick }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => toXYZ(city.lat, city.lng, 2.51), [city.lat, city.lng]);

  useFrame((state) => {
    if (ringRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const scale = 1.0 + (elapsed * 2.5) % 2.0;
      const opacity = 1.0 - (scale - 1.0) / 2.0;
      ringRef.current.scale.setScalar(scale);
      if (ringRef.current.material) {
        (ringRef.current.material as THREE.Material).opacity = opacity;
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
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color={city.type === 'capital' ? '#F59E0B' : '#60A5FA'} />
        </mesh>

        {/* Pulsing ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.026, 0.048, 32]} />
          <meshBasicMaterial 
            color={city.type === 'capital' ? '#F59E0B' : '#60A5FA'} 
            transparent={true} 
            depthWrite={false}
          />
        </mesh>

        {/* Label Projected Html overlay */}
        {isHovered && (
          <Html distanceFactor={4.5} center position={[0, 0.1, 0]}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.88)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.7rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontFamily: "'Outfit', sans-serif",
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: city.type === 'capital' ? '#F59E0B' : '#60A5FA'
              }} />
              {city.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

interface GlobeSceneProps {
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

  // Load Boundaries GeoJSON
  useEffect(() => {
    fetch('/countries.json')
      .then((r) => r.json())
      .then((data) => {
        data.features.forEach((feature: any) => {
          feature.bbox = calculateBBox(feature.geometry);
        });
        setGeoJsonData(data);
      })
      .catch((err) => console.error("Error loading boundaries GeoJSON in Scene:", err));
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
        duration: 1.6,
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

    if (deltaX < 5 && deltaY < 5) {
      const localPoint = earthRef.current.worldToLocal(e.point.clone());
      const { lat, lng } = xyzToLatLng(localPoint.x, localPoint.y, localPoint.z, 2.5);

      const countryFeature = findCountryAt(lng, lat);
      if (countryFeature) {
        onSelectCountryFeatureChange(countryFeature);
        setAutoRotate(false);

        const name = countryFeature.properties.NAME;
        const resolved = resolveDestination(name);

        if (resolved && onDestinationSelect) {
          onDestinationSelect(resolved);
        }

        const normalizedId = name.toLowerCase().includes('united states') ? 'usa' :
                             name.toLowerCase().includes('united arab') ? 'egypt' : 
                             name.toLowerCase();

        if (onSelectCountry) {
          onSelectCountry(normalizedId);
        }

        const details: CountryData = resolved ? {
          name: resolved.name,
          capital: resolved.capital || 'Capital',
          language: resolved.language,
          currency: resolved.currency,
          timezone: resolved.timezone,
          population: 'Regional Hub',
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
        } : {
          name: name,
          capital: countryFeature.properties.FORMAL_EN?.split(' ').pop() || 'Unknown',
          language: 'English',
          currency: 'USD',
          timezone: 'GMT+0',
          population: countryFeature.properties.POP_EST ? `${(countryFeature.properties.POP_EST / 1000000).toFixed(1)} Million` : 'Unknown',
          area: 'Unknown',
          flag: '🌍',
          weather: { temp: 22, condition: 'Sunny' },
          visa: 'Visa Required',
          bestTime: 'Spring, Autumn',
          description: `${name} is a gorgeous destination.`,
          attractions: [],
          foods: []
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
        scaleRef.current += (1.0 - scaleRef.current) * 0.04;
        groupRef.current.scale.setScalar(scaleRef.current);
      } else if (scaleRef.current !== 1.0) {
        scaleRef.current = 1.0;
        groupRef.current.scale.setScalar(1.0);
      }
      
      if (autoRotate) {
        groupRef.current.rotation.y += 0.0015;
      }
    }
  });

  return (
    <>
      {/* Natural Sun and Ambient Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 4, 5]} intensity={1.3} color="#FFF8E7" />
      <pointLight position={[-8, -8, -8]} intensity={0.15} color="#60A5FA" />

      {/* Responsive Orbit Controls with smooth physics damping */}
      <OrbitControls
        enableZoom={true}
        minDistance={3.2}
        maxDistance={8}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <Stars radius={100} depth={50} count={5000} factor={3.5} saturation={0} fade speed={1} />

      <group ref={groupRef}>
        <EarthMesh
          earthRef={earthRef}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />

        <Clouds />

        <Atmosphere />

        {/* Global Political Boundaries */}
        {bordersGeometry && (
          <lineSegments geometry={bordersGeometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.16} toneMapped={false} />
          </lineSegments>
        )}

        {/* Hovered Country Border Highlight */}
        {hoveredBordersGeom && (
          <lineSegments geometry={hoveredBordersGeom}>
            <lineBasicMaterial color="#60A5FA" transparent opacity={0.5} toneMapped={false} />
          </lineSegments>
        )}

        {/* Selected Country Border Highlight */}
        {selectedBordersGeom && (
          <lineSegments geometry={selectedBordersGeom}>
            <lineBasicMaterial color="#F59E0B" linewidth={2} transparent opacity={0.9} toneMapped={false} />
          </lineSegments>
        )}

        {/* Major Hub City Pins */}
        {CITIES.map((city, idx) => (
          <CityPin
            key={idx}
            city={city}
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

        {/* Focused Accurate Destination Marker Pin */}
        {activeDestination && (
          <DestinationMarker destination={activeDestination} isFocused={true} />
        )}

        {/* Geographically Meaningful 3D Curved Flight Arc with Animated Aircraft */}
        {flightActive && previousDestination && activeDestination && (
          <FlightPathAnimation
            origin={{ lat: previousDestination.lat, lng: previousDestination.lng, name: previousDestination.name }}
            destination={{ lat: activeDestination.lat, lng: activeDestination.lng, name: activeDestination.name }}
            globeRadius={2.52}
            durationSeconds={2.6}
            onArrival={onFlightArrival}
          />
        )}
      </group>
    </>
  );
};
