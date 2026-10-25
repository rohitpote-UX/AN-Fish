"use client";

import React, { useRef } from "react";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Eye, Scissors, MapPin, MessageCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TrustItem {
  num: string;
  statementEn: string;
  statementMr: string;
  detailEn: string;
  detailMr: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    num: "01",
    statementEn: "See your fish before you buy",
    statementMr: "खरेदी करण्यापूर्वी मासा स्वतः डोळ्यांनी पहा",
    detailEn: "No hidden packaging, no stale pre-cut trays. Whole wild fish resting transparently on crushed ice for your inspection.",
    detailMr: "कोणतीही छुपी पॅकिंग नाही. स्वच्छ बर्फावर मांडलेली ताजी मासोळी स्वतः पाहून पसंत करा.",
    icon: Eye,
  },
  {
    num: "02",
    statementEn: "Cut and cleaned your way",
    statementMr: "तुमच्या आवडीनुसार स्वच्छता व मोफत कटिंग",
    detailEn: "Custom slices for Rava Fry, curry cuts, or boneless fillets, washed in purified RO water free of charge.",
    detailMr: "रवा फ्राय चकत्या असोत की रस्सा कट, आरओ पाण्यात स्वच्छ धुऊन समोर मोफत कटिंग करून मिळते.",
    icon: Scissors,
  },
  {
    num: "03",
    statementEn: "Same trusted quality at every branch",
    statementMr: "प्रत्येक दालनात तीच खात्रीशीर चव व गुणवत्ता",
    detailEn: "Whether at Karad Malkapur, Patan Mhavashi, or Ishwarpur, the same sub-zero cold chain protects your dinner.",
    detailMr: "कराड मलकापूर असो, पाटण म्हावशी असो वा ईश्वरपूर — सर्व दालनांत तीच अखंड ०°C शीतसाखळी.",
    icon: MapPin,
  },
  {
    num: "04",
    statementEn: "Order in one tap on WhatsApp",
    statementMr: "एका टॅपमध्ये थेट व्हॉट्सॲपवर ऑर्डर द्या",
    detailEn: "Get today's fresh rate card, reserve your favorite catch, and enjoy doorstep delivery across Karad.",
    detailMr: "आजचा दर आणि उपलब्ध मासे त्वरित जाणून घ्या आणि कराडमध्ये घरपोच ताजी डिलिव्हरी मिळवा.",
    icon: MessageCircle,
  },
];

export function TrustStatements() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(".trust-statement-row", { opacity: 1 });
        return;
      }

      const items = gsap.utils.toArray<HTMLElement>(".trust-statement-row");

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 70%",
          end: "bottom 30%",
          toggleClass: { targets: item, className: "active-trust-row" },
        });
      });
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      id="trust"
      aria-label="The Biggest Thing in Fish: Trust"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto space-y-16"
    >
      {/* Headings */}
      <div className="text-left space-y-4">
        {/* H3 [C] */}
        <div className="flex items-center gap-2 text-xs font-mono-accent text-[#0A9AD9] uppercase font-bold tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>{isMarathi ? "मासोळीतील सर्वात मोठी गोष्ट: विश्वास" : "The Biggest Thing in Fish: Trust"}</span>
        </div>

        {/* H2 */}
        <h2
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-[-0.04em] leading-[1.02] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi
            ? "आम्ही फक्त मासोळी विकत नाही. आम्ही कुटुंबांना जेऊ घालतो."
            : "We're Not Just Selling Fish. We're Feeding Families."}
        </h2>

        {/* Sub [C] */}
        <p
          className={`text-lg sm:text-2xl text-[#0F1F10]/70 font-medium ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "डोळ्यांनी पाहण्यासाठी ताजे, काट्यावर चोख वजन, आणि ऑर्डर करण्यासाठी अत्यंत सोपे."
            : "Fresh to look at, honest to weigh, easy to order."}
        </p>
      </div>

      {/* Four Numbered Statements (01-04) Highlighted on Scroll */}
      <div className="space-y-4 sm:space-y-6">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.num}
              className="trust-statement-row p-6 sm:p-8 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 transition-all duration-300 opacity-40 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                {/* Number Badge */}
                <span className="trust-number-badge font-mono-accent text-2xl sm:text-3xl font-black text-[#0F1F10]/40 transition-colors duration-300 shrink-0">
                  {item.num}
                </span>

                <div>
                  <h3
                    className={`text-xl sm:text-2xl md:text-3xl font-bold text-[#0F1F10] leading-snug tracking-tight ${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    }`}
                  >
                    &ldquo;{isMarathi ? item.statementMr : item.statementEn}&rdquo;
                  </h3>
                  <p
                    className={`text-xs sm:text-sm text-[#0F1F10]/70 mt-1.5 leading-relaxed max-w-xl ${
                      isMarathi ? "font-marathi-body" : "font-sans"
                    }`}
                  >
                    {isMarathi ? item.detailMr : item.detailEn}
                  </p>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white border border-[#0F1F10]/10 flex items-center justify-center text-[#0A9AD9] shrink-0 self-end md:self-center shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .trust-statement-row {
          cursor: default;
        }
        .trust-statement-row:hover {
          opacity: 0.85;
          border-color: rgba(10, 154, 217, 0.25);
          background-color: #ffffff;
          transform: translateY(-1px);
        }
        .trust-statement-row.active-trust-row {
          opacity: 1 !important;
          background-color: #ffffff !important;
          box-shadow: 0 16px 40px rgba(10, 154, 217, 0.08) !important;
          border-color: rgba(10, 154, 217, 0.3) !important;
          transform: translateY(-2px);
        }
        .trust-statement-row.active-trust-row .trust-number-badge {
          color: #0a9ad9 !important;
        }
      `}</style>
    </section>
  );
}
