"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fish, ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function OurFish() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".our-fish-card");

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      id="our-fish"
      aria-label="Our Fish"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold">
            <Fish className="w-3.5 h-3.5" />
            <span>{isMarathi ? "आमची मासोळी • OUR FISH" : "OUR FISH • आमची मासोळी"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "प्रत्येक ताटासाठी अस्सल ताजी मासोळी." : "Fresh Fish for Every Table."}
          </h2>

          <p
            className={`text-base sm:text-xl text-[#0F1F10]/70 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "घरातील रोजच्या जेवणापासून ते प्रतिष्ठित हॉटेल्सच्या किचनपर्यंत, गुणवत्तेशी कोणतीही तडजोड नाही."
              : "Whether dining with your family or running high-volume restaurant services, our cold chain delivers excellence."}
          </p>
        </div>

        {/* Two Large Cards: Card 1 For Your Family, Card 2 For Your Business */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: For Your Family */}
          <Link
            href="/catch"
            className="our-fish-card group relative rounded-3xl overflow-hidden bg-white border border-[#0F1F10]/10 hover:border-[#0A9AD9] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F1F10]">
              <Image
                src="/media/family-dinner.jpg"
                alt="Fresh fish for your family dinner"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0A9AD9] text-white text-xs font-mono-accent font-bold uppercase tracking-wider shadow-md">
                  {isMarathi ? "घरच्या जेवणासाठी" : "For Your Family"}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
              <div>
                <h3
                  className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] group-hover:text-[#0A9AD9] transition-colors leading-tight ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? "तुमच्या जवळच्या दालनात दररोज ताजी आवक" : "Fresh at Your Nearest Counter"}
                </h3>
                <p
                  className={`mt-2 text-sm sm:text-base text-[#0F1F10]/70 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {isMarathi
                    ? "सुरमई, पापलेट, हलवा व जिवंत नदीचे मासे. आरओ पाण्यात स्वच्छ धुऊन आपल्या पसंतीनुसार रवा फ्राय चकत्या किंवा करी कटिंग मोफत."
                    : "Surmai, Pomfret, Prawns and River Catch. Cleaned with RO water and sliced to your preference while you watch."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#0F1F10]/10 flex items-center justify-between text-xs font-mono-accent font-bold text-[#0A9AD9] uppercase tracking-wider">
                <span>{isMarathi ? "आजची आवक पहा" : "Explore Family Catch"}</span>
                <div className="w-8 h-8 rounded-full bg-[#EBF8FF] flex items-center justify-center group-hover:bg-[#0A9AD9] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: For Your Business */}
          <Link
            href="/wholesale"
            className="our-fish-card group relative rounded-3xl overflow-hidden bg-white border border-[#0F1F10]/10 hover:border-[#0A9AD9] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F1F10]">
              <Image
                src="/media/b2b-chef.jpg"
                alt="Reliable seafood supply for restaurants"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#063A63] text-white text-xs font-mono-accent font-bold uppercase tracking-wider shadow-md">
                  {isMarathi ? "हॉटेल्स व व्यवसायासाठी" : "For Your Business"}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
              <div>
                <h3
                  className={`text-2xl sm:text-3xl font-bold text-[#0F1F10] group-hover:text-[#0A9AD9] transition-colors leading-tight ${
                    isMarathi ? "font-marathi-display" : "font-latin-display"
                  }`}
                >
                  {isMarathi ? "व्यस्त किचनसाठी खात्रीशीर व नियमित घाऊक पुरवठा" : "Reliable Supply for Busy Kitchens"}
                </h3>
                <p
                  className={`mt-2 text-sm sm:text-base text-[#0F1F10]/70 leading-relaxed ${
                    isMarathi ? "font-marathi-body" : "font-sans"
                  }`}
                >
                  {isMarathi
                    ? "कराड आणि सातारा जिल्ह्यातील अग्रगण्य हॉटेल्स, केटरर्स आणि रेस्टॉरंट्सना अखंड ०°C तापमानात वेळेवर बल्क डिलिव्हरी."
                    : "Zero-wastage bulk deliveries with cold-chain slurry packaging, consistent sizing, and priority morning fulfillment."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#0F1F10]/10 flex items-center justify-between text-xs font-mono-accent font-bold text-[#0A9AD9] uppercase tracking-wider">
                <span>{isMarathi ? "घाऊक दरपत्रक पहा" : "Wholesale Partnerships"}</span>
                <div className="w-8 h-8 rounded-full bg-[#EBF8FF] flex items-center justify-center group-hover:bg-[#0A9AD9] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
