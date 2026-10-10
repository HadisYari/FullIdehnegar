// app/[locale]/about/page.tsx
import type { Metadata } from "next";
import { aboutSection, loadAboutContent, loadMilestones, loadPageSections, loadTeam, withPageMeta } from "@/lib/cms";
import { resolveSection } from "@/lib/page-sections";
import { CertificationsShowcase } from "@/components/sections/about/certifications-showcase";
import { CoreValues } from "@/components/sections/about/core-values";
import { DevelopmentLifecycle } from "@/components/sections/about/development-lifecycle";
import { EngineeringPhilosophy } from "@/components/sections/about/engineering-philosophy";
import { StatsCounter } from "@/components/sections/about/stats-counter";
import { TechStack } from "@/components/sections/about/tech-stack";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
  
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";

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
  return withPageMeta("about", locale === "fa" ? "fa" : "en", {
    path: "/about",
    title: isFa
      ? "درباره ما | پیشگامان مهندسی نرم‌افزار ایده‌نگار"
      : "About Us | Idehnegar Software Studio",
    description: isFa
      ? "روایت ما در خلق پلتفرم‌های مقیاس‌پذیر، پرتال‌های سازمانی مدرن و همگرایی هنر دیزاین با مهندسی روز دنیا."
      : "Our story of architecting resilient digital platforms, enterprise software, and human-centered design.",
  });
}

/* ──────────────────────────────────────────────────────────
   موج ورودی و خروجی با انحنای نرم و بدون درز
   ────────────────────────────────────────────────────────── */
