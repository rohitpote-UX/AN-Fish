import React from "react";
import { getTranslations } from "next-intl/server";
import { PLACEHOLDERS } from "@/data/placeholders";
import { ShieldCheck, Anchor, Heart, Award } from "lucide-react";

interface HeritageStoryProps {
  locale: string;
}

export async function HeritageStory({ locale }: HeritageStoryProps) {
  const t = await getTranslations("familyStory");
  const isMarathi = locale === "mr";

  const pillars = [
    {
      icon: Anchor,
      titleMr: "पहाटे ४:०० AM थेट बंदरावरून",
      titleEn: "4:00 AM Harbour Direct",
      descMr: "मध्यस्थ नाही. रत्नागिरी व मालवण बंदरात बोट लागताच उत्कृष्ट मासोळी थेट आमच्या हाती येते.",
      descEn: "No middlemen. Certified scouts hand-inspect lots as dawn boats dock at Ratnagiri & Malvan.",
    },
    {
      icon: ShieldCheck,
      titleMr: "१००% फॉर्मेलिन व केमिकलमुक्त",
      titleEn: "100% Formalin-Free",
      descMr: "मासोळी टिकवण्यासाठी कोणतीही रसायने वापरली जात नाहीत. केवळ ०°C लिक्विड आईसचा नैसर्गिक थंडावा.",
      descEn: "Zero chemicals, zero ammonia. Preserved solely through sub-zero liquid ice physics.",
    },
    {
      icon: Heart,
      titleMr: "कुटुंबासारखी काळजी (लाडकी)",
      titleEn: "Curated Like Family",
      descMr: "जशी आई किंवा आजी बाजारात स्वतःसाठी निवडून घेते, अगदी तशीच पारख प्रत्येक मासोळीची केली जाते.",
      descEn: "Curated with the affectionate scrutiny of a mother choosing food for her own children.",
    },
    {
      icon: Award,
      titleMr: "स्वच्छ-कक्ष कटिंग स्टँडर्ड्स",
      titleEn: "Clean-Room Butchering",
      descMr: "आरओ पाण्याने स्वच्छता, सर्जिकल स्टेनलेस स्टील टेबल्स व शून्य दुर्गंधीयुक्त वातावरण.",
      descEn: "Purified RO water washes, surgical stainless-steel butchering, and odor-free packout.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-gradient-to-b from-[#063A63]/30 to-[#02111F]/80 border border-[#6EC6F0]/20 p-8 sm:p-14 backdrop-blur-md">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase">
            // {t("tag")} • {PLACEHOLDERS.FOUNDING_YEAR}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t("title")}
          </h2>
          <blockquote className="text-base sm:text-xl text-[#6EC6F0] italic border-y border-[#6EC6F0]/20 py-6 my-6">
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
          <p className="text-sm sm:text-base text-[#E9F7FF]/85 leading-relaxed text-left sm:text-center">
            {t("storyP1")}
          </p>
          <p className="text-sm sm:text-base text-[#E9F7FF]/85 leading-relaxed text-left sm:text-center">
            {t("storyP2")}
          </p>
          <div className="pt-4 text-xs font-mono-accent text-[#6EC6F0] tracking-wider uppercase">
            {t("signature")}
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-[#6EC6F0]/15">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#05080C]/60 border border-[#6EC6F0]/15 p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A9AD9]/20 border border-[#0A9AD9]/40 flex items-center justify-center text-[#6EC6F0]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {isMarathi ? p.titleMr : p.titleEn}
                </h3>
                <p className="text-xs text-[#E9F7FF]/70 leading-relaxed">
                  {isMarathi ? p.descMr : p.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
