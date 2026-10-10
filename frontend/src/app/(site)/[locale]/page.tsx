// app/[locale]/page.tsx
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ServicesSection } from "@/components/sections/services-section";
import { PortfolioPreviewSection } from "@/components/sections/portfolio-preview-section";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ClientsSection } from "@/components/sections/clients-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { getFeaturedPortfolioItems } from "@/lib/portfolio";
import {
  loadClients,
  loadHomeServiceCards,
  loadPageMeta,
  loadPageSections,
  loadProcessSteps,
  loadSiteConfig,
  loadTestimonials,
} from "@/lib/cms";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";

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
  const dict = getDictionary(locale);

  // همهٔ داده‌های این صفحه از بک‌اند می‌آیند (با کش ISR و fallback داخلی).
  const [
    featured,
    config,
    remoteSteps,
    remoteClients,
    remoteServiceCards,
    pageMeta,
    remoteSections,
    remoteTestimonials,
  ] = await Promise.all([
    getFeaturedPortfolioItems(8),
    loadSiteConfig(),
    loadProcessSteps(),
    loadClients(),
    loadHomeServiceCards(),
    loadPageMeta("home"),
    loadPageSections("home"),
    loadTestimonials(),
  ]);

  // مراحل توسعه — fallback: دیکشنری i18n
  const steps =
    remoteSteps.length > 0
      ? remoteSteps.map((step) => ({
          title: step.title[locale] || step.title.fa,
          desc: step.desc[locale] || step.desc.fa,
          duration: step.duration[locale] || step.duration.fa || undefined,
          icon: step.icon ?? undefined,
          color: step.color ?? undefined,
          accent: step.accent ?? undefined,
        }))
      : undefined;

  // مشتریان — fallback: دادهٔ همراه کامپوننت
  const clients =
    remoteClients.length > 0
      ? remoteClients.map((client) => ({
          name: client.name[locale] || client.name.fa,
          monogram: client.monogram ?? null,
        }))
      : undefined;

  // متن‌های هیرو از جدول PageMeta — fallback: دیکشنری i18n
  const heroMeta = pageMeta
    ? {
        eyebrow: pageMeta.eyebrow[locale] || pageMeta.eyebrow.fa || undefined,
        title: pageMeta.heading[locale] || pageMeta.heading.fa || undefined,
        subtitle: pageMeta.subheading[locale] || pageMeta.subheading.fa || undefined,
      }
    : undefined;

  return (
    <main className="relative flex flex-col overflow-hidden">
      <HeroSection locale={locale} dict={dict} meta={heroMeta} stats={config.stats} />
      <StatsSection locale={locale} dict={dict} stats={config.stats} />
      <ServicesSection locale={locale} dict={dict} cards={remoteServiceCards} />
      <PortfolioPreviewSection items={featured} locale={locale} dict={dict} />
      <ProcessSection dict={dict} steps={steps} />
      <ClientsSection locale={locale} dict={dict} clients={clients} />
      <TestimonialsSection
        locale={locale}
        items={remoteTestimonials}
        sections={remoteSections}
      />

      {/* 🌟 سکشن پیش‌فوتر: ایجاد زمینه روشن برای نشستن موج سرمه‌ای فوتر */}
      <HomeCtaSection locale={locale} sections={remoteSections} />
    </main>
  );
}
