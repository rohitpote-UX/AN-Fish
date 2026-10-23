"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useBasketStore } from "@/store/basket";
import { MessageCircle, Phone, ArrowUp } from "lucide-react";

export function FinalCta() {
  const tCommon = useTranslations("common");
  const openDrawer = useBasketStore((state) => state.openDrawer);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="final-cta"
      data-section="final-cta"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 text-center"
    >
      <div className="rounded-3xl bg-gradient-to-b from-[#063A63]/50 via-[#02111F]/80 to-[#05080C] border border-[#6EC6F0]/30 p-10 sm:p-16 backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          आजच्या ताज्या आवकेचा आस्वाद घ्या
        </h2>
        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-10">
          पहाटे ४:०० AM ची ताजी मासोळी थेट आपल्या दारात. घरबसल्या व्हॉट्सॲपवर ऑर्डर करा.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openDrawer()}
            className="px-8 py-4 rounded-xl bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(10,154,217,0.5)] flex items-center gap-2.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{tCommon("whatsappOrder")}</span>
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="px-6 py-4 rounded-xl bg-[#02111F] border border-white/20 hover:border-white text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>{tCommon("backToTop")}</span>
            <ArrowUp className="w-4 h-4 text-[#6EC6F0]" />
          </button>
        </div>
      </div>
    </section>
  );
}
