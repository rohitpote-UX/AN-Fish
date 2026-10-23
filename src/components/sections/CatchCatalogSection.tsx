"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FISH_CATALOG, FishItem } from "@/data/fishCatalog";
import { useDepthStore } from "@/store/useDepthStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, Compass, ShieldCheck } from "lucide-react";

export function CatchCatalogSection() {
  const t = useTranslations("catalog");
  const tFish = useTranslations("fish");
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [activeCategory, setActiveCategory] = useState<"all" | "sea" | "river" | "shellfish">("all");
  const [selectedCuts, setSelectedCuts] = useState<Record<string, string>>({});

  const addToCart = useDepthStore((state) => state.addToCart);
  const openOrderDrawer = useDepthStore((state) => state.openOrderDrawer);

  const filteredFish = FISH_CATALOG.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const handleSelectCut = (fishId: string, cut: string) => {
    setSelectedCuts((prev) => ({ ...prev, [fishId]: cut }));
  };

  const handleAddToCart = (fish: FishItem) => {
    const chosenCut = selectedCuts[fish.id] || fish.cuts[0];
    addToCart({
      fish,
      cut: chosenCut,
      weight: "500g",
      quantity: 1,
    });
  };

  return (
    <section
      id="the-catch"
      data-section="the-catch"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063A63]/30 border border-[#0A9AD9]/40 text-xs font-mono-accent text-[#6EC6F0] mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>DEPTH: 15M - 75M • HARBOUR AUCTION</span>
        </div>

        <h2
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight`}
        >
          {t("sectionTitle")}
        </h2>
        <p
          className={`mt-4 text-base sm:text-lg text-[#E9F7FF]/80 ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {t("sectionSubtitle")}
        </p>
      </div>

      {/* Category Filter Tabs (Framer Motion layout) */}
      <div
        role="tablist"
        aria-label="Fish Categories"
        className="flex flex-wrap items-center gap-2.5 mb-10 pb-2 border-b border-[#6EC6F0]/15"
      >
        {(["all", "sea", "river", "shellfish"] as const).map((cat) => (
          <button
            key={cat}
            id={`tab-category-${cat}`}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? "text-[#05080C] font-bold"
                : "text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 rounded-full bg-[#0A9AD9] shadow-[0_0_15px_rgba(10,154,217,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t(`tabs.${cat}`)}</span>
          </button>
        ))}
      </div>

      {/* Fish Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredFish.map((fish) => {
            const currentCut = selectedCuts[fish.id] || fish.cuts[0];
            const badgeLabel = fish.badgeKey ? tFish(fish.badgeKey) : null;
            const tasteNotes = tFish(fish.tasteNotesKey);
            const culinaryNotes = tFish(fish.culinaryUseKey);

            return (
              <motion.article
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={fish.id}
                className="group relative rounded-2xl bg-[#02111F]/70 border border-[#6EC6F0]/20 hover:border-[#0A9AD9] p-6 backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_36px_rgba(10,154,217,0.25)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Tags: Depth + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#05080C] text-[10px] font-mono-accent text-[#6EC6F0] border border-[#6EC6F0]/20">
                      {fish.depthMeters}M DEPTH
                    </span>
                    {badgeLabel && (
                      <span className="px-2.5 py-1 rounded-full bg-[#0A9AD9]/20 text-[10px] font-semibold text-white border border-[#0A9AD9]/40">
                        {badgeLabel}
                      </span>
                    )}
                  </div>

                  {/* Fish Name & Scientific nomenclature */}
                  <h3
                    className={`${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    } text-2xl font-bold text-white group-hover:text-[#6EC6F0] transition-colors`}
                  >
                    {isMarathi ? fish.marathiName : tFish(fish.nameKey)}
                  </h3>
                  <div className="text-[11px] font-mono-accent text-white/40 italic mt-0.5">
                    {fish.scientificName}
                  </div>

                  {/* Daily Price & Min Order */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono-accent text-[#6EC6F0]">
                      {fish.price}
                    </span>
                    <span className="text-xs text-white/50">
                      (Min: {fish.minOrderWeight})
                    </span>
                  </div>

                  {/* Taste Profile & Recipe notes */}
                  <p
                    className={`mt-3 text-xs sm:text-sm text-white/75 leading-relaxed ${
                      isMarathi ? "font-marathi-body" : "font-sans"
                    }`}
                  >
                    {tasteNotes}
                  </p>

                  <div className="mt-2 text-xs text-[#6EC6F0]/90 font-medium">
                    <span className="text-white/50">Best with: </span>
                    {culinaryNotes}
                  </div>

                  {/* Artisanal Cut Selector */}
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                      {t("cutsLabel")}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {fish.cuts.map((cutKey) => (
                        <button
                          key={cutKey}
                          id={`cut-btn-${fish.id}-${cutKey}`}
                          type="button"
                          onClick={() => handleSelectCut(fish.id, cutKey)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                            currentCut === cutKey
                              ? "bg-[#0A9AD9] text-white font-semibold shadow-sm"
                              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {t(`cutTypes.${cutKey}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2.5">
                  <button
                    id={`add-to-basket-${fish.id}`}
                    type="button"
                    onClick={() => handleAddToCart(fish)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0A9AD9] text-white hover:bg-[#6EC6F0] hover:text-[#05080C] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-[#FFFFFF] cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t("addToCart")}</span>
                  </button>

                  <button
                    id={`quick-reserve-${fish.id}`}
                    type="button"
                    onClick={() => openOrderDrawer(fish)}
                    aria-label={`Instant order ${fish.marathiName}`}
                    className="p-3 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-[#6EC6F0]" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Daily Auction Transparency Disclaimer */}
      <div className="mt-12 p-4 rounded-xl bg-[#02111F]/50 border border-[#6EC6F0]/20 flex items-start gap-3 text-xs text-white/70">
        <ShieldCheck className="w-4 h-4 text-[#0A9AD9] flex-shrink-0 mt-0.5" />
        <p>{t("dailyMarketNote")}</p>
      </div>
    </section>
  );
}
