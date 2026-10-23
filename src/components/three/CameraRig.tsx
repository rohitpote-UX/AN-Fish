"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScrollStore } from "@/store/scroll";

export function CameraRig() {
  const targetY = useRef(0);

  useFrame((state, delta) => {
    const depth = useScrollStore.getState().depth;
    const reducedMotion = useScrollStore.getState().reducedMotion;

    if (reducedMotion) {
      state.camera.position.set(0, 0, 6.5);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    // Camera smoothly travels deeper as scroll increases
    const destY = -(depth / 115) * 1.8;
    targetY.current = THREE.MathUtils.lerp(targetY.current, destY, delta * 3);

    state.camera.position.y = targetY.current;
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    state.camera.lookAt(0, targetY.current, 0);
  });

  return null;
}
