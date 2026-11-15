"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  Sparkles,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Waves,
  Anchor,
  Clock,
  Snowflake,
  Scissors,
  Award,
  HeartHandshake,
} from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

interface SignatureFish {
  id: string;
  nameMr: string;
  nameEn: string;
  marathiTag: string;
  englishTag: string;
  rate: string;
  image: string;
  cutsMr: string;
  cutsEn: string;
  tasteMr: string;
  tasteEn: string;
  prepMr: string;
  prepEn: string;
}

const SIGNATURE_FISHES: SignatureFish[] = [
  {
    id: "paplet",
    nameMr: "सिल्व्हर पापलेट",
    nameEn: "Silver Pomfret",
    marathiTag: "कराडची लाडकी आवक",
    englishTag: "Karad's Most Beloved",
    rate: PLACEHOLDERS.PRICES.PAPLET,
    image: "/media/hero/pomfret-free.webp",
    cutsMr: "तवा फ्राय कट • अख्खा स्वच्छ • करी कट",
    cutsEn: "Tawa Fry Slices • Whole Cleaned • Curry Cut",
    tasteMr: "अतिशय मऊ, नाजूक आणि तोंडात विरघळणारी गोडसर चव.",
    tasteEn: "Delicate, melt-in-mouth texture with natural sweet oceanic undertone.",
    prepMr: "मालवणी रवा फ्राय किंवा साजूक तुपात तळलेला पापलेट खवय्यांची पहिली पसंती आहे.",
    prepEn: "Crisp Malvani rava fry or shallow butter fry.",
  },
  {
    id: "surmai",
    nameMr: "किंग सुरमई स्टेक्स",
    nameEn: "King Surmai Steaks",
    marathiTag: "सागराचा राजा",
    englishTag: "King of the Ocean",
    rate: PLACEHOLDERS.PRICES.SURMAI,
    image: "/media/hero/surmai-free.webp",
    cutsMr: "गोल स्टेक्स (रवा फ्राय) • कालवण कट • बोनलेस",
    cutsEn: "Round Fry Steaks • Curry Cut • Boneless",
    tasteMr: "मांसल, घट्ट पोत आणि कमी काट्यांची अप्रतिम चव.",
    tasteEn: "Firm, meaty texture with single center bone — Karad's favorite.",
    prepMr: "झणझणीत मालवणी किंवा आगरी पद्धतीचे काळं तिखट कालवण आणि कुरकुरीत फ्राय.",
    prepEn: "Perfect for spicy coastal curry or deep rava fry.",
  },
  {
    id: "prawns",
    nameMr: "रॉयल टायगर कोळंबी",
    nameEn: "Royal Jumbo Tiger Prawns",
    marathiTag: "गोड व रसरशीत",
    englishTag: "Sweet & Juicy Catch",
    rate: PLACEHOLDERS.PRICES.KOLAMBI_TIGER,
    image: "/media/hero/prawns-free.webp",
    cutsMr: "स्वच्छ सोललेली (Devained) • शेपूट ठेवलेली",
    cutsEn: "Peeled & Deveined • Tail-on",
    tasteMr: "कुरकुरीत आणि नैसर्गिक रसाळ गोडवा.",
    tasteEn: "Crisp snap with natural marine sweetness.",
    prepMr: "कोळंबी मसाला, सुक्का किंवा तवा बटर गार्लिक फ्राय.",
    prepEn: "Prawns masala, coastal sukka, or garlic butter toss.",
  },
  {
    id: "rawas",
    nameMr: "इंडियन सामन (रावस)",
    nameEn: "Indian Salmon (Rawas)",
    marathiTag: "ओमेगा-३ समृद्ध",
    englishTag: "Omega-3 Rich & Healthy",
    rate: PLACEHOLDERS.PRICES.RAWAS,
    image: "/media/hero/rawas-free.webp",
    cutsMr: "बोनलेस फिलेट • करी स्टेक्स • फ्राय क्युब्स",
    cutsEn: "Boneless Fillet • Curry Steaks • Fry Cubes",
    tasteMr: "अतिशय पौष्टिक, मऊ व लहान मुलांसाठी उत्तम.",
    tasteEn: "Exceptionally tender, heart-healthy and rich in healthy fats.",
    prepMr: "नारळाच्या दुधातील कालवण किंवा हलके ग्रिल / फ्राय.",
    prepEn: "Coconut milk fish curry or light pan grill.",
  },
];

