import { Branch } from "@/types";
import { PLACEHOLDERS } from "./placeholders";

export const BRANCHES_LIST: Branch[] = [
  {
    id: "karad-flagship",
    slug: "karad-flagship",
    nameMr: "ए एन फिश वर्ल्ड — मुख्य दालन, कराड",
    nameEn: "AN Fish World — Flagship Store, Karad",
    addressMr: PLACEHOLDERS.STORE_ADDRESS_KARAD,
    addressEn: PLACEHOLDERS.STORE_ADDRESS_KARAD,
    phone: PLACEHOLDERS.CONTACT_PHONE,
    hoursMr: PLACEHOLDERS.DAILY_HOURS,
    hoursEn: PLACEHOLDERS.DAILY_HOURS,
    landmarkMr: PLACEHOLDERS.STORE_LANDMARK,
    landmarkEn: PLACEHOLDERS.STORE_LANDMARK,
    googleMapsUrl: "https://maps.google.com/?q=Karad+Maharashtra",
  },
  {
    id: "malkapur-outpost",
    slug: "malkapur-outpost",
    nameMr: "मलकापूर एक्सप्रेस काऊंटर",
    nameEn: "Malkapur Express Outlet",
    addressMr: "[FILL: MALKAPUR_BRANCH_ADDRESS, KARAD]",
    addressEn: "[FILL: MALKAPUR_BRANCH_ADDRESS, KARAD]",
    phone: PLACEHOLDERS.CONTACT_PHONE,
    hoursMr: "[FILL: 7:30 AM - 12:30 PM | 5:00 PM - 8:30 PM]",
    hoursEn: "[FILL: 7:30 AM - 12:30 PM | 5:00 PM - 8:30 PM]",
    landmarkMr: "[FILL: NEAR_HIGHWAY_MALKAPUR]",
    landmarkEn: "[FILL: NEAR_HIGHWAY_MALKAPUR]",
    googleMapsUrl: "https://maps.google.com/?q=Malkapur+Karad",
  },
];
