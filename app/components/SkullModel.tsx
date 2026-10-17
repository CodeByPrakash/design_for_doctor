'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Anatomically simplified skull – cranium, mandible, zygomatic arches,
 * orbits, nasal cavity, and teeth regions built from primitives.
 * Secondary element: fades in/out during Scene 3 transition.
 */

function useSkullMaterial() {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DDD8CA'),
      roughness: 0.7,
      metalness: 0.04,
      emissive: new THREE.Color('#141410'),
      emissiveIntensity: 0.04,
    });
  }, []);
}

function useOrbitMaterial() {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2C2C2B'),
      roughness: 0.9,
      metalness: 0.0,
    });
  }, []);
}

export default function SkullModel({
  opacity = 1,
  scrollProgress = 0,
}: {
  opacity?: number;
  scrollProgress?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const skullMaterial = useSkullMaterial();
  const orbitMaterial = useOrbitMaterial();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Slow rotation — three-quarter view
    groupRef.current.rotation.y = -0.4 + Math.sin(t * 0.15) * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.05;
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {/* Cranium — main skull vault */}
      <mesh position={[0, 0.3, 0]} material={skullMaterial}>
        <sphereGeometry args={[0.65, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
      </mesh>

      {/* Frontal bone / brow ridge */}
      <mesh position={[0, 0.0, 0.4]} rotation={[0.3, 0, 0]} material={skullMaterial}>
        <boxGeometry args={[0.9, 0.12, 0.35]} />
      </mesh>

      {/* Left orbit (eye socket) */}
      <mesh position={[-0.22, 0.0, 0.55]} material={orbitMaterial}>
        <sphereGeometry args={[0.14, 12, 8]} />
      </mesh>

      {/* Right orbit */}
      <mesh position={[0.22, 0.0, 0.55]} material={orbitMaterial}>
        <sphereGeometry args={[0.14, 12, 8]} />
      </mesh>

      {/* Nasal cavity */}
      <mesh position={[0, -0.15, 0.6]} material={orbitMaterial}>
        <coneGeometry args={[0.08, 0.16, 3]} />
      </mesh>

      {/* Zygomatic arches (cheekbones) */}
      <mesh position={[-0.42, -0.05, 0.3]} rotation={[0, 0.4, 0]} material={skullMaterial}>
        <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
      </mesh>
      <mesh position={[0.42, -0.05, 0.3]} rotation={[0, -0.4, 0]} material={skullMaterial}>
        <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
      </mesh>

      {/* Maxilla (upper jaw) */}
      <mesh position={[0, -0.25, 0.45]} material={skullMaterial}>
        <boxGeometry args={[0.55, 0.15, 0.3]} />
      </mesh>

      {/* Mandible (lower jaw) */}
      <mesh position={[0, -0.4, 0.35]} material={skullMaterial}>
        <boxGeometry args={[0.5, 0.12, 0.25]} />
      </mesh>

      {/* Mandible rami (jaw sides) */}
      <mesh position={[-0.3, -0.3, 0.15]} rotation={[0, 0, 0.2]} material={skullMaterial}>
        <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
      </mesh>
      <mesh position={[0.3, -0.3, 0.15]} rotation={[0, 0, -0.2]} material={skullMaterial}>
        <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
      </mesh>

      {/* Temporal bones */}
      <mesh position={[-0.55, 0.1, 0.0]} material={skullMaterial}>
        <sphereGeometry args={[0.18, 10, 8]} />
      </mesh>
      <mesh position={[0.55, 0.1, 0.0]} material={skullMaterial}>
        <sphereGeometry args={[0.18, 10, 8]} />
      </mesh>

      {/* Teeth row (simplified) */}
      <mesh position={[0, -0.3, 0.55]} material={skullMaterial}>
        <boxGeometry args={[0.35, 0.04, 0.06]} />
      </mesh>
    </group>
  );
}
