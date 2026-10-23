"use client";

import React from "react";
import { useLocale } from "next-intl";
import { MapPin, Star, UtensilsCrossed, Hotel, Building2, Store } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";

export function LogoCluster() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const platforms = [
    {
      name: "Instagram",
      handle: "@anfishworld",
      metric: "152K Followers",
      icon: InstagramIcon,
      color: "hover:text-[#E1306C] hover:border-[#E1306C]/40",
      href: "https://instagram.com",
    },
    {
      name: "YouTube",
      handle: "AN Fish World Karad",
      metric: "70.5K Subscribers",
      icon: YoutubeIcon,
      color: "hover:text-[#FF0000] hover:border-[#FF0000]/40",
      href: "https://youtube.com",
    },
    {
      name: "Facebook",
      handle: "AN Fish World",
      metric: "Active Community",
      icon: FacebookIcon,
      color: "hover:text-[#1877F2] hover:border-[#1877F2]/40",
      href: "https://facebook.com",
    },
    {
      name: "Justdial",
      handle: "Karad Retail",
      metric: "4.7★ (22 ratings)",
      icon: Star,
      color: "hover:text-amber-500 hover:border-amber-500/40",
      href: "https://justdial.com",
    },
    {
      name: "Google Maps",
      handle: "Malkapur Karad Hub",
      metric: "Verified Location",
      icon: MapPin,
      color: "hover:text-emerald-500 hover:border-emerald-500/40",
      href: "#karad-store",
    },
  ];

  const b2bPartners = [
    { name: "Highway Pearl Resort", type: "Hotel & Banquet", icon: Hotel },
    { name: "Hotel Malvan Katta Karad", type: "Seafood Specialty", icon: UtensilsCrossed },
    { name: "Saffron Caterers", type: "Wedding Catering", icon: Building2 },
    { name: "Patan Royal Dining", type: "Family Restaurant", icon: Store },
  ];

  return (
    <section
      aria-label="Find Us Everywhere"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-12 select-none"
    >
      <div className="max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono-accent text-[#0A9AD9] uppercase font-bold tracking-widest block">
          // CONNECT & CHANNELS
        </span>
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1F10] tracking-tight ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "जिथे आमचा परिवार, तिथे आम्ही हजर." : "Find us everywhere our family is."}
        </h2>
        <p className="text-sm sm:text-base text-[#0F1F10]/65">
          {isMarathi
            ? "दैनिक आवक रील्स, ग्राहकांची मते आणि थेट लोकेशन मॅप्सद्वारे आमच्याशी जोडलेले रहा."
            : "Follow daily auction reels, customer feedback, and reach our counters via verified digital channels."}
        </p>
      </div>

      {/* Loose cluster layout like Alethia reference */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
        {platforms.map((p) => {
          const Icon = p.icon;
          return (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-5 sm:p-6 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 min-w-[220px] sm:min-w-[260px] text-left group ${p.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#0F1F10]/10 flex items-center justify-center text-[#0F1F10] group-hover:scale-110 transition-transform shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#0F1F10] block group-hover:text-inherit transition-colors">
                  {p.name}
                </span>
                <span className="text-xs font-mono-accent text-[#0A9AD9] font-bold block mt-0.5">
                  {p.metric}
                </span>
                <span className="text-[11px] text-[#0F1F10]/50 block">
                  {p.handle}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Commercial B2B Partner Trust Badges */}
      <div className="pt-8 border-t border-[#0F1F10]/08 max-w-4xl mx-auto">
        <span className="text-[11px] font-mono-accent uppercase tracking-widest text-[#0F1F10]/40 font-bold block mb-6">
          {isMarathi ? "कराडमधील नामांकित हॉटेल्स व केटरर्सचा विश्वासू पुरवठादार" : "TRUSTED SEAFOOD PARTNER TO LEADING KARAD KITCHENS"}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {b2bPartners.map((b) => {
            const BIcon = b.icon;
            return (
              <div
                key={b.name}
                className="p-4 rounded-2xl bg-white border border-[#0F1F10]/08 flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EBF8FF] flex items-center justify-center text-[#0A9AD9] shrink-0">
                  <BIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0F1F10] block truncate">{b.name}</span>
                  <span className="text-[10px] text-[#0F1F10]/50 font-mono-accent block">{b.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
