import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { CatchCatalogSection } from "@/components/sections/CatchCatalogSection";
import { CatchRangeOverview } from "@/components/sections/catch/CatchRangeOverview";
import { Marquee } from "@/components/ui/Marquee";
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
    path: "/catch",
    titleMr: "आजची ताजी आवक",
    titleEn: "Today's Catch & Full Seafood Range",
    descriptionMr: "सिल्व्हर पापलेट, सुरमई, रावस, टायगर कोळंबी व कृष्णा नदीतील ताजी मासोळी. कराडमध्ये घरपोच.",
    descriptionEn: "Silver Pomfret, King Seer (Surmai), Rawas, Tiger Prawns, and freshwater catch delivered in Karad.",
  });
}

export default async function CatchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("catchPage");
  const isMarathi = locale === "mr";

  const marqueeItems = isMarathi
    ? [
        "पहाटे ४:०० AM थेट बंदरावरून निवड",
        "०°C लिक्विड आईस शीतसाखळी",
        "१००% फॉर्मेलिन व अमोनियामुक्त",
        "कराडमध्ये ४५ मिनिटांत घरपोच",
      ]
    : [
        "4:00 AM Harbour Auction Harvest",
        "0°C Liquid Ice Cold Chain",
        "100% Formalin & Ammonia Free",
        "Fast Doorstep Delivery Across Karad",
      ];

  return (
    <div
      data-section="catch-page"
      className="relative min-h-screen bg-[#071A24] text-white pt-28 sm:pt-36 pb-24 overflow-hidden selection:bg-[#0A9AD9] selection:text-white"
    >
      {/* Ocean Caustics Backdrops */}
      <div
        className="absolute top-0 right-0 w-full h-[650px] bg-[radial-gradient(circle_at_85%_20%,rgba(11,157,216,0.14)_0%,transparent_60%)] pointer-events-none select-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_15%_90%,rgba(110,198,240,0.08)_0%,transparent_50%)] pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#6EC6F0]/30 text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider font-bold mb-5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{isMarathi ? "दैनिक ताजी आवक • कराड" : "DAILY HARBOUR HARVEST • KARAD"}</span>
        </div>

        <h1
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]`}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-base sm:text-xl text-[#E9F7FF]/85 max-w-2xl mx-auto font-normal leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative z-10">
        <Marquee items={marqueeItems} />
        <CatchCatalogSection />
        <CatchRangeOverview locale={locale} />
        <FinalCta />
      </div>
    </div>
  );
}
