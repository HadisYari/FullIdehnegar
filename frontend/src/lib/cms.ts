import "server-only";

import { cache } from "react";
import { getDictionary as getStaticDictionary, type Dictionary, type Locale } from "@/lib/i18n/dictionaries";
import { getSiteConfigForLocale, siteConfig, type LocalizedSiteConfig } from "@/lib/site-config";

export interface CmsEntry {
  id: number;
  key: string;
  type: string;
  slug?: string | null;
  title?: string | null;
  summary?: string | null;
  body?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  canonicalUrl?: string | null;
  openGraphTitle?: string | null;
  openGraphDescription?: string | null;
  imagePath?: string | null;
  imageAlt?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  data: unknown;
  shared: unknown;
  updatedAtUtc: string;
}

export interface CmsSitePayload {
  locale: Locale;
  dictionary: Dictionary | null;
  settings: LocalizedSiteConfig | null;
  testimonials: CmsEntry[];
}

export interface CmsCategory {
  slug: string;
  fa: string;
  en: string;
}

/** The CMS base URL is server-only. Browser code always talks to the Next app. */
export function getCmsApiBaseUrl(): string | null {
  const configured = process.env.CMS_API_URL?.trim();
  return configured ? configured.replace(/\/+$/, "") : null;
}

export async function fetchCmsJson<T>(path: string): Promise<T | null> {
  const baseUrl = getCmsApiBaseUrl();
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/api/v1${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    // Keep the site available during a CMS rollout or temporary backend outage.
    console.warn("CMS request failed; using the checked-in frontend fallback.", error);
    return null;
  }
}

export const getCmsSite = cache(async (locale: Locale): Promise<CmsSitePayload | null> =>
  fetchCmsJson<CmsSitePayload>(`/site?locale=${locale}`)
);

export async function getDictionaryForLocale(locale: Locale): Promise<Dictionary> {
  const site = await getCmsSite(locale);
  return site?.dictionary ?? getStaticDictionary(locale);
}

export async function getSiteSettings(locale: Locale): Promise<LocalizedSiteConfig> {
  const fallback = getSiteConfigForLocale(locale);
  const site = await getCmsSite(locale);
  if (!site?.settings || typeof site.settings !== "object") return fallback;

  const settings = site.settings as Partial<LocalizedSiteConfig>;
  const social: Partial<LocalizedSiteConfig["social"]> =
    settings.social && typeof settings.social === "object" ? settings.social : {};
  const stats: Partial<LocalizedSiteConfig["stats"]> =
    settings.stats && typeof settings.stats === "object" ? settings.stats : {};
  const validString = (value: string | null | undefined, defaultValue: string) =>
    typeof value === "string" && value.trim() ? value : defaultValue;

  return {
    ...fallback,
    ...settings,
    domain: validString(settings.domain, fallback.domain),
    url: validString(settings.url, fallback.url),
    name: validString(settings.name, fallback.name),
    alternateName: validString(settings.alternateName, fallback.alternateName),
    shortName: validString(settings.shortName, fallback.shortName),
    tagline: validString(settings.tagline, fallback.tagline),
    email: validString(settings.email, fallback.email),
    telegram: validString(settings.telegram, fallback.telegram),
    whatsapp: validString(settings.whatsapp, fallback.whatsapp),
    address: validString(settings.address, fallback.address),
    hours: validString(settings.hours, fallback.hours),
    mapEmbedSrc: validString(settings.mapEmbedSrc, fallback.mapEmbedSrc),
    phones: Array.isArray(settings.phones)
      ? settings.phones.filter((phone): phone is string => typeof phone === "string" && phone.length > 0)
      : fallback.phones,
    social: {
      telegram: validString(social.telegram, fallback.social.telegram),
      linkedin: validString(social.linkedin, fallback.social.linkedin),
      instagram: validString(social.instagram, fallback.social.instagram),
    },
    stats: {
      clients: typeof stats.clients === "number" ? stats.clients : fallback.stats.clients,
      projects: typeof stats.projects === "number" ? stats.projects : fallback.stats.projects,
      yearsActive: typeof stats.yearsActive === "number" ? stats.yearsActive : fallback.stats.yearsActive,
      awards: typeof stats.awards === "number" ? stats.awards : fallback.stats.awards,
    },
  };
}

export async function getPageContent(key: string, locale: Locale): Promise<CmsEntry | null> {
  return fetchCmsJson<CmsEntry>(`/pages/${encodeURIComponent(key)}?locale=${locale}`);
}

export async function getCmsCategories(locale: Locale): Promise<CmsCategory[] | null> {
  const entry = await fetchCmsJson<CmsEntry>(`/content/site%3Acategories?locale=${locale}`);
  const value = entry?.shared;
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is CmsCategory => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Record<string, unknown>;
    return typeof candidate.slug === "string" && typeof candidate.fa === "string" && typeof candidate.en === "string";
  });
}

export async function getCmsTestimonials(locale: Locale): Promise<Array<{ name: string; quote: string }>> {
  const site = await getCmsSite(locale);
  return (site?.testimonials ?? []).map((entry) => ({
    name: entry.title ?? "",
    quote: entry.summary ?? "",
  }));
}

export function getStaticSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || siteConfig.url;
}
