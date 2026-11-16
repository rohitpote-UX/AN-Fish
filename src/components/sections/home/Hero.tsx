"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { MessageCircle, ArrowRight, MapPin, Clock, ShieldCheck, ChevronDown, Snowflake } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

type L = { mr: string; en: string; hi: string };

/** Rotating showcase: real photos + real prices from PLACEHOLDERS only. */
const SHOWCASE: { id: string; img: string; name: L; alt: L; price: string }[] = [
  {
    id: "pomfret",
    img: "/media/hero/pomfret-large.webp",
    name: { mr: "सिल्व्हर पापलेट", hi: "सिल्वर पापलेट", en: "Silver Pomfret" },
    alt: { mr: "ताजा सिल्व्हर पापलेट", hi: "ताजा सिल्वर पापलेट", en: "Fresh Silver Pomfret on ice" },
    price: PLACEHOLDERS.PRICES.PAPLET,
  },
  {
    id: "surmai",
    img: "/media/hero/surmai-large.webp",
    name: { mr: "किंग सुरमई", hi: "किंग सुरमई", en: "King Surmai" },
    alt: { mr: "ताजे किंग सुरमई स्टेक्स", hi: "ताजे किंग सुरमई स्टेक्स", en: "Fresh King Surmai steaks on ice" },
    price: PLACEHOLDERS.PRICES.SURMAI,
  },
  {
    id: "prawns",
    img: "/media/hero/prawns-large.webp",
    name: { mr: "रॉयल टायगर कोळंबी", hi: "रॉयल टाइगर प्रॉन्स", en: "Royal Tiger Prawns" },
    alt: { mr: "ताजी टायगर कोळंबी", hi: "ताजे टाइगर प्रॉन्स", en: "Fresh Royal Tiger Prawns on ice" },
    price: PLACEHOLDERS.PRICES.KOLAMBI_TIGER,
  },
  {
    id: "rawas",
    img: "/media/hero/rawas-large.webp",
    name: { mr: "इंडियन सामन (रावस)", hi: "इंडियन सैल्मन (रावस)", en: "Indian Salmon (Rawas)" },
    alt: { mr: "ताजे रावस स्टेक्स", hi: "ताजे रावस स्टेक्स", en: "Fresh Rawas (Indian Salmon) steaks on ice" },
    price: PLACEHOLDERS.PRICES.RAWAS,
  },
];

const ROTATE_MS = 4500;

