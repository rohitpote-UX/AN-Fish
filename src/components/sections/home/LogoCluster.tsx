"use client";

import React, { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Star, UtensilsCrossed, Hotel, Building2, Store, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";

interface PlatformItem {
  name: string;
  handle: string;
  metric: string;
  statusTag: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  glowColor: string;
  borderGlowColor: string;
  iconHoverBg: string;
  iconHoverText: string;
  pingColor: string;
  dotColor: string;
}

function ChannelCard({ platform, index }: { platform: PlatformItem; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Spring-based 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 260, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlight((prev) => ({ ...prev, visible: false }));
  };

  const Icon = platform.icon;

  return (
    <motion.a
      ref={cardRef}
      href={platform.href}
      target={platform.href.startsWith("#") ? undefined : "_blank"}
      rel={platform.href.startsWith("#") ? undefined : "noopener noreferrer"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-[340px] rounded-3xl bg-[#F8F7F4]/90 hover:bg-white border border-[#0F1F10]/08 hover:border-[#0F1F10]/20 p-6 sm:p-7 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 will-change-transform overflow-hidden flex flex-col justify-between min-h-[160px]"
    >
      {/* 1. Dynamic Cursor Spotlight (Ray-traced ambient glow) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(280px circle at ${spotlight.x}px ${spotlight.y}px, ${platform.glowColor}, transparent 80%)`,
        }}
      />

      {/* 2. Shimmer sweep line on hover */}
      <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />

      {/* 3. Top Row: Floating Icon Container + Live Activity Badge & Action Arrow */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-5" style={{ transform: "translateZ(25px)" }}>
        {/* Floating Brand Icon Container */}
        <div
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#0F1F10]/10 flex items-center justify-center text-[#0F1F10] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300 ${platform.iconHoverBg} ${platform.iconHoverText}`}
        >
          <Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Live Status Pill & Kinetic Arrow */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-white/90 border border-[#0F1F10]/08 text-[#0F1F10]/70 backdrop-blur-xs shadow-2xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${platform.pingColor} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${platform.dotColor}`} />
            </span>
            {platform.statusTag}
          </span>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 border border-[#0F1F10]/10 flex items-center justify-center text-[#0F1F10]/50 group-hover:bg-[#0F1F10] group-hover:text-white group-hover:border-[#0F1F10] transition-all duration-300 shadow-2xs">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* 4. Bottom Info: Platform Name, Accent Metric, Handle */}
      <div className="relative z-10" style={{ transform: "translateZ(18px)" }}>
        <h3 className="text-base sm:text-lg font-bold text-[#0F1F10] tracking-tight group-hover:text-inherit transition-colors leading-snug">
          {platform.name}
        </h3>
        <span className="text-xs sm:text-sm font-mono-accent text-[#0A9AD9] font-bold block mt-1 tracking-tight">
          {platform.metric}
        </span>
        <span className="text-[11px] sm:text-xs text-[#0F1F10]/50 font-mono block mt-0.5 group-hover:text-[#0F1F10]/75 transition-colors">
          {platform.handle}
        </span>
      </div>
    </motion.a>
  );
}

export function LogoCluster() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const platforms: PlatformItem[] = [
    {
      name: "Instagram",
      handle: "@anfishworld",
      metric: "152K Followers",
      statusTag: isMarathi ? "दैनिक रील्स" : "DAILY REELS",
      icon: InstagramIcon,
      glowColor: "rgba(225, 48, 108, 0.16)",
      borderGlowColor: "rgba(225, 48, 108, 0.45)",
      iconHoverBg: "group-hover:bg-gradient-to-tr group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] group-hover:border-transparent",
      iconHoverText: "group-hover:text-white",
      pingColor: "bg-[#E1306C]",
      dotColor: "bg-[#E1306C]",
      href: "https://instagram.com",
    },
    {
      name: "YouTube",
      handle: "AN Fish World Karad",
      metric: "70.5K Subscribers",
      statusTag: isMarathi ? "४K ऑक्शन" : "4K AUCTIONS",
      icon: YoutubeIcon,
      glowColor: "rgba(255, 0, 0, 0.14)",
      borderGlowColor: "rgba(255, 0, 0, 0.45)",
      iconHoverBg: "group-hover:bg-[#FF0000] group-hover:border-transparent",
      iconHoverText: "group-hover:text-white",
      pingColor: "bg-red-500",
      dotColor: "bg-red-600",
      href: "https://youtube.com",
    },
    {
      name: "Facebook",
      handle: "AN Fish World",
      metric: "Active Community",
      statusTag: isMarathi ? "कम्युनिटी" : "COMMUNITY",
      icon: FacebookIcon,
      glowColor: "rgba(24, 119, 242, 0.14)",
      borderGlowColor: "rgba(24, 119, 242, 0.45)",
      iconHoverBg: "group-hover:bg-[#1877F2] group-hover:border-transparent",
      iconHoverText: "group-hover:text-white",
      pingColor: "bg-blue-500",
      dotColor: "bg-blue-600",
      href: "https://facebook.com",
    },
    {
      name: "Justdial",
      handle: "Karad Retail",
      metric: "4.7★ (22 ratings)",
      statusTag: isMarathi ? "४.७★ रेटिंग" : "4.7★ VERIFIED",
      icon: Star,
      glowColor: "rgba(245, 158, 11, 0.16)",
      borderGlowColor: "rgba(245, 158, 11, 0.45)",
      iconHoverBg: "group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:to-amber-400 group-hover:border-transparent",
      iconHoverText: "group-hover:text-white",
      pingColor: "bg-amber-400",
      dotColor: "bg-amber-500",
      href: "https://justdial.com",
    },
    {
      name: "Google Maps",
      handle: "Malkapur Karad Hub",
      metric: "Verified Location",
      statusTag: isMarathi ? "थेट लोकेशन" : "VERIFIED HUB",
      icon: MapPin,
      glowColor: "rgba(16, 185, 129, 0.16)",
      borderGlowColor: "rgba(16, 185, 129, 0.45)",
      iconHoverBg: "group-hover:bg-gradient-to-tr group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:border-transparent",
      iconHoverText: "group-hover:text-white",
      pingColor: "bg-emerald-400",
      dotColor: "bg-emerald-500",
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-center select-none overflow-hidden"
    >
      {/* Ambient background depth orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[500px] h-[350px] bg-gradient-to-tr from-[#0A9AD9]/08 via-[#6EC6F0]/05 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="w-[450px] h-[300px] bg-gradient-to-br from-amber-500/05 via-transparent to-transparent rounded-full blur-3xl opacity-60 translate-y-24" />
      </div>

      {/* Header with Awwwards Telemetry Eyebrow */}
      <div className="max-w-2xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A9AD9]/08 border border-[#0A9AD9]/20 text-xs font-mono-accent text-[#0A9AD9] uppercase font-bold tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A9AD9] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A9AD9]" />
          </span>
          // CONNECT &amp; CHANNELS
        </div>

        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1F10] tracking-tight ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "जिथे आमचा परिवार, तिथे आम्ही हजर." : "Find us everywhere our family is."}
        </h2>

        <p className="text-sm sm:text-base text-[#0F1F10]/65 max-w-xl mx-auto leading-relaxed">
          {isMarathi
            ? "दैनिक आवक रील्स, ग्राहकांची मते आणि थेट लोकेशन मॅप्सद्वारे आमच्याशी जोडलेले रहा."
            : "Follow daily auction reels, customer feedback, and reach our counters via verified digital channels."}
        </p>
      </div>

      {/* High-Performance 3D Dynamic Channel Grid (3 cards row 1, 2 cards centered row 2) */}
      <div
        style={{ perspective: "1000px" }}
        className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 max-w-5xl mx-auto"
      >
        {platforms.map((p, idx) => (
          <ChannelCard key={p.name} platform={p} index={idx} />
        ))}
      </div>

      {/* Luxury Architectural Divider */}
      <div className="pt-16 mt-16 max-w-4xl mx-auto relative">
        <div className="absolute top-16 inset-x-0 flex items-center justify-center">
          <div className="w-full border-t border-[#0F1F10]/10" />
          <div className="absolute px-4 bg-white/90 backdrop-blur-xs text-[10px] font-mono-accent uppercase tracking-[0.22em] text-[#0F1F10]/40 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#0A9AD9]" />
            {isMarathi ? "अधिकृत व्यावसायिक भागीदार" : "VERIFIED HOSPITALITY NETWORK"}
            <span className="w-1.5 h-1.5 rotate-45 bg-[#0A9AD9]" />
          </div>
        </div>

        {/* Commercial B2B Partner Trust Badges */}
        <div className="pt-10">
          <span className="text-[11px] font-mono-accent uppercase tracking-widest text-[#0F1F10]/45 font-bold block mb-6">
            {isMarathi ? "कराडमधील नामांकित हॉटेल्स व केटरर्सचा विश्वासू पुरवठादार" : "TRUSTED SEAFOOD PARTNER TO LEADING KARAD KITCHENS"}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {b2bPartners.map((b, idx) => {
              const BIcon = b.icon;
              return (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 sm:p-4.5 rounded-2xl bg-white border border-[#0F1F10]/08 hover:border-[#0A9AD9]/40 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EBF8FF] border border-[#0A9AD9]/15 flex items-center justify-center text-[#0A9AD9] group-hover:bg-[#0A9AD9] group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0 shadow-2xs">
                    <BIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0F1F10] truncate block group-hover:text-[#0A9AD9] transition-colors">
                        {b.name}
                      </span>
                      <CheckCircle2 className="w-3 h-3 text-[#0A9AD9] shrink-0 opacity-80" />
                    </div>
                    <span className="text-[10px] text-[#0F1F10]/50 font-mono-accent block mt-0.5 truncate">
                      {b.type}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

