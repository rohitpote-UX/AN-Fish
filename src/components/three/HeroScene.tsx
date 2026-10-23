"use client";

import React, { useRef, useMemo, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  PerformanceMonitor,
  AdaptiveDpr,
} from "@react-three/drei";
import { EffectComposer, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import { useGpuTier } from "@/hooks/useGpuTier";
import { useScrollStore } from "@/store/scroll";
import { useHudStore } from "@/store/hud";
import { FallbackPoster } from "./FallbackPoster";

/* =========================================================================
   1. HERO TUNA COMPONENT
   ========================================================================= */
interface HeroTunaProps {
  isMobile: boolean;
  onPointerHover: (hover: boolean) => void;
}

function HeroTuna({ isMobile, onPointerHover }: HeroTunaProps) {
  const groupRef = useRef<THREE.Group>(null);
  const anchorRef = useRef<THREE.Group>(null);
  const { camera, size, raycaster } = useThree();

  const setAnchor = useHudStore((state) => state.setAnchor);
  const setIsDragging = useHudStore((state) => state.setIsDragging);

  // Load production GLB
  const modelUrl = isMobile ? "/models/hero-tuna.mobile.glb" : "/models/hero-tuna.glb";
  const { scene } = useGLTF(modelUrl, "/models/draco/");

  // Uniform for swim wiggle vertex shader
  const swimUniforms = useMemo(() => ({
    uSwimTime: { value: 0 },
  }), []);

  // Clone scene & upgrade materials to MeshPhysicalMaterial with wet sheen & clearcoat
  const tunaScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const oldMat = mesh.material as THREE.MeshStandardMaterial;

        // Upgrade to MeshPhysicalMaterial for premium fresh-fish look
        const physicalMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,
          color: oldMat.color || new THREE.Color("#0A9AD9"),
          roughness: 0.18,
          metalness: 0.12,
          clearcoat: 0.65,
          clearcoatRoughness: 0.14,
          sheen: 0.45,
          sheenColor: new THREE.Color("#6EC6F0"),
          sheenRoughness: 0.25,
          ior: 1.34, // water-slick tissue index
          envMapIntensity: 1.15,
        });

        // Inject swim wiggle vertex displacement: head->tail sine wave along X
        physicalMat.onBeforeCompile = (shader) => {
          shader.uniforms.uSwimTime = swimUniforms.uSwimTime;

          shader.vertexShader = `
            uniform float uSwimTime;
            ${shader.vertexShader}
          `;

          // Inject lateral swim deflection: head stays stable, tail undulates
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            // Head is at +X (x > 0.15), tail is at -X (x < -0.1)
            float swimMask = smoothstep(0.28, -0.45, transformed.x);
            float swimAngle = uSwimTime * 3.77 + transformed.x * 4.6;
            float swimDisplacement = sin(swimAngle) * swimMask * 0.065;
            transformed.z += swimDisplacement;
            `
          );

          // Normal perturbation for swimming surface
          shader.vertexShader = shader.vertexShader.replace(
            "#include <beginnormal_vertex>",
            `
            #include <beginnormal_vertex>
            float dZdx = cos(uSwimTime * 3.77 + position.x * 4.6) * 4.6 * smoothstep(0.28, -0.45, position.x) * 0.065;
            objectNormal.z += dZdx;
            objectNormal = normalize(objectNormal);
            `
          );
        };

        mesh.material = physicalMat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return cloned;
  }, [scene, swimUniforms]);

  // Cleanup upgraded materials on unmount
  useEffect(() => {
    return () => {
      tunaScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [tunaScene]);

  // Hover & Drag state
  const isHoveringRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const dragRotationRef = useRef({ yaw: 0, pitch: 0 });
  const dragVelocityRef = useRef({ yaw: 0, pitch: 0 });
  const lastDragTimeRef = useRef(0);

  // Base rotation: 18° nose-down (-0.314 rad pitch around Z) and 20° yaw (-0.349 rad yaw around Y)
  const basePitch = -0.314;
  const baseYaw = -0.349;

  // Window event listeners for drag interaction (active when initiated on fish)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (!isHoveringRef.current) return;
      isPointerDownRef.current = true;
      setIsDragging(true);
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      lastDragTimeRef.current = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.007;
      dragRotationRef.current.yaw += dx * sensitivity;
      dragRotationRef.current.pitch += dy * sensitivity;

      dragVelocityRef.current = {
        yaw: dx * sensitivity,
        pitch: dy * sensitivity,
      };
      lastDragTimeRef.current = performance.now();
    };

    const onPointerUp = () => {
      if (isPointerDownRef.current) {
        isPointerDownRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [setIsDragging]);

  // Animation frame loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    swimUniforms.uSwimTime.value = time;

    // 1. Idle animation: slow, eased breathing wobble
    const idleYaw = Math.sin(time * 0.7) * (6 * (Math.PI / 180));
    const idlePitch = Math.cos(time * 0.9) * (3 * (Math.PI / 180));
    const idleY = Math.sin(time * 1.2) * 0.05;

    // 2. Cursor spring tilt (<= 12° yaw, <= 8° pitch)
    const pointer = state.pointer;
    const springYaw = pointer.x * (12 * (Math.PI / 180));
    const springPitch = -pointer.y * (8 * (Math.PI / 180));

    // 3. Inertia & Auto-recenter after 2s idle
    if (!isPointerDownRef.current) {
      dragRotationRef.current.yaw += dragVelocityRef.current.yaw;
      dragRotationRef.current.pitch += dragVelocityRef.current.pitch;
      dragVelocityRef.current.yaw *= 0.91;
      dragVelocityRef.current.pitch *= 0.91;

      const elapsedSinceDrag = (performance.now() - lastDragTimeRef.current) / 1000;
      if (elapsedSinceDrag > 2.0) {
        // Smoothly ease back to base rotation (0 drag offset)
        dragRotationRef.current.yaw = THREE.MathUtils.lerp(dragRotationRef.current.yaw, 0, delta * 2.2);
        dragRotationRef.current.pitch = THREE.MathUtils.lerp(dragRotationRef.current.pitch, 0, delta * 2.2);
      }
    }

    // Combine rotations: Pitch on Z (tilts nose along X), Yaw on Y, Roll on X
    const finalPitch = basePitch + idlePitch + springPitch + dragRotationRef.current.pitch;
    const finalYaw = baseYaw + idleYaw + springYaw + dragRotationRef.current.yaw;
    const finalRoll = Math.sin(time * 0.8) * 0.03 + pointer.x * 0.04;

    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, finalPitch, delta * 4.5);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, finalYaw, delta * 4.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, finalRoll, delta * 4.5);

    // Position: centre-right placement
    const targetX = (window.innerWidth > 1024 ? 1.5 : 0.35) + pointer.x * 0.15;
    const targetY = 0.1 + idleY - pointer.y * 0.1;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3.5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 3.5);

    // 4. Project HUD Anchor to screen space
    if (anchorRef.current) {
      const worldPos = new THREE.Vector3();
      anchorRef.current.getWorldPosition(worldPos);

      // Project 3D coordinate to normalized device coordinates [-1, 1]
      worldPos.project(camera);

      // Convert to 2D screen pixels
      const screenX = (worldPos.x * 0.5 + 0.5) * size.width;
      const screenY = (-worldPos.y * 0.5 + 0.5) * size.height;
      const isVisible = worldPos.z < 1.0;

      setAnchor(screenX, screenY, isVisible, isMobile ? 0.8 : 1.0);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[1.5, 0.1, 0]}
      // Scale: 4.6 units corresponds to ~58% viewport width at 1440x900
      scale={isMobile ? [2.6, 2.6, 2.6] : [4.6, 4.6, 4.6]}
      onPointerOver={() => {
        isHoveringRef.current = true;
        onPointerHover(true);
      }}
      onPointerOut={() => {
        isHoveringRef.current = false;
        onPointerHover(false);
      }}
    >
      <primitive object={tunaScene} />

      {/* Anchor Object3D positioned at the fish's head / mouth region */}
      <group ref={anchorRef} position={[0.48, 0.06, 0]} />
    </group>
  );
}

/* =========================================================================
   2. SATELLITE COMPANIONS (2 Fish + 3 Ice Shards)
   ========================================================================= */
function Satellites({ isMobile }: { isMobile: boolean }) {
  const sat1Ref = useRef<THREE.Group>(null);
  const sat2Ref = useRef<THREE.Group>(null);
  const shard1Ref = useRef<THREE.Mesh>(null);
  const shard2Ref = useRef<THREE.Mesh>(null);
  const shard3Ref = useRef<THREE.Mesh>(null);

  const { scene: scene1 } = useGLTF("/models/sat-fish-1.glb", "/models/draco/");
  const { scene: scene2 } = useGLTF("/models/sat-fish-2.glb", "/models/draco/");

  const clone1 = useMemo(() => scene1.clone(true), [scene1]);
  const clone2 = useMemo(() => scene2.clone(true), [scene2]);

  // Procedural jittered crystal icosahedrons
  const shardGeometries = useMemo(() => {
    return [0, 1, 2].map((seed) => {
      const geom = new THREE.IcosahedronGeometry(1, 0);
      const pos = geom.attributes.position;
      // Add deterministic vertex jitter for natural gemstone/crystal facets
      for (let i = 0; i < pos.count; i++) {
        const noise = Math.sin(i * 1.7 + seed * 2.3) * 0.18;
        pos.setXYZ(i, pos.getX(i) + noise, pos.getY(i) - noise * 0.5, pos.getZ(i) + noise * 0.8);
      }
      geom.computeVertexNormals();
      return geom;
    });
  }, []);

  // Ice shard material: physical transmission on desktop, opaque on mobile
  const iceMaterial = useMemo(() => {
    if (isMobile) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#A8E5FF"),
        roughness: 0.15,
        metalness: 0.1,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#EBF8FF"),
      transmission: 0.9,
      ior: 1.31, // physical index of refraction for ice
      roughness: 0.08,
      thickness: 0.55,
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.6,
      envMapIntensity: 1.2,
    });
  }, [isMobile]);

  // Dispose ice geometries & materials on unmount
  useEffect(() => {
    return () => {
      shardGeometries.forEach((g) => g.dispose());
      iceMaterial.dispose();
    };
  }, [shardGeometries, iceMaterial]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // Sat-1: Upper background orbit with depth multiplier
    if (sat1Ref.current) {
      const targetX = 0.6 + Math.cos(time * 0.35) * 1.6 - pointer.x * 0.35;
      const targetY = 1.3 + Math.sin(time * 0.8) * 0.28 + pointer.y * 0.25;
      sat1Ref.current.position.x = THREE.MathUtils.lerp(sat1Ref.current.position.x, targetX, delta * 2.5);
      sat1Ref.current.position.y = THREE.MathUtils.lerp(sat1Ref.current.position.y, targetY, delta * 2.5);
      sat1Ref.current.rotation.y = -0.25 + Math.sin(time * 2.6) * 0.07;
      sat1Ref.current.rotation.z = Math.sin(time * 1.4) * 0.05;
    }

    // Sat-2: Lower foreground orbit (only on desktop)
    if (sat2Ref.current && !isMobile) {
      const targetX = 2.6 + Math.cos(time * 0.42 + 2.0) * 1.3 - pointer.x * 0.45;
      const targetY = -1.1 + Math.cos(time * 0.95) * 0.22 + pointer.y * 0.3;
      sat2Ref.current.position.x = THREE.MathUtils.lerp(sat2Ref.current.position.x, targetX, delta * 2.5);
      sat2Ref.current.position.y = THREE.MathUtils.lerp(sat2Ref.current.position.y, targetY, delta * 2.5);
      sat2Ref.current.rotation.y = -0.38 + Math.sin(time * 3.1) * 0.08;
      sat2Ref.current.rotation.z = -Math.cos(time * 1.6) * 0.04;
    }

    // Tumbling Ice Shards (noise-driven float & parallax)
    const shards = [
      { ref: shard1Ref, speed: 0.6, zDepth: -2.8, parallax: 0.2 },
      { ref: shard2Ref, speed: 0.8, zDepth: 0.8, parallax: 0.5 },
      { ref: shard3Ref, speed: 0.5, zDepth: -1.4, parallax: 0.35 },
    ];

    shards.forEach((s, idx) => {
      if (s.ref.current) {
        s.ref.current.rotation.x += delta * (0.2 + idx * 0.1);
        s.ref.current.rotation.y += delta * (0.3 - idx * 0.08);
        s.ref.current.position.y += Math.sin(time * s.speed + idx) * 0.003;
        s.ref.current.position.x -= pointer.x * delta * s.parallax;
      }
    });
  });

  return (
    <>
      {/* Satellite 1: Barramundi / Skipjack scale 0.28, z = -2.5 */}
      <group ref={sat1Ref} position={[0.6, 1.3, -2.5]} scale={[1.4, 1.4, 1.4]}>
        <primitive object={clone1} />
      </group>

      {/* Satellite 2: Grey Snapper / Mackerel scale 0.22, z = 0.4 (desktop only) */}
      {!isMobile && (
        <group ref={sat2Ref} position={[2.6, -1.1, 0.4]} scale={[1.2, 1.2, 1.2]}>
          <primitive object={clone2} />
        </group>
      )}

      {/* 3 Procedural Ice Shards */}
      <mesh
        ref={shard1Ref}
        geometry={shardGeometries[0]}
        material={iceMaterial}
        position={[-1.8, 1.4, -2.8]}
        scale={0.14}
      />
      {!isMobile && (
        <>
          <mesh
            ref={shard2Ref}
            geometry={shardGeometries[1]}
            material={iceMaterial}
            position={[3.2, 1.6, 0.8]}
            scale={0.09}
          />
          <mesh
            ref={shard3Ref}
            geometry={shardGeometries[2]}
            material={iceMaterial}
            position={[0.2, -1.8, -1.4]}
            scale={0.11}
          />
        </>
      )}
    </>
  );
}

/* =========================================================================
   3. BUBBLES / PARTICLES (40–80 tiny rising particles)
   ========================================================================= */
function Bubbles({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;      // X: [-6, 6]
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;   // Y: [-4, 4]
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1; // Z: [-4, 2]
      spd[i] = 0.35 + Math.random() * 0.65;
    }
    return [pos, spd];
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color("#6EC6F0"),
      size: 0.045,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Dispose buffer geometry & material on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Drift upwards
      array[i * 3 + 1] += speeds[i] * delta * 0.8;
      // Slight gentle horizontal turbulence
      array[i * 3] += Math.sin(array[i * 3 + 1] * 2.0) * delta * 0.04;

      // Loop from top back to bottom
      if (array[i * 3 + 1] > 4.5) {
        array[i * 3 + 1] = -4.5;
        array[i * 3] = (Math.random() - 0.5) * 12;
      }
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/* =========================================================================
   4. CAUSTIC SPOTLIGHT / GOBO (0.25 intensity animated project)
   ========================================================================= */
function CausticLight() {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (!spotRef.current) return;
    const t = state.clock.getElapsedTime();
    spotRef.current.intensity = 0.25 + Math.sin(t * 2.8) * 0.06;
    spotRef.current.position.x = 1.5 + Math.sin(t * 0.9) * 0.4;
  });

  return (
    <spotLight
      ref={spotRef}
      position={[1.5, 5.5, 2.0]}
      angle={0.65}
      penumbra={0.8}
      color="#6EC6F0"
      intensity={0.25}
      distance={14}
    />
  );
}

/* =========================================================================
   5. DRAG CURSOR OVERLAY (Desktop Ring labelled "DRAG")
   ========================================================================= */
function DragCursor() {
  const isHoveringFish = useHudStore((state) => state.isHoveringFish);
  const isDragging = useHudStore((state) => state.isDragging);
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  if (!isHoveringFish && !isDragging) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-50 transition-opacity duration-200 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className={`w-14 h-14 rounded-full border border-white/60 bg-black/30 backdrop-blur-md flex items-center justify-center transition-transform duration-150 ${
          isDragging ? "scale-90 border-[#0A9AD9]" : "scale-100 animate-pulse"
        }`}
      >
        <span className="text-[10px] font-mono-accent font-bold uppercase tracking-widest text-white">
          DRAG
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   6. MASTER CANVAS SCENE
   ========================================================================= */
function MasterScene({ isMobile, isHighTier }: { isMobile: boolean; isHighTier: boolean }) {
  const setIsHoveringFish = useHudStore((state) => state.setIsHoveringFish);
  const progress = useScrollStore((state) => state.progress);

  // Frameloop control: pause when scrolled far past hero and pinned capabilities
  const isHeroActive = progress < 0.45;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={isHeroActive ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        className="w-full h-full pointer-events-auto"
      >
        <PerformanceMonitor />
        <AdaptiveDpr pixelated />

        {/* 1. Environment Map: Studio lighting preset */}
        <Environment preset="studio" environmentIntensity={0.8} />

        {/* 2. Key light: Cool white from top-right */}
        <directionalLight position={[4.5, 5.0, 3.5]} color="#E9F7FF" intensity={2.2} />

        {/* 3. Rim light: AN blue from back-left (separates fish from dark ground) */}
        <directionalLight position={[-4.5, 2.5, -3.0]} color="#0A9AD9" intensity={3.6} />

        {/* 4. Soft fill from below (20% relative intensity) */}
        <directionalLight position={[0, -4.0, 2.0]} color="#6EC6F0" intensity={0.4} />

        {/* 5. Animated Caustic Spotlight gobo */}
        <CausticLight />

        <Suspense fallback={null}>
          {/* Main Hero Fish */}
          <HeroTuna isMobile={isMobile} onPointerHover={setIsHoveringFish} />

          {/* Depth Layer Satellites (Fish + Ice Shards) */}
          <Satellites isMobile={isMobile} />

          {/* Drifting Tiny Bubbles */}
          <Bubbles count={isMobile ? 35 : 65} />
        </Suspense>

        {/* 6. Postprocessing: Desktop High-Tier Only */}
        {isHighTier && !isMobile && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <DepthOfField focusDistance={0.018} focalLength={0.02} bokehScale={1.5} />
            <Vignette eskil={false} offset={0.15} darkness={0.75} />
            <Noise opacity={0.03} />
          </EffectComposer>
        )}
      </Canvas>

      {/* Interactive Drag Ring Cursor Overlay */}
      {!isMobile && <DragCursor />}
    </div>
  );
}

const DynamicMasterScene = dynamic(() => Promise.resolve(MasterScene), {
  ssr: false,
});

/* =========================================================================
   7. ROOT EXPORT: HeroScene
   ========================================================================= */
export function HeroScene() {
  const { canRender3D, isMobile, tier, loading, reducedMotion } = useGpuTier();

  // Tier 0-1 or reduced motion -> Fallback poster with CSS parallax
  if (reducedMotion || (!loading && !canRender3D)) {
    return <FallbackPoster />;
  }

  const isHighTier = tier >= 2;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      {/* WebGL Canvas (mounted after first paint) */}
      {!loading && <DynamicMasterScene isMobile={isMobile} isHighTier={isHighTier} />}
    </div>
  );
}

export default HeroScene;