function HeroShowcase({ t, reduce }: { t: (v: L) => string; reduce: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const item = SHOWCASE[index];

  // Auto-rotate (off for reduced-motion users, paused on hover/focus)
  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % SHOWCASE.length), ROTATE_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduce]);

  // Subtle 3D tilt that follows the pointer (fine pointers only)
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 8);
    rx.set(-py * 8);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
    setPaused(false);
  };

  return (
    <motion.div
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, scale: 0.94 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const },
          })}
      className="relative mx-auto w-full max-w-md [perspective:1200px] lg:max-w-none"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={resetTilt}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={onMove}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
          <AnimatePresence initial={false}>
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={item.img}
                alt={t(item.alt)}
                fill
                priority={index === 0}
                sizes="(min-width:1024px) 40vw, 90vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Soft navy fade behind the caption for legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#071A24]/60 to-transparent"
          />

          {/* Caption: name + live price swap with the photo */}
          <div
            className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#071A24]/85 px-4 py-3 backdrop-blur-md"
            style={{ transform: "translateZ(30px)" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="flex min-w-0 flex-1 items-center justify-between gap-3"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
              >
                <div className="min-w-0">
                  <p className="truncate font-marathi-display text-sm font-bold text-white">{t(item.name)}</p>
                  <p className="text-xs text-white/60">{t({ mr: "आजचा दर", hi: "आज का भाव", en: "Today's rate" })}</p>
                </div>
                <p className="shrink-0 font-marathi-display text-lg font-extrabold text-[#FBBF24]">{item.price}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Floating freshness chip */}
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(60px)" }}
          className="absolute -left-3 top-8 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white px-4 py-2.5 text-[#071A24] shadow-xl sm:-left-6"
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#0A9AD9]/15 text-[#0A9AD9]">
            <Snowflake className="size-4" aria-hidden="true" />
          </span>
          <span className="text-xs font-bold leading-tight">
            {t({ mr: "ताजी आवक", hi: "ताजी आवक", en: "Fresh Arrival" })}
            <span className="block font-medium text-[#071A24]/60">
              {t({ mr: "०°C – २°C चिल्ड", hi: "०°C – २°C चिल्ड", en: "Chilled 0°C – 2°C" })}
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Pager dots */}
      <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Featured fish">
        {SHOWCASE.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={t(s.name)}
            onClick={() => setIndex(i)}
            className="group grid h-6 min-h-0 place-items-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-[#FBBF24]" : "w-3 bg-white/35 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const locale = useLocale();
  const reduce = useReducedMotion();
  const t = (v: L) => (locale === "mr" ? v.mr : locale === "hi" ? v.hi : v.en);

  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    t({
      mr: "नमस्कार AN Fish World कराड, मला आजच्या ताजी आवकमधून ऑर्डर करायची आहे.",
      hi: "नमस्ते AN Fish World कराड, मुझे आज की ताजी आवक से ऑर्डर करना है।",
      en: "Hello AN Fish World Karad, I would like to order from today's fresh catch.",
    })
  )}`;

  const scrollToCatch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("signature") || document.getElementById("menu");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Subtle staggered entrance (disabled for reduced-motion users)
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const trust = [
    {
      icon: ShieldCheck,
      text: t({ mr: "१००% फॉर्मेलिन व केमिकलमुक्त", hi: "१००% फॉर्मेलिन व केमिकल मुक्त", en: "100% Formalin & Chemical Free" }),
    },
    {
      icon: Clock,
      text: t({ mr: "ऑर्डरनंतर ३० मिनिटांत घरपोच", hi: "ऑर्डर के ३० मिनट में घरपहुंच", en: "Home delivery in 30–45 mins" }),
    },
    {
      icon: MapPin,
      text: t({ mr: "कराड · जि. सातारा", hi: "कराड · जि. सातारा", en: "Karad · Satara Dist." }),
    },
  ];

  const ribbon = [
    t({ mr: "सिल्व्हर पापलेट", hi: "सिल्वर पापलेट", en: "Silver Pomfret" }),
    t({ mr: "किंग सुरमई", hi: "किंग सुरमई", en: "King Surmai" }),
    t({ mr: "रॉयल टायगर कोळंबी", hi: "रॉयल टाइगर प्रॉन्स", en: "Royal Tiger Prawns" }),
    t({ mr: "इंडियन सामन (रावस)", hi: "इंडियन सैल्मन (रावस)", en: "Indian Salmon (Rawas)" }),
    t({ mr: "चंदेरी बांगडा", hi: "बांगड़ा", en: "Fresh Mackerel (Bangda)" }),
    t({ mr: "जिवंत चिंबोरी", hi: "जीवित केकड़ा", en: "Live Mud Crabs" }),
    t({ mr: "कृष्णा-कोयना रोहू", hi: "कृष्णा-कोयना रोहू", en: "Freshwater Rohu" }),
    t({ mr: "कोयना कटला", hi: "कोयना कतला", en: "Freshwater Catla" }),
    t({ mr: "जिताडा / सीबास", hi: "जिताड़ा / सीबास", en: "Asian Seabass" }),
  ];

  return (
    <section
      id="home"
      aria-label="AN Fish World Hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#071A24] text-white"
    >
      {/* Background: single optimised photo + layered navy gradients (no cycling, lighter on mobile) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 select-none">
        <Image
          src="/media/counter-landscape.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(7,26,36,0.97)_0%,rgba(7,26,36,0.88)_42%,rgba(7,26,36,0.55)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_82%_45%,rgba(10,154,217,0.28)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#071A24] to-transparent"
      />

      {/* Main content */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-16 pt-36 sm:px-8 lg:px-12 lg:pt-40">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          {/* LEFT: message */}
          <div className="max-w-2xl">
            <motion.div
              {...rise(0.05)}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-4 backdrop-blur-md"
            >
              <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white p-0.5">
                <Image
                  src="/brand/an-fish-logo-badge.webp"
                  alt="AN Fish World"
                  width={32}
                  height={32}
                  priority
                  className="size-full object-contain"
                />
              </span>
              <span className="font-marathi-display text-xs font-bold uppercase tracking-[0.14em] text-[#6EC6F0] sm:text-[0.8rem]">
                {t({
                  mr: "ए एन फिश वर्ल्ड · कराड",
                  hi: "ए एन फिश वर्ल्ड · कराड",
                  en: "AN Fish World · Karad",
                })}
              </span>
            </motion.div>

            <motion.h1 {...rise(0.15)} className="mt-6 font-marathi-display font-black tracking-tight">
              <span className="block text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-[1.25] text-white/90">
                {t({ mr: "अस्सल दर्जेदार चवीची", hi: "असली व लाजवाब स्वाद की", en: "Authentic Sea Freshness," })}
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#FBBF24] via-[#FCD34D] to-[#FBBF24] bg-clip-text text-[clamp(2.5rem,5.6vw,4.25rem)] leading-[1.15] text-transparent">
                {t({ mr: "कराडची लाडकी मासोळी", hi: "कराड की चहेती मछली", en: "Karad's Beloved Seafood" })}
              </span>
            </motion.h1>

            <motion.p
              {...rise(0.28)}
              className="mt-6 max-w-xl font-marathi-body text-base leading-relaxed text-white/80 sm:text-lg"
            >
              {t({
                mr: "समुद्राची खरी चव, थेट रत्नागिरी व मालवणच्या बंदरातून तुमच्या ताटापर्यंत — मासे खावा, खुश रहा!",
                hi: "समुद्र का असली स्वाद, सीधे रत्नागिरी और मालवण बंदरगाह से आपकी थाली तक — मछली खाएं, खुश रहें!",
                en: "The true taste of the sea, from the Ratnagiri & Malvan harbours straight to your plate — eat fresh fish, stay happy!",
              })}
            </motion.p>

            <motion.div {...rise(0.4)} className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order fresh fish on WhatsApp"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0A9AD9] px-8 py-4 font-marathi-display text-base font-bold text-white shadow-[0_18px_40px_-14px_rgba(10,154,217,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0B9DD8] hover:shadow-[0_22px_46px_-12px_rgba(10,154,217,0.95)] active:scale-95"
              >
                <MessageCircle className="size-5 shrink-0 fill-current" />
                {t({ mr: "व्हॉट्सॲपवर ऑर्डर द्या", hi: "व्हाट्सएप पर ऑर्डर करें", en: "Order on WhatsApp" })}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#signature"
                onClick={scrollToCatch}
                aria-label="View today's fresh fish catch"
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/5 px-8 py-4 font-marathi-display text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/15 active:scale-95"
              >
                {t({ mr: "आजची ताजी आवक पहा", hi: "आज की ताजी आवक देखें", en: "View Today's Catch" })}
              </a>
            </motion.div>

            <motion.ul
              {...rise(0.52)}
              className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3 sm:gap-4"
            >
              {trust.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0A9AD9]/20 text-[#6EC6F0] ring-1 ring-[#0A9AD9]/30">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT: rotating product showcase */}
          <HeroShowcase t={t} reduce={!!reduce} />
        </div>

        {/* Scroll indicator */}
        <a
          href="#signature"
          onClick={scrollToCatch}
          aria-label="Scroll to today's catch"
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full p-2 text-white/60 transition-colors hover:text-[#FBBF24] lg:block"
        >
          <ChevronDown className={`size-7 ${reduce ? "" : "animate-bounce"}`} />
        </a>
      </div>

      {/* Catch ribbon */}
      <div className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0A9AD9] py-3 text-white">
        <div className={reduce ? "flex flex-wrap justify-center" : "marquee-track"}>
          {(reduce ? [0] : [0, 1]).map((dup) => (
            <ul
              key={dup}
              className="flex shrink-0 items-center"
              aria-hidden={dup === 1 || reduce ? true : undefined}
            >
              {ribbon.map((item) => (
                <li
                  key={`${dup}-${item}`}
                  className="flex items-center font-marathi-display text-sm font-bold tracking-wide sm:text-base"
                >
                  <span>{item}</span>
                  <span className="mx-4 text-[0.65em] text-[#FBBF24] sm:mx-6">◆</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
