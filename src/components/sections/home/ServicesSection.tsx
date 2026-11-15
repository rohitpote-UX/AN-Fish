"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  Anchor,
  ShieldCheck,
  Scissors,
  Truck,
  Sparkles,
  CheckCircle2,
  Heart,
  Eye,
  Brain,
  Activity,
  Flame,
  MessageCircle,
  PhoneCall,
  Shield,
  UtensilsCrossed,
  Layers,
  ZoomIn,
  X,
} from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function ServicesSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const getMasalaOrderUrl = (masalaName?: string) => {
    const text = isMarathi
      ? `नमस्कार AN Fish कराड, मला ${masalaName ? `"${masalaName}"` : "AN Spices मसाले"} आणि ताजी मासोळी ऑर्डर करायची आहे.`
      : isHindi
      ? `नमस्ते AN Fish कराड, मुझे ${masalaName ? `"${masalaName}"` : "AN Spices मसाले"} और ताजी मछली ऑर्डर करनी है।`
      : `Hello AN Fish Karad, I would like to order ${masalaName ? `"${masalaName}"` : "AN Spices"} with fresh fish.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // 1. 4 Core Pillars
  const services = [
    {
      icon: Anchor,
      step: "०१",
      titleMr: "थेट बंदरावरून रोजची ताजी आवक",
      titleEn: "Daily 4:00 AM Direct Harbour Sourcing",
      descMr: "रत्नागिरी आणि मालवणच्या पहाटे ४:०० वाजताच्या लिलावातून स्वतः निवडलेली ए-ग्रेड मासोळी. शिळे किंवा साठवलेले मासे आम्ही कधीही विकत नाही.",
      descEn: "Strictly sourced at 4:00 AM coastal harbour auctions across Ratnagiri and Malvan. No stale warehouse storage.",
      highlightMr: "दररोज पहाटे ताजी आवक",
      highlightEn: "Fresh Daily Catch",
    },
    {
      icon: ShieldCheck,
      step: "०२",
      titleMr: "०% फॉर्मेलिन व घातक केमिकल",
      titleEn: "100% Formalin & Ammonia Free",
      descMr: "बाजारात मासे टिकवण्यासाठी वापरल्या जाणाऱ्या फॉर्मेलिन किंवा अमोनियापासून १००% मुक्त. केवळ ०°C नैसर्गिक बर्फाच्या स्लरीमध्ये सुरक्षित साठवण.",
      descEn: "Never treated with toxic chemicals. Kept pristine using food-grade 0°C liquid ice slurry.",
      highlightMr: "१००% विषमुक्त हमी",
      highlightEn: "Lab Certified Safe",
    },
    {
      icon: Scissors,
      step: "०३",
      titleMr: "मोफत आरओ स्वच्छता व चोख कटिंग",
      titleEn: "Complimentary Clean & Custom Slicing",
      descMr: "शुद्ध आरओ पाण्याने स्वच्छता केली जाते. आपल्या आवडीनुसार रवा फ्राय स्टेक्स, करी कट, अख्खा साफ किंवा बोनलेस तुकडे – कोणतेही अतिरिक्त शुल्क नाही.",
      descEn: "Washed in RO purified water and customized into curry cuts, fry slices, or boneless fillets at zero extra charge.",
      highlightMr: "कोणतेही कटिंग शुल्क नाही",
      highlightEn: "100% Free Cutting",
    },
    {
      icon: Truck,
      step: "०४",
      titleMr: "कराड शहरात जलद होम डिलिव्हरी",
      titleEn: "Express Doorstep Delivery Across Karad",
      descMr: "कराड शहर, विद्यानगर, कोल्हापूर नाका आणि लगतच्या १५ किमी परिसरात स्वच्छ थर्मल पॅकिंगमध्ये ३० ते ४५ मिनिटांत घरपोच डिलिव्हरी.",
      descEn: "Direct to your kitchen in food-grade thermal containers within 30–45 mins in Karad city & surrounding regions.",
      highlightMr: "थर्मल इन्सुलेटेड पॅकिंग",
      highlightEn: "Insulated Fresh Packs",
    },
  ];

  // 2. Real Masalas (AN Spices)
  const spicesList = [
    {
      nameMr: "AN कोळीवाडा मिक्स (Koliwada Mix)",
      nameEn: "AN Prawns & Fish Koliwada Mix",
      descMr: "हॉटेल-स्टाईल कुरकुरीत, लालभडक आणि झणझणीत फ्रायसाठी सर्वोत्तम.",
      descEn: "Crispy, zesty coastal batter for authentic fish & prawn koliwada fry.",
      badgeMr: "खवय्यांची पसंती",
      badgeEn: "Customer Favorite",
    },
    {
      nameMr: "AN २-इन-१ फिश फ्राय मसाला",
      nameEn: "AN 2-in-1 Fish Fry Masala",
      descMr: "रवा फ्राय व तवा फ्राय दोन्हीसाठी परिपूर्ण — घरगुती मसाल्यांचा सुवास.",
      descEn: "Versatile blend for crisp rava shallow fry or authentic coastal tawa fry.",
      badgeMr: "स्पेशल फ्राय",
      badgeEn: "Crisp Fry",
    },
    {
      nameMr: "AN मालवणी फिश करी मिक्स",
      nameEn: "AN Malvani Fish Curry Mix",
      descMr: "अस्सल कोकणी पद्धतीचा काळा मसाला व खोबऱ्याच्या रश्श्याची गावरान चव.",
      descEn: "Rich Konkani spice blend for thick, aromatic coastal fish curries.",
      badgeMr: "अस्सल मालवणी",
      badgeEn: "Authentic Malvani",
    },
    {
      nameMr: "AN कोळंबी कालवण मसाला (Prawns Curry)",
      nameEn: "AN Prawns Curry Masala Mix",
      descMr: "कोळंबीच्या गोडव्याला सुसंगत असा रसरशीत व घमघमाट सुटणारा मसाला.",
      descEn: "Tailored spice balance enhancing natural sweetness of succulent prawns.",
      badgeMr: "रसरशीत चव",
      badgeEn: "Rich Gravy",
    },
  ];

  // 3. Real Benefits from AN Fish Karad Store Board
  const fishBenefits = [
    {
      icon: Activity,
      titleMr: "शरीरास लोह, जस्त व आयोडिन",
      titleEn: "Rich in Iron, Zinc & Iodine",
      descMr: "माशांच्या सेवनाने शरीराला आवश्यक खनिजे मिळतात, ज्यामुळे शरीराची प्रतिकारशक्ती व ऊर्जा वाढते.",
      descEn: "Packed with vital micronutrients that bolster immunity and natural body energy.",
    },
    {
      icon: Heart,
      titleMr: "रक्तदाब व कोलेस्टेरॉल नियंत्रण",
      titleEn: "Controls BP & Cholesterol",
      descMr: "नैसर्गिक ओमेगा-३ फॅटी ॲसिडमुळे हृदयाचे ठोके निरोगी राहतात व कोलेस्टेरॉल आटोक्यात राहते.",
      descEn: "Heart-friendly natural Omega-3s balance good cholesterol and steady blood pressure.",
    },
    {
      icon: Eye,
      titleMr: "डोळ्यांचे आरोग्य व तेज सुधारते",
      titleEn: "Improves Vision & Eye Health",
      descMr: "माशातील मुबलक 'अ' जीवनसत्वामुळे नजर तीक्ष्ण राहते आणि डोळ्यांचा थकवा दूर होतो.",
      descEn: "High natural Vitamin A fortifies vision clarity and combats screen eye fatigue.",
    },
    {
      icon: Brain,
      titleMr: "मेंदूचा विकास व स्मरणशक्ती",
      titleEn: "Sharp Brain & Memory Growth",
      descMr: "लहान मुलांच्या मेंदूच्या वाढीसाठी आणि अल्झायमर्सची लक्षणे कमी करण्यासाठी गुणकारी.",
      descEn: "Essential fatty acids foster cognitive development in children and mental sharpness in elders.",
    },
    {
      icon: Shield,
      titleMr: "सांधेदुखी व संधिवातावर उपयुक्त",
      titleEn: "Relieves Joint Pain & Arthritis",
      descMr: "हाडे व सांध्यांची झीज भरून काढण्यासाठी आणि नैसर्गिक वंगण टिकवण्यासाठी उपयुक्त.",
      descEn: "Anti-inflammatory marine oils lubricate joints and soothe chronic stiffness.",
    },
    {
      icon: Flame,
      titleMr: "त्वचेचे सौंदर्य व वजन नियंत्रण",
      titleEn: "Glowing Skin & Healthy Weight",
      descMr: "रावस व सागरी माशांमुळे त्वचा तुकतुकीत होते आणि शरीरावरील चरबी कमी होण्यास मदत होते.",
      descEn: "Salmon & marine species rejuvenate skin hydration while aiding lean body metabolism.",
    },
  ];

  const additionalBadges = [
    isMarathi
      ? "अचूक डिजिटल वजन काटा (शून्य फेरफार)"
      : isHindi
      ? "सटीक डिजिटल तराजू (शून्य हेरफेर)"
      : "Precision Digital Weighing Scales",
    isMarathi
      ? "हॉटेल्स व केटरर्ससाठी घाऊक पुरवठा"
      : isHindi
      ? "होटलों व केटरर्स के लिए थोक आपूर्ति"
      : "Bulk Supply for Hotels & Caterers",
    isMarathi
      ? "लग्न व घरगुती कार्यक्रमांसाठी स्पेशल ऑर्डर्स"
      : isHindi
      ? "शादी व पारिवारिक आयोजनों के लिए स्पेशल ऑर्डर"
      : "Wedding & Family Feast Party Orders",
    isMarathi
      ? "रविवारी स्पेशल पहाटेची ताजी मासोळी"
      : isHindi
      ? "रविवार स्पेशल सुबह की ताजी मछली"
      : "Sunday Dawn Special Family Hours",
  ];

  return (
    <section
      id="services"
      className="relative py-20 lg:py-28 bg-[#FFFFFF] text-[#071A24] overflow-hidden scroll-mt-20 border-b border-[#071A24]/08"
      aria-label="Why Choose AN Fish World"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-18 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0B9DD8]/30 text-xs font-bold text-[#0B9DD8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0B9DD8]" />
            <span>
              {isMarathi
                ? "कराडकरांचा पसंतीचा ब्रँड • अस्सल गावरान विश्वास"
                : isHindi
                ? "कराडवासियों का पसंदीदा ब्रांड • खरा भरोसा"
                : "The AN Fish Standards & Trust"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-[#071A24]">
            {isMarathi ? "आम्हाला का निवडाल?" : isHindi ? "हमें क्यों चुनें?" : "Why Choose AN Fish?"}
          </h2>

          <p className="text-sm sm:text-base text-[#071A24]/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "केवळ मासे विकणे हा आमचा उद्देश नाही, तर प्रत्येक कराडकरांच्या कुटुंबाला आरोग्यास हितकारक, शुद्ध आणि समुद्रासारखाच चविष्ट गावरान अनुभव देणे ही आमची जबाबदारी आहे."
              : isHindi
              ? "केवल मछली बेचना हमारा उद्देश्य नहीं है, बल्कि प्रत्येक कराडवासी के परिवार को स्वास्थ्यप्रद, शुद्ध और समुद्र जैसा ही स्वादिष्ट अनुभव देना हमारी जिम्मेदारी है।"
              : "Our commitment to pristine cold-chain standards, ethical weighing, and authentic coastal flavour in every kitchen."}
          </p>
        </div>

        {/* ================= 4 CORE SERVICE CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#F8FAFC] border border-[#071A24]/08 hover:border-[#0A9AD9] p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A9AD9]/10 text-[#0A9AD9] flex items-center justify-center group-hover:bg-[#0A9AD9] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-[#071A24]/15 font-mono-accent">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-marathi-display text-[#071A24] group-hover:text-[#0A9AD9] transition-colors">
                    {isMarathi ? item.titleMr : item.titleEn}
                  </h3>

                  <p className="mt-3 text-sm text-[#071A24]/75 font-marathi-body leading-relaxed">
                    {isMarathi ? item.descMr : item.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#071A24]/08 flex items-center gap-2 text-xs font-bold text-[#0A9AD9]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{isMarathi ? item.highlightMr : item.highlightEn}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= FEATURE 1: AN SPICES (अस्सल गावरान मसाले) ================= */}
        <div className="mb-16 lg:mb-20 rounded-3xl bg-gradient-to-br from-[#071A24] via-[#0B2533] to-[#071A24] text-white p-6 sm:p-10 lg:p-12 border border-[#0A9AD9]/30 shadow-2xl overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#F59E0B]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Real Store Display Rack Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                onClick={() => setActiveImageModal("/media/an-spices-display.jpg")}
                className="group relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-white/15 hover:border-[#F59E0B] shadow-2xl cursor-pointer bg-black/40 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative aspect-3/4 w-full">
                  <Image
                    src="/media/an-spices-display.webp"
                    alt="AN Spices Display Rack Karad"
                    width={480}
                    height={640}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-[#F59E0B] text-[#071A24] font-extrabold shadow-md">
                      {isMarathi ? "प्रत्यक्ष दुकानातील रॅक" : isHindi ? "स्टोर का डिस्प्ले रैक" : "Live Store Rack"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/90 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      <ZoomIn className="size-3.5" />
                      {isMarathi ? "मोठे करा" : isHindi ? "बड़ा करें" : "Zoom"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[0.72rem] text-white/60 font-marathi-body mt-2 text-center">
                {isMarathi
                  ? "कराड दालनातील अधिकृत AN Spices डिस्प्ले रॅक"
                  : isHindi
                  ? "कराड स्टोर में आधिकारिक AN Spices डिस्प्ले रैक"
                  : "Official AN Spices rack at Karad counter"}
              </p>
            </div>

            {/* Right: Village POV Content for Spices */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/20 text-amber-300 border border-[#F59E0B]/40 text-xs font-bold uppercase tracking-wider">
                <UtensilsCrossed className="size-3.5 text-amber-300" />
                <span>
                  {isMarathi
                    ? "माशांसोबत मसालाही आमचाच!"
                    : isHindi
                    ? "मछली के साथ मसाला भी हमारा ही!"
                    : "Fresh Catch + Authentic Spices"}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-marathi-display text-white leading-tight">
                  {isMarathi
                    ? "मालवणी, आगरी कोळी व कोकणी मसाल्यांचे एकमेव केंद्र"
                    : isHindi
                    ? "मालवणी, आगरी कोली व कोंकणी मसालों का एकमात्र केंद्र"
                    : "AN Spices — Authentic Malvani, Agri Koli & Konkani Blends"}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-white/80 font-marathi-body leading-relaxed">
                  {isMarathi
                    ? "ताजी मासोळी आणली, पण घरी रस्सा आणि फ्राय गावरान चवीचा झाला नाही तर मज्जा येत नाही! म्हणूनच AN Fish घेऊन आले आहे खास घरगुती पद्धतीने बनवलेले मसाले — जे तुमच्या प्रत्येक जेवणाला देतील अस्सल कोकणी व मालवणी बाज."
                    : isHindi
                    ? "ताजी मछली लाए, लेकिन घर पर करी और फ्राई असली स्वाद का न बने तो मज़ा नहीं आता! इसीलिए AN Fish लेकर आया है खास घरेलू पद्धति से तैयार मसाले — जो आपके हर भोजन को देंगे असली कोंकणी व मालवणी स्वाद।"
                    : "Fresh fish deserves genuine coastal seasoning. Our proprietary in-house stone-ground blends bring authentic Malvani, Koliwada and Konkani coastal flavours straight to your family table."}
                </p>
              </div>

              {/* 4 Spice Variety Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {spicesList.map((spice, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#F59E0B]/60 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-amber-300 font-marathi-display">
                        {isMarathi || isHindi ? spice.nameMr : spice.nameEn}
                      </span>
                      <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-amber-200 font-semibold shrink-0">
                        {isMarathi || isHindi ? spice.badgeMr : spice.badgeEn}
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-white/70 font-marathi-body leading-snug">
                      {isMarathi || isHindi ? spice.descMr : spice.descEn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Band: Order & Distributorship Callout */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={getMasalaOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="size-4 fill-current" />
                  <span>
                    {isMarathi
                      ? "मसाला व मासे ऑर्डर करा"
                      : isHindi
                      ? "मसाला व मछली ऑर्डर करें"
                      : "Order Spices on WhatsApp"}
                  </span>
                </a>

                <a
                  href="tel:+919130639524"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-[#F59E0B] hover:text-[#071A24] text-white font-bold text-xs sm:text-sm transition-all duration-200 border border-white/15 cursor-pointer"
                >
                  <PhoneCall className="size-4" />
                  <span>
                    {isMarathi
                      ? "डिस्ट्रीब्युटरशिप: ९१३०६३९५२४"
                      : isHindi
                      ? "डिस्ट्रीब्यूटरशिप: ९१३०६३९५२४"
                      : "Distributorship: 9130639524"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FEATURE 2: BENEFITS OF EATING FISH (मासे खाण्याचे फायदे) ================= */}
        <div className="mb-14 rounded-3xl bg-[#F8FAFC] border border-[#071A24]/10 p-6 sm:p-10 lg:p-12 shadow-sm">
          {/* Section Sub-Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FF] border border-[#0A9AD9]/30 text-xs font-bold text-[#0A9AD9] uppercase tracking-wider">
              <Heart className="size-3.5 text-rose-500 fill-rose-500" />
              <span>
                {isMarathi
                  ? "आरोग्याची गावरान गुरुकिल्ली"
                  : isHindi
                  ? "उत्तम स्वास्थ्य की कुंजी"
                  : "Pure Health from River & Sea"}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-marathi-display text-[#071A24]">
              {isMarathi
                ? "मासे खाण्याचे अनमोल फायदे"
                : isHindi
                ? "मछली खाने के अनमोल फायदे"
                : "Proven Health Benefits of Eating Fresh Fish"}
            </h3>

            <p className="text-sm text-[#071A24]/75 font-marathi-body">
              {isMarathi
                ? "गावरान ताकद, निरोगी हृदय आणि तीक्ष्ण नजर — आमच्या कराड दालनातील अधिकृत फलकावर सांगितलेले १० आरोग्यदायी फायदे."
                : isHindi
                ? "प्राकृतिक शक्ति, स्वस्थ हृदय और तीक्ष्ण नजर — हमारे कराड स्टोर के आधिकारिक फलक पर बताए गए १० स्वास्थ्य लाभ।"
                : "Authentic nutritional guidance displayed directly on the AN Fish World Karad store guidance board."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: 6 Clean Benefit Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fishBenefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#071A24]/08 hover:border-[#0A9AD9] hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group"
                  >
                    <div className="size-10 rounded-xl bg-[#EBF8FF] text-[#0A9AD9] flex items-center justify-center shrink-0 group-hover:bg-[#0A9AD9] group-hover:text-white transition-colors duration-200">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-marathi-display text-[#071A24] group-hover:text-[#0A9AD9] transition-colors">
                        {isMarathi || isHindi ? b.titleMr : b.titleEn}
                      </h4>
                      <p className="mt-1 text-xs text-[#071A24]/70 font-marathi-body leading-relaxed">
                        {isMarathi || isHindi ? b.descMr : b.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Real Store Board Photo (Straight & Enhanced) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                onClick={() => setActiveImageModal("/media/fish-benefits-board.jpg")}
                className="group relative w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden border-2 border-[#071A24]/10 hover:border-[#0A9AD9] shadow-xl cursor-pointer bg-slate-900 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative aspect-16/10 w-full">
                  <Image
                    src="/media/fish-benefits-board.webp"
                    alt="AN Fish World Benefits of Eating Fish Board"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A24]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-[#0A9AD9] text-white font-extrabold shadow-md">
                      {isMarathi ? "अधिकृत माहिती फलक" : isHindi ? "आधिकारिक सूचना बोर्ड" : "In-Store Wall Guide"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      <ZoomIn className="size-3.5" />
                      {isMarathi ? "मोठे करा" : isHindi ? "बड़ा करें" : "Zoom"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[0.72rem] text-[#071A24]/60 font-marathi-body mt-2 text-center">
                {isMarathi
                  ? "कराड मुख्य दालनात लावलेला अधिकृत 'मासे खाण्याचे फायदे' फलक"
                  : isHindi
                  ? "कराड मुख्य स्टोर पर लगा हुआ आधिकारिक 'मछली खाने के फायदे' बोर्ड"
                  : "Official 'Benefits of Eating Fish' board at Karad store"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= ADDITIONAL TRUST BADGES ================= */}
        <div className="p-5 rounded-2xl bg-[#EBF8FF] border border-[#0B9DD8]/20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-[#071A24]">
          {additionalBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0A9AD9]" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LIGHTBOX IMAGE ZOOM MODAL ================= */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className={`relative w-full bg-[#071A24] rounded-2xl overflow-hidden border border-white/20 p-2 shadow-2xl ${
              activeImageModal.includes("fish-benefits-board") ? "max-w-4xl" : "max-w-2xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative max-h-[82vh] w-full rounded-xl overflow-hidden ${
                activeImageModal.includes("fish-benefits-board") ? "aspect-16/10" : "aspect-3/4"
              }`}
            >
              <Image
                src={activeImageModal}
                alt="Enlarged Store Photo"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-3 flex items-center justify-between text-white">
              <span className="text-xs text-white/70">
                {isMarathi
                  ? "प्रत्यक्ष AN Fish World दालनाची छायाचित्रे"
                  : isHindi
                  ? "प्रत्यक्ष AN Fish World स्टोर की तस्वीरें"
                  : "Real AN Fish World Outlet Photography"}
              </span>
              <button
                onClick={() => setActiveImageModal(null)}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#0A9AD9] hover:text-[#071A24] text-xs font-bold transition-colors cursor-pointer"
              >
                {isMarathi ? "बंद करा" : isHindi ? "बंद करें" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