/**
 * Architectural Stepped Arch Frame Component
 * Perfectly outlines the arched showcase window with concentric mouldings,
 * shoulder impost steps, and stepped base plinth from user reference image.
 */
function ArchPortalFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none absolute inset-0 w-full h-full transition-all duration-500 ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="archGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.95" />
          <stop offset="75%" stopColor="#0A9AD9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="archCyanMoulding" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0A9AD9" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Layer 1: Outer Stepped Arch with Shoulder Impost Transitions */}
      <path
        d="M 12 232 L 12 96 L 22 96 L 22 84 A 78 78 0 0 1 178 84 L 178 96 L 188 96 L 188 232 Z"
        stroke="url(#archGoldGradient)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Layer 2: Concentric Middle Arch */}
      <path
        d="M 22 224 L 22 84 A 78 78 0 0 1 178 84 L 178 224"
        stroke="url(#archCyanMoulding)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Layer 3: Concentric Intermediate Arch Moulding */}
      <path
        d="M 30 216 L 30 84 A 70 70 0 0 1 170 84 L 170 216"
        stroke="url(#archCyanMoulding)"
        strokeWidth="1.3"
        strokeLinejoin="round"
        strokeOpacity="0.8"
      />

      {/* Layer 4: Innermost Window Portal Frame */}
      <path
        d="M 38 208 L 38 84 A 62 62 0 0 1 162 84 L 162 208 Z"
        stroke="url(#archGoldGradient)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Stepped Base Plinth Moldings */}
      <line x1="12" y1="232" x2="188" y2="232" stroke="url(#archGoldGradient)" strokeWidth="2.2" />
      <line x1="22" y1="224" x2="178" y2="224" stroke="url(#archCyanMoulding)" strokeWidth="1.6" />
      <line x1="30" y1="216" x2="170" y2="216" stroke="url(#archCyanMoulding)" strokeWidth="1.3" strokeOpacity="0.8" />
      <line x1="38" y1="208" x2="162" y2="208" stroke="url(#archGoldGradient)" strokeWidth="1.8" />
    </svg>
  );
}

