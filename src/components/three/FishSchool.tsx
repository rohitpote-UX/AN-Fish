"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScrollStore } from "@/store/scroll";

export function FishSchool({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 32 : 96;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 5.0;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.6;
      const yOffset = (Math.random() - 0.5) * 5.5;
      const scale = 0.08 + Math.random() * 0.12;
      const phase = Math.random() * Math.PI * 2;
      arr.push({ radius, angle, speed, yOffset, scale, phase });
    }
    return arr;
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.2, 1.0, 5);
    geom.rotateZ(Math.PI / 2);
    geom.scale(1.2, 0.7, 0.3);
    return geom;
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#6EC6F0"),
      roughness: 0.35,
      metalness: 0.3,
      transparent: true,
      opacity: 0.7,
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const reducedMotion = useScrollStore.getState().reducedMotion;
    if (reducedMotion) return;

    const time = state.clock.getElapsedTime();
    const depth = useScrollStore.getState().depth;
    const depthShift = (depth / 120) * -1.8;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.angle += delta * p.speed * 0.65;

      const x = Math.cos(p.angle) * p.radius;
      const z = Math.sin(p.angle) * (p.radius * 0.6) - 1.5;
      const y = p.yOffset + Math.sin(time * 1.5 + p.phase) * 0.35 + depthShift;

      dummy.position.set(x, y, z);
      dummy.rotation.y = -p.angle + Math.PI / 2;
      dummy.rotation.z = Math.sin(time * 4 + p.phase) * 0.12;
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}
