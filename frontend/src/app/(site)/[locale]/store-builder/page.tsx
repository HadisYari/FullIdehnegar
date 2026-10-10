// app/[locale]/store-builder/page.tsx
import type { Metadata } from "next";
import { loadPageMeta, loadPageSections, withPageMeta } from "@/lib/cms";
import { getStoreTemplates } from "@/lib/store";
import { locales } from "@/lib/i18n/dictionaries";
import { StoreBuilderClient } from "@/components/store-builder/store-builder-client";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";
  return withPageMeta("store-builder", locale === "fa" ? "fa" : "en", {
    path: "/store-builder",
    title: isFa
      ? "فروشگاه‌ساز ابری | قالب‌های فروشگاه اینترنتی | پیشگامان ایده‌نگار"
      : "Cloud Store Builder | Store Templates | Idehnegar",
    description: isFa
      ? "قالب فروشگاه اینترنتی خود را با انبارداری جامع یا نسخه سبک انتخاب کنید و برای راه‌اندازی با تیم ایده‌نگار در تماس باشید."
      : "Pick a store template with full warehouse management or a light version, then contact our team to get started.",
  });
}

export default async function StoreBuilderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "fa";
  // قالب‌ها از /api/public/store-templates — fallback: src/data/store-templates.json
  const [templates, sections, pageMeta] = await Promise.all([
    getStoreTemplates(),
    loadPageSections("store-builder"),
    loadPageMeta("store-builder"),
  ]);

  // متن هیرو از جدول PageMeta (پنل مدیریت) — fallback: متن‌های همین صفحه.
  const hero = {
    eyebrow:
      (pageMeta && (pageMeta.eyebrow[lang] || pageMeta.eyebrow.fa)) ||
      (lang === "fa" ? "فروشگاه‌ساز ابری • راه‌اندازی سریع" : "Cloud store builder • fast setup"),
    heading:
      (pageMeta && (pageMeta.heading[lang] || pageMeta.heading.fa)) ||
      (lang === "fa"
        ? "انتخاب قالب فروشگاه\n|راه‌اندازی سریع با پشتیبانی پیشگامان ایده‌نگار|"
        : "Choose a store template\n|Fast setup with Idehnegar support|"),
  };

  return <StoreBuilderClient templates={templates} sections={sections} locale={lang} hero={hero} />;
}
