"use client";

import React, { useRef } from "react";
import { useLocale } from "next-intl";
import { MessageCircle, Waves, MapPin } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function FooterCtaBand() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const cleanPhone = PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आजच्या ताज्या आवकमधून ऑर्डर करायची आहे."
      : "Hello AN Fish World Karad, I would like to place an order from today's catch."
  )}`;

  return (
    <aside
      aria-label="Footer Call to Action"
      className="relative w-full bg-[#0F1F10] text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-12 overflow-hidden border-t border-white/10 z-10"
    >
      {/* 1. Slow Blue Water-Caustics Loop in CSS/SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden" aria-hidden="true">
        <div className="caustics-ambient absolute -inset-[50%] w-[200%] h-[200%]" />
      </div>

      {/* SVG Turbulence Filter for Caustics Distortion */}
      <svg className="sr-only" aria-hidden="true">
        <filter id="caustics-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.03"
            numOctaves="3"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="24s"
              values="0.015 0.03; 0.025 0.045; 0.015 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" />
        </filter>
      </svg>

      <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-wider">
          <Waves className="w-3.5 h-3.5 text-[#0A9AD9]" />
          <span>{isMarathi ? "कराड • थेट बंदर लिलाव" : "KARAD • DAWN HARBOUR SOURCING"}</span>
        </div>

        {/* H2 Title [C] */}
        <h2
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "ताजे मासे, घरच्या जेवणासाठी" : "Turn Fresh Catch Into Family Dinners"}
        </h2>

        {/* Subhead [C] */}
        <p
          className={`text-base sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "विश्वासार्ह ताजी मासोळी. व्हॉट्सॲपवर ऑर्डर द्या किंवा आमच्या जवळच्या दालनाला भेट द्या."
            : "Fresh fish you can trust. Order on WhatsApp or visit your nearest counter."}
        </p>

        {/* Primary CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            id="footer-band-whatsapp-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] text-white hover:text-[#0F1F10] text-xs font-mono-accent font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_4px_24px_rgba(10,154,217,0.5)] transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{isMarathi ? "व्हॉट्सॲपवर ऑर्डर द्या" : "Order on WhatsApp"}</span>
          </a>

          <a
            href="#karad-store"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0F1F10] border border-white/15 text-xs font-mono-accent font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0A9AD9]" />
            <span>{isMarathi ? "जवळचे दालन शोधा" : "Find Nearest Counter"}</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .caustics-ambient {
          background: radial-gradient(
              circle at 30% 40%,
              rgba(10, 154, 217, 0.45) 0%,
              transparent 60%
            ),
            radial-gradient(
              circle at 70% 60%,
              rgba(110, 198, 240, 0.35) 0%,
              transparent 55%
            );
          filter: url(#caustics-filter);
          animation: causticsDrift 18s ease-in-out infinite alternate;
        }

        @keyframes causticsDrift {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-3%, 2%) scale(1.05);
          }
          100% {
            transform: translate(2%, -3%) scale(0.98);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .caustics-ambient {
            animation: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
