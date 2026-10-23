"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";

export interface PinnedListItem {
  id: string | number;
  number: string | number;
  title: React.ReactNode;
  description: React.ReactNode;
  tag?: string;
  metric?: string;
}

export interface PinnedListProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  items: PinnedListItem[];
  isMarathi?: boolean;
  className?: string;
}

export function PinnedList({
  eyebrow = "PILLARS OF FRESHNESS",
  title,
  subtitle,
  items,
  isMarathi = false,
  className,
}: PinnedListProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const targetCenter = windowHeight * 0.5;

      let closestIndex = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - targetCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start", className)}>
      {/* Sticky Left Column: Title + Eyebrow */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4 text-left">
        {eyebrow && (
          <Eyebrow variant="blue" radius="tag">
            {eyebrow}
          </Eyebrow>
        )}

        <h3
          className={cn(
            "type-h3 font-bold text-[#0F1F10] tracking-tight leading-tight",
            isMarathi ? "font-marathi-display" : "font-latin-display"
          )}
        >
          {title}
        </h3>

        {subtitle && (
          <p
            className={cn(
              "text-base sm:text-lg text-[#0F1F10]/70 leading-relaxed max-w-md",
              isMarathi ? "font-marathi-body" : "font-sans"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Scrolling Right Column: Cards morphing active state */}
      <div className="lg:col-span-7 space-y-6">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          const formattedNumber =
            typeof item.number === "number" && item.number < 10
              ? `0${item.number}`
              : `${item.number}`;

          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              tabIndex={0}
              className={cn(
                "p-8 sm:p-10 rounded-[24px] border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-left focus-visible:outline-2 focus-visible:outline-[#0A9AD9] focus-visible:outline-offset-2",
                isActive
                  ? "bg-white border-[#0A9AD9] shadow-[0_12px_32px_rgba(10,154,217,0.12)] scale-[1.01]"
                  : "bg-white/60 border-[#0F1F10]/08 hover:border-[#0F1F10]/20 opacity-70 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-mono-accent text-xs font-bold transition-all duration-300 select-none",
                    isActive
                      ? "bg-[#0A9AD9] text-white shadow-sm"
                      : "bg-[#F5F4F2] text-[#0F1F10] border border-[#0F1F10]/10"
                  )}
                >
                  {formattedNumber}
                </span>

                {item.metric && (
                  <span className="font-mono-accent text-[11px] uppercase tracking-wider text-[#0A9AD9] font-bold bg-[#EBF8FF] px-3 py-1 rounded-full border border-[#0A9AD9]/20">
                    {item.metric}
                  </span>
                )}
              </div>

              <h4
                className={cn(
                  "text-2xl font-bold tracking-tight mb-2",
                  isActive ? "text-[#0F1F10]" : "text-[#0F1F10]/80",
                  isMarathi ? "font-marathi-display" : "font-latin-display"
                )}
              >
                {item.title}
              </h4>

              <p
                className={cn(
                  "text-base text-[#0F1F10]/75 leading-relaxed",
                  isMarathi ? "font-marathi-body" : "font-sans"
                )}
              >
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
