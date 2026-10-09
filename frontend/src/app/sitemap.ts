import type { MetadataRoute } from "next";
import { getPortfolioItems } from "@/lib/portfolio";
import { siteConfig } from "@/lib/site-config";

const staticPaths = ["", "/about", "/services", "/portfolio", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getPortfolioItems();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((p) => [
    {
      url: `${siteConfig.url}${p}`,
      lastModified: now,
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.8,
      alternates: {
        languages: {
          fa: `${siteConfig.url}${p}`,
          en: `${siteConfig.url}/en${p}`,
        },
      },
    },
    {
      url: `${siteConfig.url}/en${p}`,
      lastModified: now,
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 0.9 : 0.7,
      alternates: {
        languages: {
          fa: `${siteConfig.url}${p}`,
          en: `${siteConfig.url}/en${p}`,
        },
      },
    },
  ]);

  const portfolioEntries: MetadataRoute.Sitemap = items.flatMap((item) => [
    {
      url: `${siteConfig.url}/portfolio/${item.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: {
        languages: {
          fa: `${siteConfig.url}/portfolio/${item.slug}`,
          en: `${siteConfig.url}/en/portfolio/${item.slug}`,
        },
      },
    },
    {
      url: `${siteConfig.url}/en/portfolio/${item.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]);

  return [...staticEntries, ...portfolioEntries];
}
