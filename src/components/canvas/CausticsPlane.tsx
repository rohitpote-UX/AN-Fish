"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScrollStore } from "@/store/scroll";

const causticVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const causticFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float waveCell(vec2 p) {
    return sin(p.x * 2.8 + p.y * 1.9) * cos(p.x * 2.1 - p.y * 2.7);
  }

  void main() {
    vec2 uv = vUv * 7.0;
    vec2 layer1 = uv + vec2(uTime * 0.08, uTime * 0.04);
    vec2 layer2 = uv + vec2(-uTime * 0.06, uTime * 0.09);

    float c1 = abs(waveCell(layer1));
    float c2 = abs(waveCell(layer2));
    float caustic = pow(1.0 - (c1 + c2) * 0.5, 3.8);

    // Smooth boundary fade
    float edgeMask = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x) *
                     smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);

    float alpha = caustic * uIntensity * edgeMask;
    vec3 color = uColor * (caustic * 1.4);

    gl_FragColor = vec4(color, alpha);
  }
`;

export function CausticsPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useScrollStore((state) => state.progress);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uColor: { value: new THREE.Color("#6EC6F0") },
    }),
    []
  );

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: causticVertexShader,
      fragmentShader: causticFragmentShader,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [uniforms]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.getElapsedTime();

    // Caustics intensity fades with depth:
    // Bright at surface, fading through twilight/abyss, rising on return
    let targetIntensity = 1.0;
    if (progress < 0.25) {
      targetIntensity = 1.0 - progress * 1.5; // 1.0 -> 0.625
    } else if (progress < 0.65) {
      targetIntensity = 0.625 - (progress - 0.25) * 1.3; // 0.625 -> 0.1
    } else if (progress < 0.9) {
      targetIntensity = 0.05; // almost completely dark in deep abyss
    } else {
      targetIntensity = 0.05 + (progress - 0.9) * 5.0; // rises back on return (0.05 -> 0.55)
    }

    uniforms.uIntensity.value = THREE.MathUtils.damp(
      uniforms.uIntensity.value,
      targetIntensity,
      3.0,
      delta
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2.5]} renderOrder={0}>
      <planeGeometry args={[26, 26, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
