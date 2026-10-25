import React from "react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FishMarket",
    name: "AN Fish World",
    alternateName: "ए एन फिश वर्ल्ड",
    description:
      "Karad's trusted fresh fish retail brand. Sourced from 4:00 AM coastal harbour auctions at Ratnagiri & Malvan, preserved in 0°C liquid ice slurry, 100% formalin free.",
    url: "https://anfishworld.com",
    logo: "https://anfishworld.com/brand/an-fish-logo-badge.png",
    image: "https://anfishworld.com/media/founder-owner.jpg",
    founder: {
      "@type": "Person",
      name: "Ameer Nadaf",
      jobTitle: "Owner of AN Fish • Founder / CEO",
      image: "https://anfishworld.com/media/founder-owner.jpg",
    },
    telephone: PLACEHOLDERS.CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: PLACEHOLDERS.STORE_ADDRESS_KARAD,
      addressLocality: "Karad",
      addressRegion: "Maharashtra",
      postalCode: "415110",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.2892,
      longitude: 74.1818,
    },
    priceRange: "₹₹",
    servesCuisine: "Fresh Seafood, Coastal Fish, Freshwater Fish",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
