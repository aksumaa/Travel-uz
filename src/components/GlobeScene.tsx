import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Line, Html } from '@react-three/drei';
import gsap from 'gsap';
import { COUNTRY_DETAILS_DB } from './CountryInfoPanel';
import type { CountryData } from './CountryInfoPanel';

export interface GlobeCountryData extends CountryData {
  id: string;
  lat: number;
  lon: number;
}

export const COUNTRIES: GlobeCountryData[] = [
  { ...COUNTRY_DETAILS_DB.uzbekistan, id: 'uzbekistan', lat: 41.2995, lon: 69.2401 },
  { ...COUNTRY_DETAILS_DB.usa, id: 'usa', lat: 40.7128, lon: -74.0060 },
  { ...COUNTRY_DETAILS_DB.france, id: 'france', lat: 48.8566, lon: 2.3522 },
  { ...COUNTRY_DETAILS_DB.japan, id: 'japan', lat: 35.6762, lon: 139.6503 },
  { ...COUNTRY_DETAILS_DB.brazil, id: 'brazil', lat: -22.9068, lon: -43.1729 },
  { ...COUNTRY_DETAILS_DB.australia, id: 'australia', lat: -33.8688, lon: 151.2093 },
  { ...COUNTRY_DETAILS_DB.egypt, id: 'egypt', lat: 30.0444, lon: 31.2357 },
  { ...COUNTRY_DETAILS_DB.turkey, id: 'turkey', lat: 38.9637, lon: 35.2433 }
];

export interface City {
  name: string;
  lat: number;
  lng: number;
  type: 'capital' | 'popular';
}

const CITIES: City[] = [
  { name: 'Tashkent', lat: 41.2, lng: 69.2, type: 'capital' },
  { name: 'Istanbul', lat: 41.0, lng: 28.9, type: 'popular' },
  { name: 'Dubai', lat: 25.2, lng: 55.2, type: 'popular' },
  { name: 'Paris', lat: 48.8, lng: 2.3, type: 'popular' },
  { name: 'Tokyo', lat: 35.6, lng: 139.6, type: 'popular' },
  { name: 'New York', lat: 40.7, lng: -74.0, type: 'popular' },
];

export const toXYZ = (lat: number, lng: number, r = 2.52): [number, number, number] => {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  ];
};

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

