import type { MetadataRoute } from "next";
import { loadSiteConfig } from "@/lib/cms";

/**
 * robots.txt از همان تنظیماتی خوانده می‌شود که در پنل مدیریت ویرایش می‌شوند،
 * پس دامنهٔ جدید بدون deploy تازه در فایل اعمال می‌شود.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await loadSiteConfig();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // پنل مدیریت، مسیرهای احراز هویت و API داخلی برای خزنده‌ها بسته‌اند.
        disallow: ["/admin", "/api", "/en/admin"],
      },
    ],
    sitemap: `${config.url}/sitemap.xml`,
    host: config.url.replace(/^https?:\/\//, ""),
  };
}
