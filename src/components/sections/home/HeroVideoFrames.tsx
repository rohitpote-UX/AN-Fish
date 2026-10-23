"use client";

import React from "react";
import { Radio } from "lucide-react";

/**
 * 3D Asymmetric Floating Video Frames
 * Sourced from Pixabay fishing / deep-sea catch footage.
 * Top-left: dawn harbour / traditional coastal fishing boat.
 * Bottom-right: ocean fishing catch at marked place.
 */
export function HeroVideoFrames() {
  return (
    <>
      {/* 1. TOP LEFT FRAME (Just below nav, to the left of headline) */}
      <aside
        aria-label="Coastal dawn sourcing video"
        className="hidden lg:block absolute lg:-left-10 xl:-left-20 top-0 lg:top-2 xl:top-4 w-52 lg:w-64 xl:w-72 z-20 pointer-events-auto transition-transform duration-500 hover:scale-105"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          className="relative group p-2.5 sm:p-3 bg-gradient-to-br from-white/95 via-[#EBF8FF]/90 to-[#0A9AD9]/30 backdrop-blur-md transition-all duration-500 animate-float-slow"
          style={{
            borderRadius: "44% 56% 65% 35% / 48% 40% 60% 52%",
            transform: "rotateY(10deg) rotateX(-5deg) rotate(-3.5deg)",
            boxShadow:
              "0 26px 55px -12px rgba(6, 58, 99, 0.32), 0 12px 24px -8px rgba(10, 154, 217, 0.22), inset 0 2px 5px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(10, 154, 217, 0.25)",
          }}
        >
          {/* Inner Video Container with matching asymmetric curve */}
          <div
            className="relative w-full aspect-[4/3] overflow-hidden bg-[#063A63]"
            style={{
              borderRadius: "42% 58% 63% 37% / 46% 38% 62% 54%",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover brightness-[1.02] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
            >
              <source src="/media/hero-fishing-1.mp4" type="video/mp4" />
              <source src="https://cdn.pixabay.com/video/2020/07/12/44534-439384681_large.mp4" type="video/mp4" />
            </video>

            {/* 3D Glass Surface Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 45%, rgba(10,154,217,0.15) 100%)",
              }}
            />

            {/* Telemetry Micro-Badge */}
            <div className="absolute bottom-3 left-4 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9] animate-ping" />
              <Radio className="w-2.5 h-2.5 text-white" />
              <span className="text-[9px] font-mono-accent uppercase tracking-wider text-white font-bold">
                DAWN HARBOUR
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT / BOTTOM-RIGHT FRAME (At marked place in user's image) */}
      <aside
        aria-label="Deep-sea fresh catch video"
        className="hidden lg:block absolute lg:-right-8 xl:-right-16 top-[36%] sm:top-[38%] lg:top-[38%] w-56 lg:w-68 xl:w-76 z-20 pointer-events-auto transition-transform duration-500 hover:scale-105"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          className="relative group p-2.5 sm:p-3 bg-gradient-to-br from-white/95 via-[#EBF8FF]/90 to-[#0A9AD9]/30 backdrop-blur-md transition-all duration-500 animate-float-delayed"
          style={{
            borderRadius: "66% 34% 52% 48% / 40% 60% 40% 60%",
            transform: "rotateY(-12deg) rotateX(6deg) rotate(3deg)",
            boxShadow:
              "0 28px 60px -12px rgba(6, 58, 99, 0.35), 0 14px 28px -8px rgba(10, 154, 217, 0.25), inset 0 2px 5px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(10, 154, 217, 0.25)",
          }}
        >
          {/* Inner Video Container with matching asymmetric curve */}
          <div
            className="relative w-full aspect-[16/11] overflow-hidden bg-[#063A63]"
            style={{
              borderRadius: "63% 37% 50% 50% / 38% 62% 38% 62%",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover brightness-[1.02] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
            >
              <source src="/media/hero-fishing-2.mp4" type="video/mp4" />
              <source src="https://cdn.pixabay.com/video/2025/09/06/302098_medium.mp4" type="video/mp4" />
              <source src="https://cdn.pixabay.com/video/2025/09/06/302098_large.mp4" type="video/mp4" />
            </video>

            {/* 3D Glass Surface Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 45%, rgba(10,154,217,0.15) 100%)",
              }}
            />

            {/* Telemetry Micro-Badge */}
            <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6EC6F0] animate-pulse" />
              <span className="text-[9px] font-mono-accent uppercase tracking-wider text-white font-bold">
                FRESH CATCH • 100%
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default HeroVideoFrames;
