"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fishContainerRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const waterGroupRef = useRef<SVGGElement>(null);

  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  useEffect(() => {
    // 1. Accessibility: skip on reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches || reducedMotion) {
      sessionStorage.setItem("an_preloader_seen", "1");
      return;
    }

    // 2. Play once per session
    if (typeof window !== "undefined" && sessionStorage.getItem("an_preloader_seen")) {
      return;
    }

    setVisible(true);

    let progressObj = { value: 0 };
    let waveOffset = { value: 0 };
    let animationFrameId: number | null = null;

    // 3. Real asset loading: fonts + min 1.2s delay, capped at 2.8s
    const startTimestamp = Date.now();
    const minDelay = 1200;
    const maxDelay = 2800;

    const fontsReady = typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve();

    // Sine wave generator for water surface
    const updateWave = () => {
      if (!wavePathRef.current) return;
      const p = progressObj.value; // 0 to 100
      const waterY = 60 - (p / 100) * 60; // 60 -> 0
      const offset = waveOffset.value;
      const amplitude = p >= 98 || p <= 2 ? 0 : 2.5;

      // Construct sine curve across 0 to 100
      const d = `
        M -20 ${waterY}
        Q ${10 + offset} ${waterY - amplitude}, ${35 + offset} ${waterY}
        T ${70 + offset} ${waterY}
        T ${120 + offset} ${waterY}
        L 120 70
        L -20 70
        Z
      `;
      wavePathRef.current.setAttribute("d", d);
      setPercent(Math.round(p));
    };

    // Animate wave crest drifting horizontally
    const waveTween = gsap.to(waveOffset, {
      value: 30,
      duration: 1.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      onUpdate: updateWave,
    });

    // Rise water from 0 to 90% while assets load
    const riseTween = gsap.to(progressObj, {
      value: 85,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: updateWave,
    });

    // When assets finish, smoothly complete from 85 -> 100%
    const finalizeLoading = () => {
      const elapsed = Date.now() - startTimestamp;
      const remainingTime = Math.max(0, minDelay - elapsed);

      setTimeout(() => {
        gsap.to(progressObj, {
          value: 100,
          duration: 0.5,
          ease: "power3.out",
          onUpdate: updateWave,
          onComplete: () => {
            // MOMENT 1 Climax: Fish scales up smoothly, filling the screen with ocean blue
            waveTween.kill();

            const tl = gsap.timeline({
              onComplete: () => {
                sessionStorage.setItem("an_preloader_seen", "1");
                window.dispatchEvent(new CustomEvent("an_preloader_done"));
                setVisible(false);
              },
            });

            tl.to(fishContainerRef.current, {
              scale: 22,
              duration: 0.85,
              ease: "expo.inOut",
            });

            tl.to(
              containerRef.current,
              {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
              },
              "-=0.35"
            );
          },
        });
      }, remainingTime);
    };

    Promise.race([
      fontsReady,
      new Promise((res) => setTimeout(res, maxDelay)),
    ]).then(finalizeLoading);

    return () => {
      waveTween.kill();
      riseTween.kill();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05080C] select-none pointer-events-auto"
    >
      {/* Centred Fish Container */}
      <div ref={fishContainerRef} className="relative w-40 h-24 sm:w-48 sm:h-28 will-change-transform">
        <svg
          viewBox="0 0 100 60"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Fish Silhouette Clip Path */}
            <clipPath id="preloader-fish-clip">
              <path d="M 5 30 C 25 10, 60 10, 85 30 C 60 50, 25 50, 5 30 Z M 85 30 L 98 15 L 94 30 L 98 45 Z" />
            </clipPath>

            {/* Ocean Liquid Gradient */}
            <linearGradient id="water-fill-gradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#063A63" />
              <stop offset="60%" stopColor="#0A9AD9" />
              <stop offset="100%" stopColor="#6EC6F0" />
            </linearGradient>
          </defs>

          {/* 1. Water liquid rising inside the fish clip */}
          <g clipPath="url(#preloader-fish-clip)">
            <g ref={waterGroupRef}>
              <path
                ref={wavePathRef}
                fill="url(#water-fill-gradient)"
                d="M -20 60 L 120 60 L 120 70 L -20 70 Z"
              />
            </g>
          </g>

          {/* 2. Crisp White 1.5px Fish Outline */}
          <path
            d="M 5 30 C 25 10, 60 10, 85 30 C 60 50, 25 50, 5 30 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 85 30 L 98 15 L 94 30 L 98 45 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* 3. Fish Eye */}
          <circle cx="25" cy="27" r="3" fill="#FFFFFF" />
          <circle cx="26" cy="26" r="1.2" fill="#05080C" />
        </svg>
      </div>

      {/* Counter & Technical Telemetry */}
      <div className="mt-8 text-center space-y-1">
        <div className="font-mono text-xs tracking-[0.08em] text-[#6EC6F0] uppercase font-bold">
          {percent < 100 ? `SURFACING CATCH • ${percent}%` : "ENTERING THE DEEP • 100%"}
        </div>
        <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
          AN Fish World • Karad
        </div>
      </div>
    </div>
  );
}
