import type { MetadataRoute } from "next";
import { getPortfolioItems } from "@/lib/portfolio";
import { fetchCmsJson, getSiteSettings, type CmsEntry } from "@/lib/cms";

export const dynamic = "force-dynamic";

const staticPages = [
  { path: "", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/portfolio", key: "portfolio" },
  { path: "/contact", key: "contact" },
  { path: "/store-builder", key: "store-builder" },
  { path: "/payment", key: "payment" },
  { path: "/gold-app", key: "gold-app" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [items, site, faPages, enPages] = await Promise.all([
    getPortfolioItems(),
    getSiteSettings("fa"),
    fetchCmsJson<CmsEntry[]>("/content?locale=fa&type=page&limit=500"),
    fetchCmsJson<CmsEntry[]>("/content?locale=en&type=page&limit=500"),
  ]);
  const faPageByKey = new Map((faPages ?? []).map((entry) => [entry.key, entry]));
  const enPageByKey = new Map((enPages ?? []).map((entry) => [entry.key, entry]));
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(({ path, key }) => {
    const faUrl = new URL(faPageByKey.get(`page:${key}`)?.canonicalUrl || path || "/", site.url).toString();
    const enUrl = new URL(enPageByKey.get(`page:${key}`)?.canonicalUrl || `/en${path}`, site.url).toString();
    return [
      {
        url: faUrl,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages: { fa: faUrl, en: enUrl } },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 0.9 : 0.7,
        alternates: { languages: { fa: faUrl, en: enUrl } },
      },
    ];
  });

  const portfolioEntries: MetadataRoute.Sitemap = items.flatMap((item) => {
    const faUrl = new URL(item.canonicalFa || `/portfolio/${item.slug}`, site.url).toString();
    const enUrl = new URL(item.canonicalEn || `/en/portfolio/${item.slug}`, site.url).toString();
    return [
      {
        url: faUrl,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: { fa: faUrl, en: enUrl } },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.5,
        alternates: { languages: { fa: faUrl, en: enUrl } },
      },
    ];
  });

  return [...staticEntries, ...portfolioEntries];
}
