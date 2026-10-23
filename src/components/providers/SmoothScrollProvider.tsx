"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const setProgress = useScrollStore((state) => state.setProgress);
  const setReducedMotion = useScrollStore((state) => state.setReducedMotion);

  useEffect(() => {
    // 1. Accessibility: prefers-reduced-motion detection
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = motionQuery.matches;
    setReducedMotion(prefersReduced);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // 2. Touch detection: keep native scroll on mobile devices for natural inertia
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    // If reduced-motion or touch device: bypass Lenis, keep native scroll
    if (prefersReduced || isTouch) {
      const handleNativeScroll = () => {
        const doc = document.documentElement;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        setProgress(progress);
      };

      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      handleNativeScroll();

      return () => {
        motionQuery.removeEventListener("change", handleMotionChange);
        window.removeEventListener("scroll", handleNativeScroll);
      };
    }

    // 3. Desktop smooth scroll via Lenis
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    // 4. Synchronize Lenis with GSAP ScrollTrigger & Scroll Store
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
      motionQuery.removeEventListener("change", handleMotionChange);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setProgress, setReducedMotion]);

  return <>{children}</>;
}
