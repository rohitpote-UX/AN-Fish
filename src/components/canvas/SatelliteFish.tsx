"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export function SatelliteFish() {
  const sat1Ref = useRef<THREE.Group>(null);
  const sat2Ref = useRef<THREE.Group>(null);

  // Load production optimized satellite models (Draco compressed, <= 600 KB each)
  const { scene: scene1 } = useGLTF("/models/sat-fish-1.glb", "/models/draco/");
  const { scene: scene2 } = useGLTF("/models/sat-fish-2.glb", "/models/draco/");

  const clone1 = useMemo(() => scene1.clone(), [scene1]);
  const clone2 = useMemo(() => scene2.clone(), [scene2]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Satellite 1: Gentle schooling orbit above and behind hero tuna
    if (sat1Ref.current) {
      const angle1 = time * 0.45;
      const targetX = 0.8 + Math.cos(angle1) * 1.8;
      const targetY = 1.2 + Math.sin(time * 0.9) * 0.35;
      const targetZ = -1.5 + Math.sin(angle1) * 0.8;

      sat1Ref.current.position.x = THREE.MathUtils.lerp(sat1Ref.current.position.x, targetX, delta * 3.0);
      sat1Ref.current.position.y = THREE.MathUtils.lerp(sat1Ref.current.position.y, targetY, delta * 3.0);
      sat1Ref.current.position.z = THREE.MathUtils.lerp(sat1Ref.current.position.z, targetZ, delta * 3.0);

      const swimYaw = Math.sin(time * 3.2) * 0.08 - 0.2;
      sat1Ref.current.rotation.y = THREE.MathUtils.lerp(sat1Ref.current.rotation.y, swimYaw, delta * 3.0);
      sat1Ref.current.rotation.z = Math.sin(time * 1.8) * 0.06;
    }

    // Satellite 2: Swimming below and ahead of hero tuna
    if (sat2Ref.current) {
      const angle2 = time * 0.52 + 2.2;
      const targetX = 2.4 + Math.cos(angle2) * 1.4;
      const targetY = -0.9 + Math.cos(time * 1.1) * 0.3;
      const targetZ = -1.0 + Math.sin(angle2) * 0.9;

      sat2Ref.current.position.x = THREE.MathUtils.lerp(sat2Ref.current.position.x, targetX, delta * 3.0);
      sat2Ref.current.position.y = THREE.MathUtils.lerp(sat2Ref.current.position.y, targetY, delta * 3.0);
      sat2Ref.current.position.z = THREE.MathUtils.lerp(sat2Ref.current.position.z, targetZ, delta * 3.0);

      const swimYaw2 = Math.sin(time * 3.6 + 1.0) * 0.1 - 0.35;
      sat2Ref.current.rotation.y = THREE.MathUtils.lerp(sat2Ref.current.rotation.y, swimYaw2, delta * 3.0);
      sat2Ref.current.rotation.z = -Math.sin(time * 2.0) * 0.05;
    }
  });

  return (
    <>
      {/* Satellite 1: Barramundi / Pelagic companion */}
      <group ref={sat1Ref} position={[0.8, 1.2, -1.5]} scale={[1.8, 1.8, 1.8]}>
        <primitive object={clone1} />
      </group>

      {/* Satellite 2: Grey Snapper / Mackerel companion */}
      <group ref={sat2Ref} position={[2.4, -0.9, -1.0]} scale={[1.6, 1.6, 1.6]}>
        <primitive object={clone2} />
      </group>
    </>
  );
}

useGLTF.preload("/models/sat-fish-1.glb", "/models/draco/");
useGLTF.preload("/models/sat-fish-2.glb", "/models/draco/");
