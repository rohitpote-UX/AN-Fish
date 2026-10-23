"use client";

import React from "react";
import { useScrollStore } from "@/store/scroll";

/**
 * FallbackPoster
 * Rendered when GPU tier is 0/1 or user prefers reduced motion.
 * Uses looping blue caustics shimmer + CSS gradient depth tied to scroll store.
 */
export function FallbackPoster() {
  const progress = useScrollStore((state) => state.progress);

  // Gradient depth background shifting with scroll (Surface -> Shallows -> Open -> Deep -> Return)
  const depthGradient = React.useMemo(() => {
    if (progress < 0.25) {
      // Surface / Shallows
      return "linear-gradient(180deg, #E9F7FF 0%, #6EC6F0 45%, #0A9AD9 100%)";
    } else if (progress < 0.55) {
      // Shallows / Open water
      return "linear-gradient(180deg, #6EC6F0 0%, #0A9AD9 40%, #063A63 100%)";
    } else if (progress < 0.85) {
      // Open water / Deep Abyss
      return "linear-gradient(180deg, #0A9AD9 0%, #063A63 35%, #02111F 100%)";
    } else if (progress < 0.95) {
      // Deep Liquid Ice Vault
      return "linear-gradient(180deg, #063A63 0%, #02111F 50%, #05080C 100%)";
    } else {
      // Return
      return "linear-gradient(180deg, #02111F 0%, #063A63 45%, #E9F7FF 100%)";
    }
  }, [progress]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-all duration-700 ease-out"
      style={{ background: depthGradient }}
    >
      {/* Looping Caustic Water Shimmer Layer */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <filter id="fallback-caustics-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="3" seed="1">
              <animate attributeName="baseFrequency" dur="14s" values="0.02 0.03; 0.025 0.045; 0.02 0.03" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="25" />
          </filter>
          <rect width="100%" height="100%" fill="#6EC6F0" filter="url(#fallback-caustics-filter)" />
        </svg>
      </div>

      {/* Subtle Brand Hero Fish Watermark */}
      <div className="absolute right-[5vw] top-[26vh] w-[55vw] max-w-[440px] aspect-square opacity-25 filter drop-shadow-[0_0_60px_rgba(10,154,217,0.4)]">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M85 50C70 30 45 25 15 35C28 45 32 55 15 65C45 75 70 70 85 50Z"
            fill="url(#fallbackBrandGrad)"
          />
          <path d="M18 36C8 22 2 18 1 20C4 35 4 65 1 80C2 82 8 78 18 64Z" fill="#6EC6F0" opacity="0.85" />
          <defs>
            <linearGradient id="fallbackBrandGrad" x1="15" y1="50" x2="85" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#063A63" />
              <stop offset="0.5" stopColor="#0A9AD9" />
              <stop offset="1" stopColor="#6EC6F0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
