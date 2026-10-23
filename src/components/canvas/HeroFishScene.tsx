"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroFish } from "./HeroFish";
import { SatelliteFish } from "./SatelliteFish";
import { FishSchool } from "./FishSchool";
import { OceanParticles } from "./OceanParticles";

interface HeroFishSceneProps {
  isMobile?: boolean;
}

export default function HeroFishScene({ isMobile = false }: HeroFishSceneProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight color="#02111F" intensity={1.8} />
        {/* Sunlit surface directional ray */}
        <directionalLight position={[3, 5, 4]} color="#E9F7FF" intensity={2.2} />
        {/* Ocean abyss blue rim lighting */}
        <directionalLight position={[-4, -3, -2]} color="#0A9AD9" intensity={3.5} />
        {/* Lagoon caustic fill */}
        <pointLight position={[0, -1, 3]} color="#6EC6F0" intensity={1.5} distance={10} />

        <Suspense fallback={null}>
          <HeroFish isMobile={isMobile} />
          <SatelliteFish />
          <FishSchool isMobile={isMobile} />
          <OceanParticles count={isMobile ? 35 : 80} />
        </Suspense>
      </Canvas>
    </div>
  );
}
