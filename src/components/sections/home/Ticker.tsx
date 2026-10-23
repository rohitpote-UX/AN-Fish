"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Heart, Sparkles, Fish } from "lucide-react";

export function Ticker() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const phrases = [
    { text: "आमच्या लाडक्या ग्राहकांची लाडकी फिश कंपनी", icon: Heart },
    { text: isMarathi ? "१५२K समाधानी कुटुंबे" : "152K families", icon: Sparkles },
    { text: "खुश रहा, मासे खावा", icon: Fish },
    { text: isMarathi ? "दररोज ताजी आवक • ०°C शीतसाखळी" : "Daily Fresh Catch • 0°C Cold Chain", icon: Sparkles },
  ];

  // Repeat items for a smooth infinite seamless marquee loop
  const repeated = [...phrases, ...phrases, ...phrases, ...phrases];

  return (
    <section
      aria-label="Brand Philosophy Marquee"
      className="relative w-full py-6 sm:py-8 bg-[#0F1F10] text-white border-y border-white/10 overflow-hidden select-none"
    >
      <div className="flex w-max shrink-0 items-center gap-10 sm:gap-14 animate-marquee hover:[animation-play-state:paused] cursor-grab">
        {repeated.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-4 sm:gap-6 shrink-0">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold font-marathi-display tracking-wide text-white/90 hover:text-white transition-colors">
                {item.text}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#0A9AD9]">
                <Icon className="w-4 h-4 fill-current" />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marqueeScroll 32s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 22s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
