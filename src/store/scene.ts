import { create } from "zustand";
import { useScrollStore } from "./scroll";
import { DepthZone } from "@/types";

export type FocusMode = "hero" | "catch" | "journey" | "calm";

interface SceneState {
  schoolSplit: number; // 0.0 to 1.0 (logo fish splits into the school)
  focusMode: FocusMode;
  tintOverride: string | null; // e.g. calmer deep tint for sub-pages
  fishCountFactor: number; // 1.0 = default, 0.35 = calm/sub-pages

  setSchoolSplit: (split: number) => void;
  setFocusMode: (mode: FocusMode) => void;
  setTintOverride: (tint: string | null) => void;
  setFishCountFactor: (factor: number) => void;
  resetScene: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  schoolSplit: 0,
  focusMode: "hero",
  tintOverride: null,
  fishCountFactor: 1.0,

  setSchoolSplit: (split) => set({ schoolSplit: Math.max(0, Math.min(1, split)) }),
  setFocusMode: (mode) => {
    if (mode === "calm") {
      set({ focusMode: mode, fishCountFactor: 0.35, tintOverride: "#041B2D" });
    } else {
      set({ focusMode: mode, fishCountFactor: 1.0, tintOverride: null });
    }
  },
  setTintOverride: (tint) => set({ tintOverride: tint }),
  setFishCountFactor: (factor) => set({ fishCountFactor: factor }),
  resetScene: () => set({ schoolSplit: 0, focusMode: "hero", tintOverride: null, fishCountFactor: 1.0 }),
}));

/**
 * useDepth() hook exposed for all page sections and components
 * returns: { zone, progress, depthMeters }
 */
export function useDepth(): {
  zone: DepthZone;
  progress: number;
  depthMeters: number;
} {
  const progress = useScrollStore((state) => state.progress);
  const zone = useScrollStore((state) => state.zone);
  const depthMeters = useScrollStore((state) => state.depth);

  return {
    zone,
    progress,
    depthMeters,
  };
}