// Atmosphere Glowing Shader
const Atmosphere: React.FC = () => {
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
      float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 2.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `;

  return (
    <mesh>
      <sphereGeometry args={[2.58, 64, 64]} />
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

// Earth Clouds Layer
const Clouds: React.FC = () => {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsTexture = useTexture('/textures/earth_clouds.jpg');

  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[2.52, 64, 64]} />
      <meshPhongMaterial
        map={cloudsTexture}
        transparent={true}
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
};

// Earth Base Sphere
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
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshPhongMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        specularMap={textures.specularMap}
        shininess={15}
      />
    </mesh>
  );
};

// City Pin Component with scale pulsing ring
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
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={city.type === 'capital' ? '#F59E0B' : '#60A5FA'} />
        </mesh>

        {/* Pulsing ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.032, 0.055, 32]} />
          <meshBasicMaterial 
            color={city.type === 'capital' ? '#F59E0B' : '#60A5FA'} 
            transparent={true} 
            depthWrite={false}
          />
        </mesh>

        {/* Label Projected Html overlay */}
        {isHovered && (
          <Html distanceFactor={4} center position={[0, 0.1, 0]}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.7rem',
              fontWeight: 800,
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

// Flight Arc Path Component
interface FlightArcProps {
  from: City;
  to: City;
}

const FlightArc: React.FC<FlightArcProps> = ({ from, to }) => {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...toXYZ(from.lat, from.lng, 2.5));
    const end = new THREE.Vector3(...toXYZ(to.lat, to.lng, 2.5));
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const normal = mid.clone().normalize();
    const controlPoint = mid.add(normal.multiplyScalar(1.5));
    return new THREE.QuadraticBezierCurve3(start, controlPoint, end);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  const dotRef = useRef<THREE.Mesh>(null);
  const progress = useRef(Math.random());

  useFrame(() => {
    progress.current += 0.002;
    if (progress.current > 1) progress.current = 0;
    if (dotRef.current) {
      const pos = curve.getPointAt(progress.current);
      dotRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      <Line
        points={points}
        color="#F59E0B"
        lineWidth={0.5}
        transparent
        opacity={0.3}
      />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

interface GlobeSceneProps {
  activeSelectedId: string | null;
  selectedCountryFeature: any;
  hoveredCountryFeature: any;
  onHoverCountryFeatureChange: (feature: any) => void;
  onSelectCountryFeatureChange: (feature: any) => void;
  onCountrySelect?: (country: CountryData) => void;
  onSelectCountry?: (countryId: string) => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
}

export const GlobeScene: React.FC<GlobeSceneProps> = ({
  activeSelectedId,
  selectedCountryFeature,
  hoveredCountryFeature,
  onHoverCountryFeatureChange,
  onSelectCountryFeatureChange,
  onCountrySelect,
  onSelectCountry,
  autoRotate,
  setAutoRotate
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [hoveredCityName, setHoveredCityName] = useState<string | null>(null);

  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const scaleRef = useRef(0.1);
  const hoverTimeoutRef = useRef<any>(null);

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

  // Sync selected country snapshot & focus rotation snap
  useEffect(() => {
    if (!activeSelectedId) {
      if (selectedCountryFeature) {
        onSelectCountryFeatureChange(null);
      }
      return;
    }

    const country = COUNTRIES.find(
      (c) => c.id === activeSelectedId.toLowerCase() || c.name.toLowerCase() === activeSelectedId.toLowerCase()
    );

    if (!country) return;

    if (groupRef.current) {
      const latRad = (country.lat! * Math.PI) / 180;
      const lonRad = (country.lon! * Math.PI) / 180;
      const targetY = -lonRad;
      const targetX = latRad;

      setAutoRotate(false);
      gsap.killTweensOf(groupRef.current.rotation);
      gsap.to(groupRef.current.rotation, {
        x: targetX,
        y: targetY,
        duration: 1.5,
        ease: 'power3.out',
      });
    }

    // Resolve GeoJSON feature representation for selected highlight borders
    if (geoJsonData) {
      const match = geoJsonData.features.find((f: any) => {
        const name = f.properties.NAME.toLowerCase();
        return name === country.name.toLowerCase() || country.name.toLowerCase().includes(name);
      });
      if (match && selectedCountryFeature?.properties?.ISO_A3 !== match.properties.ISO_A3) {
        onSelectCountryFeatureChange(match);
      }
    }
  }, [activeSelectedId, geoJsonData, setAutoRotate, onSelectCountryFeatureChange]);

  // Merge static borders
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
    if (!earthRef.current) return;

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    const point = e.point.clone();

    hoverTimeoutRef.current = setTimeout(() => {
      const localPoint = earthRef.current!.worldToLocal(point);
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
        const normalizedId = name.toLowerCase().includes('united states') ? 'usa' :
                             name.toLowerCase().includes('united arab') ? 'egypt' : 
                             name.toLowerCase().includes('maldives') ? 'egypt' :
                             name.toLowerCase();

        const matchingDb = Object.values(COUNTRY_DETAILS_DB).find(
          (c) => c.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(c.name.toLowerCase())
        );

        const details: CountryData = matchingDb || {
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
        if (onSelectCountry) {
          onSelectCountry(normalizedId);
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

  const flightPairs = useMemo(() => {
    const tashkent = CITIES.find((c) => c.name === 'Tashkent')!;
    const dubai = CITIES.find((c) => c.name === 'Dubai')!;
    const paris = CITIES.find((c) => c.name === 'Paris')!;
    const tokyo = CITIES.find((c) => c.name === 'Tokyo')!;
    const ny = CITIES.find((c) => c.name === 'New York')!;

    return [
      { from: tashkent, to: paris },
      { from: paris, to: ny },
      { from: tokyo, to: dubai }
    ];
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#FFF5E4" />
      <pointLight position={[-10, -10, -10]} intensity={0.1} />

      <OrbitControls
        enableZoom={true}
        minDistance={3.5}
        maxDistance={8}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

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

        {bordersGeometry && (
          <lineSegments geometry={bordersGeometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.15} toneMapped={false} />
          </lineSegments>
        )}

        {hoveredBordersGeom && (
          <lineSegments geometry={hoveredBordersGeom}>
            <lineBasicMaterial color="#60A5FA" transparent opacity={0.5} toneMapped={false} />
          </lineSegments>
        )}

        {selectedBordersGeom && (
          <lineSegments geometry={selectedBordersGeom}>
            <lineBasicMaterial color="#60A5FA" linewidth={2} transparent opacity={1} toneMapped={false} />
          </lineSegments>
        )}

        {CITIES.map((city, idx) => (
          <CityPin
            key={idx}
            city={city}
            isHovered={hoveredCityName === city.name}
            onHover={setHoveredCityName}
            onClick={() => {
              const normalizedId = city.name.toLowerCase() === 'tashkent' ? 'uzbekistan' :
                                   city.name.toLowerCase() === 'new york' ? 'usa' :
                                   city.name.toLowerCase() === 'dubai' ? 'egypt' :
                                   city.name.toLowerCase() === 'istanbul' ? 'turkey' :
                                   city.name.toLowerCase() === 'paris' ? 'france' :
                                   city.name.toLowerCase() === 'tokyo' ? 'japan' : 'uzbekistan';
              
              if (onSelectCountry) onSelectCountry(normalizedId);
              
              const dbRecord = COUNTRY_DETAILS_DB[normalizedId];
              if (dbRecord && onCountrySelect) {
                onCountrySelect(dbRecord);
              }
            }}
          />
        ))}

        {flightPairs.map((pair, idx) => (
          <FlightArc
            key={idx}
            from={pair.from}
            to={pair.to}
          />
        ))}
      </group>
    </>
  );
};
