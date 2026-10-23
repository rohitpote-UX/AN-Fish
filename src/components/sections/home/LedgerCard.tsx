"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { COMMUNITY_STATS } from "@/data/stats";
import { Star, Users } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

export function LedgerCard() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt & layer displacement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  // Layer offsets
  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  const layer2X = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [-16, 16]);

  const layer3X = useTransform(smoothX, [-0.5, 0.5], [-36, 36]);
  const layer3Y = useTransform(smoothY, [-0.5, 0.5], [-24, 24]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-3xl bg-[#0F1F10] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden group cursor-pointer"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(10,154,217,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3 Layered Images (654x528 ratio) behaving as Alethia's reference */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 w-full flex items-center justify-center">
            {/* Layer 1 (Back - Harbour Dawn Catch) */}
            <motion.div
              style={{ x: layer1X, y: layer1Y, rotate: -4 }}
              className="absolute w-[75%] aspect-[654/528] rounded-2xl overflow-hidden shadow-2xl border border-white/15 -left-2 top-4 group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/media/harbour-catch.jpg"
                alt="4:00 AM harbour dawn sourcing"
                fill
                sizes="(max-width: 768px) 70vw, 400px"
                className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono-accent text-white/90 uppercase font-bold tracking-wider">
                01 • DAWN HARBOUR
              </div>
            </motion.div>

            {/* Layer 2 (Middle - Clean Cutting Hygiene) */}
            <motion.div
              style={{ x: layer2X, y: layer2Y, rotate: 2 }}
              className="absolute w-[75%] aspect-[654/528] rounded-2xl overflow-hidden shadow-2xl border border-white/20 left-12 top-8 group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/media/cutting-hygiene.jpg"
                alt="RO clean kitchen cuts"
                fill
                sizes="(max-width: 768px) 70vw, 400px"
                className="object-cover brightness-95 group-hover:brightness-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono-accent text-white/90 uppercase font-bold tracking-wider">
                02 • HYGIENIC CUTTING
              </div>
            </motion.div>

            {/* Layer 3 (Foreground - Family Dinner Table) */}
            <motion.div
              style={{ x: layer3X, y: layer3Y, rotate: -1 }}
              className="absolute w-[75%] aspect-[654/528] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#0A9AD9] right-0 bottom-2 group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/media/family-dinner.jpg"
                alt="Family dining fresh fish feast"
                fill
                sizes="(max-width: 768px) 70vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono-accent text-[#6EC6F0] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9] animate-ping" />
                <span>03 • FAMILY KITCHEN</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Big Number "152K+" & Caption + Badges */}
          <div className="lg:col-span-5 text-left space-y-5 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-[#0A9AD9]" />
              <span>{isMarathi ? "समुदाय व विश्वास" : "TRUSTED SCALE"}</span>
            </div>

            {/* Big Stat Number */}
            <div className="space-y-1">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono-accent tracking-tight text-white group-hover:text-[#6EC6F0] transition-colors duration-300 leading-none">
                {COMMUNITY_STATS.TOTAL_FAMILIES}
              </div>
              <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed pt-2">
                {isMarathi ? COMMUNITY_STATS.CAPTION_MR : COMMUNITY_STATS.CAPTION_EN}
              </p>
            </div>

            {/* Mini proof badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-mono-accent">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/90">
                <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>152K Insta</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/90">
                <YoutubeIcon className="w-3.5 h-3.5 text-[#FF0000]" />
                <span>70.5K YT</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/90">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.7★ Justdial</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
