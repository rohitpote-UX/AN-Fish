"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGpuTier } from "@/hooks/useGpuTier";
import { FallbackPoster } from "./FallbackPoster";

// Lazy-load WorldCanvas dynamically after first paint (budget requirement)
const WorldCanvas = dynamic(() => import("./WorldCanvas"), {
  ssr: false,
});

/**
 * Persistent Canvas Mount Wrapper
 * Mounted once in [locale]/layout.tsx behind all content (z-index 0, pointer-events none).
 * Uses useGpuTier() to route tier 0/1 or reduced-motion to FallbackPoster.
 */
export function CanvasWrapper() {
  const { isFallback, isEvaluating, isMobile, reducedMotion } = useGpuTier();
  const [hasFirstPainted, setHasFirstPainted] = useState(false);

  // Guarantee loaded strictly after first paint
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setHasFirstPainted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // 1. Accessibility & Low-spec Hardware: prefers-reduced-motion or Tier 0/1
  if (reducedMotion || (!isEvaluating && isFallback)) {
    return <FallbackPoster />;
  }

  // 2. Before first paint or while evaluating GPU
  if (!hasFirstPainted || isEvaluating) {
    return <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0" />;
  }

  // 3. Awwwards-Calibre Persistent WebGL World Canvas
  return <WorldCanvas />;
}
