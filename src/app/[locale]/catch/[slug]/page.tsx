import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { SPECIES_LIST } from "@/data/species";
import { generatePageMetadata } from "@/lib/seo";
import { SpeciesDetailView } from "./SpeciesDetailView";

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    for (const sp of SPECIES_LIST) {
      params.push({ locale, slug: sp.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const sp = SPECIES_LIST.find((item) => item.slug === slug);
  if (!sp) return { metadataBase: new URL("https://anfishworld.com") };

  return generatePageMetadata({
    locale,
    path: `/catch/${slug}`,
    titleMr: `${sp.marathiName} — ताजी आवक`,
    titleEn: `${sp.scientificName} (${sp.marathiName})`,
    descriptionMr: `कराडमध्ये ताजी ${sp.marathiName} घरपोच मिळवा. ०°C शीतसाखळी, शून्य रसायने.`,
    descriptionEn: `Fresh ${sp.marathiName} (${sp.scientificName}) delivered across Karad. 0°C cold chain.`,
  });
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const sp = SPECIES_LIST.find((item) => item.slug === slug);
  if (!sp) notFound();

  const tFish = await getTranslations("fish");

  return (
    <div
      data-section="species-detail-page"
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

      <div className="relative z-10">
        <SpeciesDetailView
          species={sp}
          locale={locale}
          tasteNotes={sp.tasteNotesKey ? tFish(sp.tasteNotesKey) : sp.tasteNote}
          culinaryNotes={sp.culinaryUseKey ? tFish(sp.culinaryUseKey) : (locale === "mr" ? "सर्वोत्तम फ्राय / रस्सा" : "Ideal for Fry / Curry")}
          badgeText={sp.badgeKey ? tFish(sp.badgeKey) : undefined}
        />
      </div>
    </div>
  );
}
