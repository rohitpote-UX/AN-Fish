import type { Metadata } from "next";

export function generatePageMetadata({
  locale,
  path,
  titleMr,
  titleEn,
  descriptionMr,
  descriptionEn,
}: {
  locale: string;
  path: string;
  titleMr: string;
  titleEn: string;
  descriptionMr: string;
  descriptionEn: string;
}): Metadata {
  const isMarathi = locale === "mr";
  const title = isMarathi ? `${titleMr} | ए एन फिश वर्ल्ड` : `${titleEn} | AN Fish World`;
  const description = isMarathi ? descriptionMr : descriptionEn;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anfishworld.com";

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}${path}`,
      languages: {
        mr: `${baseUrl}/mr${path}`,
        en: `${baseUrl}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: isMarathi ? "mr_IN" : "en_IN",
      type: "website",
      url: `${baseUrl}/${locale}${path}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
