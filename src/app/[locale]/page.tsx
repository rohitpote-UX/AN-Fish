import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/home/Hero";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { ProductDiscovery } from "@/components/sections/home/ProductDiscovery";
import { FreshnessPanels } from "@/components/sections/home/FreshnessPanels";
import { VisionBlock } from "@/components/sections/home/VisionBlock";
import { Ticker } from "@/components/sections/home/Ticker";
import { LogoCluster } from "@/components/sections/home/LogoCluster";
import { TrustStatements } from "@/components/sections/home/TrustStatements";
import { StoreOutpostSection } from "@/components/sections/home/StoreOutpostSection";
import { Stories } from "@/components/sections/home/Stories";
import { JournalSection } from "@/components/sections/home/JournalSection";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "mr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      {/* 01. SIGNATURE CINEMATIC HERO */}
      <Hero />

      {/* 02. EDITORIAL PRODUCT DISCOVERY */}
      <ProductDiscovery />

      {/* 03. NUMBERED CAPABILITY LIST (01–05) */}
      <Capabilities />

      {/* 04. FRESHNESS TECHNOLOGY & COLD CHAIN PANELS */}
      <FreshnessPanels />

      {/* 05. OWNER & FOUNDER VISION */}
      <VisionBlock />

      {/* 06. HARVEST TICKER */}
      <Ticker />

      {/* 07. TRUST STATEMENTS (01–04) */}
      <TrustStatements />

      {/* 08. KARAD STORE OUTPOST & VISITING HOURS */}
      <StoreOutpostSection />

      {/* 09. CONNECT & CHANNELS */}
      <LogoCluster />

      {/* 10. LOCAL CULINARY STORIES */}
      <Stories />

      {/* 11. JOURNAL & MEDIA */}
      <JournalSection />
    </>
  );
}
