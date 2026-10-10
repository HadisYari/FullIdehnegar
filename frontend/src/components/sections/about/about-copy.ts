import type { LocalizedText } from "@/lib/cms";
import type { Locale } from "@/lib/i18n/dictionaries";

/**
 * Text of the current locale from a CMS value. Falls back to the local copy when
 * the CMS has no value, so the section still renders while the API is offline.
 */
export function resolveText(value: LocalizedText | null | undefined, locale: Locale, fallback: string): string {
  if (!value) return fallback;
  return (locale === "fa" ? value.fa : value.en) || fallback;
}
