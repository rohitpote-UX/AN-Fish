"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useDepthStore } from "@/store/useDepthStore";
import { useAmbientOceanAudio } from "@/hooks/useAmbientOceanAudio";
import {
  Volume2,
  VolumeX,
  ShoppingBag,
  Menu,
  X,
  Compass,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuOverlay } from "./MenuOverlay";

export function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const soundEnabled = useDepthStore((state) => state.soundEnabled);
  const toggleSound = useDepthStore((state) => state.toggleSound);
  const openOrderDrawer = useDepthStore((state) => state.openOrderDrawer);
  const cart = useDepthStore((state) => state.cart);
  const depth = useDepthStore((state) => state.depth);

  // Initialize Web Audio API ambient sound generator
  useAmbientOceanAudio();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLanguageSwitch = () => {
    const nextLocale = locale === "mr" ? "en" : "mr";
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: "#the-dive", label: t("theDive") },
    { href: "#the-catch", label: t("ourCatch") },
    { href: "#freshness", label: t("freshnessPledge") },
    { href: "#family-story", label: t("familyStory") },
    { href: "#karad-store", label: t("karadStore") },
  ];

  return (
    <header
      data-section="nav"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#05080C]/85 border-b border-[#6EC6F0]/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A9AD9] rounded-lg"
          aria-label={tCommon("brandName")}
        >
          <BrandLogo locale={locale} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-white transition-colors py-2 px-1 relative group focus-visible:outline-[#0A9AD9]"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A9AD9] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Controls: Sound, Language, Cart, Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Depth Badge for Mobile/Tablet */}
          <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#02111F] border border-[#6EC6F0]/30 text-[11px] font-mono-accent">
            <Compass className="w-3 h-3 text-[#6EC6F0]" />
            <span className="text-white font-bold">{Math.round(depth)}m</span>
          </div>

          {/* Ambient Ocean Audio Toggle */}
          <button
            id="audio-ambient-toggle-btn"
            type="button"
            onClick={toggleSound}
            aria-label={tCommon("audioToggle")}
            aria-pressed={soundEnabled}
            className={`p-2.5 rounded-full border transition-all duration-200 flex items-center justify-center ${
              soundEnabled
                ? "bg-[#0A9AD9]/20 border-[#0A9AD9] text-[#6EC6F0] shadow-[0_0_12px_rgba(10,154,217,0.4)]"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Language Switcher Button */}
          <button
            id="language-switch-btn"
            type="button"
            onClick={handleLanguageSwitch}
            aria-label={`Switch language to ${locale === "mr" ? "English" : "Marathi"}`}
            className="px-3 py-1.5 rounded-full border border-[#6EC6F0]/30 hover:border-[#6EC6F0] bg-[#02111F]/60 text-xs font-semibold tracking-wider text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-[#0A9AD9] text-[10px] font-mono-accent">
              {locale.toUpperCase()}
            </span>
            <span className="text-white/40">/</span>
            <span>{t("switchLang")}</span>
          </button>

          {/* Cart / Order Drawer Trigger */}
          <button
            id="cart-drawer-trigger-btn"
            type="button"
            onClick={() => openOrderDrawer()}
            aria-label={`${t("cart")} (${totalCartCount} items)`}
            className="relative p-2.5 rounded-full bg-[#0A9AD9] text-white hover:bg-[#6EC6F0] transition-colors flex items-center justify-center shadow-[0_0_20px_rgba(10,154,217,0.4)] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#05080C] text-[11px] font-bold flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className="lg:hidden p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Full Screen Oceanic Menu Overlay */}
      <MenuOverlay isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
