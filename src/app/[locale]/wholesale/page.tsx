import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { PLACEHOLDERS } from "@/data/placeholders";
import { ShieldCheck, Truck, ThermometerSnowflake, Scale, MessageCircle, FileText, ArrowRight } from "lucide-react";
import { FinalCta } from "@/components/sections/home/FinalCta";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/wholesale",
    titleMr: "हॉटेल्स व केटरर्ससाठी ठोक पुरवठा (B2B)",
    titleEn: "Wholesale & B2B Supply for Hotels",
    descriptionMr: "कराड, सातारा व कोल्हापूर परिसरातील नामांकित हॉटेल्सना दररोज अखंड शीतसाखळीसह ताजी मासोळी पुरवठा.",
    descriptionEn: "Daily unbroken cold-chain supply for premium restaurants and caterers across Karad, Satara, and Kolhapur.",
  });
}

export default async function WholesalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("wholesalePage");
  const isMarathi = locale === "mr";

  const b2bPillars = [
    {
      icon: ThermometerSnowflake,
      titleMr: "०°C लिक्विड आईस स्लरी",
      titleEn: "0°C Liquid Ice Slurry",
      descMr: "पारंपरिक बर्फापेक्षा ४ पट जलद थंडावा. मासोळीचा पाण्याचा अंश टिकून राहतो व वजन घटत नाही.",
      descEn: "Chills 4x faster than dry flaked ice, preserving cellular moisture and preventing weight loss.",
    },
    {
      icon: Truck,
      titleMr: "पहाटे थेट बंदरावरून आवक",
      titleEn: "Harbour Direct Dispatch",
      descMr: "रत्नागिरी व मालवण बंदरातून थेट वातानुकूलित वाहनांद्वारे कराड, सातारा व सांगलीपर्यंत दैनंदिन वाहतूक.",
      descEn: "Dispatched at dawn directly from Ratnagiri and Malvan docks to your kitchen doors.",
    },
    {
      icon: Scale,
      titleMr: "कस्टम कटिंग व वजन गॅरंटी",
      titleEn: "Custom Culinary Butchering",
      descMr: "हॉटेल्सच्या गरजेनुसार स्टेक, करी कट, फिलेट किंवा संपूर्ण साफ मासोळी. शून्य वेस्टेज.",
      descEn: "Exact portioning tailored to your chef's specs — steaks, fillets, curry cuts, or gutted whole.",
    },
    {
      icon: ShieldCheck,
      titleMr: "१००% केमिकल व फॉर्मेलिनमुक्त",
      titleEn: "Zero Chemical Certification",
      descMr: "दैनिक डिजिटल लॅब तपासणी. अन्न व औषध प्रशासनाच्या नियमांचे काटेकोर पालन.",
      descEn: "Every batch verified 100% formalin and ammonia free with FSSAI compliant hygiene documentation.",
    },
  ];

  const wholesaleWhatsappMsg = encodeURIComponent(
    "Hello AN Fish World Karad, I would like to inquire regarding daily wholesale B2B seafood supply for my restaurant/catering business."
  );

  return (
    <div data-section="wholesale-page" className="pt-32 pb-24">
      {/* Route Header with single proper H1 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase mb-3 inline-block">
          // Commercial Seafood Distribution • Western Maharashtra
        </span>
        <h1
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-4xl sm:text-6xl font-black text-white tracking-tight`}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-base sm:text-xl text-[#E9F7FF]/80 max-w-3xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Main B2B Overview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl bg-gradient-to-b from-[#063A63]/40 to-[#02111F]/90 border border-[#6EC6F0]/25 p-8 sm:p-12 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full bg-[#0A9AD9]/20 text-[#6EC6F0] text-xs font-mono-accent uppercase tracking-wider border border-[#0A9AD9]/30">
                B2B Cold Chain Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {t("b2bHeading")}
              </h2>
              <p className="text-base text-[#E9F7FF]/85 leading-relaxed">
                {t("b2bDesc")}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${wholesaleWhatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(10,154,217,0.5)] transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t("inquireCta")}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <a
                  href={`tel:${PLACEHOLDERS.CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
                >
                  <span>{PLACEHOLDERS.CONTACT_PHONE}</span>
                </a>
              </div>
            </div>

            {/* B2B Specs List */}
            <div className="rounded-2xl bg-[#05080C]/70 border border-[#6EC6F0]/15 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10 text-white font-mono-accent text-sm">
                <FileText className="w-4 h-4 text-[#0A9AD9]" />
                <span>Commercial Service Standards</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#E9F7FF]/80">
                <li className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/60">Minimum Order Qty (MOQ):</span>
                  <span className="font-mono-accent text-white font-bold">[FILL: 10 KG BULK]</span>
                </li>
                <li className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/60">Daily Dispatch Time:</span>
                  <span className="font-mono-accent text-white font-bold">6:00 AM - 8:30 AM</span>
                </li>
                <li className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/60">Packaging Type:</span>
                  <span className="font-mono-accent text-[#6EC6F0] font-bold">Food-grade Insulated Crates</span>
                </li>
                <li className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/60">Temperature Retention:</span>
                  <span className="font-mono-accent text-emerald-400 font-bold">&lt; 2°C Guaranteed</span>
                </li>
                <li className="flex items-center justify-between py-1.5">
                  <span className="text-white/60">FSSAI Compliance:</span>
                  <span className="font-mono-accent text-white font-bold">{PLACEHOLDERS.FSSAI_LICENSE}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {b2bPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#02111F]/70 border border-[#6EC6F0]/20 p-6 backdrop-blur-sm space-y-3 hover:border-[#0A9AD9] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A9AD9]/20 border border-[#0A9AD9]/40 flex items-center justify-center text-[#6EC6F0]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {isMarathi ? p.titleMr : p.titleEn}
                </h3>
                <p className="text-xs text-[#E9F7FF]/70 leading-relaxed">
                  {isMarathi ? p.descMr : p.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <FinalCta />
    </div>
  );
}
