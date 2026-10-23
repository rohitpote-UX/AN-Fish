"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  radius?: number; // Detection radius in px, default 80
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  radius = 80,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  useEffect(() => {
    // 1. Guard against touch devices and reduced-motion preferences
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    if (reducedMotion || isTouch || !containerRef.current) return;

    const el = containerRef.current;

    // 2. Initialise GSAP quickTo tweens for fluid 60/120fps magnetic drag
    const xTo = gsap.quickTo(el, "x", {
      duration: 0.7,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.7,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Within magnetic radius (default 80px)
      if (dist < radius) {
        // Proportional pull toward cursor
        const pull = 0.4;
        xTo(dx * pull);
        yTo(dy * pull);
      } else {
        // Outside 80px radius, snap back to rest
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      xTo(0);
      yTo(0);
    };
  }, [reducedMotion, radius]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-block will-change-transform ${
        onClick ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0A9AD9]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
