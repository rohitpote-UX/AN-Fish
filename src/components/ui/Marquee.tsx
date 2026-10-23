"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  items?: string[];
  children?: React.ReactNode;
  speed?: number; // Duration in seconds (or custom override)
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  items,
  children,
  speed = 35,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      aria-label="Continuous Ticker Marquee"
      className={cn(
        "group relative w-full overflow-hidden select-none py-4 border-y border-[#0F1F10]/08 bg-[#F5F4F2]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center gap-8 animate-marquee-loop",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children ? (
          <>
            <div className="flex items-center gap-8 shrink-0">{children}</div>
            <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
              {children}
            </div>
          </>
        ) : items ? (
          <>
            {[...items, ...items, ...items, ...items].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 text-xs font-mono-accent uppercase tracking-wider text-[#0F1F10] font-bold"
              >
                <span className="whitespace-nowrap">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9] shrink-0" />
              </div>
            ))}
          </>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes marqueeLoop {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-loop {
          animation: marqueeLoop 35s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee-loop {
            animation-duration: 25s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-loop {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

