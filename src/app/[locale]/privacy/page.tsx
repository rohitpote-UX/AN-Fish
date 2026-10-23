import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";

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
    path: "/privacy",
    titleMr: "गोपनीयता धोरण (Privacy Policy)",
    titleEn: "Privacy Policy",
    descriptionMr: "ए एन फिश वर्ल्डचे ग्राहक गोपनीयता धोरण आणि डेटा संरक्षण नियम.",
    descriptionEn: "AN Fish World customer privacy policy and data governance practices.",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const isMarathi = locale === "mr";

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-12">
        <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase mb-2 block font-bold">
          // {isMarathi ? "कायदेशीर बाबी" : "Legals & Governance"}
        </span>
        <h1
          className={`text-3xl sm:text-5xl font-bold text-[#0F1F10] tracking-tight ${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          }`}
        >
          {isMarathi ? "गोपनीयता धोरण" : "Privacy Policy"}
        </h1>
        <p className="mt-3 text-sm text-[#0F1F10]/60 font-mono-accent">
          {isMarathi ? "अंतिम सुधारणा: जानेवारी २०२६" : "Last updated: January 2026"}
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-[#0F1F10]/80 space-y-6 text-sm sm:text-base leading-relaxed">
        <p>
          {isMarathi
            ? "ए एन फिश वर्ल्ड कराड आपल्या वैयक्तिक गोपनीयतेचा संपूर्ण आदर करते. आम्ही ग्राहकांकडून केवळ ऑर्डर पूर्तता, डिलिव्हरी आणि आवश्यक ग्राहक सेवेसाठीच नाव, संपर्क क्रमांक आणि पत्ता गोळा करतो."
            : "AN Fish World Karad respects and values your personal privacy. We only collect essential customer details (name, contact number, and delivery address) for order fulfillment, logistics coordination, and direct support."}
        </p>
        <p>
          {isMarathi
            ? "आम्ही कोणत्याही त्रयस्थ संस्थेला ग्राहकांची वैयक्तिक माहिती विकत किंवा सामायिक करत नाही. आमची व्हॉट्सॲप ऑर्डरिंग प्रणाली एन्क्रिप्टेड आणि सुरक्षित आहे."
            : "We never monetize or share customer personal information with third parties. All WhatsApp interactions and order confirmations are encrypted and securely maintained."}
        </p>
        <p>
          {isMarathi
            ? "गोपनीयता धोरणाबाबत कोणत्याही प्रश्नासाठी आपण आम्हाला contact@anfishworld.com वर थेट संपर्क करू शकता."
            : "For any privacy-related inquiries or data deletion requests, please contact our support team at contact@anfishworld.com."}
        </p>
      </div>
    </div>
  );
}
