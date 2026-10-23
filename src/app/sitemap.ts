import { MetadataRoute } from "next";
import { SPECIES_LIST } from "@/data/species";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anfishworld.com";
  const routes = ["", "/about", "/catch", "/branches", "/wholesale", "/contact"];
  const locales = ["mr", "en"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "/catch" ? "hourly" : "daily",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    for (const sp of SPECIES_LIST) {
      entries.push({
        url: `${baseUrl}/${locale}/catch/${sp.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  return entries;
}
