"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CounterBoard } from "@/components/sections/freshness/CounterBoard";
import { StepDiagram } from "@/components/sections/freshness/StepDiagram";
import { ArrowDown, Check, X, Shield, ArrowRight, Heart, UtensilsCrossed, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FreshnessPageConfig {
  type: "chain" | "clean";
  bigTitleLine1En: string;
  bigTitleLine2En: string;
  bigTitleLine1Mr: string;
  bigTitleLine2Mr: string;
  subtitleEn: string;
  subtitleMr: string;
  heroImage: string;
  heroImageAlt: string;

  resultTitleEn: string;
  resultTitleMr: string;
  resultStatementEn: string;
  resultStatementMr: string;

  whatIsEyebrowEn: string;
  whatIsEyebrowMr: string;
  whatIsTitleEn: string;
  whatIsTitleMr: string;
  whatIsDescEn: string;
  whatIsDescMr: string;
  features: {
    tagEn: string;
    tagMr: string;
    titleEn: string;
    titleMr: string;
    descEn: string;
    descMr: string;
  }[];

  sequenceStatementEn: string;
  sequenceStatementMr: string;
  sequenceImage: string;

  howStepsTitleEn: string;
  howStepsTitleMr: string;
  steps: {
    number: string;
    titleEn: string;
    titleMr: string;
    descEn: string;
    descMr: string;
  }[];

  oldWaysHeadingEn: string;
  oldWaysHeadingMr: string;
  oldWaysPoints: {
    oldEn: string;
    oldMr: string;
    anEn: string;
    anMr: string;
  }[];

  audienceFamily: {
    titleEn: string;
    titleMr: string;
    descEn: string;
    descMr: string;
    bulletsEn: string[];
    bulletsMr: string[];
  };
  audienceKitchens: {
    titleEn: string;
    titleMr: string;
    descEn: string;
    descMr: string;
    bulletsEn: string[];
    bulletsMr: string[];
  };

  benefits: {
    num: string;
    titleEn: string;
    titleMr: string;
    descEn: string;
    descMr: string;
  }[];
}

export function FreshnessPageTemplate({ config }: { config: FreshnessPageConfig }) {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const heroRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!heroRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(".big-title-line", { yPercent: 110, opacity: 0 });
      gsap.set(".big-title-sub", { y: 20, opacity: 0 });

      tl.to(".big-title-line", {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        delay: 0.1,
      }).to(
        ".big-title-sub",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
        },
        "-=0.4"
      );

      if (sequenceRef.current) {
        gsap.fromTo(
          sequenceRef.current,
          { scale: 0.95, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sequenceRef.current,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.5,
            },
          }
        );
      }
    },
    { scope: heroRef, dependencies: [locale] }
  );

  const scrollToNext = () => {
    const el = document.getElementById("result-statement");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <article className="pb-16 select-none">
      {/* 1. BigTitle (huge two-line title, subtitle, scroll cue, image) */}
      <section
        ref={heroRef}
        aria-label="Freshness Hero"
        className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-12"
      >
        <div className="max-w-4xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMarathi ? "आमची गुणवत्ता हमी" : "OUR FRESHNESS STANDARDS"}</span>
          </div>

          <h1
            className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[0.94] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            <span className="block overflow-hidden py-1">
              <span className="big-title-line block">
                {isMarathi ? config.bigTitleLine1Mr : config.bigTitleLine1En}
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="big-title-line block text-[#0A9AD9]">
                {isMarathi ? config.bigTitleLine2Mr : config.bigTitleLine2En}
              </span>
            </span>
          </h1>

          <p
            className={`big-title-sub text-lg sm:text-2xl text-[#0F1F10]/75 font-medium max-w-2xl leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi ? config.subtitleMr : config.subtitleEn}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={scrollToNext}
              aria-label="Scroll to discover process"
              className="inline-flex items-center gap-2 text-xs font-mono-accent uppercase tracking-wider text-[#0F1F10]/60 hover:text-[#0A9AD9] transition-colors py-2 px-3 cursor-pointer group"
            >
              <span>{isMarathi ? "खाली स्क्रोल करा" : "Scroll to explore"}</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform animate-bounce text-[#0A9AD9]" />
            </button>
          </div>
        </div>

        {/* Wide Hero Image */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[#0F1F10]/10 bg-[#0F1F10]">
          <Image
            src={config.heroImage}
            alt={config.heroImageAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-mono-accent">
            <span className="font-bold tracking-wider uppercase text-[#6EC6F0]">
              {isMarathi ? "प्रक्रिया व तंत्रज्ञान" : "PROCESS & TECHNOLOGY DISPATCH"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              0°C VERIFIED
            </span>
          </div>
        </div>
      </section>

      {/* 2. ResultStatement ("THE RESULT") */}
      <section
        id="result-statement"
        aria-label="The Result"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto"
      >
        <div className="p-8 sm:p-14 rounded-3xl bg-[#0F1F10] text-white border border-white/10 shadow-xl space-y-4 text-left relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-widest">
            <span>THE RESULT // {isMarathi ? "अंतिम निष्कर्ष" : "VERIFIED OUTCOME"}</span>
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? config.resultTitleMr : config.resultTitleEn}
          </h2>

          <p
            className={`text-base sm:text-lg text-white/80 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi ? config.resultStatementMr : config.resultStatementEn}
          </p>
        </div>
      </section>

      {/* 3. WhatIs + FeatureTrio (three mini-features with short loop visual) */}
      <section
        aria-label="What Is and Feature Trio"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16"
      >
        <div className="max-w-3xl text-left space-y-4">
          <span className="text-xs font-mono-accent text-[#0A9AD9] uppercase font-bold tracking-widest block">
            // {isMarathi ? config.whatIsEyebrowMr : config.whatIsEyebrowEn}
          </span>
          <h2
            className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? config.whatIsTitleMr : config.whatIsTitleEn}
          </h2>
          <p
            className={`text-base sm:text-lg text-[#0F1F10]/75 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi ? config.whatIsDescMr : config.whatIsDescEn}
          </p>
        </div>

        {/* Feature Trio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {config.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 hover:border-[#0A9AD9] hover:bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              {/* Short Loop Visual Canvas/CSS Caustic */}
              <div className="h-32 w-full rounded-2xl bg-[#0F1F10] border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0A9AD9]/30 via-transparent to-[#6EC6F0]/20 animate-pulse" />
                <span className="relative z-10 text-xs font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-wider">
                  FEATURE 0{idx + 1} • {isMarathi ? feat.tagMr : feat.tagEn}
                </span>
              </div>

              <div>
                <h3
                  className={`text-xl font-bold text-[#0F1F10] leading-snug ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? feat.titleMr : feat.titleEn}
                </h3>
                <p
                  className={`mt-2 text-xs sm:text-sm text-[#0F1F10]/70 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {isMarathi ? feat.descMr : feat.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CounterBoard (live data table from /api/catch) */}
      <section
        aria-label="Counter Board"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
      >
        <CounterBoard />
      </section>

      {/* 5. Statement + ImageSequence (scroll-driven sequence like the reference) */}
      <section
        aria-label="Image Sequence"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto space-y-12 text-center"
      >
        <blockquote
          className={`text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F1F10] tracking-tight leading-tight max-w-3xl mx-auto ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          &ldquo;{isMarathi ? config.sequenceStatementMr : config.sequenceStatementEn}&rdquo;
        </blockquote>

        <div
          ref={sequenceRef}
          className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-[#0F1F10]/10 bg-[#0F1F10]"
        >
          <Image
            src={config.sequenceImage}
            alt="Sequence visual"
            fill
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 text-white text-xs font-mono-accent font-bold">
            DOCUMENTED COLD-CHAIN HARVEST
          </div>
        </div>
      </section>

      {/* 6. HowSteps (four numbered steps, each with diagram built in code) */}
      <section
        aria-label="How Steps"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16"
      >
        <div className="max-w-3xl text-left space-y-3">
          <span className="text-xs font-mono-accent text-[#0A9AD9] uppercase font-bold tracking-widest block">
            // STEP-BY-STEP PROTOCOL
          </span>
          <h2
            className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? config.howStepsTitleMr : config.howStepsTitleEn}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {config.steps.map((st) => (
            <div
              key={st.number}
              className="p-8 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 hover:bg-white hover:border-[#0A9AD9] shadow-xs hover:shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 rounded-full bg-white border border-[#0F1F10]/10 flex items-center justify-center font-mono-accent text-lg font-bold text-[#0F1F10]">
                    {st.number}
                  </span>
                  <span className="text-xs font-mono-accent uppercase tracking-wider text-[#0A9AD9] font-bold">
                    STEP {st.number}
                  </span>
                </div>

                <h3
                  className={`text-2xl font-bold text-[#0F1F10] leading-snug ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? st.titleMr : st.titleEn}
                </h3>

                <p
                  className={`text-xs sm:text-sm text-[#0F1F10]/75 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {isMarathi ? st.descMr : st.descEn}
                </p>
              </div>

              {/* In-Code SVG / CSS Diagram */}
              <StepDiagram type={config.type} stepNumber={st.number} />
            </div>
          ))}
        </div>
      </section>

      {/* 7. 'Why Old Ways Leave Too Much to Chance' */}
      <section
        aria-label="Comparison with Old Ways"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto space-y-12"
      >
        <div className="max-w-2xl text-left space-y-3">
          <span className="text-xs font-mono-accent text-red-500 uppercase font-bold tracking-widest block">
            // WHY OLD TRADITIONS FAIL
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1F10] tracking-tight leading-tight ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? config.oldWaysHeadingMr : config.oldWaysHeadingEn}
          </h2>
        </div>

        <div className="space-y-4">
          {config.oldWaysPoints.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#0F1F10]/08 grid grid-cols-1 md:grid-cols-2 gap-4 items-center shadow-xs"
            >
              {/* Old Way */}
              <div className="flex items-start gap-3 text-red-600/90 text-xs sm:text-sm">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="line-through text-[#0F1F10]/60">
                  {isMarathi ? pt.oldMr : pt.oldEn}
                </span>
              </div>

              {/* AN Fish World Way */}
              <div className="flex items-start gap-3 text-emerald-700 text-xs sm:text-sm font-semibold">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{isMarathi ? pt.anMr : pt.anEn}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Two Audience Blocks ('For Families' and 'For Kitchens') */}
      <section
        aria-label="Audience Blocks"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Families */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF8FF] flex items-center justify-center text-[#0A9AD9]">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xs font-mono-accent text-[#0A9AD9] font-bold uppercase tracking-wider block">
                FOR FAMILIES // {isMarathi ? "घरच्या जेवणासाठी" : "HOME KITCHENS"}
              </span>
              <h3
                className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] leading-snug ${
                  isMarathi ? "font-marathi-display" : "font-latin-display"
                }`}
              >
                {isMarathi ? config.audienceFamily.titleMr : config.audienceFamily.titleEn}
              </h3>
              <p
                className={`text-sm text-[#0F1F10]/75 leading-relaxed ${
                  isMarathi ? "font-marathi-body" : "font-sans"
                }`}
              >
                {isMarathi ? config.audienceFamily.descMr : config.audienceFamily.descEn}
              </p>

              <ul className="space-y-2 pt-2 text-xs font-mono-accent text-[#0F1F10]/80">
                {(isMarathi ? config.audienceFamily.bulletsMr : config.audienceFamily.bulletsEn).map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#0F1F10]/10">
              <Link
                href="/catch"
                className="inline-flex items-center gap-2 text-xs font-mono-accent font-bold uppercase tracking-wider text-[#0A9AD9] hover:underline"
              >
                <span>{isMarathi ? "कुटुंबासाठी मासोळी निवडा" : "Browse Family Catch"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Kitchens */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#063A63]/10 text-[#063A63] flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono-accent text-[#063A63] font-bold uppercase tracking-wider block">
                FOR KITCHENS // {isMarathi ? "हॉटेल्स व शेफ्ससाठी" : "COMMERCIAL SUPPLY"}
              </span>
              <h3
                className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] leading-snug ${
                  isMarathi ? "font-marathi-display" : "font-latin-display"
                }`}
              >
                {isMarathi ? config.audienceKitchens.titleMr : config.audienceKitchens.titleEn}
              </h3>
              <p
                className={`text-sm text-[#0F1F10]/75 leading-relaxed ${
                  isMarathi ? "font-marathi-body" : "font-sans"
                }`}
              >
                {isMarathi ? config.audienceKitchens.descMr : config.audienceKitchens.descEn}
              </p>

              <ul className="space-y-2 pt-2 text-xs font-mono-accent text-[#0F1F10]/80">
                {(isMarathi ? config.audienceKitchens.bulletsMr : config.audienceKitchens.bulletsEn).map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#063A63]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#0F1F10]/10">
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 text-xs font-mono-accent font-bold uppercase tracking-wider text-[#063A63] hover:underline"
              >
                <span>{isMarathi ? "घाऊक पुरवठा माहिती" : "Wholesale Kitchen Solutions"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Benefits (five numbered items) */}
      <section
        aria-label="Five Benefits"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto space-y-12"
      >
        <div className="max-w-2xl text-left space-y-3">
          <span className="text-xs font-mono-accent text-[#0A9AD9] uppercase font-bold tracking-widest block">
            // UNCOMPROMISING ADVANTAGES
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1F10] tracking-tight leading-tight ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "५ थेट फायदे ज्यावर कुटुंबे विश्वास ठेवतात." : "Five Uncompromised Benefits You Taste."}
          </h2>
        </div>

        <div className="space-y-4">
          {config.benefits.map((ben) => (
            <div
              key={ben.num}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#0F1F10]/08 hover:border-[#0A9AD9] transition-all flex items-start gap-6 shadow-xs"
            >
              <span className="font-mono-accent text-2xl sm:text-3xl font-black text-[#0A9AD9] shrink-0">
                {ben.num}
              </span>
              <div>
                <h3
                  className={`text-xl font-bold text-[#0F1F10] leading-snug ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? ben.titleMr : ben.titleEn}
                </h3>
                <p
                  className={`mt-1.5 text-xs sm:text-sm text-[#0F1F10]/70 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {isMarathi ? ben.descMr : ben.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
