"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useDepthStore } from "@/store/useDepthStore";

interface OceanParticlesProps {
  count?: number;
}

export function OceanParticles({ count = 80 }: OceanParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      spd[i] = 0.2 + Math.random() * 0.5;
    }
    return [pos, spd];
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color("#E9F7FF"),
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const reducedMotion = useDepthStore.getState().reducedMotion;
    if (reducedMotion) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Particles drift gently upward like micro bubbles
      posArray[i * 3 + 1] += delta * speeds[i];
      if (posArray[i * 3 + 1] > 5) {
        posArray[i * 3 + 1] = -5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
