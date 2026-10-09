import type { MetadataRoute } from "next";
import { getPortfolioItems } from "@/lib/portfolio";
import { cmsEnabled, loadSiteConfig, loadSitemapEntries, type SitemapEntryDto } from "@/lib/cms";

/**
 * نقشهٔ سایت. وقتی بک‌اند فعال است، ورودی‌ها از دیتابیس می‌آیند
 * (صفحه‌ها + همهٔ پروژه‌های منتشرشده، با lastModified واقعی و بدون صفحات noindex)
 * و در غیر این صورت از همان دادهٔ همراه مخزن ساخته می‌شود.
 */

const fallbackPages: SitemapEntryDto[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/store-builder", changeFrequency: "monthly", priority: 0.7 },
  { path: "/gold-app", changeFrequency: "monthly", priority: 0.6 },
];

const validFrequencies = new Set(["daily", "weekly", "monthly", "yearly"]);

function frequency(value: string | undefined): MetadataRoute.Sitemap[number]["changeFrequency"] {
  return validFrequencies.has(value ?? "") ? (value as MetadataRoute.Sitemap[number]["changeFrequency"]) : "monthly";
}

function toUrl(path: string, locale: "fa" | "en"): string {
  const clean = path === "/" ? "" : path;
  return locale === "fa" ? `${clean || "/"}` : `/en${clean}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await loadSiteConfig();
  const baseUrl = config.url.replace(/\/+$/, "");

  const remote = cmsEnabled ? await loadSitemapEntries() : [];
  const entries = remote.length > 0 ? remote : fallbackPages;

  const rows: MetadataRoute.Sitemap = entries
    .filter((entry) => entry.path && entry.noIndex !== true)
    .flatMap((entry) => {
      const lastModified = entry.lastModified ? new Date(entry.lastModified) : undefined;
      const fa = `${baseUrl}${toUrl(entry.path, "fa")}`;
      const en = `${baseUrl}${toUrl(entry.path, "en")}`;
      const alternates = { languages: { fa, en, "x-default": fa } };

      return [
        {
          url: fa,
          lastModified,
          changeFrequency: frequency(entry.changeFrequency),
          priority: entry.priority,
          alternates,
        },
        {
          url: en,
          lastModified,
          changeFrequency: frequency(entry.changeFrequency),
          priority: Math.max(0, Math.round((entry.priority - 0.1) * 100) / 100),
          alternates,
        },
      ];
    });

  // بدون بک‌اند، پروژه‌ها از فایل محلی خوانده و به نقشه اضافه می‌شوند.
  if (!cmsEnabled) {
    const items = await getPortfolioItems();
    const local: MetadataRoute.Sitemap = items.flatMap((item) => {
      const path = `/portfolio/${item.slug}`;
      const fa = `${baseUrl}${path}`;
      const en = `${baseUrl}${toUrl(path, "en")}`;
      return [
        {
          url: fa,
          changeFrequency: "yearly" as const,
          priority: 0.6,
          alternates: { languages: { fa, en, "x-default": fa } },
        },
        { url: en, changeFrequency: "yearly" as const, priority: 0.5 },
      ];
    });
    return [...rows, ...local];
  }

  return rows;
}
