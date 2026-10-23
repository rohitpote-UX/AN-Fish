import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BasketItem, Species, CleaningOption } from "@/types";

interface BasketState {
  items: BasketItem[];
  isOpen: boolean;
  activeSpecies: Species | null;
  selectedBranch: string;

  openDrawer: (species?: Species) => void;
  closeDrawer: () => void;
  addItem: (item: BasketItem) => void;
  updateQuantity: (
    slug: string,
    weight: string,
    cleaningOption: CleaningOption | undefined,
    delta: number
  ) => void;
  removeItem: (
    slug: string,
    weight: string,
    cleaningOption?: CleaningOption
  ) => void;
  clearBasket: () => void;
  setSelectedBranch: (branch: string) => void;
  getItemCount: () => number;
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      activeSpecies: null,
      selectedBranch: "कराड मध्यवर्ती (भाजी मंडई रोड)",

      openDrawer: (species?: Species) => {
        set({ isOpen: true, activeSpecies: species ?? null });
      },

      closeDrawer: () => {
        set({ isOpen: false, activeSpecies: null });
      },

      addItem: (newItem: BasketItem) => {
        set((state) => {
          const index = state.items.findIndex(
            (i) =>
              i.species.slug === newItem.species.slug &&
              i.weight === newItem.weight &&
              i.cleaningOption === newItem.cleaningOption
          );

          if (index > -1) {
            const updated = [...state.items];
            updated[index].quantity += newItem.quantity;
            return { items: updated, isOpen: true, activeSpecies: null };
          }

          return {
            items: [...state.items, newItem],
            isOpen: true,
            activeSpecies: null,
          };
        });
      },

      updateQuantity: (
        slug: string,
        weight: string,
        cleaningOption: CleaningOption | undefined,
        delta: number
      ) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (
                item.species.slug === slug &&
                item.weight === weight &&
                (cleaningOption !== undefined ? item.cleaningOption === cleaningOption : true)
              ) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is BasketItem => item !== null);

          return { items: updated };
        });
      },

      removeItem: (
        slug: string,
        weight: string,
        cleaningOption?: CleaningOption
      ) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.species.slug === slug &&
                i.weight === weight &&
                (cleaningOption !== undefined ? i.cleaningOption === cleaningOption : true)
              )
          ),
        }));
      },

      clearBasket: () => set({ items: [] }),

      setSelectedBranch: (branch: string) => set({ selectedBranch: branch }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "an_fish_basket_v1",
      partialize: (state) => ({
        items: state.items,
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);
