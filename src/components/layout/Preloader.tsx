"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const SEEN_KEY = "an_fish_first_intro_seen";
const LOAD_MS = 1500; // progress ring fills
const HOLD_MS = 150; // brief pause at 100%
const EXIT_MS = 650; // curtain lift

// Ring geometry
const SIZE = 168;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Brand splash: shown once per session. Logo in a circle with a thin progress ring,
 * wordmark + tagline, then a smooth upward curtain. Skipped for reduced-motion users.
 */
export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  const finish = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => {
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SEEN_KEY, "true");
      } catch {
        /* storage unavailable: splash may show again, harmless */
      }
      setVisible(false);
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY);
    } catch {
      /* ignore */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    let holdTimer = 0;
    const tick = (now: number) => {
      setVisible(true);
      const t = Math.min(1, (now - start) / LOAD_MS);
      // ease-in-out
      setProgress(t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      if (t < 1) raf = requestAnimationFrame(tick);
      else holdTimer = window.setTimeout(finish, HOLD_MS);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [finish]);

  if (!visible) return null;

  return (
    <aside
      aria-label="AN Fish World"
      role="status"
      onClick={finish}
      className={`fixed inset-0 z-[9999] flex select-none flex-col items-center justify-center overflow-hidden bg-[#071A24] text-white transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      {/* quiet background: soft central light + subtle vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_42%,rgba(10,154,217,0.22)_0%,rgba(7,26,36,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45)_100%)]"
      />

      <div className="relative flex flex-col items-center">
        {/* Logo with progress ring */}
        <div
          className="relative grid place-items-center animate-[splash-in_700ms_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ width: SIZE, height: SIZE }}
        >
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="absolute inset-0 -rotate-90"
            aria-hidden="true"
          >
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={STROKE} />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#splash-ring)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
            />
            <defs>
              <linearGradient id="splash-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid size-[132px] place-items-center overflow-hidden rounded-full bg-white shadow-[0_18px_50px_-12px_rgba(10,154,217,0.55)]">
            <Image
              src="/brand/an-fish-logo-badge.webp"
              alt="AN Fish World"
              width={132}
              height={132}
              priority
              className="size-full object-contain p-1"
            />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="mt-9 animate-[splash-in_700ms_cubic-bezier(0.22,1,0.36,1)_150ms_both] text-center font-latin-display text-[1.65rem] font-extrabold text-white sm:text-3xl" style={{ letterSpacing: "0.26em" }}>
          AN FISH WORLD
        </h1>

        {/* divider */}
        <span
          aria-hidden="true"
          className="mt-4 h-px w-16 animate-[splash-in_700ms_cubic-bezier(0.22,1,0.36,1)_300ms_both] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent"
        />

        {/* Tagline (Marathi-first) */}
        <p className="mt-4 animate-[splash-in_700ms_cubic-bezier(0.22,1,0.36,1)_380ms_both] text-center font-marathi-display text-base font-semibold text-[#7DD3FC] sm:text-lg">
          कराडची लाडकी मासोळी
        </p>
      </div>

      <style>{`
        @keyframes splash-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </aside>
  );
}
