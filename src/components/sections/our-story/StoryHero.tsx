"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowDown, Waves } from "lucide-react";

export function StoryHero() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!heroRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(".story-hero-line", { yPercent: 110, opacity: 0 });
      gsap.set(".story-subhead", { y: 20, opacity: 0 });
      gsap.set(imageRef.current, { scale: 0.95, opacity: 0 });

      tl.to(".story-hero-line", {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.1,
        delay: 0.1,
      })
        .to(
          ".story-subhead",
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          "-=0.4"
        )
        .to(
          imageRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
          },
          "-=0.5"
        );
    },
    { scope: heroRef, dependencies: [locale] }
  );

  const scrollToNext = () => {
    const el = document.getElementById("trust-need");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      id="story-hero"
      aria-label="Our Story Hero"
      className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-12"
    >
      {/* 1. Category Eyebrow Pill */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
          <Waves className="w-3.5 h-3.5" />
          <span>{isMarathi ? "आमची गोष्ट • OUR STORY" : "OUR STORY • आमची गोष्ट"}</span>
        </div>

        <span className="text-xs font-mono-accent text-[#0F1F10]/50 uppercase tracking-widest hidden sm:inline-block">
          KARAD • MALKAPUR • EST. 2024
        </span>
      </div>

      {/* 2. H1 in Three Lines [C] */}
      <div className="max-w-4xl text-left space-y-6">
        <h1
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[0.98] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? (
            <>
              <span className="block overflow-hidden py-1">
                <span className="story-hero-line block">एका कुटुंबासाठी ताजी मासोळी</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="story-hero-line block text-[#0A9AD9]">
                  म्हणजे काय, याची नवी व्याख्या
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="story-hero-line block">प्रत्येक स्वयंपाकघरात पोहोचवणे.</span>
              </span>
            </>
          ) : (
            <>
              <span className="block overflow-hidden py-1">
                <span className="story-hero-line block">Advancing What</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="story-hero-line block text-[#0A9AD9]">Fresh Fish</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="story-hero-line block">Can Mean to a Family.</span>
              </span>
            </>
          )}
        </h1>

        {/* Subhead [C] */}
        <p
          className={`story-subhead text-lg sm:text-2xl text-[#0F1F10]/75 font-medium max-w-2xl leading-relaxed ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "कोकणच्या किनाऱ्यावर जन्म, कराडमध्ये विस्तार. पहाटेचा लिलाव, ०°C शीतसाखळी आणि शून्य केमिकल्सच्या अखंड विश्वासावर आधारलेला आमचा प्रवास."
            : "Born on the coast, perfected in Karad. We built AN Fish World on a single unshakeable promise: dawn harbour freshness, zero chemical preservatives, and honest respect for every family table."}
        </p>

        {/* Scroll Cue with Reference Animation */}
        <div className="pt-2">
          <button
            type="button"
            onClick={scrollToNext}
            aria-label="Scroll to discover our story"
            className="inline-flex items-center gap-2 text-xs font-mono-accent uppercase tracking-wider text-[#0F1F10]/60 hover:text-[#0A9AD9] transition-colors py-2 px-3 cursor-pointer group"
          >
            <span>{isMarathi ? "खाली स्क्रोल करा" : "Scroll to discover"}</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform animate-bounce text-[#0A9AD9]" />
          </button>
        </div>
      </div>

      {/* 3. Wide Image of Real Team & Counter (Alethia Reference Style) */}
      <div
        ref={imageRef}
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[#0F1F10]/10 bg-[#0F1F10]"
      >
        <Image
          src="/media/team-counter.jpg"
          alt="AN Fish World Karad team at the retail counter"
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <span className="text-xs font-mono-accent text-[#6EC6F0] uppercase font-bold tracking-wider block">
              OUR KARAD TEAM • MALKAPUR HIGHWAY HUB
            </span>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {isMarathi ? "कराडच्या लाडक्या खवय्यांसाठी तत्पर टीम" : "The Faces Behind Karad's Beloved Fresh Catch"}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono-accent border border-white/20 shrink-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isMarathi ? "दालन व कर्मचारी" : "Authentic Team Photograph"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
