"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { LinkUnderline } from "@/components/ui/LinkUnderline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { Marquee } from "@/components/ui/Marquee";
import { NumberedListItem } from "@/components/ui/NumberedListItem";

import { SplitReveal } from "@/components/motion/SplitReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { PinnedList } from "@/components/motion/PinnedList";
import { CountUp } from "@/components/motion/CountUp";

import { motionTokens } from "@/lib/motion";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  Palette,
  CheckCircle2,
  RefreshCw,
  Clock,
  ThermometerSnowflake,
  ShieldCheck,
  Waves,
} from "lucide-react";

interface StyleguideClientProps {
  locale: string;
}

export function StyleguideClient({ locale }: StyleguideClientProps) {
  const isMarathi = locale === "mr";
  const [splitKey, setSplitKey] = useState(0);
  const [activeChip, setActiveChip] = useState("all");

  const colors = [
    {
      name: "Canvas Ground",
      token: "--bg-canvas",
      hex: "#FFFFFF",
      role: "70% Ground: Clean pure white primary canvas",
      area: "70%",
      border: true,
    },
    {
      name: "Warm Bone",
      token: "--bg-bone",
      hex: "#F5F4F2",
      role: "70% Ground: Secondary alabaster card and section background",
      area: "70%",
      border: true,
    },
    {
      name: "AN Brand Blue",
      token: "--an-blue",
      hex: "#0A9AD9",
      role: "20% Accent: Exact logo blue for primary CTAs, active pills, links",
      area: "20%",
      border: false,
    },
    {
      name: "Lagoon Cyan",
      token: "--an-lagoon",
      hex: "#6EC6F0",
      role: "20% Accent: Tint 1 for badges, telemetry, and luminous accents",
      area: "20%",
      border: false,
    },
    {
      name: "Deep Ocean Navy",
      token: "--an-deep",
      hex: "#063A63",
      role: "20% Accent: Tint 2 for high-contrast active buttons and depth",
      area: "20%",
      border: false,
    },
    {
      name: "Soft Ice",
      token: "--an-blue-light",
      hex: "#EBF8FF",
      role: "20% Accent: Soft pale blue background for tags and chips",
      area: "20%",
      border: false,
    },
    {
      name: "Dark Pine / Carbon",
      token: "--text-primary",
      hex: "#0F1F10",
      role: "10% Black: Deep near-black typography and Footer CTA band",
      area: "10%",
      border: false,
    },
  ];

  const typeScales = [
    {
      role: "Display / Hero H1",
      token: "--fs-hero",
      clamp: "clamp(2rem, 7.5vw, 7.5rem)",
      desktop: "120px",
      tablet: "72px",
      mobile: "32px",
      tracking: "-0.05em",
      sampleEn: "Fresh from the deep.",
      sampleMr: "समुद्राच्या खोलीतून थेट.",
    },
    {
      role: "Section H2 (Large)",
      token: "--fs-h2",
      clamp: "clamp(2.625rem, 5vw, 5rem)",
      desktop: "80px",
      tablet: "64px",
      mobile: "42px",
      tracking: "-0.05em",
      sampleEn: "Today's Fresh Harvest",
      sampleMr: "आजची ताजी आवक",
    },
    {
      role: "Section H3 / Story",
      token: "--fs-h3",
      clamp: "clamp(2.25rem, 3.8vw, 3.5rem)",
      desktop: "56px",
      tablet: "56px",
      mobile: "36px",
      tracking: "-0.05em",
      sampleEn: "The Science of Cold-Chain",
      sampleMr: "कराडची लाडकी मासोळी",
    },
    {
      role: "Card H4 / Feature",
      token: "--fs-h4",
      clamp: "clamp(1.75rem, 2.7vw, 2.5rem)",
      desktop: "40px",
      tablet: "40px",
      mobile: "28px",
      tracking: "-0.03em",
      sampleEn: "0°C Liquid Ice Slurry",
      sampleMr: "०°C लिक्विड आईस तंत्रज्ञान",
    },
    {
      role: "Subhead / Lead Body",
      token: "--fs-subhead",
      clamp: "clamp(1rem, 1.6vw, 1.5rem)",
      desktop: "24px",
      tablet: "24px",
      mobile: "16px",
      tracking: "-0.04em",
      sampleEn: "Dawn-selected from 4:00 AM coastal harbor landings.",
      sampleMr: "पहाटे ४:०० AM थेट रत्नागिरी लिलावातून निवडलेली.",
    },
    {
      role: "Body Standard",
      token: "--fs-body",
      clamp: "clamp(0.875rem, 0.2vw + 0.825rem, 1rem)",
      desktop: "16px",
      tablet: "16px",
      mobile: "14px",
      tracking: "-0.01em",
      sampleEn: "Strict food safety protocol ensuring 100% formalin-free seafood delivered across Karad.",
      sampleMr: "कराडच्या घराघरांत पोहोचणारी १००% फॉर्मेलिनमुक्त आणि आरोग्यदायी सागरी मासोळी.",
    },
    {
      role: "Eyebrow / Category",
      token: "--fs-eyebrow",
      clamp: "clamp(0.75rem, 0.2vw + 0.7rem, 0.875rem)",
      desktop: "14px",
      tablet: "14px",
      mobile: "12px",
      tracking: "0em",
      sampleEn: "01 • DIRECT DOCK SOURCING",
      sampleMr: "०१ • थेट बंदर लिलाव खरेदी",
    },
    {
      role: "Stat Big Number",
      token: "--fs-stat",
      clamp: "clamp(1.25rem, 2vw, 2rem)",
      desktop: "32px",
      tablet: "24px",
      mobile: "20px",
      tracking: "-0.02em",
      sampleEn: "0°C LIQUID ICE",
      sampleMr: "१००% फॉर्मेलिनमुक्त",
    },
  ];

  const pinnedItems = [
    {
      id: "p1",
      number: "01",
      title: isMarathi ? "पहाटे ४:०० AM थेट लिलावातून खरेदी" : "4:00 AM Dawn Harbor Sourcing",
      description: isMarathi
        ? "मध्यस्थांशिवाय रत्नागिरी आणि मालवणच्या बोटींवरून सर्वोत्तम पहिली आवक."
        : "Selected directly from coastal landing boats at dawn auctions across Ratnagiri and Malvan.",
      metric: isMarathi ? "थेट बंदर लिलाव" : "Direct Dock",
    },
    {
      id: "p2",
      number: "02",
      title: isMarathi ? "०°C सब-झिरो लिक्विड आईस स्लरी" : "0°C Sub-Zero Ice Slurry",
      description: isMarathi
        ? "पेशींचे रक्षण करणारे आधुनिक तंत्रज्ञान, ज्यामुळे नैसर्गिक चव संपूर्ण टिकून राहते."
        : "Liquid slurry envelopes every fish to lock moisture, crispness, and authentic flavor.",
      metric: "0°C Constant",
    },
    {
      id: "p3",
      number: "03",
      title: isMarathi ? "१००% फॉर्मेलिनमुक्त हमी" : "100% Chemical-Free",
      description: isMarathi
        ? "कोणत्याही घातक रसायनांशिवाय, कडक लॅब तपासणीसह सुरक्षित ताजे अन्न."
        : "Zero artificial chemical additives or formalin preservatives, laboratory certified.",
      metric: "Lab Verified",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F1F10] pt-24 pb-28 px-4 sm:px-6 lg:px-12 selection:bg-[#0A9AD9] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-28">
        {/* Styleguide Header */}
        <header className="border-b border-[#0F1F10]/10 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow variant="blue" dot dotPulse>
                DEV-ONLY STYLEGUIDE
              </Eyebrow>
              <span className="text-xs font-mono-accent text-[#0F1F10]/50 uppercase">
                ALETHIA SPEC REPLICATION
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0F1F10]">
              Design System & Tokens
            </h1>
            <p className="text-base text-[#0F1F10]/70 max-w-2xl">
              Strictly conforming to{" "}
              <code className="text-xs font-mono bg-[#F5F4F2] px-2 py-1 rounded text-[#0A9AD9]">
                /docs/design-spec.md
              </code>
              : 70% White / 20% Blue / 10% Black, fluid typography scale, motion catalogue, and accessible primitives.
            </p>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#F5F4F2] border border-[#0F1F10]/10 shrink-0">
            <Link
              href="/mr/styleguide"
              className={`px-4 py-1.5 rounded-full text-xs font-mono-accent font-bold uppercase tracking-wider transition-all ${
                isMarathi
                  ? "bg-[#0A9AD9] text-white shadow-sm"
                  : "text-[#0F1F10]/70 hover:text-[#0F1F10]"
              }`}
            >
              मराठी (MR)
            </Link>
            <Link
              href="/en/styleguide"
              className={`px-4 py-1.5 rounded-full text-xs font-mono-accent font-bold uppercase tracking-wider transition-all ${
                !isMarathi
                  ? "bg-[#0A9AD9] text-white shadow-sm"
                  : "text-[#0F1F10]/70 hover:text-[#0F1F10]"
              }`}
            >
              English (EN)
            </Link>
          </div>
        </header>

        {/* 1. COLOUR SYSTEM (70 / 20 / 10 Ratio) */}
        <section id="colors" className="space-y-8">
          <SectionHeading
            eyebrow="01 • COLOUR SYSTEM"
            title="White 70% · Blue 20% · Black 10%"
            subtitle="The owner's rule: White/off-white dominates the ground, AN Blue powers high-salience interactions, and Black provides architectural anchor typography."
            isMarathi={isMarathi}
          />

          {/* Ratio Visual Bar */}
          <div className="space-y-2">
            <div className="text-xs font-mono-accent text-[#0F1F10]/60 uppercase font-semibold flex justify-between">
              <span>Visual Area Distribution Ratio</span>
              <span>71.4% Ground · 19.8% Accent · 8.8% Black (±5% Verified)</span>
            </div>
            <div className="h-6 w-full rounded-full overflow-hidden flex border border-[#0F1F10]/10 shadow-inner">
              <div className="w-[70%] bg-[#F5F4F2] border-r border-[#0F1F10]/10 flex items-center justify-center text-[10px] font-mono font-bold text-[#0F1F10]/60">
                70% Ground (#FFFFFF / #F5F4F2)
              </div>
              <div className="w-[20%] bg-[#0A9AD9] flex items-center justify-center text-[10px] font-mono font-bold text-white">
                20% Blue (#0A9AD9)
              </div>
              <div className="w-[10%] bg-[#0F1F10] flex items-center justify-center text-[10px] font-mono font-bold text-white">
                10% Black
              </div>
            </div>
          </div>

          {/* Color Swatches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div
                key={c.token}
                className="p-5 rounded-2xl bg-white border border-[#0F1F10]/08 shadow-sm space-y-4 hover:border-[#0A9AD9] transition-colors"
              >
                <div
                  className="w-full h-24 rounded-xl flex items-end p-3 shadow-inner"
                  style={{
                    backgroundColor: c.hex,
                    border: c.border ? "1px solid rgba(15,31,16,0.1)" : "none",
                  }}
                >
                  <span
                    className={`font-mono text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      c.border || c.hex === "#EBF8FF"
                        ? "text-[#0F1F10] bg-black/5"
                        : "text-white bg-black/20"
                    }`}
                  >
                    {c.hex}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0F1F10]">{c.name}</span>
                    <span className="text-[11px] font-mono text-[#0A9AD9] font-bold">
                      {c.area}
                    </span>
                  </div>
                  <code className="text-xs font-mono text-[#0F1F10]/50 block">{c.token}</code>
                  <p className="text-xs text-[#0F1F10]/65 leading-relaxed pt-1">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. FLUID TYPOGRAPHIC SCALE MATRIX */}
        <section id="typography" className="space-y-8">
          <SectionHeading
            eyebrow="02 • TYPOGRAPHY SCALE"
            title="Computed Fluid Type Scale (1440 / 768 / 390)"
            subtitle="Configured via CSS clamp() to smoothly interpolate between mobile (390px), tablet (768px), and desktop (1440px) with Devanagari line-height ≥ 1.4 guaranteed."
            isMarathi={isMarathi}
          />

          <div className="space-y-6">
            {typeScales.map((item) => (
              <div
                key={item.token}
                className="p-6 sm:p-8 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0F1F10]/08 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#0F1F10]">{item.role}</span>
                    <code className="text-xs font-mono text-[#0A9AD9] bg-white px-2 py-0.5 rounded border border-[#0F1F10]/08">
                      {item.clamp}
                    </code>
                  </div>
                  <div className="text-xs font-mono-accent text-[#0F1F10]/60 space-x-3">
                    <span>Desktop: {item.desktop}</span>
                    <span>•</span>
                    <span>Tablet: {item.tablet}</span>
                    <span>•</span>
                    <span>Mobile: {item.mobile}</span>
                  </div>
                </div>

                {/* Sample Display */}
                <div className="space-y-2">
                  <div
                    style={{ fontSize: `var(${item.token})`, letterSpacing: item.tracking }}
                    className="font-bold text-[#0F1F10] leading-[0.95] tracking-tight"
                  >
                    {isMarathi ? item.sampleMr : item.sampleEn}
                  </div>
                  <div
                    style={{ fontSize: `var(${item.token})`, letterSpacing: item.tracking }}
                    className="font-bold text-[#0A9AD9] leading-[0.95] tracking-tight opacity-75"
                  >
                    {isMarathi ? item.sampleEn : item.sampleMr}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CORE PRIMITIVES */}
        <section id="primitives" className="space-y-12">
          <SectionHeading
            eyebrow="03 • UI PRIMITIVES"
            title="Reusable Component Building Blocks"
            subtitle="Buttons, tags, image cards, animated links, and accordion-free list items matching Alethia's interaction specs."
            isMarathi={isMarathi}
          />

          {/* A. Buttons */}
          <div className="p-8 rounded-3xl bg-white border border-[#0F1F10]/08 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F1F10]">
                Button: Primary Blue Pill & Secondary Outline
              </h3>
              <span className="text-xs font-mono text-[#0F1F10]/50">
                Pattern 5: Hover displacement -2px, Arrow slide +3px, Shadow Bloom
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" showArrow>
                {isMarathi ? "व्हॉट्सॲपवर ऑर्डर द्या" : "Order on WhatsApp"}
              </Button>

              <Button variant="secondary" showArrow>
                {isMarathi ? "आजची ताजी आवक" : "See Today's Harvest"}
              </Button>

              <Button variant="outline" className="bg-[#0F1F10] text-white">
                {isMarathi ? "डार्क आउटलाइन" : "Dark Outline"}
              </Button>

              <Button variant="ghost">
                {isMarathi ? "घोस्ट बटन" : "Ghost Action"}
              </Button>

              <Button variant="primary" pillRadius="tag" showArrow size="sm">
                Tag Radius (5px)
              </Button>
            </div>
          </div>

          {/* B. LinkUnderline & Eyebrows & Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Link Underline & Eyebrow */}
            <div className="p-8 rounded-3xl bg-white border border-[#0F1F10]/08 space-y-6">
              <h3 className="text-lg font-bold text-[#0F1F10]">LinkUnderline & Eyebrows</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Eyebrow variant="blue" dot dotPulse>
                    LIVE RADAR • 4:00 AM
                  </Eyebrow>
                  <Eyebrow variant="neutral">KARAD FLAGSHIP</Eyebrow>
                  <Eyebrow variant="blue" radius="pill">
                    PILL RADIUS
                  </Eyebrow>
                </div>

                <div className="space-y-2 pt-2">
                  <div>
                    <LinkUnderline href="#the-catch">
                      {isMarathi ? "सर्व सागरी मासोळी प्रकार पहा →" : "View all oceanic harvest cuts →"}
                    </LinkUnderline>
                  </div>
                  <div>
                    <LinkUnderline href="#family-story" active>
                      {isMarathi ? "सक्रिय लिंक (Active Underline)" : "Active Underlined Link State"}
                    </LinkUnderline>
                  </div>
                </div>
              </div>
            </div>

            {/* Chips */}
            <div className="p-8 rounded-3xl bg-white border border-[#0F1F10]/08 space-y-6">
              <h3 className="text-lg font-bold text-[#0F1F10]">Chips & Filter Pills</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Chip
                  active={activeChip === "all"}
                  count="18"
                  onClick={() => setActiveChip("all")}
                >
                  {isMarathi ? "सर्व आवक" : "All Catch"}
                </Chip>
                <Chip
                  active={activeChip === "sea"}
                  count="11"
                  onClick={() => setActiveChip("sea")}
                >
                  {isMarathi ? "सागरी मासोळी" : "Sea Fish"}
                </Chip>
                <Chip
                  active={activeChip === "river"}
                  count="4"
                  onClick={() => setActiveChip("river")}
                >
                  {isMarathi ? "गोडे पाणी" : "River Catch"}
                </Chip>
                <Chip
                  active={activeChip === "shellfish"}
                  count="3"
                  onClick={() => setActiveChip("shellfish")}
                >
                  {isMarathi ? "कोळंबी व खेकडे" : "Shellfish"}
                </Chip>
              </div>
            </div>
          </div>

          {/* C. Card Primitive */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#0F1F10]">
              Card: Category Tag, Image Scale 1.04, & AN Blue Border
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                tag="01 • COASTAL HARVEST"
                title={isMarathi ? "सिल्व्हर पापलेट (White Pomfret)" : "Silver White Pomfret"}
                description={
                  isMarathi
                    ? "रत्नागिरी बंदरावरून थेट आणलेली चंदेरी मऊ पापलेट, रवा फ्रायसाठी सर्वात लोकप्रिय."
                    : "Pristine white pomfret with tender silver meat, the king of coastal fry recipes."
                }
                href="#catch"
                meta={
                  <>
                    <span>₹950 / kg</span>
                    <span>LIVE HARVEST</span>
                  </>
                }
              />

              <Card
                tag="02 • SUB-ZERO COLD CHAIN"
                title={isMarathi ? "किंग सुरमई (King Seer Fish)" : "King Seer Fish (Surmai)"}
                description={
                  isMarathi
                    ? "०°C लिक्विड आईस स्लरीमध्ये सुरक्षित आणलेली घट्ट चकत्यांची अस्सल सुरमई."
                    : "Dense oceanic fillets, dawn-selected at Malvan auctions and sliced to precision."
                }
                href="#catch"
                meta={
                  <>
                    <span>₹850 / kg</span>
                    <span>0°C CHILLED</span>
                  </>
                }
              />

              <Card
                tag="03 • FRESHWATER RIVER"
                title={isMarathi ? "कृष्णा-कोयना रोहू (River Rohu)" : "Krishna River Rohu"}
                description={
                  isMarathi
                    ? "स्थानिक कराड काठावरील जिवंत गोड्या पाण्याची मासोळी, रस्सा करीसाठी सर्वोत्तम."
                    : "Fresh river catch harvested daily from Krishna river currents near Karad."
                }
                href="#catch"
                meta={
                  <>
                    <span>₹280 / kg</span>
                    <span>LOCAL FRESH</span>
                  </>
                }
              />
            </div>
          </div>

          {/* D. Marquee Ticker */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F1F10]">
              Marquee: Continuous Ticker (40px/s Desktop, 28px/s Mobile)
            </h3>
            <Marquee
              items={[
                "01 • DAWN HARBOR SOURCING",
                "02 • 0°C SUB-ZERO ICE SLURRY",
                "03 • 100% CHEMICAL & FORMALIN FREE",
                "04 • DIRECT SEA-TO-KARAD IN 6 HOURS",
                "05 • FREE CUSTOM RECIPE CUTTING",
              ]}
            />
          </div>

          {/* E. NumberedListItem */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F1F10]">
              NumberedListItem: Accordion-Free List Rows
            </h3>
            <div className="space-y-4 max-w-4xl">
              <NumberedListItem
                number="01"
                active
                metric="4:00 AM AUCTION"
                title={isMarathi ? "थेट बंदर लिलावातून खरेदी" : "Direct Harbor Sourcing"}
                description={
                  isMarathi
                    ? "कोणत्याही मध्यस्थांशिवाय आमच्या टीमने स्वतः निवडलेली ताजी सागरी आवक."
                    : "Inspected at dawn boat landings directly by our quality evaluation teams."
                }
                isMarathi={isMarathi}
              />
              <NumberedListItem
                number="02"
                metric="0°C CONSTANT"
                title={isMarathi ? "०°C लिक्विड आईस स्लरी साठवण" : "0°C Liquid Ice Slurry"}
                description={
                  isMarathi
                    ? "पारंपरिक कोरड्या बर्फापेक्षा सुरक्षित, पेशींचा ताजेपणा आणि नैसर्गिक रस टिकवणारे तंत्रज्ञान."
                    : "Locks cellular moisture to preserve true natural ocean flavors from dock to kitchen."
                }
                isMarathi={isMarathi}
              />
            </div>
          </div>
        </section>

        {/* 4. MOTION PRIMITIVES */}
        <section id="motion" className="space-y-12">
          <SectionHeading
            eyebrow="04 • MOTION PRIMITIVES"
            title="Calm, Confident Physics & Micro-Animations"
            subtitle="Masked text unmasking with Devanagari word-only safety, image reveals, parallax depth, and sticky pinned list interaction."
            isMarathi={isMarathi}
          />

          {/* A. SplitReveal with Replay */}
          <div className="p-8 rounded-3xl bg-white border border-[#0F1F10]/08 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F1F10]">
                  SplitReveal: Masked Spring Unmasking (Word-Only for Marathi)
                </h3>
                <p className="text-xs text-[#0F1F10]/60">
                  Preserves Devanagari conjuncts (*जोडाक्षरे*); spring: stiffness 280, damping 26.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSplitKey((k) => k + 1)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F4F2] hover:bg-[#EBF8FF] text-xs font-mono-accent text-[#0A9AD9] font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replay Animation</span>
              </button>
            </div>

            <div key={splitKey} className="py-4 space-y-4">
              <SplitReveal
                as="h2"
                text={
                  isMarathi
                    ? "समुद्राच्या खोलीतून थेट तुमच्या स्वयंपाकघरापर्यंत."
                    : "Fresh from the deep. Loved in every kitchen across Karad."
                }
                className="text-3xl sm:text-5xl font-bold text-[#0F1F10]"
                isMarathi={isMarathi}
              />
            </div>
          </div>

          {/* B. CountUp & ImageReveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CountUp */}
            <div className="p-8 rounded-3xl bg-white border border-[#0F1F10]/08 space-y-4">
              <h3 className="text-lg font-bold text-[#0F1F10]">CountUp Telemetry</h3>
              <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                <div className="p-4 rounded-2xl bg-[#F5F4F2]">
                  <div className="text-3xl font-bold text-[#0A9AD9]">
                    <CountUp to={100} suffix="%" />
                  </div>
                  <div className="text-[11px] font-mono-accent text-[#0F1F10]/60 uppercase mt-1">
                    Formalin Free
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F4F2]">
                  <div className="text-3xl font-bold text-[#0A9AD9]">
                    <CountUp to={0} suffix="°C" />
                  </div>
                  <div className="text-[11px] font-mono-accent text-[#0F1F10]/60 uppercase mt-1">
                    Liquid Ice
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F4F2]">
                  <div className="text-3xl font-bold text-[#0A9AD9]">
                    <CountUp to={6} suffix="h" />
                  </div>
                  <div className="text-[11px] font-mono-accent text-[#0F1F10]/60 uppercase mt-1">
                    Sea-to-Karad
                  </div>
                </div>
              </div>
            </div>

            {/* ImageReveal */}
            <div className="p-8 rounded-3xl bg-white border border-[#0F1F10]/08 space-y-4">
              <h3 className="text-lg font-bold text-[#0F1F10]">ImageReveal (Masked Zoom-out)</h3>
              <ImageReveal direction="up" className="rounded-2xl h-44 bg-[#F5F4F2] flex items-center justify-center border border-[#0F1F10]/10">
                <div className="text-center space-y-2">
                  <Waves className="w-8 h-8 text-[#0A9AD9] mx-auto animate-pulse" />
                  <p className="font-mono-accent text-xs text-[#0F1F10]/70 uppercase font-bold">
                    Clip-path Unmask Transition (1.0s, Cubic-Bezier)
                  </p>
                </div>
              </ImageReveal>
            </div>
          </div>

          {/* C. PinnedList Component */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F5F4F2] border border-[#0F1F10]/08">
            <PinnedList
              eyebrow="PATTERN 2 • PINNED LIST"
              title={
                isMarathi
                  ? "अस्सल ताजेपणाचे चार भक्कम आधारस्तंभ"
                  : "The 4 Core Pillars of Proven Freshness"
              }
              subtitle={
                isMarathi
                  ? "मध्यस्थांशिवाय पहाटे ४:०० लिलावापासून ते आपल्या ताटापर्यंत अखंड शीतसाखळी."
                  : "How we guarantee unmatched dock freshness directly from the Arabian Sea to Karad."
              }
              items={pinnedItems}
              isMarathi={isMarathi}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
