import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/dictionaries";
import { getPageContent } from "@/lib/cms";
import StoreBuilderContent from "./StoreBuilderContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isFa = locale === "fa";
  const page = await getPageContent("store-builder", locale);
  const title = page?.metaTitle || (isFa ? "فروشگاه‌ساز ایده‌نگار | راه‌اندازی فروشگاه آنلاین" : "Idehnegar Store Builder | Launch an Online Store");
  const description = page?.metaDescription || (isFa
    ? "پلن‌ها، امکانات و سرویس‌های فروشگاه‌ساز ایده‌نگار را مشاهده و برای راه‌اندازی فروشگاه آنلاین اقدام کنید."
    : "Explore Idehnegar's online store plans, features, and services for launching your e-commerce business.");
  return {
    title,
    description,
    alternates: {
      canonical: page?.canonicalUrl || (isFa ? "/store-builder" : "/en/store-builder"),
      languages: { fa: "/store-builder", en: "/en/store-builder" },
    },
    openGraph: {
      title: page?.openGraphTitle || title,
      description: page?.openGraphDescription || description,
      images: page?.imagePath ? [{ url: page.imagePath, alt: page.imageAlt || title }] : undefined,
    },
  };
}

export default function StoreBuilderPage() {
  return <StoreBuilderContent />;
}
