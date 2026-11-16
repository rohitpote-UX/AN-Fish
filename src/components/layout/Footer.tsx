"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { ArrowUp, ArrowUpRight, Clock, Globe, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";
import { BRANCHES_LIST } from "@/data/branches";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

interface L {
  href: string;
  mr: string;
  en: string;
  hi: string;
}

const EXPLORE: L[] = [
  { href: "/our-story", mr: "आमची ओळख", en: "Our Story", hi: "हमारी पहचान" },
  { href: "/catch", mr: "आजची ताजी आवक", en: "Today's Catch", hi: "आज की ताज़ा आवक" },
  { href: "/branches", mr: "आमची दालने", en: "Our Stores", hi: "हमारी शाखाएं" },
  { href: "/wholesale", mr: "हॉटेल्स व व्यवसायासाठी", en: "For Your Business", hi: "होटल व व्यवसाय के लिए" },
  { href: "/contact", mr: "संपर्क साधा", en: "Contact Us", hi: "संपर्क करें" },
];

const FRESHNESS: L[] = [
  { href: "/our-freshness/the-fresh-chain", mr: "अखंड शीतसाखळी", en: "The Fresh Chain", hi: "अखंड कोल्ड चेन" },
  { href: "/our-freshness/clean-and-cut", mr: "स्वच्छता व कटिंग", en: "Clean & Cut", hi: "सफाई व कटिंग" },
  { href: "/journal/media", mr: "व्हिडीओ व प्रसारमाध्यमे", en: "Videos & Media", hi: "वीडियो व मीडिया" },
  { href: "/journal/stories", mr: "ग्राहकांचे अनुभव", en: "Customer Stories", hi: "ग्राहकों के अनुभव" },
];

const LEGAL: L[] = [
  { href: "/privacy", mr: "गोपनीयता धोरण", en: "Privacy Policy", hi: "गोपनीयता नीति" },
  { href: "/terms", mr: "वापराच्या अटी", en: "Terms of Use", hi: "उपयोग की शर्तें" },
];

