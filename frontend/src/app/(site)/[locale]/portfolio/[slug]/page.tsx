// app/[locale]/portfolio/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PortfolioCard } from "@/components/portfolio-card";
import { DeviceShowcase, LaptopMockup, PhoneMockup } from "@/components/device-mockup";
import { JsonLd } from "@/components/json-ld";
import { getPortfolioItem, getPortfolioItems } from "@/lib/portfolio";
import { loadCategories, loadSiteConfig } from "@/lib/cms";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/paths";
import { categories as localCategories, categoryLabel } from "@/lib/categories";
import { formatNumber } from "@/lib/format";

export async function generateStaticParams() {
  const items = await getPortfolioItems();
  return locales.flatMap((locale) =>
    items.map((item) => ({ locale, slug: item.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const item = await getPortfolioItem(slug);
  if (!item) return {};
  const path = `/portfolio/${slug}`;
  return {
    title: item.title[locale],
    description: item.summary[locale],
    alternates: {
      canonical: locale === "fa" ? path : `/en${path}`,
      languages: { fa: path, en: `/en${path}` },
    },
    openGraph: {
      title: item.title[locale],
      description: item.summary[locale],
      images: [{ url: item.image, width: 1200, height: 750 }],
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const item = await getPortfolioItem(slug);
  if (!item) notFound();

  const [allItems, config, remoteCategories] = await Promise.all([
    getPortfolioItems(),
    loadSiteConfig(),
    loadCategories(),
  ]);

  // دسته‌بندی‌ها از /api/public/categories — fallback: lib/categories
  const categoryList = remoteCategories.length > 0 ? remoteCategories : localCategories;

  const related = allItems
    .filter((i) => i.slug !== slug && i.category === item.category)
    .slice(0, 3);
  const moreItems =
    related.length > 0
      ? related
      : allItems.filter((i) => i.slug !== slug).slice(0, 3);

  const projectLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title[locale],
    description: item.description[locale],
    image: `${config.url}${item.image}`,
    creator: { "@type": "Organization", name: config.nameEn },
  };

  const isFa = locale === "fa";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-600/15 selection:text-blue-900">
      <JsonLd data={projectLd} />

      {/* ── پس‌زمینه با نورپردازی ملایم ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 via-slate-100/30 to-transparent" />
      </div>

      {/* ── نوار بالایی (Sub-Header) ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link
              href={localeHref(locale, "/portfolio")}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
              >
                <path d="M19 12H5m6-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {dict.portfolio.backToAll}
            </Link>

            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                {categoryLabel(item.category, locale, categoryList)}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-500 shadow-sm">
                {formatNumber(item.year, locale)}
              </span>
            </div>
          </div>
        </Container>
      </nav>

      {/* ── استیج اصلی پروژه (چیدمان دو ستونه اسکرولی) ── */}
      <main className="py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
            
            {/* سمت چپ (در RTL سمت راست): استیج ماکاپ‌ها با پیش‌زمینه تفکیک‌شده */}
             {/* سمت چپ (در RTL سمت راست): استیج ماکاپ‌ها */}
<div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24">
  <div className="relative p-2 sm:p-4">
    <div className="relative z-10">
      {item.desktopScreenshot && item.mobileScreenshot ? (
        <DeviceShowcase
          desktopScreenshot={item.desktopScreenshot}
          mobileScreenshot={item.mobileScreenshot}
          alt={item.title[locale]}
        />
      ) : item.desktopScreenshot ? (
        <LaptopMockup
          screenshot={item.desktopScreenshot}
          alt={item.title[locale]}
        />
      ) : item.mobileScreenshot ? (
        <div className="mx-auto max-w-[280px]">
          <PhoneMockup
            screenshot={item.mobileScreenshot}
            alt={item.title[locale]}
          />
        </div>
      ) : (
        <LaptopMockup screenshot={item.image} alt={item.title[locale]} />
      )}
    </div>

    <div className="relative z-10 mt-6 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Interactive View</span>
      </div>
      <span className="h-3 w-px bg-slate-200" />
      <span>اسکرول روی پیش‌نمایش فعال است</span>
    </div>
  </div>
</div>

            {/* سمت راست (در RTL سمت چپ): اطلاعات پروژه */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5">
              
              {/* تایتل و توضیحات کلی */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                  {item.title[locale]}
                </h1>
                
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                  {item.summary?.[locale] || item.description[locale]}
                </p>
              </div>

              {/* کارت متادیتا، کارفرما و تکنولوژی‌ها */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <span className="font-mono text-slate-400 block mb-1 text-[11px]">
                      {locale === "fa" ? "کارفرما" : "Client"}
                    </span>
                    <span className="font-bold text-slate-800">
                      {item.client[locale]}
                    </span>
                  </div>
                  
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <span className="font-mono text-slate-400 block mb-1 text-[11px]">
                      {locale === "fa" ? "دسته‌بندی" : "Category"}
                    </span>
                    <span className="font-bold text-blue-600">
                      {categoryLabel(item.category, locale, categoryList)}
                    </span>
                  </div>
                </div>

                {/* استک تکنولوژی */}
                {item.tags && item.tags.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-mono text-slate-400 block mb-2.5">
                      {locale === "fa" ? "فناوری‌های به‌کاررفته" : "Tech Stack"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* دکمه وبسایت لایو */}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-[0.99]"
                  >
                    <span>{dict.portfolio.liveLink}</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>

              {/* باکس CTA برای سفارش پروژه */}
              <Link
                href={localeHref(locale, "/contact")}
                className="group rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 p-5 transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 block mb-1">
                      {locale === "fa" ? "سفارش سیستم نرم‌افزاری" : "Start Project"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800">
                      {dict.hero.ctaPrimary}
                    </h3>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rtl:rotate-180">
                      <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </Container>
      </main>

      {/* ── پروژه‌های مرتبط ── */}
      {moreItems.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-14">
          <Container>
            <div className="flex items-center justify-between mb-7">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400">
                  {isFa ? "آرشیو پروژه‌ها" : "Portfolio"}
                </span>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">
                  {isFa ? "پروژه‌های مرتبط" : "Related Projects"}
                </h2>
              </div>
              <Link
                href={localeHref(locale, "/portfolio")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isFa ? "مشاهده همه ←" : "View all →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreItems.map((r) => (
                <PortfolioCard
                  key={r.slug}
                  item={r}
                  locale={locale}
                  categories={categoryList}
                //  viewLabel={dict.portfolio.viewProject}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}