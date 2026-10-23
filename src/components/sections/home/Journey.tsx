"use client";

import React, { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Snowflake, Anchor, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function Journey() {
  const t = useTranslations("freshness");
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".journey-step", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const steps = [
    { num: "01", icon: Anchor, title: t("step1Title"), desc: t("step1Desc"), tag: "Ratnagiri & Malvan" },
    { num: "02", icon: Snowflake, title: t("step2Title"), desc: t("step2Desc"), tag: "0°C Liquid Ice Slurry" },
    { num: "03", icon: ShieldCheck, title: t("step3Title"), desc: t("step3Desc"), tag: "0.0% Formalin Tested" },
    { num: "04", icon: Sparkles, title: t("step4Title"), desc: t("step4Desc"), tag: "RO Purified Clean Room" },
  ];

  return (
    <section
      ref={containerRef}
      id="journey"
      data-section="journey"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063A63]/30 border border-[#0A9AD9]/40 text-xs font-mono-accent text-[#6EC6F0] mb-4">
          <Snowflake className="w-3.5 h-3.5" />
          <span>DEPTH: 50M • THE 4:00 AM VOYAGE</span>
        </div>

        <h2
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight`}
        >
          {t("title")}
        </h2>
        <p
          className={`mt-4 text-base sm:text-lg text-[#E9F7FF]/80 ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="journey-step relative p-7 rounded-2xl bg-[#02111F]/80 border border-[#6EC6F0]/20 hover:border-[#0A9AD9] backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(10,154,217,0.25)]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0A9AD9]/20 border border-[#0A9AD9]/30 flex items-center justify-center text-[#6EC6F0]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono-accent text-2xl font-black text-white/20">
                    {step.num}
                  </span>
                </div>

                <h3
                  className={`${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  } text-xl font-bold text-white mb-3`}
                >
                  {step.title}
                </h3>

                <p
                  className={`text-xs sm:text-sm text-white/75 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono-accent text-[#6EC6F0]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0A9AD9]" />
                <span>{step.tag}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
