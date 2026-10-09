// app/[locale]/gold-app/page.tsx
import type { Metadata } from "next";
import { withPageMeta } from "@/lib/cms";
import { getAppDownloadLinks } from "@/lib/store";
import { locales } from "@/lib/i18n/dictionaries";
import { GoldAppClient } from "@/components/gold-app/gold-app-client";

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
  return withPageMeta("gold-app", locale === "fa" ? "fa" : "en", {
    path: "/gold-app",
    title: isFa
      ? "اپلیکیشن و تابلوی نرخ لحظه‌ای طلا و سکه | ایده‌نگار"
      : "Live Gold & Coin Rate App and Shop Board | Idehnegar",
    description: isFa
      ? "نرم‌افزار نرخ لحظه‌ای طلا، سکه و ارز با نمایشگر مخصوص مغازه‌های طلا و جواهر؛ به‌روزرسانی خودکار از اتحادیه."
      : "Live gold, coin and currency rate software with a dedicated display board for jewelry shops; auto-updated from the guild.",
  });
}

export default async function GoldAppPage() {
  // لینک‌های دانلود از /api/public/app-download-links — fallback: src/data/app-download-links.json
  const links = await getAppDownloadLinks();

  return <GoldAppClient links={links} />;
}
