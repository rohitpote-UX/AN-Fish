"use client";

import React from "react";
import { useScrollStore } from "@/store/scroll";

export function DepthMeter() {
  const progress = useScrollStore((state) => state.progress);
  const depth = Math.round(progress * 200); // 0m to 200m scale

  // Generate tick marks (0m, 25m, 50m, 75m, 100m, 125m, 150m, 175m, 200m)
  const ticks = [0, 25, 50, 75, 100, 125, 150, 175, 200];

  return (
    <aside
      aria-label="Vertical Ocean Depth Gauge"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none pointer-events-none"
    >
      {/* Current Depth Digital Readout */}
      <div className="mb-3 px-2 py-1 rounded-full bg-[#02111F]/90 border border-white/10 backdrop-blur-md shadow-lg text-center">
        <span className="font-mono text-xs font-bold text-[#6EC6F0] tracking-wider block">
          {depth} m
        </span>
      </div>

      {/* Vertical Gauge Track Container */}
      <div className="relative w-8 h-64 flex flex-col items-center justify-between py-1">
        {/* Continuous 1px Vertical Track Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/15" />

        {/* Ticks along the vertical line */}
        {ticks.map((t) => {
          const isMajor = t % 50 === 0;
          return (
            <div
              key={t}
              className="relative z-10 w-full flex items-center justify-center"
            >
              <div
                className={`h-[1px] transition-colors ${
                  isMajor
                    ? "w-4 bg-[#6EC6F0]/80 shadow-[0_0_6px_rgba(110,198,240,0.5)]"
                    : "w-2 bg-white/30"
                }`}
              />
            </div>
          );
        })}

        {/* Moving Fish Marker */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-75 ease-out pointer-events-none"
          style={{ top: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        >
          <div className="relative -translate-y-1/2 -translate-x-1.5 flex items-center gap-1.5">
            {/* Pulsing indicator dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9] shadow-[0_0_8px_rgba(10,154,217,1)]" />

            {/* Small Fish Silhouette Marker */}
            <svg
              viewBox="0 0 100 60"
              className="w-5 h-3.5 fill-[#6EC6F0] filter drop-shadow-[0_0_6px_rgba(110,198,240,0.8)]"
            >
              <path d="M 5 30 C 25 10, 60 10, 85 30 C 60 50, 25 50, 5 30 Z M 85 30 L 98 15 L 94 30 L 98 45 Z" />
              <circle cx="25" cy="27" r="3" fill="#05080C" />
            </svg>
          </div>
        </div>
      </div>

      {/* Range Endpoints */}
      <div className="mt-2 text-[10px] font-mono text-white/30 tracking-widest uppercase">
        200M DEEP
      </div>
    </aside>
  );
}
