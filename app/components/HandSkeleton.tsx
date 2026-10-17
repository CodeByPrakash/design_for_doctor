'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Procedurally generated anatomical hand skeleton.
 * Creates metacarpals, phalanges, carpals, and wrist bones
 * using capsule/cylinder primitives with smooth bone material.
 */

// ── Bone Material ──
function useBoneMaterial() {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8E2D4'),
      roughness: 0.65,
      metalness: 0.05,
      emissive: new THREE.Color('#1a1a14'),
      emissiveIntensity: 0.05,
    });
  }, []);
}

// ── Joint Material (slightly different tone for carpal joints) ──
function useJointMaterial() {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4CFC0'),
      roughness: 0.7,
      metalness: 0.03,
      emissive: new THREE.Color('#1a1a14'),
      emissiveIntensity: 0.03,
    });
  }, []);
}

// ── Olive accent material for subtle anatomical highlights ──
function useAccentMaterial() {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#626747'),
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.15,
    });
  }, []);
}

// ── Bone shape: Rounded capsule ──
function Bone({
  position,
  rotation = [0, 0, 0],
  length = 1,
  radius = 0.06,
  material,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  radius?: number;
  material: THREE.Material;
}) {
  const geometry = useMemo(() => {
    return new THREE.CapsuleGeometry(radius, length, 6, 12);
  }, [radius, length]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={geometry}
      material={material}
      castShadow
    />
  );
}

// ── Joint sphere ──
function Joint({
  position,
  radius = 0.07,
  material,
}: {
  position: [number, number, number];
  radius?: number;
  material: THREE.Material;
}) {
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(radius, 12, 8);
  }, [radius]);

  return (
    <mesh
      position={position}
      geometry={geometry}
      material={material}
    />
  );
}

// ── Finger component ──
function Finger({
  basePosition,
  angle,
  lengths,
  radii,
  flexAngles,
  boneMaterial,
  jointMaterial,
}: {
  basePosition: [number, number, number];
  angle: number;
  lengths: [number, number, number];
  radii: [number, number, number];
  flexAngles: [number, number, number];
  boneMaterial: THREE.Material;
  jointMaterial: THREE.Material;
}) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={basePosition} rotation={[0, 0, angle]}>
      {/* Proximal phalanx */}
      <group rotation={[flexAngles[0], 0, 0]}>
        <Bone
          position={[0, lengths[0] / 2, 0]}
          length={lengths[0]}
          radius={radii[0]}
          material={boneMaterial}
        />
        <Joint position={[0, 0, 0]} radius={radii[0] * 1.15} material={jointMaterial} />

        {/* Middle phalanx */}
        <group position={[0, lengths[0], 0]} rotation={[flexAngles[1], 0, 0]}>
          <Bone
            position={[0, lengths[1] / 2, 0]}
            length={lengths[1]}
            radius={radii[1]}
            material={boneMaterial}
          />
          <Joint position={[0, 0, 0]} radius={radii[1] * 1.15} material={jointMaterial} />

          {/* Distal phalanx */}
          <group position={[0, lengths[1], 0]} rotation={[flexAngles[2], 0, 0]}>
            <Bone
              position={[0, lengths[2] / 2, 0]}
              length={lengths[2]}
              radius={radii[2]}
              material={boneMaterial}
            />
            <Joint position={[0, 0, 0]} radius={radii[2] * 1.1} material={jointMaterial} />
          </group>
        </group>
      </group>
    </group>
  );
}

