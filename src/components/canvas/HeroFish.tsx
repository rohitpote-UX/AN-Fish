"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useDepthStore } from "@/store/useDepthStore";

/**
 * 3D Hero Fish ("लाडकी")
 * Pacific Bluefin Tuna (Thunnus orientalis)
 * Production WebGL asset loaded from /public/models/hero-tuna.glb
 * Real-time spine undulation, dynamic dive maneuvers, and lighting reaction.
 */
export function HeroFish({ isMobile = false }: { isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const prevDepthRef = useRef(0);
  const diveVelocityRef = useRef(0);

  // Load optimized production GLB (Draco decompressed)
  const modelUrl = isMobile ? "/models/hero-tuna.mobile.glb" : "/models/hero-tuna.glb";
  const { scene } = useGLTF(modelUrl, "/models/draco/");

  // Deep clone scene for pristine isolated rendering
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const currentDepth = useDepthStore.getState().depth;
    const reducedMotion = useDepthStore.getState().reducedMotion;

    if (reducedMotion) {
      groupRef.current.position.set(1.4, -0.2, 0);
      groupRef.current.rotation.set(0, 0.1, 0);
      return;
    }

    // Measure depth change velocity
    const depthDelta = currentDepth - prevDepthRef.current;
    prevDepthRef.current = currentDepth;
    diveVelocityRef.current = THREE.MathUtils.lerp(
      diveVelocityRef.current,
      depthDelta * 8,
      delta * 5
    );

    // Dynamic swimming frequency: accelerates naturally during scroll dive
    const swimFreq = 3.6 + Math.min(Math.abs(diveVelocityRef.current) * 2.0, 5.5);
    const swimCycle = Math.sin(time * swimFreq);

    // Natural oceanic swimming movement across depth stages (0m to 100m)
    const targetY = 0.45 - (currentDepth / 120) * 1.5 + Math.sin(time * 1.1) * 0.18;
    const targetX = (window.innerWidth > 768 ? 1.6 : 0.4) + Math.cos(time * 0.75) * 0.22;
    
    // Dive pitch angle: points downward during rapid scroll dive
    const targetPitch = THREE.MathUtils.clamp(-diveVelocityRef.current * 0.08, -0.65, 0.45);
    const targetRoll = Math.sin(time * 1.4) * 0.08 + (diveVelocityRef.current > 0 ? 0.12 : 0);
    const targetYaw = -0.28 + swimCycle * 0.09;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3.5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 3.5);
    groupRef.current.position.z = Math.sin(time * 0.85) * 0.32;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, delta * 4);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, delta * 4);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, delta * 4);
  });

  return (
    <group ref={groupRef} position={[1.5, 0, 0]} scale={[3.6, 3.6, 3.6]}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/hero-tuna.glb", "/models/draco/");
useGLTF.preload("/models/hero-tuna.mobile.glb", "/models/draco/");
