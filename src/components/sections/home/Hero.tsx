"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MessageCircle, ArrowDown, Anchor, ShieldCheck, ThermometerSnowflake, Sparkles, MapPin } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function Hero() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const heroRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const trustBarRef = useRef<HTMLDivElement>(null);
  const fishCenterRef = useRef<HTMLDivElement>(null);
  const fishTopRightRef = useRef<HTMLDivElement>(null);
  const fishBottomLeftRef = useRef<HTMLDivElement>(null);
  const fishBottomRightRef = useRef<HTMLDivElement>(null);
  const fishTopLeftRef = useRef<HTMLDivElement>(null);
  const lowerPanelRef = useRef<HTMLDivElement>(null);

  // Active highlighted species in hero (default: pomfret)
  const [activeSpeciesId, setActiveSpeciesId] = React.useState<string>("pomfret");

  // Coordinated Entrance Sequence (Preserving 70%+ White Canvas and Free Shape)
  useGSAP(
    () => {
      if (!heroRef.current) return;

      // Accessibility: strictly respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            headlineLine1Ref.current,
            headlineLine2Ref.current,
            subheadRef.current,
            ctaGroupRef.current,
            trustBarRef.current,
            fishCenterRef.current,
            fishTopRightRef.current,
            fishBottomLeftRef.current,
            fishBottomRightRef.current,
            fishTopLeftRef.current,
            lowerPanelRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Initial restrained states
      gsap.set(eyebrowRef.current, { opacity: 0, y: 10 });
      gsap.set(headlineLine1Ref.current, { opacity: 0, y: 18 });
      gsap.set(headlineLine2Ref.current, { opacity: 0, y: 18 });
      gsap.set(subheadRef.current, { opacity: 0, y: 14 });
      gsap.set(ctaGroupRef.current, { opacity: 0, y: 12 });
      gsap.set(trustBarRef.current, { opacity: 0, y: 10 });
      gsap.set(fishCenterRef.current, { opacity: 0, scale: 0.94 });
      gsap.set(
        [
          fishTopRightRef.current,
          fishBottomLeftRef.current,
          fishBottomRightRef.current,
          fishTopLeftRef.current,
        ],
        { opacity: 0, y: 16 }
      );
      gsap.set(lowerPanelRef.current, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.05,
      });

      // Step 2 — Eyebrow label (fade + 10px upward)
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
      })
        // Step 3 — Main headline line 1
        .to(
          headlineLine1Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.25"
        )
        // Step 4 — Italic cyan headline line 2
        .to(
          headlineLine2Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35"
        )
        // Step 5 — Supporting paragraph
        .to(
          subheadRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.3"
        )
        // Step 6 — CTAs
        .to(
          ctaGroupRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.25"
        )
        // Step 7 — Central Free-Shape Fish reveal (scale 0.94 -> 1.0)
        .to(
          fishCenterRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "power2.out",
          },
          "-=0.35"
        )
        // Step 8 — Satellite Free-Shape Seafood constellation float in
        .to(
          [
            fishTopRightRef.current,
            fishBottomLeftRef.current,
            fishBottomRightRef.current,
            fishTopLeftRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // Step 9 — Floating Outpost Telemetry Panel
        .to(
          lowerPanelRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.2"
        )
        // Trust milestones
        .to(
          trustBarRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.25"
        );
    },
    { scope: heroRef, dependencies: [locale] }
  );

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आजच्या ताज्या आवकमधून ऑर्डर करायची आहे."
      : "Hello AN Fish World Karad, I would like to place an order from today's fresh catch."
  )}`;

  const scrollToProducts = () => {
    const el = document.getElementById("product-discovery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 5 Real AN Fish World Species (Free Shape — No frame, no box, 100% white canvas)
  const speciesList = [
    {
      id: "pomfret",
      nameEn: "Silver Pomfret",
      nameMr: "सिल्व्हर पापलेट",
      tagEn: "Dawn Star Catch",
      tagMr: "पहाटेची खास निवड",
      rate: "₹1,150 / kg",
      image: "/media/hero/pomfret-free.webp",
      alt: "Fresh raw Silver Pomfret on crushed ice with lemon slices",
    },
    {
      id: "surmai",
      nameEn: "Kingfish Surmai Steaks",
      nameMr: "किंग सुरमई स्टेक्स",
      tagEn: "Crispy Fry Pick",
      tagMr: "तवा फ्राय स्पेशल",
      rate: "₹980 / kg",
      image: "/media/hero/surmai-free.webp",
      alt: "Raw Kingfish Surmai steaks on crushed ice with sea salt",
    },
    {
      id: "prawns",
      nameEn: "Jumbo Tiger Prawns",
      nameMr: "रॉयल टायगर कोळंबी",
      tagEn: "Sweet & Juicy",
      tagMr: "गोड व रसाळ",
      rate: "₹750 / kg",
      image: "/media/hero/prawns-free.webp",
      alt: "Fresh raw Jumbo Tiger Prawns on crushed ice with lime",
    },
    {
      id: "rawas",
      nameEn: "Indian Salmon Rawas",
      nameMr: "इंडियन सामन (रावस)",
      tagEn: "Omega-3 Rich",
      tagMr: "ओमेगा-३ समृद्ध",
      rate: "₹880 / kg",
      image: "/media/hero/rawas-free.webp",
      alt: "Indian Salmon Rawas steaks on crushed ice with rosemary",
    },
    {
      id: "crab",
      nameEn: "Live Ocean Mud Crab",
      nameMr: "समुद्री चिमबोरी / खेकडा",
      tagEn: "Live Fresh Catch",
      tagMr: "जिवंत ताजी आवक",
      rate: "Live Catch",
      image: "/media/hero/crab-free.webp",
      alt: "Fresh Ocean Mud Crab on crushed ice with herbs",
    },
  ];

  const activeSpecies = speciesList.find((s) => s.id === activeSpeciesId) || speciesList[0];

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="AN Fish World Hero"
      className="relative min-h-[90vh] lg:min-h-screen bg-white text-[#071A24] overflow-hidden pt-28 sm:pt-36 pb-16 lg:pb-24 flex flex-col justify-between"
    >
      {/* 1. Luminous Atmospheric Caustics (70%+ White Canvas, purely subtle) */}
      <div
        className="absolute top-0 right-0 w-full h-[650px] bg-[radial-gradient(circle_at_85%_20%,rgba(11,157,216,0.06)_0%,transparent_60%)] pointer-events-none select-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[400px] bg-[radial-gradient(circle_at_15%_90%,rgba(166,220,203,0.06)_0%,transparent_50%)] pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* 2. Main Two-Column Editorial Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Editorial Text Column (6 Cols on LG) */}
          <div className="lg:col-span-6 xl:col-span-6 text-left space-y-6 sm:space-y-7">
            
            {/* Step 2: Live Ticker Eyebrow Pill */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/25 text-xs font-mono-accent text-[#0B9DD8] uppercase tracking-wider font-bold shadow-xs select-none"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B9DD8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B9DD8]" />
              </span>
              <span>
                {isMarathi
                  ? "कराड मुख्य दालन • पहाटे ४:०० थेट आवक • ०°C शीतसाखळी"
                  : "LIVE AT KARAD OUTPOST • 4:00 AM HARBOR AUCTION • 0°C COLD CHAIN"}
              </span>
            </div>

            {/* Step 3 & 4: Awwwards Editorial Display Headline with Playfair Serif Accent */}
            <h1
              className={`text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-[#071A24] tracking-[-0.035em] leading-[1.05] sm:leading-[1.02] ${
                isMarathi ? "font-marathi-display" : "font-latin-display"
              }`}
            >
              {isMarathi ? (
                <>
                  <span ref={headlineLine1Ref} className="block">
                    पहाटेच्या बंदराची ताजी मासोळी,
                  </span>
                  <span
                    ref={headlineLine2Ref}
                    className="block font-editorial italic font-normal text-[#0B9DD8] tracking-tight mt-1 pb-1.5"
                  >
                    थेट तुमच्या घरच्या ताटात.
                  </span>
                </>
              ) : (
                <>
                  <span ref={headlineLine1Ref} className="block">
                    Where Sea Freshness
                  </span>
                  <span
                    ref={headlineLine2Ref}
                    className="block font-editorial italic font-normal text-[#0B9DD8] tracking-tight mt-1 pb-1.5"
                  >
                    Meets Your Table.
                  </span>
                </>
              )}
            </h1>

            {/* Step 5: Authoritative Supporting Copy */}
            <p
              ref={subheadRef}
              className={`text-base sm:text-lg text-[#071A24]/75 max-w-xl font-normal leading-relaxed ${
                isMarathi ? "font-marathi-body" : "font-sans"
              }`}
            >
              {isMarathi
                ? "रत्नागिरी व मालवण बंदरावरील पहाटे ४:०० च्या थेट लिलावातून निवडलेली आणि ०°C शीतसाखळीत सुरक्षित आणलेली ताजी मासोळी. समोर आरओ पाण्यात धुऊन व तुमच्या आवडीनुसार मोफत कट करून."
                : "Hand-selected at 4:00 AM coastal harbour auctions across Ratnagiri and Malvan. Transported in unbroken 0°C liquid slurry, cleaned with purified RO water, and portioned to order at our Malkapur Karad outpost."}
            </p>

            {/* Step 6: Dual CTAs */}
            <div
              ref={ctaGroupRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1"
            >
              {/* Primary Action: Order on WhatsApp */}
              <a
                id="hero-primary-whatsapp-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#071A24] hover:bg-[#0B9DD8] text-white text-xs sm:text-sm font-mono-accent font-bold uppercase tracking-wider shadow-md hover:shadow-[0_8px_30px_rgba(11,157,216,0.35)] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer group/btn"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#0B9DD8] group-hover/btn:text-white transition-colors" />
                <span>{isMarathi ? "व्हॉट्सॲपवर ऑर्डर द्या" : "Order on WhatsApp"}</span>
              </a>

              {/* Secondary Action: Explore Daily Catch */}
              <button
                id="hero-explore-fish-btn"
                type="button"
                onClick={scrollToProducts}
                className="px-7 py-4 rounded-full bg-white hover:bg-[#F5F4EF] text-[#071A24] border border-[#071A24]/15 hover:border-[#0B9DD8] text-xs sm:text-sm font-mono-accent font-bold uppercase tracking-wider shadow-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 group/explore"
              >
                <span>{isMarathi ? "आजची ताजी आवक पहा" : "Explore Daily Catch"}</span>
                <ArrowDown className="w-4 h-4 text-[#0B9DD8] transition-transform duration-200 group-hover/explore:translate-y-0.5" />
              </button>
            </div>

            {/* Editorial Trust Milestones Grid */}
            <div
              ref={trustBarRef}
              className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#071A24]/10"
            >
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#071A24]/08 shadow-2xs hover:border-[#0B9DD8]/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#EBF8FF] text-[#0B9DD8] flex items-center justify-center shrink-0">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#071A24] block">
                    {isMarathi ? "पहाटे ४:०० लिलाव" : "Dawn Auction"}
                  </span>
                  <span className="text-[10px] text-[#071A24]/60 font-mono-accent block">
                    Ratnagiri & Malvan
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#071A24]/08 shadow-2xs hover:border-[#0B9DD8]/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#EBF8FF] text-[#0B9DD8] flex items-center justify-center shrink-0">
                  <ThermometerSnowflake className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#071A24] block">
                    {isMarathi ? "०°C शीतसाखळी" : "0°C Ice Slurry"}
                  </span>
                  <span className="text-[10px] text-[#071A24]/60 font-mono-accent block">
                    Unbroken Cold Chain
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#071A24]/08 shadow-2xs hover:border-[#0B9DD8]/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#071A24] block">
                    {isMarathi ? "१००% रसायनमुक्त" : "100% Pure Catch"}
                  </span>
                  <span className="text-[10px] text-[#071A24]/60 font-mono-accent block">
                    RO Washed & Sliced
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 5 Free-Shape Seafood Images (No frame, no box, pure white, organic layout) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* Desktop & Tablet: Free-Shape Multi-Species Constellation Layout (Zero Box / Zero Frame) */}
            <div className="relative w-full max-w-[560px] h-[480px] sm:h-[530px] lg:h-[560px] flex items-center justify-center select-none">
              
              {/* 1. Center / Primary Focus: Silver Pomfret (Free shape, true transparent alpha, perfectly centered) */}
              <div
                className="absolute inset-0 m-auto z-20 cursor-pointer group/center select-none w-64 sm:w-76 lg:w-84 xl:w-92 aspect-square flex items-center justify-center"
                onClick={() => setActiveSpeciesId("pomfret")}
              >
                <div
                  ref={fishCenterRef}
                  className="relative w-full h-full transition-transform duration-500 ease-out group-hover/center:scale-105"
                >
                  <Image
                    src="/media/hero/pomfret-free-transparent.webp"
                    alt="Silver Pomfret on crushed ice with lemon"
                    fill
                    sizes="(max-width: 768px) 280px, 400px"
                    priority
                    quality={95}
                    className="object-contain drop-shadow-[0_16px_36px_rgba(7,26,36,0.12)]"
                  />
                  {/* Subtle Floating Label */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/95 border border-[#071A24]/10 shadow-sm text-[10px] sm:text-xs font-mono-accent font-bold text-[#071A24] whitespace-nowrap flex items-center gap-1.5 opacity-90 group-hover/center:opacity-100 transition-opacity">
                    <Sparkles className="w-3.5 h-3.5 text-[#0B9DD8]" />
                    <span>{isMarathi ? "सिल्व्हर पापलेट • ₹1,150" : "Silver Pomfret • ₹1,150"}</span>
                  </div>
                </div>
              </div>

              {/* 2. Top-Right: Kingfish Surmai Steaks (Free shape) */}
              <div
                className="absolute top-1 right-1 sm:right-3 z-15 cursor-pointer group/surmai"
                onClick={() => setActiveSpeciesId("surmai")}
              >
                <div
                  ref={fishTopRightRef}
                  className="relative w-36 sm:w-44 lg:w-48 aspect-square transition-transform duration-500 ease-out group-hover/surmai:scale-110"
                >
                  <Image
                    src="/media/hero/surmai-free-transparent.webp"
                    alt="Raw Kingfish Surmai steaks on crushed ice"
                    fill
                    sizes="(max-width: 768px) 160px, 200px"
                    quality={92}
                    className="object-contain drop-shadow-[0_10px_22px_rgba(7,26,36,0.08)] transition-transform duration-300 group-hover/surmai:rotate-2"
                  />
                  <div className="absolute top-1 right-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#071A24]/10 shadow-2xs text-[9px] sm:text-[10px] font-mono-accent font-bold text-[#071A24] whitespace-nowrap opacity-85 group-hover/surmai:opacity-100 transition-opacity">
                    {isMarathi ? "सुरमई स्टेक्स" : "Surmai Steaks"}
                  </div>
                </div>
              </div>

              {/* 3. Bottom-Left: Jumbo Tiger Prawns (Free shape) */}
              <div
                className="absolute bottom-8 sm:bottom-10 left-1 sm:left-2 z-15 cursor-pointer group/prawns"
                onClick={() => setActiveSpeciesId("prawns")}
              >
                <div
                  ref={fishBottomLeftRef}
                  className="relative w-36 sm:w-42 lg:w-46 aspect-square transition-transform duration-500 ease-out group-hover/prawns:scale-110"
                >
                  <Image
                    src="/media/hero/prawns-free-transparent.webp"
                    alt="Jumbo Tiger Prawns on crushed ice"
                    fill
                    sizes="(max-width: 768px) 150px, 190px"
                    quality={92}
                    className="object-contain drop-shadow-[0_10px_22px_rgba(7,26,36,0.08)] transition-transform duration-300 group-hover/prawns:-rotate-2"
                  />
                  <div className="absolute -bottom-1 left-2 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#071A24]/10 shadow-2xs text-[9px] sm:text-[10px] font-mono-accent font-bold text-[#071A24] whitespace-nowrap opacity-85 group-hover/prawns:opacity-100 transition-opacity">
                    {isMarathi ? "टायगर कोळंबी" : "Tiger Prawns"}
                  </div>
                </div>
              </div>

              {/* 4. Bottom-Right: Indian Salmon Rawas (Free shape) */}
              <div
                className="absolute bottom-6 right-2 sm:right-4 z-15 cursor-pointer group/rawas"
                onClick={() => setActiveSpeciesId("rawas")}
              >
                <div
                  ref={fishBottomRightRef}
                  className="relative w-32 sm:w-38 lg:w-42 aspect-square transition-transform duration-500 ease-out group-hover/rawas:scale-110"
                >
                  <Image
                    src="/media/hero/rawas-free-transparent.webp"
                    alt="Indian Salmon Rawas steaks on crushed ice"
                    fill
                    sizes="(max-width: 768px) 140px, 180px"
                    quality={92}
                    className="object-contain drop-shadow-[0_10px_22px_rgba(7,26,36,0.08)] transition-transform duration-300 group-hover/rawas:rotate-1"
                  />
                  <div className="absolute -bottom-1 right-2 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#071A24]/10 shadow-2xs text-[9px] sm:text-[10px] font-mono-accent font-bold text-[#071A24] whitespace-nowrap opacity-85 group-hover/rawas:opacity-100 transition-opacity">
                    {isMarathi ? "रावस (सामन)" : "Rawas Salmon"}
                  </div>
                </div>
              </div>

              {/* 5. Top-Left: Ocean Mud Crab (Free shape) */}
              <div
                className="absolute top-3 left-1 sm:left-3 z-15 cursor-pointer group/crab"
                onClick={() => setActiveSpeciesId("crab")}
              >
                <div
                  ref={fishTopLeftRef}
                  className="relative w-30 sm:w-36 lg:w-40 aspect-square transition-transform duration-500 ease-out group-hover/crab:scale-110"
                >
                  <Image
                    src="/media/hero/crab-free-transparent.webp"
                    alt="Ocean Mud Crab on crushed ice"
                    fill
                    sizes="(max-width: 768px) 130px, 170px"
                    quality={92}
                    className="object-contain drop-shadow-[0_10px_22px_rgba(7,26,36,0.08)] transition-transform duration-300 group-hover/crab:-rotate-1"
                  />
                  <div className="absolute top-1 left-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#071A24]/10 shadow-2xs text-[9px] sm:text-[10px] font-mono-accent font-bold text-[#071A24] whitespace-nowrap opacity-85 group-hover/crab:opacity-100 transition-opacity">
                    {isMarathi ? "चिमबोरी / खेकडा" : "Mud Crab"}
                  </div>
                </div>
              </div>

            </div>

            {/* Step 8B: Sleek Standalone Telemetry Pill (Free shape, not enclosing the fish) */}
            <div
              ref={lowerPanelRef}
              className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-white border border-[#071A24]/10 shadow-sm text-xs select-none"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#071A24]">
                  {isMarathi ? "कराड थेट आवक" : "Karad Outpost Live Batch"}
                </span>
              </div>
              <span className="text-[#071A24]/20 hidden sm:inline">•</span>
              <span className="font-mono-accent text-[#0B9DD8] font-bold text-[11px]">
                TEMP: 0.2°C
              </span>
              <span className="text-[#071A24]/20 hidden sm:inline">•</span>
              <span className="text-[#071A24]/70 font-mono-accent text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0B9DD8]" />
                <span>Malkapur, Karad</span>
              </span>
              <span className="text-[#071A24]/20 hidden sm:inline">•</span>
              <span className="text-emerald-700 font-medium text-[11px]">
                {isMarathi ? "मोफत समोर कटिंग" : "Free Custom Cuts"}
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
