"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { FISH_CATALOG, FishItem } from "@/data/fishCatalog";
import { PLACEHOLDERS } from "@/data/placeholders";
import { Sparkles, MessageCircle, Utensils, Check, ArrowRight } from "lucide-react";

type CategoryFilter = "all" | "sea" | "river" | "shellfish" | "cuts";

export function MenuSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>("all");

  const filterTabs = [
    { id: "all" as CategoryFilter, labelMr: "सर्व मासोळी (All)", labelEn: "All Varieties" },
    { id: "sea" as CategoryFilter, labelMr: "सागरी मासे (Sea Fish)", labelEn: "Sea Catch" },
    { id: "river" as CategoryFilter, labelMr: "गोड्या पाण्यातील (River)", labelEn: "Freshwater River" },
    { id: "shellfish" as CategoryFilter, labelMr: "कोळंबी व खेकडे (Shellfish)", labelEn: "Prawns & Crabs" },
    { id: "cuts" as CategoryFilter, labelMr: "स्पेशल कट्स (Ready Cuts)", labelEn: "Kitchen Ready Cuts" },
  ];

  const filteredItems = FISH_CATALOG.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "cuts") {
      return item.cuts.includes("fry") || item.cuts.includes("fillet");
    }
    return item.category === selectedFilter;
  });

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const getOrderWhatsAppUrl = (fish: FishItem) => {
    const text = isMarathi
      ? `नमस्कार AN Fish World कराड, मला ताजी मासोळी मेनूमधून "${fish.marathiName}" ऑर्डर करायची आहे. कृपया आजचा दर आणि डिलिव्हरी वेळ सांगा.`
      : `Hello AN Fish World Karad, I would like to order "${fish.scientificName}" from your fresh fish catalog. Please confirm price and delivery.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const getFishImage = (id: string) => {
    switch (id) {
      case "paplet":
        return "/media/hero/pomfret-free.webp";
      case "surmai":
        return "/media/hero/surmai-free.webp";
      case "rawas":
        return "/media/hero/rawas-free.webp";
      case "kolambi-tiger":
        return "/media/hero/prawns-free.webp";
      case "bangda":
        return "/media/hero/bangda-free.webp";
      case "rohu":
        return "/media/hero/rohu-free.webp";
      case "catla":
        return "/media/hero/catla-free.webp";
      case "jitada":
        return "/media/hero/jitada-free.webp";
      case "crab":
        return "/media/hero/crab-free.webp";
      default:
        return "/media/hero/pomfret-free.webp";
    }
  };

  const getCutLabels = (cuts: FishItem["cuts"]) => {
    const cutMap: Record<string, { mr: string; en: string }> = {
      fry: { mr: "तवा फ्राय", en: "Fry Cut" },
      curry: { mr: "कालवण / करी", en: "Curry Cut" },
      wholeCleaned: { mr: "अखंड स्वच्छ", en: "Whole Cleaned" },
      fillet: { mr: "फिलेट", en: "Fillet" },
      boneless: { mr: "बोनलेस", en: "Boneless" },
    };
    return cuts.map((c) => (isMarathi ? cutMap[c]?.mr || c : cutMap[c]?.en || c));
  };

  return (
    <section
      id="menu"
      className="relative py-20 lg:py-28 bg-[#F8FAFC] text-[#071A24] overflow-hidden scroll-mt-20 border-b border-[#071A24]/08"
      aria-label="Fresh Fish Menu and Catalog"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/30 text-xs font-bold text-[#0B9DD8] uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>{isMarathi ? "दैनिक ताजी आवक व दरपत्रक" : "Daily Fresh Catch & Price Guide"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "आमचे स्पेशल मेनू" : "Our Fresh Fish Menu"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "रोजची ताजी मासोळी, योग्य कटिंग आणि स्वच्छतेची १००% हमी. आपल्या आवडीनुसार निवडा आणि एका क्लिकवर ऑर्डर करा."
              : "Daily harbour arrivals with complimentary custom cutting and zero chemical preservation. Choose below to order."}
          </p>
        </div>

        {/* Filter Category Tabs (Hotel Atithi Karad Interface Style) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0A9AD9] text-white shadow-md shadow-[#0A9AD9]/25 scale-105"
                    : "bg-white text-[#071A24]/70 border border-[#071A24]/10 hover:border-[#0A9AD9] hover:text-[#0A9AD9]"
                }`}
              >
                {isMarathi ? tab.labelMr : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((fish) => {
            const imageSrc = getFishImage(fish.id);
            const cuts = getCutLabels(fish.cuts);

            return (
              <div
                key={fish.id}
                className="bg-white rounded-2xl border border-[#071A24]/10 hover:border-[#0A9AD9] p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Card Top: Category Badge + Omega Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[0.72rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF8FF] text-[#0A9AD9] border border-[#0A9AD9]/20">
                      {fish.category === "sea"
                        ? isMarathi ? "सागरी मासा" : "Sea Catch"
                        : fish.category === "river"
                        ? isMarathi ? "गोड्या पाण्यातील" : "River Catch"
                        : isMarathi ? "कोळंबी / कवचधारी" : "Shellfish"}
                    </span>

                    <span className="text-[0.72rem] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {isMarathi ? "ताजी आवक" : "Fresh Arrival"}
                    </span>
                  </div>

                  {/* Fish Visual Image - Enhanced Size, Soft Rounded Corners & Premium Showcase Style */}
                  <div className="relative w-full aspect-[4/3] sm:h-56 md:h-60 rounded-2xl overflow-hidden bg-gradient-to-b from-[#F0F9FF] to-[#E2F2FE] border border-[#0A9AD9]/20 shadow-xs group-hover:border-[#0A9AD9]/50 group-hover:shadow-md transition-all duration-300 mb-4 flex items-center justify-center">
                    <Image
                      src={imageSrc}
                      alt={fish.marathiName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center w-full h-full rounded-2xl group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-sm"
                    />
                  </div>

                  {/* Title & Scientific Info */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-marathi-display text-[#071A24] group-hover:text-[#0A9AD9] transition-colors">
                      {fish.marathiName}
                    </h3>
                    <p className="text-xs text-[#071A24]/50 italic">
                      {fish.scientificName}
                    </p>
                  </div>

                  {/* Available Cuts */}
                  <div className="mt-3 pt-3 border-t border-[#071A24]/08">
                    <span className="text-[0.68rem] uppercase font-bold text-[#071A24]/50 block mb-1.5">
                      {isMarathi ? "उपलब्ध कटिंग पद्धती:" : "Available Cuts:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cuts.map((cut, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[0.72rem] font-medium text-[#071A24]/80"
                        >
                          {cut}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area: Pricing + 1-Click Order Button */}
                <div className="mt-6 pt-4 border-t border-[#071A24]/08 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[0.68rem] text-[#071A24]/50 font-semibold uppercase">
                      {isMarathi ? "दैनिक दर" : "Daily Rate"}
                    </span>
                    <span className="text-base font-extrabold text-[#071A24] tabular-nums">
                      {fish.price}
                    </span>
                    <span className="block text-[0.65rem] text-[#071A24]/60">
                      {isMarathi ? `किमान: ${fish.minOrderWeight}` : `Min: ${fish.minOrderWeight}`}
                    </span>
                  </div>

                  <a
                    href={getOrderWhatsAppUrl(fish)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A9AD9] hover:bg-[#071A24] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    aria-label={`Order ${fish.marathiName} on WhatsApp`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{isMarathi ? "ऑर्डर करा" : "Order"}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Order Box / Direct Hotline */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071A24] to-[#0D2634] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-marathi-display text-white">
              {isMarathi ? "आपल्या आवडीचा मासा या यादीत दिसत नाही का?" : "Looking for a Specific Rare Catch?"}
            </h3>
            <p className="text-xs sm:text-sm text-white/75 font-marathi-body max-w-xl">
              {isMarathi
                ? "आम्ही दररोज पहाटे थेट बंदरावर असतो. आपल्याला हवी असलेली कोणतीही खास मासोळी किंवा मोठ्या प्रमाणातील ऑर्डरसाठी त्वरित संपर्क करा."
                : "Our sourcing team is at the coast daily. Call or WhatsApp us directly for custom bulk orders or special harbour requests."}
            </p>
          </div>

          <a
            href="#order"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] text-[#071A24] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md"
          >
            <span>{isMarathi ? "थेट ऑर्डर नोंदणी करा" : "Custom Order Now"}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
