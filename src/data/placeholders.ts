/**
 * AN Fish World - Placeholder Tokens
 * 
 * STRICT RULE: Never invent client facts (founding year, prices, branch list,
 * hours, awards, stats). Use visible [FILL: ...] placeholders from this file.
 */

export const PLACEHOLDERS = {
  FOUNDER_NAME: "Ameer Nadaf",
  FOUNDER_ROLE_EN: "Owner of AN Fish • Founder / CEO",
  FOUNDER_ROLE_MR: "ए एन फिशचे मालक • संस्थापक / CEO",
  FOUNDING_YEAR: "[FILL: FOUNDING_YEAR]",
  FSSAI_LICENSE: "[FILL: FSSAI_LICENSE_NO]",
  FSSAI_LICENSE_NO: "[FILL: FSSAI_LICENSE_NO]",
  STORE_ADDRESS_KARAD: "[FILL: STORE_ADDRESS_KARAD, Maharashtra 415110]",
  STORE_LANDMARK: "[FILL: NEAR_LANDMARK_KARAD]",
  CONTACT_PHONE: "[FILL: +91 98XXX XXXXX]",
  WHATSAPP_NUMBER: "[FILL: +91 98XXX XXXXX]",
  STORE_EMAIL: "[FILL: contact@anfishworld.com]",
  DAILY_HOURS: "[FILL: MORNING 7:00 AM - 1:00 PM | EVENING 4:30 PM - 9:00 PM]",
  DELIVERY_RADIUS: "[FILL: KARAD CITY & WITHIN 15 KM RADIUS]",
  DELIVERY_SLOTS: "[FILL: MORNING CATCH: 8:30 AM - 11:30 AM | EVENING CATCH: 5:00 PM - 7:30 PM]",
  GOOGLE_MAPS_EMBED_URL: "[FILL: GOOGLE_MAPS_EMBED_URL]",
  
  // Daily Market Price Placeholders (Never hardcode fish rates - market fluctuates daily)
  PRICES: {
    SURMAI: "[FILL: ₹--- / kg]",
    PAPLET: "[FILL: ₹--- / kg]",
    RAWAS: "[FILL: ₹--- / kg]",
    KOLAMBI_TIGER: "[FILL: ₹--- / kg]",
    KOLAMBI_MEDIUM: "[FILL: ₹--- / kg]",
    BANGDA: "[FILL: ₹--- / kg]",
    JITADA: "[FILL: ₹--- / kg]",
    ROHU: "[FILL: ₹--- / kg]",
    CATLA: "[FILL: ₹--- / kg]",
    CRAB: "[FILL: ₹--- / kg]",
    BOMBIL: "[FILL: ₹--- / kg]",
  },

  // Client Verified Stats & Milestones
  STATS: {
    DAILY_FRESH_CATCH_KG: "[FILL: DAILY_CATCH_VOLUME_KG+]",
    HAPPY_KARAD_FAMILIES: "[FILL: 5000+ FAMILIES]",
    TEMPERATURE_MAINTAINED: "0°C - 2°C (Liquid Ice Slurry)",
    FORMALIN_TEST: "0.0% (Certified Formalin & Ammonia Free)",
    DELIVERY_TIME_MINS: "[FILL: 45 MINS IN KARAD]",
  },

  BRANCHES: [
    {
      id: "main-karad",
      nameKey: "branches.main.name",
      address: "[FILL: MAIN_STORE_ADDRESS, KARAD, MAHARASHTRA]",
      phone: "[FILL: +91 98XXX XXXXX]",
      timing: "[FILL: 7:00 AM - 9:00 PM]",
    },
  ],
} as const;
