"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { gsap } from "@/lib/gsap";
import { ArrowUp, MapPin, Phone, Clock, ArrowRight, ArrowUpRight, Code2, Sparkles } from "lucide-react";
import { useScrollStore } from "@/store/scroll";

interface FooterLink {
  href: string;
  labelEn: string;
  labelMr: string;
}

interface FooterColumn {
  id: string;
  titleEn: string;
  titleMr: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "col-an",
    titleEn: "AN Fish World",
    titleMr: "ए एन फिश वर्ल्ड",
    links: [
      { href: "/our-story", labelEn: "Our Story", labelMr: "आमची ओळख (Our Story)" },
      { href: "/contact", labelEn: "Let's Talk", labelMr: "संपर्क साधा (Let's Talk)" },
    ],
  },
  {
    id: "col-fish",
    titleEn: "Our Fish",
    titleMr: "आमची मासोळी",
    links: [
      { href: "/catch", labelEn: "For Your Family", labelMr: "घरच्या जेवणासाठी (For Your Family)" },
      { href: "/wholesale", labelEn: "For Your Business", labelMr: "हॉटेल्स व व्यवसायासाठी (For Your Business)" },
    ],
  },
  {
    id: "col-freshness",
    titleEn: "Our Freshness",
    titleMr: "आमचा ताजेपणा",
    links: [
      { href: "/our-freshness/the-fresh-chain", labelEn: "The Fresh Chain", labelMr: "अखंड शीतसाखळी (The Fresh Chain)" },
      { href: "/our-freshness/clean-and-cut", labelEn: "Clean & Cut", labelMr: "स्वच्छता व कटिंग (Clean & Cut)" },
    ],
  },
  {
    id: "col-journal",
    titleEn: "Journal",
    titleMr: "जर्नल व माहिती",
    links: [
      { href: "/journal/media", labelEn: "Videos & Media", labelMr: "व्हिडीओ व प्रसारमाध्यमे (Videos & Media)" },
      { href: "/catch", labelEn: "Fish Guide", labelMr: "मासोळी मार्गदर्शक (Fish Guide)" },
      { href: "/journal/stories", labelEn: "Customer Stories", labelMr: "ग्राहकांचे अनुभव (Customer Stories)" },
    ],
  },
  {
    id: "col-legals",
    titleEn: "Legals",
    titleMr: "कायदेशीर बाबी",
    links: [
      { href: "/privacy", labelEn: "Privacy Policy", labelMr: "गोपनीयता धोरण (Privacy Policy)" },
      { href: "/terms", labelEn: "Terms of Use", labelMr: "वापराच्या अटी (Terms of Use)" },
    ],
  },
];

interface BranchLocation {
  id: string;
  cityEn: string;
  cityMr: string;
  subtitleEn: string;
  subtitleMr: string;
  addressEn: string;
  addressMr: string;
  phone: string;
  timingEn: string;
  timingMr: string;
}

const BRANCHES: BranchLocation[] = [
  {
    id: "karad-malkapur",
    cityEn: "Karad (Malkapur)",
    cityMr: "कराड (मलकापूर)",
    subtitleEn: "Flagship Counter & Cold-Chain Hub",
    subtitleMr: "मुख्य दालन व शीतसाखळी केंद्र",
    addressEn: "NH-4 Malkapur Bypass Road, Karad, Maharashtra 415539",
    addressMr: "एनएच-४ मलकापूर बायपास रोड, कराड, महाराष्ट्र ४१५५३९",
    phone: "+91 98XXX XXXXX",
    timingEn: "6:30 AM – 1:30 PM | 4:30 PM – 9:00 PM",
    timingMr: "सकाळी ६:३० – १:३० | संध्याकाळी ४:३० – ९:००",
  },
  {
    id: "patan-mhavashi",
    cityEn: "Patan Mhavashi",
    cityMr: "पाटण (म्हावशी)",
    subtitleEn: "Daily Fresh Catch Express Counter",
    subtitleMr: "दैनिक ताजी मासोळी एक्स्प्रेस दालन",
    addressEn: "Patan-Karad Road, Mhavashi Phata, Patan, Maharashtra 415206",
    addressMr: "पाटण-कराड रोड, म्हावशी फाटा, पाटण, महाराष्ट्र ४१५२०६",
    phone: "+91 98XXX XXXXX",
    timingEn: "7:00 AM – 1:00 PM | 5:00 PM – 8:30 PM",
    timingMr: "सकाळी ७:०० – १:०० | संध्याकाळी ५:०० – ८:३०",
  },
  {
    id: "ishwarpur",
    cityEn: "Ishwarpur",
    cityMr: "ईश्वरपूर (इस्लामपूर)",
    subtitleEn: "Retail Counter & Home Deliveries",
    subtitleMr: "किरकोळ विक्री दालन व होम डिलिव्हरी",
    addressEn: "Main Market Road, Islampur / Ishwarpur, Maharashtra 415409",
    addressMr: "मुख्य बाजारपेठ रस्ता, इस्लामपूर / ईश्वरपूर, महाराष्ट्र ४१५४०९",
    phone: "+91 98XXX XXXXX",
    timingEn: "7:00 AM – 1:00 PM | 5:00 PM – 8:30 PM",
    timingMr: "सकाळी ७:०० – १:०० | संध्याकाळी ५:०० – ८:३०",
  },
];

