import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { FreshnessPageTemplate } from "@/components/templates/FreshnessPageTemplate";
import { THE_FRESH_CHAIN_CONFIG } from "@/data/freshnessPages";

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
    path: "/our-freshness/the-fresh-chain",
    titleMr: "द फ्रेश चेन — अखंड ०°C शीतसाखळी | ए एन फिश वर्ल्ड कराड",
    titleEn: "The Fresh Chain — Sub-Zero 0°C Cold Chain Logistics | AN Fish World",
    descriptionMr: "पहाटे ४:०० बंदरावरील लिलावापासून ते कराडच्या दालनापर्यंत अवघ्या ६ तासांत अखंड ०°C स्लरीमध्ये सुरक्षित ताजी मासोळी.",
    descriptionEn: "From dawn coastal harbour auctions to Karad in under 6 hours: our sub-zero 0°C liquid slurry protocol guarantees chemical-free freshness.",
  });
}

export default async function TheFreshChainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  return <FreshnessPageTemplate config={THE_FRESH_CHAIN_CONFIG} />;
}
