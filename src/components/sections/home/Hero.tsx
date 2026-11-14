"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { MessageCircle, ArrowRight, MapPin, Clock, ShieldCheck, ChevronDown } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function Hero() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  // 1. Changing Background Images (Cycling smoothly)
  const [bgImageIndex, setBgImageIndex] = useState(0);

  const backgroundImages = useMemo(
    () => [
      "/media/counter-landscape.jpg",
      "/media/hero/hero-underwater-fish.jpg",
      "/media/family-dinner.jpg",
      "/media/cutting-hygiene.jpg",
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  // 2. Typing & Erasing Effect for Tagline: "एकदा खाल की पुन्हा पुन्हा मागाल." <-> "मासे खावा, खुश रहा!"
  const phrases = useMemo(() => {
    return isMarathi
      ? ["एकदा खाल की पुन्हा पुन्हा मागाल.", "मासे खावा, खुश रहा!"]
      : ["Taste once, you'll ask for more.", "Eat fresh fish, stay happy!"];
  }, [isMarathi]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const segmenter =
      typeof Intl !== "undefined" && Intl.Segmenter
        ? new Intl.Segmenter(isMarathi ? "mr" : "en", { granularity: "grapheme" })
        : null;

    const graphemes = segmenter
      ? Array.from(segmenter.segment(currentPhrase), (s) => s.segment)
      : Array.from(currentPhrase);

    const currentGraphemes = segmenter
      ? Array.from(segmenter.segment(displayedText), (s) => s.segment)
      : Array.from(displayedText);

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase: type letter by letter
      if (currentGraphemes.length < graphemes.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(graphemes.slice(0, currentGraphemes.length + 1).join(""));
        }, 120);
      } else {
        // Complete phrase typed: pause before erasing so the user can read it
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      // Erasing phase: erase letter by letter
      if (currentGraphemes.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(graphemes.slice(0, currentGraphemes.length - 1).join(""));
        }, 60);
      } else {
        // Complete erase: brief pause then switch to next phrase
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 400);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, phraseIndex, phrases, isMarathi]);

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आजच्या ताजी आवकमधून ऑर्डर करायची आहे."
      : "Hello AN Fish World Karad, I would like to order from today's fresh catch."
  )}`;

  const scrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("signature") || document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tickerItems = [
    isMarathi ? "सिल्व्हर पापलेट (लाडकी आवक)" : "Silver Pomfret",
    isMarathi ? "किंग सुरमई स्टेक्स" : "King Surmai Steaks",
    isMarathi ? "रॉयल टायगर कोळंबी" : "Royal Tiger Prawns",
    isMarathi ? "इंडियन सामन (रावस)" : "Indian Salmon (Rawas)",
    isMarathi ? "ताजा चंदेरी बांगडा" : "Fresh Mackerel (Bangda)",
    isMarathi ? "जिवंत चिंबोरी / खेकडे" : "Live Sea Mud Crabs",
    isMarathi ? "कृष्णा-कोयना रोहू" : "Freshwater Rohu",
    isMarathi ? "कोयना काठ कटला" : "Freshwater Catla",
    isMarathi ? "जिताडा / आशियाई सीबास" : "Asian Seabass (Jitada)",
  ];

  return (
    <section
      id="home"
      aria-label="AN Fish World Hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#071A24] text-white"
    >
      {/* 1. Background Imagery with Smooth Changing Transition */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none select-none">
        {backgroundImages.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt="AN Fish World Fresh Seafood Display"
            fill
            priority={idx === 0}
            className={`object-cover object-center transition-opacity duration-[1800ms] ease-in-out animate-slow-zoom ${
              bgImageIndex === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* 2. Textured Overlays & Veils (Exact Hotel Atithi Match) */}
      {/* Dark Oceanic Veil */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 veil-hero-ocean pointer-events-none" />

      {/* Radial Vignette Center Veil */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 veil-hero-center pointer-events-none" />

      {/* Golden & Cyan Textured Dot-Screen (Matches the Attached Screenshot) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 dot-screen-hero opacity-60 mix-blend-screen"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 dot-screen-cyan opacity-40"
      />

      {/* Bottom Fade to Next Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#071A24] to-transparent"
      />

      {/* 3. Center Content Container (Logo -> Name -> Heading with Typing Effect -> Tagline -> 2 Buttons) */}
      <div className="relative flex flex-1 items-center justify-center px-5 pb-20 pt-32 text-center lg:pt-36">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Centered Circular Badge Logo */}
          <div className="relative group">
            <div className="mx-auto size-20 sm:size-[5.5rem] rounded-full shadow-[0_18px_44px_-14px_rgba(0,0,0,0.85)] ring-4 ring-[#0A9AD9]/40 bg-white p-1.5 transition-transform duration-300 hover:scale-105 flex items-center justify-center">
              <Image
                src="/brand/an-fish-logo-badge.webp"
                alt="AN Fish World Official Badge"
                width={88}
                height={88}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            {/* Luminous Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-[#0A9AD9]/20 blur-md pointer-events-none" />
          </div>

          {/* Centered Name / Sub-eyebrow */}
          <div className="mt-5">
            <span className="block font-marathi-display text-sm sm:text-base font-bold tracking-wide text-[#6EC6F0] drop-shadow-sm">
              {isMarathi
                ? "ए एन फिश वर्ल्ड · AN Fish World, Karad"
                : "AN Fish World · Karad, Maharashtra"}
            </span>
          </div>

          {/* Centered Bold Marathi Heading (100% Static) */}
          <h1 className="mt-3">
            <span className="block font-marathi-display text-[clamp(2.2rem,6.8vw,4.5rem)] leading-[1.2] font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
              {isMarathi ? "अस्सल दर्जेदार चवीची" : "Authentic Sea Freshness"}
              
              {/* Static bold golden line */}
              <span className="mt-1 block text-[#FBBF24] drop-shadow-[0_4px_24px_rgba(251,191,36,0.35)]">
                {isMarathi ? "कराडची लाडकी मासोळी" : "Karad's Beloved Seafood"}
              </span>
            </span>
          </h1>

          {/* Centered Bigger Tagline with Better Font & Dynamic Typing Effect (Strictly 1 line always) */}
          <p className="mx-auto mt-6 w-full max-w-5xl font-marathi-display text-[clamp(0.72rem,1.85vw,1.35rem)] font-semibold leading-relaxed text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] whitespace-nowrap text-center">
            <span className="whitespace-nowrap">
              {isMarathi
                ? "कराडची लाडकी मासोळी... समुद्राची खरी चव..! — "
                : "Karad's beloved seafood... Pure oceanic taste..! — "}
            </span>
            <span className="inline-block whitespace-nowrap text-[#38BDF8] font-bold drop-shadow-[0_2px_16px_rgba(56,189,248,0.5)]">
              <span>{displayedText}</span>
              <span
                className="inline-block w-[3px] h-[0.85em] ml-1 bg-[#38BDF8] align-middle animate-pulse"
                aria-hidden="true"
              />
            </span>
          </p>

          {/* The 2 Buttons: [व्हॉट्सॲपवर ऑर्डर द्या] & [आजची ताजी आवक पहा] */}
          <div className="mt-8 sm:mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center w-full sm:w-auto">
            
            {/* Button 1: [व्हॉट्सॲपवर ऑर्डर द्या] (Gradient with WhatsApp Icon & Arrow) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-wide transition-all duration-300 shadow-[0_18px_40px_-14px_rgba(10,154,217,0.75)] hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-14px_rgba(10,154,217,0.95)] px-7 py-3.5 text-base sm:px-9 sm:py-4 bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#25D366] text-white active:scale-95 cursor-pointer font-marathi-display"
              aria-label="Order fresh fish on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-current shrink-0" />
              <span>{isMarathi ? "व्हॉट्सॲपवर ऑर्डर द्या" : "Order on WhatsApp"}</span>
              <ArrowRight className="w-4 h-4 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Button 2: [आजची ताजी आवक पहा] (Frosted Glass Border Button) */}
            <a
              href="#signature"
              onClick={scrollToMenu}
              className="relative inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-wide transition-all duration-300 border-2 border-white/45 bg-black/40 hover:bg-white/20 text-white px-7 py-3.5 text-base sm:px-9 sm:py-4 backdrop-blur-sm active:scale-95 cursor-pointer font-marathi-display"
              aria-label="View Today's Fresh Fish Catch"
            >
              <span>{isMarathi ? "आजची ताजी आवक पहा" : "View Today's Catch"}</span>
            </a>

          </div>

          {/* Centered Bottom Quick Signals (Exact Reference Style) */}
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs sm:text-sm font-semibold text-white/85">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>कराड · जि. सातारा</span>
            </li>

            <li aria-hidden="true" className="hidden h-3.5 w-px bg-white/25 sm:block" />

            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{isMarathi ? "ऑर्डरनंतर ३० मिनिटांत ताजी मासोळी घरपोच" : "Fresh delivery within 30-45 mins"}</span>
            </li>

            <li aria-hidden="true" className="hidden h-3.5 w-px bg-white/25 sm:block" />

            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isMarathi ? "१००% फॉर्मेलिन व केमिकलमुक्त" : "100% Formalin & Chemical Free"}</span>
            </li>
          </ul>

        </div>

        {/* Bouncing Chevron Scroll Down Indicator */}
        <a
          href="#signature"
          onClick={scrollToMenu}
          aria-label="Scroll to signature catch"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full p-2 text-white/70 hover:text-[#FBBF24] transition-colors hidden sm:block"
        >
          <ChevronDown className="w-7 h-7 animate-bounce" />
        </a>
      </div>

      {/* 4. Marquee Catch Ribbon at Bottom of Hero (Matching Hotel Atithi Style) */}
      <div className="relative z-10 border-t border-[#FBBF24]/30 bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#0A9AD9] text-white shadow-lg overflow-hidden py-3">
        <div className="marquee-track">
          <ul className="flex shrink-0 items-center">
            {tickerItems.map((item, idx) => (
              <li key={idx} className="flex items-center font-marathi-display text-sm sm:text-base font-bold text-white tracking-wide">
                <span>{item}</span>
                <span className="mx-4 sm:mx-6 text-[0.65em] text-[#FBBF24]">◆</span>
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 items-center" aria-hidden="true">
            {tickerItems.map((item, idx) => (
              <li key={`dup-${idx}`} className="flex items-center font-marathi-display text-sm sm:text-base font-bold text-white tracking-wide">
                <span>{item}</span>
                <span className="mx-4 sm:mx-6 text-[0.65em] text-[#FBBF24]">◆</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
