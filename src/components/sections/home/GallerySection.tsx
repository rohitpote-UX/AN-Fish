"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  Camera,
  Play,
  Sparkles,
  X,
  MessageCircle,
  ExternalLink,
  Film,
  CheckCircle2,
} from "lucide-react";
import { REAL_GALLERY_ITEMS, GalleryMediaItem, OFFICIAL_PROFILE_INFO } from "@/data/galleryData";
import { PLACEHOLDERS } from "@/data/placeholders";

type FilterType = "all" | "video" | "counter" | "hygiene" | "community";

export function GallerySection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeModalItem, setActiveModalItem] = useState<GalleryMediaItem | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const filterTabs: Array<{ id: FilterType; mr: string; hi: string; en: string }> = [
    { id: "all", mr: "सर्व (All)", hi: "सभी (All)", en: "All Media" },
    { id: "video", mr: "व्हिडिओ व रील्स (Reels)", hi: "वीडियो व रील्स (Reels)", en: "Videos & Reels" },
    { id: "counter", mr: "ताजी मासोळी प्रदर्शन (Counter)", hi: "ताजी मछली काउंटर (Counter)", en: "Fresh Counter" },
    { id: "hygiene", mr: "स्वच्छता व कटिंग (Hygiene)", hi: "स्वच्छता व कटिंग (Hygiene)", en: "Clean & Cut" },
    { id: "community", mr: "खवय्ये व परिवार (Community)", hi: "ग्राहक व परिवार (Community)", en: "Community" },
  ];

  const filteredItems = REAL_GALLERY_ITEMS.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "video") return item.type === "video";
    return item.category === activeFilter;
  });

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const getInquiryUrl = (item: GalleryMediaItem) => {
    const text = isMarathi
      ? `नमस्कार AN Fish World कराड, मी वेबसाइटवर "${item.titleMr}" चा व्हिडिओ पाहिला. मला आजच्या ताजी आवकमधून ऑर्डर करायची आहे.`
      : isHindi
      ? `नमस्ते AN Fish World कराड, मैंने वेबसाइट पर "${item.titleMr}" देखा। मुझे आज की ताजी आवक से ऑर्डर करना है।`
      : `Hello AN Fish World Karad, I saw "${item.titleEn}" on your website. I would like to inquire about today's fresh catch.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    if (activeModalItem?.videoSrc && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [activeModalItem]);

  return (
    <section
      id="gallery"
      className="relative py-20 lg:py-28 bg-[#071A24] text-white overflow-hidden scroll-mt-20 border-b border-white/08"
      aria-label="AN Fish Photo and Video Gallery"
    >
      {/* Background Ambience */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#0A9AD9]/08 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A9AD9]/15 border border-[#0A9AD9]/30 text-xs font-semibold text-[#6EC6F0] uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#6EC6F0]" />
            <span>
              {isMarathi
                ? "प्रत्यक्ष दालनाची दृश्ये"
                : isHindi
                ? "स्टोर की वास्तविक झलक"
                : "Real Outlet & Sourcing Views"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-white">
            {isMarathi ? "आमची झलक" : isHindi ? "हमारी झलक" : "Our Visual Gallery"}
          </h2>

          <p className="text-sm sm:text-base text-white/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "स्वच्छता, ताजेपणा आणि आपुलकीची सेवा — आमच्या कराड दालनातील आणि सागरी प्रवासातील काही क्षणचित्रे."
              : isHindi
              ? "स्वच्छता, ताजगी और आत्मीय सेवा — हमारे कराड स्टोर और समुद्री सफर की कुछ प्रमुख तस्वीरें।"
              : "Witness our hygiene standards, dawn harbor selections, and modern Karad retail experience."}
          </p>
        </div>

        {/* Real Instagram Official Community Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0D2634] via-[#0A202D] to-[#0D2634] border border-[#0A9AD9]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="relative size-12 shrink-0 rounded-full overflow-hidden ring-2 ring-[#0A9AD9] p-0.5 bg-white/10">
              <Image
                src={OFFICIAL_PROFILE_INFO.avatarSrc}
                alt="AN Fish World Official Instagram"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {OFFICIAL_PROFILE_INFO.instagramHandle}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[0.68rem] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="size-3" />
                  {isMarathi
                    ? OFFICIAL_PROFILE_INFO.instagramFollowersMr
                    : isHindi
                    ? OFFICIAL_PROFILE_INFO.instagramFollowersMr
                    : `${OFFICIAL_PROFILE_INFO.instagramFollowers} Followers`}
                </span>
              </div>
              <p className="text-xs text-[#6EC6F0] font-marathi-body mt-0.5 line-clamp-1">
                &ldquo;{isMarathi || isHindi ? OFFICIAL_PROFILE_INFO.bioTaglineMr : OFFICIAL_PROFILE_INFO.bioTaglineEn}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={OFFICIAL_PROFILE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#0A9AD9] text-white hover:text-[#071A24] font-bold text-xs transition-colors duration-200 border border-white/10"
            >
              <span>{isMarathi ? "इन्स्टाग्राम प्रोफाइल" : isHindi ? "इंस्टाग्राम प्रोफ़ाइल" : "Instagram"}</span>
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href={OFFICIAL_PROFILE_INFO.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-transform duration-200 hover:scale-105 shadow-sm"
            >
              <MessageCircle className="size-3.5 fill-current" />
              <span>{isMarathi ? "व्हॉट्सॲप ग्रुप" : isHindi ? "व्हाट्सएप ग्रुप" : "WhatsApp Group"}</span>
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0A9AD9] text-[#071A24] shadow-md shadow-[#0A9AD9]/30 scale-105"
                    : "bg-white/5 text-white/70 border border-white/10 hover:border-[#0A9AD9] hover:text-white"
                }`}
              >
                {isMarathi ? tab.mr : isHindi ? tab.hi : tab.en}
              </button>
            );
          })}
        </div>

        {/* Media Grid: Real Videos & Real Photography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-[#0D2634] border border-white/10 hover:border-[#0A9AD9] cursor-pointer transition-all duration-300 hover:shadow-[0_12px_36px_rgba(10,154,217,0.25)] hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-black/40">
                <Image
                  src={item.thumbnailSrc}
                  alt={isMarathi || isHindi ? item.titleMr : item.titleEn}
                  width={640}
                  height={480}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.68rem] font-bold bg-[#071A24]/85 text-[#6EC6F0] border border-[#0A9AD9]/40 backdrop-blur-xs">
                    <Film className="w-3 h-3 text-[#0A9AD9]" />
                    <span>{isMarathi || isHindi ? item.badgeMr : item.badgeEn}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.68rem] font-extrabold bg-black/80 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
                    <span>{isMarathi || isHindi ? item.viewsMr : item.viewsEn}</span>
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="size-14 rounded-full bg-[#0A9AD9] text-[#071A24] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-white group-hover:shadow-[0_0_24px_rgba(10,154,217,0.8)]">
                    <Play className="size-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Gradient Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A24] via-[#071A24]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Caption Details */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
                  <h3 className="text-base font-bold font-marathi-display text-white group-hover:text-[#6EC6F0] transition-colors leading-snug">
                    {isMarathi || isHindi ? item.titleMr : item.titleEn}
                  </h3>
                  <p className="text-xs text-white/75 line-clamp-1 mt-1 font-marathi-body">
                    {isMarathi || isHindi ? item.descMr : item.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video / Image Modal Lightbox */}
        {activeModalItem && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveModalItem(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#071A24] rounded-2xl overflow-hidden border border-[#0A9AD9]/40 shadow-2xl flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="px-5 py-3.5 bg-[#0D2634] border-b border-white/10 flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0A9AD9]/20 text-[#6EC6F0] text-xs font-bold border border-[#0A9AD9]/30">
                    <Film className="size-3 text-[#0A9AD9]" />
                    <span>{isMarathi || isHindi ? activeModalItem.badgeMr : activeModalItem.badgeEn}</span>
                  </span>
                  <span className="text-xs text-amber-300 font-extrabold hidden sm:inline">
                    {isMarathi || isHindi ? activeModalItem.viewsMr : activeModalItem.viewsEn}
                  </span>
                </div>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Video Player Area */}
              <div className="relative w-full aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
                {activeModalItem.videoSrc ? (
                  <video
                    ref={videoRef}
                    src={activeModalItem.videoSrc}
                    poster={activeModalItem.thumbnailSrc}
                    controls
                    playsInline
                    autoPlay
                    className="w-full h-full object-contain max-h-[65vh]"
                  />
                ) : (
                  <Image
                    src={activeModalItem.thumbnailSrc}
                    alt={isMarathi || isHindi ? activeModalItem.titleMr : activeModalItem.titleEn}
                    width={960}
                    height={540}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Modal Bottom Controls & Caption */}
              <div className="p-4 sm:p-5 bg-[#0D2634] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold font-marathi-display text-white">
                    {isMarathi || isHindi ? activeModalItem.titleMr : activeModalItem.titleEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/75 font-marathi-body">
                    {isMarathi || isHindi ? activeModalItem.descMr : activeModalItem.descEn}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  <a
                    href={getInquiryUrl(activeModalItem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer"
                  >
                    <MessageCircle className="size-4 fill-current" />
                    <span>{isMarathi ? "व्हॉट्सॲपवर चौकशी करा" : isHindi ? "व्हाट्सएप पर पूछताछ करें" : "WhatsApp Inquiry"}</span>
                  </a>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#0A9AD9] hover:text-[#071A24] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isMarathi ? "बंद करा" : isHindi ? "बंद करें" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
