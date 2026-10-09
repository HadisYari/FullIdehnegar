// app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";
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
  const isFa = locale === "fa";
  return {
    title: isFa ? "تماس با ما | پیشگامان ایده‌نگار" : "Contact Us | Idehnegar Studio",
    description: isFa
      ? "برای مشاوره فنی رایگان و برآورد پروژه نرم‌افزاری با تیم پیشگامان ایده‌نگار در تماس باشید."
      : "Connect with the Idehnegar engineering team for architecture consultations and project roadmaps.",
    alternates: {
      canonical: isFa ? "/contact" : "/en/contact",
      languages: { fa: "/contact", en: "/en/contact" },
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
  const dict = getDictionary(locale);

  return <ContactPageCanvas locale={locale} dict={dict} />;
}