// Lucide-style brand SVG components
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function FishVideoWordmark({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = true;

    // Autoplay video with immediate mute
    video.muted = true;
    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };
    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("playing", () => {});

    const updateSize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const w = Math.max(320, rect.width || window.innerWidth);
      // Monumental font size: fills ~92% of the container width on a single line
      const fontSize = Math.min(w * 0.116, 175);
      const h = Math.round(fontSize * 1.35);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetW = Math.round(w * dpr);
      const targetH = Math.round(h * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const render = () => {
      if (!isRunning) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Monumental font size matching container width
      const fontSize = Math.min(w * 0.116, 175);
      // Valid concrete font string WITHOUT var() so Canvas 2D parser never defaults to 10px
      const fontStr = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

      // Check if video is producing frames
      const isVideoActive =
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        !video.paused &&
        !video.ended;

      if (isVideoActive) {
        // 1. Draw swimming fish video with cover aspect ratio
        ctx.save();
        const vAspect = video.videoWidth / video.videoHeight;
        const cAspect = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;

        if (cAspect > vAspect) {
          drawH = w / vAspect;
          drawY = (h - drawH) / 2;
        } else {
          drawW = h * vAspect;
          drawX = (w - drawW) / 2;
        }

        ctx.drawImage(video, drawX, drawY, drawW, drawH);

        // 2. Mask strictly inside the text "AN FISH WORLD"
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = fontStr;
        ctx.fillText("AN FISH WORLD", w / 2, h / 2);
        ctx.restore();

        // 3. Crisp luminous lagoon cyan water stroke
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "rgba(110, 198, 240, 0.45)";
        ctx.lineWidth = Math.max(1.5, fontSize * 0.015);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = fontStr;
        ctx.strokeText("AN FISH WORLD", w / 2, h / 2);
        ctx.restore();
      } else {
        // Fallback: Vibrant sunlit aquatic gradient so text is never an empty wireframe
        ctx.save();
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.35, "#6EC6F0");
        grad.addColorStop(0.7, "#0A9AD9");
        grad.addColorStop(1, "#034966");
        ctx.fillStyle = grad;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = fontStr;
        ctx.fillText("AN FISH WORLD", w / 2, h / 2);
        ctx.restore();
      }

      ctx.restore(); // restores ctx.scale(dpr, dpr)
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center select-none"
    >
      {/* Full-bleed active video element keeping hardware decoder at 60fps */}
      <video
        ref={videoRef}
        src="/media/fish-clean-water-2.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="pointer-events-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.001,
          zIndex: -1,
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-auto block drop-shadow-[0_12px_40px_rgba(10,154,217,0.3)]"
      />
    </div>
  );
}

