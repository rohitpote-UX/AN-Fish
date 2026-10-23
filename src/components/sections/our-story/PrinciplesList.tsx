"use client";

import React, { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Sparkles, Scale, Droplet, MapPin, Heart } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Principle {
  num: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  badgeEn: string;
  badgeMr: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRINCIPLES: Principle[] = [
  {
    num: "01",
    titleEn: "Fresh First",
    titleMr: "ताजेपणा प्रथम आणि सर्वात आधी",
    descEn: "If it didn't land at coastal harbours this morning, it doesn't cross our counters. No day-old catch, no compromises on ocean vibrancy.",
    descMr: "आज पहाटेच्या लिलावातून आलेली नसेल, तर ती मासोळी आमच्या दालनात प्रवेश करत नाही. शिळा साठा किंवा कालचा माल ठेवण्यास पूर्ण बंदी.",
    badgeEn: "Dawn Pier Sourcing",
    badgeMr: "पहाटेचा थेट लिलाव",
    icon: Sparkles,
  },
  {
    num: "02",
    titleEn: "Honest Weight",
    titleMr: "चोख डिजिटल वजन, पारदर्शक व्यवहार",
    descEn: "Digital accuracy on every scale down to the single gram. No hidden ice weight, no rounding errors. What you see is what you pay.",
    descMr: "प्रत्येक काट्यावर डिजिटल अचूकता. बर्फाचे छुपे वजन नाही की वजनात गडबड नाही. जे काट्यावर दिसते, तेच तुमच्या बिलात येते.",
    badgeEn: "100% Calibrated Scales",
    badgeMr: "डिजिटल खात्री",
    icon: Scale,
  },
  {
    num: "03",
    titleEn: "Clean by Design",
    titleMr: "रचनेतूनच स्वच्छतेची हमी",
    descEn: "Purified RO water washes only, sanitized stainless steel tables, and complimentary cuts tailored to your recipe while you watch.",
    descMr: "फक्त शुद्ध आरओ पाण्याचा वापर, निर्जंतुक स्टेनलेस स्टील कटिंग टेबल आणि तुमच्या डोळ्यांसमोर मोफत व चोख कटिंग.",
    badgeEn: "Purified RO Water Only",
    badgeMr: "आरओ पाण्याची स्वच्छता",
    icon: Droplet,
  },
  {
    num: "04",
    titleEn: "Every Branch, Same Care",
    titleMr: "प्रत्येक दालनात तीच आपुलकी व गुणवत्ता",
    descEn: "From our Karad Malkapur flagship to Patan Mhavashi and Ishwarpur, the exact same 0°C cold chain and standards protect your family dinner.",
    descMr: "कराड मलकापूर, पाटण म्हावशी आणि ईश्वरपूर — सर्व दालनांत तीच अखंड ०°C शीतसाखळी आणि समान आदरातिथ्य.",
    badgeEn: "Uniform Cold Chain",
    badgeMr: "एकसमान शीतसाखळी",
    icon: MapPin,
  },
  {
    num: "05",
    titleEn: "Family Always",
    titleMr: "ग्राहक नव्हे, आमचा लाडका परिवार",
    descEn: "We select and prepare fish with the reverence of shopping for our own children and elders. ‘आमच्या लाडक्या ग्राहकांची लाडकी फिश कंपनी.’",
    descMr: "आम्ही प्रत्येक ग्राहकाचा मासा स्वतःच्या मुलाबाळांसाठी आणि आईवडिलांसाठी खरेदी करतो तितक्याच आत्मीयतेने निवडतो. आमच्या लाडक्या ग्राहकांची लाडकी फिश कंपनी.",
    badgeEn: "Our Sacred Promise",
    badgeMr: "पवित्र वचन",
    icon: Heart,
  },
];

export function PrinciplesList() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".principle-card");

      cards.forEach((card, idx) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx),
        });
      });
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      id="principles"
      aria-label="Our Principles"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Sticky Left Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>{isMarathi ? "आमची ५ तत्त्वे • OUR PRINCIPLES" : "OUR 5 PRINCIPLES • आमची ५ तत्त्वे"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi
              ? "ज्या तत्त्वांवर आमचा प्रत्येक दिवस उभा आहे."
              : "The Five Rules We Never Break."}
          </h2>

          <p
            className={`text-base sm:text-lg text-[#0F1F10]/75 leading-relaxed max-w-md ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "व्यवसाय वाढेल, दालने वाढतील; पण या पाच मूल्यांवर कधीही कोणतीही तडजोड होणार नाही."
              : "Branches will multiply, seasons will turn; but these five founding values remain carved in stone."}
          </p>

          {/* Indicator dots */}
          <div className="flex items-center gap-2 pt-4">
            {PRINCIPLES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-10 bg-[#0A9AD9]" : "w-2.5 bg-[#0F1F10]/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: 5 Numbered Cards */}
        <div className="lg:col-span-7 space-y-6">
          {PRINCIPLES.map((p, idx) => {
            const Icon = p.icon;
            const isActive = idx === activeIndex;

            return (
              <div
                key={p.num}
                className={`principle-card p-8 rounded-3xl transition-all duration-300 border flex flex-col justify-between space-y-5 ${
                  isActive
                    ? "bg-white border-[#0A9AD9]/40 shadow-xl opacity-100 -translate-y-1"
                    : "bg-[#F5F4F2] border-[#0F1F10]/08 opacity-45 hover:opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Number Badge */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-mono-accent text-xl font-bold transition-colors duration-300 ${
                      isActive
                        ? "bg-[#0A9AD9] text-white shadow-md shadow-[#0A9AD9]/30"
                        : "bg-white border border-[#0F1F10]/10 text-[#0F1F10]"
                    }`}
                  >
                    {p.num}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono-accent font-semibold px-3 py-1 rounded-full bg-white/80 border border-[#0F1F10]/05 text-[#0A9AD9]">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{isMarathi ? p.badgeMr : p.badgeEn}</span>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] tracking-tight leading-snug ${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    }`}
                  >
                    {isMarathi ? p.titleMr : p.titleEn}
                  </h3>
                  <p
                    className={`mt-3 text-base sm:text-lg text-[#0F1F10]/75 leading-relaxed ${
                      isMarathi ? "font-marathi-body" : "font-sans"
                    }`}
                  >
                    {isMarathi ? p.descMr : p.descEn}
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
