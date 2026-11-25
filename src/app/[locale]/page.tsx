import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/home/Hero";
import { getBranchWhatsappMap } from "@/lib/liveStock";
import { MaharashtraMapSection } from "@/components/sections/home/MaharashtraMapSection";
import { SignatureSection } from "@/components/sections/home/SignatureSection";
import { AboutSection } from "@/components/sections/home/AboutSection";
import { MenuSection } from "@/components/sections/home/MenuSection";
import { ServicesSection } from "@/components/sections/home/ServicesSection";
import { GallerySection } from "@/components/sections/home/GallerySection";
import { ReviewsSection } from "@/components/sections/home/ReviewsSection";
import { OrderSection } from "@/components/sections/home/OrderSection";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { ContactSection } from "@/components/sections/home/ContactSection";

// Re-generate every minute so branch WhatsApp numbers stay current.
export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      {/* 01. HERO SECTION (#home) - Centered Logo, Name, Heading, Tagline, 2 Action Buttons & Textured Background */}
      <Hero />

      {/* 02. MAHARASHTRA 3D MAP & FRANCHISE STORES (#franchise-map) - Karad HQ (with 3D Fish), Ishwarpur, Patan & Arabian Sea */}
      <MaharashtraMapSection whatsappBySlug={await getBranchWhatsappMap()} />

      {/* 03. SIGNATURE CATCH (#signature) - "आमची खासियत" (Pomfret, Surmai, Tiger Prawns, Rawas) */}
      <SignatureSection />

      {/* 03. ABOUT SECTION (#about) - "आमच्याबद्दल" (Ameer Nadaf Story, Ratnagiri/Malvan Auctions & Purity) */}
      <AboutSection />

      {/* 04. INTERACTIVE MENU (#menu) - "आमचे स्पेशल मेनू" (Category filter tabs like Hotel Atithi) */}
      <MenuSection />

      {/* 05. WHY CHOOSE US (#services) - "आम्हाला का निवडाल?" (4 Core Value Pillars) */}
      <ServicesSection />

      {/* 06. GALLERY (#gallery) - "आमची झलक" (Chilled counter, hygiene, founder, community) */}
      <GallerySection />

      {/* 07. CUSTOMER REVIEWS (#reviews) - "आमचे ग्राहक काय म्हणतात?" (Real Karad Testimonials) */}
      <ReviewsSection />

      {/* 08. WHATSAPP ORDER BUILDER (#order) - "आजच आपली ऑर्डर नोंदवा!" (Instant WhatsApp Order Form) */}
      <OrderSection />

      {/* 09. FAQ ACCORDION (#faq) - "वारंवार विचारले जाणारे प्रश्न" */}
      <FaqSection />

      {/* 10. CONTACT & MAP (#contact) - "आमच्यापर्यंत कसे पोहोचाल?" (Store Address, Timings & Google Maps) */}
      <ContactSection />
    </>
  );
}
