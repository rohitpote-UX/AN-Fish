import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { FreshnessPageTemplate } from "@/components/templates/FreshnessPageTemplate";
import { CLEAN_AND_CUT_CONFIG } from "@/data/freshnessPages";

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
    path: "/our-freshness/clean-and-cut",
    titleMr: "स्वच्छता आणि कटिंग — १००% शुद्ध आरओ पाणी व मोफत कटिंग | ए एन फिश वर्ल्ड",
    titleEn: "Clean & Cut — 100% RO Purified Wash & Custom Cuts | AN Fish World",
    descriptionMr: "फक्त शुद्ध आरओ पाण्याने धुलाई, स्टेनलेस स्टील टेबलावर पारदर्शक स्वच्छता आणि तुमच्या आवडीच्या रेसिपीनुसार मोफत चोख कटिंग. घरात दुर्गंधी किंवा पसारा नाही.",
    descriptionEn: "Washed with purified RO water, descaled on sterile stainless steel stations, and customized to your exact recipe free of charge.",
  });
}

export default async function CleanAndCutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  return <FreshnessPageTemplate config={CLEAN_AND_CUT_CONFIG} />;
}
