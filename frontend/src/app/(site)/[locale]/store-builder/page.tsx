// app/[locale]/store-builder/page.tsx
import type { Metadata } from "next";
import { withPageMeta } from "@/lib/cms";
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
      ? "فروشگاه‌ساز ابری | خرید اشتراک و تحویل آنی | پیشگامان ایده‌نگار"
      : "Cloud Store Builder | Instant Subscription Delivery | Idehnegar",
    description: isFa
      ? "قالب فروشگاه اینترنتی خود را با انبارداری جامع یا نسخه سبک انتخاب کنید؛ فعال‌سازی آنی پس از پرداخت و اتصال مستقیم به درگاه شاپرک."
      : "Pick a store template with full warehouse management or a light version; instant activation after payment via Shaparak gateway.",
  });
}

export default async function StoreBuilderPage() {
  // قالب‌ها از /api/public/store-templates — fallback: src/data/store-templates.json
  const templates = await getStoreTemplates();

  return <StoreBuilderClient templates={templates} />;
}
