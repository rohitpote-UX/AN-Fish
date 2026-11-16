"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  ArrowRight,
  Waves,
  Anchor,
  Clock,
  Snowflake,
  Scissors,
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


export function SignatureSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";
  const reduce = useReducedMotion();

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
      className="relative py-12 lg:py-16 bg-[#071A24] text-white overflow-hidden scroll-mt-20"
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
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10 space-y-3">
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

        {/* Brand Story Journey: restrained, corporate 4-step process */}
        <div className="mb-10 lg:mb-12">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A2232] p-7 sm:p-12">
            {/* Heading */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#FBBF24]">
                {isMarathi ? "ए एन फिश वर्ल्ड ब्रँड कथा" : isHindi ? "ए एन फिश वर्ल्ड ब्रांड कथा" : "AN Fish World Brand Story"}
              </span>
              <h3 className="mt-3 font-marathi-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                {isMarathi
                  ? "सागरापासून कराडकरांच्या ताटापर्यंतचा अस्सल प्रवास"
                  : isHindi
                  ? "समुद्र से कराडवासियों की थाली तक का असली सफर"
                  : "The Authentic Journey from Sea Harbor to Your Plate"}
              </h3>
            </motion.div>

            {/* Process */}
            <div className="relative mt-10 lg:mt-12">
              {/* Desktop rail with a thin progress line that draws once */}
              <div aria-hidden="true" className="absolute left-6 right-6 top-6 hidden h-px bg-white/15 lg:block">
                <motion.div
                  className="h-full origin-left bg-[#38BDF8]"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </div>

              <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
                {storySteps.map((item, i) => {
                  const Icon = item.icon;
                  const last = i === storySteps.length - 1;
                  return (
                    <motion.li
                      key={item.step}
                      initial={reduce ? false : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                      className="group relative flex gap-5 lg:block"
                    >
                      {/* Mobile vertical rail */}
                      {!last && (
                        <span
                          aria-hidden="true"
                          className="absolute left-6 top-14 -bottom-10 w-px -translate-x-1/2 bg-white/15 lg:hidden"
                        />
                      )}

                      {/* Icon (sits on the rail) + step number */}
                      <div className="relative z-10 flex shrink-0 items-center gap-4 lg:mb-5">
                        <span className="grid size-12 place-items-center rounded-xl border border-white/15 bg-[#0D2A3E] transition-colors duration-300 group-hover:border-[#38BDF8]/70">
                          <Icon className="size-5 text-[#7DD3FC]" />
                        </span>
                        <span className="hidden font-mono text-xs font-semibold tracking-[0.2em] text-white/35 lg:inline">
                          {item.step}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider text-[#FBBF24]">
                          <span className="font-mono text-white/35 lg:hidden">{item.step}</span>
                          <span className="lg:hidden text-white/20">/</span>
                          <Clock className="size-3.5" />
                          {item.time}
                        </p>
                        <h4 className="font-marathi-display text-lg font-semibold leading-snug text-white">
                          {isMarathi ? item.titleMr : isHindi ? item.titleHi : item.titleEn}
                        </h4>
                        <p className="mt-2 font-marathi-body text-[0.85rem] leading-relaxed text-white/65">
                          {isMarathi ? item.descMr : isHindi ? item.descHi : item.descEn}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            {/* Quote */}
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left"
            >
              <p className="font-marathi-body text-sm italic text-white/75">
                {isMarathi
                  ? "“केवळ मासे विकणे हा आमचा व्यवसाय नाही; कोकणच्या बंदराचा अस्सल टवटवीत ताजेपणा प्रत्येक कराडकरांच्या घरात पोहोचवणे हीच आमची ओळख आहे.”"
                  : isHindi
                  ? "“केवल मछली बेचना हमारा व्यापार नहीं है; कोंकण के बंदरगाह की असली ताजगी प्रत्येक कराडवासी के घर तक पहुंचाना ही हमारी पहचान है।”"
                  : "“Selling fish isn't merely our business; delivering pure coastal oceanic freshness to every home in Karad is our heritage.”"}
              </p>
              <span className="whitespace-nowrap text-xs font-semibold text-[#FBBF24]">
                {isMarathi || isHindi ? "— ए एन फिश वर्ल्ड, कराड" : "— AN Fish World, Karad"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* 4 Signature Fish Cards: clean photo, non-overlapping badges, cut chips, price + order row */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {SIGNATURE_FISHES.map((fish, i) => {
            const name = isMarathi || isHindi ? fish.nameMr : fish.nameEn;
            const cuts = (isMarathi || isHindi ? fish.cutsMr : fish.cutsEn)
              .split("•")
              .map((c) => c.trim())
              .filter(Boolean);
            return (
              <li
                key={fish.id}
                className="group relative flex flex-col overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#0C2A3C] to-[#071924] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#38BDF8]/60 hover:shadow-[0_24px_50px_-18px_rgba(10,154,217,0.5)]"
              >
                {/* Photo: full-bleed, pure-white product shots blend into a white stage */}
                <div className="relative aspect-[4/3.4] w-full overflow-hidden bg-white">
                  <Image
                    src={fish.image.replace("-free.webp", "-large.webp")}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={i < 2}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* soft fade into the dark card body */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0C2A3C]/70 to-transparent"
                  />
                  {/* Badges: one on each side, never overlapping */}
                  <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-[#FBBF24]/50 bg-[#071A24]/90 px-3 py-1 text-[0.7rem] font-bold text-[#FBBF24] shadow-lg backdrop-blur-md">
                    {isMarathi || isHindi ? fish.marathiTag : fish.englishTag}
                  </span>
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-[#071A24]/90 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-300 backdrop-blur-md">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {isMarathi ? "१००% ताजे" : isHindi ? "१००% ताजा" : "100% Fresh"}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-marathi-display text-xl font-black leading-tight text-white transition-colors group-hover:text-[#FBBF24] sm:text-[1.4rem]">
                    {name}
                  </h3>

                  <p className="line-clamp-2 min-h-[2.6rem] font-marathi-body text-[0.82rem] leading-relaxed text-white/75">
                    {isMarathi || isHindi ? fish.tasteMr : fish.tasteEn}
                  </p>

                  {/* Cuts as chips */}
                  <div className="mt-auto">
                    <p className="mb-2 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white/45">
                      <Scissors className="size-3.5 text-[#FBBF24]" />
                      {isMarathi ? "मोफत कटिंग" : isHindi ? "मुफ्त कटिंग" : "Free Cuts"}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {cuts.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-2.5 py-1 font-marathi-body text-[0.7rem] font-medium leading-none text-[#9BDCF7]"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price + order */}
                  <div className="mt-2 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-white/45">
                        {isMarathi ? "दैनिक बाजार दर" : isHindi ? "दैनिक बाज़ार भाव" : "Daily Rate"}
                      </span>
                      <span className="text-xl font-black tabular-nums tracking-tight text-[#FBBF24]">{fish.rate}</span>
                    </div>
                    <a
                      href={getOrderLink(fish)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Order ${fish.nameEn} on WhatsApp`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-marathi-display text-sm font-bold text-[#052E16] shadow-[0_8px_20px_-8px_rgba(37,211,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                    >
                      <MessageCircle className="size-4 shrink-0 fill-current" />
                      <span>{isMarathi ? "मागवा" : isHindi ? "ऑर्डर करें" : "Order"}</span>
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* View Entire Menu CTA */}
        <div className="mt-10 text-center">
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
