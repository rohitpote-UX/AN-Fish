"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight, Menu, X } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

interface NavDropdownItem {
  href: string;
  labelMr: string;
  labelEn: string;
  descMr: string;
  descEn: string;
}

interface NavGroup {
  id: string;
  titleMr: string;
  titleEn: string;
  items?: NavDropdownItem[];
  href?: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "our-fish",
    titleMr: "आमची मासोळी",
    titleEn: "Our Fish",
    items: [
      {
        href: "/catch",
        labelMr: "घरच्या जेवणासाठी (For Your Family)",
        labelEn: "For Your Family",
        descMr: "रोजच्या स्वयंपाकासाठी चोख कट केलेली ताजी मासोळी",
        descEn: "Daily home kitchen cuts, clean and ready to cook",
      },
      {
        href: "/wholesale",
        labelMr: "हॉटेल्स व व्यवसायासाठी (For Your Business)",
        labelEn: "For Your Business",
        descMr: "हॉटेल्स, केटरर्स व रेस्टॉरंट्ससाठी घाऊक पुरवठा",
        descEn: "Wholesale bulk supply with 0°C cold-chain logistics",
      },
    ],
  },
  {
    id: "our-freshness",
    titleMr: "आमचा ताजेपणा",
    titleEn: "Our Freshness",
    items: [
      {
        href: "/our-freshness/the-fresh-chain",
        labelMr: "अखंड शीतसाखळी (The Fresh Chain)",
        labelEn: "The Fresh Chain",
        descMr: "पहाटे ४:०० बंदर लिलाव ते कराड ०°C लिक्विड आईस प्रवास",
        descEn: "4:00 AM harbour auctions to Karad in 0°C liquid slurry",
      },
      {
        href: "/our-freshness/clean-and-cut",
        labelMr: "स्वच्छता व कटिंग (Clean & Cut)",
        labelEn: "Clean & Cut",
        descMr: "आरओ पाण्याने स्वच्छता, मोफत रवा फ्राय व करी कटिंग",
        descEn: "RO water washed with customized kitchen cuts",
      },
    ],
  },
  {
    id: "our-story",
    titleMr: "आमची गोष्ट",
    titleEn: "Our Story",
    href: "/our-story",
  },
  {
    id: "journal",
    titleMr: "माहिती व अनुभव",
    titleEn: "Journal",
    items: [
      {
        href: "/journal/media",
        labelMr: "व्हिडीओ व प्रसारमाध्यमे (Videos & Media)",
        labelEn: "Videos & Media",
        descMr: "बंदरावरील थेट लिलाव आणि कराड दालनाची दृश्ये",
        descEn: "Dock auctions and Karad counter video updates",
      },
      {
        href: "/catch",
        labelMr: "मासोळी माहिती मार्गदर्शक (Fish Guide)",
        labelEn: "Fish Guide",
        descMr: "पापलेट, सुरमई, हलवा व नदीच्या मासोळीची संपूर्ण माहिती",
        descEn: "Nutritional notes, taste profiles, and cooking styles",
      },
      {
        href: "/journal/stories",
        labelMr: "ग्राहकांचे अनुभव (Customer Stories)",
        labelEn: "Customer Stories",
        descMr: "कराडमधील खवय्यांचे विश्वास आणि आवडत्या पाककृती",
        descEn: "Reviews and beloved recipes from Karad families",
      },
    ],
  },
];

