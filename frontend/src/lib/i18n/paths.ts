import type { Locale } from "./dictionaries";

/**
 * Builds a locale-aware href. Persian (default) has no URL prefix;
 * English pages live under /en/*.
 *
 *   localeHref('fa', '/services')   -> '/services'
 *   localeHref('en', '/services')   -> '/en/services'
 *   localeHref('en', '/')           -> '/en'
 */
export function localeHref(locale: Locale, targetPath: string): string {
  const clean = targetPath === "/" ? "" : targetPath;
  if (locale === "fa") return clean === "" ? "/" : clean;
  return `/en${clean}`;
}

/** Given the current pathname (already locale-prefixed for /en/*), return
 * the equivalent path in the other locale — used by the language switcher. */
export function swapLocalePath(pathname: string, targetLocale: Locale): string {
  const withoutEn = pathname.startsWith("/en") ? pathname.slice(3) || "/" : pathname;
  return localeHref(targetLocale, withoutEn);
}
