import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

export interface LatLng {
  lat: number;
  lng: number;
  name?: string;
}

interface FlightPathAnimationProps {
  origin: LatLng;
  destination: LatLng;
  globeRadius?: number;
  durationSeconds?: number;
  onArrival?: () => void;
}

/**
 * Spherical coordinate conversion to Cartesian 3D coordinates.
 */
export const toXYZ = (lat: number, lng: number, radius = 2.52): [number, number, number] => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  ];
};

/**
 * Realistic 3D Airplane Mesh in Three.js
 */
const AirplaneMesh: React.FC = () => {
  return (
    <group scale={0.035}>
      {/* Fuselage (Streamlined Body) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 2.6, 16]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Cockpit Glass */}
      <mesh position={[0, 0.16, 0.7]} rotation={[Math.PI / 2.3, 0, 0]}>
        <coneGeometry args={[0.24, 0.7, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Main Wings */}
      <mesh position={[0, 0, 0.1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.05, 0.7]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Blue Wing Accents */}
      <mesh position={[0, 0.03, 0.1]}>
        <boxGeometry args={[3.22, 0.02, 0.12]} />
        <meshBasicMaterial color="#2563EB" />
      </mesh>

      {/* Winglets (Tips) */}
      <mesh position={[-1.6, 0.1, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.04, 0.25, 0.3]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>
      <mesh position={[1.6, 0.1, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.04, 0.25, 0.3]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>

      {/* Horizontal Stabilizers at Tail */}
      <mesh position={[0, 0, -1.05]}>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Vertical Tail Fin */}
      <mesh position={[0, 0.35, -1.05]} rotation={[-Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.06, 0.7, 0.45]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>

      {/* Twin Jet Engines */}
      <mesh position={[-0.7, -0.15, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.6, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, -0.15, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.6, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
};

export const FlightPathAnimation: React.FC<FlightPathAnimationProps> = ({
  origin,
  destination,
  globeRadius = 2.52,
  durationSeconds = 2.6,
  onArrival
}) => {
  const airplaneRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const arrivalTriggeredRef = useRef(false);

  // Compute 3D Great-Arc Bezier Curve
  const { curve, linePoints, originVec, destVec } = useMemo(() => {
    const start = new THREE.Vector3(...toXYZ(origin.lat, origin.lng, globeRadius));
    const end = new THREE.Vector3(...toXYZ(destination.lat, destination.lng, globeRadius));

    const distance = start.distanceTo(end);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const normal = mid.clone().normalize();

    // Geodesic altitude scales gracefully with angular distance
    const altitude = Math.min(1.05, Math.max(0.32, distance * 0.4));
    const controlPoint = mid.add(normal.multiplyScalar(altitude));

    const bezier = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
    const points = bezier.getPoints(64);

    return {
      curve: bezier,
      linePoints: points,
      originVec: start,
      destVec: end
    };
  }, [origin, destination, globeRadius]);

  // Reset animation progress when origin or destination changes
  useEffect(() => {
    progressRef.current = 0;
    arrivalTriggeredRef.current = false;
  }, [origin, destination]);

  useFrame((_, delta) => {
    if (!airplaneRef.current) return;

    if (progressRef.current < 1.0) {
      progressRef.current += delta / durationSeconds;
      if (progressRef.current >= 1.0) {
        progressRef.current = 1.0;
        if (!arrivalTriggeredRef.current) {
          arrivalTriggeredRef.current = true;
          if (onArrival) onArrival();
        }
      }
    }

    const t = Math.min(1.0, Math.max(0.0, progressRef.current));
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    // Natural orientation: forward aligns with tangent, up faces outward from Earth
    const normalUp = pos.clone().normalize();
    const right = new THREE.Vector3().crossVectors(tangent, normalUp).normalize();
    const correctedUp = new THREE.Vector3().crossVectors(right, tangent).normalize();

    const rotMatrix = new THREE.Matrix4().makeBasis(right, correctedUp, tangent);
    airplaneRef.current.quaternion.setFromRotationMatrix(rotMatrix);
    airplaneRef.current.position.copy(pos);
  });

  return (
    <group>
      {/* 3D Curved Flight Trajectory Line */}
      <Line
        points={linePoints}
        color="#38BDF8"
        lineWidth={1.5}
        dashed={true}
        dashScale={18}
        dashSize={0.4}
        gapSize={0.2}
        transparent={true}
        opacity={0.7}
      />

      {/* Origin Departure Marker */}
      <group position={originVec}>
        <mesh>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
      </group>

      {/* Destination Target Marker */}
      <group position={destVec}>
        <mesh>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      </group>

      {/* Moving 3D Aircraft */}
      <group ref={airplaneRef}>
        <AirplaneMesh />
      </group>
    </group>
  );
};
