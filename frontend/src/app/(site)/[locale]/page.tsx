// app/[locale]/page.tsx
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ServicesSection } from "@/components/sections/services-section";
import { PortfolioPreviewSection } from "@/components/sections/portfolio-preview-section";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ClientsSection } from "@/components/sections/clients-section";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { getFeaturedPortfolioItems } from "@/lib/portfolio";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { getDictionaryForLocale, getSiteSettings } from "@/lib/cms";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const [dict, site, featured] = await Promise.all([
    getDictionaryForLocale(locale),
    getSiteSettings(locale),
    getFeaturedPortfolioItems(8),
  ]);

  return (
    <main className="relative flex flex-col overflow-hidden">
      <HeroSection locale={locale} dict={dict} />
      <StatsSection locale={locale} dict={dict} site={site} />
      <ServicesSection locale={locale} dict={dict} />
      <PortfolioPreviewSection items={featured} locale={locale} dict={dict} />
      <ProcessSection dict={dict} />
      <ClientsSection locale={locale} dict={dict} />
      
      {/* 🌟 سکشن پیش‌فوتر: ایجاد زمینه روشن برای نشستن موج سرمه‌ای فوتر */}
      <HomeCtaSection locale={locale} dict={dict} />
    </main>
  );
}