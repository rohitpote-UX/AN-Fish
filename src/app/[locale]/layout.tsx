import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  geistSans,
  geistMono,
  baloo2,
  notoSansDevanagari,
  playfair,
} from "@/app/fonts";
import "@/app/globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { FishCursor } from "@/components/layout/FishCursor";
import { DepthMeter } from "@/components/layout/DepthMeter";
import { StickyActions } from "@/components/layout/StickyActions";
import { BasketDrawer } from "@/components/basket/BasketDrawer";
import { FooterCtaBand } from "@/components/layout/FooterCtaBand";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isMarathi = locale === "mr";

  const title = isMarathi
    ? "ए एन फिश वर्ल्ड | कराडची लाडकी मासोळी — Fresh Fish Retail"
    : "AN Fish World | Karad's Beloved Fresh Catch — Fresh Fish Retail";

  const description = isMarathi
    ? "रत्नागिरी आणि मालवणच्या पहाटे ४:०० AM लिलावातून थेट निवडलेली, ०°C लिक्विड आईसमध्ये सुरक्षित आणलेली, १००% फॉर्मेलिनमुक्त ताजी मासोळी आता कराडमध्ये."
    : "Selected at 4:00 AM coastal harbour auctions across Ratnagiri & Malvan, chilled in 0°C liquid ice slurry, and delivered fresh to homes across Karad.";

  return {
    title,
    description,
    metadataBase: new URL("https://anfishworld.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        mr: "/mr",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      locale: isMarathi ? "mr_IN" : "en_IN",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "mr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo2.variable} ${notoSansDevanagari.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#FFFFFF] text-[#0F1F10] relative selection:bg-[#0A9AD9] selection:text-white">
        {/* Custom Studio Fish Cursor (Fine pointer only, auto-disables on touch) */}
        <FishCursor />

        {/* Ocean Depth Vertical Telemetry Meter (Desktop only) */}
        <DepthMeter />

        {/* Accessibility: Skip to main content landmark */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0A9AD9] focus:text-white focus:rounded-lg focus:font-bold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content / मुख्य मजकुराकडे जा
        </a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            {/* 70px Fixed Frosted Navigation Header */}
            <Header />

            {/* Main Page Landmark */}
            <main id="main-content" className="relative z-10 focus:outline-none">
              {children}
            </main>

            {/* Floating Quick Order Action Pills (WhatsApp + Mobile Call) */}
            <StickyActions />

            {/* Basket Drawer (Framer Motion right-drawer / bottom-sheet) */}
            <BasketDrawer />

            {/* Persistent Full-Width Footer CTA Band */}
            <FooterCtaBand />

            {/* High-Contrast 10% Black Footer (Alethia 5-Column & Outposts System) */}
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
