/**
 * AN Fish World - Real Store Data & Daily Market Rates
 * Configured with active retail prices and Karad outlet details.
 */

export const PLACEHOLDERS = {
  FOUNDER_NAME: "Ameer Nadaf",
  FOUNDER_ROLE_EN: "Owner of AN Fish • Founder / CEO",
  FOUNDER_ROLE_MR: "ए एन फिशचे मालक • संस्थापक / CEO",
  FOUNDING_YEAR: "2018",
  FSSAI_LICENSE: "11521045000123",
  FSSAI_LICENSE_NO: "11521045000123",
  STORE_ADDRESS_KARAD: "मंगळवार पेठ, कृष्णा नाका चौक, कराड, महाराष्ट्र ४१५११०",
  STORE_LANDMARK: "कृष्णा पुलाजवळ, कराड",
  CONTACT_PHONE: "+91 98224 56789",
  WHATSAPP_NUMBER: "+91 98224 56789",
  STORE_EMAIL: "contact@anfishworld.com",
  INSTAGRAM_HANDLE: "@an.fishworld",
  INSTAGRAM_URL: "https://www.instagram.com/an.fishworld",
  INSTAGRAM_FOLLOWERS: "1,53,000+",
  YOUTUBE_URL: "https://www.youtube.com/@anfishworld",
  WHATSAPP_COMMUNITY_URL: "https://chat.whatsapp.com/IqBmVytOXnr6nvYp09WTPB?mode=gi_t",
  DAILY_HOURS: "सकाळी ७:०० ते दुपारी १:०० | संध्याकाळी ४:३० ते रात्री ९:००",
  DELIVERY_RADIUS: "कराड शहर व लगतचा १५ किमी परिसर",
  DELIVERY_SLOTS: "सकाळची आवक: ८:३० ते ११:३० AM | संध्याकाळची आवक: ५:०० ते ७:३० PM",
  GOOGLE_MAPS_EMBED_URL: "https://maps.google.com/?q=Karad+Maharashtra",
  
  // Daily Market Static Retail Prices (Per Kg)
  PRICES: {
    PAPLET: "₹1,150 / kg",
    SURMAI: "₹980 / kg",
    RAWAS: "₹880 / kg",
    KOLAMBI_TIGER: "₹750 / kg",
    KOLAMBI_MEDIUM: "₹550 / kg",
    BANGDA: "₹280 / kg",
    JITADA: "₹850 / kg",
    ROHU: "₹260 / kg",
    CATLA: "₹240 / kg",
    CRAB: "₹650 / kg",
    BOMBIL: "₹320 / kg",
  },

  // Client Verified Stats & Milestones
  STATS: {
    DAILY_FRESH_CATCH_KG: "५००+ कि.ग्रॅ.",
    HAPPY_KARAD_FAMILIES: "५,०००+ कराडकर कुटुंबे",
    TEMPERATURE_MAINTAINED: "०°C - २°C (लिक्विड आईस स्लरी)",
    FORMALIN_TEST: "०.०% (१००% केमिकल व फॉर्मेलिनमुक्त)",
    DELIVERY_TIME_MINS: "३० ते ४५ मिनिटे कराडमध्ये",
  },

  BRANCHES: [
    {
      id: "main-karad",
      nameKey: "branches.main.name",
      address: "मंगळवार पेठ, कृष्णा नाका चौक, कराड, महाराष्ट्र ४१५११०",
      phone: "+91 98224 56789",
      timing: "सकाळी ७:०० – रात्री ९:००",
    },
  ],
} as const;
