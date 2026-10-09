// app/[locale]/portfolio/page.tsx
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PortfolioFilterGrid } from "@/components/portfolio-filter-grid";
import { JsonLd } from "@/components/json-ld";
import { getPortfolioItems } from "@/lib/portfolio";
import { withPageMeta } from "@/lib/cms";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";
import { Sparkles } from "lucide-react";

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
  return withPageMeta("portfolio", locale === "fa" ? "fa" : "en", {
    path: "/portfolio",
    title: isFa ? "نمونه‌کارها و پروژه‌های شاخص" : "Portfolio & Case Studies",
    description: isFa
      ? "پرتال‌های سازمانی، سامانه‌های نرم‌افزاری و وب‌سایت‌های اجرا شده توسط استودیو ایده‌نگار."
      : "Enterprise portals, custom web systems, and digital platforms crafted by Idehnegar.",
  });
}

/* ──────────────────────────────────────────────────────────
   موج بسیار کوتاه و فشرده هدر (بدون اشغال فضای عمودی)
   ────────────────────────────────────────────────────────── */
function CompactWave() {
  const waves = [
    {
      d: "M0,35 C280,5 480,70 720,30 C940,5 1100,65 1200,35 L1200,100 L0,100 Z",
      opacity: 0.25,
      anim: "animate-wave-flow-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,50 C220,15 420,70 680,40 C880,10 1040,70 1200,50 L1200,100 L0,100 Z",
      opacity: 0.45,
      anim: "animate-wave-flow-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,65 C160,35 360,80 620,60 C820,32 1000,75 1200,65 L1200,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-flow-fast",
      fill: "#f8fafc",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden leading-none pointer-events-none -mt-px -mb-px z-10 bg-[#0f0f52]">
      <div className="relative h-[35px] sm:h-[48px] md:h-[60px] w-full">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1200 100" preserveAspectRatio="none" className="h-[35px] sm:h-[48px] md:h-[60px] w-1/2 block">
                <path d={wave.d} fill={wave.fill} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const isFa = locale === "fa";
  const items = await getPortfolioItems();

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}${locale === "en" ? "/en" : ""}/portfolio/${item.slug}`,
      name: item.title[locale],
    })),
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-50 text-slate-900">
      <JsonLd data={listLd} />

      {/* ── ۱. هدر فشرده سرمه‌ای با نورهای تم برند (بدون نیاز به اسکرول زیاد) ── */}
      <section className="relative pt-10 pb-6 sm:pt-14 sm:pb-8 bg-[#0f0f52] text-white overflow-hidden">
        {/* هاله‌های نوری رنگ لوگو در پس‌زمینه هدر */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 start-1/4 h-64 w-64 rounded-full bg-[#e6304c]/25 blur-[90px]" />
          <div className="absolute bottom-0 end-1/4 h-64 w-64 rounded-full bg-[#e6304c]/15 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <Container className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono text-rose-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#e6304c]" />
            <span>{isFa ? "ویترین پروژه‌های عملیاتی" : "Curated Case Studies"}</span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isFa ? "نمونه‌کارها و " : "Our Featured "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-400 to-amber-200">
              {isFa ? "پروژه‌های شاخص" : "Projects"}
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed max-w-lg mx-auto">
            {isFa
              ? "مجموعه‌ای از پرتال‌های سازمانی، وب‌سایت‌های اختصاصی و سامانه‌های نرم‌افزاری مقیاس‌پذیر."
              : "Enterprise portals, scalable web apps, and bespoke platforms engineered by Idehnegar."}
          </p>
        </Container>
      </section>

      {/* موج متحرک رابط هدر به لیست */}
      <CompactWave />

      {/* ── ۲. بخش فیلترها و گرید نمونه‌کارها (با پس‌زمینه دارای عمق و رنگ) ── */}
      <section className="relative pt-4 pb-16 sm:pt-6 sm:pb-24">
        {/* پس‌زمینه اتمسفریک با دانه‌های محو و نورهای ملایم برند (شکستن سفیدی خالص) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 start-5 h-96 w-96 rounded-full bg-[#e6304c]/5 blur-[120px]" />
          <div className="absolute bottom-1/3 end-5 h-96 w-96 rounded-full bg-[#0f0f52]/5 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0f0f52 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <PortfolioFilterGrid
            items={items}
            locale={locale}
            viewLabel={dict.portfolio.viewProject}
            allLabel={dict.common.allCategories}
            emptyLabel={dict.portfolio.empty}
          />
        </Container>
      </section>

      {/* انیمیشن موج */}
      <style>{`
        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-flow-slower { animation: wave-flow 32s linear infinite; }
        .animate-wave-flow-slow { animation: wave-flow 24s linear infinite; }
        .animate-wave-flow-fast { animation: wave-flow 14s linear infinite; }
      `}</style>
    </div>
  );
}