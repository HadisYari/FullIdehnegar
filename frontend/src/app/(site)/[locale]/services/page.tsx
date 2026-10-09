// app/[locale]/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
 
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { getDictionaryForLocale, getPageContent } from "@/lib/cms";

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
  const page = await getPageContent("services", typedLocale);
  return {
    title: page?.metaTitle || (isFa ? "معماری نرم‌افزار و پلتفرم‌های وب | استودیو ایده‌نگار" : "Web Platforms & Software Architecture | Ideh Negar"),
    description: page?.metaDescription || (isFa
      ? "توسعه نرم‌افزارهای مدرن، پرتال‌های سازمانی، فروشگاه‌های آنلاین مقیاس‌پذیر و طراحی وب اختصاصی."
      : "High-performance web applications, scalable enterprise platforms, and bespoke digital experiences."),
    alternates: {
      canonical: page?.canonicalUrl || (isFa ? "/services" : "/en/services"),
      languages: { fa: "/services", en: "/en/services" },
    },
    openGraph: {
      title: page?.openGraphTitle || page?.metaTitle || undefined,
      description: page?.openGraphDescription || page?.metaDescription || undefined,
      images: page?.imagePath ? [{ url: page.imagePath }] : undefined,
    },
  };
}

/* ──────────────────────────────────────────────────────────
   ۱. موج ورودی: از سفید به سرمه‌ای (بالای سکشن‌های سرمه‌ای)
   ────────────────────────────────────────────────────────── */
