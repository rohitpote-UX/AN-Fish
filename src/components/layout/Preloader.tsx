"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Compass, Waves, Sparkles, Anchor, Fish, ArrowRight } from "lucide-react";

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // 1. Check for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Play only on first load in this session
    const hasSeenIntro =
      typeof window !== "undefined" &&
      sessionStorage.getItem("an_fish_first_intro_seen");

    if (prefersReducedMotion || hasSeenIntro) {
      return;
    }

    // Activate the preloader
    setVisible(true);

    // Lock body scrolling during the 3-second entrance
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Smooth non-linear progress counter spanning 2400ms (0 -> 100%)
    const startTime = performance.now();
    const duration = 2400; // 2.4s count up, 0.6s cinematic curtain reveal = 3.0s total

    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);

      // Smooth custom ease-out curve (fast initial rise, decelerates gracefully to 100%)
      const easedT = 1 - Math.pow(1 - t, 2.6);
      const currentVal = Math.min(100, Math.floor(easedT * 100));

      setProgress(currentVal);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);

        // At 2400ms, start the 600ms Awwwards curtain exit animation
        setTimeout(() => {
          setIsExiting(true);

          // Complete at 3000ms
          setTimeout(() => {
            document.body.style.overflow = originalOverflow;
            sessionStorage.setItem("an_fish_first_intro_seen", "true");
            setVisible(false);
          }, 600);
        }, 120);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      document.body.style.overflow = "";
      sessionStorage.setItem("an_fish_first_intro_seen", "true");
      setVisible(false);
    }, 400);
  };

  if (!mounted || !visible) return null;

  // Dynamic status text across the 3-second journey
  const getStageInfo = (p: number) => {
    if (p < 30) {
      return {
        step: "०१",
        label: "अरबी समुद्र • रत्नागिरी व मालवण बंदरे",
        sub: "Dawn 4:00 AM harbour catch selected from deep waters",
      };
    }
    if (p < 65) {
      return {
        step: "०२",
        label: "०°C नैसर्गिक गारवा • १००% फॉर्मेलिनमुक्त",
        sub: "Pure crushed ice slurry preservation with zero chemicals",
      };
    }
    if (p < 95) {
      return {
        step: "०३",
        label: "कराड मुख्य केंद्र • २५+ दालनांचे नेटवर्क",
        sub: "Connecting Maharashtra's largest seafood franchise hub",
      };
    }
    return {
      step: "०४",
      label: "कराडची लाडकी मासोळी • स्वागत आहे",
      sub: "Welcome to AN Fish World — Enjoy Pure Ocean Freshness",
    };
  };

  const stage = getStageInfo(progress);

  return (
    <aside
      aria-label="AN Fish World Loading Experience"
      className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-[#040D17] text-white select-none pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] will-change-transform ${
        isExiting ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* AMBIENT LIGHT FLARES & NOISE TEXTURE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Cyan Ambient Glow Top-Left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0A9AD9]/20 blur-[120px] animate-pulse" />
        {/* Soft Warm Gold Ambient Glow Center-Right */}
        <div
          className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] -translate-y-1/2 rounded-full bg-[#FBBF24]/12 blur-[140px]"
          style={{ animationDuration: "3s" }}
        />
        {/* Deep Ocean Bottom Glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 rounded-full bg-[#0284C7]/20 blur-[130px]" />
      </div>

      {/* TOP BAR: Telemetry & Skip Button */}
      <header className="relative z-20 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between text-xs tracking-widest text-white/60 font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white/80 font-bold uppercase tracking-wider hidden xs:inline">
            17.2894° N, 74.1818° E // KARAD, MH
          </span>
          <span className="text-[#38BDF8] xs:hidden">AN FISH WORLD</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-white/50 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-[#FBBF24] animate-spin" style={{ animationDuration: "8s" }} />
            <span>0°C FRESH CHAIN</span>
          </span>

          {/* Quick Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-[11px] font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md active:scale-95"
            aria-label="Skip Intro"
          >
            <span>पुढे जा</span>
            <ArrowRight className="w-3 h-3 text-[#FBBF24]" />
          </button>
        </div>
      </header>

      {/* CENTERPIECE: Awwwards-Style Animated Circular Compass & Leaping Fish Orbit */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto px-4 text-center">
        {/* Animated Orbital Compass Ring */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center mb-8">
          {/* Sonar Expanding Waves */}
          <div
            className="absolute inset-0 rounded-full border border-[#38BDF8]/20 animate-ping pointer-events-none"
            style={{ animationDuration: "2.2s" }}
          />
          <div
            className="absolute -inset-4 rounded-full border border-[#FBBF24]/15 animate-pulse pointer-events-none"
            style={{ animationDuration: "1.8s" }}
          />

          {/* Outer Dashed Rotating Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#38BDF8]/40 animate-spin"
            style={{ animationDuration: "12s" }}
          />

          {/* Inner Glowing Dial Ring */}
          <div className="absolute inset-3 sm:inset-4 rounded-full border border-[#FBBF24]/50 shadow-[0_0_30px_rgba(251,191,36,0.25)] flex items-center justify-center bg-gradient-to-b from-[#0A2637]/80 to-[#04101A]/90 backdrop-blur-md">
            
            {/* Center Fish Emblem with Dynamic Radiant Glow */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#D97706] via-[#FBBF24] to-[#F59E0B] p-0.5 shadow-[0_0_30px_rgba(251,191,36,0.8)] border border-white/60 flex items-center justify-center">
                <Fish className="w-7 h-7 sm:w-8 sm:h-8 text-[#071A24] fill-current animate-bounce" style={{ animationDuration: "1.5s" }} />
              </div>

              {/* Glowing Pulse Dot */}
              <span className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-[#38BDF8] ring-4 ring-[#38BDF8]/40 animate-pulse" />
            </div>

            {/* Orbiting Satellite Dot (Simulates Satellite Tracking of Fresh Vessels) */}
            <div
              className="absolute inset-0 animate-spin pointer-events-none"
              style={{ animationDuration: "3s", animationTimingFunction: "linear" }}
            >
              <div className="w-3 h-3 rounded-full bg-[#FBBF24] shadow-[0_0_12px_#FBBF24] -translate-x-1.5 -translate-y-1.5" />
            </div>
          </div>
        </div>

        {/* Brand Name with Golden Typography */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A2637] border border-[#FBBF24]/40 shadow-lg text-[11px] sm:text-xs font-bold font-marathi-display text-[#FBBF24]">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] fill-current animate-pulse" />
            <span>ए एन फिश वर्ल्ड • AN FISH WORLD</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-marathi-display tracking-tight text-white drop-shadow-md">
            कराडची लाडकी मासोळी...
          </h1>

          <p className="text-sm sm:text-base font-bold font-marathi-body text-[#38BDF8] tracking-wide">
            समुद्राची खरी चव..! — एकदा खाल की पुन्हा पुन्हा मागाल.
          </p>
        </div>

        {/* Dynamic Storytelling Stage Subtitle */}
        <div className="mt-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-white/90 font-marathi-body transition-all duration-300">
            <span className="font-mono text-[#FBBF24] font-bold">{stage.step}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="font-semibold text-white">{stage.label}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-white/50 font-mono mt-1 transition-all duration-300">
            {stage.sub}
          </p>
        </div>
      </main>

      {/* BOTTOM BAR: Monumental Numeric Counter & 2px Glowing Progress Track */}
      <footer className="relative z-20 w-full px-6 sm:px-12 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Percent & Live Status Info */}
          <div className="flex items-end justify-between mb-3 font-mono">
            <div>
              <span className="text-[10px] text-white/50 uppercase tracking-widest block">
                CARGO HARBOUR STATUS
              </span>
              <span className="text-xs sm:text-sm text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{progress < 100 ? "0°C FRESH COLD-CHAIN LOCK" : "ALL SYSTEMS READY"}</span>
              </span>
            </div>

            {/* Monumental Counter */}
            <div className="text-right">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#6EC6F0] to-[#FBBF24]">
                {String(progress).padStart(2, "0")}
                <span className="text-xl sm:text-2xl font-bold text-[#FBBF24] ml-1">%</span>
              </span>
            </div>
          </div>

          {/* 2px Awwwards Razor Progress Track */}
          <div className="relative w-full h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#FBBF24] transition-all duration-75 ease-out shadow-[0_0_20px_rgba(56,189,248,0.9)] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing leading spark */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#FFFFFF] ring-2 ring-[#FBBF24]" />
            </div>
          </div>

          {/* Footer Sub-telemetry */}
          <div className="flex items-center justify-between text-[10px] text-white/40 font-mono mt-2.5">
            <span>RATNAGIRI • MALVAN • KARAD HQ</span>
            <span>25+ FRANCHISE OUTLETS</span>
          </div>
        </div>
      </footer>

      {/* Bottom Trailing Cyan Accent Border on Curtain Lift */}
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#FBBF24] shadow-[0_0_20px_rgba(56,189,248,1)] pointer-events-none" />
    </aside>
  );
}
