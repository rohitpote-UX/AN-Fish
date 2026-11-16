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
  Navigation,
  ChevronRight,
  ArrowRight,
  Scissors,
  Waves,
  Truck,
  Flame,
  Heart,
  Anchor,
  Crown,
  Store,
  PackageCheck,
  CreditCard,
  Droplets,
  Check,
  ShieldCheck,
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
  const isHindi = locale === "hi";
  return {
    title: `${isMarathi || isHindi ? branch.nameMr : branch.nameEn} | AN Fish World`,
    description: isMarathi || isHindi ? branch.taglineMr : branch.taglineEn,
  };
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as "mr" | "en" | "hi")) notFound();
  setRequestLocale(locale);

  const branch = BRANCHES_LIST.find((b) => b.slug === slug);
  if (!branch) notFound();

  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

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
      : isHindi
      ? `नमस्ते AN Fish World (${branch.nameMr}), मुझे आज की ताज़ा आवक से ऑर्डर करना है। कृपया उपलब्ध स्टॉक बताएं।`
      : `Hello AN Fish World (${branch.nameEn}), I would like to place an order from today's fresh catch.`
  );

  const t = (mr: string, en: string, hi?: string) => (isMarathi ? mr : isHindi ? hi ?? mr : en);
  const isMr = isMarathi || isHindi;
  const name = isMr ? branch.nameMr : branch.nameEn;
  const digits = branch.phone.replace(/[^0-9]/g, "");
  const telHref = `tel:${branch.phone.replace(/[^0-9+]/g, "")}`;

  const kind =
    branch.type === "hq"
      ? { Icon: Crown, label: t("मुख्य केंद्र व दालन", "Headquarters & Flagship", "मुख्य केंद्र व शाखा") }
      : branch.type === "port"
      ? { Icon: Anchor, label: t("सागरी बंदर आवक केंद्र", "Sea Port Intake Centre", "समुद्री बंदरगाह आवक केंद्र") }
      : { Icon: Store, label: t("अधिकृत दालन", "Authorized Store", "अधिकृत शाखा") };

  const facilities = [
    { icon: Waves, title: t("०°C नैसर्गिक गारवा", "0°C Natural Chill", "०°C प्राकृतिक ठंडक"), sub: t("१००% केमिकलमुक्त", "100% chemical-free", "१००% केमिकल मुक्त") },
    { icon: Droplets, title: t("आरओ पाण्याने धुलाई", "RO Water Wash", "आरओ पानी से धुलाई"), sub: t("पिण्याच्या शुद्ध पाण्याने स्वच्छता", "Cleaned with pure drinking water", "शुद्ध पीने के पानी से सफाई") },
    { icon: Scissors, title: t("मोफत चोख कटिंग", "Free Custom Cutting", "मुफ्त चोख कटिंग"), sub: t("तवा फ्राय, कालवण, बोनलेस", "Tawa fry, curry, boneless", "तवा फ्राई, करी, बोनलेस") },
    { icon: Truck, title: t("३० मिनिटांत घरपोच", "30-Minute Delivery", "३० मिनट में घरपहुंच"), sub: t("स्थानिक एक्सप्रेस डिलिव्हरी", "Local express delivery", "स्थानीय एक्सप्रेस डिलीवरी") },
    { icon: PackageCheck, title: t("गंधहीन पॅकिंग", "Odour-free Packing", "गंधरहित पैकिंग"), sub: t("फूड-ग्रेड पेपर व व्हॅक्यूम", "Food-grade paper & vacuum", "फूड-ग्रेड पेपर व वैक्यूम") },
    { icon: CreditCard, title: t("डिजिटल पेमेंट", "Digital Payments", "डिजिटल पेमेंट"), sub: t("UPI, Cards व Cash", "UPI, cards & cash", "UPI, कार्ड व कैश") },
  ];

  const steps = [
    {
      time: t("पहाटे ४:००", "4:00 AM", "सुबह ४:००"),
      icon: Anchor,
      title: t("थेट बंदरावर निवड", "Portside Auction Selection", "सीधे बंदरगाह पर चयन"),
      desc: t(
        "रत्नागिरी मिरकरवाडा व मालवण जेटीवर पहिल्या लिलावातून ए-ग्रेड माशांची थेट निवड.",
        "Direct selection of A-grade catch from the first dawn auctions at Mirkarwada and Malvan jetties.",
        "रत्नागिरी मिरकरवाडा व मालवण जेटी पर पहले ऑक्शन से ए-ग्रेड मछली का सीधा चयन।"
      ),
    },
    {
      time: t("पहाटे ५:३०", "5:30 AM", "सुबह ५:३०"),
      icon: Waves,
      title: t("०°C आईस एक्सप्रेस प्रवास", "0°C Chilled Transit", "०°C चिल्ड एक्सप्रेस सफर"),
      desc: t(
        "लिक्विड आईस स्लरी असलेल्या इन्सुलेटेड वाहनातून तातडीने या दालनाकडे प्रस्थान.",
        "Rapid transit in insulated fleet with liquid ice slurry keeping temperature strictly at 0°C.",
        "लिक्विड आइस स्लरी वाले इंसुलेटेड वाहन से तुरंत इस शाखा की ओर प्रस्थान।"
      ),
    },
    {
      time: t("सकाळी ६:००", "6:00 AM", "सुबह ६:००"),
      icon: Droplets,
      title: t("आरओ पाण्याने स्वच्छता", "RO Pure Wash & Ice-Bed", "आरओ पानी से सफाई"),
      desc: t(
        "दालनात आगमन होताच पिण्याच्या शुद्ध पाण्याने धुलाई, ग्रेडिंग व आईस-बेडवर मांडणी.",
        "Arrival, RO water rinsing, strict grading, and display on food-grade crushed ice beds.",
        "शाखा में आगमन होते ही शुद्ध आरओ पानी से धुलाई, ग्रेडिंग और आइस-बेड पर प्रदर्शन।"
      ),
    },
    {
      time: t("सकाळी ७:०० पुढे", "7:00 AM onward", "सुबह ७:०० से आगे"),
      icon: Truck,
      title: t("थेट विक्री व घरपोच", "Retail Butchering & Delivery", "सीधी बिक्री व होम डिलीवरी"),
      desc: t(
        "ग्राहकांना आवडीनुसार मोफत चोख कटिंग आणि ३० मिनिटांत घरपोच सुरक्षित डिलिव्हरी.",
        "Precision custom butchering at zero extra cost and 30-minute delivery to doorsteps.",
        "ग्राहकों को पसंद अनुसार मुफ्त चोख कटिंग और ३० मिनट में सुरक्षित होम डिलीवरी।"
      ),
    },
  ];

  const healthPoints = [
    t("मासे खाल्ल्याने शरीरास लोह, जस्त आणि आयोडीन सारखी अत्यंत आवश्यक खनिजे मिळतात.", "Fish provides essential minerals such as iron, zinc and iodine.", "मछली खाने से शरीर को आयरन, ज़िंक और आयोडीन जैसे आवश्यक खनिज मिलते हैं।"),
    t("रक्तदाब व शरीरातील कोलेस्टेरॉल नियंत्रणात राहण्यास खूप मदत होते.", "Helps keep blood pressure and cholesterol in check.", "रक्तचाप व कोलेस्ट्रॉल नियंत्रण में रखने में बहुत मदद मिलती है।"),
    t("सांधेदुखी व संधिवातावर माशांचे तेल (Fish Oil) अत्यंत उपयुक्त ठरते.", "Fish oil is useful for joint pain and arthritis.", "जोड़ों के दर्द व गठिया में मछली का तेल (Fish Oil) बहुत उपयोगी है।"),
    t("लहान मुलांच्या मेंदूचा विकास चांगला होतो व स्मरणशक्ती वाढते.", "Supports children's brain development and memory.", "बच्चों के मस्तिष्क का विकास अच्छा होता है व याददाश्त बढ़ती है।"),
    t("त्वचा व केसांशी संबंधित समस्यांवर रावस व सुरमई माशांचा मोठा फायदा होतो.", "Rawas and surmai are beneficial for skin and hair health.", "त्वचा व बालों की समस्याओं में रावस व सुरमई मछली का बड़ा फायदा होता है।"),
    t("माशांतील व्हिटॅमिन 'अ' मुळे डोळ्यांचे आरोग्य व दृष्टी तेज सुधारते.", "Vitamin A in fish improves eye health and vision.", "मछली में मौजूद विटामिन 'ए' से आंखों की सेहत व नज़र सुधरती है।"),
  ];

  const imgFor = (src: string) => (/(pomfret|surmai|prawns|rawas)-free\.webp$/.test(src) ? src.replace("-free.webp", "-large.webp") : src);
  const otherBranches = BRANCHES_LIST.filter((b) => b.slug !== branch.slug).slice(0, 4);

  const waBranchLink = `https://wa.me/${digits}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#071C2C]">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071C2C] via-[#0A2638] to-[#0B3A4F] pb-28 pt-32 text-white sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#0A9AD9]/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-0 size-96 rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            <Link href={`/${locale}`} className="transition-colors hover:text-white">
              {t("मुख्यपृष्ठ", "Home", "होम")}
            </Link>
            <ChevronRight className="size-4 text-white/35" />
            <Link href={`/${locale}#franchise-map`} className="transition-colors hover:text-white">
              {t("आमची दालने", "Our Locations", "हमारी शाखाएं")}
            </Link>
            <ChevronRight className="size-4 text-white/35" />
            <span className="font-semibold text-white" aria-current="page">
              {branch.villageNameMr && isMr ? branch.villageNameMr : name}
            </span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* left: identity + details */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-3.5 py-1.5 text-xs font-bold text-[#071C2C]">
                  <kind.Icon className="size-3.5" />
                  {kind.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                  {t("आज चालू आहे", "Open today", "आज खुला है")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80">
                  <ShieldCheck className="size-3.5 text-[#38BDF8]" />
                  FSSAI {PLACEHOLDERS.FSSAI_LICENSE_NO}
                </span>
              </div>

              <h1 className="mt-5 font-marathi-display text-[clamp(2rem,4.4vw,3.6rem)] font-extrabold leading-[1.12] tracking-tight">
                {name}
              </h1>
              <p className="mt-4 max-w-2xl font-marathi-body text-lg leading-relaxed text-[#7DD3FC]">
                {isMr ? branch.taglineMr : branch.taglineEn}
              </p>

              {/* key details: clean rows, no boxes */}
              <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {[
                  { icon: MapPin, label: t("पत्ता", "Address", "पता"), value: isMr ? branch.addressMr : branch.addressEn },
                  { icon: Clock, label: t("दालनाची वेळ", "Store timings", "शाखा समय"), value: isMr ? branch.hoursMr : branch.hoursEn },
                  {
                    icon: Truck,
                    label: t("डिलिव्हरी", "Delivery", "डिलीवरी"),
                    value: t("१५ किमी परिसरात ३० मिनिटांत जलद घरपोच सेवा", "Fast delivery within a 15 km radius", "१५ किमी क्षेत्र में ३० मिनट में त्वरित होम डिलीवरी"),
                  },
                  { icon: Phone, label: t("फोन", "Phone", "फ़ोन"), value: branch.phone },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#7DD3FC] ring-1 ring-white/10">
                      <Icon className="size-[1.15rem]" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[0.72rem] font-semibold text-white/50">{label}</dt>
                      <dd className="mt-0.5 font-marathi-body text-[0.95rem] font-medium leading-snug text-white">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {/* actions */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={waBranchLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 font-marathi-display text-[0.95rem] font-bold text-[#052E16] shadow-[0_14px_30px_-12px_rgba(37,211,102,0.7)] transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  <MessageCircle className="size-[1.1rem] fill-current" />
                  {t("व्हॉट्सॲपवर ऑर्डर द्या", "Order on WhatsApp", "व्हाट्सएप पर ऑर्डर करें")}
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 font-marathi-display text-[0.95rem] font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <Phone className="size-[1.1rem] text-[#7DD3FC]" />
                  {t("कॉल करा", "Call", "कॉल करें")}
                </a>
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 font-marathi-display text-[0.95rem] font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <Navigation className="size-[1.1rem] text-[#7DD3FC]" />
                  {t("दिशा (Google Maps)", "Directions", "दिशा (Google Maps)")}
                </a>
              </div>
            </div>

            {/* right: photo */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] border border-white/10" />
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
                <Image
                  src={branch.image || "/media/gallery/karad-outlet-tour.webp"}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#071C2C]/70 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-2xl border border-white/15 bg-[#071C2C]/80 p-3.5 backdrop-blur-md">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#F59E0B]" />
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold text-white/55">{t("खूण (Landmark)", "Landmark", "पहचान (Landmark)")}</p>
                    <p className="font-marathi-body text-sm font-medium leading-snug text-white">{isMr ? branch.landmarkMr : branch.landmarkEn}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-12">
        {/* ====================== FACILITIES STRIP (overlaps hero) ====================== */}
        <section aria-label={t("सुविधा", "Facilities", "सुविधाएं")} className="-mt-16 rounded-3xl bg-white p-5 shadow-[0_24px_60px_-24px_rgba(7,28,44,0.35)] ring-1 ring-[#071C2C]/8 sm:p-7">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
            {facilities.map(({ icon: Icon, title, sub }) => (
              <li key={title} className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="grid size-11 place-items-center rounded-xl bg-[#0A9AD9]/10 text-[#0A9AD9]">
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 font-marathi-display text-[0.95rem] font-bold leading-snug">{title}</p>
                <p className="mt-0.5 font-marathi-body text-[0.78rem] leading-snug text-[#071C2C]/60">{sub}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ============================ LIVE STOCK ============================ */}
        <section className="mt-16 lg:mt-20" aria-labelledby="stock-title">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`flex items-center gap-2 text-xs font-bold uppercase text-[#0A9AD9] ${isMr ? "" : "tracking-[0.18em]"}`}>
                <span className="h-px w-7 bg-[#0A9AD9]" />
                {t("थेट या दालनातील आजची ताजी मासोळी", "Fresh today at this store", "आज इस शाखा की ताज़ा मछली")}
              </p>
              <h2 id="stock-title" className="mt-3 font-marathi-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {t("आजचा उपलब्ध ताजी मासोळी साठा", "Today's Available Fresh Catch", "आज उपलब्ध ताज़ा मछली स्टॉक")}
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#071C2C]/80 ring-1 ring-[#071C2C]/10 sm:self-auto">
              <ShieldCheck className="size-4 text-emerald-600" />
              {t("१००% शुद्ध आरओ पाण्याने स्वच्छता · मोफत कटिंग", "RO-water cleaned · free custom cutting", "१००% शुद्ध आरओ पानी से सफाई · मुफ्त कटिंग")}
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stockItems.map((fish, i) => {
              const cuts = (isMr ? fish.cutsMr : fish.cutsEn).split("•").map((c) => c.trim()).filter(Boolean);
              return (
                <li
                  key={fish.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-[#071C2C]/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-24px_rgba(7,28,44,0.4)] hover:ring-[#0A9AD9]/40"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                    <Image
                      src={imgFor(fish.image)}
                      alt={isMr ? fish.nameMr : fish.nameEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={i < 4}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-[#071C2C]/90 px-3 py-1 text-[0.7rem] font-bold text-[#F59E0B] backdrop-blur">
                      {isMr ? fish.badgeMr : fish.badgeEn}
                    </span>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700 shadow">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      {t("ताजी आवक", "Fresh arrival", "ताज़ा आवक")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="font-marathi-display text-lg font-bold leading-snug">{isMr ? fish.nameMr : fish.nameEn}</h3>
                    <p className="line-clamp-3 font-marathi-body text-[0.84rem] leading-relaxed text-[#071C2C]/65">{isMr ? fish.descMr : fish.descEn}</p>

                    <div className="mt-auto space-y-2.5">
                      <ul className="flex flex-wrap gap-1.5">
                        {cuts.map((c) => (
                          <li key={c} className="rounded-full bg-[#0A9AD9]/8 px-2.5 py-1 font-marathi-body text-[0.7rem] font-medium leading-none text-[#0A6E9C] ring-1 ring-[#0A9AD9]/15">
                            {c}
                          </li>
                        ))}
                      </ul>
                      <p className="flex items-start gap-1.5 font-marathi-body text-[0.76rem] leading-snug text-[#071C2C]/55">
                        <Flame className="mt-0.5 size-3.5 shrink-0 text-[#F59E0B]" />
                        {isMr ? fish.bestCookingMr : fish.bestCookingEn}
                      </p>
                    </div>

                    <div className="mt-1 flex items-end justify-between gap-3 border-t border-[#071C2C]/10 pt-4">
                      <div>
                        <span className="block text-[0.68rem] font-semibold text-[#071C2C]/45">{t("दैनिक बाजार दर", "Daily rate", "दैनिक बाज़ार दर")}</span>
                        <span className="text-xl font-extrabold tabular-nums text-[#071C2C]">{fish.rate}</span>
                      </div>
                      <a
                        href={`https://wa.me/${digits}?text=${encodeURIComponent(
                          isMarathi
                            ? `नमस्कार AN Fish World (${branch.nameMr}), मला आजच्या ताजी आवकमधून "${fish.nameMr}" ऑर्डर करायची आहे.`
                            : isHindi
                            ? `नमस्ते AN Fish World (${branch.nameMr}), मुझे आज की ताज़ा आवक से "${fish.nameMr}" ऑर्डर करना है।`
                            : `Hello AN Fish World (${branch.nameEn}), I want to order "${fish.nameEn}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Order ${fish.nameEn} on WhatsApp`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-marathi-display text-sm font-bold text-[#052E16] transition-all hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                      >
                        <MessageCircle className="size-4 fill-current" />
                        {t("मागवा", "Order", "मंगवाएं")}
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ============================ ORDER CALCULATOR ============================ */}
        <section className="mt-16 lg:mt-20">
          <BranchOrderCalculator branch={branch} locale={locale} />
        </section>

        {/* ============================ FRESHNESS PROCESS ============================ */}
        <section className="mt-16 rounded-3xl bg-[#071C2C] p-7 text-white sm:p-12 lg:mt-20" aria-labelledby="process-title">
          <div className="mx-auto max-w-3xl text-center">
            <p className={`text-xs font-bold uppercase text-[#F59E0B] ${isMr ? "" : "tracking-[0.2em]"}`}>
              {t("ताजेपणाचा दैनंदिन प्रवास", "The daily freshness journey", "ताज़गी का दैनिक सफर")}
            </p>
            <h2 id="process-title" className="mt-3 font-marathi-display text-2xl font-bold leading-snug sm:text-3xl">
              {t("पहाटे ४:०० ते आपल्या ताटापर्यंत", "From 4:00 AM to your plate", "सुबह ४:०० से आपकी थाली तक")}
            </h2>
          </div>

          <div className="relative mt-12">
            <div aria-hidden="true" className="absolute left-6 right-6 top-6 hidden h-px bg-white/15 lg:block" />
            <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <li key={st.title} className="relative flex gap-5 lg:block">
                    {idx < steps.length - 1 && (
                      <span aria-hidden="true" className="absolute left-6 top-14 -bottom-10 w-px -translate-x-1/2 bg-white/15 lg:hidden" />
                    )}
                    <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-[#0D2A3E] lg:mb-6">
                      <Icon className="size-5 text-[#7DD3FC]" />
                    </span>
                    <div>
                      <p className="mb-1.5 flex items-center gap-2 text-[0.72rem] font-semibold text-[#F59E0B]">
                        <Clock className="size-3.5" />
                        {st.time}
                      </p>
                      <h3 className="font-marathi-display text-lg font-semibold leading-snug">{st.title}</h3>
                      <p className="mt-2 font-marathi-body text-[0.85rem] leading-relaxed text-white/65">{st.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ============================ SPICES ============================ */}
        <section className="mt-16 lg:mt-20" aria-labelledby="spice-title">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`flex items-center gap-2 text-xs font-bold uppercase text-[#B45309] ${isMr ? "" : "tracking-[0.18em]"}`}>
                <span className="h-px w-7 bg-[#B45309]" />
                {t("दालनात खरेदीसाठी उपलब्ध", "Available in store", "स्टोर में उपलब्ध")}
              </p>
              <h2 id="spice-title" className="mt-3 font-marathi-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {t("ए एन फिश स्पेशल मसाले", "AN Fish Special Masalas", "ए एन फिश स्पेशल मसाले")}
              </h2>
            </div>
            <p className="font-marathi-body text-sm text-[#071C2C]/60">{t("माशांसोबत घरपोच उपलब्ध", "Delivered along with your fish", "मछली के साथ घरपहुंच उपलब्ध")}</p>
          </div>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {masalaItems.map((m) => (
              <li key={m.id} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-[#071C2C]/10 transition-all hover:-translate-y-1 hover:ring-[#F59E0B]/50 hover:shadow-[0_22px_44px_-24px_rgba(7,28,44,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#F59E0B]/15 px-3 py-1 text-xs font-bold text-[#92400E]">{m.weight}</span>
                  <span className="text-xl font-extrabold tabular-nums">{m.price}</span>
                </div>
                <h3 className="mt-4 font-marathi-display text-lg font-bold leading-snug">{isMr ? m.nameMr : m.nameEn}</h3>
                <p className="mt-2 flex-1 font-marathi-body text-[0.85rem] leading-relaxed text-[#071C2C]/65">{isMr ? m.descMr : m.descEn}</p>
                <a
                  href={`https://wa.me/${digits}?text=${encodeURIComponent(
                    isMarathi
                      ? `नमस्कार AN Fish World (${branch.nameMr}), मला "${m.nameMr}" (${m.weight}) हवा आहे.`
                      : isHindi
                      ? `नमस्ते AN Fish World (${branch.nameMr}), मुझे "${m.nameMr}" (${m.weight}) चाहिए।`
                      : `Hello AN Fish World (${branch.nameEn}), I would like to order "${m.nameEn}" (${m.weight}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#071C2C]/15 px-4 py-2.5 font-marathi-display text-sm font-bold text-[#071C2C] transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#052E16]"
                >
                  <MessageCircle className="size-4" />
                  {t("मसाला ऑर्डर करा", "Order masala", "मसाला ऑर्डर करें")}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ============================ HEALTH ============================ */}
        <section className="mt-16 rounded-3xl bg-white p-7 ring-1 ring-[#071C2C]/10 sm:p-10 lg:mt-20" aria-labelledby="health-title">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <span className="grid size-12 place-items-center rounded-xl bg-rose-50 text-rose-500">
                <Heart className="size-6 fill-current" />
              </span>
              <h2 id="health-title" className="mt-5 font-marathi-display text-2xl font-extrabold leading-snug sm:text-3xl">
                {t("मासे खाण्याचे आरोग्यदायी फायदे", "Health benefits of eating fish", "मछली खाने के स्वास्थ्यवर्धक फायदे")}
              </h2>
              <p className="mt-3 font-marathi-body text-sm leading-relaxed text-[#071C2C]/60">
                {t("आमच्या कराड मुख्य केंद्रातील दर्शनी फलकावरील आरोग्याची महत्त्वाची सूत्रे.", "Key health points from the guidance board at our Karad flagship store.", "हमारे कराड मुख्य केंद्र के बोर्ड पर बताए गए स्वास्थ्य के महत्वपूर्ण सूत्र।")}
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {healthPoints.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-marathi-body text-[0.9rem] leading-relaxed text-[#071C2C]/80">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================ OTHER OUTLETS ============================ */}
        <section className="mt-16 lg:mt-20" aria-labelledby="others-title">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="others-title" className="font-marathi-display text-2xl font-extrabold leading-snug sm:text-3xl">
                {t("महाराष्ट्रातील इतर अधिकृत दालने", "Other outlets across Maharashtra", "महाराष्ट्र की अन्य अधिकृत शाखाएं")}
              </h2>
              <p className="mt-1 font-marathi-body text-sm text-[#071C2C]/60">
                {t("सर्व २५ दालनांमध्ये थेट पहाटेची आवक उपलब्ध आहे.", "Direct morning catch across all 25 outlets.", "सभी २५ शाखाओं में सीधी सुबह की आवक उपलब्ध है।")}
              </p>
            </div>
            <Link href={`/${locale}#franchise-map`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0A9AD9] transition-colors hover:text-[#071C2C]">
              {t("नकाशावर सर्व २५ दालने पहा", "View all 25 on the map", "नक्शे पर सभी २५ शाखाएं देखें")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherBranches.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/${locale}/branches/${o.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-[#071C2C]/10 transition-all hover:-translate-y-1 hover:ring-[#0A9AD9]/50 hover:shadow-[0_20px_40px_-24px_rgba(7,28,44,0.35)]"
                >
                  <span className="text-[0.72rem] font-bold text-[#0A9AD9]">
                    {o.type === "hq" ? t("मुख्य दालन", "Flagship", "मुख्य शाखा") : o.type === "port" ? t("बंदर केंद्र", "Port intake", "बंदरगाह केंद्र") : t("अधिकृत दालन", "Authorized store", "अधिकृत शाखा")}
                  </span>
                  <h3 className="mt-1.5 font-marathi-display text-base font-bold leading-snug transition-colors group-hover:text-[#0A9AD9]">
                    {isMr ? o.nameMr : o.nameEn}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 font-marathi-body text-[0.8rem] leading-relaxed text-[#071C2C]/60">{isMr ? o.addressMr : o.addressEn}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#071C2C]/70 transition-colors group-hover:text-[#0A9AD9]">
                    {t("दालन पहा", "View store", "शाखा देखें")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
