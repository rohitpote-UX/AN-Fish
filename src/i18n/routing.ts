import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["mr", "en", "hi"],
  defaultLocale: "mr",
  localePrefix: "always",
  // Always open in Marathi first; do not auto-switch based on the browser language or a saved cookie.
  // Visitors can still choose English / Hindi from the language selector.
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
