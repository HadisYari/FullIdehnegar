import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSettings("fa");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/Admin", "/admin", "/Panel", "/api"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
