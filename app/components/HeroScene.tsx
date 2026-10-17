'use client';

import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import HandSkeleton from './HandSkeleton';
import SkullModel from './SkullModel';

/**
 * Premium Studio Lighting for medical anatomy:
 * Three-point lighting with warm cream tones, soft shadows,
 * and subtle rim lighting for editorial depth.
 */
function StudioLighting() {
  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.35} color="#F3F0E5" />

      {/* Key light — warm directional from upper right */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.2}
        color="#FFF8ED"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />

      {/* Fill light — cooler, softer from left */}
      <directionalLight
        position={[-3, 3, 4]}
        intensity={0.5}
        color="#E8E4D9"
      />

      {/* Rim light — olive-tinted back light */}
      <directionalLight
        position={[0, 4, -5]}
        intensity={0.35}
        color="#8B8F72"
      />

      {/* Subtle point light below for under-glow */}
      <pointLight
        position={[0, -2, 2]}
        intensity={0.15}
        color="#D9D5C8"
        distance={8}
        decay={2}
      />
    </>
  );
}

/**
 * Camera Controller: Smooth cinematic dolly and orbital movement
 * driven by scroll progress via GSAP timeline.
 */
function CameraController({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    // Scene flow: wide → close-up hand → pull back w/ skull → hero composition
    const p = scrollProgress;

    // Camera positions at key points
    let targetX: number, targetY: number, targetZ: number;
    let lookAtX: number, lookAtY: number, lookAtZ: number;

    if (p < 0.25) {
      // Scene 1: Anatomical introduction — wide shot
      const t = p / 0.25;
      targetX = THREE.MathUtils.lerp(2, 1.5, t);
      targetY = THREE.MathUtils.lerp(1.5, 0.8, t);
      targetZ = THREE.MathUtils.lerp(6, 4.5, t);
      lookAtX = 0;
      lookAtY = THREE.MathUtils.lerp(0.5, 0.3, t);
      lookAtZ = 0;
    } else if (p < 0.5) {
      // Scene 2: Controlled 3D movement — orbit closer
      const t = (p - 0.25) / 0.25;
      targetX = THREE.MathUtils.lerp(1.5, -0.5, t);
      targetY = THREE.MathUtils.lerp(0.8, 0.6, t);
      targetZ = THREE.MathUtils.lerp(4.5, 3.8, t);
      lookAtX = THREE.MathUtils.lerp(0, 0.2, t);
      lookAtY = THREE.MathUtils.lerp(0.3, 0.4, t);
      lookAtZ = 0;
    } else if (p < 0.75) {
      // Scene 3: Skull transition — pull back, shift focus
      const t = (p - 0.5) / 0.25;
      targetX = THREE.MathUtils.lerp(-0.5, 1, t);
      targetY = THREE.MathUtils.lerp(0.6, 0.5, t);
      targetZ = THREE.MathUtils.lerp(3.8, 5, t);
      lookAtX = THREE.MathUtils.lerp(0.2, 0.5, t);
      lookAtY = THREE.MathUtils.lerp(0.4, 0.2, t);
      lookAtZ = 0;
    } else {
      // Scene 4: Hero composition — hand to right, open left for text
      const t = (p - 0.75) / 0.25;
      targetX = THREE.MathUtils.lerp(1, 1.5, t);
      targetY = THREE.MathUtils.lerp(0.5, 0.5, t);
      targetZ = THREE.MathUtils.lerp(5, 4.5, t);
      lookAtX = THREE.MathUtils.lerp(0.5, 0.8, t);
      lookAtY = THREE.MathUtils.lerp(0.2, 0.2, t);
      lookAtZ = 0;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);

    camera.lookAt(
      THREE.MathUtils.lerp(0, lookAtX, 1),
      THREE.MathUtils.lerp(0, lookAtY, 1),
      lookAtZ
    );
  });

  return null;
}

/**
 * Scene Orchestrator: Manages visibility and opacity of skull/hand
 * based on scroll progress.
 */
function SceneOrchestrator({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const handGroupRef = useRef<THREE.Group>(null);
  const skullGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = scrollProgress;

    // Hand position: starts centered, moves right for hero composition
    if (handGroupRef.current) {
      const handX = p > 0.75 ? THREE.MathUtils.lerp(0, 1.2, (p - 0.75) / 0.25) : 0;
      handGroupRef.current.position.x = THREE.MathUtils.lerp(
        handGroupRef.current.position.x,
        handX,
        0.04
      );
    }

    // Skull: appears in scene 3, fades in scene 4
    if (skullGroupRef.current) {
      let skullOpacity = 0;
      let skullX = -1.5;
      let skullY = 0.3;

      if (p >= 0.4 && p < 0.75) {
        const t = (p - 0.4) / 0.35;
        skullOpacity = Math.min(t * 1.5, 0.7);
        skullX = THREE.MathUtils.lerp(-1.5, -1, t);
        skullY = THREE.MathUtils.lerp(0.5, 0.3, t);
      } else if (p >= 0.75) {
        const t = (p - 0.75) / 0.25;
        skullOpacity = THREE.MathUtils.lerp(0.7, 0, t);
      }

      skullGroupRef.current.position.x = THREE.MathUtils.lerp(
        skullGroupRef.current.position.x,
        skullX,
        0.04
      );
      skullGroupRef.current.position.y = THREE.MathUtils.lerp(
        skullGroupRef.current.position.y,
        skullY,
        0.04
      );

      // Apply opacity to all skull children
      skullGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && 'opacity' in mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).transparent = true;
            (mesh.material as THREE.MeshStandardMaterial).opacity = skullOpacity;
          }
        }
      });

      skullGroupRef.current.visible = skullOpacity > 0.01;
    }
  });

  return (
    <>
      {/* Hand skeleton */}
      <group ref={handGroupRef}>
        <HandSkeleton scrollProgress={scrollProgress} />
      </group>

      {/* Skull — secondary element */}
      <group ref={skullGroupRef} position={[-1.5, 0.3, -1]}>
        <SkullModel scrollProgress={scrollProgress} />
      </group>
    </>
  );
}

/**
 * Orbital Ring: Decorative ring in 3D space behind the hand
 */
function OrbitalRing({ scrollProgress }: { scrollProgress: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.1) * 0.05;
    ringRef.current.rotation.z = t * 0.02;

    // Fade in
    const opacity = Math.min(scrollProgress * 3, 0.15);
    if (ringRef.current.material && 'opacity' in ringRef.current.material) {
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <mesh ref={ringRef} position={[0.5, 0.2, -1.5]}>
      <torusGeometry args={[2, 0.004, 16, 100]} />
      <meshBasicMaterial color="#626747" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * Main 3D Canvas Component
 */
export default function HeroScene({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    // Reduce DPR for lower-end devices
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      setDpr([1, 1.5]);
    }
  }, []);

  if (reducedMotion) {
    return null; // Static poster fallback handled by parent
  }

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      camera={{
        fov: 35,
        near: 0.1,
        far: 100,
        position: [2, 1.5, 6],
      }}
      shadows
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <StudioLighting />
        <CameraController scrollProgress={scrollProgress} />
        <SceneOrchestrator scrollProgress={scrollProgress} />
        <OrbitalRing scrollProgress={scrollProgress} />

        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#F3F0E5', 8, 20]} />
      </Suspense>
    </Canvas>
  );
}
