"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Quote } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TrustStatement() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!imageRef.current) return;

      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(10% 8% 10% 8% round 24px)", scale: 0.96 },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 75%",
            end: "bottom 65%",
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
      id="trust-need"
      aria-label="The Need for Trust, Not Just Taste"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Statement in Founder's Voice [C] */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isMarathi ? "आमचा मुख्य संकल्प • FOUNDER'S VOICE" : "THE HEART OF OUR PURPOSE • FOUNDER'S VOICE"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi
              ? "केवळ चव नाही, तर विश्वासाची खरी गरज."
              : "The Need for Trust, Not Just Taste."}
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#0F1F10]/80 leading-relaxed">
            <p>
              {isMarathi
                ? "“पश्चिम महाराष्ट्रात मासे खरेदी करणे म्हणजे अनेक वर्षे केवळ नशिबावर विसंबून राहणे होते. बर्फात मुरलेले शिळे मासे, दुर्गंधी लपवण्यासाठी वापरली जाणारी रसायने आणि वजनातील अनिश्चितता — लोकांना वाटायचे की किनाऱ्यापासून दूर राहिल्यावर हेच भोगावे लागते.”"
                : "“For decades across Western Maharashtra, buying seafood was a game of guesswork. Families accepted heavy odours, harsh chemical preservatives like formalin, and opaque weighing scales simply because they lived inland rather than on the coast.”"}
            </p>
            <p>
              {isMarathi
                ? "“आम्ही जेव्हा कराडच्या मलकापूरमध्ये ए एन फिश वर्ल्ड सुरू केले, तेव्हा आमचा एकच नियम होता: स्वतःच्या मुलाबाळांना जो मासा आम्ही खायला घालू, तोच मासा आमच्या ग्राहकांच्या ताटात गेला पाहिजे. पहाटे ४:०० चा थेट लिलाव, ०°C लिक्विड आईस आणि आरओ पाण्यात स्वच्छता — आम्ही दाखवून दिले की कराडमध्येही समुद्रासारखा ताजा मासा मिळणे सहज शक्य आहे.”"
                : "“When we established AN Fish World in Malkapur, Karad, we made a non-negotiable vow: the fish we sell to our customers must be the exact same fish we feed our own children. Through 4:00 AM harbour auctions, pure 0°C liquid ice slurry, and purified RO water, we proved that Karad can enjoy harbour-fresh catch without a single drop of chemical compromise.”"}
            </p>
          </div>

          <div className="pt-4 border-t border-[#0F1F10]/10 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0A9AD9] shadow-md shrink-0 bg-white">
              <Image
                src="/media/founder-owner-square.webp"
                alt="Ameer Nadaf — Owner of AN Fish, Founder & CEO"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F1F10]">
                {isMarathi ? "अमीर नदाफ" : "Ameer Nadaf"}
              </h4>
              <p className="text-xs text-[#0A9AD9] font-mono-accent font-semibold">
                {isMarathi ? "ए एन फिशचे मालक • संस्थापक / CEO" : "Owner of AN Fish • Founder / CEO"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: High-Impact Image with Reveal (Owner & Founder Portrait) */}
        <div className="lg:col-span-5">
          <div
            ref={imageRef}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[#0F1F10]/10 bg-[#0F1F10] group"
          >
            <Image
              src="/media/founder-owner.jpg"
              alt="Ameer Nadaf — Owner of AN Fish, Founder & CEO"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-6 left-6">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#0F1F10] text-xs font-mono-accent font-bold uppercase tracking-wider shadow-md border border-white/40">
                {isMarathi ? "मालक • संस्थापक / CEO" : "OWNER • FOUNDER / CEO"}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-mono-accent text-[#6EC6F0] uppercase font-bold tracking-wider">
                AN FISH WORLD • KARAD
              </span>
              <p className="text-lg sm:text-xl font-bold font-latin-display">
                {isMarathi ? "अमीर नदाफ" : "Ameer Nadaf"}
              </p>
              <p className="text-xs text-white/70 font-mono-accent">
                {isMarathi ? "ए एन फिशचे मालक, संस्थापक व मुख्य कार्यकारी अधिकारी (CEO)" : "Owner of AN Fish • Founder / CEO"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