export function Footer() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";
  const t = (mr: string, en: string, hi: string) => (isMarathi ? mr : isHindi ? hi : en);
  const lbl = (l: L) => (isMarathi ? l.mr : isHindi ? l.hi : l.en);
  // Devanagari must not be letter-spaced; only Latin capitals get tracking.
  const heading = `font-marathi-display text-sm font-bold text-white ${isMarathi || isHindi ? "" : "uppercase tracking-[0.14em] text-[0.78rem]"}`;

  const phoneTel = PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "");
  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(/[^0-9]/g, "");
  const waText = t(
      "नमस्कार AN Fish World कराड, मला आजच्या ताज्या आवकमधून ऑर्डर करायची आहे.",
      "Hello AN Fish World Karad, I would like to place an order from today's catch.",
      "नमस्ते AN Fish World कराड, मुझे आज की ताज़ा आवक से ऑर्डर करना है।"
    );
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  // Featured stores: flagship first, then a spread across districts (real data, links to each store page)
  const featured = ["karad-hq", "satara-guruwar-peth", "ishwarpur-islampur", "kolhapur-kawala-naka", "pune-hadapsar"]
    .map((slug) => BRANCHES_LIST.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => !!b);

  const linkCls = "group !min-h-0 inline-flex items-center gap-1 font-marathi-body text-[0.92rem] leading-tight text-white/70 transition-colors hover:text-white";

  return (
    <footer data-section="footer" aria-label="Site Footer" className="relative z-10 bg-[#071C2C] text-white">
      {/* top accent line */}
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-[#0D9488]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 md:pb-8 lg:px-12 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Brand ---------- */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3.5" aria-label="AN Fish World — Home">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-0.5 ring-4 ring-white/10">
                <Image src="/brand/an-fish-logo-badge.webp" alt="AN Fish World" width={56} height={56} className="size-full object-contain" />
              </span>
              <span className="leading-tight">
                <span className="block font-latin-display text-xl font-extrabold tracking-tight">AN FISH WORLD</span>
                <span className="mt-0.5 block font-marathi-display text-sm font-semibold text-[#5EEAD4]">
                  {t("कराडची लाडकी मासोळी", "Karad's Beloved Seafood", "कराड की चहेती मछली")}
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm font-marathi-body text-[0.92rem] leading-relaxed text-white/65">
              {t(
                "रत्नागिरी व मालवणच्या बंदरातून थेट, ०°C शीतसाखळीत आलेली ताजी मासोळी — कराडकरांच्या ताटापर्यंत.",
                "Fresh catch from the Ratnagiri & Malvan harbours, kept in a 0°C cold chain — straight to your plate in Karad.",
                "रत्नागिरी व मालवण बंदरगाह से सीधे, ०°C कोल्ड चेन में आई ताज़ा मछली — आपकी थाली तक।"
              )}
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {[
                { href: PLACEHOLDERS.INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon },
                { href: PLACEHOLDERS.YOUTUBE_URL, label: "YouTube", Icon: YoutubeIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`AN Fish World on ${label}`}
                  className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:border-[#5EEAD4]/60 hover:text-[#5EEAD4]"
                >
                  <Icon className="size-[1.1rem]" />
                </a>
              ))}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:border-[#25D366]/70 hover:text-[#25D366]"
              >
                <MessageCircle className="size-[1.1rem]" />
              </a>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/65">
              <ShieldCheck className="size-3.5 text-[#5EEAD4]" />
              FSSAI {PLACEHOLDERS.FSSAI_LICENSE_NO}
            </p>
          </div>

          {/* ---------- Links ---------- */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-[0.8fr_0.8fr_1.4fr]">
            <nav aria-label={t("एक्सप्लोर", "Explore", "एक्सप्लोर")}>
              <h3 className={heading}>{t("एक्सप्लोर", "Explore", "एक्सप्लोर")}</h3>
              <ul className="mt-4 space-y-2.5">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {lbl(l)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={t("ताजेपणा", "Freshness", "ताज़गी")}>
              <h3 className={heading}>{t("आमचा ताजेपणा", "Our Freshness", "हमारी ताज़गी")}</h3>
              <ul className="mt-4 space-y-2.5">
                {FRESHNESS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {lbl(l)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* contact */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className={heading}>{t("संपर्क", "Get in touch", "संपर्क")}</h3>
              <ul className="mt-4 space-y-3 font-marathi-body text-[0.92rem] leading-snug text-white/75">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#5EEAD4]" />
                  <span className="leading-snug">{PLACEHOLDERS.STORE_ADDRESS_KARAD}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-[#5EEAD4]" />
                  <span className="leading-snug">{PLACEHOLDERS.DAILY_HOURS}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-[#5EEAD4]" />
                  <a href={`tel:${phoneTel}`} className="!min-h-0 font-semibold text-white transition-colors hover:text-[#5EEAD4]">
                    {PLACEHOLDERS.CONTACT_PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-[#5EEAD4]" />
                  <a href={`mailto:${PLACEHOLDERS.STORE_EMAIL}`} className="!min-h-0 break-all transition-colors hover:text-white">
                    {PLACEHOLDERS.STORE_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- Stores strip ---------- */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className={heading}>{t("आमची दालने", "Visit a store near you", "अपनी नज़दीकी शाखा")}</h3>
            <Link href="/branches" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5EEAD4] transition-colors hover:text-white">
              {t("सर्व २५ दालने पहा", "View all 25 stores", "सभी २५ शाखाएं देखें")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {featured.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/branches/${b.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 font-marathi-body text-sm text-white/80 transition-colors hover:border-[#5EEAD4]/50 hover:bg-white/10 hover:text-white"
                >
                  <MapPin className="size-3.5 text-[#5EEAD4]" />
                  {isMarathi || isHindi ? (b.villageNameMr || b.nameMr) : b.nameEn.replace(/^AN Fish World\s*[—-]\s*/i, "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-white/55 lg:flex-row lg:items-center lg:justify-between md:pr-52">
          <p className="order-2 lg:order-1">© {new Date().getFullYear()} AN Fish World. {t("सर्व हक्क राखीव.", "All rights reserved.", "सर्वाधिकार सुरक्षित।")}</p>

          <ul className="order-1 flex flex-wrap items-center gap-x-6 gap-y-2 lg:order-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="!min-h-0 transition-colors hover:text-white">
                  {lbl(l)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="order-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              {t("वेबसाईट निर्मिती:", "Website by", "वेबसाइट निर्माण:")}{" "}
              <a href="https://abnexa.in" target="_blank" rel="noopener noreferrer" className="!min-h-0 font-bold text-white transition-colors hover:text-[#5EEAD4]">
                Abnexa
              </a>
            </span>
            <a href="https://abnexa.in" target="_blank" rel="noopener noreferrer" className="!min-h-0 inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <Globe className="size-3.5" />
              abnexa.in
            </a>
            <a href="tel:+919689030301" className="!min-h-0 inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="size-3.5" />
              +91 96890 30301
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label={t("वर जा", "Back to top", "ऊपर जाएं")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white transition-colors hover:border-[#5EEAD4]/50 hover:bg-white/10 cursor-pointer"
            >
              {t("वर जा", "Back to top", "ऊपर जाएं")}
              <ArrowUp className="size-3.5 text-[#5EEAD4]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
