"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Compass } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function VisionBlock() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const containerRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!imageContainerRef.current) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(imageContainerRef.current, { clipPath: "inset(0% 0% 0% 0% round 32px)", scale: 1 });
        return;
      }

      // Reference image-reveal effect: clip-path / scale reveal
      gsap.fromTo(
        imageContainerRef.current,
        { clipPath: "inset(12% 8% 12% 8% round 32px)", scale: 0.94 },
        {
          clipPath: "inset(0% 0% 0% 0% round 32px)",
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      id="vision"
      aria-label="Our Vision"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* Header Block */}
        <div className="max-w-4xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>{isMarathi ? "आमचं स्वप्न • OUR VISION" : "OUR VISION • आमचं स्वप्न"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi
              ? "दालनापासून ते स्वयंपाकघरापर्यंत, आपुलकीने सजवलेले जेवण."
              : "From Counter to Kitchen, Made with Love."}
          </h2>

          <p
            className={`text-lg sm:text-2xl text-[#0F1F10]/70 font-medium leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "एक अशी फिश कंपनी, ज्यावर कुटुंबांचा अतूट विश्वास आहे आणि ज्याची चर्चा अभिमानाने होते."
              : "A fish company that families trust and talk about."}
          </p>
        </div>

        {/* Very Large Landscape Photo of Real Counter with Reference Image-Reveal */}
        <div
          ref={imageContainerRef}
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[#0F1F10]/10 bg-[#0F1F10]"
        >
          <Image
            src="/media/counter-landscape.jpg"
            alt="AN Fish World Karad retail counter"
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Floating bottom label */}
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <span className="text-xs font-mono-accent text-[#6EC6F0] uppercase font-bold tracking-wider block">
                FLAGSHIP STORE • MALKAPUR, KARAD
              </span>
              <p className="text-base sm:text-xl font-bold mt-1">
                {isMarathi ? "दररोज सकाळी ताजी मासोळी आणि पारदर्शक सेवा" : "Daily Morning Harvest & Transparent Display"}
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono-accent border border-white/20 shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isMarathi ? "थेट दालन दृश्य" : "Authentic Counter Photo"}</span>
            </div>
          </div>
        </div>

        {/* Lead Statement & Paragraph */}
        <div className="max-w-4xl mx-auto text-center space-y-6 pt-4">
          <div className="flex items-center justify-center gap-2 text-[#0A9AD9]">
            <Heart className="w-5 h-5 fill-current" />
          </div>

          <blockquote
            className={`text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F1F10] tracking-tight leading-tight ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            &ldquo;{isMarathi ? "आमच्या लाडक्या ग्राहकांची लाडकी फिश कंपनी." : "Our Beloved Customers' Beloved Fish Company."}&rdquo;
          </blockquote>

          {/* Paragraph [C]: 2-3 lines about trust and community, no unverified claims */}
          <p
            className={`text-base sm:text-lg text-[#0F1F10]/75 max-w-2xl mx-auto leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "कराड आणि पश्चिम महाराष्ट्रातील हजारो कुटुंबांचा आमच्यावरील विश्वास हीच आमची सर्वात मोठी संपत्ती आहे. दररोज पहाटे निवडलेली ताजी आवक आणि संपूर्ण पारदर्शकता हेच आमचे व्रत आहे."
              : "The trust of thousands of families across Karad and Western Maharashtra is our greatest milestone. We ensure every fish that reaches your family dinner is fresh to see, honest to weigh, and clean to cook."}
          </p>

          {/* Owner & Founder Badge */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#F5F4EF] border border-[#0F1F10]/10 shadow-xs">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#0A9AD9] shadow-xs shrink-0">
                <Image
                  src="/media/founder-owner-square.webp"
                  alt="Ameer Nadaf — Owner of AN Fish, Founder & CEO"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-bold text-[#0F1F10] block">
                  {isMarathi ? "अमीर नदाफ" : "Ameer Nadaf"}
                </span>
                <span className="text-[10px] font-mono-accent text-[#0A9AD9] font-bold block mt-0.5">
                  {isMarathi
                    ? "ए एन फिशचे मालक • संस्थापक / CEO"
                    : "Owner of AN Fish • Founder / CEO"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
