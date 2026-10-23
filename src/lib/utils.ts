/**
 * Class name joining utility
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format currency with Marathi/Indian number system
 */
export function formatPrice(priceStr: string): string {
  return priceStr;
}
