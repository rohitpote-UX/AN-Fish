"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useScrollStore } from "@/store/scroll";
import { useSceneStore } from "@/store/scene";

export function CameraRig() {
  const { scene, camera } = useThree();
  const progress = useScrollStore((state) => state.progress);
  const tintOverride = useSceneStore((state) => state.tintOverride);

  // Directional sun & ambient lights references
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const abyssLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Color stop definitions as per spec
  const colorStops = useMemo(
    () => ({
      surface: new THREE.Color("#E9F7FF"),
      shallows: new THREE.Color("#6EC6F0"),
      open1: new THREE.Color("#0A9AD9"),
      open2: new THREE.Color("#063A63"),
      deep1: new THREE.Color("#02111F"),
      deep2: new THREE.Color("#05080C"),
      returnColor: new THREE.Color("#E9F7FF"),
    }),
    []
  );

  const currentColor = useRef(new THREE.Color("#E9F7FF"));
  const targetColor = useRef(new THREE.Color("#E9F7FF"));

  // Attach fog to scene
  useEffect(() => {
    scene.fog = new THREE.FogExp2("#E9F7FF", 0.035);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((state, delta) => {
    const p = progress;

    // 1. Interpolate background and fog color across depth zones:
    // Surface #E9F7FF -> Shallows #6EC6F0 -> Open #0A9AD9/#063A63 -> Deep #02111F/#05080C -> Return back to #E9F7FF
    if (p < 0.22) {
      targetColor.current.lerpColors(colorStops.surface, colorStops.shallows, p / 0.22);
    } else if (p < 0.48) {
      targetColor.current.lerpColors(colorStops.shallows, colorStops.open1, (p - 0.22) / 0.26);
    } else if (p < 0.7) {
      targetColor.current.lerpColors(colorStops.open1, colorStops.open2, (p - 0.48) / 0.22);
    } else if (p < 0.85) {
      targetColor.current.lerpColors(colorStops.open2, colorStops.deep1, (p - 0.7) / 0.15);
    } else if (p < 0.93) {
      targetColor.current.lerpColors(colorStops.deep1, colorStops.deep2, (p - 0.85) / 0.08);
    } else {
      targetColor.current.lerpColors(colorStops.deep2, colorStops.returnColor, (p - 0.93) / 0.07);
    }

    if (tintOverride) {
      const tint = new THREE.Color(tintOverride);
      targetColor.current.lerp(tint, 0.45);
    }

    // Smooth damp colors (never snap)
    currentColor.current.lerp(targetColor.current, Math.min(1, delta * 3.5));

    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(currentColor.current);

      // Target fog density: lighter at surface, denser in abyss
      const targetDensity = p > 0.7 && p < 0.93 ? 0.065 : 0.038;
      scene.fog.density = THREE.MathUtils.damp(scene.fog.density, targetDensity, 2.5, delta);
    }

    // 2. Light intensity interpolation
    if (sunLightRef.current) {
      const targetSun = p < 0.3 ? 2.5 : p > 0.75 && p < 0.93 ? 0.4 : p >= 0.93 ? 2.2 : 1.4;
      sunLightRef.current.intensity = THREE.MathUtils.damp(
        sunLightRef.current.intensity,
        targetSun,
        2.5,
        delta
      );
    }

    if (abyssLightRef.current) {
      const targetAbyss = p > 0.65 && p < 0.93 ? 3.8 : 1.2;
      abyssLightRef.current.intensity = THREE.MathUtils.damp(
        abyssLightRef.current.intensity,
        targetAbyss,
        2.5,
        delta
      );
    }

    // 3. Camera Y and slight roll
    const targetY = p < 0.92 ? -p * 3.8 : -3.8 + (p - 0.92) * 45.0; // returns smoothly
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.0, delta);

    // Slight roll from pointer X + gentle drift
    const targetRoll = -state.pointer.x * 0.035;
    camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, targetRoll, 2.5, delta);

    // Slight look down pitch during dive
    const targetPitch = -0.06 * Math.sin(p * Math.PI);
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, targetPitch, 2.5, delta);
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={2.4} color="#063A63" />
      {/* Front sunlit directional ray directly illuminating the hero fish */}
      <directionalLight
        ref={sunLightRef}
        position={[2, 3, 7]}
        intensity={3.2}
        color="#FFFFFF"
      />
      {/* Ocean rim light */}
      <directionalLight
        ref={abyssLightRef}
        position={[-5, -2, -2]}
        intensity={2.2}
        color="#6EC6F0"
      />
      {/* Front fill point light */}
      <pointLight position={[1.5, 0, 4]} intensity={2.2} distance={15} color="#E9F7FF" />
    </>
  );
}
