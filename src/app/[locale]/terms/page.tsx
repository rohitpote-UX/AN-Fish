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
    path: "/terms",
    titleMr: "वापराच्या अटी (Terms of Use)",
    titleEn: "Terms of Use",
    descriptionMr: "ए एन फिश वर्ल्ड सेवा नियम, ऑर्डरिंग अटी आणि गुणवत्ता हमी.",
    descriptionEn: "AN Fish World terms of service, ordering policies, and freshness guarantee.",
  });
}

export default async function TermsPage({
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
          {isMarathi ? "वापराच्या अटी" : "Terms of Use"}
        </h1>
        <p className="mt-3 text-sm text-[#0F1F10]/60 font-mono-accent">
          {isMarathi ? "अंतिम सुधारणा: जानेवारी २०२६" : "Last updated: January 2026"}
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-[#0F1F10]/80 space-y-6 text-sm sm:text-base leading-relaxed">
        <p>
          {isMarathi
            ? "ए एन फिश वर्ल्डच्या संकेतस्थळाचा वापर करून आपण आमच्या अटी मान्य करता. आमची सर्व उत्पादने रोजच्या बंदर लिलावातील उपलब्धतेवर आणि हवामानावर अवलंबून असतात."
            : "By accessing AN Fish World services, you agree to these operational terms. Daily catch availability is subject to coastal auction harvests and seasonal weather conditions."}
        </p>
        <p>
          {isMarathi
            ? "दररोजचे माशांचे दर सकाळच्या लिलावावर आधारित असतात. ऑर्डर निश्चित करताना व्हॉट्सॲपवर दिलेला दर अंतिम मानला जाईल."
            : "Daily market rates fluctuate based on morning harbour auctions. The quotation confirmed via WhatsApp at the time of order placement is final."}
        </p>
        <p>
          {isMarathi
            ? "स्वच्छता व कटिंग आपल्या आवडीनुसार (रवा फ्राय, करी कट, होल क्लीन) विनामूल्य केली जाते. डिलिव्हरी स्वीकारताना दर्जाची खात्री करण्याचे आवाहन केले जाते."
            : "Custom cuts and hygienic RO-cleaning are complimentary with every order. Customers are encouraged to verify quality upon receipt."}
        </p>
      </div>
    </div>
  );
}
