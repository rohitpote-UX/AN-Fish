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
    <div data-section="catch-page" className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h1
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-4xl sm:text-6xl font-black text-white tracking-tight`}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-base sm:text-xl text-[#E9F7FF]/80 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <Marquee items={marqueeItems} />
      <CatchCatalogSection />
      <CatchRangeOverview locale={locale} />
      <FinalCta />
    </div>
  );
}
