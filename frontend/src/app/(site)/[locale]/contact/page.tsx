// app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { withPageMeta } from "@/lib/cms";
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
  // عنوان/توضیح/کلیدواژه از جدول PageMeta (پنل مدیریت) و در نبودش از همین مقادیر.
  return withPageMeta("contact", locale === "fa" ? "fa" : "en", {
    path: "/contact",
    title: isFa ? "تماس با ما | پیشگامان ایده‌نگار" : "Contact Us | Idehnegar Studio",
    description: isFa
      ? "برای مشاوره فنی رایگان و برآورد پروژه نرم‌افزاری با تیم پیشگامان ایده‌نگار در تماس باشید."
      : "Connect with the Idehnegar engineering team for architecture consultations and project roadmaps.",
  });
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