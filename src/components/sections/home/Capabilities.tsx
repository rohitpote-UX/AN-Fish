"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Capability {
  num: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  tagEn: string;
  tagMr: string;
  image: string;
}

const CAPABILITIES: Capability[] = [
  {
    num: "01",
    titleEn: "Fresh, Every Day",
    titleMr: "दररोज ताजी आवक",
    descEn: "Stock is brought in fresh and shown on the counter so you can see what you buy.",
    descMr: "दररोज पहाटे ताजी आवक दालनात आणली जाते आणि ग्राहकांना थेट पाहून निवडता येते.",
    tagEn: "Dawn Harvest",
    tagMr: "पहाटेचा लिलाव",
    image: "/media/counter-landscape.jpg",
  },
  {
    num: "02",
    titleEn: "Cut Your Way",
    titleMr: "तुमच्या आवडीनुसार कटिंग",
    descEn: "Whole, curry cut or fillet, cleaned while you wait.",
    descMr: "संपूर्ण मासा, करी कट, रवा फ्राय चकत्या किंवा बोनलेस फिलेट — समोर स्वच्छ करून मोफत कटिंग.",
    tagEn: "Hygienic RO Clean",
    tagMr: "आरओ पाण्याची स्वच्छता",
    image: "/media/cutting-hygiene.jpg",
  },
  {
    num: "03",
    titleEn: "Honest Weight, Fair Price",
    titleMr: "चोख वजन, रास्त दर",
    descEn: "What you see is what you pay for.",
    descMr: "डिजिटल काट्यावर पारदर्शक वजन आणि रोजच्या बाजारभावाप्रमाणे रास्त दर.",
    tagEn: "Digital Precision",
    tagMr: "डिजिटल खात्री",
    image: "/media/counter-landscape.jpg",
  },
  {
    num: "04",
    titleEn: "Same Quality at Every Branch",
    titleMr: "प्रत्येक दालनात तीच हमी",
    descEn: "Karad, Patan, Ishwarpur and beyond.",
    descMr: "कराड, पाटण, ईश्वरपूर व सर्व दालनांवर अखंड ०°C शीतसाखळीने तीच दर्जेदार चव.",
    tagEn: "3 Counter Hubs",
    tagMr: "३ दालने",
    image: "/media/harbour-catch.jpg",
  },
  {
    num: "05",
    titleEn: "Made for Homes and Kitchens",
    titleMr: "घरे आणि हॉटेल्ससाठी परिपूर्ण",
    descEn: "From one family dinner to a wedding or a restaurant.",
    descMr: "एका कौटुंबिक रात्रीच्या जेवणापासून ते विवाह समारंभ आणि हॉटेल घाऊक पुरवठ्यापर्यंत.",
    tagEn: "Family & B2B Supply",
    tagMr: "घाऊक व किरकोळ",
    image: "/media/family-dinner.jpg",
  },
];

export function Capabilities() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const items = gsap.utils.toArray<HTMLElement>(".capability-card");

      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      id="capabilities"
      aria-label="Capabilities"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (Sticky Pinned on Desktop - Alethia Style) */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 text-left"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMarathi ? "आमची वैशिष्ट्ये • CAPABILITIES" : "OUR STANDARDS • CAPABILITIES"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi
              ? "विश्वसनीय ताजी मासोळी, थेट तुमच्या स्वयंपाकघरासाठी."
              : "Built Around Family Trust and Counter Freshness."}
          </h2>

          <p
            className={`text-base text-[#0F1F10]/75 leading-relaxed max-w-md ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "पहाटेच्या लिलावापासून ते तुमच्या हातातील ताटापर्यंत, प्रत्येक टप्प्यावर पारदर्शकता आणि १००% स्वच्छता."
              : "Stock is inspected at the docks, kept in sub-zero slurry, and cleanly sliced right before your eyes."}
          </p>

          {/* Changing Three-Image Stack corresponding to active capability */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#0F1F10]/10 hidden sm:block">
            {CAPABILITIES.map((cap, idx) => (
              <div
                key={cap.num}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === activeIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"
                } transition-all duration-500`}
              >
                <Image
                  src={cap.image}
                  alt={cap.titleEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono-accent">
                  <span className="font-bold tracking-wider uppercase">
                    {cap.num} • {isMarathi ? cap.tagMr : cap.tagEn}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px]">
                    {isMarathi ? "सत्यापित दर्जा" : "Verified Quality"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active progress indicator line */}
          <div className="flex items-center gap-2 pt-2">
            {CAPABILITIES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-10 bg-[#0A9AD9]"
                    : "w-2.5 bg-[#0F1F10]/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column (Scrolling Cards 01–05 with active highlight) */}
        <div className="lg:col-span-7 space-y-6">
          {CAPABILITIES.map((cap, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={cap.num}
                className={`capability-card p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-5 border ${
                  isActive
                    ? "bg-white border-[#0A9AD9]/40 shadow-xl opacity-100 -translate-y-1"
                    : "bg-[#F5F4F2] border-[#0F1F10]/08 opacity-45 hover:opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Number Badge Pill */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-mono-accent text-xl font-bold transition-colors duration-300 ${
                      isActive
                        ? "bg-[#0A9AD9] text-white shadow-md shadow-[#0A9AD9]/30"
                        : "bg-white border border-[#0F1F10]/10 text-[#0F1F10]"
                    }`}
                  >
                    {cap.num}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono-accent font-semibold px-3 py-1 rounded-full bg-white/80 border border-[#0F1F10]/05 text-[#0A9AD9]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isMarathi ? cap.tagMr : cap.tagEn}</span>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] tracking-tight leading-snug ${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    }`}
                  >
                    {isMarathi ? cap.titleMr : cap.titleEn}
                  </h3>
                  <p
                    className={`mt-3 text-base sm:text-lg text-[#0F1F10]/75 leading-relaxed ${
                      isMarathi ? "font-marathi-body" : "font-sans"
                    }`}
                  >
                    {isMarathi ? cap.descMr : cap.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
