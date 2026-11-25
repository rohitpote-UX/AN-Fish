"use client";

import { useSyncExternalStore } from "react";

const EVT = "anf-prefs";
const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* storage unavailable: choice just isn't remembered */ }
  window.dispatchEvent(new Event(EVT));
};
const subscribe = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
};

/** Paper width and auto-print choice, remembered per counter device. */
export function usePrintPrefs() {
  const width = useSyncExternalStore<58 | 80>(subscribe, () => (read("anf_paper") === "58" ? 58 : 80), () => 80);
  const auto = useSyncExternalStore(subscribe, () => read("anf_autoprint") === "1", () => false);
  return {
    width,
    auto,
    setWidth: (w: 58 | 80) => write("anf_paper", String(w)),
    setAuto: (a: boolean) => write("anf_autoprint", a ? "1" : "0"),
  };
}
