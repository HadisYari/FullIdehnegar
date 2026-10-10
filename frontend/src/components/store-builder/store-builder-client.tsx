"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import type { LocalizedList, LocalizedText, PageSectionDto, StoreTemplateDto } from "@/lib/cms";
import { resolveSection } from "@/lib/page-sections";
import { localeHref } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/dictionaries";

/* ──────────────────────────────────────────────────────────
   موج متحرک بالای سکشن سرمه‌ای
   ────────────────────────────────────────────────────────── */
function LiquidWaveTop() {
  const waves = [
    { d: "M0,55 C150,20 350,90 500,55 C650,20 850,90 1000,55 L1000,100 L0,100 Z", opacity: 0.12, anim: "animate-wave-slower", fill: "#e6304c" },
    { d: "M0,58 C180,30 320,85 500,58 C680,30 820,85 1000,58 L1000,100 L0,100 Z", opacity: 0.2, anim: "animate-wave-slow", fill: "#e6304c" },
    { d: "M0,62 C120,40 280,88 500,62 C720,36 880,80 1000,62 L1000,100 L0,100 Z", opacity: 0.32, anim: "animate-wave-medium", fill: "#e6304c" },
    { d: "M0,66 C200,42 360,90 500,66 C640,42 800,90 1000,66 L1000,100 L0,100 Z", opacity: 0.48, anim: "animate-wave-fast", fill: "#e6304c" },
    { d: "M0,72 C160,48 340,92 500,72 C660,52 840,92 1000,72 L1000,100 L0,100 Z", opacity: 1, anim: "animate-wave-faster", fill: "#0f0f52" },
  ];

  return (
    <div className="absolute left-0 top-0 z-20 w-full -translate-y-[99%] overflow-hidden leading-none pointer-events-none">
      <div className="relative h-[60px] w-full sm:h-[90px] md:h-[130px]">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-[60px] w-1/2 sm:h-[90px] md:h-[130px] block">
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
   موج متحرک پایین سکشن سرمه‌ای
   ────────────────────────────────────────────────────────── */
function LiquidWaveBottom() {
  const waves = [
    { d: "M0,45 C150,80 350,10 500,45 C650,80 850,10 1000,45 L1000,0 L0,0 Z", opacity: 0.15, anim: "animate-wave-slower", fill: "#e6304c" },
    { d: "M0,42 C180,70 320,15 500,42 C680,70 820,15 1000,42 L1000,0 L0,0 Z", opacity: 0.25, anim: "animate-wave-slow", fill: "#e6304c" },
    { d: "M0,38 C120,60 280,12 500,38 C720,64 880,20 1000,38 L1000,0 L0,0 Z", opacity: 0.4, anim: "animate-wave-medium", fill: "#e6304c" },
    { d: "M0,34 C200,58 360,10 500,34 C640,58 800,10 1000,34 L1000,0 L0,0 Z", opacity: 0.6, anim: "animate-wave-fast", fill: "#e6304c" },
    { d: "M0,28 C160,52 340,8 500,28 C660,48 840,8 1000,28 L1000,0 L0,0 Z", opacity: 1, anim: "animate-wave-faster", fill: "#0f0f52" },
  ];

  return (
    <div className="absolute left-0 bottom-0 z-20 w-full translate-y-[99%] overflow-hidden leading-none pointer-events-none">
      <div className="relative h-[60px] w-full sm:h-[90px] md:h-[130px]">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute top-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-[60px] w-1/2 sm:h-[90px] md:h-[130px] block">
                <path d={wave.d} fill={wave.fill} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* کپی ثابت متن‌های بخش‌های این صفحه (فارسی). سید داده بک‌اند از همین literal ساخته می‌شود. */
const fallbackSections = {
  intro: {
    fa: {
      body: "قالب و معماری مورد نیاز کسب‌وکار خود را انتخاب کنید، پیش‌نمایش را بررسی کرده و برای راه‌اندازی فروشگاه با تیم ایده‌نگار در تماس باشید.",
    },
    en: {
      body: "Choose the template and architecture your business needs, review the previews, and contact our team to set up your store.",
    },
  },
  "final-cta": {
    fa: {
      title: "آماده راه‌اندازی فروشگاه اینترنتی خود هستید؟",
      body: "پس از هماهنگی با تیم ایده‌نگار، لایسنس فروشگاه و زیرساخت سرور شما در کمتر از ۱۰ دقیقه به‌صورت اتوماتیک کانفیگ و تحویل داده می‌شود.",
    },
    en: {
      title: "Ready to launch your online store?",
      body: "After we agree on the details with the Idehnegar team, your store license and server infrastructure are configured and delivered automatically within 10 minutes.",
    },
  },
};

export function StoreBuilderClient({
  templates,
  sections,
  locale = "fa",
}: {
  templates: StoreTemplateDto[];
  /** بلوک‌های متنی از /api/public/page-sections/store-builder — fallback: fallbackSections */
  sections?: PageSectionDto[];
  locale?: Locale;
}) {
  const isFa = locale === "fa";
  /** متن ثابت دوزبانه: فارسی برای / و انگلیسی برای /en */
  const tr = (fa: string, en: string) => (isFa ? fa : en);
  const numberLocale = isFa ? "fa-IR" : "en-US";
  const pick = (value?: LocalizedText | null) => (value ? (isFa ? value.fa : value.en || value.fa) : "");
  const pickList = (value?: LocalizedList | null): string[] =>
    value ? (isFa ? value.fa : value.en?.length ? value.en : value.fa) : [];
  const intro = resolveSection(sections, "intro", locale, fallbackSections.intro[locale]);
  const finalCta = resolveSection(sections, "final-cta", locale, fallbackSections["final-cta"][locale]);

  const [activeCategory, setActiveCategory] = useState<"warehouse" | "light">("warehouse");
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0]?.id ?? "wh-1");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const filteredTemplates = templates.filter((t) => t.category === activeCategory);

  const currentTemplate =
    templates.find((t) => t.id === activeTemplateId) || filteredTemplates[0] || templates[0];

  const currentScreens =
    deviceMode === "desktop"
      ? currentTemplate?.desktopScreens ?? []
      : currentTemplate?.mobileScreens ?? [];

  const activeScreen = currentScreens[activeScreenIndex] || currentScreens[0];

  const currentPrice =
    billingCycle === "yearly"
      ? currentTemplate?.priceYearly ?? 0
      : currentTemplate?.priceMonthly ?? 0;

   

  if (!currentTemplate) return null;

  return (
    <div className="relative w-full overflow-hidden bg-white text-slate-900">

      {/* ══════════════════════════════════════════════════════════
          ۱. هدر اصلی و کلیدهای سوییچ دو دسته
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-slate-50 via-white to-white">
        <Container className="relative z-10 text-center max-w-3xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e6304c]/20 bg-[#e6304c]/10 px-3.5 py-1 text-xs font-bold text-[#e6304c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e6304c] animate-pulse" />
              {tr("فروشگاه‌ساز ابری • راه‌اندازی سریع", "Cloud store builder • fast setup")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {tr("انتخاب قالب فروشگاه", "Choose a store template")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-600 to-[#0f0f52]">
                {tr("راه‌اندازی سریع با پشتیبانی پیشگامان ایده‌نگار", "Fast setup with Idehnegar support")}
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              {intro.body}
            </p>

            {/* سوییچر دوره ماهانه / سالانه */}
            <div className="mt-6 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tr("ماهانه", "Monthly")}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-[#0f0f52] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tr("سالانه", "Yearly")}</span>
                <span className="bg-[#e6304c] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {tr("تخفیف ویژه", "Special offer")}
                </span>
              </button>
            </div>

            {/* سوییچر دسته‌ها */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("warehouse");
                  const first = templates.find((t) => t.category === "warehouse");
                  setActiveTemplateId(first?.id ?? templates[0]?.id ?? "wh-1");
                  setActiveScreenIndex(0);
                }}
                className={`group relative w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                  activeCategory === "warehouse"
                    ? "bg-[#0f0f52] text-white shadow-xl shadow-[#0f0f52]/30 ring-4 ring-[#0f0f52]/15 -translate-y-1"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:-translate-y-0.5"
                }`}
              >
                <span>📦 {templates.filter((t) => t.category === "warehouse").length} {tr("قالب با انبارداری جامع", "templates with full warehousing")}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeCategory === "warehouse" ? "bg-[#e6304c] text-white" : "bg-slate-300 text-slate-700"
                }`}>
                  {tr("سازمانی", "Enterprise")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory("light");
                  const first = templates.find((t) => t.category === "light");
                  setActiveTemplateId(first?.id ?? templates[0]?.id ?? "light-1");
                  setActiveScreenIndex(0);
                }}
                className={`group relative w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                  activeCategory === "light"
                    ? "bg-[#e6304c] text-white shadow-xl shadow-[#e6304c]/30 ring-4 ring-[#e6304c]/20 -translate-y-1"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:-translate-y-0.5"
                }`}
              >
                <span>⚡ {templates.filter((t) => t.category === "light").length} {tr("قالب بدون انبارداری", "templates without warehousing")}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeCategory === "light" ? "bg-[#0f0f52] text-white" : "bg-slate-300 text-slate-700"
                }`}>
                  {tr("راه‌اندازی فوری", "Instant setup")}
                </span>
              </button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ۲. استودیوی تعاملی
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 bg-[#0f0f52] text-white">

        <LiquidWaveTop />

        <Container className="relative z-10">

          {/* تب‌های انتخاب قالب‌ها */}
          {activeCategory === "warehouse" && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3 text-xs text-rose-300">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="animate-bounce">👇</span>
                  {tr("قالب دلخواه را انتخاب کنید:", "Choose the template you want:")}
                </span>
                <span className="text-white/60 hidden sm:inline">
                  {tr("قیمت دوره", "Price for")} {billingCycle === "yearly" ? tr("یک‌ساله", "1 year") : tr("یک‌ماهه", "1 month")}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredTemplates.map((t, idx) => {
                  const isActive = t.id === currentTemplate.id;
                  const displayPrice = billingCycle === "yearly" ? t.priceYearly : t.priceMonthly;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setActiveTemplateId(t.id);
                        setActiveScreenIndex(0);
                      }}
                      className={`group relative rounded-2xl p-3.5 text-start transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                        isActive
                          ? "bg-gradient-to-br from-[#e6304c] to-rose-700 border-[#ff5e77] text-white shadow-xl shadow-[#e6304c]/40 ring-4 ring-[#e6304c]/30 -translate-y-1"
                          : "bg-white/[0.06] border-white/15 text-slate-300 hover:bg-white/[0.12] hover:border-white/30 hover:-translate-y-0.5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                          }`}>
                            {tr("تمپلیت ۰", "Template 0")}{idx + 1}
                          </span>
                          {isActive && (
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-black line-clamp-1 group-hover:text-white block">
                          {pick(t.name)}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-white/70">{tr("اشتراک:", "Subscription:")}</span>
                        <span className="font-bold font-mono text-amber-300">
                          {displayPrice.toLocaleString(numberLocale)} {tr("تومان", "Toman")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* پنل استودیو */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.04] border border-white/15 rounded-3xl p-5 sm:p-8 backdrop-blur-md shadow-2xl">

            {/* ستون راست: توضیحات و قیمت */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 text-xs font-bold">
                      {pick(currentTemplate.tag)}
                    </span>
                    <span className="text-xs text-white/40">{tr("آماده تحویل", "Ready to deliver")}</span>
                  </div>

                  {pick(currentTemplate.discountBadge) && billingCycle === "yearly" && (
                    <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-lg">
                      {pick(currentTemplate.discountBadge)}
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">
                  {pick(currentTemplate.name)}
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {pick(currentTemplate.desc)}
                </p>

                {/* کارت قیمت */}
                <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{tr("مبلغ اشتراک", "Subscription amount")} ({billingCycle === "yearly" ? tr("سالانه", "yearly") : tr("ماهانه", "monthly")}):</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-amber-300 font-mono">
                        {currentPrice.toLocaleString(numberLocale)}
                      </span>
                      <span className="text-xs text-slate-300">{tr("تومان", "Toman")}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                      ✓ {tr("تحویل و فعال‌سازی فوری", "Delivery and instant activation")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {pickList(currentTemplate.features).map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* انتخاب دیوایس و تصاویر */}
              <div className="pt-5 border-t border-white/10 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">{tr("نمایشگر دستگاه:", "Device preview:")}</span>
                  <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/15">
                    <button
                      type="button"
                      onClick={() => {
                        setDeviceMode("desktop");
                        setActiveScreenIndex(0);
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        deviceMode === "desktop"
                          ? "bg-[#e6304c] text-white shadow-md shadow-[#e6304c]/40"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>🖥️ {tr("دسکتاپ", "Desktop")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeviceMode("mobile");
                        setActiveScreenIndex(0);
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        deviceMode === "mobile"
                          ? "bg-[#e6304c] text-white shadow-md shadow-[#e6304c]/40"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>📱 {tr("موبایل", "Mobile")}</span>
                    </button>
                  </div>
                </div>

                {/* پیش‌نمایش تب‌های عکس */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-300 font-bold">
                      {tr("عکس بخش‌های این تمپلیت:", "Screens of this template:")}
                    </span>
                    <span className="text-[10px] text-rose-300 animate-pulse">
                      {tr("کلیک برای تغییر عکس 🖱️", "Click a screen to switch 🖱️")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentScreens.map((s, idx) => {
                      const isScreenActive = activeScreenIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveScreenIndex(idx)}
                          className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border flex items-center gap-2 ${
                            isScreenActive
                              ? "bg-white text-slate-900 border-white shadow-lg ring-2 ring-white/50 -translate-y-0.5"
                              : "bg-white/10 border-white/20 text-slate-200 hover:bg-white/20 hover:border-white/40 hover:text-white hover:-translate-y-0.5"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${isScreenActive ? "bg-[#e6304c]" : "bg-white/40"}`} />
                          <span>{pick(s.label)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* دکمه‌های اکشن: درخواست دمو و مشاوره */}
                <div className="pt-3 space-y-2">
                  

                  <div className="flex items-center justify-start px-1 text-[11px] text-slate-400">
                    <Link
                      href={`${localeHref(locale, "/contact")}?template=${currentTemplate.id}`}
                      className="text-rose-300 hover:text-white underline underline-offset-4"
                    >
                      {tr("نیاز به دمو یا مشاوره دارید؟", "Need a demo or consultation?")}
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* ستون چپ: قاب تغییر سایز بر اساس دسکتاپ و موبایل */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 sm:p-4">

              {deviceMode === "desktop" ? (
                /* قاب دسکتاپ */
                <div className="w-full rounded-2xl border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-800 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="ms-2 font-bold text-slate-200">{pick(activeScreen?.label)}</span>
                    </div>
                    <span>1920 × 1080</span>
                  </div>

                  <div className="relative aspect-[16/10] w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center text-center p-4">
                    {/* برای فعال‌سازی عکس واقعی کافیست تگ زیر را از کامنت خارج کنید */}
                    {/* <Image src={activeScreen.src} alt={activeScreen.label} fill className="object-cover" /> */}
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <span className="text-3xl">🖥️</span>
                      <span className="text-sm font-bold text-white">{pick(activeScreen?.label)}</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {tr("مسیر:", "Path:")} {activeScreen?.src}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* قاب موبایل */
                <div className="w-56 sm:w-64 rounded-[36px] border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl transition-all duration-300">
                  <div className="relative aspect-[9/19] w-full rounded-[26px] bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-16 rounded-full bg-slate-950 z-10" />
                    {/* برای فعال‌سازی عکس واقعی کافیست تگ زیر را از کامنت خارج کنید */}
                    {/* <Image src={activeScreen.src} alt={activeScreen.label} fill className="object-cover" /> */}
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <span className="text-3xl">📱</span>
                      <span className="text-xs font-bold text-white">{pick(activeScreen?.label)}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tr("مسیر:", "Path:")} {activeScreen?.src}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <span className="mt-3 text-[11px] text-slate-400">
                {tr("در حال نمایش:", "Now showing:")} <strong className="text-white">{pick(activeScreen?.label)}</strong> ({deviceMode === "desktop" ? tr("نسخه عریض دسکتاپ", "wide desktop version") : tr("نسخه موبایل", "mobile version")})
              </span>

            </div>

          </div>

        </Container>

        <LiquidWaveBottom />
      </section>

      {/* ══════════════════════════════════════════════════════════
          ۳. سکشن پایانی CTA
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-24 sm:pt-32 sm:pb-32 bg-gradient-to-t from-slate-100 via-rose-50/20 to-white">
        <Container className="relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="h-14 w-14 mx-auto rounded-2xl bg-[#e6304c]/10 text-[#e6304c] flex items-center justify-center text-2xl shadow-sm mb-4">
              💳
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {finalCta.title}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {finalCta.body}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
             
              <Link
                href={localeHref(locale, "/contact")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-xs cursor-pointer"
              >
                <span>{tr("درخواست مشاوره اختصاصی", "Request a private consultation")}</span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* استایل‌های انیمیشن موج‌های متحرک */}
      <style>{`
        @keyframes waveDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-slower { animation: waveDrift 30s linear infinite; }
        .animate-wave-slow { animation: waveDrift 24s linear infinite; }
        .animate-wave-medium { animation: waveDrift 18s linear infinite; }
        .animate-wave-fast { animation: waveDrift 14s linear infinite; }
        .animate-wave-faster { animation: waveDrift 10s linear infinite; }
      `}</style>
    </div>
  );
}

export default StoreBuilderClient;
