import { create } from "zustand";
import { FishItem } from "@/data/fishCatalog";

export type DepthZone = "surface" | "shallows" | "twilight" | "abyss" | "vault";

export interface CartItem {
  fish: FishItem;
  weight: "500g" | "1kg" | "2kg";
  cut: string;
  quantity: number;
}

interface DepthState {
  depth: number;
  maxDepth: number;
  currentZone: DepthZone;
  temperature: number; // Celsius
  pressure: number; // ATM
  reducedMotion: boolean;
  soundEnabled: boolean;
  isOrderDrawerOpen: boolean;
  selectedFishForOrder: FishItem | null;
  cart: CartItem[];

  // Actions
  setDepth: (depth: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleSound: () => void;
  openOrderDrawer: (fish?: FishItem) => void;
  closeOrderDrawer: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (fishId: string, cut: string) => void;
  clearCart: () => void;
}

export const useDepthStore = create<DepthState>((set, get) => ({
  depth: 0,
  maxDepth: 120,
  currentZone: "surface",
  temperature: 24.5,
  pressure: 1.0,
  reducedMotion: false,
  soundEnabled: false,
  isOrderDrawerOpen: false,
  selectedFishForOrder: null,
  cart: [],

  setDepth: (depth: number) => {
    const clamped = Math.max(0, Math.min(120, Math.round(depth)));
    let zone: DepthZone = "surface";
    let temp = 24.5;
    let atm = 1.0 + clamped * 0.1;

    if (clamped < 15) {
      zone = "surface";
      temp = 24.5 - clamped * 0.3;
    } else if (clamped < 45) {
      zone = "shallows";
      temp = 20.0 - (clamped - 15) * 0.25;
    } else if (clamped < 75) {
      zone = "twilight";
      temp = 12.5 - (clamped - 45) * 0.2;
    } else if (clamped < 95) {
      zone = "abyss";
      temp = 6.5 - (clamped - 75) * 0.2;
    } else {
      zone = "vault";
      temp = 0.5; // 0°C Liquid Ice Vault
    }

    set({
      depth: clamped,
      currentZone: zone,
      temperature: Number(temp.toFixed(1)),
      pressure: Number(atm.toFixed(1)),
    });
  },

  setReducedMotion: (reduced: boolean) => set({ reducedMotion: reduced }),

  toggleSound: () => {
    const current = get().soundEnabled;
    set({ soundEnabled: !current });
  },

  openOrderDrawer: (fish?: FishItem) => {
    set({
      isOrderDrawerOpen: true,
      selectedFishForOrder: fish || null,
    });
  },

  closeOrderDrawer: () => {
    set({ isOrderDrawerOpen: false, selectedFishForOrder: null });
  },

  addToCart: (newItem: CartItem) => {
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (c) => c.fish.id === newItem.fish.id && c.cut === newItem.cut && c.weight === newItem.weight
      );
      if (existingIndex > -1) {
        const updated = [...state.cart];
        updated[existingIndex].quantity += newItem.quantity;
        return { cart: updated, isOrderDrawerOpen: true };
      }
      return { cart: [...state.cart, newItem], isOrderDrawerOpen: true };
    });
  },

  removeFromCart: (fishId: string, cut: string) => {
    set((state) => ({
      cart: state.cart.filter((i) => !(i.fish.id === fishId && i.cut === cut)),
    }));
  },

  clearCart: () => set({ cart: [] }),
}));
