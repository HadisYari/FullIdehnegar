import type { Locale } from "./i18n/dictionaries";

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Formats a number using Persian digits for the fa locale, plain for en. */
export function formatNumber(value: number | string, locale: Locale): string {
  const str = String(value);
  if (locale !== "fa") return str;
  return str.replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

const jalaliDigitsOnly = (n: number) => n; // years are stored as Jalali already in data
export { jalaliDigitsOnly };
