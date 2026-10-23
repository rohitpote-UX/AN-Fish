"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Clock, ShieldCheck, ThermometerSnowflake, Waves, Sparkles, CheckCircle2 } from "lucide-react";

interface TickerCardItem {
  icon: React.ComponentType<{ className?: string }>;
  tagMr: string;
  tagEn: string;
  titleMr: string;
  titleEn: string;
  detailMr: string;
  detailEn: string;
}

const TICKER_ITEMS: TickerCardItem[] = [
  {
    icon: Clock,
    tagMr: "01 • लिलाव",
    tagEn: "01 • AUCTION",
    titleMr: "पहाटे ४:०० AM थेट लिलाव",
    titleEn: "4:00 AM Harbor Auctions",
    detailMr: "रत्नागिरी आणि मालवणच्या बोटींवरून सर्वात ताजी मासोळी थेट निवडली जाते.",
    detailEn: "Hand-picked at dawn harbor landings directly from coastal fishermen.",
  },
  {
    icon: ThermometerSnowflake,
    tagMr: "02 • शीतसाखळी",
    tagEn: "02 • COLD CHAIN",
    titleMr: "०°C लिक्विड आईस तंत्रज्ञान",
    titleEn: "0°C Liquid Ice Slurry",
    detailMr: "सामान्य बर्फापेक्षा अधिक सुरक्षित, प्रत्येक माशाचे तापमान ०°C वर स्थिर राहते.",
    detailEn: "Sub-zero ice slurry locks cell moisture and preserves deep natural ocean flavor.",
  },
  {
    icon: ShieldCheck,
    tagMr: "03 • सुरक्षितता",
    tagEn: "03 • 100% CLEAN",
    titleMr: "१००% फॉर्मेलिनमुक्त हमी",
    titleEn: "100% Chemical-Free",
    detailMr: "कोणत्याही घातक रसायनांशिवाय, प्रयोगशाळा तपासणीसह १००% सुरक्षित अन्न.",
    detailEn: "Zero chemical preservatives or formalin, verified by stringent food safety checks.",
  },
  {
    icon: Waves,
    tagMr: "04 • वेगवान",
    tagEn: "04 • TRANSIT",
    titleMr: "६ तासांत समुद्र ते कराड",
    titleEn: "Sea-to-Karad in 6 Hours",
    detailMr: "सकाळच्या लिलावानंतर दुपारपर्यंत कराडमधील आमच्या दोन्ही स्टोअर्समध्ये उपलब्ध.",
    detailEn: "Fast temperature-controlled logistics from coastal docks to Karad retail counters.",
  },
  {
    icon: Sparkles,
    tagMr: "05 • कस्टमायझेशन",
    tagEn: "05 • CUTTING",
    titleMr: "तुकडे व साफसफाई मोफत",
    titleEn: "Custom Cutting & Cleaning",
    detailMr: "तुमच्या आवडीनुसार: रवा फ्राय तुकडे, रस्सा कट, फिलेट किंवा संपूर्ण साफ.",
    detailEn: "Precision cuts customized for your recipe: curry-cut, thin fry slices, or fillets.",
  },
  {
    icon: CheckCircle2,
    tagMr: "06 • स्थानिक",
    tagEn: "06 • LOCAL",
    titleMr: "कृष्णा-कोयना ताजी गोड आवक",
    titleEn: "Freshwater River Catch",
    detailMr: "स्थानिक काठावरील जिवंत रोहू, कटला आणि ताजी गोड्या पाण्याची मासोळी.",
    detailEn: "Daily local river catch harvested from freshwater Krishna and Koyna currents.",
  },
];

export function Ticker() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  // Duplicate items for continuous seamless CSS marquee
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      aria-label="Freshness Guarantees Ticker"
      className="relative w-full py-10 bg-[#F5F4F2] border-y border-[#0F1F10]/08 overflow-hidden select-none"
    >
      <div className="flex w-max shrink-0 items-center gap-6 animate-ticker group-hover:[animation-play-state:paused]">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="w-72 sm:w-80 p-6 rounded-2xl bg-white border border-[#0F1F10]/08 shadow-sm flex flex-col justify-between h-48 shrink-0 hover:border-[#0A9AD9] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-accent uppercase tracking-wider text-[#0A9AD9] font-bold">
                  {isMarathi ? item.tagMr : item.tagEn}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#EBF8FF] flex items-center justify-center text-[#0A9AD9]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0F1F10] tracking-tight">
                  {isMarathi ? item.titleMr : item.titleEn}
                </h3>
                <p className="text-xs text-[#0F1F10]/65 mt-1.5 line-clamp-2 leading-relaxed">
                  {isMarathi ? item.detailMr : item.detailEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes tickerLoop {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: tickerLoop 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .animate-ticker {
            animation-duration: 25s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ticker {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
