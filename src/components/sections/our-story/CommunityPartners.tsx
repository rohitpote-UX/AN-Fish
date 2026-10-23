"use client";

import React from "react";
import { useLocale } from "next-intl";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { Star, MapPin, Phone, Users, ShieldCheck } from "lucide-react";

export function CommunityPartners() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  return (
    <section
      aria-label="Community and Partners"
      className="py-24 sm:py-32 bg-[#F5F4F2] border-y border-[#0F1F10]/08 text-center space-y-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0F1F10]/10 text-xs font-mono-accent text-[#0A9AD9] uppercase tracking-wider font-bold shadow-xs">
          <Users className="w-3.5 h-3.5" />
          <span>{isMarathi ? "समुदाय व विश्वास • COMMUNITY PROOF" : "COMMUNITY PROOF • 152K+ FAMILIES"}</span>
        </div>

        {/* Statement [C] */}
        <blockquote
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F10] tracking-tight leading-[1.08] ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          &ldquo;{isMarathi
            ? "जेव्हा ताजेपणाशी कोणतीही तडजोड चालत नाही, तेव्हा कुटुंबे निवडतात ए एन फिश वर्ल्ड."
            : "When freshness isn't negotiable, families choose AN Fish World."}&rdquo;
        </blockquote>

        <p
          className={`text-base sm:text-lg text-[#0F1F10]/70 max-w-2xl mx-auto ${
            isMarathi ? "font-marathi-body" : "font-sans"
          }`}
        >
          {isMarathi
            ? "कराड, पाटण आणि ईश्वरपूरमधील १,५२,००० हून अधिक कुटुंबांचा विश्वास आणि महाराष्ट्रातील सर्वात मोठे ऑनलाइन सीफूड नेटवर्क."
            : "Supported by over 152,000 families across Western Maharashtra who rely on our daily morning auction harvests."}
        </p>
      </div>

      {/* Platform Badges Cluster [V] */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Instagram Card */}
        <a
          href="https://instagram.com/an.fishworld"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-white border border-[#0F1F10]/08 hover:border-[#E1306C]/40 shadow-xs hover:shadow-lg transition-all duration-300 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <InstagramIcon className="w-5 h-5 text-[#E1306C]" />
          </div>
          <span className="text-2xl font-black font-mono-accent text-[#0F1F10] block">
            152K+
          </span>
          <span className="text-xs font-bold text-[#0F1F10] block mt-1">
            Instagram Followers
          </span>
          <span className="text-[11px] font-mono-accent text-[#0F1F10]/50 block mt-0.5">
            @an.fishworld
          </span>
        </a>

        {/* YouTube Card */}
        <a
          href="https://youtube.com/@ANFishworld"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-white border border-[#0F1F10]/08 hover:border-[#FF0000]/40 shadow-xs hover:shadow-lg transition-all duration-300 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <YoutubeIcon className="w-5 h-5 text-[#FF0000]" />
          </div>
          <span className="text-2xl font-black font-mono-accent text-[#0F1F10] block">
            70.5K
          </span>
          <span className="text-xs font-bold text-[#0F1F10] block mt-1">
            YouTube Subscribers
          </span>
          <span className="text-[11px] font-mono-accent text-[#0F1F10]/50 block mt-0.5">
            @ANFishworld
          </span>
        </a>

        {/* Justdial Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#0F1F10]/08 hover:border-amber-400/40 shadow-xs hover:shadow-lg transition-all duration-300 text-left group">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-black font-mono-accent text-[#0F1F10] block">
            4.7 ★
          </span>
          <span className="text-xs font-bold text-[#0F1F10] block mt-1">
            Justdial Verified
          </span>
          <span className="text-[11px] font-mono-accent text-[#0F1F10]/50 block mt-0.5">
            22+ Direct Ratings
          </span>
        </div>

        {/* Google Maps Verified Store Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#0F1F10]/08 hover:border-emerald-500/40 shadow-xs hover:shadow-lg transition-all duration-300 text-left group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black font-mono-accent text-[#0F1F10] block">
            3 Hubs
          </span>
          <span className="text-xs font-bold text-[#0F1F10] block mt-1">
            Regional Presence
          </span>
          <span className="text-[11px] font-mono-accent text-[#0F1F10]/50 block mt-0.5">
            Karad • Patan • Ishwarpur
          </span>
        </div>
      </div>
    </section>
  );
}
