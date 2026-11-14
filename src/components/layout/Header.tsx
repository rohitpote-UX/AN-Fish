"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Phone, MapPin, Globe, Menu, X, MessageCircle, ArrowRight } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";
import { useScrollStore } from "@/store/scroll";

interface NavLinkItem {
  href: string;
  labelMr: string;
  labelEn: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { href: "#home", labelMr: "मुख्यपृष्ठ", labelEn: "Home" },
  { href: "#signature", labelMr: "खासियत", labelEn: "Signature" },
  { href: "#about", labelMr: "आमच्याबद्दल", labelEn: "About" },
  { href: "#menu", labelMr: "मेनू", labelEn: "Menu" },
  { href: "#services", labelMr: "का निवडाल?", labelEn: "Why Us" },
  { href: "#gallery", labelMr: "गॅलरी", labelEn: "Gallery" },
  { href: "#reviews", labelMr: "अभिप्राय", labelEn: "Reviews" },
  { href: "#order", labelMr: "थेट ऑर्डर", labelEn: "Order Now" },
  { href: "#faq", labelMr: "प्रश्न", labelEn: "FAQ" },
  { href: "#contact", labelMr: "संपर्क", labelEn: "Contact" },
];

export function Header() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleLanguageSwitch = () => {
    const nextLocale = locale === "mr" ? "en" : "mr";
    router.replace(pathname, { locale: nextLocale });
  };

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

            <span className="hidden sm:inline-block h-3 w-px bg-white/20" />

            {/* Language Switcher Button */}
            <button
              onClick={handleLanguageSwitch}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-[#0A9AD9] hover:text-[#071A24] text-white font-bold transition-all duration-200 cursor-pointer"
              aria-label="Toggle language between Marathi and English"
            >
              <Globe className="w-3 h-3 text-[#6EC6F0]" />
              <span>{locale === "mr" ? "English" : "मराठी"}</span>
            </button>
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
                {isMarathi ? "कराडची लाडकी मासोळी" : "Karad's Fresh Seafood"}
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
                {isMarathi ? link.labelMr : link.labelEn}
              </a>
            ))}
          </nav>

          {/* Right Action: Language + Order Button + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Language Switch */}
            <button
              onClick={handleLanguageSwitch}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#071A24]/15 hover:border-[#0A9AD9] text-xs font-bold text-[#071A24] hover:text-[#0A9AD9] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#0A9AD9]" />
              <span>{locale === "mr" ? "English" : "मराठी"}</span>
            </button>

            {/* Primary Order Button */}
            <a
              href="#order"
              onClick={(e) => handleNavClick(e, "#order")}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0A9AD9] hover:bg-[#071A24] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-cyan-500/25 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>{isMarathi ? "ताजे मासे मागवा" : "Order Fresh Fish"}</span>
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
                      {isMarathi ? link.labelMr : link.labelEn}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    handleLanguageSwitch();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-[#6EC6F0]" />
                  <span>{locale === "mr" ? "Switch to English" : "मराठी भाषेत पहा"}</span>
                </button>

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