// ── Thumb (only two phalanges visible after metacarpal) ──
function Thumb({
  basePosition,
  lengths,
  radii,
  flexAngles,
  boneMaterial,
  jointMaterial,
}: {
  basePosition: [number, number, number];
  lengths: [number, number];
  radii: [number, number];
  flexAngles: [number, number];
  boneMaterial: THREE.Material;
  jointMaterial: THREE.Material;
}) {
  return (
    <group position={basePosition} rotation={[0, 0, 0.5]}>
      {/* Proximal phalanx */}
      <group rotation={[flexAngles[0], 0, -0.3]}>
        <Bone
          position={[0, lengths[0] / 2, 0]}
          length={lengths[0]}
          radius={radii[0]}
          material={boneMaterial}
        />
        <Joint position={[0, 0, 0]} radius={radii[0] * 1.2} material={jointMaterial} />

        {/* Distal phalanx */}
        <group position={[0, lengths[0], 0]} rotation={[flexAngles[1], 0, 0]}>
          <Bone
            position={[0, lengths[1] / 2, 0]}
            length={lengths[1]}
            radius={radii[1]}
            material={boneMaterial}
          />
          <Joint position={[0, 0, 0]} radius={radii[1] * 1.1} material={jointMaterial} />
        </group>
      </group>
    </group>
  );
}

// ── Carpal bones (wrist) ──
function CarpalBones({
  material,
  jointMaterial,
}: {
  material: THREE.Material;
  jointMaterial: THREE.Material;
}) {
  // Two rows of carpal bones (simplified)
  const proximalRow = [
    { pos: [-0.18, 0, 0] as [number, number, number], r: 0.1 },
    { pos: [-0.06, 0.02, 0] as [number, number, number], r: 0.09 },
    { pos: [0.06, 0.02, 0] as [number, number, number], r: 0.095 },
    { pos: [0.18, 0, 0] as [number, number, number], r: 0.1 },
  ];

  const distalRow = [
    { pos: [-0.2, 0.18, 0] as [number, number, number], r: 0.08 },
    { pos: [-0.07, 0.2, 0] as [number, number, number], r: 0.085 },
    { pos: [0.06, 0.2, 0] as [number, number, number], r: 0.08 },
    { pos: [0.19, 0.18, 0] as [number, number, number], r: 0.075 },
  ];

  return (
    <group>
      {proximalRow.map((bone, i) => (
        <Joint key={`prox-${i}`} position={bone.pos} radius={bone.r} material={jointMaterial} />
      ))}
      {distalRow.map((bone, i) => (
        <Joint key={`dist-${i}`} position={bone.pos} radius={bone.r} material={material} />
      ))}
    </group>
  );
}

// ── Radius and Ulna (forearm bones) ──
function ForearmBones({ material }: { material: THREE.Material }) {
  return (
    <group>
      {/* Radius */}
      <Bone
        position={[-0.08, -0.55, 0]}
        length={0.7}
        radius={0.065}
        material={material}
      />
      {/* Ulna */}
      <Bone
        position={[0.08, -0.55, 0]}
        length={0.75}
        radius={0.06}
        material={material}
      />
    </group>
  );
}

