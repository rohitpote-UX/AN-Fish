"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoothScroll } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SmoothScrollProps {
  children: React.ReactNode;
  lerp?: number;
  disableOnTouch?: boolean;
}

export function SmoothScroll({
  children,
  lerp = smoothScroll.lerp,
  disableOnTouch = true,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Accessibility check: prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    // 2. Touch detection
    const isTouch =
      disableOnTouch &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    if (isTouch) return;

    // 3. Desktop Lenis initialization with Alethia lerp inertia
    const lenis = new Lenis({
      lerp,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    // 4. Synchronize with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lerp, disableOnTouch]);

  return <>{children}</>;
}
