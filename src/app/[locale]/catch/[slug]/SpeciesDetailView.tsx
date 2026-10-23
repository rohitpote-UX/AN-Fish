"use client";

import React, { useState } from "react";
import { Species, CutType } from "@/types";
import { useBasketStore } from "@/store/basket";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ShoppingBag, Send, ShieldCheck, Sparkles } from "lucide-react";

interface SpeciesDetailViewProps {
  species: Species;
  locale: string;
  tasteNotes: string;
  culinaryNotes: string;
  badgeText?: string;
}

export function SpeciesDetailView({
  species,
  locale,
  tasteNotes,
  culinaryNotes,
  badgeText,
}: SpeciesDetailViewProps) {
  const isMarathi = locale === "mr";
  const availableCuts: CutType[] = species.cuts && species.cuts.length > 0 ? species.cuts : ["curry", "fry", "wholeCleaned"];
  const [selectedCut, setSelectedCut] = useState<CutType>(availableCuts[0]);

  const addItem = useBasketStore((state) => state.addItem);
  const openDrawer = useBasketStore((state) => state.openDrawer);

  const handleAdd = () => {
    addItem({
      species,
      cut: selectedCut,
      cleaningOption: species.cleaningOptions?.[0] ?? "cleaned",
      weight: "500g",
      quantity: 1,
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/catch"
        className="inline-flex items-center gap-2 text-xs font-mono-accent text-[#6EC6F0] hover:text-white mb-8"
      >
        <ArrowLeft className="w-4 h-4 text-[#0A9AD9]" />
        <span>{isMarathi ? "← सर्व मासोळी यादीकडे परत जा" : "← Back to Catch Range"}</span>
      </Link>

      <div className="p-8 sm:p-12 rounded-3xl bg-[#02111F]/80 border border-[#6EC6F0]/25 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-md bg-[#05080C] text-xs font-mono-accent text-[#6EC6F0] border border-[#6EC6F0]/20">
            {species.depthMeters}M DEPTH
          </span>
          {badgeText && (
            <span className="px-3 py-1 rounded-full bg-[#0A9AD9]/20 text-xs font-semibold text-white border border-[#0A9AD9]/40">
              {badgeText}
            </span>
          )}
        </div>

        {/* Single H1 Landmark */}
        <h1
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-3xl sm:text-5xl font-black text-white leading-tight`}
        >
          {species.marathiName}
        </h1>
        <div className="text-sm font-mono-accent text-white/50 italic mt-1">
          {species.scientificName}
        </div>

        {/* Price & Order Limits */}
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-3xl font-black font-mono-accent text-[#6EC6F0]">
            {species.marketPrice}
          </span>
          <span className="text-xs text-white/50">
            (Min Order Weight: {species.minWeight})
          </span>
        </div>

        {/* Taste Profile */}
        <div className="mt-8 space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            {isMarathi ? "चव आणि वैशिष्ट्ये" : "Flavor Profile & Notes"}
          </h2>
          <p className="text-base text-white/85 leading-relaxed">{tasteNotes}</p>
        </div>

        {/* Culinary Pairing */}
        <div className="mt-6 p-4 rounded-xl bg-[#063A63]/30 border border-[#0A9AD9]/30 text-sm text-[#E9F7FF]">
          <span className="font-bold text-[#6EC6F0]">
            {isMarathi ? "सर्वोत्तम पाककृती: " : "Recommended Cooking Style: "}
          </span>
          <span>{culinaryNotes}</span>
        </div>

        {/* Custom Cuts Selection */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">
            {isMarathi ? "आपल्या पसंतीचे कटिंग निवडा:" : "Choose Preferred Cut:"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableCuts.map((cut) => (
              <button
                key={cut}
                type="button"
                onClick={() => setSelectedCut(cut)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCut === cut
                    ? "bg-[#0A9AD9] text-white shadow-[0_0_15px_rgba(10,154,217,0.4)]"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {cut}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 min-w-[200px] py-4 px-6 rounded-xl bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(10,154,217,0.4)] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isMarathi ? "टोपलीत जोडा (Add to Basket)" : "Add to Basket"}</span>
          </button>

          <button
            type="button"
            onClick={() => openDrawer(species)}
            className="py-4 px-6 rounded-xl bg-[#02111F] border border-[#6EC6F0]/40 text-white font-bold text-sm hover:border-[#6EC6F0] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#6EC6F0]" />
            <span>{isMarathi ? "थेट व्हॉट्सॲप ऑर्डर" : "WhatsApp Order"}</span>
          </button>
        </div>

        {/* Assurance Note */}
        <div className="mt-8 flex items-center gap-3 text-xs text-white/60">
          <ShieldCheck className="w-4 h-4 text-[#0A9AD9]" />
          <span>१००% शुद्ध शीतसाखळी • थेट ४:०० AM बोटीवरील निवड • शून्य फॉर्मेलिन</span>
        </div>
      </div>
    </article>
  );
}
