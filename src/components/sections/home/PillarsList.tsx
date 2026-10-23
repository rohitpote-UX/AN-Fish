"use client";

import React, { useRef } from "react";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Clock, ThermometerSnowflake, HeartHandshake } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PillarItem {
  num: string;
  titleMr: string;
  titleEn: string;
  descMr: string;
  descEn: string;
  metricMr: string;
  metricEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PILLARS: PillarItem[] = [
  {
    num: "01",
    titleMr: "पहाटे ४:०० AM थेट लिलावातून खरेदी",
    titleEn: "4:00 AM Direct Coastal Harbor Sourcing",
    descMr: "मध्यस्थांना बाजूला ठेवून आमचे प्रतिनिधी दररोज पहाटे रत्नागिरी आणि मालवणच्या बंदरांवर स्वतः हजर राहून सर्वोत्तम बोटींमधून पहिली ताजी आवक निवडतात.",
    descEn: "Bypassing middlemen, our sourcing experts personally inspect and purchase directly from the dawn landing boats at Ratnagiri and Malvan harbours.",
    metricMr: "१००% थेट बंदर खरेदी",
    metricEn: "100% Direct Dock Sourcing",
    icon: Clock,
  },
  {
    num: "02",
    titleMr: "०°C सब-झिरो लिक्विड आईस साठवण",
    titleEn: "0°C Sub-Zero Liquid Ice Slurry",
    descMr: "पारंपरिक कोरड्या बर्फामुळे माशांच्या पेशी फुटतात. आमचे ०°C लिक्विड आईस तंत्रज्ञान माशांना पापुद्र्यासारखे वेढून ठेवते, ज्यामुळे नैसर्गिक रस आणि चव तशीच राहते.",
    descEn: "Traditional block ice crushes fish tissue. Our liquid ice slurry envelopes each fish at constant 0°C, locking cellular moisture and authentic coastal taste.",
    metricMr: "०°C स्थिर तापमान",
    metricEn: "0°C Constant Temperature",
    icon: ThermometerSnowflake,
  },
  {
    num: "03",
    titleMr: "१००% फॉर्मेलिन व रसायनमुक्त हमी",
    titleEn: "100% Chemical & Formalin-Free",
    descMr: "माशांचा ताजेपणा टिकवण्यासाठी बाजारात होणाऱ्या कोणत्याही प्रकारच्या हानिकारक रसायनांच्या वापरावर आमची शून्य सहनशीलता आहे. प्रत्येक खेप लॅब-चाचणीतून मंजूर होते.",
    descEn: "Zero tolerance for chemical preservatives. Every single consignment is strictly certified formalin-free and food-grade tested before retail display.",
    metricMr: "कडक लॅब चाचणी",
    metricEn: "Certified Safe & Pure",
    icon: Shield,
  },
  {
    num: "04",
    titleMr: "कराडकरांच्या पसंतीनुसार मोफत साफसफाई",
    titleEn: "Customized Cuts for Karad Kitchens",
    descMr: "कोकणी रस्सा कट असो, रवा फ्रायच्या पातळ चकत्या असोत की बोनलेस फिलेट — स्वच्छ फिल्टर पाण्यातून अचूक कटिंग करून थेट घरपोच किंवा स्टोअरमधून उपलब्ध.",
    descEn: "Whether thin slices for Rava Fry, juicy pieces for curry, or boneless fillets — washed in filtered water and hygienically packed for your kitchen.",
    metricMr: "तुमच्या आवडीनुसार कट",
    metricEn: "Tailored to Your Recipe",
    icon: HeartHandshake,
  },
];

export function PillarsList() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".pillar-card");

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 65%",
          end: "bottom 35%",
          toggleClass: { targets: card, className: "active-pillar" },
        });
      });
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      id="pillars"
      aria-label="The 4 Pillars of Freshness"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (Sticky Pinned on Desktop) */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <span>{isMarathi ? "आमची तत्त्वे • OUR PROMISE" : "CORE PRINCIPLES • OUR PROMISE"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi
              ? "कराडच्या स्वयंपाकघरासाठी ४ खात्रीशीर नियम."
              : "The 4 Uncompromising Standards Behind Every Catch."}
          </h2>

          <p
            className={`text-base text-[#0F1F10]/70 leading-relaxed max-w-md ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "आम्ही फक्त मासोळी विकत नाही; आम्ही तुमच्या कुटुंबासाठी समुद्राची शुद्धता, चव आणि १००% सुरक्षितता घेऊन येतो."
              : "We don't just sell fish. We feed the families who made us their favourite with certified freshness and authentic coastal trust."}
          </p>
        </div>

        {/* Right Column (Scrolling Cards with Active Morphing) */}
        <div className="lg:col-span-7 space-y-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="pillar-card p-8 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 transition-all duration-300 opacity-60 flex flex-col justify-between space-y-6"
              >
                <div className="flex items-center justify-between">
                  {/* Number Badge Pill */}
                  <div className="pillar-num-badge w-14 h-14 rounded-full bg-white border border-[#0F1F10]/10 flex items-center justify-center font-mono-accent text-xl font-bold text-[#0F1F10] transition-colors duration-300">
                    {pillar.num}
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-mono-accent text-[#0A9AD9] font-semibold border border-[#0F1F10]/05">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{isMarathi ? pillar.metricMr : pillar.metricEn}</span>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] tracking-tight leading-snug ${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    }`}
                  >
                    {isMarathi ? pillar.titleMr : pillar.titleEn}
                  </h3>
                  <p
                    className={`mt-3 text-sm sm:text-base text-[#0F1F10]/70 leading-relaxed ${
                      isMarathi ? "font-marathi-body" : "font-sans"
                    }`}
                  >
                    {isMarathi ? pillar.descMr : pillar.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .pillar-card.active-pillar {
          opacity: 1 !important;
          background-color: #ffffff !important;
          box-shadow: 0 16px 36px rgba(10, 154, 217, 0.08) !important;
          border-color: rgba(10, 154, 217, 0.3) !important;
          transform: translateY(-2px);
        }
        .pillar-card.active-pillar .pillar-num-badge {
          background-color: #0a9ad9 !important;
          color: #ffffff !important;
          border-color: #0a9ad9 !important;
        }
      `}</style>
    </section>
  );
}
