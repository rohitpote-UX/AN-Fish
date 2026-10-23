"use client";

import React, { useRef } from "react";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThermometerSnowflake, ShieldCheck, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ColdChainScrub() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const pinContainerRef = useRef<HTMLElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const tempGaugeRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!pinContainerRef.current) return;

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (motionQuery.matches) return;

      // Pinned Scroll Timeline replicating Alethia's "Rock Section" scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.8,
        },
      });

      // 1. Initial State: Panel 1 visible, Panel 2 hidden below
      gsap.set(panel1Ref.current, { opacity: 1, y: 0 });
      gsap.set(panel2Ref.current, { opacity: 0, y: 40 });
      gsap.set(progressFillRef.current, { width: "10%" });

      // 2. Timeline sequence: Panel 1 exits, Panel 2 enters
      tl.to(panel1Ref.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
      })
        .to(
          panel2Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.1"
        )
        .to(
          progressFillRef.current,
          {
            width: "100%",
            duration: 1.0,
            ease: "none",
          },
          0
        );
    },
    { scope: pinContainerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={pinContainerRef}
      id="cold-chain"
      aria-label="The Science of Freshness"
      className="relative min-h-screen bg-[#F5F4F2] py-24 sm:py-32 px-4 sm:px-6 lg:px-12 flex flex-col justify-center border-y border-[#0F1F10]/08 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column (6 cols): Pinned swapping narrative cards */}
        <div className="lg:col-span-6 relative min-h-[380px] flex items-center text-left">
          {/* Card 1: 0°C Slurry Transit */}
          <div
            ref={panel1Ref}
            className="w-full space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0A9AD9]/30 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
              <span>{isMarathi ? "[पायरी ०१ • किनारपट्टी लिलाव ते थेट प्रवास]" : "[PHASE 01 • COASTAL TRANSIT]"}</span>
            </div>

            <h2
              className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.05] ${
                isMarathi ? "font-marathi-display" : "font-latin-display"
              }`}
            >
              {isMarathi
                ? "०°C लिक्विड आईस: पेशी न फाडता नैसर्गिक रस साठवण."
                : "0°C Liquid Ice Slurry: Locking True Moisture at Sub-Zero."}
            </h2>

            <p
              className={`text-base text-[#0F1F10]/70 leading-relaxed max-w-lg ${
                isMarathi ? "font-marathi-body" : "font-sans"
              }`}
            >
              {isMarathi
                ? "सामान्य बर्फाचे मोठे खडे माशांवर दाब टाकतात आणि तापमान ४°C पर्यंत वाढू देतात. आमची मायक्रो-स्लरी माशांना संपूर्ण वेढून ०.०°C स्थिर तापमानावर सुरक्षित ठेवते."
                : "Standard crushed ice leaves uneven air pockets and thermal spikes. Our sub-zero micro-slurry cushions each fish completely, preserving texture and raw ocean flavour."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#0F1F10]/10 text-xs font-mono-accent font-bold text-[#0F1F10]">
                ०.०°C CONSTANT
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#0F1F10]/10 text-xs font-mono-accent font-bold text-[#0A9AD9]">
                UNDER 6 HOURS
              </span>
            </div>
          </div>

          {/* Card 2: Precision Hygienic Cutting (Positioned absolutely over Card 1) */}
          <div
            ref={panel2Ref}
            className="w-full space-y-6 absolute top-0 left-0"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0A9AD9]/30 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
              <span>{isMarathi ? "[पायरी ०२ • शून्य-घाण कटिंग व पॅकेजिंग]" : "[PHASE 02 • HYGIENIC CUTTING]"}</span>
            </div>

            <h2
              className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.05] ${
                isMarathi ? "font-marathi-display" : "font-latin-display"
              }`}
            >
              {isMarathi
                ? "स्वच्छ आरओ पाण्यातून अचूक पाककृती कटिंग."
                : "Culinary Precision Cuts in 100% Filtered RO Water."}
            </h2>

            <p
              className={`text-base text-[#0F1F10]/70 leading-relaxed max-w-lg ${
                isMarathi ? "font-marathi-body" : "font-sans"
              }`}
            >
              {isMarathi
                ? "कोणतीही वाळू किंवा घाण न ठेवता, संपूर्ण स्वच्छता राखून तुमच्या आवडीनुसार: रवा फ्रायच्या पातळ चकत्या, रस्सा कट किंवा बोनलेस फिलेट."
                : "No grit, zero blood residue. Cleaned in running filtered water and tailored exactly to your home recipe before vacuum-chilled dispatch."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#0F1F10]/10 text-xs font-mono-accent font-bold text-[#0F1F10]">
                RO FILTERED WASH
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#0F1F10]/10 text-xs font-mono-accent font-bold text-[#0A9AD9]">
                ZERO FORMALIN
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Visual Telemetry Card & Ice Slurry Gauge */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#0F1F10]/08 shadow-xl space-y-6 text-left relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF8FF] flex items-center justify-center text-[#0A9AD9]">
                  <ThermometerSnowflake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono-accent uppercase tracking-wider text-[#0F1F10]/60">
                    {isMarathi ? "रिअल-टाइम तापमान नियंत्रण" : "COLD CHAIN TELEMETRY"}
                  </div>
                  <div className="text-sm font-bold text-[#0F1F10]">
                    {isMarathi ? "किनारपट्टी ते कराड व्हॅन ट्रान्झिट" : "Coast-to-Karad Transit"}
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#EBF8FF] text-xs font-mono-accent text-[#0A9AD9] font-bold">
                0.0°C LIVE
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono-accent text-[#0F1F10]/60 font-semibold">
                <span>रत्नागिरी / मालवण बंदर</span>
                <span>कराड स्टोअर</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#F5F4F2] overflow-hidden p-0.5">
                <div
                  ref={progressFillRef}
                  className="h-full rounded-full bg-[#0A9AD9] transition-all"
                  style={{ width: "20%" }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F10]/80">
                <CheckCircle2 className="w-4 h-4 text-[#0A9AD9] shrink-0" />
                <span>पहाटे ४:०० AM निवड</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F10]/80">
                <CheckCircle2 className="w-4 h-4 text-[#0A9AD9] shrink-0" />
                <span>सब-झिरो स्लरी</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F10]/80">
                <CheckCircle2 className="w-4 h-4 text-[#0A9AD9] shrink-0" />
                <span>१००% रसायनमुक्त</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F10]/80">
                <CheckCircle2 className="w-4 h-4 text-[#0A9AD9] shrink-0" />
                <span>घरपोच डिलिव्हरी</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
