import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/dictionaries";
import { getPageContent } from "@/lib/cms";
import GoldAppContent from "./GoldAppContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isFa = locale === "fa";
  const page = await getPageContent("gold-app", locale);
  const title = page?.metaTitle || (isFa ? "اپلیکیشن و تابلوی قیمت طلا | ایده‌نگار" : "Gold Price App and Digital Display | Idehnegar");
  const description = page?.metaDescription || (isFa
    ? "معرفی اپلیکیشن طلا و جواهر و تابلوی دیجیتال نمایش قیمت برای طلافروشی‌ها."
    : "Discover the Idehnegar gold and jewelry app and digital price display for gold retailers.");
  return {
    title,
    description,
    alternates: {
      canonical: page?.canonicalUrl || (isFa ? "/gold-app" : "/en/gold-app"),
      languages: { fa: "/gold-app", en: "/en/gold-app" },
    },
    openGraph: {
      title: page?.openGraphTitle || title,
      description: page?.openGraphDescription || description,
      images: page?.imagePath ? [{ url: page.imagePath, alt: page.imageAlt || title }] : undefined,
    },
  };
}

export default function GoldAppPage() {
  return <GoldAppContent />;
}
