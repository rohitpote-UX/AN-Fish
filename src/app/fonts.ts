import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Baloo_2, Noto_Sans_Devanagari, Playfair_Display } from "next/font/google";

export const geistSans = GeistSans;
export const geistMono = GeistMono;

export const baloo2 = Baloo_2({
  subsets: ["devanagari", "latin"],
  variable: "--font-baloo",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
