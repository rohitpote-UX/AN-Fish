import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { BRANCHES_LIST } from "@/data/branches";
import { PLACEHOLDERS } from "@/data/placeholders";
import { BranchDetailCard } from "@/components/sections/branches/BranchDetailCard";
import { ShieldCheck, Truck } from "lucide-react";
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
    path: "/branches",
    titleMr: "कराड व मलकापूर दालने",
    titleEn: "Our Karad Outposts & Flagship Stores",
    descriptionMr: "स्वच्छ, वातानुकूलित आणि दुर्गंधीमुक्त वातावरणात ताजी मासोळी निवडीचा अनुभव घ्या. कराड व मलकापूर.",
    descriptionEn: "Experience odor-free, climate-controlled fresh seafood retail across Karad and surrounding areas.",
  });
}

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("branchesPage");
  const isMarathi = locale === "mr";

  return (
    <div data-section="branches-page" className="pt-32 pb-24">
      {/* Route Header with single proper H1 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-xs font-mono-accent text-[#0A9AD9] tracking-widest uppercase mb-3 inline-block">
          // Retail Presence • Karad
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

      {/* Branches Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BRANCHES_LIST.map((branch) => (
            <BranchDetailCard key={branch.id} branch={branch} locale={locale} />
          ))}
        </div>

        {/* Coverage & Assurance Bar */}
        <div className="mt-12 rounded-3xl bg-[#02111F]/60 border border-[#6EC6F0]/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#0A9AD9]/20 border border-[#0A9AD9]/40 text-[#6EC6F0]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isMarathi ? "कराड शहर व १५ किमी परिसर जलद घरपोच" : "Fast Doorstep Delivery Across Karad"}
              </h3>
              <p className="text-xs sm:text-sm text-[#E9F7FF]/70">
                {PLACEHOLDERS.DELIVERY_SLOTS}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-accent text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>100% Odor-Free & Clean-Room Butchering</span>
          </div>
        </div>
      </div>

      <FinalCta />
    </div>
  );
}
