"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScrollStore } from "@/store/scroll";
import { useSceneStore } from "@/store/scene";

interface FishSchoolProps {
  isMobile?: boolean;
}

const vertexShader = `
  uniform float uTime;
  uniform vec3 uPointerWorld;
  uniform float uAttractorStrength;
  uniform float uSchoolSplit;
  uniform float uDepthShift;

  attribute vec4 aOffset; // x: radius, y: baseAngle, z: yAltitude, w: phase
  attribute vec2 aSpeed;  // x: orbitSpeed, y: tailSpeed
  attribute float aScale; // scale multiplier

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDistToPointer;
  varying float vPhase;

  void main() {
    vPhase = aOffset.w;

    // 1. Schooling flow around an elliptical torus path
    float angle = aOffset.y + uTime * aSpeed.x * 0.55;
    float radX = aOffset.x;
    float radZ = aOffset.x * 0.75;

    vec3 centerPos = vec3(
      cos(angle) * radX,
      aOffset.z + sin(uTime * 1.6 + aOffset.w * 6.28) * 0.5 + uDepthShift,
      sin(angle) * radZ - 1.5
    );

    // 2. School Split effect (when logo fish splits into school)
    if (uSchoolSplit > 0.01) {
      vec3 splitDir = normalize(vec3(cos(angle * 2.0), sin(angle * 3.0), sin(angle)));
      centerPos += splitDir * uSchoolSplit * 3.5;
    }

    // 3. MOMENT 2: Pointer Attractor (The School Follows You)
    vec3 toPointer = uPointerWorld - centerPos;
    float dist = length(toPointer);
    vDistToPointer = dist;

    float pull = smoothstep(6.0, 0.4, dist) * uAttractorStrength;
    centerPos += normalize(toPointer) * pull * 2.4;

    // 4. Compute Tangent Heading and Coordinate Frame
    vec3 tangent = normalize(
      vec3(-sin(angle) * radX, cos(uTime * 1.6 + aOffset.w * 6.28) * 0.5, cos(angle) * radZ) +
      toPointer * (pull * 1.2)
    );
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, tangent));
    vec3 realUp = cross(tangent, right);
    mat3 rotMatrix = mat3(right, realUp, tangent);

    // 5. Tail-wiggle via sine on local X
    float tailMask = smoothstep(0.15, -0.45, position.z);
    float tailWiggle = sin(uTime * 15.0 * aSpeed.y + aOffset.w * 6.28 + position.z * 5.0) * 0.14 * tailMask;
    vec3 localPos = position + vec3(tailWiggle, 0.0, 0.0);

    // 6. World-space transformation
    vec3 worldPos = centerPos + rotMatrix * (localPos * aScale);
    vWorldPos = worldPos;
    vNormal = normalize(rotMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uFogColor;
  uniform float uFogDensity;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDistToPointer;
  varying float vPhase;

  void main() {
    // Diffuse + Sunlit rim
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
    float diff = max(dot(vNormal, lightDir), 0.0) * 0.7 + 0.3;

    // Fresnel rim sheen
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

    vec3 baseColor = mix(uColorPrimary, uColorSecondary, sin(vPhase * 6.28) * 0.3 + 0.3);

    // Glow interaction when near cursor (Moment 2 feedback)
    float proximityGlow = smoothstep(3.0, 0.5, vDistToPointer) * 0.4;
    vec3 finalColor = baseColor * diff + (uColorSecondary + vec3(0.2, 0.4, 0.5)) * fresnel + proximityGlow;

    // Depth fog integration
    float depthDist = length(cameraPosition - vWorldPos);
    float fogFactor = 1.0 - exp(-pow(depthDist * uFogDensity, 2.0));
    finalColor = mix(finalColor, uFogColor, clamp(fogFactor, 0.0, 1.0));

    gl_FragColor = vec4(finalColor, 0.88);
  }
`;

export function FishSchool({ isMobile = false }: FishSchoolProps) {
  // Balanced count for clean, high-performance schooling (85 desktop / 32 mobile)
  const count = isMobile ? 32 : 85;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const progress = useScrollStore((state) => state.progress);
  const schoolSplit = useSceneStore((state) => state.schoolSplit);
  const fishCountFactor = useSceneStore((state) => state.fishCountFactor);

  // 1. Sleek hydrodynamic fish geometry
  const geometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.12, 0.95, 6, 2);
    geom.rotateX(Math.PI / 2);
    geom.scale(0.4, 0.85, 1.1);
    return geom;
  }, []);

  // 2. Per-instance attributes for Vertex Shader motion
  const [aOffset, aSpeed, aScale] = useMemo(() => {
    const offsets = new Float32Array(count * 4);
    const speeds = new Float32Array(count * 2);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // aOffset: x = radius, y = angle, z = yAltitude, w = phase
      offsets[i * 4 + 0] = 3.2 + Math.random() * 4.8; // radius
      offsets[i * 4 + 1] = Math.random() * Math.PI * 2; // baseAngle
      offsets[i * 4 + 2] = (Math.random() - 0.5) * 5.2; // yAltitude
      offsets[i * 4 + 3] = Math.random(); // phase

      // aSpeed: x = orbitSpeed, y = tailSpeed
      speeds[i * 2 + 0] = 0.55 + Math.random() * 0.7;
      speeds[i * 2 + 1] = 0.8 + Math.random() * 0.5;

      // aScale: instance size
      scales[i] = 0.12 + Math.random() * 0.12;
    }
    return [offsets, speeds, scales];
  }, [count]);

  // Set instanced attributes
  useEffect(() => {
    if (!meshRef.current) return;
    const geom = meshRef.current.geometry;
    geom.setAttribute("aOffset", new THREE.InstancedBufferAttribute(aOffset, 4));
    geom.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(aSpeed, 2));
    geom.setAttribute("aScale", new THREE.InstancedBufferAttribute(aScale, 1));
  }, [aOffset, aSpeed, aScale]);

  // 3. Shader Material with uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointerWorld: { value: new THREE.Vector3(0, 0, 0) },
      uAttractorStrength: { value: 1.0 },
      uSchoolSplit: { value: 0.0 },
      uDepthShift: { value: 0.0 },
      uColorPrimary: { value: new THREE.Color("#0A9AD9") },
      uColorSecondary: { value: new THREE.Color("#6EC6F0") },
      uFogColor: { value: new THREE.Color("#063A63") },
      uFogDensity: { value: 0.045 },
    }),
    []
  );

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
  }, [uniforms]);

  // 4. Update uniforms in animation frame
  const pointerPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const worldPointer = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!material) return;

    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uSchoolSplit.value = schoolSplit;
    uniforms.uDepthShift.value = -progress * 5.0;

    // Pointer attractor: Unproject pointer or use autonomous drifting on touch
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    if (isTouch) {
      const t = uniforms.uTime.value;
      uniforms.uPointerWorld.value.set(
        Math.sin(t * 0.7) * 3.2,
        Math.cos(t * 0.9) * 2.0,
        0
      );
    } else {
      raycaster.setFromCamera(state.pointer, state.camera);
      raycaster.ray.intersectPlane(pointerPlane, worldPointer);
      if (worldPointer) {
        uniforms.uPointerWorld.value.copy(worldPointer);
      }
    }

    // Set active count factor (for subpages like About/Contact)
    if (meshRef.current) {
      meshRef.current.count = Math.round(count * fishCountFactor);
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
      renderOrder={1}
    />
  );
}
