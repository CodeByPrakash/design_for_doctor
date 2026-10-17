'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Keyframe interface for 3-section trajectory
 */
interface HandKeyframe {
  progress: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

/**
 * Trajectory Keyframes:
 * - Section 1: Hero (Landing Page) -> EXCLUDED (scale: 0.0, completely hidden)
 * - Section 2: Conditions / Common Symptoms -> Hand on LEFT SIDE pointing at cards
 * - Section 3: About the Practice -> Hand on RIGHT SIDE
 * - Section 4: Patient Journey -> Hand on LEFT SIDE (balancing doctor image on right)
 * - Section 5: Referring Physicians -> Hand on RIGHT SIDE
 * - Section 6: Consultation / Contact -> Fades out cleanly
 */
const KEYFRAMES: HandKeyframe[] = [
  // 1. Landing Hero Page: Strictly excluded (scale: 0.0)
  {
    progress: 0.0,
    posX: -1.0,
    posY: -0.20,
    posZ: 0.0,
    rotX: 0.28,
    rotY: 2.85,
    rotZ: 1.10,
    scale: 0.0,
  },
  // Smooth entrance as user scrolls from Hero down towards Symptoms
  {
    progress: 0.12,
    posX: -1.20,
    posY: -0.25,
    posZ: 0.02,
    rotX: 0.28,
    rotY: 2.85,
    rotZ: 1.10,
    scale: 0.90,
  },
  // 2. Section 2 (Conditions / Symptoms): Hand on LEFT BLANK SIDE
  {
    progress: 0.30,
    posX: -1.45,
    posY: -0.28,
    posZ: 0.05,
    rotX: 0.28,
    rotY: 2.85,
    rotZ: 1.10,
    scale: 1.25,
  },
  // Smooth glide transition across to About on the right
  {
    progress: 0.45,
    posX: 0.10,
    posY: 0.05,
    posZ: -0.05,
    rotX: 0.32,
    rotY: 1.65,
    rotZ: 1.65,
    scale: 1.35,
  },
  // 3. Section 3 (About the Practice): Hand on RIGHT SIDE
  {
    progress: 0.58,
    posX: 1.18,
    posY: 0.10,
    posZ: 0.0,
    rotX: 0.35,
    rotY: 0.45,
    rotZ: 2.30,
    scale: 1.40,
  },
  // Smooth glide transition to Patients on the left
  {
    progress: 0.68,
    posX: -0.30,
    posY: 0.08,
    posZ: 0.0,
    rotX: 0.32,
    rotY: 1.70,
    rotZ: 1.60,
    scale: 1.32,
  },
  // 4. Section 4 (Patient Journey): Hand on LEFT SIDE (opposite doctor image on right)
  {
    progress: 0.78,
    posX: -1.35,
    posY: 0.05,
    posZ: 0.05,
    rotX: 0.30,
    rotY: 2.70,
    rotZ: 1.15,
    scale: 1.28,
  },
  // 5. Section 5 (Referring Physicians): Hand on RIGHT SIDE
  {
    progress: 0.88,
    posX: 1.20,
    posY: 0.05,
    posZ: 0.0,
    rotX: 0.35,
    rotY: 0.45,
    rotZ: 2.30,
    scale: 1.35,
  },
  // 6. Section 6 (Contact & Consultation): Graceful fade out
  {
    progress: 0.96,
    posX: 1.20,
    posY: -0.10,
    posZ: -0.10,
    rotX: 0.35,
    rotY: 0.45,
    rotZ: 2.30,
    scale: 0.0,
  },
  {
    progress: 1.0,
    posX: 1.20,
    posY: -0.10,
    posZ: -0.10,
    rotX: 0.35,
    rotY: 0.45,
    rotZ: 2.30,
    scale: 0.0,
  },
];

/**
 * Smooth Hermite / Cubic interpolation between keyframes
 */
function interpolateKeyframes(p: number): HandKeyframe {
  const clamped = Math.max(0, Math.min(1, p));
  if (clamped <= KEYFRAMES[0].progress) return KEYFRAMES[0];
  if (clamped >= KEYFRAMES[KEYFRAMES.length - 1].progress)
    return KEYFRAMES[KEYFRAMES.length - 1];

  let i = 0;
  while (i < KEYFRAMES.length - 1 && KEYFRAMES[i + 1].progress < clamped) {
    i++;
  }

  const k1 = KEYFRAMES[i];
  const k2 = KEYFRAMES[i + 1];
  const factor = (clamped - k1.progress) / (k2.progress - k1.progress);
  const smooth = factor * factor * (3 - 2 * factor);

  return {
    progress: clamped,
    posX: THREE.MathUtils.lerp(k1.posX, k2.posX, smooth),
    posY: THREE.MathUtils.lerp(k1.posY, k2.posY, smooth),
    posZ: THREE.MathUtils.lerp(k1.posZ, k2.posZ, smooth),
    rotX: THREE.MathUtils.lerp(k1.rotX, k2.rotX, smooth),
    rotY: THREE.MathUtils.lerp(k1.rotY, k2.rotY, smooth),
    rotZ: THREE.MathUtils.lerp(k1.rotZ, k2.rotZ, smooth),
    scale: THREE.MathUtils.lerp(k1.scale, k2.scale, smooth),
  };
}

/**
 * Procedural Anatomical Bone Texture Generator
 */
function createProceduralBoneTextures() {
  if (typeof document === 'undefined') return null;

  // 1. Diffuse (Color) Canvas: 512x512
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = 512;
  diffCanvas.height = 512;
  const dCtx = diffCanvas.getContext('2d');
  if (!dCtx) return null;

  dCtx.fillStyle = '#EDE5D8';
  dCtx.fillRect(0, 0, 512, 512);

  const dImgData = dCtx.getImageData(0, 0, 512, 512);
  const dData = dImgData.data;
  for (let i = 0; i < dData.length; i += 4) {
    const x = (i / 4) % 512;
    const y = Math.floor(i / 4 / 512);
    const grain = Math.sin(x * 0.22) * 4 + Math.sin(x * 0.75 + y * 0.04) * 5;
    const noise = (Math.random() - 0.5) * 12;
    dData[i] = Math.min(255, Math.max(0, dData[i] + grain + noise));
    dData[i + 1] = Math.min(255, Math.max(0, dData[i + 1] + grain * 0.95 + noise * 0.9));
    dData[i + 2] = Math.min(255, Math.max(0, dData[i + 2] + grain * 0.82 + noise * 0.75));
  }
  dCtx.putImageData(dImgData, 0, 0);

  // Micro-rings for osteon lamellae
  dCtx.save();
  for (let o = 0; o < 36; o++) {
    const ox = ((o * 127.3) % 480) + 16;
    const oy = ((o * 211.9 + 30) % 480) + 16;
    const r = 7 + (o % 7) * 2.5;

    dCtx.strokeStyle = 'rgba(175, 165, 145, 0.14)';
    dCtx.lineWidth = 1.2;
    dCtx.beginPath();
    dCtx.ellipse(ox, oy, r, r * 1.5, o * 0.35, 0, Math.PI * 2);
    dCtx.stroke();

    dCtx.fillStyle = 'rgba(130, 120, 105, 0.24)';
    dCtx.beginPath();
    dCtx.arc(ox, oy, 1.4, 0, Math.PI * 2);
    dCtx.fill();
  }
  dCtx.restore();

  const diffuseMap = new THREE.CanvasTexture(diffCanvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;
  diffuseMap.repeat.set(2, 2);

  // 2. Bump Map (Micro-relief): 512x512
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');
  if (bCtx) {
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 512, 512);

    const bImgData = bCtx.getImageData(0, 0, 512, 512);
    const bData = bImgData.data;
    for (let i = 0; i < bData.length; i += 4) {
      const x = (i / 4) % 512;
      const y = Math.floor(i / 4 / 512);
      const ridge = Math.sin(x * 0.35) * 8 + Math.sin(x * 1.1 + y * 0.07) * 10;
      const pit = Math.random() < 0.04 ? -35 : (Math.random() - 0.5) * 12;
      const val = Math.min(255, Math.max(0, 128 + ridge + pit));
      bData[i] = val;
      bData[i + 1] = val;
      bData[i + 2] = val;
    }
    bCtx.putImageData(bImgData, 0, 0);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);

  return { diffuseMap, bumpMap };
}

interface FingerJoint {
  node: THREE.Object3D;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  finger: 'thumb' | 'pointer' | 'middle' | 'ring' | 'pinky';
  segmentIndex: number;
}

function HandModel({
  scrollProgress = 0,
  activeAnatomy,
}: {
  scrollProgress: number;
  activeAnatomy?: string | null;
}) {
  const gltf = useGLTF('/skull_model/scene.gltf');
  const groupRef = useRef<THREE.Group>(null);
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const fingerJointsRef = useRef<FingerJoint[]>([]);
  const tipNodesRef = useRef<{
    thumb?: THREE.Object3D;
    pointer?: THREE.Object3D;
    middle?: THREE.Object3D;
    ring?: THREE.Object3D;
    pinky?: THREE.Object3D;
  }>({});

  const prevProgressRef = useRef<number>(scrollProgress);
  const scrollSpeedRef = useRef<number>(0);
  const { camera, size } = useThree();

  // Pre-generate procedural textures
  const textures = useMemo(() => createProceduralBoneTextures(), []);

  // Pre-allocated colors
  const colors = useMemo(() => ({
    normalIvory: new THREE.Color('#EDE5D8'),
    anatomyEmissive: new THREE.Color('#94B172'),
    zeroEmissive: new THREE.Color('#000000'),
    tmpColor: new THREE.Color(),
    tmpEmissive: new THREE.Color(),
  }), []);

  // Center model, normalize scale, and attach textured translucent MeshPhysicalMaterial
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const map = new Map<string, THREE.Mesh>();
    const materials: THREE.MeshPhysicalMaterial[] = [];

    // Anatomical translucent bone physical material with bump micro-relief
    const boneMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#EDE5D8'),
      map: textures?.diffuseMap || null,
      bumpMap: textures?.bumpMap || null,
      bumpScale: 0.014,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.38,
      clearcoatRoughness: 0.20,
      transmission: 0.28,      // Subsurface light passage through bones
      thickness: 1.25,
      ior: 1.48,               // Cortical bone refractive index
      transparent: true,       // Semi-transparent depth
      opacity: 0.88,
      side: THREE.DoubleSide,
      reflectivity: 0.55,
    });

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = boneMaterial.clone();
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        map.set(mesh.name, mesh);
        materials.push(mat);
      }
    });

    meshMapRef.current = map;
    materialsRef.current = materials;

    // Collect skeletal finger joints for forward kinematic articulation
    const joints: FingerJoint[] = [];
    const tips: typeof tipNodesRef.current = {};

    const fingerConfigs: { name: string; key: 'thumb' | 'pointer' | 'middle' | 'ring' | 'pinky' }[] = [
      { name: 'Thumb', key: 'thumb' },
      { name: 'Pointer', key: 'pointer' },
      { name: 'Middle', key: 'middle' },
      { name: 'Ring', key: 'ring' },
      { name: 'Pinky', key: 'pinky' },
    ];

    fingerConfigs.forEach(({ name, key }) => {
      const root = cloned.getObjectByName(name);
      if (root) {
        joints.push({
          node: root,
          baseRotX: root.rotation.x,
          baseRotY: root.rotation.y,
          baseRotZ: root.rotation.z,
          finger: key,
          segmentIndex: 0,
        });

        let segIdx = 1;
        let lastChild: THREE.Object3D = root;
        root.traverse((child) => {
          if (child !== root && child.name.includes('FingerSeg') && !child.name.includes('phong')) {
            joints.push({
              node: child,
              baseRotX: child.rotation.x,
              baseRotY: child.rotation.y,
              baseRotZ: child.rotation.z,
              finger: key,
              segmentIndex: segIdx,
            });
            lastChild = child;
            segIdx++;
          }
        });
        tips[key] = lastChild;
      }
    });

    fingerJointsRef.current = joints;
    tipNodesRef.current = tips;

    // Compute bounding box and center origin
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Normalize so max dimension is strictly 1.6 units
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.6 / maxDim;

    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    return cloned;
  }, [gltf, textures]);

  // Controlled scroll-driven motion, dynamic 3-section restriction, and finger articulation
  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const t = _state.clock.getElapsedTime();

    // 0. Track instantaneous and smoothed scroll velocity
    const deltaProgress = Math.abs(scrollProgress - prevProgressRef.current);
    prevProgressRef.current = scrollProgress;
    const instantSpeed = Math.min(deltaProgress / Math.max(delta, 0.001), 6.0);
    scrollSpeedRef.current = THREE.MathUtils.lerp(scrollSpeedRef.current, instantSpeed, 0.12);
    const currentSpeed = scrollSpeedRef.current;

    // 1. Visibility Guard:
    // - Hero landing page: EXCLUDED (sectionVisibility = 0.0)
    // - Other pages (Symptoms, About, Patients, Referring): VISIBLE (sectionVisibility = 1.0)
    // - Contact / footer: dissolves gracefully
    let sectionVisibility = 1.0;

    if (typeof document !== 'undefined') {
      const symptomsEl = document.getElementById('symptoms');
      const contactEl = document.getElementById('contact');
      const winH = window.innerHeight;

      if (symptomsEl) {
        const symptomsRect = symptomsEl.getBoundingClientRect();
        // While symptoms is far down (user is viewing Hero landing page), sectionVisibility is strictly 0.0
        // When symptoms section starts entering viewport (top < winH * 0.95), smoothly fade in to 1.0
        const enterFactor = THREE.MathUtils.clamp(
          (winH * 0.95 - symptomsRect.top) / (winH * 0.40),
          0,
          1
        );
        sectionVisibility *= enterFactor;
      } else {
        // Fallback by scroll progress: 0 on hero (progress < 0.10)
        sectionVisibility *= THREE.MathUtils.smoothstep(scrollProgress, 0.06, 0.16);
      }

      // Smooth fade out only when entering the Contact consultation form section
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect();
        if (contactRect.top < winH * 0.85) {
          const exitFactor = THREE.MathUtils.clamp((contactRect.top - winH * 0.15) / (winH * 0.55), 0, 1);
          sectionVisibility *= exitFactor;
        }
      }
    }

    // Hide completely when excluded or dissolved
    if (sectionVisibility <= 0.005) {
      groupRef.current.visible = false;
      return;
    } else {
      groupRef.current.visible = true;
    }

    // 2. Compute dynamic trajectory grounded in section DOM anchors:
    // - Section 2: Symptoms (#symptoms) -> Hand on LEFT SIDE (pointing at symptom cards)
    // - Section 3: About (#about) -> Hand on RIGHT SIDE
    // - Section 4: Patients (#patients) -> Hand on LEFT SIDE (balancing doctor image on right)
    // - Section 5: Referring (#referring) -> Hand on RIGHT SIDE
    let target = interpolateKeyframes(scrollProgress);

    if (typeof document !== 'undefined') {
      const symptomsEl = document.getElementById('symptoms');
      const aboutEl = document.getElementById('about');
      const patientsEl = document.getElementById('patients');
      const referringEl = document.getElementById('referring');
      const winH = window.innerHeight;

      if (symptomsEl && aboutEl) {
        const symptomsRect = symptomsEl.getBoundingClientRect();
        const aboutRect = aboutEl.getBoundingClientRect();

        // Determine exact position of the left blank space in the Conditions / Symptoms section
        let symptomsPosX = -1.45;
        let symptomsPosY = -0.28;
        const handZoneEl = document.getElementById('symptoms-hand-zone');
        if (handZoneEl) {
          const zoneRect = handZoneEl.getBoundingClientRect();
          const centerX = zoneRect.left + zoneRect.width * 0.45;
          const centerY = zoneRect.top + zoneRect.height * 0.40;

          const ndcX = (centerX / Math.max(size.width, 1)) * 2 - 1;
          const ndcY = -(centerY / Math.max(size.height, 1)) * 2 + 1;

          const persCamera = camera as THREE.PerspectiveCamera;
          const fovFactor = Math.tan(((persCamera.fov || 36) * Math.PI) / 360) * 5.0;
          const aspect = size.width / Math.max(size.height, 1);

          symptomsPosX = Math.min(-1.35, ndcX * fovFactor * aspect);
          symptomsPosY = ndcY * fovFactor;
        }

        const symptomsTarget: HandKeyframe = {
          progress: 0.30,
          posX: symptomsPosX,
          posY: symptomsPosY,
          posZ: 0.05,
          rotX: 0.28,
          rotY: 2.85,
          rotZ: 1.10,
          scale: 1.25,
        };

        const aboutTarget: HandKeyframe = {
          progress: 0.58,
          posX: 1.18,
          posY: 0.10,
          posZ: 0.0,
          rotX: 0.35,
          rotY: 0.45,
          rotZ: 2.30,
          scale: 1.40,
        };

        const patientsTarget: HandKeyframe = {
          progress: 0.78,
          posX: -1.35,
          posY: 0.05,
          posZ: 0.05,
          rotX: 0.30,
          rotY: 2.70,
          rotZ: 1.15,
          scale: 1.28,
        };

        const referringTarget: HandKeyframe = {
          progress: 0.88,
          posX: 1.20,
          posY: 0.05,
          posZ: 0.0,
          rotX: 0.35,
          rotY: 0.45,
          rotZ: 2.30,
          scale: 1.35,
        };

        const lerpProp = (a: number, b: number, factor: number) => a + (b - a) * factor;
        const lerpKeyframe = (k1: HandKeyframe, k2: HandKeyframe, factor: number): HandKeyframe => ({
          progress: scrollProgress,
          posX: lerpProp(k1.posX, k2.posX, factor),
          posY: lerpProp(k1.posY, k2.posY, factor),
          posZ: lerpProp(k1.posZ, k2.posZ, factor),
          rotX: lerpProp(k1.rotX, k2.rotX, factor),
          rotY: lerpProp(k1.rotY, k2.rotY, factor),
          rotZ: lerpProp(k1.rotZ, k2.rotZ, factor),
          scale: lerpProp(k1.scale, k2.scale, factor),
        });

        // 1. Initial Symptoms Target
        let activeTarget = symptomsTarget;

        // 2. Transition Symptoms -> About
        const symptomsToAbout = THREE.MathUtils.clamp(
          (winH * 0.25 - aboutRect.top) / (winH * 0.38),
          0,
          1
        );
        if (symptomsToAbout > 0) {
          activeTarget = lerpKeyframe(symptomsTarget, aboutTarget, symptomsToAbout);
        }

        // 3. Transition About -> Patients
        if (patientsEl) {
          const patientsRect = patientsEl.getBoundingClientRect();
          const aboutToPatients = THREE.MathUtils.clamp(
            (winH * 0.25 - patientsRect.top) / (winH * 0.38),
            0,
            1
          );
          if (aboutToPatients > 0) {
            activeTarget = lerpKeyframe(aboutTarget, patientsTarget, aboutToPatients);
          }

          // 4. Transition Patients -> Referring
          if (referringEl) {
            const referringRect = referringEl.getBoundingClientRect();
            const patientsToReferring = THREE.MathUtils.clamp(
              (winH * 0.25 - referringRect.top) / (winH * 0.38),
              0,
              1
            );
            if (patientsToReferring > 0) {
              activeTarget = lerpKeyframe(patientsTarget, referringTarget, patientsToReferring);
            }
          }
        }

        target = activeTarget;
      }
    }

    // Steady stability for maximum performance (no floating or breathing drift when steady)
    const targetPosX = target.posX;
    const targetPosY = target.posY;
    const targetPosZ = target.posZ;

    const targetRotX = target.rotX;
    const targetRotY = target.rotY;
    const targetRotZ = target.rotZ;

    // Cinematic frame-rate independent exponential smoothing
    const posDamp = 1.0 - Math.exp(-8.0 * delta);
    const rotDamp = 1.0 - Math.exp(-7.0 * delta);

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetPosX,
      posDamp
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosY,
      posDamp
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetPosZ,
      posDamp
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      rotDamp
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      rotDamp
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      rotDamp
    );

    const effectiveScale = target.scale * sectionVisibility;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, effectiveScale, posDamp)
    );

    // 3. Material Opacity & Lighting Updates
    const materials = materialsRef.current;
    const currOpacity = 0.88 * sectionVisibility;

    for (let i = 0; i < materials.length; i++) {
      const mat = materials[i];
      mat.opacity = currOpacity;

      const meshName = meshMapRef.current ? Array.from(meshMapRef.current.entries())[i]?.[0] : '';
      const isCarpalTarget =
        activeAnatomy === 'carpal' &&
        (meshName.includes('Palm') || meshName.includes('Pointer'));
      const isThumbTarget =
        activeAnatomy === 'thumb' && meshName.includes('Thumb');
      const isWristTarget =
        activeAnatomy === 'wrist' &&
        (meshName.includes('Pinky') || meshName.includes('Ring') || meshName.includes('Palm'));

      if (isCarpalTarget || isThumbTarget || isWristTarget) {
        mat.emissive.copy(colors.anatomyEmissive);
        mat.emissiveIntensity = 0.85;
      } else {
        mat.emissive.copy(colors.zeroEmissive);
        mat.emissiveIntensity = 0;
      }
    }

    // 4. Dynamic Skeletal Finger Articulation - active strictly during scroll events
    const joints = fingerJointsRef.current;
    if (joints && joints.length > 0) {
      const isActivelyScrolling = currentSpeed > 0.04;
      const pointGesture =
        THREE.MathUtils.smoothstep(scrollProgress, 0.22, 0.35) *
        (1 - THREE.MathUtils.smoothstep(scrollProgress, 0.44, 0.54));

      // Wave is driven by scroll displacement, removing all idle floating/swaying
      const baseWave = scrollProgress * 22.0;

      for (let j = 0; j < joints.length; j++) {
        const joint = joints[j];
        const { node, baseRotX, finger, segmentIndex } = joint;

        const fingerPhase =
          finger === 'thumb' ? 0.0 :
          finger === 'pointer' ? 0.75 :
          finger === 'middle' ? 1.5 :
          finger === 'ring' ? 2.25 : 3.0;

        const segmentLag = segmentIndex * 0.45;
        // Zero floating wave when steady (steady state uses 0 wave)
        const travelWave = isActivelyScrolling
          ? Math.sin(baseWave - fingerPhase - segmentLag) * Math.min(currentSpeed * 0.12, 0.16)
          : 0;

        let targetCurl = travelWave;

        if (finger === 'pointer') {
          targetCurl = THREE.MathUtils.lerp(targetCurl, -0.16, pointGesture);
          if (activeAnatomy === 'carpal') {
            targetCurl += 0.20;
          }
        } else if (finger === 'thumb') {
          const thumbAction = activeAnatomy === 'thumb' ? 0.25 : 0;
          targetCurl = travelWave * 0.5 + thumbAction;
        } else {
          targetCurl = THREE.MathUtils.lerp(targetCurl, 0.15 * (segmentIndex + 1), pointGesture);
        }

        const jointDamp = 1.0 - Math.exp(-8.5 * delta);
        node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, baseRotX + targetCurl, jointDamp);
      }
    }

  });

  return (
    <group
      ref={groupRef}
      position={[-1.45, -0.28, 0.05]}
      rotation={[0.28, 2.85, 1.10]}
      scale={0.0}
      visible={false}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload GLTF asset
useGLTF.preload('/skull_model/scene.gltf');

export default function HandModelCanvas({
  scrollProgress = 0,
  activeAnatomy,
}: {
  scrollProgress?: number;
  activeAnatomy?: string | null;
}) {
  return (
    <div
      className="w-full h-full relative pointer-events-none !pointer-events-none select-none"
      style={{ pointerEvents: 'none' }}
      data-hand-canvas
    >
      <Canvas
        style={{ pointerEvents: 'none' }}
        className="pointer-events-none !pointer-events-none"
        camera={{ position: [0, 0, 5.0], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 2]}
      >
        {/* Subtle sage-green and ivory environment reflection */}
        <hemisphereLight args={['#FAF7F0', '#626747', 1.25]} />
        <ambientLight intensity={0.85} color="#F3F0E5" />

        {/* Studio Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.5}
          color="#FFFDF5"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Surgical Rim Light */}
        <directionalLight
          position={[2, -4, -3]}
          intensity={1.6}
          color="#8AA574"
        />

        {/* Fill Light */}
        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.1}
          color="#EDE5D8"
        />

        <Suspense fallback={null}>
          <HandModel
            scrollProgress={scrollProgress}
            activeAnatomy={activeAnatomy}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
