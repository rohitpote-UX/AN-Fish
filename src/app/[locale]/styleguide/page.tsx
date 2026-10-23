import React from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { StyleguideClient } from "./StyleguideClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Design System & Styleguide | AN Fish World",
  description: "Dev-only design system tokens, typography scale, colour swatches, motion tokens, and UI components showcase.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "mr" | "en")) notFound();
  setRequestLocale(locale);

  return <StyleguideClient locale={locale} />;
}
