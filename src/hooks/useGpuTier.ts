"use client";

import { useEffect, useState } from "react";
import { getGPUTier, TierResult } from "detect-gpu";
import { useScrollStore } from "@/store/scroll";

export function useGpuTier() {
  const [tierResult, setTierResult] = useState<TierResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(true);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  useEffect(() => {
    let active = true;

    async function evaluate() {
      try {
        const result = await getGPUTier();
        if (active) {
          setTierResult(result);
          setIsEvaluating(false);
        }
      } catch {
        if (active) {
          setTierResult({ tier: 2, isMobile: false, type: "FALLBACK" });
          setIsEvaluating(false);
        }
      }
    }

    evaluate();

    return () => {
      active = false;
    };
  }, []);

  const tier = tierResult?.tier ?? 2;
  const isMobile = tierResult?.isMobile ?? false;
  // Tier 0 or 1, or reduced-motion → render FallbackPoster
  const isFallback = reducedMotion || (!isEvaluating && tier <= 1);
  const canRender3D = !isFallback;
  const loading = isEvaluating;

  return {
    tier,
    isMobile,
    isEvaluating,
    isFallback,
    canRender3D,
    loading,
    reducedMotion,
  };
}
