"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";
import { HelpCircle, Waves, X } from "lucide-react";

const MR_TEXT = "आमच्या लाडक्या ग्राहकांची लाडकी फिश कंपनी.";
const EN_TEXT = "We're not just selling fish. We're feeding the families who made us their favourite.";

const BUBBLES = [
  { id: 1, size: 76, left: "7%", top: "70%", yMove: -280 },
  { id: 2, size: 44, left: "20%", top: "82%", yMove: -360 },
  { id: 3, size: 92, left: "38%", top: "60%", yMove: -220 },
  { id: 4, size: 58, left: "64%", top: "75%", yMove: -320 },
  { id: 5, size: 38, left: "82%", top: "65%", yMove: -400 },
  { id: 6, size: 68, left: "14%", top: "35%", yMove: -190 },
  { id: 7, size: 50, left: "76%", top: "42%", yMove: -260 },
  { id: 8, size: 84, left: "90%", top: "55%", yMove: -240 },
];

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipBtnRef = useRef<HTMLButtonElement>(null);

  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  // Split exclusively by whitespace to safeguard Devanagari conjuncts (जोडाक्षरे)
  const mrWords = MR_TEXT.split(" ");
  const enWords = EN_TEXT.split(" ");

  // Tooltip outside click & Escape key listener
  useEffect(() => {
    if (!tooltipOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTooltipOpen(false);
        tooltipBtnRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        tooltipBtnRef.current &&
        !tooltipBtnRef.current.contains(e.target as Node)
      ) {
        setTooltipOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipOpen]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // 1. Accessibility: prefers-reduced-motion shows solid text immediately
      if (reducedMotion) {
        gsap.set(".manifesto-word-mr, .manifesto-word-en", {
          color: "#FFFFFF",
          webkitTextStroke: "0px transparent",
          opacity: 1,
        });
        return;
      }

      const mm = gsap.matchMedia();

      // 2. Desktop Mode: Pin for ~1.2 viewport heights with scrub
      mm.add("(min-width: 768px)", () => {
        const desktopTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%", // Pin for ~1.2 viewport heights
            pin: true,
            scrub: 0.6,
          },
        });

        // Parallax bubbles drifting up at different speeds
        bubbleRefs.current.forEach((bubble, idx) => {
          if (!bubble) return;
          const config = BUBBLES[idx];
          desktopTl.to(
            bubble,
            {
              y: config.yMove,
              ease: "none",
            },
            0
          );
        });

        // Background tint tweens to Shallows ocean blue
        if (bgRef.current) {
          desktopTl.to(
            bgRef.current,
            {
              backgroundColor: "#063A63",
              ease: "power2.inOut",
            },
            0
          );
        }

        // Text colour flips --ink -> --white at the midpoint (0.0 to 0.45)
        desktopTl.to(
          ".manifesto-word-mr, .manifesto-word-en",
          {
            webkitTextStrokeColor: "rgba(255, 255, 255, 0.7)",
            duration: 0.4,
            ease: "sine.inOut",
          },
          0
        );

        // Word-by-word fill solid as ScrollTrigger scrubs (stagger by word)
        // Marathi words fill first
        desktopTl.to(
          ".manifesto-word-mr",
          {
            color: "#FFFFFF",
            webkitTextStrokeColor: "#FFFFFF",
            textShadow: "0 0 40px rgba(110, 198, 240, 0.7)",
            stagger: 0.12,
            ease: "power2.out",
          },
          0.1
        );

        // English words fill progressively beneath
        desktopTl.to(
          ".manifesto-word-en",
          {
            color: "#E9F7FF",
            webkitTextStrokeColor: "#E9F7FF",
            stagger: 0.05,
            ease: "power2.out",
          },
          0.4
        );
      });

      // 3. Mobile Mode: Do not pin, reveal on enter instead
      mm.add("(max-width: 767px)", () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        mobileTl
          .to(".manifesto-word-mr", {
            color: "#FFFFFF",
            webkitTextStrokeColor: "#FFFFFF",
            stagger: 0.08,
            duration: 0.6,
            ease: "power2.out",
          })
          .to(
            ".manifesto-word-en",
            {
              color: "#E9F7FF",
              webkitTextStrokeColor: "#E9F7FF",
              stagger: 0.04,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.3"
          );
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      data-section="manifesto"
      aria-label="AN Fish World Manifesto"
      className="relative min-h-screen flex items-center justify-center overflow-hidden z-10 selection:bg-[#0A9AD9]"
    >
      {/* Dynamic Background Tint Layer (Surface -> Shallows Blue) */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#02111F]/60 backdrop-blur-sm transition-colors duration-500 pointer-events-none"
      />

      {/* 6–8 Parallax Floating Bubbles Behind the Text */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {BUBBLES.map((b, idx) => (
          <div
            key={b.id}
            ref={(el) => {
              bubbleRefs.current[idx] = el;
            }}
            className="absolute rounded-full border border-[#6EC6F0]/35 bg-gradient-to-br from-[#6EC6F0]/20 via-[#0A9AD9]/10 to-transparent backdrop-blur-[2px] shadow-[0_0_20px_rgba(110,198,240,0.25)] will-change-transform"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
            }}
          >
            {/* Glossy Bubble Specular Highlight */}
            <span className="absolute top-1.5 left-2 w-3 h-2 rounded-full bg-white/50 blur-[0.6px]" />
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-24 text-center flex flex-col items-center justify-center space-y-10"
      >
        {/* Shallows Telemetry & "WHY 'LAADKI'?" Tooltip Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-4 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-md text-xs font-mono tracking-wider text-[#6EC6F0]">
            <Waves className="w-3.5 h-3.5 text-[#0A9AD9]" />
            <span>ZONE: SHALLOWS (~20 M)</span>
          </div>

          {/* Interactive Tooltip Button */}
          <div className="relative inline-block">
            <button
              ref={tooltipBtnRef}
              type="button"
              onClick={() => setTooltipOpen((prev) => !prev)}
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              aria-expanded={tooltipOpen}
              aria-describedby="laadki-explanation-tooltip"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0A9AD9]/20 hover:bg-[#0A9AD9]/30 border border-[#0A9AD9]/50 text-xs font-mono uppercase tracking-[0.08em] text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#6EC6F0]" />
              <span>WHY &ldquo;LAADKI&rdquo;?</span>
            </button>

            {/* Tooltip Card */}
            {tooltipOpen && (
              <div
                id="laadki-explanation-tooltip"
                ref={tooltipRef}
                role="tooltip"
                className="absolute z-40 bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 sm:w-84 p-4 rounded-2xl bg-[#02111F]/95 border border-[#6EC6F0]/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(2,17,31,0.9)] text-left text-xs font-sans text-white/95 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                  <span className="font-mono text-xs font-bold text-[#6EC6F0] tracking-wider uppercase">
                    लाडकी (Laad-ki) • Cultural Heartbeat
                  </span>
                  <button
                    type="button"
                    onClick={() => setTooltipOpen(false)}
                    aria-label="Close tooltip"
                    className="text-white/50 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="leading-relaxed text-[#E9F7FF]/90">
                  Marathi for <strong className="text-white">&ldquo;deeply cherished, beloved, pampered like family.&rdquo;</strong> In Karad, families don&apos;t just buy fish from us—we select each day&apos;s harbour harvest with the love and strict standards reserved for our own dining table.
                </p>
                {/* Arrow pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#02111F]/95" />
              </div>
            )}
          </div>
        </div>

        {/* Oversized Statement (Marathi First, English Beneath) */}
        <blockquote className="space-y-8 select-none">
          {/* Marathi Headline (Oversized, Word Outline -> Solid Fill Scrub) */}
          <p
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.6rem] font-black font-marathi-display tracking-tight leading-[1.25] text-center"
            style={{ wordBreak: "keep-all" }}
          >
            {mrWords.map((word, idx) => (
              <span
                key={idx}
                className="manifesto-word-mr inline-block mr-[0.28em] mb-[0.1em] will-change-transform"
                style={{
                  color: reducedMotion ? "#FFFFFF" : "transparent",
                  WebkitTextStroke: reducedMotion
                    ? "0px transparent"
                    : "1.5px rgba(5, 8, 12, 0.65)",
                }}
              >
                {word}
              </span>
            ))}
          </p>

          {/* English Statement Beneath */}
          <p
            className="text-lg sm:text-2xl md:text-3xl font-medium font-sans text-center max-w-4xl mx-auto leading-relaxed tracking-normal"
            style={{ wordBreak: "keep-all" }}
          >
            {enWords.map((word, idx) => (
              <span
                key={idx}
                className="manifesto-word-en inline-block mr-[0.24em] mb-[0.08em] will-change-transform"
                style={{
                  color: reducedMotion ? "#E9F7FF" : "transparent",
                  WebkitTextStroke: reducedMotion
                    ? "0px transparent"
                    : "1.2px rgba(5, 8, 12, 0.5)",
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </blockquote>

        {/* Shallows Bottom Seal */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-mono text-[#6EC6F0]/70 tracking-widest uppercase">
          <span>// ०°C अखंड शीतसाखळी</span>
          <span>•</span>
          <span>रत्नागिरी आणि मालवण लिलाव</span>
          <span>•</span>
          <span>कराडची परंपरा</span>
        </div>
      </div>
    </section>
  );
}
