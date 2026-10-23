import { create } from "zustand";

interface HudAnchorState {
  screenX: number;
  screenY: number;
  visible: boolean;
  scale: number;
  isDragging: boolean;
  isHoveringFish: boolean;
  setAnchor: (screenX: number, screenY: number, visible: boolean, scale?: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsHoveringFish: (isHoveringFish: boolean) => void;
}

export const useHudStore = create<HudAnchorState>((set) => ({
  screenX: 0,
  screenY: 0,
  visible: false,
  scale: 1,
  isDragging: false,
  isHoveringFish: false,
  setAnchor: (screenX, screenY, visible, scale = 1) => set({ screenX, screenY, visible, scale }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setIsHoveringFish: (isHoveringFish) => set({ isHoveringFish }),
}));
