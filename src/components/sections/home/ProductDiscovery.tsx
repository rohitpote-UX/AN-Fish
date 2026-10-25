"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ShoppingBag, Waves, Scissors, Check, Info, ArrowUpRight } from "lucide-react";
import { useBasketStore } from "@/store/basket";
import { SPECIES_LIST } from "@/data/species";
import { PLACEHOLDERS } from "@/data/placeholders";

interface DisplayFish {
  id: string;
  nameEn: string;
  nameMr: string;
  category: "sea" | "river" | "shellfish";
  image: string;
  badgeEn?: string;
  badgeMr?: string;
  tasteEn: string;
  tasteMr: string;
  cutsEn: string[];
  cutsMr: string[];
  originEn: string;
  originMr: string;
  pricingEn: string;
  pricingMr: string;
}

const FISH_ITEMS: DisplayFish[] = [
  {
    id: "silver-pomfret",
    nameEn: "Silver Pomfret",
    nameMr: "सिल्व्हर पापलेट",
    category: "sea",
    image: "/media/species/paplet.svg",
    badgeEn: "Most Loved",
    badgeMr: "लाडकी आवक",
    tasteEn: "Melt-in-mouth tender texture with delicate natural sweetness. Minimal bones.",
    tasteMr: "लोण्यासारखी मऊ पोत, अत्यंत सौम्य व नाजूक गोडवा. लहान मुलांसाठी व घरातील ज्येष्ठांसाठी उत्तम.",
    cutsEn: ["Rava Fry Slices", "Curry Cut", "Whole Cleaned"],
    cutsMr: ["रवा फ्राय चकत्या", "रस्सा कट", "संपूर्ण स्वच्छ"],
    originEn: "Ratnagiri Dawn Auction",
    originMr: "रत्नागिरी पहाटेचा लिलाव",
    pricingEn: "Market Rate • Sizing 300g-800g",
    pricingMr: "दैनिक बाजारभाव • ३००ग्रॅम-८००ग्रॅम",
  },
  {
    id: "king-surmai",
    nameEn: "King Seer (Surmai)",
    nameMr: "किंग सुरमई / तोर",
    category: "sea",
    image: "/media/species/surmai.svg",
    badgeEn: "Coastal Gold",
    badgeMr: "कराडची पहिली पसंती",
    tasteEn: "Firm white meat with a single central bone. Karad's benchmark for crispy rava fry.",
    tasteMr: "घट्ट पांढरे मांस, एकच मध्यवर्ती काटा. कुरकुरीत रवा फ्राय आणि कोकणी सारसाठी कराडची पहिली पसंती.",
    cutsEn: ["Crispy Fry Steaks", "Curry Portioning", "Boneless"],
    cutsMr: ["रवा फ्राय चकत्या", "करी कट", "बोनलेस फिलेट"],
    originEn: "Malvan Deep Harbor",
    originMr: "मालवण खोल सागरी आवक",
    pricingEn: "Market Rate • Steaks & Whole",
    pricingMr: "दैनिक बाजारभाव • चकत्या व संपूर्ण",
  },
  {
    id: "indian-rawas",
    nameEn: "Indian Salmon (Rawas)",
    nameMr: "इंडियन सामन (रावस)",
    category: "sea",
    image: "/media/species/rawas.svg",
    badgeEn: "Chef's Choice",
    badgeMr: "शेफची पसंती",
    tasteEn: "Rich in healthy Omega-3 fats with succulent pinkish-white flesh. Extremely versatile.",
    tasteMr: "आरोग्यदायी ओमेगा-३ ने समृद्ध, रसाळ गुलाबी-पांढरे मांस. तव्यावर फ्राय किंवा ग्रिलसाठी अप्रतिम.",
    cutsEn: ["Fillet Steaks", "Boneless Cubes", "Curry Cut"],
    cutsMr: ["फिलेट चकत्या", "बोनलेस तुकडे", "करी कट"],
    originEn: "Ratnagiri Coastal Catch",
    originMr: "रत्नागिरी सागरी आवक",
    pricingEn: "Market Rate • Prime Center Cut",
    pricingMr: "दैनिक बाजारभाव • प्राइम सेंटर कट",
  },
  {
    id: "tiger-prawns",
    nameEn: "Royal Tiger Prawns",
    nameMr: "रॉयल टायगर कोळंबी",
    category: "shellfish",
    image: "/media/species/kolambi-tiger.svg",
    badgeEn: "Sweet & Succulent",
    badgeMr: "गोड व रसाळ",
    tasteEn: "Plump, sweet and bouncy texture. Perfect for coastal Koli masala or crispy golden fry.",
    tasteMr: "टपोरी, गोडसर आणि कुरकुरीत चव. अस्सल कोळंबी मसाला किंवा रवा फ्रायसाठी परिपूर्ण.",
    cutsEn: ["Peeled & Deveined", "Whole with Shell"],
    cutsMr: ["साले काढून स्वच्छ", "संपूर्ण सालासकट"],
    originEn: "Fresh Coastal Harvest",
    originMr: "ताजी सागरी आवक",
    pricingEn: "Market Rate • Large J-Grade",
    pricingMr: "दैनिक बाजारभाव • लार्ज जे-ग्रेड",
  },
  {
    id: "fresh-bangda",
    nameEn: "Fresh Bangda (Mackerel)",
    nameMr: "ताजा बांगडा",
    category: "sea",
    image: "/media/species/bangda.svg",
    badgeEn: "Daily Essential",
    badgeMr: "रोजचे जेवण",
    tasteEn: "Bold, authentic oceanic flavor packed with natural oils and nutrition. Ideal for spicy fry.",
    tasteMr: "खवय्यांचा आवडता अस्सल सागरी स्वाद. तिखट मसाला फ्राय आणि आंबट-तिखट बांगडा तिफळसाठी उत्तम.",
    cutsEn: ["Whole Center-Slit", "Curry Pieces"],
    cutsMr: ["भरून फ्रायसाठी खाचा", "करी पिसेस"],
    originEn: "Morning Harbour Boats",
    originMr: "पहाटेच्या बोटींची आवक",
    pricingEn: "Market Rate • Daily Fresh",
    pricingMr: "दैनिक बाजारभाव • रोजची ताजी आवक",
  },
  {
    id: "krishna-rohu",
    nameEn: "Freshwater Rohu",
    nameMr: "गोड्या पाण्यातील रोहू",
    category: "river",
    image: "/media/species/rohu.svg",
    badgeEn: "Krishna River Catch",
    badgeMr: "कृष्णा काठची चव",
    tasteEn: "Clean sweet freshwater profile from local Western Maharashtra river waters. Traditional curry favorite.",
    tasteMr: "स्थानिक कृष्णा-कोयना नदीच्या गोड्या पाण्यातील अस्सल चव. घरगुती महाराष्ट्रीयन कालवणासाठी सर्वोत्तम.",
    cutsEn: ["Traditional Curry Cut", "Fry Steaks"],
    cutsMr: ["पारंपारिक रस्सा कट", "फ्राय चकत्या"],
    originEn: "Krishna River Basin, Karad",
    originMr: "कृष्णा नदी खोरे, कराड",
    pricingEn: "Market Rate • Live Selection",
    pricingMr: "दैनिक बाजारभाव • जिवंत निवड",
  },
  {
    id: "koyna-catla",
    nameEn: "Koyna-Krishna Catla",
    nameMr: "कोयना-कृष्णा कटला",
    category: "river",
    image: "/media/species/catla.svg",
    tasteEn: "Tender, flaky fish with delicious fatty belly portions. Unmatched for authentic regional curries.",
    tasteMr: "मऊ, स्वादिष्ट व चरबीयुक्त पोटाचा भाग. गावरान पद्धतीच्या झणझणीत कालवणासाठी अत्यंत चवदार.",
    cutsEn: ["Thick Steaks", "Head Portioning"],
    cutsMr: ["जाड चकत्या", "मुंडके रस्सा कट"],
    originEn: "Koyna Backwaters",
    originMr: "कोयना जलाशय परिसर",
    pricingEn: "Market Rate • Clean Scales",
    pricingMr: "दैनिक बाजारभाव • खवले स्वच्छ",
  },
  {
    id: "live-mud-crab",
    nameEn: "Live Mud Crab",
    nameMr: "जिवंत चिंबोरी (खेकडे)",
    category: "shellfish",
    image: "/media/species/crab.svg",
    badgeEn: "Live Selection",
    badgeMr: "जिवंत निवड",
    tasteEn: "Rich, deeply sweet claw meat producing an aromatic, comforting coastal crab soup or curry.",
    tasteMr: "गोड व रसाळ नांग्यांचे मांस. रोगप्रतिकारशक्तीसाठी व हिवाळ्यात गरमागरम चिंबोरीच्या रश्श्यासाठी प्रसिद्ध.",
    cutsEn: ["Cleaned & Quartered", "Whole Live"],
    cutsMr: ["स्वच्छ करून चार भाग", "संपूर्ण जिवंत"],
    originEn: "Coastal Mangroves",
    originMr: "खाडी व किनाऱ्याची आवक",
    pricingEn: "Market Rate • Alive on Crushed Ice",
    pricingMr: "दैनिक बाजारभाव • जिवंत निवड",
  },
];

