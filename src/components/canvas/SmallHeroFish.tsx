"use client";

import React, { useRef, Suspense, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useScrollStore } from "@/store/scroll";

function MiniFish() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/hero-tuna.mobile.glb", "/models/draco/");
  const cloned = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth slow rotation & natural swimming wobble
    meshRef.current.rotation.y = Math.sin(t * 0.9) * 0.45;
    meshRef.current.rotation.x = Math.sin(t * 1.2) * 0.12;
    meshRef.current.position.y = Math.sin(t * 1.8) * 0.08;
    meshRef.current.rotation.z = Math.cos(t * 1.5) * 0.08;
  });

  return (
    <group ref={meshRef} scale={[1.8, 1.8, 1.8]}>
      <primitive object={cloned} />
    </group>
  );
}

function SvgFallback() {
  return (
    <div className="w-16 h-16 flex items-center justify-center animate-pulse">
      <svg viewBox="0 0 100 60" className="w-14 h-8 fill-[#0A9AD9]" aria-hidden="true">
        <path d="M5 30 C 25 10, 60 10, 85 30 C 60 50, 25 50, 5 30 Z" />
        <path d="M85 30 L 98 15 L 94 30 L 98 45 Z" />
        <circle cx="25" cy="27" r="3.5" fill="#063A63" />
      </svg>
    </div>
  );
}

export function SmallHeroFish() {
  const reducedMotion = useScrollStore((state) => state.reducedMotion);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (reducedMotion || !hasWebGL) {
    return <SvgFallback />;
  }

  return (
    <div className="w-[120px] h-[120px] mx-auto relative pointer-events-none" aria-hidden="true">
      <Suspense fallback={<SvgFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 42 }}
          gl={{ alpha: true, antialias: true }}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[4, 5, 4]} intensity={2.2} />
          <directionalLight position={[-4, -3, -3]} intensity={1.2} color="#6EC6F0" />
          <MiniFish />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/models/hero-tuna.mobile.glb", "/models/draco/");
