"use client";

import { useScrollStore } from "@/store/scroll";

/**
 * useDepth() hook
 * Exposes real-time oceanic depth, zone, progress, and telemetry.
 */
export function useDepth() {
  const depth = useScrollStore((state) => state.depth);
  const zone = useScrollStore((state) => state.zone);
  const temperature = useScrollStore((state) => state.temperature);
  const pressure = useScrollStore((state) => state.pressure);
  const progress = useScrollStore((state) => state.progress);

  return {
    zone,
    progress,
    depthMeters: depth,
    depth,
    temperature,
    pressure,
  };
}
