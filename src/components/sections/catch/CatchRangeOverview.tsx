"use client";

import React from "react";
import { SPECIES_DATA } from "@/data/species";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Fish, ArrowRight } from "lucide-react";

interface CatchRangeOverviewProps {
  locale: string;
}

export function CatchRangeOverview({ locale }: CatchRangeOverviewProps) {
  const isMarathi = locale === "mr";
  const tFish = useTranslations("fish");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#6EC6F0]/20">
        <div>
          <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase">
            // The Complete Coastal & Freshwater Specimen Index
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {isMarathi ? "सर्व प्रजाती व वैशिष्ट्ये" : "Full Species Directory"}
          </h2>
        </div>
        <div className="text-xs font-mono-accent text-[#6EC6F0]">
          {SPECIES_DATA.length} Species Catalogued
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPECIES_DATA.map((fish) => {
          let fishName = fish.marathiName;
          try {
            if (fish.nameKey) {
              fishName = tFish(fish.nameKey);
            }
          } catch {
            fishName = fish.marathiName;
          }

          return (
            <Link
              key={fish.slug}
              href={`/catch/${fish.slug}`}
              className="group rounded-2xl bg-[#02111F]/70 border border-[#6EC6F0]/20 hover:border-[#0A9AD9] p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono-accent text-[#6EC6F0]">
                    {fish.depthMeters}m Depth
                  </span>
                  <span className="text-xs font-mono-accent text-white/40 group-hover:text-[#0A9AD9] transition-colors">
                    {fish.category.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#6EC6F0] transition-colors">
                    {fishName}
                  </h3>
                  <p className="text-xs text-[#E9F7FF]/60 italic font-mono-accent mt-0.5">
                    {fish.scientificName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(fish.cuts ?? []).slice(0, 3).map((cut, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded-md bg-[#0A9AD9]/10 text-[#6EC6F0] text-[10px] font-mono-accent"
                    >
                      {cut}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#0A9AD9] font-bold">
                <span className="flex items-center gap-1.5">
                  <Fish className="w-3.5 h-3.5" />
                  <span>{isMarathi ? "तपशील व पाककृती" : "Species Details"}</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