export function SignatureSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const getOrderLink = (fish: SignatureFish) => {
    const text = isMarathi
      ? `नमस्कार AN Fish World कराड, मला आजच्या ताजी आवकमधून "${fish.nameMr}" हवी आहे. कृपया आजचा दर व उपलब्ध वजन सांगा.`
      : isHindi
      ? `नमस्ते AN Fish World कराड, मुझे आज की ताजी आवक से "${fish.nameMr}" चाहिए। कृपया आज का भाव व उपलब्ध वजन बताएं।`
      : `Hello AN Fish World Karad, I want to order "${fish.nameEn}". Please share today's rate and available weight.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // 4-Step Brand Journey from Sea Port to Karad Family Tables
  const storySteps = [
    {
      step: "०१",
      time: isMarathi ? "पहाटे ४:००" : isHindi ? "सुबह ४:००" : "4:00 AM",
      icon: Anchor,
      titleMr: "थेट बंदर लिलावातून निवड",
      titleHi: "सीधे बंदरगाह नीलामी से चयन",
      titleEn: "Direct Harbour Auctions",
      descMr: "रत्नागिरी (मिरकरवाडा) आणि मालवण बंदरावर जहाजे लागताच १ नंबर ए-ग्रेड मासोळी स्वतः निवडली जाते.",
      descHi: "रत्नागिरी और मालवण बंदरगाह पर नौकाएं आते ही १ नंबर ए-ग्रेड मछली स्वयं चुनी जाती है।",
      descEn: "First-pick selection at Ratnagiri & Malvan coastal docks as boats dock at dawn.",
    },
    {
      step: "०२",
      time: isMarathi ? "पहाटे ५:३०" : isHindi ? "सुबह ५:३०" : "5:30 AM",
      icon: Snowflake,
      titleMr: "०°C लिक्विड आईस तंत्रज्ञान",
      titleHi: "०°C लिक्विड आइस तकनीक",
      titleEn: "0°C Slurry Cold Chain",
      descMr: "कोणत्याही घातक केमिकल्स (फॉर्मेलिन/अमोनिया) विना, ०°C नैसर्गिक बर्फाच्या स्लरीमध्ये सुरक्षित प्रवास.",
      descHi: "किसी भी हानिकारक केमिकल (फॉर्मेलिन/अमोनिया) के बिना, ०°C प्राकृतिक बर्फ की स्लरी में सुरक्षित सफर।",
      descEn: "100% chemical-free chilled transit in sub-zero liquid ice slurry preserving live texture.",
    },
    {
      step: "०३",
      time: isMarathi ? "सकाळी ८:००" : isHindi ? "सुबह ८:००" : "8:00 AM",
      icon: Clock,
      titleMr: "कराड दालनात ताजी आवक",
      titleHi: "कराड स्टोर में ताजी आवक",
      titleEn: "Fresh Arrival at Karad",
      descMr: "अवघ्या काही तासांत कराड दालनात आवक. आदल्या दिवसाचे शिळे मासे साठवून ठेवणे आमच्या नियमात बसत नाही.",
      descHi: "कुछ ही घंटों में कराड स्टोर में आवक। पिछले दिन की बासी मछली रखना हमारे उसूलों के खिलाफ है।",
      descEn: "Fresh catch arrives at Karad counter within hours. Zero overnight stale stock guarantee.",
    },
    {
      step: "०४",
      time: isMarathi ? "ग्राहकांनुसार" : isHindi ? "ग्राहकों की पसंद अनुसार" : "On Demand",
      icon: Scissors,
      titleMr: "आरओ स्वच्छता व चोख कटिंग",
      titleHi: "आरओ स्वच्छता व सटीक कटिंग",
      titleEn: "RO Clean & Custom Cuts",
      descMr: "१००% शुद्ध पिण्याच्या आरओ पाण्याने स्वच्छता व निष्णात कारागिरांमार्फत तवा फ्राय, कालवण वा बोनलेस कटिंग.",
      descHi: "१००% शुद्ध पीने के आरओ पानी से सफाई और कुशल कारीगरों द्वारा तवा फ्राई, करी या बोनलेस कटिंग।",
      descEn: "Washed strictly in pure RO drinking water and precision-sliced to your exact recipe preference.",
    },
  ];

  return (
    <section
      id="signature"
      className="relative py-20 lg:py-28 bg-[#071A24] text-white overflow-hidden scroll-mt-20"
      aria-label="Signature Catch & Brand Story"
    >
      {/* 1. Subtle Luxury Textured Background (Identical theme & solid base color) */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1.2px, transparent 1.2px)`,
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />

      {/* 2. Ambient Deep Oceanic Glow Radiance */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A9AD9]/20 via-[#071A24]/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0A9AD9]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#38BDF8]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A9AD9]/15 border border-[#0A9AD9]/35 text-xs font-semibold text-[#6EC6F0] uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>
              {isMarathi
                ? "कराडकरांची पहिली पसंती"
                : isHindi
                ? "कराडवासियों की पहली पसंद"
                : "Karad's Daily Favorites"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-white">
            {isMarathi ? "आमची खासियत" : isHindi ? "हमारी खासियत" : "Our Signature Catches"}
          </h2>

          <p className="text-sm sm:text-base text-white/80 font-marathi-body leading-relaxed max-w-2xl mx-auto">
            {isMarathi
              ? "पहाटे ४:०० वाजता रत्नागिरी व मालवण बंदरातून थेट निवडलेली, ०°C लिक्विड आईसमध्ये सुरक्षित आणलेली कराडकरांची सर्वात लाडकी मासोळी."
              : isHindi
              ? "सुबह ४:०० बजे रत्नागिरी व मालवण बंदरगाह से सीधे चुनी हुई, ०°C लिक्विड आइस में सुरक्षित लाई गई कराड की सबसे चहेती मछली।"
              : "Directly selected at 4:00 AM coastal harbour auctions across Ratnagiri & Malvan, preserved in liquid ice slurry for unmatched freshness."}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-0.5 w-14 bg-gradient-to-r from-transparent to-[#FBBF24]" />
            <Waves className="w-5 h-5 text-[#38BDF8]" />
            <span className="h-0.5 w-14 bg-gradient-to-l from-transparent to-[#FBBF24]" />
          </div>
        </div>

        {/* Brand Story Journey: The 4-Step Freshness Chain */}
        <div className="mb-14 lg:mb-20">
          <div className="rounded-3xl bg-[#092230]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Subtle Texture Inside Story Box */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
                backgroundSize: "18px 18px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              {/* Brand Narrative Banner */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-[#FBBF24] tracking-widest uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#FBBF24]" />
                    {isMarathi ? "ए एन फिश वर्ल्ड ब्रँड कथा" : isHindi ? "ए एन फिश वर्ल्ड ब्रांड कथा" : "AN Fish World Brand Story"}
                  </span>
                  <h3 className="mt-1 text-xl sm:text-2xl font-bold font-marathi-display text-white">
                    {isMarathi
                      ? "सागरापासून कराडकरांच्या ताटापर्यंतचा अस्सल प्रवास"
                      : isHindi
                      ? "समुद्र से कराडवासियों की थाली तक का असली सफर"
                      : "The Authentic Journey from Sea Harbor to Your Plate"}
                  </h3>
                </div>

                {/* Trust Metrics Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071A24] border border-[#0A9AD9]/40 text-xs text-[#6EC6F0] font-semibold">
                  <HeartHandshake className="w-4 h-4 text-[#FBBF24] shrink-0" />
                  <span>
                    {isMarathi
                      ? "१५०+ हॉटेल्सचे विश्वासू पुरवठादार · १५,०००+ समाधानी कुटुंबे"
                      : isHindi
                      ? "१५०+ होटलों के विश्वसनीय सप्लायर · १५,०००+ संतुष्ट परिवार"
                      : "Trusted by 150+ Top Hotels & 15,000+ Families"}
                  </span>
                </div>
              </div>

              {/* 4 Steps Timeline Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {storySteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="group/step relative bg-[#061822]/70 hover:bg-[#0A2738]/90 border border-white/5 hover:border-[#38BDF8]/40 rounded-2xl p-4 sm:p-5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[0.7rem] font-black text-[#FBBF24] tracking-wider uppercase bg-[#FBBF24]/10 border border-[#FBBF24]/30 px-2.5 py-0.5 rounded-full">
                          {item.step}
                        </span>
                        <span className="text-xs font-bold text-[#6EC6F0] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                          {item.time}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A9AD9]/25 to-transparent border border-[#0A9AD9]/40 flex items-center justify-center mb-3 group-hover/step:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-[#38BDF8]" />
                      </div>

                      <h4 className="text-base font-bold text-white font-marathi-display mb-1.5 group-hover/step:text-[#FBBF24] transition-colors">
                        {isMarathi ? item.titleMr : isHindi ? item.titleHi : item.titleEn}
                      </h4>

                      <p className="text-xs text-white/70 leading-relaxed font-marathi-body">
                        {isMarathi ? item.descMr : isHindi ? item.descHi : item.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Village-Perspective Emotional Quote */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-white/85 italic font-marathi-body">
                  {isMarathi
                    ? "“केवळ मासे विकणे हा आमचा व्यवसाय नाही; कोकणच्या बंदराचा अस्सल टवटवीत ताजेपणा प्रत्येक कराडकरांच्या घरात पोहोचवणे हीच आमची ओळख आहे.”"
                    : isHindi
                    ? "“केवल मछली बेचना हमारा व्यापार नहीं है; कोंकण के बंदरगाह की असली ताजगी प्रत्येक कराडवासी के घर तक पहुंचाना ही हमारी पहचान है।”"
                    : "“Selling fish isn't merely our business; delivering pure coastal oceanic freshness to every home in Karad is our heritage.”"}
                </p>
                <span className="text-[0.72rem] font-bold text-[#FBBF24] whitespace-nowrap bg-[#FBBF24]/10 px-3 py-1 rounded-full border border-[#FBBF24]/20">
                  {isMarathi ? "— ए एन फिश वर्ल्ड, कराड" : isHindi ? "— ए एन फिश वर्ल्ड, कराड" : "— AN Fish World, Karad"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Signature Fish Cards with Enhanced Style & Large Arched Window Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SIGNATURE_FISHES.map((fish) => (
            <div
              key={fish.id}
              className="group relative bg-gradient-to-b from-[#0C2A3C] via-[#092230] to-[#071924] border border-white/10 hover:border-[#38BDF8]/70 rounded-[28px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_50px_rgba(10,154,217,0.32)] hover:-translate-y-2 overflow-hidden backdrop-blur-md"
            >
              {/* Subtle Ambient Hover Glow */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#38BDF8]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                aria-hidden="true"
              />

              {/* Top Section: Large Arched Showcase Portal */}
              <div className="relative z-10 w-full mb-4">
                {/* Arched Showcase Container with 280px Height and Full Width */}
                <div className="relative w-full h-64 sm:h-72 rounded-t-[44px] sm:rounded-t-[54px] rounded-b-2xl overflow-hidden shadow-2xl bg-[#031119] group/arch">
                  {/* The Large Fish Photo Filling the Arched Window */}
                  <Image
                    src={fish.image}
                    alt={isMarathi || isHindi ? fish.nameMr : fish.nameEn}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-115 group-hover:-translate-y-1.5"
                  />

                  {/* Bottom Vignette for Smooth Transition into Card Body */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0C2A3C] via-[#0C2A3C]/60 to-transparent pointer-events-none" />

                  {/* Stepped Architectural Arch Frame Vector Overlaid Around Window */}
                  <ArchPortalFrame className="z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_16px_rgba(56,189,248,0.7)]" />

                  {/* Arched Crown Keystone Tag */}
                  <div className="absolute top-2.5 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
                    <span className="px-3.5 py-1 rounded-full text-[0.7rem] font-bold bg-[#071A24]/90 text-[#FBBF24] border border-[#FBBF24]/40 shadow-lg backdrop-blur-md">
                      {isMarathi || isHindi ? fish.marathiTag : fish.englishTag}
                    </span>
                  </div>

                  {/* Freshness Badge Floating on Top Right */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-[#071A24]/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isMarathi ? "१००% ताजे" : isHindi ? "१००% ताजा" : "100% Fresh"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Fish Title & Description */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-black font-marathi-display text-white group-hover:text-[#FBBF24] transition-colors leading-tight">
                    {isMarathi || isHindi ? fish.nameMr : fish.nameEn}
                  </h3>
                </div>

                <p className="text-xs text-white/75 line-clamp-2 leading-relaxed font-marathi-body">
                  {isMarathi || isHindi ? fish.tasteMr : fish.tasteEn}
                </p>

                {/* Free Custom Cuts Pill */}
                <div className="pt-2.5 border-t border-white/10 flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                  <div className="text-[0.72rem] text-white/80 truncate">
                    <span className="text-white/45 uppercase text-[0.65rem] font-bold mr-1.5">
                      {isMarathi ? "मोफत कटिंग:" : isHindi ? "मुफ्त कटिंग:" : "Free Cuts:"}
                    </span>
                    <span className="text-[#38BDF8] font-semibold">
                      {isMarathi || isHindi ? fish.cutsMr : fish.cutsEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer: Daily Rate & WhatsApp CTA */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[0.65rem] text-white/45 uppercase tracking-wider font-semibold">
                    {isMarathi ? "दैनिक बाजार दर" : isHindi ? "दैनिक बाज़ार भाव" : "Daily Rate"}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#FBBF24] tracking-tight tabular-nums drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                    {fish.rate}
                  </span>
                </div>

                <a
                  href={getOrderLink(fish)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#25D366] hover:from-[#38BDF8] hover:to-[#25D366] text-white font-bold text-xs uppercase tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(10,154,217,0.35)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 active:scale-95 cursor-pointer font-marathi-display"
                  aria-label={`Order ${fish.nameEn} on WhatsApp`}
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>{isMarathi ? "मागवा" : isHindi ? "ऑर्डर करें" : "Order"}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View Entire Menu CTA */}
        <div className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#0A9AD9]/40 bg-[#0A9AD9]/10 hover:bg-gradient-to-r hover:from-[#0A9AD9] hover:to-[#0284C7] text-white hover:text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-[0_8px_24px_rgba(10,154,217,0.2)] hover:shadow-[0_12px_32px_rgba(10,154,217,0.4)] hover:-translate-y-0.5 active:scale-95 cursor-pointer font-marathi-display"
          >
            <span>{isMarathi ? "सर्व ताजी मासोळी मेनू पहा" : isHindi ? "संपूर्ण ताजी मछली मेनू देखें" : "View Entire Fresh Fish Menu"}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
