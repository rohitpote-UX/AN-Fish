"use client";

import React, { createContext, useContext } from "react";
import { useBasketStore } from "@/store/basket";
import { OrderDrawer } from "@/components/ui/OrderDrawer";

const BasketContext = createContext<ReturnType<typeof useBasketStore> | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <OrderDrawer />
    </>
  );
}

export function useBasket() {
  const store = useBasketStore();
  return store;
}
