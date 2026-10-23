"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function FishCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [onFormField, setOnFormField] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const fishIconRef = useRef<SVGSVGElement>(null);
  const lastPos = useRef({ x: -100, y: -100 });
  const bubbleIdCounter = useRef(0);

  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  useEffect(() => {
    // 1. Desktop & Fine Pointer Only Guard
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer || reducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const el = cursorRef.current;
    if (!el) return;

    // 2. GSAP quickTo for smooth cursor follower
    const xTo = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      xTo(clientX);
      yTo(clientY);

      // Check form fields: never interfere with native text selection
      const target = e.target as HTMLElement | null;
      if (target && target.closest("input, textarea, select, [contenteditable='true']")) {
        setOnFormField(true);
        return;
      } else {
        setOnFormField(false);
      }

      // Check context label on interactive elements
      if (target) {
        if (target.closest("[data-cursor='order'], button[id*='order'], a[href*='wa.me']")) {
          setCursorLabel("Order");
        } else if (target.closest("[data-cursor='drag'], [role='slider']")) {
          setCursorLabel("Drag");
        } else if (target.closest("button, [role='button']")) {
          setCursorLabel("Open");
        } else if (target.closest("a")) {
          setCursorLabel("View");
        } else {
          setCursorLabel(null);
        }
      }

      // Compute speed and angle of travel
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const speed = Math.hypot(dx, dy);

      // Rotate fish towards heading
      if (speed > 2 && fishIconRef.current) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        gsap.to(fishIconRef.current, {
          rotation: angle,
          duration: 0.2,
          ease: "power2.out",
        });
      }

      // Fast movement (> 22px delta) creates fading bubbles
      if (speed > 22 && Math.random() > 0.45) {
        const newBubble: Bubble = {
          id: ++bubbleIdCounter.current,
          x: clientX,
          y: clientY,
          size: Math.random() * 5 + 3,
        };
        setBubbles((prev) => [...prev.slice(-8), newBubble]);

        // Remove bubble after fade
        setTimeout(() => {
          setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
        }, 650);
      }

      lastPos.current = { x: clientX, y: clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion]);

  if (!enabled || onFormField) return null;

  return (
    <>
      {/* Fading Water Bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-[998] rounded-full border border-[#6EC6F0]/50 bg-[#6EC6F0]/20 animate-ping"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: "translate(-50%, -50%)",
            animationDuration: "600ms",
          }}
        />
      ))}

      {/* Main Fish Follower / Context Circle */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        {cursorLabel ? (
          // Hover State: Glowing Circle with Context Micro-label
          <div className="w-12 h-12 rounded-full bg-[#0A9AD9]/90 text-white border border-[#6EC6F0] flex items-center justify-center font-mono text-[9px] font-bold uppercase tracking-[0.08em] shadow-[0_0_20px_rgba(10,154,217,0.7)] animate-in fade-in zoom-in-75 duration-150">
            {cursorLabel}
          </div>
        ) : (
          // Default State: Agile Fish Silhouette
          <div className="relative w-7 h-5 flex items-center justify-center">
            <svg
              ref={fishIconRef}
              viewBox="0 0 100 60"
              className="w-full h-full fill-[#6EC6F0] filter drop-shadow-[0_0_8px_rgba(110,198,240,0.6)]"
            >
              <path d="M 5 30 C 25 10, 60 10, 85 30 C 60 50, 25 50, 5 30 Z M 85 30 L 98 15 L 94 30 L 98 45 Z" />
              <circle cx="25" cy="27" r="3" fill="#05080C" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