function FlowingWaveWhiteToNavy({ bg = "bg-white" }: { bg?: string }) {
  const waves = [
    {
      d: "M0,35 C280,5 480,70 720,30 C940,5 1100,65 1200,35 L1200,100 L0,100 Z",
      opacity: 0.22,
      anim: "animate-wave-flow-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,45 C220,15 420,70 680,40 C880,10 1040,70 1200,45 L1200,100 L0,100 Z",
      opacity: 0.42,
      anim: "animate-wave-flow-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,58 C200,25 400,75 660,50 C860,20 1040,70 1200,58 L1200,100 L0,100 Z",
      opacity: 0.75,
      anim: "animate-wave-flow-medium",
      fill: "#141460",
    },
    {
      d: "M0,68 C160,35 360,80 620,60 C820,32 1000,75 1200,68 L1200,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-flow-fast",
      fill: "#0f0f52",
    },
  ];

  return (
    <div className={`relative w-full overflow-hidden leading-none pointer-events-none -mt-px -mb-px z-20 ${bg}`}>
      <div className="relative h-[48px] sm:h-[75px] md:h-[95px] w-full">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
                className="h-[48px] sm:h-[75px] md:h-[95px] w-1/2 block"
              >
                <path d={wave.d} fill={wave.fill} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ۲. موج خروجی: دقیقاً سوار بر زمینه سرمه‌ای (#0f0f52) به سمت سفید
   ────────────────────────────────────────────────────────── */
function FlowingWaveNavyToWhite({ bg = "bg-[#0f0f52]" }: { bg?: string }) {
  const waves = [
    {
      d: "M0,35 C280,5 480,70 720,30 C940,5 1100,65 1200,35 L1200,100 L0,100 Z",
      opacity: 0.22,
      anim: "animate-wave-flow-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,45 C220,15 420,70 680,40 C880,10 1040,70 1200,45 L1200,100 L0,100 Z",
      opacity: 0.42,
      anim: "animate-wave-flow-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,58 C200,25 400,75 660,50 C860,20 1040,70 1200,58 L1200,100 L0,100 Z",
      opacity: 0.8,
      anim: "animate-wave-flow-medium",
      fill: "#f8fafc",
    },
    {
      d: "M0,68 C160,35 360,80 620,60 C820,32 1000,75 1200,68 L1200,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-flow-fast",
      fill: "#ffffff",
    },
  ];

  return (
    <div className={`relative w-full overflow-hidden leading-none pointer-events-none -mt-px -mb-px z-20 ${bg}`}>
      <div className="relative h-[48px] sm:h-[75px] md:h-[95px] w-full">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
                className="h-[48px] sm:h-[75px] md:h-[95px] w-1/2 block"
              >
                <path d={wave.d} fill={wave.fill} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ویجت‌های بصری تخصصی برای هر سرویس
   ────────────────────────────────────────────────────────── */
function ServiceVisualMasterpiece({ index }: { index: number }) {
  switch (index) {
    case 0:
      // ۱. طراحی وب‌سایت: لایه‌های معمارانه سه‌بعدی دیزاین‌سیستم و کد
      return (
        <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center p-2">
          <div className="relative w-full">
            <div className="absolute -top-4 -start-3 h-48 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-3 opacity-60 backdrop-blur-xs">
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>GRID: 12-COL / 1440px</span>
                <span>FIBONACCI RATIO</span>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-200/90">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e6304c]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ms-2 font-mono text-[10px] text-slate-400">custom-experience.tsx</span>
                </div>
                <span className="rounded-md bg-[#e6304c]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#e6304c]">
                  React 19 / SSR
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#0f0f52] to-[#181861] p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/50">Fluid Micro-interactions</span>
                    <h4 className="text-xs font-bold text-white">Bespoke Design System</h4>
                  </div>
                  <span className="rounded-full bg-[#e6304c] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    60 FPS
                  </span>
                </div>
                <div className="mt-3.5 space-y-1.5">
                  <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-[#e6304c] via-rose-400 to-amber-300" />
                  <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-center">
                  <span className="text-slate-400 block text-[9px]">Lighthouse</span>
                  <span className="font-bold text-emerald-600">100 / 100</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-center">
                  <span className="text-slate-400 block text-[9px]">Type-Safety</span>
                  <span className="font-bold text-[#0f0f52]">Strict 100%</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-center">
                  <span className="text-slate-400 block text-[9px]">TTFB Speed</span>
                  <span className="font-bold text-[#e6304c]">28ms Edge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 1:
      // ۲. پرتال سازمانی: دیاگرام زنده کلاستر و میکروسرویس‌ها
      return (
        <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center p-2">
          <div className="w-full rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white">Cluster Health: Healthy</span>
              </div>
              <span className="rounded-full bg-[#e6304c]/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-300 border border-[#e6304c]/30">
                High Availability
              </span>
            </div>

            <div className="my-6 relative flex items-center justify-between px-2">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  API
                </div>
                <span className="font-mono text-[9px] text-white/50">Gateway</span>
              </div>

              <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-400 via-[#e6304c] to-emerald-400 mx-2 relative">
                <span className="absolute -top-1 start-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#e6304c] animate-ping" />
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e6304c] bg-[#e6304c]/20 text-[#ff4d68] font-mono text-xs font-bold shadow-[0_0_20px_rgba(230,48,76,0.3)]">
                  Core
                </div>
                <span className="font-mono text-[9px] text-white/50">Microservice</span>
              </div>

              <div className="h-0.5 flex-1 bg-gradient-to-r from-[#e6304c] to-emerald-400 mx-2" />

              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                  DB
                </div>
                <span className="font-mono text-[9px] text-white/50">Postgres Cluster</span>
              </div>
            </div>

            <div className="rounded-2xl bg-black/40 p-3.5 border border-white/10 font-mono text-xs">
              <div className="flex justify-between items-center text-white/70">
                <span>Concurrent Operations:</span>
                <span className="font-bold text-white">142,850 req/sec</span>
              </div>
              <div className="mt-2 flex justify-between items-center text-white/70">
                <span>RBAC Security Level:</span>
                <span className="text-emerald-400 font-bold">Zero-Trust Active</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 2:
      // ۳. فروشگاه مقیاس‌پذیر: مانیتورینگ نرخ تبدیل و تسویه‌حساب سریع
      return (
        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e6304c]" />
                <span className="text-xs font-bold text-slate-800">High-Concurrency Checkout</span>
              </div>
              <span className="font-mono text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                99.99% Success
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3 h-24 px-2 border-b border-slate-100 pb-2">
              {[40, 65, 50, 85, 95, 75, 100].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    style={{ height: `${val}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      idx === 6
                        ? "bg-[#e6304c] shadow-lg shadow-[#e6304c]/30"
                        : "bg-[#0f0f52]/25"
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{val}k</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>تراکنش‌های میلیونی بدون وقفه</span>
              <span className="font-mono font-bold text-slate-900">Zero Drop-off</span>
            </div>
          </div>
        </div>
      );

    case 3:
      // ۴. سئو و پرفورمنس: رادار اسکن با نمره ۱۰۰ لایت‌هاوس
      return (
        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center">
          <div className="relative w-full rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-bold text-white">Google Lighthouse Full Audit</span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                Green Benchmarks
              </span>
            </div>
            <div className="my-5 flex items-center justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#e6304c] bg-[#e6304c]/10 shadow-[0_0_25px_rgba(230,48,76,0.35)]">
                <span className="font-mono text-3xl font-black text-white">100</span>
                <span className="absolute -bottom-3 rounded-full bg-[#0f0f52] px-2.5 py-0.5 text-[9px] font-bold text-white border border-white/20">
                  Performance
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs text-white/70">
              <div className="rounded-xl bg-white/5 p-2 border border-white/5">
                <div className="text-[10px] text-white/40">TTFB</div>
                <div className="font-bold text-emerald-400">&lt; 40ms</div>
              </div>
              <div className="rounded-xl bg-white/5 p-2 border border-white/5">
                <div className="text-[10px] text-white/40">Semantic Index</div>
                <div className="font-bold text-white">Instant Rich Snippets</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 4:
      // ۵. DevOps و کلاود: پایپ‌لاین انتشار بدون اختلال
      return (
        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800">CI/CD Continuous Deployment</span>
              <span className="text-xs font-mono font-bold text-emerald-600">Passed ✓</span>
            </div>
            <div className="mt-4 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-slate-600">Container Cluster</span>
                <span className="text-[#0f0f52] font-bold">Docker / Kubernetes</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <span className="text-slate-600">Zero-Downtime Live</span>
                <span className="text-emerald-600 font-bold">Active SLA 99.98%</span>
              </div>
            </div>
            <div className="mt-4 text-center rounded-xl bg-[#0f0f52] py-2 text-xs font-bold text-white">
              زیرساخت ابری خودکار و پایش دائمی
            </div>
          </div>
        </div>
      );

    case 5:
      // ۶. هوش مصنوعی و اتوماسیون: فرآیندهای عصبی RAG
      return (
        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center">
          <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#e6304c] animate-ping" />
                <span className="text-xs font-bold text-white">Enterprise AI Engine</span>
              </div>
              <span className="text-[10px] font-mono text-rose-300 bg-[#e6304c]/20 px-2 py-0.5 rounded-md">
                RAG + Copilots
              </span>
            </div>
            <div className="my-4 rounded-2xl bg-black/40 p-3.5 border border-white/10 font-mono text-xs text-white/90">
              <div className="text-white/40 text-[10px]">$ workflow.automate()</div>
              <div className="mt-1.5 text-[#ff667e]">✓ Knowledge base synced</div>
              <div className="text-emerald-400">✓ 24/7 Intelligent Decisions</div>
            </div>
            <div className="text-center text-xs font-bold text-white/70">
              یکپارچه‌سازی فرآیندهای سازمانی با هوش مصنوعی
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ──────────────────────────────────────────────────────────
   ویژگی‌های تخصصی هر خدمت
   ────────────────────────────────────────────────────────── */
const serviceHighlights: Record<Locale, string[][]> = {
  fa: [
    ["طراحی تجربه کاربری (UI/UX) منطبق با ترندهای روز دنیا", "پرفورمنس ۹۸+ و معماری سرورلس برای بالاترین سرعت لود", "سئو تکنیکال از خشت اول و رعایت کامل اصول Semantic Web"],
    ["طراحی ماژولار با Clean Architecture و الگوهای مقیاس‌پذیر", "داشبوردهای تحلیلی بلادرنگ با کنترل دقیق دسترسی کاربران", "یکپارچه‌سازی بی‌درز با دیتابیس‌ها و سیستم‌های مدیریت مالی و ERP"],
    ["زیرساخت اختصاصی برای مدیریت بارهای سنگین ترافیک و فروش ویژه", "سیستم جامع انبارداری، حسابداری و اتصال به چندین درگاه بانکی", "طراحی فرآیند تسویه‌حساب سریع برای کمینه‌سازی انصراف از خرید"],
    ["بهینه‌سازی عمیق شاخص‌های سرعت و Core Web Vitals گوگل", "پیاده‌سازی خودکار کدهای نشانه‌گذاری ساختاریافته (Schema Markup)", "تحلیل جامع رقبا، کی‌ورد ریسرچ و تدوین استراتژی ترافیک ارگانیک"],
    ["پایپ‌لاین خودکار CI/CD برای استقرار سریع و بدون توقف سرویس", "مدیریت کانتینرها روی سرورهای ابری با Docker و Kubernetes", "مانیتورینگ ۲۴/۷، سیستم هشدار بحران و بازیابی خودکار داده‌ها"],
    ["طراحی چت‌بات‌ها و همیارهای هوشمند مبتنی بر پایگاه دانش سازمان (RAG)", "اتوماسیون پاسخ‌گویی به مشتریان و تحلیل کیفی لیدهای فروش", "استخراج و دسته‌بندی هوشمندانه اسناد و گزارش‌گیری خودکار"],
  ],
  en: [
    ["Custom UI/UX designed in accordance with global trends", "98+ Performance and edge rendering for blazing load times", "Semantic SEO foundation built-in from line one"],
    ["Modular Clean Architecture ready for enterprise scale", "Real-time analytics dashboards with fine-grained RBAC", "Seamless integration with databases, financial systems & ERPs"],
    ["Dedicated infrastructure built for high-concurrency flash sales", "Integrated inventory, accounting, and multi-gateway billing", "Frictionless checkout flow minimizing cart abandonment"],
    ["Deep optimization of Google Core Web Vitals and TTFB", "Automated Semantic Schema implementation for rich snippets", "Competitor audits, keyword mapping, and sustainable search growth"],
    ["Automated CI/CD pipelines enabling zero-downtime deployment", "Cloud-native container orchestration with Docker & Kubernetes", "24/7 observability, incident alerts, and disaster recovery"],
    ["Custom enterprise RAG copilots integrated with company knowledge", "Automated customer inquiry handling and intelligent lead scoring", "Smart document processing and automated management reports"],
  ],
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionaryForLocale(locale);
  const isFa = locale === "fa";

  return (
    <div className="relative w-full overflow-hidden bg-white text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════
          HERO استودیو مهندسی نرم‌افزار و طراحی محصول (با رنگ سرمه‌ای اصلی)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 overflow-hidden bg-[#0f0f52] text-white">
        {/* نورهای نئونی پس‌زمینه آمبینت به رنگ لوگو */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 start-1/4 h-96 w-96 rounded-full bg-[#e6304c]/20 blur-[130px]" />
          <div className="absolute bottom-0 end-1/4 h-96 w-96 rounded-full bg-black/40 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
            
            {/* ستون متن و مانیفست */}
            <div className="flex-1 text-center lg:text-start">
              <Reveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#e6304c] animate-ping" />
                  <span className="font-mono text-xs font-semibold tracking-wider text-white/90">
                    {isFa ? "استودیو مهندسی نرم‌افزار و طراحی محصول" : "SOFTWARE ENGINEERING & PRODUCT STUDIO"}
                  </span>
                </div>

                <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.3] sm:leading-[1.2]">
                  {isFa ? (
                    <>
                      همگرایی <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] to-rose-400">هنر دیزاین</span>
                      <br className="hidden sm:block" /> و نبوغ مهندسی نرم‌افزار
                    </>
                  ) : (
                    <>
                      Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] to-rose-400">Refined Design</span>
                      <br /> Meets High-Scale Engineering
                    </>
                  )}
                </h1>

                <p className="mt-5 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed mx-auto lg:mx-0">
                  {isFa
                    ? "ما در ایده‌نگار فراتر از یک وب‌سایت معمولی عمل می‌کنیم؛ سیستم‌های تحت وب پایدار، پرتال‌های مقیاس‌پذیر و پلتفرم‌های دیجیتالی می‌سازیم که اعتبار و بازده تجاری شما را دگرگون می‌کنند."
                    : "We engineer resilient digital platforms, enterprise portals, and bespoke web solutions tailored for organizations that demand technical perfection."}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    href={isFa ? "/contact" : "/en/contact"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e6304c] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#e6304c]/30 transition-all duration-300 hover:scale-105 hover:bg-[#ff3b59]"
                  >
                    <span>{isFa ? "شروع گفت‌وگوی فنی و استعلام" : "Start Technical Discovery"}</span>
                    <span className={`transform ${isFa ? "rotate-180" : ""}`}>→</span>
                  </Link>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-xs text-white/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{isFa ? "آماده پذیرش اسپرینت‌های جدید" : "Sprint Slots Open"}</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* کنسول مهندسی دوگانه (Dual Engine) */}
            <div className="flex-1 w-full max-w-[460px] lg:max-w-[500px]">
              <Reveal delay={100}>
                <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#e6304c]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="ms-2 text-white/60">idehnegar-engine.tsx</span>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
                      LIVE COMPILED
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 font-mono text-xs">
                    <div className="rounded-xl bg-black/50 p-3.5 text-slate-300 border border-white/5 leading-relaxed overflow-x-auto text-[11px]">
                      <div className="text-white/40">{"// Enterprise Software Blueprint"}</div>
                      <div className="text-rose-400">export const <span className="text-white">Solution</span> = () =&gt; &#123;</div>
                      <div className="ps-3 text-cyan-300">architecture: <span className="text-amber-300">&apos;Clean-Modular&apos;</span>,</div>
                      <div className="ps-3 text-cyan-300">performance: <span className="text-emerald-400">&apos;99.9% Zero-Lag&apos;</span>,</div>
                      <div className="ps-3 text-cyan-300">stack: [<span className="text-amber-300">&apos;Next.js 15&apos;</span>, <span className="text-amber-300">&apos;Kubernetes&apos;</span>]</div>
                      <div className="text-rose-400">&#125;;</div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/10 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6304c] text-white font-bold text-sm shadow-md">
                          ⚡
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">Production Grade Deployment</div>
                          <div className="font-mono text-[10px] text-white/60">Sub-second Latency &bull; 60fps UI</div>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-[#e6304c] animate-ping" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </section>

      {/* موج خروجی از هیرو سرمه‌ای به سکشن سفید اول (روی زمینه سرمه‌ای سوار است) */}
      <FlowingWaveNavyToWhite bg="bg-[#0f0f52]" />

      {/* ══════════════════════════════════════════════════════════
          سکشن‌های متناوب با امواج اصلاح‌شده و بدون درز
         ══════════════════════════════════════════════════════════ */}
      <div className="relative">
        {dict.services.items.map((item, i) => {
          // سکشن ۰ (طراحی وب): سفید
          // سکشن ۱ (پرتال سازمانی): سرمه‌ای (#0f0f52)
          const isDark = i % 2 === 1;
          const isReversed = i % 2 === 1;

          return (
            <div key={item.title} className="relative">
              {/* موج ورودی به سکشن سرمه‌ای: بر روی زمینه سفید سکشن قبلی سوار است */}
              {isDark && <FlowingWaveWhiteToNavy bg="bg-white" />}

              <section
                className={`relative pt-6 pb-12 sm:pt-8 sm:pb-16 transition-colors ${
                  isDark ? "bg-[#0f0f52] text-white" : "bg-white text-slate-900"
                }`}
              >
                {isDark && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                  >
                    <div className="absolute top-1/4 start-1/4 h-72 w-72 rounded-full bg-[#e6304c]/15 blur-[120px]" />
                  </div>
                )}

                <Container className="relative z-10">
                  <div
                    className={`flex flex-col items-center gap-8 lg:gap-14 ${
                      isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                    }`}
                  >
                    {/* توضیحات و قابلیت‌ها */}
                    <div className="flex-1 text-start">
                      <Reveal>
                        <div className="flex items-center gap-2.5 mb-3">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                              isDark
                                ? "bg-[#e6304c] text-white shadow-md shadow-[#e6304c]/30"
                                : "bg-[#0f0f52] text-white shadow-sm shadow-[#0f0f52]/20"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`text-xs font-bold tracking-wider uppercase ${
                              isDark ? "text-rose-300" : "text-[#e6304c]"
                            }`}
                          >
                            {isFa ? "خدمت مهندسی" : "Engineering Capability"}
                          </span>
                        </div>

                        <h2
                          className={`text-xl sm:text-3xl font-black leading-snug tracking-tight ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.title}
                        </h2>

                        <p
                          className={`mt-3 text-xs sm:text-sm leading-relaxed ${
                            isDark ? "text-white/75" : "text-slate-600"
                          }`}
                        >
                          {item.desc}
                        </p>

                        <div className="mt-5 space-y-2.5">
                          {serviceHighlights[locale][i]?.map((highlight) => (
                            <div key={highlight} className="flex items-center gap-2.5">
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isDark
                                    ? "bg-[#e6304c]/30 text-rose-300 border border-[#e6304c]/50"
                                    : "bg-[#e6304c]/10 text-[#e6304c]"
                                }`}
                              >
                                ✓
                              </span>
                              <span
                                className={`text-xs leading-relaxed ${
                                  isDark ? "text-white/90" : "text-slate-700"
                                }`}
                              >
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-7">
                          <Link
                            href={isFa ? "/contact" : "/en/contact"}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-all duration-300 hover:scale-105 ${
                              isDark
                                ? "bg-[#e6304c] text-white hover:bg-[#ff3b59] shadow-[#e6304c]/30"
                                : "bg-[#0f0f52] text-white hover:bg-[#e6304c] shadow-slate-300"
                            }`}
                          >
                            <span>
                              {isFa ? `بررسی و استعلام ${item.title}` : `Inquire About ${item.title}`}
                            </span>
                            <span className={`transform ${isFa ? "rotate-180" : ""}`}>
                              →
                            </span>
                          </Link>
                        </div>
                      </Reveal>
                    </div>

                    {/* ویجت بصری تخصصی */}
                    <div className="flex-1 w-full">
                      <Reveal delay={100}>
                        <ServiceVisualMasterpiece index={i} />
                      </Reveal>
                    </div>
                  </div>
                </Container>
              </section>

              {/* موج خروجی: دقیقاً سوار بر رنگ سرمه‌ای سکشن (bg-[#0f0f52]) و بدون افتادن روی زمینه سفید */}
              {isDark && <FlowingWaveNavyToWhite bg="bg-[#0f0f52]" />}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
          کپسول‌های دسترسی سریع
         ══════════════════════════════════════════════════════════ */}
      <section className="relative py-12 mb-12 bg-white border-t border-slate-100">
        <Container>
          <div className="text-center max-w-lg mx-auto mb-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isFa ? "دسترسی سریع به تمام راهکارها" : "Quick Access to Solutions"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isFa
                ? "برای دریافت نقشه راه فنی و برآورد زمان‌بندی پروژه، با تیم ما در تماس باشید."
                : "Select any service to review technical deliverables and timelines."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {dict.services.items.map((srv, idx) => (
              <Link
                key={srv.title}
                href={isFa ? "/contact" : "/en/contact"}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 transition-all duration-300 hover:border-[#e6304c] hover:bg-white hover:shadow-lg hover:shadow-[#e6304c]/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f0f52] text-white font-mono text-xs font-bold transition-colors group-hover:bg-[#e6304c]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 transition-colors group-hover:text-[#e6304c]">
                      {srv.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Engineering Scope
                    </span>
                  </div>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 transition-all group-hover:border-[#e6304c] group-hover:bg-[#e6304c] group-hover:text-white">
                  <span className={`text-xs ${isFa ? "rotate-180" : ""}`}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* بخش تماس */}
      {/* <ContactSection locale={locale} dict={dict} /> */}

      {/* استایل انیمیشن امواج (کاملاً سازگار با Server Component) */}
      <style>{`
        @keyframes wave-flow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-wave-flow-slower {
          animation: wave-flow 32s linear infinite;
        }
        .animate-wave-flow-slow {
          animation: wave-flow 24s linear infinite;
        }
        .animate-wave-flow-medium {
          animation: wave-flow 18s linear infinite;
        }
        .animate-wave-flow-fast {
          animation: wave-flow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}