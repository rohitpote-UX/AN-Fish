"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const setProgress = useScrollStore((state) => state.setProgress);
  const setReducedMotion = useScrollStore((state) => state.setReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    if (mediaQuery.matches) {
      const handleNativeScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const prog = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        setProgress(prog);
      };
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      return () => {
        mediaQuery.removeEventListener("change", handleMediaChange);
        window.removeEventListener("scroll", handleNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      setProgress(e.progress);
    });

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setProgress, setReducedMotion]);

  return <>{children}</>;
}