function OrganicWaveTransition({ flip = false }: { flip?: boolean }) {
  const waves = [
    {
      d: "M0,25 C320,70 540,5 820,40 C1020,65 1120,20 1200,30 L1200,90 L0,90 Z",
      opacity: 0.25,
      anim: "animate-liquid-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,35 C260,10 490,65 760,25 C980,5 1100,55 1200,38 L1200,90 L0,90 Z",
      opacity: 0.45,
      anim: "animate-liquid-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,50 C220,25 450,70 700,45 C910,20 1080,60 1200,50 L1200,90 L0,90 Z",
      opacity: 1,
      anim: "animate-liquid-medium",
      fill: "#0f0f52",
    },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none -mt-px -mb-px z-20 ${
        flip ? "rotate-180 bg-white" : "bg-white"
      }`}
    >
      <div className="relative h-[55px] sm:h-[80px] md:h-[105px] w-full">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg
                key={copy}
                viewBox="0 0 1200 90"
                preserveAspectRatio="none"
                className="h-[55px] sm:h-[80px] md:h-[105px] w-1/2 block"
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
   ایستگاه‌های روایت زمانی (Timeline Milestones)
   ────────────────────────────────────────────────────────── */
const timelineItems = [
  {
    year: "۱۴۰۳",
    titleFa: "عصر هوش مصنوعی و معماری توزیع‌شده",
    titleEn: "AI Integration & Global Edge",
    descFa: "توسعه راه‌حل‌های هوشمند مبتنی بر RAG، میکروسرویس‌های پایدار و ثبت ۵۰+ پروژه لایو با پرفورمنس سبز.",
    descEn: "RAG enterprise assistants, resilient microservices, and 50+ live platforms with sub-second speeds.",
    glow: "border-[#e6304c] shadow-[#e6304c]/20",
    gradient: "from-[#e6304c] to-rose-700",
  },
  {
    year: "۱۴۰۲",
    titleFa: "توسعه پرتال‌های پرترافیک سازمانی",
    titleEn: "High-Throughput Enterprise Portals",
    descFa: "معماری سامانه‌های مقیاس‌پذیر برای مدیریت صدها هزار تراکنش بدون وقفه با استانداردهای Zero-Trust.",
    descEn: "Architecting high-concurrency systems handling peak transactional loads with zero downtime.",
    glow: "border-blue-500 shadow-blue-500/20",
    gradient: "from-blue-600 to-[#0f0f52]",
  },
  {
    year: "۱۴۰۱",
    titleFa: "خلق سیستم دیزاین اختصاصی استودیو",
    titleEn: "Bespoke Design System Evolution",
    descFa: "شکل‌گیری زبان بصری منحصربه‌فرد ایده‌نگار با کامپوننت‌های ۶۰ فریم و ساختار مدرن بر پایه Next.js.",
    descEn: "Formulating Idehnegar's distinct design grammar with fluid 60fps micro-interactions on Next.js.",
    glow: "border-indigo-400 shadow-indigo-400/20",
    gradient: "from-indigo-600 to-slate-900",
  },
  {
    year: "۱۴۰۰",
    titleFa: "پایه‌گذاری با مانیفست کیفیت مطلق",
    titleEn: "Foundation & The Quality Pact",
    descFa: "شروع مسیر با یک باور بنیادین: حذف کامل کدهای قالب‌های آماده و بازتعریف استانداردهای نرم‌افزار سفارشی.",
    descEn: "Launching with a core manifesto: eradicating template-based web and building custom software art.",
    glow: "border-slate-500 shadow-slate-500/20",
    gradient: "from-slate-700 to-slate-900",
  },
];

/* ──────────────────────────────────────────────────────────
   کلاستر نقش‌ها و استعدادهای تیم — دادهٔ اصلی از /api/public/team
   ────────────────────────────────────────────────────────── */
const teamConstellation = [
  { role: "Software Architect", label: "معمار ارشد نرم‌افزار", span: "sm:col-span-2", bg: "bg-[#e6304c]/20 border-[#e6304c]/40 text-[#ff4d68]" },
  { role: "Product & UI/UX Lead", label: "رهبر طراحی محصول", span: "sm:col-span-1", bg: "bg-white/10 border-white/15 text-white" },
  { role: "DevOps & Cloud Engineer", label: "مهندس زیرساخت ابری", span: "sm:col-span-1", bg: "bg-white/10 border-white/15 text-white" },
  { role: "Full-Stack Engineers", label: "مهندسان فرانت و بک‌اند", span: "sm:col-span-2", bg: "bg-blue-500/20 border-blue-400/30 text-cyan-300" },
  { role: "AI & Data Engineer", label: "توسعه‌دهنده هوش مصنوعی", span: "sm:col-span-2", bg: "bg-purple-500/20 border-purple-400/30 text-purple-300" },
  { role: "QA & Performance Lead", label: "تضمین کیفیت و سرعت", span: "sm:col-span-1", bg: "bg-white/10 border-white/15 text-white" },
];

/*
 * متن محلی بلوک‌های صفحه (مانیفست، تیم، کپسول‌ها). وقتی API در دسترس است از جدول PageSection
 * خوانده می‌شود و این مقادیر فقط پشتیبان‌اند. seed هم از همین‌جا ردیف‌ها را می‌سازد.
 */
const fallbackPageSections = {
  manifesto: {
    fa: {
      eyebrow: "عهد مهندسی ما",
      title: "همه چیز را بر پایه معماری پایدار بنا می‌کنیم",
      subtitle: "«استاندارد ما کدی است که پس از سال‌ها کارکرد، همچنان سریع، خوانا و قابل افتخار باشد.»",
      body: "ما در ایده‌نگار اعتقادی به راه‌حل‌های موقتی و بزک‌شده نداریم. زمانی که مسئولیت فنی یک محصول را می‌پذیریم، خیالتان از لایه‌های امنیتی، پایداری در ترافیک‌های سنگین و توسعه‌پذیری ویژگی‌های آینده آسوده است. ما به هر خط کدی که دیپلوی می‌شود تعهد اخلاقی و فنی داریم.",
      items: [
        { title: "توسعه ۱۰۰٪ اختصاصی بدون وابستگی به قالب‌های تجاری سنگین" },
        { title: "تایپ‌سیفتی سراسری با تایپ‌اسکریپت و پایپ‌لاین‌های خودکار تست" },
        { title: "شفافیت رادیکال و دسترسی لحظه‌ای کارفرما به لاگ‌ها و پیشرفت اسپرینت" },
      ],
    },
    en: {
      eyebrow: "The Engineering Manifesto",
      title: "Everything Built on Resilient Architecture",
      subtitle: "“Our standard is code that stays fast, readable and worth being proud of for years.”",
      body: "We believe in long-term engineering integrity over quick shortcuts. When you partner with us, infrastructure resilience, strict security layers, and future-proof codebases are guaranteed by design.",
      items: [
        { title: "100% custom development with no heavy commercial templates" },
        { title: "End-to-end type safety with TypeScript and automated test pipelines" },
        { title: "Radical transparency: real-time client access to logs and sprint progress" },
      ],
    },
  },
  team: {
    fa: {
      eyebrow: "TEAM CONSTELLATION",
      title: "ترکیب استعدادها در کنار یکدیگر",
      body: "در پشت پرده هر پلتفرم موفقی، هماهنگی دقیق معماران سیستم، مهندسان رابط کاربری و متخصصان زیرساخت ابری جریان دارد. تیم ما چابک، هم‌راستا و مشتاق حل دشوارترین چالش‌های فنی است.",
    },
    en: {
      eyebrow: "TEAM CONSTELLATION",
      title: "Talent Synergy in Action",
      body: "Behind every seamless software launch stands a cross-functional squad of architects, designers, and cloud engineers moving in perfect sync.",
    },
  },
  "quick-links": {
    fa: {
      items: [
        { icon: "⚡", title: "خدمات و راهکارهای نرم‌افزار", description: "Bespoke Web • Cloud • Portals", href: "/services" },
        { icon: "★", title: "پروژه‌ها و نمونه‌های شاخص", description: "Enterprise Case Studies", href: "/portfolio" },
      ],
    },
    en: {
      items: [
        { icon: "⚡", title: "Explore Solutions", description: "Bespoke Web • Cloud • Portals", href: "/services" },
        { icon: "★", title: "View Portfolio", description: "Enterprise Case Studies", href: "/portfolio" },
      ],
    },
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const isFa = locale === "fa";

  // داده‌های صفحه از بک‌اند (با کش ISR) — fallback: آرایه‌های همین فایل
  const [remoteMilestones, remoteTeam, remoteAbout, remoteSections] = await Promise.all([
    loadMilestones(),
    loadTeam(),
    loadAboutContent(),
    loadPageSections("about"),
  ]);

  // متن بلوک‌های مانیفست، تیم و کپسول‌های دسترسی: از جدول PageSection، در نبود API متن محلی
  const manifesto = resolveSection(remoteSections, "manifesto", locale, fallbackPageSections.manifesto[locale]);
  const teamCopy = resolveSection(remoteSections, "team", locale, fallbackPageSections.team[locale]);
  const quickLinks = resolveSection(remoteSections, "quick-links", locale, fallbackPageSections["quick-links"][locale]);
  // مسیرهای داخلی در نسخه انگلیسی زیر /en قرار می‌گیرند
  const localeHref = (href: string) => (isFa || !href.startsWith("/") ? href : `/en${href}`);

  const milestones =
    remoteMilestones.length > 0
      ? remoteMilestones.map((milestone) => ({
          year: milestone.year,
          titleFa: milestone.title.fa,
          titleEn: milestone.title.en || milestone.title.fa,
          descFa: milestone.desc.fa,
          descEn: milestone.desc.en || milestone.desc.fa,
          glow: milestone.glow ?? "",
          gradient: milestone.gradient ?? "",
        }))
      : timelineItems;

  const team =
    remoteTeam.length > 0
      ? remoteTeam.map((member) => ({
          role: member.role,
          label: member.label,
          span: member.span ?? "",
          bg: member.bg ?? "",
        }))
      : teamConstellation;

  return (
    <div className="relative w-full overflow-hidden bg-white text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════
          ۱. HERO: قاب ارگانیک شناور و کیوسک تندیس دیجیتال
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <Container className="relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* سمت چپ (در نسخه فارسی): قاب فرم ارگانیک موج‌دار با نمایشگر مانیفست */}
            <div className="flex-1 w-full max-w-[460px]">
              <Reveal delay={90}>
                <div className="relative mx-auto flex items-center justify-center">
                  
                  {/* فرم ارگانیک موج‌دار و چندلایه پس‌زمینه */}
                  <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-[48px] rotate-3 bg-gradient-to-tr from-slate-100 via-rose-50/60 to-slate-100 p-4 border border-slate-200/90 shadow-2xl">
                    <div className="h-full w-full rounded-[40px] bg-white border border-slate-200 p-6 flex flex-col justify-between relative overflow-hidden -rotate-3">
                      {/* حلقه هاله گرادیان برند */}
                      <div className="absolute -top-12 -end-12 h-44 w-44 rounded-full bg-[#e6304c]/10 blur-2xl" />

                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#e6304c]" />
                          <span className="h-2 w-2 rounded-full bg-[#0f0f52]" />
                        </div>
                        <span>IDEHNEGAR MONOLITH</span>
                      </div>

                      {/* کیوسک دیجیتال نمایش کیفیت کد */}
                      <div className="my-auto space-y-3">
                        <div className="rounded-2xl bg-[#0f0f52] p-4 text-white shadow-xl">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono text-slate-300">Clean Engineering</span>
                            <span className="rounded bg-[#e6304c] px-2 py-0.5 font-mono text-[10px] font-bold">
                              100% Custom
                            </span>
                          </div>
                          <div className="mt-3 h-2 w-3/4 rounded-full bg-gradient-to-r from-[#e6304c] to-rose-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                            <div className="text-[10px] text-slate-400">Uptime SLA</div>
                            <div className="font-bold text-slate-900">99.98%</div>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                            <div className="text-[10px] text-slate-400">Response</div>
                            <div className="font-bold text-emerald-600">&lt; 35ms</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                        <span>معماری اختصاصی وب</span>
                        <span className="font-mono text-[#e6304c] font-bold">Scale-Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* پاد شناور وضعیت زنده استودیو */}
                  <div className="absolute -bottom-4 -start-4 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md flex items-center gap-3 z-20">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">استودیو فعال مهندسی</div>
                      <div className="text-[10px] text-slate-400 font-mono">Dedicated Engineering Sprints</div>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

            {/* سمت راست: تایپوگرافی تمیز و مدرن */}
            <div className="flex-1 text-center lg:text-start">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e6304c]/20 bg-[#e6304c]/10 px-3.5 py-1 text-xs font-bold text-[#e6304c]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e6304c]" />
                  {isFa ? "شناسنامه و داستان ایده‌نگار" : "About Idehnegar"}
                </div>

                <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {isFa ? (
                    <>
                      پیشگام در مهندسی وب و <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-600 to-[#0f0f52]">
                        تحول پایدار دیجیتال
                      </span>
                    </>
                  ) : (
                    <>
                      Pioneering Scalable Web &amp; <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-600 to-[#0f0f52]">
                        Digital Architecture
                      </span>
                    </>
                  )}
                </h1>

                <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {isFa
                    ? "ما در پیشگامان ایده‌نگار معتقدیم نرم‌افزارهای موفق از کدهای اتفاقی ساخته نمی‌شوند؛ آن‌ها حاصل معماری هدفمند، احترام عمیق به تجربه کاربر و اشتیاق وسواس‌گونه برای تحویل محصولاتی هستند که با رشد کسب‌وکار شما هرگز فرسوده نمی‌شوند."
                    : "At Idehnegar, we engineer scalable digital platforms built for long-term endurance. A studio founded by software craftspeople dedicated to eliminating templates and building refined systems."}
                </p>

                {/* کپسول‌های شاخص آماری */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-xs">
                    <span className="font-mono text-xl font-black text-[#0f0f52]">۵۰+</span>
                    <span className="ms-2 text-xs font-semibold text-slate-700">پلتفرم سازمانی لایو</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-xs">
                    <span className="font-mono text-xl font-black text-[#e6304c]">۱۰۰٪</span>
                    <span className="ms-2 text-xs font-semibold text-slate-700">تایپ‌سیف و بدون باگ</span>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </section>

      {/* ترنزیشن موج به سکشن سرمه‌ای */}
      <OrganicWaveTransition />

      {/* ══════════════════════════════════════════════════════════
          ۲. سفر ما در گذر زمان (تایم‌لاین روایی روی زمینه سرمه‌ای #0f0f52)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 bg-[#0f0f52] text-white">
        <Container className="relative z-10">
          <Reveal className="text-center max-w-xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold text-rose-300 uppercase tracking-widest">
              CHRONOLOGY OF CRAFTSMANSHIP
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">
              {isFa ? "سفر ما در گذر زمان" : "Our Journey Through Time"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {isFa ? "با هم ساختیم، با هم پیش می‌رویم" : "Built Together, Scaling Together"}
            </p>
          </Reveal>

          {/* ایستگاه‌های تایم‌لاین با کادرهای نئونی نرم */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, idx) => (
              <Reveal
                key={milestone.year}
                delay={idx * 80}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#e6304c] hover:bg-white/[0.08] hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`h-28 w-full rounded-2xl bg-gradient-to-br ${milestone.gradient} p-4 flex flex-col justify-between shadow-lg border border-white/10`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="h-2 w-2 rounded-full bg-white/70" />
                      <span className="rounded-full bg-white/20 px-3 py-0.5 font-mono text-xs font-black text-white">
                        {milestone.year}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-white/70">
                      Idehnegar Chapter #{4 - idx}
                    </div>
                  </div>

                  <h3 className="mt-4 text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                    {isFa ? milestone.titleFa : milestone.titleEn}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {isFa ? milestone.descFa : milestone.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>Milestone Verified</span>
                  <span className="text-emerald-400">Done ✓</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ترنزیشن خروج از سرمه‌ای به سفید */}
      <OrganicWaveTransition flip />

      {/* ══════════════════════════════════════════════════════════
          ۳. مانیفست تعهد و امضای کیفیت (زمینه روشن با چیدمان نامتقارن)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* کارت پرتره استودیویی و مانیفست لیدرها */}
            <div className="flex-1 w-full max-w-[380px]">
              <Reveal delay={90}>
                <div className="relative mx-auto rounded-[36px] border-2 border-slate-200 bg-slate-50 p-3 shadow-2xl">
                  <div className="h-96 w-full rounded-[28px] bg-gradient-to-b from-[#0f0f52] via-[#16145a] to-[#070720] p-6 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="rounded-full bg-[#e6304c] px-3 py-1 font-bold text-white">
                        Core Principles
                      </span>
                      <span className="text-white/40">EST. 2020</span>
                    </div>

                    <div className="my-auto text-center space-y-2">
                      <div className="h-20 w-20 mx-auto rounded-3xl border border-[#e6304c]/60 bg-white/5 flex items-center justify-center font-mono text-2xl font-black text-white shadow-xl">
                        IN
                      </div>
                      <div className="font-bold text-base text-white">پیشگامان ایده‌نگار</div>
                      <div className="text-xs text-white/60 font-mono">Engineering &amp; Product Guild</div>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md text-center text-xs text-white/90 leading-relaxed">
                      {manifesto.subtitle}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* گزاره مأموریت استودیو */}
            <div className="flex-1 text-center lg:text-start">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0f0f52]/10 px-3.5 py-1 text-xs font-bold text-[#0f0f52]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0f0f52]" />
                  {manifesto.eyebrow}
                </div>

                <h2 className="mt-4 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {manifesto.title}
                </h2>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {manifesto.body}
                </p>

                <div className="mt-6 space-y-3">
                  {manifesto.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">
                        ✓
                      </span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </section>

      {/* ترنزیشن موج به سکشن سرمه‌ای تیم */}
      <OrganicWaveTransition />

      {/* ══════════════════════════════════════════════════════════
          ۴. صورت‌فلکی تیم و استعدادها (پادهای ارگانیک و نامتقارن)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 bg-[#0f0f52] text-white">
        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* متن معرفی تیم */}
            <div className="flex-1 text-center lg:text-start">
              <Reveal>
                <span className="font-mono text-xs font-bold text-rose-300 uppercase tracking-widest">
                  {teamCopy.eyebrow}
                </span>
                <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">
                  {teamCopy.title}
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {teamCopy.body}
                </p>

                <div className="mt-8">
                  <Link
                    href={isFa ? "/contact" : "/en/contact"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e6304c] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#e6304c]/30 hover:bg-[#ff3b59] transition-all"
                  >
                    <span>{isFa ? "شروع همکاری و گفت‌وگوی فنی" : "Collaborate With Us"}</span>
                    <span className={`transform ${isFa ? "rotate-180" : ""}`}>→</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* پادهای هندسی و نامتقارن تخصص‌ها */}
            <div className="flex-1 w-full max-w-[480px]">
              <Reveal delay={100}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {team.map((node, i) => (
                    <div
                      key={i}
                      className={`${node.span} ${node.bg} rounded-2xl border p-4 backdrop-blur-md flex flex-col justify-between h-24 sm:h-28 shadow-lg transition-transform duration-300 hover:scale-[1.03]`}
                    >
                      <div className="flex justify-between items-center font-mono text-[9px] text-white/50">
                        <span>DISCIPLINE #{i + 1}</span>
                        <span className="h-2 w-2 rounded-full bg-[#e6304c]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{node.label}</div>
                        <div className="font-mono text-[10px] text-white/60">{node.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </section>

      {/* ترنزیشن خروج از سرمه‌ای به بخش نهایی */}
      <OrganicWaveTransition flip />

      {/* ══════════════════════════════════════════════════════════
          ۵. بلوک‌های داده‌محور (از جداول درباره ما؛ در نبود API، متن محلی کامپوننت‌ها)
         ══════════════════════════════════════════════════════════ */}
      <CoreValues
        locale={locale}
        items={remoteAbout?.coreValues}
        copy={aboutSection(remoteAbout, "values")}
      />
      <CertificationsShowcase
        locale={locale}
        items={remoteAbout?.certifications}
        copy={aboutSection(remoteAbout, "certifications")}
      />
      <DevelopmentLifecycle
        locale={locale}
        items={remoteAbout?.lifecycleSteps}
        copy={aboutSection(remoteAbout, "lifecycle")}
      />
      <EngineeringPhilosophy
        locale={locale}
        items={remoteAbout?.philosophyPrinciples}
        copy={aboutSection(remoteAbout, "philosophy")}
      />
      <StatsCounter locale={locale} items={remoteAbout?.stats} />
      <TechStack
        locale={locale}
        items={remoteAbout?.techStackGroups}
        copy={aboutSection(remoteAbout, "tech-stack")}
      />

      {/* ══════════════════════════════════════════════════════════
          ۵. کپسول‌های دسترسی سریع به خدمات و نمونه‌کارها
         ══════════════════════════════════════════════════════════ */}
      <section className="relative py-12 bg-white border-t mb-12 border-slate-100">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {quickLinks.items.map((item, index) => (
              <Link
                key={index}
                href={localeHref(item.href ?? "/")}
                className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xs hover:border-[#e6304c] hover:bg-white hover:shadow-xl hover:shadow-[#e6304c]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f0f52] text-white font-mono text-sm font-bold group-hover:bg-[#e6304c] transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#e6304c] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.description}
                    </span>
                  </div>
                </div>
                <span className={`text-slate-400 group-hover:text-[#e6304c] font-bold ${isFa ? "rotate-180" : ""}`}>
                  →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* بخش تماس استاندارد */}
      {/* <ContactSection locale={locale} dict={dict} /> */}

      {/* انیمیشن موج‌های ارگانیک با کامپایل استاندارد در سرور */}
      <style>{`
        @keyframes liquid-drift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-liquid-slower {
          animation: liquid-drift 32s linear infinite;
        }
        .animate-liquid-slow {
          animation: liquid-drift 24s linear infinite;
        }
        .animate-liquid-medium {
          animation: liquid-drift 18s linear infinite;
        }
      `}</style>
    </div>
  );
}