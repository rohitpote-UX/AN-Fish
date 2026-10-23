"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Caustics() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(t * 0.8) * 2.0;
    lightRef.current.position.z = Math.cos(t * 0.6) * 1.5 + 2.0;
    lightRef.current.intensity = 1.4 + Math.sin(t * 2.0) * 0.3;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 2, 3]}
      color="#6EC6F0"
      intensity={1.5}
      distance={12}
    />
  );
}
