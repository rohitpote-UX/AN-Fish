import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { PLACEHOLDERS } from "@/data/placeholders";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { MapPin, Phone, Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { FinalCta } from "@/components/sections/home/FinalCta";

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
    path: "/contact",
    titleMr: "आमच्याशी संपर्क साधा",
    titleEn: "Contact Our Karad Team",
    descriptionMr: "ताजी मासोळी ऑर्डर, विशेष समारंभासाठी आरक्षण किंवा कोणत्याही मदतीसाठी आम्ही सदैव तत्पर आहोत.",
    descriptionEn: "We are available 7 days a week for seafood inquiries, event catering orders, and home delivery support.",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const isMarathi = locale === "mr";

  return (
    <div data-section="contact-page" className="pt-32 pb-24">
      {/* Route Header with single proper H1 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase mb-3 inline-block">
          // Karad Support & Order Assistance
        </span>
        <h1
          className={`${
            isMarathi ? "font-marathi-display" : "font-latin-display"
          } text-4xl sm:text-6xl font-black text-white tracking-tight`}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-base sm:text-xl text-[#E9F7FF]/80 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Main Grid: Form + Outpost Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#02111F]/80 border border-[#6EC6F0]/20 p-8 backdrop-blur-md space-y-6">
              <h2 className="text-2xl font-black text-white">
                {isMarathi ? "कराड मुख्यालय व दालन" : "Karad Outpost & Office"}
              </h2>

              <div className="space-y-4 text-sm text-[#E9F7FF]/85">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#0A9AD9] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Address
                    </span>
                    <p className="mt-0.5">{PLACEHOLDERS.STORE_ADDRESS_KARAD}</p>
                    <p className="text-xs text-white/50 mt-1 font-mono-accent">
                      Landmark: {PLACEHOLDERS.STORE_LANDMARK}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#6EC6F0] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Operating Hours
                    </span>
                    <p className="mt-0.5">{PLACEHOLDERS.DAILY_HOURS}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Direct Telephone
                    </span>
                    <p className="mt-0.5 font-mono-accent text-white font-bold">
                      {PLACEHOLDERS.CONTACT_PHONE}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#0A9AD9] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-mono-accent text-[#6EC6F0] uppercase">
                      Email
                    </span>
                    <p className="mt-0.5 font-mono-accent">{PLACEHOLDERS.STORE_EMAIL}</p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Button */}
              <div className="pt-4 border-t border-[#6EC6F0]/15">
                <a
                  href={`https://wa.me/${PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=Hello%20AN%20Fish%20World%20Karad,%20I%20have%20an%20inquiry`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isMarathi ? "व्हॉट्सॲपवर चॅट करा" : "WhatsApp Quick Chat"}</span>
                </a>
              </div>
            </div>

            {/* Quality / Compliance Badge */}
            <div className="rounded-2xl bg-[#063A63]/30 border border-[#6EC6F0]/20 p-5 flex items-center gap-3.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs text-[#E9F7FF]/80">
                <span className="font-bold text-white block">Government Compliant & Licensed</span>
                <span>FSSAI License No. {PLACEHOLDERS.FSSAI_LICENSE}</span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#02111F]/80 border border-[#6EC6F0]/20 p-8 sm:p-10 backdrop-blur-md">
              <h2 className="text-2xl font-black text-white mb-2">
                {t("formTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-[#E9F7FF]/70 mb-8">
                {t("formDesc")}
              </p>

              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </div>

      <FinalCta />
    </div>
  );
}
