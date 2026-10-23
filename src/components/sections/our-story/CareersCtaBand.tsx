"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Briefcase, ArrowRight, Sparkles } from "lucide-react";

export function CareersCtaBand() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  return (
    <section
      aria-label="Careers CTA"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="rounded-3xl bg-[#0F1F10] text-white p-8 sm:p-14 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Subtle background glow */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#0A9AD9]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-2xl space-y-4 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#6EC6F0] text-xs font-mono-accent font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-[#0A9AD9]" />
            <span>{isMarathi ? "करिअरच्या संधी • CAREERS" : "GROW WITH US • CAREERS"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi
              ? "जिथे ताजेपणा आणि प्रामाणिकपणाला मान मिळतो तिथे काम करा."
              : "Work Where Freshness Matters."}
          </h2>

          <p
            className={`text-sm sm:text-base text-white/75 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "बंदर खरेदी, शीतसाखळी वाहतूक, कस्टमाईज्ड कटिंग किंवा स्टोअर मॅनेजमेंट — आमच्या परिवाराचा भाग व्हा."
              : "We are expanding across procurement, cold-chain transport, cutting craft, and retail counter management. Build a meaningful career in food transparency."}
          </p>
        </div>

        <div className="z-10 shrink-0 w-full sm:w-auto">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] text-white hover:text-[#0F1F10] text-xs font-mono-accent font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_4px_24px_rgba(10,154,217,0.5)] transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <span>{isMarathi ? "करिअरसाठी संपर्क साधा" : "Explore Careers & Apply"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
