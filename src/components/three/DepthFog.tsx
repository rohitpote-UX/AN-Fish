"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/store/scroll";

export function DepthFog() {
  const shallowColor = new THREE.Color("#063A63");
  const abyssColor = new THREE.Color("#02111F");

  useFrame(({ scene }) => {
    const depth = useScrollStore.getState().depth;
    const ratio = Math.min(1, Math.max(0, depth / 100));

    if (!scene.fog) {
      scene.fog = new THREE.FogExp2("#02111F", 0.045);
    }

    const currentFog = scene.fog as THREE.FogExp2;
    currentFog.color.copy(shallowColor).lerp(abyssColor, ratio);
    currentFog.density = 0.04 + ratio * 0.04;
  });

  return null;
}