export function ProductDiscovery() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const [activeCategory, setActiveCategory] = useState<"all" | "sea" | "river" | "shellfish">("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  const addItem = useBasketStore((state) => state.addItem);
  const openDrawer = useBasketStore((state) => state.openDrawer);

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const filteredItems = activeCategory === "all"
    ? FISH_ITEMS
    : FISH_ITEMS.filter((f) => f.category === activeCategory);

  const handleOrderWhatsApp = (fish: DisplayFish) => {
    const text = isMarathi
      ? `नमस्कार AN Fish World कराड, मला आजच्या ताज्या आवकमधून *${fish.nameMr}* ची चौकशी/ऑर्डर करायची आहे. आजचे अचूक दर व उपलब्ध वजन सांगावे.`
      : `Hello AN Fish World Karad, I would like to order/inquire about *${fish.nameEn}* from today's fresh catch. Please share today's available sizes and market rate.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleQuickAdd = (fish: DisplayFish) => {
    const matched = SPECIES_LIST.find(
      (s) => s.slug === fish.id || s.nameEn.toLowerCase().includes(fish.nameEn.toLowerCase().split(" ")[0])
    ) || {
      slug: fish.id,
      nameMr: fish.nameMr,
      nameEn: fish.nameEn,
      category: fish.category,
      image: fish.image,
      tasteNote: isMarathi ? fish.tasteMr : fish.tasteEn,
      bestFor: ["fry", "curry"] as ("fry" | "curry")[],
      pricePerKg: fish.pricingEn,
      available: true,
      cleaningOptions: ["cleaned", "curry-cut"] as ("cleaned" | "curry-cut")[],
    };

    addItem({
      species: matched,
      weight: "1 kg",
      cleaningOption: "cleaned",
      quantity: 1,
      cut: "curry",
    });
    setAddedId(fish.id);
    setTimeout(() => setAddedId(null), 1800);
    openDrawer();
  };

  return (
    <section
      id="product-discovery"
      aria-label="Fresh Fish Discovery"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-12 sm:space-y-16"
    >
      {/* 1. Header & Category Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#071A24]/10 pb-8">
        <div className="max-w-2xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/25 text-xs font-mono-accent text-[#0B9DD8] uppercase tracking-wider font-bold">
            <Waves className="w-3.5 h-3.5" />
            <span>{isMarathi ? "दैनिक ताजी आवक • DAILY FRESH SELECTION" : "DAILY FRESH SELECTION • दैनिक आवक"}</span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#071A24] tracking-[-0.04em] leading-[1.02] ${
              isMarathi ? "font-marathi-display" : "font-latin-display"
            }`}
          >
            {isMarathi ? "प्रत्येक चवीसाठी निवडक मासोळी." : "Explore Our Fresh Catch."}
          </h2>

          <p
            className={`text-base sm:text-xl text-[#071A24]/75 leading-relaxed ${
              isMarathi ? "font-marathi-body" : "font-sans"
            }`}
          >
            {isMarathi
              ? "पहाटेच्या बंदरावरून थेट कराड दालनात पोहोचलेली ताजी मासोळी. तुमच्या आवडीनुसार समोर स्वच्छ धुऊन मोफत कटिंग."
              : "Brought directly from coastal dawn harbour auctions to our Karad counters. Hand-selected, washed in pure RO water, and portioned to order."}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", labelEn: "All Varieties", labelMr: "सर्व मासोळी" },
            { id: "sea", labelEn: "Coastal & Sea", labelMr: "सागरी मासोळी" },
            { id: "river", labelEn: "Freshwater River", labelMr: "नदीचे मासे" },
            { id: "shellfish", labelEn: "Prawns & Shellfish", labelMr: "कोळंबी व खेकडे" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-mono-accent uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#071A24] text-white shadow-md"
                  : "bg-[#F5F4EF] hover:bg-[#EBF8FF] text-[#071A24]/75 hover:text-[#0B9DD8] border border-[#071A24]/08"
              }`}
            >
              <span>{isMarathi ? cat.labelMr : cat.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Editorial Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((fish) => (
            <motion.div
              key={fish.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group rounded-3xl overflow-hidden bg-white border border-[#071A24]/10 hover:border-[#0B9DD8]/60 shadow-xs hover:shadow-[0_16px_36px_rgba(7,26,36,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Top: Visual Area */}
              <div className="relative aspect-[4/3] w-full p-6 bg-gradient-to-br from-[#F8FAFC] via-white to-[#EBF8FF] flex items-center justify-center overflow-hidden border-b border-[#071A24]/06">
                {/* Subtle oceanic backdrop ripple */}
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,157,216,0.08)_0%,transparent_70%)] pointer-events-none"
                  aria-hidden="true"
                />

                {/* Card Header: Badge & Origin */}
                <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
                  {(fish.badgeEn || fish.badgeMr) ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#071A24] text-white text-[9px] font-mono-accent font-bold uppercase tracking-wider shadow-xs truncate max-w-[55%]">
                      {isMarathi ? fish.badgeMr : fish.badgeEn}
                    </span>
                  ) : <span />}
                  <span className="text-[9px] font-mono-accent text-[#071A24]/60 font-semibold truncate max-w-[45%] text-right">
                    {isMarathi ? fish.originMr : fish.originEn}
                  </span>
                </div>

                {/* Genuine Product SVG / Illustration */}
                <div className="relative w-36 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out">
                  <Image
                    src={fish.image}
                    alt={fish.nameEn}
                    width={140}
                    height={100}
                    className="w-full h-full object-contain filter drop-shadow-[0_6px_14px_rgba(7,26,36,0.08)]"
                  />
                </div>
              </div>

              {/* Card Body: Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <Link
                    href={`/catch/${
                      fish.id === "king-surmai"
                        ? "king-seer-surmai"
                        : fish.id === "indian-rawas"
                        ? "indian-salmon-rawas"
                        : fish.id
                    }`}
                    className="group/link flex items-center justify-between gap-2"
                  >
                    <h3
                      className={`text-xl font-bold text-[#071A24] group-hover/link:text-[#0B9DD8] transition-colors leading-tight ${
                        isMarathi ? "font-marathi-display" : "font-latin-display"
                      }`}
                    >
                      {isMarathi ? fish.nameMr : fish.nameEn}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#0B9DD8] opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all shrink-0" />
                  </Link>
                  <span className="text-xs text-[#0B9DD8] font-mono-accent font-semibold block mt-0.5">
                    {isMarathi ? fish.nameEn : fish.nameMr}
                  </span>

                  <p
                    className={`mt-3 text-xs text-[#071A24]/75 leading-relaxed line-clamp-2 ${
                      isMarathi ? "font-marathi-body" : "font-sans"
                    }`}
                  >
                    {isMarathi ? fish.tasteMr : fish.tasteEn}
                  </p>
                </div>

                {/* Custom Kitchen Cuts Pill */}
                <div className="pt-3 border-t border-[#071A24]/08 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-accent text-[#071A24]/60">
                    <Scissors className="w-3 h-3 text-[#0B9DD8]" />
                    <span>{isMarathi ? "उपलब्ध कटिंग:" : "Custom Cuts:"}</span>
                    <span className="font-semibold text-[#071A24] truncate">
                      {(isMarathi ? fish.cutsMr : fish.cutsEn).join(" • ")}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono-accent text-[#0B9DD8] font-semibold">
                    {isMarathi ? fish.pricingMr : fish.pricingEn}
                  </div>
                </div>

                {/* Action Buttons: WhatsApp Enquire & Quick Add */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOrderWhatsApp(fish)}
                    className="flex-1 py-2.5 px-3 rounded-full bg-[#0B9DD8] hover:bg-[#071A24] text-white text-xs font-mono-accent font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current transition-transform duration-200 group-hover/btn:scale-110" />
                    <span>{isMarathi ? "व्हॉट्सॲप ऑर्डर" : "WhatsApp Order"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(fish)}
                    title={isMarathi ? "बास्केटमध्ये जोडा" : "Add to Basket"}
                    className="p-2.5 rounded-full bg-[#F5F4EF] hover:bg-[#EBF8FF] text-[#071A24] hover:text-[#0B9DD8] border border-[#071A24]/10 transition-colors cursor-pointer shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8]"
                  >
                    {addedId === fish.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Transparent Market Notice for Local Customers */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#F5F4EF] border border-[#071A24]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B9DD8]/15 flex items-center justify-center text-[#0B9DD8] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#071A24]">
              {isMarathi
                ? "दैनिक सागरी आवक व पारदर्शक वजन हमी"
                : "Daily Morning Harbor Sourcing & Transparent Scales"}
            </h4>
            <p className="text-xs text-[#071A24]/70 mt-0.5 max-w-3xl leading-relaxed">
              {isMarathi
                ? "रत्नागिरी व मालवण बंदरावरील पहाटे ४:०० च्या थेट लिलावानुसार दर व उपलब्धता ठरते. सर्व मासे आरओ पाण्यात स्वच्छ धुऊन आणि तुमच्या आवडीनुसार समोर चोख कट करून मोफत दिले जातात."
                : "Prices and daily sizing depend strictly on morning harbour auction results. Every piece is cleaned with purified RO water and sliced to your exact culinary cuts at our Malkapur Karad counter free of charge."}
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            isMarathi
              ? "नमस्कार AN Fish World कराड, मला आजचा ताजा रेट कार्ड पाठवावा."
              : "Hello AN Fish World Karad, please share today's daily fresh rate card."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 text-xs font-mono-accent font-bold uppercase tracking-wider text-[#0B9DD8] hover:text-[#071A24] transition-colors"
        >
          <span>{isMarathi ? "आजचा रेट कार्ड मागा" : "Request Today's Rate Card"}</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
