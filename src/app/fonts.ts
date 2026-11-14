import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const geistSans = GeistSans;
export const geistMono = GeistMono;

/**
 * Turbopack-safe font token definitions.
 * Google fonts ('Baloo 2', 'Noto Sans Devanagari', 'Playfair Display') are loaded
 * via preconnected Google Fonts CDN in layout.tsx to prevent Turbopack's internal
 * "next/font/google queries have exactly one entry" module resolution bug.
 */
export const baloo2 = {
  variable: "font-baloo",
  className: "font-baloo",
};

export const notoSansDevanagari = {
  variable: "font-noto-devanagari",
  className: "font-noto-devanagari",
};

export const playfair = {
  variable: "font-playfair",
  className: "font-playfair",
};
