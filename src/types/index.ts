export type Locale = "mr" | "en";

export type DepthZone = "surface" | "shallows" | "twilight" | "abyss" | "vault";

export type FishCategory = "sea" | "river" | "shellfish";

export type BestForCooking = "fry" | "curry" | "grill";

export type CleaningOption = "whole" | "cleaned" | "curry-cut" | "fillet";

export type CutType = "curry" | "fry" | "wholeCleaned" | "fillet" | "boneless";

export interface Species {
  slug: string;
  nameMr: string;
  nameEn: string;
  category: FishCategory;
  image: string; // transparent cutout
  tasteNote: string;
  bestFor: BestForCooking[];
  pricePerKg: string; // [FILL: ₹--- / kg]
  available: boolean;
  cleaningOptions: CleaningOption[];

  // Optional fields for compatibility
  nameKey?: string;
  marathiName?: string;
  scientificName?: string;
  depthMeters?: number;
  marketPrice?: string;
  minWeight?: string;
  badgeKey?: string;
  cuts?: CutType[];
  tasteNotesKey?: string;
  culinaryUseKey?: string;
  omegaRating?: 1 | 2 | 3 | 4 | 5;
  freshnessGuaranteeHours?: number;
}

export interface Branch {
  id: string;
  slug: string;
  nameMr: string;
  nameEn: string;
  addressMr: string;
  addressEn: string;
  phone: string;
  hoursMr: string;
  hoursEn: string;
  landmarkMr: string;
  landmarkEn: string;
  googleMapsUrl: string;
}

export interface FAQItem {
  id: string;
  questionMr: string;
  questionEn: string;
  answerMr: string;
  answerEn: string;
}

export interface BasketItem {
  species: Species;
  weight: string; // "0.5 kg" | "1 kg" | "2 kg" | custom
  cleaningOption?: CleaningOption;
  quantity: number;
  cut?: CutType;
}
