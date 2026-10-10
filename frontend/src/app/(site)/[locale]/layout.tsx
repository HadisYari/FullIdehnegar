import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { JsonLd } from "@/components/json-ld";
import { locales, getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import { buildMetadata, loadPageMeta, loadServices, loadSiteConfig } from "@/lib/cms";

// Self-hosted variable fonts (no runtime dependency on Google Fonts).
const vazirmatn = localFont({
  src: [
    { path: "../../../fonts/vazirmatn-arabic.woff2", weight: "100 900", style: "normal" },
    { path: "../../../fonts/vazirmatn-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = localFont({
  src: [{ path: "../../../fonts/inter-latin.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const isFa = locale === "fa";

  // عنوان و توضیح صفحه از جدول PageMeta (پنل مدیریت) خوانده می‌شود.
  const pageMeta = await loadPageMeta("home");
  const config = await loadSiteConfig();

  const title = isFa
    ? `${config.nameFa} | طراحی سایت و نرم‌افزار سازمانی در کرمانشاه`
    : `${config.nameEn} | Web & Enterprise Software Development`;
  const description = isFa
    ? "شرکت دانش‌بنیان پیشگامان ایده‌نگار؛ طراحی وب‌سایت، پرتال سازمانی، فروشگاه اینترنتی و نرم‌افزار تحت وب با بیش از ۱۵ سال تجربه در کرمانشاه."
    : "Idehnegar Pioneers is a certified knowledge-based company delivering websites, enterprise portals, online stores, and web software — 15+ years of experience.";

  const meta = buildMetadata(pageMeta, locale as Locale, {
    path: "/",
    fallbackTitle: title,
    fallbackDescription: description,
    baseUrl: config.url,
  });

  return {
    ...meta,
    metadataBase: new URL(config.url),
    title: { default: title, template: `%s | ${isFa ? config.nameFa : config.nameEn}` },
    description,
    alternates: {
      canonical: isFa ? "/" : "/en",
      languages: { fa: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      locale: isFa ? "fa_IR" : "en_US",
      url: isFa ? config.url : `${config.url}/en`,
      siteName: isFa ? config.nameFa : config.nameEn,
      title,
      description,
      images: [{ url: "/images/portfolio/smartexport-ai.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  // یک بار خواندن تنظیمات و تزریق به اجزای سمت کلاینت (فوتر و نوار تماس).
  const [config, remoteServices] = await Promise.all([
    loadSiteConfig(),
    loadServices(),
  ]);

  // عنوان خدمات برای فهرست فوتر — fallback داخل خود SiteFooter است.
  const serviceTitles =
    remoteServices.length > 0
      ? remoteServices.map((service) => service.title[locale] || service.title.fa)
      : undefined;

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.nameEn,
    alternateName: config.nameFa,
    url: config.url,
    logo: `${config.url}/images/brand/logo-mark.png`,
    email: config.email,
    telephone: config.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: config.addressEn,
      addressLocality: "Kermanshah",
      addressCountry: "IR",
    },
    sameAs: [config.social.telegram, config.social.linkedin, config.social.instagram],
  };

  return (
    <html lang={locale} dir={dict.dir} className={`${vazirmatn.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-3 focus:rounded-lg focus:bg-primary-800 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.common.skipToContent}
        </a>
        <JsonLd data={organizationLd} />
        <SiteHeader locale={locale} dict={dict} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} config={config} serviceTitles={serviceTitles} />
        <MobileCtaBar dict={dict} config={config} />
      </body>
    </html>
  );
}
