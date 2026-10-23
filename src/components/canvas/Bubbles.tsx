"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScrollStore } from "@/store/scroll";

const bubbleVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute float aSpeed;
  attribute vec2 aPhase;

  varying float vHighlight;

  void main() {
    vec3 pos = position;

    // Upward rise + organic noise wobble
    float yOffset = mod(pos.y + uTime * aSpeed * 0.8, 12.0) - 6.0;
    float xOffset = sin(uTime * 2.0 + aPhase.x * 6.28) * 0.25;
    float zOffset = cos(uTime * 1.7 + aPhase.y * 6.28) * 0.2;

    vec3 newPos = vec3(pos.x + xOffset, yOffset, pos.z + zOffset);
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);

    // Bigger near the camera (perspective size attenuation)
    gl_PointSize = (aSize * 260.0) / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const bubbleFragmentShader = `
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Organic translucent bubble rim + specular sun highlight
    float rim = smoothstep(0.48, 0.38, dist) * 0.75;
    float innerGlow = smoothstep(0.38, 0.0, dist) * 0.25;
    float highlight = smoothstep(0.14, 0.0, length(coord - vec2(-0.15, 0.15))) * 0.95;

    float alpha = (rim + innerGlow + highlight) * 0.7;
    vec3 bubbleColor = mix(vec3(0.43, 0.78, 0.94), vec3(0.91, 0.97, 1.0), highlight);

    gl_FragColor = vec4(bubbleColor, alpha);
  }
`;

export function Bubbles({ count = 160 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  const [positions, sizes, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const spd = new Float32Array(count);
    const ph = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8.0;

      sz[i] = 0.08 + Math.random() * 0.16; // bubble size
      spd[i] = 0.35 + Math.random() * 0.6; // rising speed
      ph[i * 2 + 0] = Math.random();
      ph[i * 2 + 1] = Math.random();
    }
    return [pos, sz, spd, ph];
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 2));
    return geom;
  }, [positions, sizes, speeds, phases]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [uniforms]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    if (reducedMotion) return;
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return <points ref={pointsRef} geometry={geometry} material={material} renderOrder={3} />;
}
