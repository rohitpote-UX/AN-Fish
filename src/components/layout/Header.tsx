"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Phone, MapPin, Globe, Menu, X, MessageCircle, ArrowRight, ChevronDown, Check } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";
import { useScrollStore } from "@/store/scroll";

interface NavLinkItem {
  href: string;
  labelMr: string;
  labelEn: string;
  labelHi: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { href: "#home", labelMr: "मुख्यपृष्ठ", labelEn: "Home", labelHi: "होम" },
  { href: "#signature", labelMr: "खासियत", labelEn: "Signature", labelHi: "खासियत" },
  { href: "#about", labelMr: "आमच्याबद्दल", labelEn: "About", labelHi: "हमारे बारे में" },
  { href: "#menu", labelMr: "मेनू", labelEn: "Menu", labelHi: "मेनू" },
  { href: "#services", labelMr: "का निवडाल?", labelEn: "Why Us", labelHi: "हमें क्यों चुनें?" },
  { href: "#gallery", labelMr: "गॅलरी", labelEn: "Gallery", labelHi: "गैलरी" },
  { href: "#reviews", labelMr: "अभिप्राय", labelEn: "Reviews", labelHi: "समीक्षाएं" },
  { href: "#order", labelMr: "थेट ऑर्डर", labelEn: "Order Now", labelHi: "ऑर्डर करें" },
  { href: "#faq", labelMr: "प्रश्न", labelEn: "FAQ", labelHi: "एफएक्यू" },
  { href: "#contact", labelMr: "संपर्क", labelEn: "Contact", labelHi: "संपर्क" },
];

export const LANGUAGES = [
  { code: "mr", label: "मराठी", name: "मराठी (Default)", shortName: "मराठी" },
  { code: "en", label: "English", name: "English (Second)", shortName: "English" },
  { code: "hi", label: "हिंदी", name: "हिंदी (Tertiary)", shortName: "हिंदी" },
] as const;

