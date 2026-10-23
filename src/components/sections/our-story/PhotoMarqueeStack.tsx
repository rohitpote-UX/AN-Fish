"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Camera, Sparkles } from "lucide-react";

interface PhotoItem {
  src: string;
  titleEn: string;
  titleMr: string;
  tagEn: string;
  tagMr: string;
}

const SEVEN_PHOTOS: PhotoItem[] = [
  {
    src: "/media/harbour-catch.jpg",
    titleEn: "4:00 AM Harbour Rush at Malvan",
    titleMr: "मालवण बंदरावरील पहाटेचा लिलाव",
    tagEn: "01 • SOURCING",
    tagMr: "०१ • थेट लिलाव",
  },
  {
    src: "/media/counter-landscape.jpg",
    titleEn: "Malkapur Flagship Counter Display",
    titleMr: "मलकापूर मुख्य दालन व स्वच्छ मांडणी",
    tagEn: "02 • DISPLAY",
    tagMr: "०२ • ताजी मांडणी",
  },
  {
    src: "/media/cutting-hygiene.jpg",
    titleEn: "RO Washed Precision Kitchen Cuts",
    titleMr: "आरओ पाण्याची स्वच्छता व कटिंग",
    tagEn: "03 • HYGIENE",
    tagMr: "०३ • स्वच्छता",
  },
  {
    src: "/media/fresh-fish-display.jpg",
    titleEn: "Gleaming Wild Pomfret & Surmai",
    titleMr: "चमकदार पापलेट व सुरमई",
    tagEn: "04 • FRESHNESS",
    tagMr: "०४ • ताजेपणा",
  },
  {
    src: "/media/team-counter.jpg",
    titleEn: "Our Welcoming Karad Store Team",
    titleMr: "कराड दालनातील तत्पर कर्मचारी",
    tagEn: "05 • TEAM",
    tagMr: "०५ • आमची टीम",
  },
  {
    src: "/media/b2b-chef.jpg",
    titleEn: "Trusted by Commercial Chefs",
    titleMr: "हॉटेल्स व शेफ्सचा अखंड विश्वास",
    tagEn: "06 • PARTNERS",
    tagMr: "०६ • भागीदार",
  },
  {
    src: "/media/family-dinner.jpg",
    titleEn: "Joyful Dinners in Karad Homes",
    titleMr: "घराघरांमध्ये तृप्त जेवणाचा आनंद",
    tagEn: "07 • FAMILIES",
    tagMr: "०७ • समाधानी कुटुंबे",
  },
];

export function PhotoMarqueeStack() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  // Duplicate for continuous infinite horizontal scroll
  const items = [...SEVEN_PHOTOS, ...SEVEN_PHOTOS];

  return (
    <section
      aria-label="Fresh Fish that Families Talk About"
      className="py-24 sm:py-32 bg-[#F5F4F2] border-y border-[#0F1F10]/08 overflow-hidden select-none space-y-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0F1F10]/10 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold shadow-xs">
          <Camera className="w-3.5 h-3.5" />
          <span>{isMarathi ? "दृश्य प्रवास • 7 REAL DISPATCHES" : "7 REAL DISPATCHES • दृश्य प्रवास"}</span>
        </div>

        <h2
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi
            ? "कुटुंबे ज्याची आपुलकीने चर्चा करतात ती ताजी मासोळी."
            : "Fresh Fish that Families Talk About."}
        </h2>

        <p
          className={`text-base sm:text-lg text-[#0F1F10]/70 max-w-2xl mx-auto ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "पहाटेच्या बंदरावरील लिलावापासून ते स्वयंपाकघरातील हसऱ्या चेहऱ्यांपर्यंत — ७ अस्सल क्षणचित्रे."
            : "From dawn harbour bids to sizzling dinner tables — a seven-photo dispatch of real operations in action."}
        </p>
      </div>

      {/* Marquee Stack of 7 Real Photos */}
      <div className="flex w-max shrink-0 items-center gap-6 animate-photo-marquee hover:[animation-play-state:paused] cursor-grab">
        {items.map((photo, idx) => (
          <div
            key={idx}
            className="w-72 sm:w-96 aspect-[4/3] rounded-3xl overflow-hidden bg-[#0F1F10] border border-[#0F1F10]/10 relative shadow-md hover:shadow-2xl transition-all duration-300 group shrink-0"
          >
            <Image
              src={photo.src}
              alt={photo.titleEn}
              fill
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-[10px] font-mono-accent text-[#6EC6F0] uppercase font-bold tracking-wider block">
                {isMarathi ? photo.tagMr : photo.tagEn}
              </span>
              <p className="text-sm sm:text-base font-bold leading-snug">
                {isMarathi ? photo.titleMr : photo.titleEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes photoMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-photo-marquee {
          animation: photoMarquee 42s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-photo-marquee {
            animation-duration: 28s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-photo-marquee {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
