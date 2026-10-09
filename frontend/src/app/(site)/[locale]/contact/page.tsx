// app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { loadFaqs, loadInquiryTypes, loadSiteConfig, withPageMeta } from "@/lib/cms";
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

  // تنظیمات تماس + حوزه‌های پروژه + FAQs — همگی از بک‌اند (fallback داخلی دارند).
  const [config, remoteFaqs, remoteInquiryTypes] = await Promise.all([
    loadSiteConfig(),
    loadFaqs(),
    loadInquiryTypes(),
  ]);

  const faqs =
    remoteFaqs.length > 0
      ? remoteFaqs.map((faq) => ({
          q: faq.question[locale] || faq.question.fa,
          a: faq.answer[locale] || faq.answer.fa,
        }))
      : undefined;

  const inquiryTypes =
    remoteInquiryTypes.length > 0
      ? remoteInquiryTypes.map((type) => ({
          id: type.id,
          label: type.label[locale] || type.label.fa,
          icon: type.icon ?? null,
        }))
      : undefined;

  return (
    <ContactPageCanvas
      locale={locale}
      dict={dict}
      config={config}
      faqs={faqs}
      inquiryTypes={inquiryTypes}
    />
  );
}