export function Header() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    useScrollStore.getState().setMenuOpen(mobileMenuOpen);
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      useScrollStore.getState().setMenuOpen(false);
    };
  }, [mobileMenuOpen]);


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      } else {
        router.push(`/${href}`);
      }
    }
  };

  const phoneTel = PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "");
  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      
      {/* 1. Top Utility Info Bar (Hotel Atithi Karad Pattern) */}
      <div
        className={`bg-[#071A24] text-white/80 transition-all duration-300 border-b border-white/10 ${
          isScrolled ? "h-0 opacity-0 overflow-hidden py-0 border-transparent" : "h-9 opacity-100 py-1"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex h-full items-center justify-between text-[0.72rem] sm:text-[0.76rem] font-medium">
          
          {/* Operating Hours */}
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-3.5 h-3.5 text-[#0A9AD9] shrink-0" />
            <span className="truncate">
              {isMarathi
                ? "सकाळी ७:०० – १:०० • संध्या. ४:३० – ९:०० · सोमवार – रविवार"
                : "7:00 AM – 1:00 PM • 4:30 PM – 9:00 PM · Mon – Sun"}
            </span>
          </div>

          {/* Right Utility: Phone + Location + Language */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={`tel:${phoneTel}`}
              className="hidden md:flex items-center gap-1.5 hover:text-[#0A9AD9] transition-colors tabular-nums"
            >
              <Phone className="w-3 h-3 text-[#0A9AD9]" />
              <span>{PLACEHOLDERS.CONTACT_PHONE}</span>
            </a>

            <span className="hidden md:inline-block h-3 w-px bg-white/20" />

            <div className="hidden sm:flex items-center gap-1.5 text-white/75">
              <MapPin className="w-3 h-3 text-[#0A9AD9]" />
              <span>कराड, जि. सातारा</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Sticky Navigation Bar (AN Fish Frosted Header) */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-[#071A24]/10 text-[#071A24]"
            : "bg-white/90 backdrop-blur-sm py-3.5 border-b border-[#071A24]/05 text-[#071A24]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Emblem */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-3 group focus:outline-none select-none"
            aria-label="AN Fish World Karad Home"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-xs border border-[#071A24]/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ring-2 ring-[#0A9AD9]/25 group-hover:ring-[#0A9AD9] shrink-0">
              <Image
                src="/brand/an-fish-logo-badge.webp"
                alt="AN Fish World Official Emblem"
                width={44}
                height={44}
                priority
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight block leading-tight font-latin-display text-[#071A24] group-hover:text-[#0A9AD9] transition-colors">
                AN FISH WORLD
              </span>
              <span className="text-[0.62rem] sm:text-[0.68rem] tracking-wider uppercase text-[#0A9AD9] font-bold block leading-none font-marathi-display">
                {locale === "mr" ? "कराडची लाडकी मासोळी" : locale === "hi" ? "कराड की चहेती मछली" : "Karad's Fresh Seafood"}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links (Hotel Atithi Karad Style) */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#071A24]/80 hover:text-[#0A9AD9] hover:bg-[#EBF8FF] transition-colors font-marathi-display"
              >
                {locale === "mr" ? link.labelMr : locale === "hi" ? link.labelHi : link.labelEn}
              </a>
            ))}
          </nav>

          {/* Right Action: Single Language Dropdown + Order Button + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Single Elegant 3-Language Selector (Desktop & Tablet) */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#071A24]/15 hover:border-[#0A9AD9] text-xs font-bold text-[#071A24] hover:text-[#0A9AD9] transition-all cursor-pointer bg-white shadow-2xs hover:shadow-sm"
                aria-expanded={langMenuOpen}
                aria-label="Select Language (मराठी, English, हिंदी)"
              >
                <Globe className="w-3.5 h-3.5 text-[#0A9AD9]" />
                <span className="font-semibold">
                  {locale === "mr" ? "मराठी" : locale === "hi" ? "हिंदी" : "English"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-[#071A24]/50 transition-transform duration-200 ${
                    langMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white border border-[#071A24]/10 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-[#071A24]/40 uppercase tracking-wider border-b border-[#071A24]/08 mb-1">
                    भाषा निवडा / Select Language
                  </div>
                  {LANGUAGES.map((lang) => {
                    const isSelected = locale === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLangMenuOpen(false);
                          router.replace(pathname, { locale: lang.code });
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#EBF8FF] text-[#0A9AD9]"
                            : "text-[#071A24]/80 hover:bg-[#F8FAFC] hover:text-[#0A9AD9]"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold">{lang.shortName}</span>
                          <span className="text-[10px] font-normal text-[#071A24]/50">
                            {lang.code === "mr"
                              ? "प्राथमिक भाषा (Default)"
                              : lang.code === "en"
                              ? "Second Language"
                              : "तृतीय भाषा (Tertiary)"}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#0A9AD9] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Primary Order Button */}
            <a
              href="#order"
              onClick={(e) => handleNavClick(e, "#order")}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0A9AD9] hover:bg-[#071A24] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-cyan-500/25 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>
                {locale === "mr"
                  ? "ताजे मासे मागवा"
                  : locale === "hi"
                  ? "ताजा मछली ऑर्डर करें"
                  : "Order Fresh Fish"}
              </span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-[#071A24]/15 text-[#071A24] hover:text-[#0A9AD9] hover:border-[#0A9AD9] transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 xl:hidden"
            />

            <motion.div
              ref={mobileDrawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#071A24] text-white z-60 xl:hidden shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 shrink-0">
                      <Image
                        src="/brand/an-fish-logo-badge.webp"
                        alt="AN Fish Logo"
                        width={36}
                        height={36}
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold block leading-none">AN FISH WORLD</span>
                      <span className="text-[0.65rem] text-[#6EC6F0]">कराड, महाराष्ट्र</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="py-6 space-y-1">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-bold font-marathi-display text-white/85 hover:text-[#6EC6F0] hover:bg-white/5 transition-colors"
                    >
                      {locale === "mr" ? link.labelMr : locale === "hi" ? link.labelHi : link.labelEn}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Bottom Actions: 3-Language Selector */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-2 px-1">
                    भाषा निवडा / SELECT LANGUAGE
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white/10 border border-white/10">
                    {LANGUAGES.map((lang) => {
                      const isSelected = locale === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            router.replace(pathname, { locale: lang.code });
                            setMobileMenuOpen(false);
                          }}
                          className={`py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? "bg-[#0A9AD9] text-white shadow-md"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {lang.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <a
                  href={`tel:${phoneTel}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase"
                >
                  <Phone className="w-4 h-4 text-[#0A9AD9]" />
                  <span>{PLACEHOLDERS.CONTACT_PHONE}</span>
                </a>

                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isMarathi ? "व्हॉट्सॲपवर चॅट करा" : "Chat on WhatsApp"}</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
