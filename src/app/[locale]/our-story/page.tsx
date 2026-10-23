import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { StoryHero } from "@/components/sections/our-story/StoryHero";
import { TrustStatement } from "@/components/sections/our-story/TrustStatement";
import { PhotoMarqueeStack } from "@/components/sections/our-story/PhotoMarqueeStack";
import { PrinciplesList } from "@/components/sections/our-story/PrinciplesList";
import { TeamSection } from "@/components/sections/our-story/TeamSection";
import { CommunityPartners } from "@/components/sections/our-story/CommunityPartners";
import { CareersCtaBand } from "@/components/sections/our-story/CareersCtaBand";

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
    path: "/our-story",
    titleMr: "आमची गोष्ट — आपली लाडकी फिश कंपनी",
    titleEn: "Our Story — Advancing What Fresh Fish Means to a Family",
    descriptionMr: "रत्नागिरी व मालवणच्या पहाटे ४:०० लिलावापासून सुरू झालेला कराडमधील विश्वासाचा प्रवास. ०°C शीतसाखळी आणि १००% फॉर्मेलिनमुक्त ताजी मासोळी.",
    descriptionEn: "The founding journey of AN Fish World in Karad: dawn coastal sourcing, 0°C liquid slurry cold chains, and unwavering family trust.",
  });
}

export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  return (
    <article data-section="our-story-page" className="pb-16">
      {/* 1. Hero with wide team/counter image, 3-line H1, subhead & scroll cue */}
      <StoryHero />

      {/* 2. 'The Need for Trust, Not Just Taste' statement + image */}
      <TrustStatement />

      {/* 3. 'Fresh Fish that Families Talk About' + 7-photo horizontal marquee stack */}
      <PhotoMarqueeStack />

      {/* 4. Our Principles (01-05 numbered sticky active list) */}
      <PrinciplesList />

      {/* 5. Our Team (Portraits with role and hover disclosure) */}
      <TeamSection />

      {/* 6. Partners & Community ('When freshness isn't negotiable...' + platform badges) */}
      <CommunityPartners />

      {/* 7. Careers CTA Band ('Work Where Freshness Matters' -> /contact) */}
      <CareersCtaBand />
    </article>
  );
}