export function Footer() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !displacementRef.current || !turbulenceRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;

    gsap.killTweensOf(displacementRef.current);
    gsap.to(displacementRef.current, {
      scale: 22,
      duration: 0.15,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(displacementRef.current, {
          scale: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      },
    });

    gsap.to(turbulenceRef.current, {
      baseFrequency: `${0.015 + relX * 0.02} 0.06`,
      duration: 0.2,
      ease: "sine.out",
    });
  };

  const handlePointerLeave = () => {
    if (displacementRef.current) {
      gsap.to(displacementRef.current, { scale: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  return (
    <footer
      data-section="footer"
      aria-label="Site Footer"
      className="relative bg-[#0F1F10] text-[#FFFFFF] border-t border-white/10 pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-12 z-10 selection:bg-[#0A9AD9]"
    >
      {/* SVG Water Ripple Filter for Giant Wordmark */}
      <svg className="sr-only" aria-hidden="true">
        <filter id="wordmark-water-ripple">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.018 0.04"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* SECTION 1: Branch Lines (Mirroring Alethia's 2 Offices Architecture) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-mono-accent uppercase tracking-widest text-[#0A9AD9] font-bold block">
                // {isMarathi ? "आमची दालने व पत्ते" : "Retail Outposts & Hubs"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {isMarathi ? "कराड आणि पश्चिम महाराष्ट्रातील दालने" : "Our Branch Locations"}
              </h3>
            </div>

            {/* Social Icons (Instagram, YouTube, Facebook with Lucide aesthetic) */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AN Fish World on Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#6EC6F0] hover:text-[#6EC6F0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to AN Fish World on YouTube"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#6EC6F0] hover:text-[#6EC6F0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with AN Fish World on Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#0A9AD9] hover:text-[#0A9AD9] flex items-center justify-center transition-colors cursor-pointer"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{isMarathi ? branch.subtitleMr : branch.subtitleEn}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight mt-1.5">
                    {isMarathi ? branch.cityMr : branch.cityEn}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed mt-2 font-mono-accent">
                    {isMarathi ? branch.addressMr : branch.addressEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono-accent">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{isMarathi ? branch.timingMr : branch.timingEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6EC6F0] font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#0A9AD9]" />
                    <span>{branch.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: 5 Columns Navigation (Alethia's Exact Structure) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 border-t border-white/10 pt-16">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.id} className="space-y-4">
              <span className="text-xs font-mono-accent uppercase tracking-wider text-[#0A9AD9] font-bold block">
                // {isMarathi ? col.titleMr : col.titleEn}
              </span>
              <ul className="space-y-2.5 text-sm font-medium">
                {col.links.map((link) => (
                  <li key={link.href + link.labelEn}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group/link"
                    >
                      <span>{isMarathi ? link.labelMr : link.labelEn}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#0A9AD9]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SECTION 3: Giant Wordmark with Fish Swimming Video strictly masked inside text */}
        <div
          ref={wordmarkRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative text-center select-none overflow-hidden py-4 cursor-crosshair group"
        >
          <div style={{ filter: reducedMotion ? "none" : "url(#wordmark-water-ripple)" }}>
            <FishVideoWordmark reducedMotion={reducedMotion} />
          </div>
          <div className="text-[11px] font-mono-accent uppercase tracking-widest text-[#0A9AD9] mt-3 font-semibold">
            KARAD • MAHARASHTRA • EST. 2024 • FRESH SEAFOOD
          </div>
        </div>

        {/* SECTION 4: Marathi Cultural Sign-off Line */}
        <div className="text-center py-6 border-y border-white/10">
          <p className="text-2xl sm:text-3xl font-bold text-white font-marathi-display tracking-wide">
            &ldquo;खुश रहा, मासे खावा&rdquo;
          </p>
          <span className="text-[11px] font-mono-accent uppercase tracking-widest text-[#0A9AD9] mt-1.5 block font-semibold">
            — {isMarathi ? "कराडची लाडकी फिश कंपनी" : "AN Fish World Karad"}
          </span>
        </div>

        {/* SECTION 5: Awwwards Architectural Colophon & Studio Credits */}
        <div className="border-t border-white/10 pt-10 sm:pt-14 space-y-8">
          {/* Awwwards Grand Showcase Container */}
          <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-[#0A160C] border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden group/colophon">
            {/* Ambient Breathing Neon Glows */}
            <div
              className="absolute -top-24 -left-24 w-80 h-80 bg-[#0A9AD9]/20 rounded-full blur-[90px] pointer-events-none animate-pulse"
              style={{ animationDuration: "6s" }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-400/15 rounded-full blur-[90px] pointer-events-none animate-pulse"
              style={{ animationDuration: "7s", animationDelay: "1.5s" }}
              aria-hidden="true"
            />

            {/* Sweeping Shimmer Light Beam */}
            <div
              className="shimmer-sweep pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-45"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Studio Colophon Identity & Vision */}
              <div className="text-center lg:text-left space-y-2 max-w-md">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-widest shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{isMarathi ? "डिजिटल अनुभव व निर्मिती" : "DIGITAL CRAFT & ENGINEERING"}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white font-latin-display tracking-tight">
                  {isMarathi ? "संकल्पना, डिझाईन आणि अत्याधुनिक तंत्रज्ञान" : "Engineered with Passion for AN Fish World"}
                </h4>
                <p className="text-xs text-white/60 font-mono-accent leading-relaxed">
                  {isMarathi
                    ? "कराड, महाराष्ट्र • Next.js, WebGL आणि आधुनिक डिझाईन सह निर्मित"
                    : "Karad, Maharashtra • Built with Next.js, Tailwind, GSAP & WebGL"}
                </p>
              </div>

              {/* Studio Showcase Interactive Cards */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
                {/* 1. AB Tech Services */}
                <a
                  href="https://abtechservices.store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AB Tech Services — Developed by (Opens in new tab)"
                  className="studio-card group/ab relative w-full sm:w-auto flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-[#0A9AD9] text-white transition-all duration-300 shadow-sm hover:shadow-[0_0_35px_rgba(10,154,217,0.45)] hover:-translate-y-1.5 cursor-pointer select-none overflow-hidden"
                >
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A9AD9]/0 via-[#0A9AD9]/10 to-transparent opacity-0 group-hover/ab:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative w-10 h-10 rounded-xl bg-[#0A9AD9]/15 border border-[#0A9AD9]/40 flex items-center justify-center text-[#6EC6F0] group-hover/ab:scale-110 group-hover/ab:bg-[#0A9AD9] group-hover/ab:text-white group-hover/ab:shadow-[0_0_15px_rgba(10,154,217,0.6)] transition-all duration-300 shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono-accent uppercase tracking-wider text-[#6EC6F0] font-bold">
                        {isMarathi ? "वेबसाईट निर्मिती" : "DEVELOPED BY"}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold tracking-tight text-white group-hover/ab:text-[#6EC6F0] transition-colors flex items-center gap-1.5 mt-0.5">
                      <span>AB Tech Services</span>
                      <ArrowUpRight className="w-4 h-4 text-[#6EC6F0] transition-transform duration-300 group-hover/ab:translate-x-1 group-hover/ab:-translate-y-1" />
                    </div>
                    <span className="text-[10px] font-mono-accent text-white/40 block mt-0.5 group-hover/ab:text-white/60 transition-colors">
                      abtechservices.store
                    </span>
                  </div>
                </a>

                {/* Collaboration Indicator Node */}
                <div className="hidden sm:flex flex-col items-center justify-center px-1">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-xs font-mono-accent font-bold shadow-xs">
                    ×
                  </div>
                </div>
                <div className="sm:hidden flex items-center gap-2 py-0.5">
                  <span className="h-px w-6 bg-white/15" />
                  <span className="text-[10px] font-mono-accent uppercase tracking-widest text-white/40 font-semibold">
                    {isMarathi ? "सहकार्याने" : "IN COLLABORATION WITH"}
                  </span>
                  <span className="h-px w-6 bg-white/15" />
                </div>

                {/* 2. Goldspade */}
                <a
                  href="https://www.goldspade.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Goldspade — In collaboration with (Opens in new tab)"
                  className="studio-card group/gs relative w-full sm:w-auto flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-amber-400 text-white transition-all duration-300 shadow-sm hover:shadow-[0_0_35px_rgba(251,191,36,0.45)] hover:-translate-y-1.5 cursor-pointer select-none overflow-hidden"
                >
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-transparent opacity-0 group-hover/gs:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover/gs:scale-110 group-hover/gs:bg-amber-400 group-hover/gs:text-black group-hover/gs:shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono-accent uppercase tracking-wider text-amber-300/90 font-bold">
                        {isMarathi ? "सहकार्याने" : "COLLABORATION"}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold tracking-tight text-white group-hover/gs:text-amber-300 transition-colors flex items-center gap-1.5 mt-0.5">
                      <span>Goldspade</span>
                      <ArrowUpRight className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover/gs:translate-x-1 group-hover/gs:-translate-y-1" />
                    </div>
                    <span className="text-[10px] font-mono-accent text-white/40 block mt-0.5 group-hover/gs:text-white/60 transition-colors">
                      goldspade.in
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Meta & Back to Top Bar (With clearance for Sticky WhatsApp Action) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-accent text-white/50 pt-3 pb-8 md:pr-48">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} AN Fish World. All rights reserved.
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A9AD9]" />
              <span>17.2892° N, 74.1818° E • 0°C UNBROKEN COLD CHAIN</span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to Top"
              className="group/top flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#0A9AD9]/50 text-white transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-[0_0_20px_rgba(10,154,217,0.25)] shrink-0"
            >
              <span className="font-semibold text-xs tracking-wider">Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#0A9AD9] transition-transform duration-300 group-hover/top:-translate-y-1" />
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmerAnimation {
            0% {
              transform: translateX(-150%) skewX(-20deg);
            }
            35%, 100% {
              transform: translateX(250%) skewX(-20deg);
            }
          }
          .shimmer-sweep {
            animation: shimmerAnimation 7s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .shimmer-sweep {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </footer>
  );
}