export function Header() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Throttled scroll listener to avoid excessive renders & layout shifts
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation & accessibility for dropdowns & mobile menu
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeDropdown) {
          setActiveDropdown(null);
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }

      // Trap focus inside mobile drawer when open
      if (mobileMenuOpen && e.key === "Tab" && mobileDrawerRef.current) {
        const focusable = mobileDrawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [activeDropdown, mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Dropdown hover helpers with debounced exit to prevent accidental loss of focus
  const handleDropdownEnter = (groupId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(groupId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleLanguageSwitch = () => {
    const nextLocale = locale === "mr" ? "en" : "mr";
    router.replace(pathname, { locale: nextLocale });
  };

  const cleanPhone = PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आजच्या ताज्या आवकमधून ऑर्डर करायची आहे."
      : "Hello AN Fish World Karad, I would like to place an order from today's fresh catch."
  )}`;

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out bg-white/95 backdrop-blur-md border-b border-[#071A24]/08 text-[#071A24] ${
          isScrolled
            ? "h-[64px] sm:h-[68px] shadow-[0_4px_24px_rgba(7,26,36,0.05)] bg-white/98"
            : "h-[74px] sm:h-[78px] shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
          
          {/* 1. Left: Official Brand Lockup with Circular Badge */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8] rounded-xl select-none py-1"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white shadow-xs border border-[#071A24]/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ring-2 ring-[#0B9DD8]/15 group-hover:ring-[#0B9DD8] shrink-0">
              <Image
                src="/brand/an-fish-logo-badge.webp"
                alt="AN Fish World Official Logo"
                width={44}
                height={44}
                priority
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight block leading-none font-latin-display text-[#071A24] group-hover:text-[#0B9DD8] transition-colors">
                AN FISH WORLD
              </span>
              <span className="text-[10px] font-mono-accent font-bold tracking-wider block mt-1 text-[#0B9DD8]">
                {isMarathi ? "कराडची लाडकी मासोळी" : "KARAD • EST. 2024"}
              </span>
            </div>
          </Link>

          {/* 2. Center: Refined Editorial Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-2 font-mono-accent text-xs uppercase tracking-wider font-semibold"
          >
            {NAV_GROUPS.map((group) => {
              if (group.href) {
                return (
                  <Link
                    key={group.id}
                    href={group.href}
                    className="relative py-2 px-3 text-[#071A24]/80 hover:text-[#0B9DD8] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8] group/link"
                  >
                    <span>{isMarathi ? group.titleMr : group.titleEn}</span>
                    <span className="absolute bottom-1 left-3 right-3 h-[1.5px] bg-[#0B9DD8] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 origin-left" />
                  </Link>
                );
              }

              const isOpen = activeDropdown === group.id;

              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(group.id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8] ${
                      isOpen
                        ? "text-[#0B9DD8] bg-[#EBF8FF]"
                        : "text-[#071A24]/80 hover:text-[#0B9DD8] hover:bg-[#F5F4EF]"
                    }`}
                  >
                    <span>{isMarathi ? group.titleMr : group.titleEn}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0B9DD8]" : "text-[#071A24]/40"
                      }`}
                    />
                  </button>

                  {/* Refined Dropdown Menu Panel (70% White Aesthetic) */}
                  <AnimatePresence>
                    {isOpen && group.items && (
                      <motion.div
                        onMouseEnter={() => handleDropdownEnter(group.id)}
                        onMouseLeave={handleDropdownLeave}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full left-0 w-80 min-w-[320px] p-3 rounded-2xl shadow-[0_16px_40px_rgba(7,26,36,0.12)] mt-1.5 space-y-1.5 z-50 text-left normal-case border border-[#071A24]/10 bg-white backdrop-blur-xl text-[#071A24] pointer-events-auto"
                      >
                        <div className="px-3 pt-1 pb-1.5 border-b border-[#071A24]/06">
                          <span className="text-[10px] font-mono-accent uppercase tracking-wider text-[#0B9DD8] font-bold">
                            {isMarathi ? group.titleMr : group.titleEn}
                          </span>
                        </div>

                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block p-3 rounded-xl transition-all group/item hover:bg-[#F5F4EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8]"
                          >
                            <div className="text-xs font-bold transition-colors flex items-center justify-between text-[#071A24] group-hover/item:text-[#0B9DD8]">
                              <span>{isMarathi ? item.labelMr : item.labelEn}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all text-[#0B9DD8]" />
                            </div>
                            <div className="text-[11px] mt-1 line-clamp-1 text-[#071A24]/65">
                              {isMarathi ? item.descMr : item.descEn}
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* 3. Right: Let's Talk + WhatsApp Action + Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* "Let's Talk" contact link */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center text-xs font-mono-accent font-bold uppercase tracking-wider py-1 relative group/talk transition-colors text-[#071A24]/80 hover:text-[#0B9DD8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8] rounded-md"
            >
              <span>{isMarathi ? "संपर्क साधा" : "Let's Talk"}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0B9DD8] transition-all duration-200 group-hover/talk:w-full" />
            </Link>

            {/* Elevated "Order on WhatsApp" CTA Pill */}
            <a
              id="header-whatsapp-cta"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B9DD8] hover:bg-[#071A24] text-white text-xs font-mono-accent font-bold uppercase tracking-wider shadow-xs hover:shadow-[0_4px_16px_rgba(11,157,216,0.35)] transition-all duration-200 cursor-pointer active:scale-95 group/wa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8] focus-visible:ring-offset-2"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current transition-transform duration-200 group-hover/wa:scale-110" />
              <span>{isMarathi ? "व्हॉट्सॲप" : "WhatsApp"}</span>
            </a>

            {/* Accessible Language Switcher Pill */}
            <button
              id="header-lang-switch-btn"
              type="button"
              onClick={handleLanguageSwitch}
              aria-label={`Switch language to ${isMarathi ? "English" : "मराठी"}`}
              className="px-3 py-1.5 rounded-full text-xs font-mono-accent uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none bg-[#F5F4EF] hover:bg-[#EBF8FF] text-[#071A24] border border-[#071A24]/10 hover:border-[#0B9DD8]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8]"
            >
              <span className={isMarathi ? "text-[#0B9DD8] font-bold" : "opacity-60"}>
                मराठी
              </span>
              <span className="opacity-30">/</span>
              <span className={!isMarathi ? "text-[#0B9DD8] font-bold" : "opacity-60"}>
                EN
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="lg:hidden p-2 rounded-full text-xs font-mono-accent font-bold uppercase tracking-wider transition-colors cursor-pointer bg-[#F5F4EF] hover:bg-[#0B9DD8] hover:text-white text-[#071A24] border border-[#071A24]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B9DD8]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 4. Full-Screen Accessible Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-white pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            <div className="space-y-4">
              {/* Mobile Drawer Brand Header */}
              <div className="flex items-center gap-3 pb-4 mb-2 border-b border-[#071A24]/10">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-xs border border-[#071A24]/10 flex items-center justify-center shrink-0 ring-2 ring-[#0B9DD8]/20">
                  <Image
                    src="/brand/an-fish-logo-badge.webp"
                    alt="AN Fish World Official Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <div>
                  <span className="text-base font-extrabold text-[#071A24] tracking-tight block leading-none font-latin-display">
                    AN FISH WORLD
                  </span>
                  <span className="text-[11px] font-mono-accent text-[#0B9DD8] font-bold tracking-wider block mt-1">
                    {isMarathi ? "कराडची लाडकी मासोळी" : "KARAD • EST. 2024"}
                  </span>
                </div>
              </div>

              {/* Navigation Links Accordion */}
              {NAV_GROUPS.map((group) => {
                if (group.href) {
                  return (
                    <Link
                      key={group.id}
                      href={group.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-2xl font-bold text-[#071A24] hover:text-[#0B9DD8] py-3 border-b border-[#071A24]/08 transition-colors"
                    >
                      {isMarathi ? group.titleMr : group.titleEn}
                    </Link>
                  );
                }

                const isExpanded = expandedMobileGroup === group.id;

                return (
                  <div key={group.id} className="border-b border-[#071A24]/08 pb-3">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedMobileGroup(isExpanded ? null : group.id)
                      }
                      className="w-full flex items-center justify-between text-2xl font-bold text-[#071A24] py-3 text-left cursor-pointer"
                    >
                      <span>{isMarathi ? group.titleMr : group.titleEn}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#0B9DD8] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && group.items && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-3 space-y-3 pt-2 pb-3 overflow-hidden"
                        >
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1"
                            >
                              <div className="text-base font-semibold text-[#071A24] hover:text-[#0B9DD8] transition-colors">
                                {isMarathi ? item.labelMr : item.labelEn}
                              </div>
                              <div className="text-xs text-[#071A24]/60 mt-0.5">
                                {isMarathi ? item.descMr : item.descEn}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Mobile Drawer Bottom: WhatsApp + Store Quick Info */}
            <div className="pt-6 border-t border-[#071A24]/10 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-[#0B9DD8] hover:bg-[#071A24] text-white text-xs font-mono-accent font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isMarathi ? "व्हॉट्सॲपवर ऑर्डर द्या" : "Order on WhatsApp"}</span>
              </a>

              <div className="text-center text-xs text-[#071A24]/60 font-mono-accent">
                {isMarathi
                  ? "मलकापूर, कराड • रोज सकाळी ७:०० ते रात्री ९:००"
                  : "Malkapur, Karad • Daily 7:00 AM – 9:00 PM"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
