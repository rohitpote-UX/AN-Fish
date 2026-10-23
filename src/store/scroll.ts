import { create } from "zustand";
import { DepthZone } from "@/types";

interface ScrollState {
  progress: number; // 0.0 to 1.0
  depth: number; // 0m to 120m
  zone: DepthZone;
  temperature: number; // Celsius
  pressure: number; // ATM
  soundEnabled: boolean;
  reducedMotion: boolean;
  isMenuOpen: boolean;

  setProgress: (progress: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleSound: () => void;
  setMenuOpen: (open: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  depth: 0,
  zone: "surface",
  temperature: 24.5,
  pressure: 1.0,
  soundEnabled: false,
  reducedMotion: false,
  isMenuOpen: false,

  setMenuOpen: (open: boolean) => set({ isMenuOpen: open }),

  setProgress: (prog: number) => {
    const clampedProgress = Math.max(0, Math.min(1, prog));
    const depthMeters = Math.round(clampedProgress * 115);

    let zone: DepthZone = "surface";
    let temp = 24.5;
    const atm = 1.0 + depthMeters * 0.1;

    if (depthMeters < 15) {
      zone = "surface";
      temp = 24.5 - depthMeters * 0.3;
    } else if (depthMeters < 45) {
      zone = "shallows";
      temp = 20.0 - (depthMeters - 15) * 0.25;
    } else if (depthMeters < 75) {
      zone = "twilight";
      temp = 12.5 - (depthMeters - 45) * 0.2;
    } else if (depthMeters < 95) {
      zone = "abyss";
      temp = 6.5 - (depthMeters - 75) * 0.2;
    } else {
      zone = "vault";
      temp = 0.5; // 0°C Liquid Ice Vault
    }

    set({
      progress: clampedProgress,
      depth: depthMeters,
      zone,
      temperature: Number(temp.toFixed(1)),
      pressure: Number(atm.toFixed(1)),
    });
  },

  setReducedMotion: (reduced: boolean) => set({ reducedMotion: reduced }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
