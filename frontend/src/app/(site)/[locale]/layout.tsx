import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { JsonLd } from "@/components/json-ld";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { getDictionaryForLocale, getPageContent, getSiteSettings } from "@/lib/cms";

// Pull CMS-managed text and metadata on every request so Admin edits go live
// without rebuilding the Next.js frontend.
export const dynamic = "force-dynamic";
import { getSiteConfigForLocale } from "@/lib/site-config";

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
  const typedLocale = locale as Locale;
  const isFa = typedLocale === "fa";
  const [site, homePage] = await Promise.all([
    getSiteSettings(typedLocale),
    getPageContent("home", typedLocale),
  ]);

  const fallback = getSiteConfigForLocale(typedLocale);
  const title = homePage?.metaTitle || (isFa
    ? `${site.name || fallback.name} | طراحی سایت و نرم‌افزار سازمانی در کرمانشاه`
    : `${site.name || fallback.name} | Web & Enterprise Software Development`);
  const description = homePage?.metaDescription || (isFa
    ? "شرکت دانش‌بنیان پیشگامان ایده‌نگار؛ طراحی وب‌سایت، پرتال سازمانی، فروشگاه اینترنتی و نرم‌افزار تحت وب با بیش از ۱۵ سال تجربه در کرمانشاه."
    : "Idehnegar Pioneers is a certified knowledge-based company delivering websites, enterprise portals, online stores, and web software — 15+ years of experience.");
  const canonical = homePage?.canonicalUrl || (isFa ? "/" : "/en");
  const image = homePage?.imagePath || "/images/portfolio/smartexport-ai.jpg";

  return {
    metadataBase: new URL(site.url || fallback.url),
    title: { default: title, template: `%s | ${site.name || fallback.name}` },
    description,
    alternates: {
      canonical,
      languages: { fa: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      locale: isFa ? "fa_IR" : "en_US",
      url: new URL(canonical, site.url || fallback.url).toString(),
      siteName: site.name || fallback.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
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
  const [dict, site] = await Promise.all([
    getDictionaryForLocale(locale),
    getSiteSettings(locale),
  ]);

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "en" ? site.name : site.alternateName,
    alternateName: locale === "en" ? site.alternateName : site.name,
    url: site.url,
    logo: `${site.url}/images/brand/logo-mark.png`,
    email: site.email,
    telephone: site.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Kermanshah",
      addressCountry: "IR",
    },
    sameAs: [site.social.telegram, site.social.linkedin, site.social.instagram],
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
        <SiteFooter locale={locale} dict={dict} site={site} />
        <MobileCtaBar dict={dict} site={site} locale={locale} />
      </body>
    </html>
  );
}
