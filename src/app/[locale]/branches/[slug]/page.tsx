import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { BRANCHES_LIST } from "@/data/branches";
import { PLACEHOLDERS } from "@/data/placeholders";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Navigation,
  Scissors,
  Waves,
  Fish,
  Building2,
  Check,
  Truck,
  Flame,
  Heart,
  Award,
  Store,
  Star,
  PackageCheck,
  CreditCard,
  Droplets,
  Calendar,
  UserCheck,
} from "lucide-react";
import { BranchOrderCalculator } from "@/components/sections/branches/BranchOrderCalculator";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const branch of BRANCHES_LIST) {
      params.push({ locale, slug: branch.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const branch = BRANCHES_LIST.find((b) => b.slug === slug);
  if (!branch) return {};

  const isMarathi = locale === "mr";
  return {
    title: `${isMarathi ? branch.nameMr : branch.nameEn} | AN Fish World`,
    description: isMarathi ? branch.taglineMr : branch.taglineEn,
  };
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  const branch = BRANCHES_LIST.find((b) => b.slug === slug);
  if (!branch) notFound();

  const isMarathi = locale === "mr";

  // Comprehensive 10-Item Live Fish Stock for this Branch
  const stockItems = [
    {
      id: "paplet",
      nameMr: "सिल्व्हर पापलेट (A-Grade)",
      nameEn: "Silver Pomfret (A-Grade)",
      rate: PLACEHOLDERS.PRICES.PAPLET,
      badgeMr: "कराडकरांची पहिली पसंती",
      badgeEn: "Customer Favorite",
      cutsMr: "तवा फ्राय कट • अख्खा स्वच्छ • कालवण कट",
      cutsEn: "Tawa Fry Slices • Whole Cleaned • Curry Cut",
      bestCookingMr: "मालवणी रवा फ्राय किंवा गोडसर कालवण",
      bestCookingEn: "Rawa Fry or Light Curry",
      image: "/media/hero/pomfret-free.webp",
      descMr: "अतिशय मऊ, तोंडात विरघळणारी गोडसर चव. पहाटेच्या पहिल्या लिलावातून स्वतः निवडलेली ए-ग्रेड मासोळी.",
      descEn: "Delicate melt-in-mouth texture with sweet ocean freshness.",
    },
    {
      id: "surmai",
      nameMr: "किंग सुरमई स्टेक्स",
      nameEn: "King Surmai Steaks",
      rate: PLACEHOLDERS.PRICES.SURMAI,
      badgeMr: "सागराचा राजा",
      badgeEn: "King of the Ocean",
      cutsMr: "गोल स्टेक्स (रवा फ्राय) • कालवण कट • बोनलेस",
      cutsEn: "Round Fry Steaks • Curry Cut • Boneless",
      bestCookingMr: "तवा रवा फ्राय व झणझणीत तांबडा रस्सा",
      bestCookingEn: "Crisp Tawa Fry & Spicy Curry",
      image: "/media/hero/surmai-free.webp",
      descMr: "मांसल, घट्ट पोत आणि कमी काट्यांची अप्रतिम चव. फक्त एका मणक्याचा काटा असल्याने कुटुंबासाठी सर्वात सुरक्षित.",
      descEn: "Meaty single-bone coastal favorite with firm texture.",
    },
    {
      id: "prawns",
      nameMr: "रॉयल टायगर कोळंबी",
      nameEn: "Royal Tiger Prawns",
      rate: PLACEHOLDERS.PRICES.KOLAMBI_TIGER,
      badgeMr: "गोड व रसरशीत",
      badgeEn: "Sweet & Juicy",
      cutsMr: "स्वच्छ सोललेली (Devained) • शेपूट ठेवलेली",
      cutsEn: "Peeled & Deveined • Tail-on",
      bestCookingMr: "कोळंबी मसाला, बटर फ्राय किंवा बिर्याणी",
      bestCookingEn: "Prawns Masala or Butter Garlic Fry",
      image: "/media/hero/prawns-free.webp",
      descMr: "कुरकुरीत आणि नैसर्गिक रसाळ गोडवा. आतला काळा धागा (vein) चोख काढून स्वच्छ केलेली.",
      descEn: "Crisp snap, deveined and cleaned thoroughly in RO water.",
    },
    {
      id: "rawas",
      nameMr: "इंडियन सामन (रावस)",
      nameEn: "Indian Salmon (Rawas)",
      rate: PLACEHOLDERS.PRICES.RAWAS,
      badgeMr: "ओमेगा-३ समृद्ध",
      badgeEn: "Rich in Omega-3",
      cutsMr: "बोनलेस फिलेट • करी स्टेक्स • फ्राय क्युब्स",
      cutsEn: "Boneless Fillet • Curry Steaks • Fry Cubes",
      bestCookingMr: "तवा ग्रिल, रवा फ्राय व पौष्टिक सूप",
      bestCookingEn: "Grill, Pan Fry & Nourishing Soup",
      image: "/media/hero/rawas-free.webp",
      descMr: "अतिशय पौष्टिक, मऊ व लहान मुले तसेच ज्येष्ठ नागरिकांच्या आरोग्यासाठी डॉक्टर-शिफारस केलेली मासोळी.",
      descEn: "Heart-healthy, exceptionally tender and rich in vital nutrients.",
    },
    {
      id: "bangda",
      nameMr: "ताजा सागरी बांगडा",
      nameEn: "Fresh Ocean Mackerel (Bangda)",
      rate: PLACEHOLDERS.PRICES.BANGDA,
      badgeMr: "पहाटेची थेट आवक",
      badgeEn: "Daily Fresh Catch",
      cutsMr: "अख्खा स्वच्छ (पोट साफ) • तवा फ्राय कट",
      cutsEn: "Whole Cleaned • Tawa Fry Cut",
      bestCookingMr: "अख्खा तिखट रवा फ्राय किंवा तिखले रस्सा",
      bestCookingEn: "Whole Rawa Fry or Tangy Curry",
      image: "/media/hero/bangda-free.webp",
      descMr: "रत्नागिरी व मालवण बंदरावरून ०°C नैसर्गिक बर्फात आणलेला टवटवीत बांगडा. ओमेगा-३ चा उत्तम स्रोत.",
      descEn: "Direct harbor harvest packed with natural fatty acids.",
    },
    {
      id: "rohu",
      nameMr: "कृष्णा काठ गोड रोहू",
      nameEn: "River Fresh Rohu",
      rate: PLACEHOLDERS.PRICES.ROHU,
      badgeMr: "नदीचे गोडे पाणी",
      badgeEn: "Fresh River Catch",
      cutsMr: "कालवण कट • गोल स्टेक्स • डोके स्वच्छ",
      cutsEn: "Curry Cut • Round Steaks",
      bestCookingMr: "पारंपरिक गावरान पद्धतीचे रसरशीत कालवण",
      bestCookingEn: "Traditional Village Curry",
      image: "/media/hero/rohu-free.webp",
      descMr: "कृष्णा नदीच्या गोड्या पाण्याचा चवदार आणि रसाळ रोहू मासा. अस्सल गावरान चवीसाठी प्रसिद्ध.",
      descEn: "Sweetwater river fish harvested fresh from the Krishna valley.",
    },
    {
      id: "bombil",
      nameMr: "अस्सल बोंबील (मोठा साईझ)",
      nameEn: "Fresh Bombay Duck (Bombil)",
      rate: "₹240 / kg",
      badgeMr: "खुसखुशीत रवा फ्राय",
      badgeEn: "Crispy Rawa Fry",
      cutsMr: "चपट कापलेले (Butterflied) • पाणी निथळलेले",
      cutsEn: "Butterflied & Cleaned",
      bestCookingMr: "कुरकुरीत मालवणी रवा फ्राय",
      bestCookingEn: "Ultra Crispy Coastal Fry",
      image: "/media/hero/pomfret-free.webp",
      descMr: "थेट बंदरावरून आलेले टवटवीत ओले बोंबील. आतून रसरशीत व बाहेरून कुरकुरीत रवा फ्रायसाठी खास.",
      descEn: "Plump fresh Bombay Duck, cleaned and flattened for perfect fry.",
    },
    {
      id: "chimbori",
      nameMr: "गावठी कांदळवन चिंबोरी (खेकडे)",
      nameEn: "Fresh Mud Crabs (Chimbori)",
      rate: "₹650 / kg",
      badgeMr: "जीवंत व भरलेली",
      badgeEn: "Live & Meaty",
      cutsMr: "नांग्या वेगळ्या • कवच स्वच्छ • दोन तुकडे",
      cutsEn: "Cleaned & Halved Claws",
      bestCookingMr: "झणझणीत कोल्हापुरी किंवा मालवणी खेकडा रस्सा",
      bestCookingEn: "Spicy Coastal Crab Masala",
      image: "/media/hero/prawns-free.webp",
      descMr: "मांसाने पूर्ण भरलेली गावठी कांदळवनाची चिंबोरी. अस्सल झणझणीत रस्सा आणि सूपसाठी अप्रतिम.",
      descEn: "Sweet coastal mangrove crabs packed with rich claw meat.",
    },
    {
      id: "halwa",
      nameMr: "काळा हलवा (ब्लॅक पापलेट)",
      nameEn: "Black Pomfret (Halwa)",
      rate: "₹720 / kg",
      badgeMr: "खोल समुद्रातील चव",
      badgeEn: "Deep Sea Delicacy",
      cutsMr: "तवा फ्राय चकत्या • कालवण कट",
      cutsEn: "Round Fry Slices • Curry Cut",
      bestCookingMr: "रवा फ्राय किंवा नारळाच्या दुधातील रस्सा",
      bestCookingEn: "Rawa Fry or Coconut Curry",
      image: "/media/hero/surmai-free.webp",
      descMr: "मांसल आणि चवदार खोल समुद्रातील मासोळी. पापलेटसारखीच चव मात्र अधिक घट्ट मांस.",
      descEn: "Firm texture and rich flavor from deep coastal waters.",
    },
    {
      id: "jitada",
      nameMr: "जितडा मासा (कोस्टल सी-बास)",
      nameEn: "Coastal Jitada (Asian Sea Bass)",
      rate: "₹850 / kg",
      badgeMr: "अस्सल कोकणी मेजवानी",
      badgeEn: "Coastal Special",
      cutsMr: "फिलेट • कालवण कट • अख्खा स्वच्छ",
      cutsEn: "Fillets • Curry Cut",
      bestCookingMr: "तिखट आंबट सार किंवा तंदूर ग्रिल",
      bestCookingEn: "Spicy Tangy Curry or Grill",
      image: "/media/hero/jitada-free.webp",
      descMr: "कोकणातील खवय्यांचा अत्यंत आवडता जितडा मासा. पांढरेशुभ्र मांस आणि अत्युच्च दर्जाची चव.",
      descEn: "Premium coastal favorite celebrated for white flaky flesh.",
    },
  ];

  // In-Store Masala / Spices Counter
  const masalaItems = [
    {
      id: "fry-masala",
      nameMr: "ए एन फिश स्पेशल फ्राय मसाला",
      nameEn: "AN Fish Special Fry Masala",
      price: "₹80",
      weight: "100 g",
      descMr: "तवा व रवा फ्रायसाठी खास तयार केलेला अस्सल मालवणी व कोल्हापुरी पद्धतीचा खमंग मसाला. लिंबू पिळून लगेच लावा!",
      descEn: "Artisanal blend of coastal spices crafted specifically for crisp rawa and tawa fish fry.",
    },
    {
      id: "curry-masala",
      nameMr: "ए एन अस्सल मालवणी कालवण मसाला",
      nameEn: "AN Authentic Malvani Curry Masala",
      price: "₹90",
      weight: "100 g",
      descMr: "पारंपरिक भाजलेल्या मसाल्यांची अप्रतिम चव. माशांच्या काळ्या व तांबड्या कालवणासाठी खास घरगुती फॉर्म्युला.",
      descEn: "Slow-roasted traditional spice blend for rich, aromatic coastal fish curry.",
    },
    {
      id: "agri-masala",
      nameMr: "ए एन आगरी-कोळी स्पेशल मसाला",
      nameEn: "AN Agri-Koli Special Masala",
      price: "₹85",
      weight: "100 g",
      descMr: "झणझणीत तिखट आणि अस्सल सागरी खमंगपणा. कोळंबी, सुके बोंबील आणि माशांच्या सुक्यासाठी परिपूर्ण.",
      descEn: "Fiery, authentic coastal fisherman masala blend for authentic seafood gravies.",
    },
  ];

  const whatsappMessage = encodeURIComponent(
    isMarathi
      ? `नमस्कार AN Fish World (${branch.nameMr}), मला आजच्या ताजी आवकमधून ऑर्डर करायची आहे. कृपया उपलब्ध साठा सांगा.`
      : `Hello AN Fish World (${branch.nameEn}), I would like to place an order from today's fresh catch.`
  );

  return (
    <div className="relative min-h-screen bg-[#030F17] text-white pt-28 sm:pt-36 pb-24 overflow-hidden selection:bg-[#0A9AD9] selection:text-white">
      {/* Background Ambience & Lighting */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-20 right-10 w-[600px] h-[600px] rounded-full bg-[#0A9AD9]/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-40 left-10 w-[500px] h-[500px] rounded-full bg-[#FBBF24]/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb: Back to Maharashtra 3D Map */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}#franchise-map`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FBBF24] hover:text-white transition-colors bg-[#061D2B] px-4 py-2 rounded-full border border-white/10 shadow-md font-marathi-display"
          >
            <ArrowLeft className="w-4 h-4 text-[#FBBF24]" />
            <span>{isMarathi ? "← महाराष्ट्राच्या ३डी नकाशावर परत जा" : "← Back to Maharashtra 3D Map"}</span>
          </Link>

          <span className="text-xs text-white/60 font-mono-accent hidden sm:inline-block">
            BRANCH ID: {branch.slug.toUpperCase()}
          </span>
        </div>

        {/* 01. GRAND STORE HERO PORTFOLIO BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0C2A3C] via-[#082230] to-[#04151F] border-2 border-[#FBBF24]/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md overflow-hidden mb-12">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Store Information */}
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FBBF24] text-[#071A24] shadow-md uppercase">
                  {branch.type === "hq"
                    ? "👑 मुख्य केंद्र व दालन (Headquarter)"
                    : branch.type === "port"
                    ? "⚓ सागरी बंदर थेट आवक केंद्र"
                    : "📍 अधिकृत फ्रँचायझी दालन"}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isMarathi ? "आज चालू आहे · १००% ताजी आवक" : "Open Today · 100% Fresh Catch"}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-[#0A9AD9]/20 text-[#38BDF8] border border-[#0A9AD9]/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isMarathi ? "ISO व FSSAI प्रमाणित स्वच्छता" : "Certified Hygiene"}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-marathi-display text-white tracking-tight">
                {isMarathi ? branch.nameMr : branch.nameEn}
              </h1>

              <p className="text-sm sm:text-base text-[#6EC6F0] font-semibold font-marathi-body leading-relaxed">
                {isMarathi ? branch.taglineMr : branch.taglineEn}
              </p>

              {/* Address & Timings Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-white/85">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#061822]/90 border border-white/10">
                  <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white font-marathi-display block">पत्ता:</span>
                    <span className="text-white/75">{isMarathi ? branch.addressMr : branch.addressEn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#061822]/90 border border-white/10">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white font-marathi-display block">दालनाची वेळ:</span>
                    <span className="text-white/75">{isMarathi ? branch.hoursMr : branch.hoursEn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#061822]/90 border border-white/10">
                  <Truck className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white font-marathi-display block">डिलिव्हरी परिसर:</span>
                    <span className="text-white/75">
                      {isMarathi ? "१५ किमी परिसरात ३० मिनिटांत जलद घरपोच सेवा" : "Fast delivery within 15 km radius"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#061822]/90 border border-white/10">
                  <UserCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white font-marathi-display block">दालन संपर्क:</span>
                    <span className="text-white/75 font-semibold">
                      {branch.type === "hq" ? "आमिर नादाफ व मुख्य टीम" : "स्थानिक शाखा व्यवस्थापक व कटिंग मास्टर"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={`https://wa.me/${branch.phone.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#0A9AD9] via-[#0284C7] to-[#25D366] text-white font-black text-sm uppercase tracking-wide transition-all duration-300 shadow-[0_8px_24px_rgba(10,154,217,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 cursor-pointer font-marathi-display"
                >
                  <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                  <span>{isMarathi ? "व्हॉट्सॲपवर ऑर्डर द्या" : "Order on WhatsApp"}</span>
                </a>

                <a
                  href={`tel:${branch.phone.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white font-bold text-sm transition-all cursor-pointer font-marathi-display"
                >
                  <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>{isMarathi ? `कॉल करा: ${branch.phone}` : `Call: ${branch.phone}`}</span>
                </a>

                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white font-bold text-sm transition-all cursor-pointer font-marathi-display"
                >
                  <ExternalLink className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span>{isMarathi ? "गुगल मॅप्सवर दिशा" : "Directions"}</span>
                </a>
              </div>
            </div>

            {/* Store Photo / Thumbnail Card */}
            <div className="relative w-full lg:w-[380px] h-[260px] sm:h-[300px] rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl shrink-0">
              <Image
                src={branch.image || "/media/gallery/karad-outlet-tour.webp"}
                alt={isMarathi ? branch.nameMr : branch.nameEn}
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white/95 font-marathi-body bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <span className="font-bold text-[#FBBF24] block">📍 खूण (Landmark):</span>
                <span>{isMarathi ? branch.landmarkMr : branch.landmarkEn}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 02. STORE CORE FACILITIES & GUARANTEES (६ हमी व वैशिष्ट्ये) */}
        <div className="mb-14">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#FBBF24] tracking-wider uppercase">
              {isMarathi ? "आमच्या दालनाची खासियत" : "Store Facilities & Standards"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-marathi-display text-white mt-1">
              {isMarathi ? "या दालनात ग्राहकांना मिळणाऱ्या खास सुविधा" : "Customer Services & Hygiene Guarantees"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 text-center flex flex-col items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-[#38BDF8] flex items-center justify-center mb-2">
                <Waves className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-marathi-display">०°C नैसर्गिक गारवा</h4>
              <p className="text-[0.65rem] text-white/65 mt-1 font-marathi-body">१००% केमिकलमुक्त</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 text-center flex flex-col items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#6EC6F0] flex items-center justify-center mb-2">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-marathi-display">आरओ पाण्याने धुलाई</h4>
              <p className="text-[0.65rem] text-white/65 mt-1 font-marathi-body">पिण्याच्या शुद्ध पाण्याने स्वच्छता</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 text-center flex flex-col items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FBBF24] flex items-center justify-center mb-2">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-marathi-display">मोफत चोख कटिंग</h4>
              <p className="text-[0.65rem] text-white/65 mt-1 font-marathi-body">तवा फ्राय, कालवण, बोनलेस</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 text-center flex flex-col items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-marathi-display">३० मिनिटांत घरपोच</h4>
              <p className="text-[0.65rem] text-white/65 mt-1 font-marathi-body">स्थानिक एक्सप्रेस डिलिव्हरी</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 text-center flex flex-col items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-marathi-display">गंधहीन पॅकिंग</h4>
              <p className="text-[0.65rem] text-white/65 mt-1 font-marathi-body">फूड-ग्रेड पेपर व व्हॅक्यूम</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#061D2B]/90 border border-white/10 text-center flex flex-col items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white font-marathi-display">डिजिटल पेमेंट</h4>
              <p className="text-[0.65rem] text-white/65 mt-1 font-marathi-body">UPI, Cards व Cash</p>
            </div>
          </div>
        </div>

        {/* 03. 4:00 AM FRESHNESS TIMELINE (पहाटेच्या ताज्या आवकेचा प्रवास) */}
        <div className="mb-14 rounded-3xl bg-[#051824] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#FBBF24]" />
            <h3 className="text-xl sm:text-2xl font-black font-marathi-display text-white">
              {isMarathi ? "पहाटे ४:०० ते आपल्या ताटापर्यंत — ताजेपणाचा दैनंदिन प्रवास" : "The 4:00 AM Freshness Journey"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#071F2E] border border-white/10">
              <span className="text-xs font-bold text-[#FBBF24] block">पायरी ०१ · पहाटे ४:००</span>
              <h5 className="text-sm font-bold text-white font-marathi-display mt-1">थेट बंदरावर निवड</h5>
              <p className="text-xs text-white/70 mt-1 font-marathi-body">
                रत्नागिरी मिरकरवाडा व मालवण जेटीवर पहिल्या लिलावातून ए-ग्रेड माशांची थेट निवड.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#071F2E] border border-white/10">
              <span className="text-xs font-bold text-[#38BDF8] block">पायरी ०२ · पहाटे ५:३०</span>
              <h5 className="text-sm font-bold text-white font-marathi-display mt-1">०°C आईस एक्सप्रेस प्रवास</h5>
              <p className="text-xs text-white/70 mt-1 font-marathi-body">
                लिक्विड आईस स्लरी असलेल्या इन्सुलेटेड वाहनातून तातडीने या दालनाकडे प्रस्थान.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#071F2E] border border-white/10">
              <span className="text-xs font-bold text-emerald-400 block">पायरी ०३ · सकाळी ६:००</span>
              <h5 className="text-sm font-bold text-white font-marathi-display mt-1">आरओ पाण्याने स्वच्छता</h5>
              <p className="text-xs text-white/70 mt-1 font-marathi-body">
                दालनात आगमन होताच पिण्याच्या शुद्ध पाण्याने धुलाई, ग्रेडिंग व आईस-बेडवर मांडणी.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#071F2E] border border-white/10">
              <span className="text-xs font-bold text-purple-400 block">पायरी ०४ · सकाळी ७:०० पुढे</span>
              <h5 className="text-sm font-bold text-white font-marathi-display mt-1">थेट विक्री व घरपोच</h5>
              <p className="text-xs text-white/70 mt-1 font-marathi-body">
                ग्राहकांना आवडीनुसार मोफत चोख कटिंग आणि ३० मिनिटांत घरपोच सुरक्षित डिलिव्हरी.
              </p>
            </div>
          </div>
        </div>

        {/* 04. SECTION: TODAY'S LIVE AVAILABLE FISH STOCK */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FBBF24] tracking-wider uppercase flex items-center gap-1.5">
                <Fish className="w-4 h-4 text-[#FBBF24]" />
                {isMarathi ? "थेट या दालनातील आजची ताजी मासोळी" : "Live In-Store Fresh Catch"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-marathi-display text-white mt-1">
                {isMarathi ? "आजचा उपलब्ध ताजी मासोळी साठा (Live Daily Rates)" : "Available Fish Stock Today"}
              </h2>
            </div>

            {/* Guarantee Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#081F2C] border border-[#0A9AD9]/40 text-xs text-[#6EC6F0] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isMarathi ? "१००% शुद्ध आरओ पाण्याने स्वच्छता · मोफत कटिंग" : "RO Cleaned • Free Cuts"}</span>
            </div>
          </div>

          {/* Stock Grid: 10 Real Fish Varieties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {stockItems.map((fish) => (
              <div
                key={fish.id}
                className="group relative rounded-3xl bg-gradient-to-b from-[#0B2535] via-[#091F2C] to-[#061824] border border-white/10 hover:border-[#38BDF8]/60 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(10,154,217,0.25)] hover:-translate-y-1"
              >
                {/* Fish Image Box */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#04121B] flex items-center justify-center p-3 mb-3">
                  <Image
                    src={fish.image}
                    alt={isMarathi ? fish.nameMr : fish.nameEn}
                    width={200}
                    height={140}
                    className="object-contain max-h-full max-w-full transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    🟢 {isMarathi ? "ताजी आवक" : "Fresh"}
                  </span>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[0.6rem] font-bold bg-black/75 text-[#FBBF24]">
                    {isMarathi ? fish.badgeMr : fish.badgeEn}
                  </span>
                </div>

                {/* Fish Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-bold font-marathi-display text-white group-hover:text-[#FBBF24] transition-colors leading-tight">
                    {isMarathi ? fish.nameMr : fish.nameEn}
                  </h3>

                  <p className="text-[0.72rem] text-white/70 line-clamp-2 leading-relaxed font-marathi-body">
                    {isMarathi ? fish.descMr : fish.descEn}
                  </p>

                  <div className="pt-2 border-t border-white/10 text-[0.68rem] text-[#6EC6F0]">
                    <span className="text-white/45 uppercase text-[0.6rem] font-bold block">
                      {isMarathi ? "मोफत कटिंग पर्याय:" : "Free Cuts:"}
                    </span>
                    <span className="font-semibold block truncate">{isMarathi ? fish.cutsMr : fish.cutsEn}</span>
                  </div>

                  <div className="text-[0.68rem] text-emerald-300">
                    <span className="text-white/45 uppercase text-[0.6rem] font-bold block">
                      {isMarathi ? "कशासाठी सर्वोत्तम:" : "Best for:"}
                    </span>
                    <span className="font-medium block truncate">{isMarathi ? fish.bestCookingMr : fish.bestCookingEn}</span>
                  </div>
                </div>

                {/* Bottom Price & Order CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[0.6rem] text-white/45 uppercase tracking-wider font-semibold">
                      {isMarathi ? "दैनिक बाजार दर" : "Daily Rate"}
                    </span>
                    <span className="text-sm font-black text-[#FBBF24] tabular-nums">
                      {fish.rate}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${branch.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      isMarathi
                        ? `नमस्कार AN Fish World (${branch.nameMr}), मला आजच्या ताजी आवकमधून "${fish.nameMr}" ऑर्डर करायची आहे.`
                        : `Hello AN Fish World (${branch.nameEn}), I want to order "${fish.nameEn}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#0A9AD9] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0A9AD9] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{isMarathi ? "मागवा" : "Order"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 05. IN-STORE SPICES & MASALA COUNTER (ए एन स्पेशल मसाले काऊंटर) */}
        <div className="mb-14 rounded-3xl bg-gradient-to-r from-[#170E05] via-[#1F1206] to-[#120B04] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#FBBF24] tracking-wider uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FBBF24]" />
                {isMarathi ? "दालनात खरेदीसाठी उपलब्ध" : "Available In Store"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-marathi-display text-white mt-1">
                {isMarathi ? "ए एन फिश स्पेशल मसाले (घरगुती पारंपरिक चव)" : "AN Fish Handcrafted Special Masalas"}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[#FBBF24] border border-amber-500/30 text-xs font-bold font-marathi-display">
              {isMarathi ? "माशांसोबत घरपोच उपलब्ध" : "Order Along with Fish"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {masalaItems.map((masala) => (
              <div
                key={masala.id}
                className="p-5 rounded-2xl bg-black/40 border border-amber-500/20 hover:border-amber-500/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-[#FBBF24] bg-amber-500/20 px-2 py-0.5 rounded">
                      {masala.weight}
                    </span>
                    <span className="text-base font-black text-white tabular-nums">
                      {masala.price}
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-marathi-display text-white">
                    {isMarathi ? masala.nameMr : masala.nameEn}
                  </h4>
                  <p className="text-xs text-white/75 font-marathi-body mt-2 leading-relaxed">
                    {isMarathi ? masala.descMr : masala.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <a
                    href={`https://wa.me/${branch.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      isMarathi
                        ? `नमस्कार AN Fish World (${branch.nameMr}), मला माशांसोबत "${masala.nameMr}" (${masala.weight}) सुद्धा मागवायचा आहे.`
                        : `Hello AN Fish World (${branch.nameEn}), please add "${masala.nameEn}" (${masala.weight}) to my fish order.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[#FBBF24] font-bold text-xs font-marathi-display transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isMarathi ? "मसाला ऑर्डर करा" : "Order Masala"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 06. HEALTH BENEFITS OF FISH BOARD (मासे खाण्याचे आरोग्यदायी फायदे) */}
        <div className="mb-14 rounded-3xl bg-gradient-to-b from-[#061F2E] via-[#041722] to-[#020F17] border border-white/10 p-6 sm:p-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center justify-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              {isMarathi ? "आरोग्य सल्ला व पोषण" : "Health & Nutrition"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-marathi-display text-white mt-1">
              {isMarathi ? '"मासे खाण्याचे आरोग्यदायी फायदे"' : "Proven Health Benefits of Eating Fish"}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-marathi-body mt-1">
              {isMarathi
                ? "आमच्या कराड मुख्य केंद्रातील प्रत्यक्ष दर्शनी फलकावरील आरोग्याची ७ महत्त्वाची सूत्रे:"
                : "Official nutritional guidance from AN Fish World store displays:"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#03131C] border border-white/10 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] shrink-0 mt-2" />
              <p className="text-xs sm:text-sm text-white/90 font-marathi-body">
                मासे खाल्ल्याने शरीरास <strong>लोह, जस्त आणि आयोडीन</strong> सारखी अत्यंत आवश्यक खनिजे मिळतात.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#03131C] border border-white/10 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
              <p className="text-xs sm:text-sm text-white/90 font-marathi-body">
                रक्तदाब व शरीरातील <strong>कोलेस्टेरॉल नियंत्रणात</strong> राहण्यास खूप मदत होते.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#03131C] border border-white/10 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24] shrink-0 mt-2" />
              <p className="text-xs sm:text-sm text-white/90 font-marathi-body">
                <strong>सांधेदुखी व संधिवातावर</strong> माशांचे तेल (Fish Oil) अत्यंत उपयुक्त ठरते.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#03131C] border border-white/10 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-2" />
              <p className="text-xs sm:text-sm text-white/90 font-marathi-body">
                लहान मुलांच्या <strong>मेंदूचा विकास चांगला</strong> होतो व स्मरणशक्ती वाढते.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#03131C] border border-white/10 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-2" />
              <p className="text-xs sm:text-sm text-white/90 font-marathi-body">
                त्वचा व केसांशी संबंधित समस्यांवर <strong>रावस व सुरमई</strong> माशांचा मोठा फायदा होतो.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#03131C] border border-white/10 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
              <p className="text-xs sm:text-sm text-white/90 font-marathi-body">
                माशांतील <strong>व्हिटॅमिन &apos;अ&apos; मुळे डोळ्यांचे आरोग्य</strong> व दृष्टी तेज सुधारते.
              </p>
            </div>
          </div>
        </div>

        {/* 07. INTERACTIVE INSTANT ORDER CALCULATOR */}
        <div className="mb-14">
          <BranchOrderCalculator branch={branch} locale={locale} />
        </div>

        {/* 08. CUSTOMER REVIEWS FOR THIS STORE REGION */}
        <div className="mb-14 rounded-3xl bg-[#051724] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#FBBF24] uppercase">
                {isMarathi ? "खवय्यांचे प्रेम" : "Customer Love"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-marathi-display text-white mt-0.5">
                {isMarathi
                  ? `या दालनाविषयी ग्राहकांचे मत (${branch.villageNameMr || branch.nameMr})`
                  : `Customer Reviews for ${branch.nameEn}`}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[#FBBF24]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-white ml-1">४.९ / ५</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#03111A] border border-white/10">
              <div className="flex items-center gap-1 text-[#FBBF24] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/80 font-marathi-body leading-relaxed">
                &ldquo;मी गेली २ वर्षे AN Fish कडूनच सुरमई आणि कोळंबी घेतो. नेहमी सकाळी ताजी आवक असते आणि कटिंग एकदम चोख करतात. घरात मासे खाण्याचा खरा आनंद मिळतो!&rdquo;
              </p>
              <div className="mt-3 pt-2 border-t border-white/10 text-[0.68rem] text-[#6EC6F0] font-bold">
                — संग्राम पाटील (नियमित ग्राहक)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#03111A] border border-white/10">
              <div className="flex items-center gap-1 text-[#FBBF24] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/80 font-marathi-body leading-relaxed">
                &ldquo;बाजारातील इतर दुकानांसारखी घाण वास येत नाही. काऊंटर एकदम स्वच्छ, एसी आणि आरओ पाण्याने धुऊन देतात. व्हॉट्सॲपवर ऑर्डर दिली की ३० मिनिटांत घरपोच मिळते!&rdquo;
              </p>
              <div className="mt-3 pt-2 border-t border-white/10 text-[0.68rem] text-[#6EC6F0] font-bold">
                — सौ. अनिता जाधव (स्थानिक गृहिणी)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#03111A] border border-white/10">
              <div className="flex items-center gap-1 text-[#FBBF24] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-white/80 font-marathi-body leading-relaxed">
                &ldquo;AN Fish चा स्पेशल फ्राय मसाला आणि पापलेट तवा फ्राय अप्रतिम जमते. अस्सल कोकणी चव मिळते. हॉटेलपेक्षाही घरी जेवण भारी होते.&rdquo;
              </p>
              <div className="mt-3 pt-2 border-t border-white/10 text-[0.68rem] text-[#6EC6F0] font-bold">
                — डॉ. राहुल माने (खवय्ये)
              </div>
            </div>
          </div>
        </div>

        {/* 09. EXPLORE OTHER OUTLETS ACROSS MAHARASHTRA */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-marathi-display text-white">
                {isMarathi ? "महाराष्ट्रातील इतर अधिकृत दालने" : "Other Outlets Across Maharashtra"}
              </h3>
              <p className="text-xs text-white/60 font-marathi-body">
                {isMarathi ? "सर्व २५ दालनांमध्ये थेट पहाटेची आवक उपलब्ध आहे." : "Direct morning catch across all 25 outlets."}
              </p>
            </div>
            <Link
              href={`/${locale}#franchise-map`}
              className="text-xs font-bold text-[#FBBF24] hover:underline font-marathi-display"
            >
              {isMarathi ? "३डी नकाशावर सर्व २५ दालने पहा →" : "View All on 3D Map →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRANCHES_LIST.filter((b) => b.slug !== branch.slug).slice(0, 4).map((other) => (
              <Link
                key={other.id}
                href={`/${locale}/branches/${other.slug}`}
                className="p-4 rounded-2xl bg-[#081F2C] hover:bg-[#0C2A3C] border border-white/10 hover:border-[#38BDF8]/40 transition-all block group"
              >
                <span className="text-[0.68rem] text-[#FBBF24] font-bold block mb-1">
                  {other.type === "hq" ? "👑 मुख्य दालन" : other.type === "port" ? "⚓ बंदर केंद्र" : "📍 अधिकृत दालन"}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors font-marathi-display">
                  {isMarathi ? other.nameMr : other.nameEn}
                </h4>
                <p className="text-xs text-white/60 truncate mt-1">
                  {isMarathi ? other.addressMr : other.addressEn}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
