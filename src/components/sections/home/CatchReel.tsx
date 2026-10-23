"use client";

import React, { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { SPECIES_LIST } from "@/data/species";
import { Species } from "@/types";
import { useBasketStore } from "@/store/basket";
import { Radio, Flame, Soup, Utensils, Plus, Check, Clock } from "lucide-react";

export function CatchReel() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [activeCategory, setActiveCategory] = useState<"all" | "sea" | "river" | "shellfish">("all");
  const openDrawer = useBasketStore((state) => state.openDrawer);

  const filteredSpecies = SPECIES_LIST.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const currentDateFormatted = new Date().toLocaleDateString(isMarathi ? "mr-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section
      id="the-catch"
      aria-label="Today's Fresh Catch"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      {/* 1. Header with Live Status Dot and Current Date */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A9AD9] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A9AD9]" />
            </span>
            <span className="uppercase tracking-wider">
              {isMarathi ? `थेट आवक • ${currentDateFormatted}` : `LIVE HARVEST • ${currentDateFormatted}`}
            </span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "आजचे ताजे मासे" : "Today's Fresh Catch"}
          </h2>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Catch Category Filter"
          className="flex items-center gap-2 bg-[#F5F4F2] p-1.5 rounded-full border border-[#0F1F10]/08"
        >
          {(
            [
              { id: "all", mr: "सर्व (All)", en: "All Catch" },
              { id: "sea", mr: "समुद्री (Sea)", en: "Sea Fish" },
              { id: "river", mr: "नदीची (River)", en: "River" },
              { id: "shellfish", mr: "कोळंबी / खेकडे", en: "Shellfish" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono-accent font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-white text-[#0A9AD9] shadow-sm border border-[#0A9AD9]/30"
                  : "text-[#0F1F10]/60 hover:text-[#0F1F10]"
              }`}
            >
              {isMarathi ? tab.mr : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Cards Grid (Semantically real <li> in a <ul> for WCAG A11y) */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
        {filteredSpecies.map((fish) => {
          return (
            <li
              key={fish.slug}
              className="group rounded-3xl bg-white border border-[#0F1F10]/08 p-6 flex flex-col justify-between hover:border-[#0A9AD9] hover:shadow-[0_16px_36px_rgba(10,154,217,0.12)] transition-all duration-300 text-left relative overflow-hidden"
            >
              <div>
                {/* Top Row: Availability Badge + Rate */}
                <div className="flex items-center justify-between mb-4">
                  {fish.available ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8FF] text-[11px] font-mono-accent text-[#0A9AD9] font-bold border border-[#0A9AD9]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9]" />
                      <span>{isMarathi ? "दररोज ताजे" : "Fresh Today"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F4F2] text-[11px] font-mono-accent text-[#0F1F10]/50 font-bold border border-[#0F1F10]/10">
                      <Clock className="w-3 h-3 text-[#0F1F10]/40" />
                      <span>{isMarathi ? "उद्या उपलब्ध" : "Back Tomorrow"}</span>
                    </span>
                  )}

                  <span className="text-sm font-mono-accent font-bold text-[#0F1F10]">
                    {fish.pricePerKg}
                  </span>
                </div>

                {/* Large Cutout Graphic with Idle Micro-Swim */}
                <div className="w-full h-48 py-2 flex items-center justify-center relative overflow-hidden my-3">
                  <img
                    src={fish.image}
                    alt={isMarathi ? fish.nameMr : fish.nameEn}
                    className="max-h-full max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 animate-idle-swim"
                  />
                </div>

                {/* Names */}
                <div className="mt-4">
                  <h3
                    className={`text-2xl font-bold text-[#0F1F10] tracking-tight group-hover:text-[#0A9AD9] transition-colors ${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    }`}
                  >
                    {isMarathi ? fish.nameMr : fish.nameEn}
                  </h3>
                  <div className="text-xs font-mono-accent text-[#0F1F10]/50 mt-0.5">
                    {isMarathi ? fish.nameEn : fish.nameMr}
                  </div>
                </div>

                {/* Taste Note */}
                <p
                  className={`mt-3 text-xs sm:text-sm text-[#0F1F10]/70 line-clamp-2 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {fish.tasteNote}
                </p>

                {/* 3 Best Cooking Method Icons */}
                <div className="mt-5 pt-4 border-t border-[#0F1F10]/08 flex items-center gap-3">
                  <span className="text-[10px] font-mono-accent uppercase tracking-wider text-[#0F1F10]/50 font-bold">
                    {isMarathi ? "पाककृती:" : "Best For:"}
                  </span>
                  <div className="flex items-center gap-2">
                    {fish.bestFor.includes("fry") && (
                      <span
                        title="Best for Rava / Tawa Fry"
                        className="p-1.5 rounded-lg bg-[#F5F4F2] text-[#0A9AD9] flex items-center justify-center"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {fish.bestFor.includes("curry") && (
                      <span
                        title="Best for Coastal Curry / Rassa"
                        className="p-1.5 rounded-lg bg-[#F5F4F2] text-[#0A9AD9] flex items-center justify-center"
                      >
                        <Soup className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {fish.bestFor.includes("grill") && (
                      <span
                        title="Best for Tandoor / Grill"
                        className="p-1.5 rounded-lg bg-[#F5F4F2] text-[#0A9AD9] flex items-center justify-center"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#0F1F10]/08">
                <button
                  type="button"
                  onClick={() => openDrawer(fish)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-mono-accent font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    fish.available
                      ? "bg-[#0A9AD9] hover:bg-[#063A63] text-white shadow-sm"
                      : "bg-[#F5F4F2] hover:bg-[#E2E8F0] text-[#0F1F10]/70"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {fish.available
                      ? isMarathi
                        ? "+ बास्केटमध्ये जोडा"
                        : "+ Add to Basket"
                      : isMarathi
                      ? "चौकशी करा (Inquire)"
                      : "Inquire Availability"}
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <style jsx global>{`
        @keyframes idleSwim {
          0%, 100% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(4px) rotate(1deg);
          }
        }
        .animate-idle-swim {
          animation: idleSwim 4.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-idle-swim {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
