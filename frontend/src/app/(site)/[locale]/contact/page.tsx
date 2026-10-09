// app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { getDictionaryForLocale, getPageContent, getSiteSettings } from "@/lib/cms";
import ContactPageCanvas from "@/components/sections/contact-section";
 

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const isFa = typedLocale === "fa";
  const page = await getPageContent("contact", typedLocale);
  return {
    title: page?.metaTitle || (isFa ? "تماس با ما | پیشگامان ایده‌نگار" : "Contact Us | Idehnegar Studio"),
    description: page?.metaDescription || (isFa
      ? "برای مشاوره فنی رایگان و برآورد پروژه نرم‌افزاری با تیم پیشگامان ایده‌نگار در تماس باشید."
      : "Connect with the Idehnegar engineering team for architecture consultations and project roadmaps."),
    alternates: {
      canonical: page?.canonicalUrl || (isFa ? "/contact" : "/en/contact"),
      languages: { fa: "/contact", en: "/en/contact" },
    },
    openGraph: {
      title: page?.openGraphTitle || page?.metaTitle || undefined,
      description: page?.openGraphDescription || page?.metaDescription || undefined,
      images: page?.imagePath ? [{ url: page.imagePath }] : undefined,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const [dict, site] = await Promise.all([
    getDictionaryForLocale(locale),
    getSiteSettings(locale),
  ]);

  return <ContactPageCanvas locale={locale} dict={dict} site={site} />;
}