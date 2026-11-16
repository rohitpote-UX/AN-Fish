"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Store, TrendingUp, MessageCircle, ShieldCheck, CheckCircle2, Truck } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";
import { MaharashtraGisMap } from "./MaharashtraGisMap";

export function MaharashtraMapSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  return (
    <section
      id="franchise-map"
      data-section="maharashtra-map"
      className="relative py-10 sm:py-12 md:py-14 pb-14 sm:pb-14 bg-[#071423] text-white overflow-x-hidden selection:bg-[#0A9AD9] selection:text-white"
    >
      {/* Background Ambient Ocean Glow & Subtle Light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,rgba(6,58,99,0.05)_50%,transparent_70%)] pointer-events-none select-none blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#0A9AD9]/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A9AD9]/15 border border-[#38BDF8]/30 text-xs sm:text-sm font-bold text-[#6EC6F0] mb-3 sm:mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(10,154,217,0.25)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FBBF24]" />
            </span>
            <span className="tracking-wide">
              {isMarathi
                ? "संपूर्ण महाराष्ट्रात २५+ अधिकृत दालने"
                : isHindi
                ? "पूरे महाराष्ट्र में २५+ अधिकृत शाखाएं"
                : "25+ Official Seafood Stores Across Maharashtra"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-marathi-display text-white tracking-tight leading-[1.2] sm:leading-[1.15]">
            {isMarathi ? (
              <>
                महाराष्ट्राच्या कानाकोपऱ्यात{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#38BDF8]">
                  कराडची लाडकी मासोळी..!
                </span>
              </>
            ) : isHindi ? (
              <>
                महाराष्ट्र के कोने-कोने में{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#38BDF8]">
                  कराड की चहेती मछली..!
                </span>
              </>
            ) : (
              <>
                Karad&apos;s Beloved Fish —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#38BDF8] to-[#25D366]">
                  Across Every Corner of Maharashtra
                </span>
              </>
            )}
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-white/80 font-marathi-body max-w-3xl mx-auto leading-relaxed">
            {isMarathi
              ? "कराड मुख्य केंद्रासह सातारा, सांगली, कोल्हापूर, पुणे, सोलापूर आणि थेट अरबी समुद्र बंदरांवर आमचे नेटवर्क. कोणत्याही दुकानावर (Pin) क्लिक करा आणि त्या दालनाचा आजचा उपलब्ध मासोळी साठा व माहिती पहा!"
              : isHindi
              ? "कराड मुख्य केंद्र के साथ सातारा, सांगली, कोल्हापुर, पुणे, सोलापुर और सीधे अरब सागर बंदरगाहों पर हमारा नेटवर्क। किसी भी दुकान (Pin) पर क्लिक करें और उस शाखा का आज का उपलब्ध मछली स्टॉक व जानकारी देखें!"
              : "From our Karad central hub across Satara, Sangli, Kolhapur, Pune, Solapur, and Arabian Sea harbour docks. Click any store pin to open its live landing page with today's catch!"}
          </p>
        </div>

        {/* PREMIUM INTERACTIVE GIS MAP (districts, explorer sidebar, markers, controls, details panel) */}
        <MaharashtraGisMap />

        {/* 4 FEATURE CARDS: 2x2 grid on mobile, 1 col on <=340px, icon on top, equal heights, 14-16px padding */}
        <div className="mt-8 grid grid-cols-1 min-[341px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0A9AD9]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                {isMarathi ? "थेट बंदरावरून आवक" : isHindi ? "सीधे बंदरगाह से आवक" : "Direct Harbor Catch"}
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                {isMarathi ? "दररोज पहाटे ४:०० ची निवड" : isHindi ? "हर सुबह ४:०० बजे का चयन" : "Daily 4:00 AM Harvest"}
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                {isMarathi ? "०°C नैसर्गिक गारवा" : isHindi ? "०°C प्राकृतिक ठंडक" : "0°C Natural Chill"}
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                {isMarathi ? "१००% फॉर्मेलिनमुक्त हमी" : isHindi ? "१००% फॉर्मेलिन मुक्त गारंटी" : "100% Formalin-Free"}
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FBBF24]/20 text-[#FBBF24] flex items-center justify-center shrink-0 mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                {isMarathi ? "३० मिनिटांत घरपोच" : isHindi ? "३० मिनट में घरपहुंच" : "30-Min Express Delivery"}
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                {isMarathi ? "स्थानिक दालनातून एक्सप्रेस सेवा" : isHindi ? "नजदीकी शाखा से एक्सप्रेस सेवा" : "Express From Local Store"}
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 flex flex-col items-start justify-between min-h-[110px] sm:min-h-[120px]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#A855F7]/20 text-purple-300 flex items-center justify-center shrink-0 mb-2">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-white font-marathi-display leading-snug">
                {isMarathi ? "२५+ सक्रिय दालने" : isHindi ? "२५+ सक्रिय शाखाएं" : "25+ Active Outlets"}
              </h4>
              <p className="text-[12px] sm:text-[13px] text-white/65 font-marathi-body mt-0.5 leading-normal">
                {isMarathi ? "महाराष्ट्रातील सर्वात मोठे नेटवर्क" : isHindi ? "महाराष्ट्र का सबसे बड़ा नेटवर्क" : "Largest Network"}
              </p>
            </div>
          </div>
        </div>

        {/* STREAMLINED STORE DIRECTORY (Header & View All 25 Stores Button in One Clean Line with Generous Whitespace) */}
        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#061A26]/90 via-[#0A2637]/80 to-[#061A26]/90 border border-white/10 shadow-xl backdrop-blur-md">
            <div className="space-y-1.5 max-w-2xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-black font-marathi-display text-white flex items-center gap-2.5">
                <Store className="w-5 h-5 text-[#FBBF24] shrink-0" />
                <span>
                  {isMarathi
                    ? "सर्व अधिकृत दालनांची यादी (आपले जवळचे दालन निवडा)"
                    : isHindi
                    ? "सभी अधिकृत शाखाओं की सूची (अपनी नजदीकी शाखा चुनें)"
                    : "Official Outlets Directory (Select Your Nearest Branch)"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-marathi-body leading-relaxed pl-7.5">
                {isMarathi
                  ? "प्रत्येक दालनाच्या लिंकवर क्लिक करून त्या दुकानातील आजचा उपलब्ध साठा, पत्ता व थेट संपर्क पहा."
                  : isHindi
                  ? "प्रत्येक शाखा के लिंक पर क्लिक करके उस दुकान का आज का उपलब्ध स्टॉक, पता व सीधा संपर्क देखें।"
                  : "Click any branch link to view today's live stock, address, and direct WhatsApp contact."}
              </p>
            </div>

            <div className="shrink-0 pl-7.5 lg:pl-0">
              <Link
                href={`/${locale}/branches`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#0A9AD9] hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase tracking-wider font-marathi-display shadow-[0_4px_20px_rgba(10,154,217,0.35)] border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#FBBF24]" />
                <span>
                  {isMarathi
                    ? "महाराष्ट्रातील सर्व २५ दालने पहा (View All 25 Stores) →"
                    : isHindi
                    ? "महाराष्ट्र की सभी २५ शाखाएं देखें (View All 25 Stores) →"
                    : "View All 25 Stores Across Maharashtra →"}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* FRANCHISE BUSINESS PARTNER INVITATION BANNER */}
        <div className="mt-10 sm:mt-12 rounded-3xl bg-gradient-to-r from-[#0C2A3C] via-[#092230] to-[#071924] border-2 border-[#FBBF24]/30 p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {isMarathi
                  ? "फ्रँचायझी संधी (Business Partnership)"
                  : isHindi
                  ? "फ़्रैंचाइज़ी अवसर (Business Partnership)"
                  : "Franchise Opportunity"}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black font-marathi-display text-white">
              {isMarathi
                ? "आपल्या गावात / शहरात AN Fish World फ्रँचायझी सुरू करा!"
                : isHindi
                ? "अपने गाँव / शहर में AN Fish World फ़्रैंचाइज़ी शुरू करें!"
                : "Start an AN Fish World Store in Your Town or Village!"}
            </h3>
            <p className="text-xs sm:text-sm text-white/75 font-marathi-body max-w-2xl">
              {isMarathi
                ? "थेट बंदरावरून दररोज पहाटे अखंड ताजी आवक, ०°C कोल्ड चेन पुरवठा आणि कराडच्या लाडक्या ब्रँडचा संपूर्ण पाठबळ. कमी गुंतवणुकीत खात्रीशीर नफा!"
                : isHindi
                ? "सीधे बंदरगाह से हर सुबह ताजी आवक, ०°C कोल्ड चेन नेटवर्क और कराड के चहेते ब्रांड का पूरा सहयोग। कम निवेश में निश्चित मुनाफा!"
                : "Direct harbor supplies, 0°C cold chain network, and end-to-end operational support. Partner with Maharashtra's fastest growing seafood brand."}
            </p>
          </div>

          <a
            href={`https://wa.me/${PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              isMarathi
                ? "नमस्कार, मला AN Fish World ची नवीन फ्रँचायझी दालन सुरू करण्याविषयी सविस्तर माहिती हवी आहे."
                : isHindi
                ? "नमस्ते, मुझे AN Fish World की नई फ़्रैंचाइज़ी शाखा शुरू करने के बारे में विस्तृत जानकारी चाहिए।"
                : "Hello, I want details regarding opening an AN Fish World franchise store."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D97706] text-[#071A24] font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(251,191,36,0.4)] cursor-pointer font-marathi-display"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>{isMarathi ? "फ्रँचायझी चौकशी करा" : isHindi ? "फ़्रैंचाइज़ी पूछताछ करें" : "Inquire Franchise"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