// ── Complete Hand Skeleton ──
export default function HandSkeleton({
  scrollProgress = 0,
}: {
  scrollProgress?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const boneMaterial = useBoneMaterial();
  const jointMaterial = useJointMaterial();
  const accentMaterial = useAccentMaterial();

  // Finger flex animations driven by time + scroll
  const fingerFlexRef = useRef<number[]>([0, 0, 0, 0, 0]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle sequential finger flex — very slow and medical
    for (let i = 0; i < 5; i++) {
      const offset = i * 0.8;
      const wave = Math.sin(t * 0.3 + offset) * 0.08;
      fingerFlexRef.current[i] = wave;
    }

    // Subtle wrist rotation driven by scroll
    if (groupRef.current) {
      const targetRotY = -0.3 + scrollProgress * 0.6;
      const targetRotX = 0.1 - scrollProgress * 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.03
      );
    }
  });

  // Metacarpal base positions (fan from wrist)
  const metacarpalData = [
    { pos: [-0.26, 0.6, 0] as [number, number, number], angle: 0.12, len: 0.5 },
    { pos: [-0.1, 0.65, 0] as [number, number, number], angle: 0.04, len: 0.55 },
    { pos: [0.04, 0.65, 0] as [number, number, number], angle: -0.02, len: 0.53 },
    { pos: [0.18, 0.6, 0] as [number, number, number], angle: -0.08, len: 0.48 },
  ];

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={1.8}>
      {/* Wrist / carpal region */}
      <CarpalBones material={boneMaterial} jointMaterial={jointMaterial} />

      {/* Forearm bones */}
      <ForearmBones material={boneMaterial} />

      {/* Metacarpals */}
      {metacarpalData.map((mc, i) => (
        <group key={`mc-${i}`}>
          <Bone
            position={[mc.pos[0], mc.pos[1] - mc.len / 2 + 0.2, mc.pos[2]]}
            rotation={[0, 0, mc.angle]}
            length={mc.len}
            radius={0.055}
            material={boneMaterial}
          />
          <Joint
            position={[mc.pos[0], mc.pos[1] - mc.len + 0.2, mc.pos[2]]}
            radius={0.065}
            material={jointMaterial}
          />
        </group>
      ))}

      {/* Fingers (Index, Middle, Ring, Pinky) */}
      <FingerAnimated
        index={0}
        basePosition={[-0.26, 1.08, 0]}
        angle={0.1}
        lengths={[0.32, 0.22, 0.16]}
        radii={[0.045, 0.038, 0.032]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
        flexRef={fingerFlexRef}
      />
      <FingerAnimated
        index={1}
        basePosition={[-0.1, 1.17, 0]}
        angle={0.03}
        lengths={[0.35, 0.26, 0.18]}
        radii={[0.048, 0.04, 0.034]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
        flexRef={fingerFlexRef}
      />
      <FingerAnimated
        index={2}
        basePosition={[0.04, 1.17, 0]}
        angle={-0.02}
        lengths={[0.34, 0.24, 0.17]}
        radii={[0.046, 0.039, 0.033]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
        flexRef={fingerFlexRef}
      />
      <FingerAnimated
        index={3}
        basePosition={[0.18, 1.08, 0]}
        angle={-0.08}
        lengths={[0.28, 0.2, 0.14]}
        radii={[0.042, 0.036, 0.03]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
        flexRef={fingerFlexRef}
      />

      {/* Thumb */}
      <ThumbAnimated
        basePosition={[-0.35, 0.45, 0.05]}
        lengths={[0.28, 0.2]}
        radii={[0.05, 0.042]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
        flexRef={fingerFlexRef}
      />

      {/* Olive accent ring around the wrist area */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.003, 8, 64]} />
        <meshBasicMaterial color="#626747" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ── Animated finger wrapper ──
function FingerAnimated({
  index,
  basePosition,
  angle,
  lengths,
  radii,
  boneMaterial,
  jointMaterial,
  flexRef,
}: {
  index: number;
  basePosition: [number, number, number];
  angle: number;
  lengths: [number, number, number];
  radii: [number, number, number];
  boneMaterial: THREE.Material;
  jointMaterial: THREE.Material;
  flexRef: React.MutableRefObject<number[]>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const flex = flexRef.current[index] || 0;
    if (groupRef.current) {
      // Apply subtle flex to the finger group's children
      const children = groupRef.current.children;
      if (children[0]) {
        children[0].rotation.x = flex;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Finger
        basePosition={basePosition}
        angle={angle}
        lengths={lengths}
        radii={radii}
        flexAngles={[0, 0, 0]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
      />
    </group>
  );
}

// ── Animated thumb wrapper ──
function ThumbAnimated({
  basePosition,
  lengths,
  radii,
  boneMaterial,
  jointMaterial,
  flexRef,
}: {
  basePosition: [number, number, number];
  lengths: [number, number];
  radii: [number, number];
  boneMaterial: THREE.Material;
  jointMaterial: THREE.Material;
  flexRef: React.MutableRefObject<number[]>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const flex = flexRef.current[4] || 0;
    if (groupRef.current) {
      const children = groupRef.current.children;
      if (children[0]) {
        children[0].rotation.x = flex * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Thumb
        basePosition={basePosition}
        lengths={lengths}
        radii={radii}
        flexAngles={[0, 0]}
        boneMaterial={boneMaterial}
        jointMaterial={jointMaterial}
      />
    </group>
  );
}
