"use client";

import React, { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Heart, Quote } from "lucide-react";

export function FamilyStorySection() {
  const t = useTranslations("familyStory");
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      id="family-story"
      aria-label="Family Heritage Story"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <div className="relative rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 p-8 sm:p-14 shadow-sm text-left overflow-hidden">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0F1F10]/10 text-xs font-mono-accent text-[#0A9AD9] font-bold mb-8">
          <Heart className="w-3.5 h-3.5 text-[#0A9AD9] fill-[#0A9AD9]" />
          <span>{t("tag")}</span>
        </div>

        {/* Central Quote */}
        <div className="relative mb-8">
          <Quote className="w-10 h-10 text-[#0A9AD9]/25 mb-4" />
          <blockquote
            className={`${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            } text-2xl sm:text-4xl font-bold text-[#0F1F10] leading-snug tracking-tight`}
          >
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
        </div>

        {/* Story Paragraphs */}
        <div
          className={`space-y-4 text-base sm:text-lg text-[#0F1F10]/75 leading-relaxed ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          <p>{t("storyP1")}</p>
          <p>{t("storyP2")}</p>
        </div>

        {/* Signature */}
        <div className="mt-10 pt-6 border-t border-[#0F1F10]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="font-mono-accent text-sm sm:text-base font-bold text-[#0A9AD9]">
            {t("signature")}
          </div>
          <div className="text-xs font-mono-accent text-[#0F1F10]/40 uppercase tracking-widest font-semibold">
            KARAD, MAHARASHTRA • EST. 2024
          </div>
        </div>
      </div>
    </section>
  );
}
