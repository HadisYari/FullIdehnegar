"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import type { AppDownloadLinkDto } from "@/lib/cms";

/* موج متحرک بالای بخش سرمه‌ای */
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

/* موج متحرک پایین بخش سرمه‌ای */
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

/* ──────────────────────────────────────────────────────────
   ViewModel لینک دانلود — داده از /api/public/app-download-links
   ────────────────────────────────────────────────────────── */
type LinkView = { title: string; emoji: string; href: string; variant: string };

function toLinkViews(links: AppDownloadLinkDto[]): LinkView[] {
  return links.map((link) => ({
    title: link.title.fa || link.title.en,
    emoji: link.emoji || link.caption.fa || link.caption.en || "",
    href: link.href,
    variant: link.variant || "direct",
  }));
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function GoldAppClient({ links }: { links: AppDownloadLinkDto[] }) {
  // مدیریت سوییچ بین نمای دسکتاپ (تابلو) و موبایل
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop");

  const linkViews = toLinkViews(links);
  const bazaarLink = linkViews.find((link) => link.variant === "bazaar");

  return (
    <div className="relative w-full overflow-hidden bg-white text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════
          ۱. بخش هدر و معرفی اولیه اپلیکیشن
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-36 bg-gradient-to-b from-amber-50/50 via-white to-white">
        <Container className="relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* قاب موبایل اختصاصی هدر (فقط برای قرار دادن عکس واقعی اسکرین‌شات موبایل) */}
            <div className="flex-1 w-full max-w-[420px]">
              <Reveal delay={80}>
                <div className="relative mx-auto flex items-center justify-center">
                  
                  {/* هاله نور طلایی پشت قاب */}
                  <div className="absolute -inset-4 rounded-[48px] bg-gradient-to-tr from-amber-400/20 via-yellow-500/25 to-amber-300/10 blur-2xl -z-10" />

                  {/* بدنه گوشی برای اسکرین‌شات */}
                  <div className="relative w-64 sm:w-72 rounded-[44px] border-4 border-slate-900 bg-slate-950 p-2 shadow-2xl ring-8 ring-amber-500/15">
                    {/* ناچ بالای صفحه */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-slate-900 z-30" />

                    <div className="relative aspect-[9/19] w-full rounded-[36px] overflow-hidden bg-slate-900">
                      {/* تصویر واقعی اسکرین‌شات موبایل شما */}
                      <Image
                        src="/images/portfolio/Screenshot 2026-09-22 154555.png"
                        alt="اپلیکیشن نرخ لحظه‌ای طلا و جواهر"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  {/* برچسب شناور اتصال زنده */}
                  <div className="absolute -bottom-4 -end-4 rounded-2xl border border-amber-400/50 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md z-20 flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <div className="text-xs font-black text-slate-900">اطلاعیه رسمی اتحادیه</div>
                      <div className="text-[10px] text-emerald-600 font-bold">به‌روزرسانی خودکار و لحظه‌ای</div>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

            {/* توضیحات و دکمه‌های مستقیم دانلود */}
            <div className="flex-1 text-center lg:text-start">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-800">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  سامانه نرخ لحظه‌ای طلا، سکه و ارز
                </div>

                <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  دسترسی آنی به نرخ رسمی طلا <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-[#0f0f52]">
                    روی تلفن همراه و تابلوی مغازه
                  </span>
                </h1>

                <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  با این سامانه، قیمت‌های رسمی اتحادیه طلا و جواهر (شامل مظنه آبشده، انواع مسکوکات، انس جهانی و ارزها) را بدون تاخیر ثانیه‌ای در گوشی همراه خود داشته باشید و همزمان روی تلویزیون مغازه به عنوان تابلوی دیجیتال نمایش دهید.
                </p>

                {/* دکمه‌های مستقیم دانلود — از /api/public/app-download-links */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  {linkViews.map((link) => {
                    if (link.variant === "anchor") {
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-50 px-5 py-3.5 text-xs sm:text-sm font-black text-amber-900 hover:bg-amber-100 transition-all"
                        >
                          <span>{link.title}</span>
                        </a>
                      );
                    }

                    const isBazaar = link.variant === "bazaar";

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        {...(isExternal(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={
                          isBazaar
                            ? "w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-emerald-600/25 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                            : "w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0f0f52] px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-[#0f0f52]/25 hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
                        }
                      >
                        <span className="text-lg">{link.emoji}</span>
                        <div className="text-start">
                          <span className={`text-[10px] block ${isBazaar ? "text-emerald-200" : "text-slate-300"}`}>
                            {isBazaar ? "دریافت مستقیم از" : "دانلود فایل نصبی"}
                          </span>
                          <span>{link.title}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ۲. سکشن سرمه‌ای: معرفی دو نسخه اصلی (تابلوی مغازه + موبایل)
         ══════════════════════════════════════════════════════════ */}
      <section id="display-section" className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 bg-[#0f0f52] text-white">
        
        {/* موج ورودی مماس */}
        <LiquidWaveTop />

        <Container className="relative z-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              DUAL PLATFORM DISPLAY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-white">
              یک نرم‌افزار، دو کاربرد اساسی
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300">
              برای مشاهده پیش‌نمایش هر بخش، حالت مورد نظرتان را انتخاب کنید:
            </p>

            {/* سوییچ دوگانه دسکتاپ (تابلو) و موبایل */}
            <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-black/40 border border-white/15 gap-2">
              <button
                type="button"
                onClick={() => setActiveView("desktop")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeView === "desktop"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span>🖥️ تابلوی دیجیتال مانیتور مغازه</span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">دسکتاپ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("mobile")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeView === "mobile"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span>📱 نسخه اپلیکیشن همراه</span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">موبایل</span>
              </button>
            </div>
          </Reveal>

          {/* محتوای تعاملی وابسته به سوییچ بالا */}
          <div className="bg-white/[0.04] border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
            {activeView === "desktop" ? (
              /* حالت دسکتاپ: تابلوی طلافروشی */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 text-start">
                  <span className="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 text-xs font-bold">
                    ویژه مانیتور و تلویزیون طلافروشی‌ها
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    تابلوی دیجیتال قیمت طلا و سکه
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    طراحی عریض با چیدمان شبکه‌ای و فونت‌های بزرگ خوانا، ویژه اتصال به تلویزیون یا کامپیوتر مغازه. مشتریان شما در یک نگاه تمام نرخ‌های آبشده، سکه‌ها، انس و ارزها را مشاهده می‌کنند[cite: 3].
                  </p>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>تفکیک قیمت خرید از مشتری و کمترین فروش[cite: 3]</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>نمایش ساعت و تاریخ شمسی رسمی با آخرین زمان به‌روزرسانی[cite: 3]</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>بخش اختصاصی حدیث روز و اطلاعیه‌های رسمی صنف[cite: 3]</span>
                    </div>
                  </div>
                </div>

                {/* قاب تصویر دسکتاپ */}
                <div className="lg:col-span-7">
                  <div className="w-full rounded-2xl border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl ring-4 ring-amber-500/20">
                    <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-800 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="ms-2 font-bold text-amber-300">تابلوی رسمی اعلام نرخ اتحادیه</span>
                      </div>
                      <span>افقی • مناسب تلویزیون</span>
                    </div>
                    
                    {/* تصویر واقعی اسکرین‌شات دسکتاپ */}
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-900">
                      <Image
                        src="/images/portfolio/Screenshot 2026-09-22 154538.png"
                        alt="تابلوی دسکتاپ مغازه طلافروشی"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* حالت موبایل: اپلیکیشن همراه */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4 text-start">
                  <span className="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 text-xs font-bold">
                    همیشه همراه، در هر زمان و مکان
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    اپلیکیشن نسخه موبایل (اندروید)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    با اپلیکیشن موبایل، قیمت لحظه‌ای طلا، سکه امامی، نیم و ربع، مثقال ۱۷ و نرخ لحظه‌ای دلار و یورو را در جیب خود داشته باشید و از نوسانات ناگهانی بازار جا نمانید.
                  </p>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>نمایش فلش‌های نوسان صعودی و نزولی قیمت[cite: 2]</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>بخش مظنه و ارز (انس جهانی، دلار، یک مثقال)[cite: 2]</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>مصرف اینترنت بسیار کم با سرعت لود زیر ثانیه</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={bazaarLink?.href || "https://cafebazaar.ir"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-black text-white hover:bg-emerald-700 transition-all"
                    >
                      <span>نصب مستقیم اپلیکیشن از بازار</span>
                      <span>←</span>
                    </a>
                  </div>
                </div>

                {/* قاب تصویر موبایل */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-64 sm:w-72 rounded-[40px] border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl ring-4 ring-amber-500/20">
                    <div className="relative aspect-[9/18] w-full rounded-[30px] overflow-hidden bg-slate-900">
                      <Image
                        src="/images/portfolio/Screenshot 2026-09-22 154555.png"
                        alt="اپلیکیشن موبایل نرخ طلا"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>

        {/* موج خروجی مماس بدون فاصله */}
        <LiquidWaveBottom />
      </section>

      {/* ══════════════════════════════════════════════════════════
          ۳. ارزش اشتراک و امکانات
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 bg-white">
        <Container>
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 px-4 py-1 text-xs font-bold mb-3">
              مزایای خرید اشتراک
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              چرا طلافروشان و فعالان بازار به این اشتراک نیاز دارند؟
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              اطمینان از درستی نرخ‌ها در زمان نوسان‌های شدید بازار، از هر ضرر احتمالی در معاملات جلوگیری می‌کند.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl font-bold mb-4">
                ⚡
              </div>
              <h3 className="text-base font-bold text-slate-900">بدون تاخیر ثانیه‌ای</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                متصل به وب‌سرویس مستقیم و پایدار بدون تاخیر و بدون نیاز به فیلترشکن برای تمام استان‌ها و شهرها.
              </p>
            </Reveal>

            <Reveal delay={60} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#0f0f52]/10 text-[#0f0f52] flex items-center justify-center text-2xl font-bold mb-4">
                📺
              </div>
              <h3 className="text-base font-bold text-slate-900">یک اشتراک برای موبایل و تابلو</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                با تهیه یک لایسنس، هم روی گوشی شخصی و هم روی تلویزیون یا تابلوی مغازه دسترسی همزمان خواهید داشت[cite: 2, 3].
              </p>
            </Reveal>

            <Reveal delay={120} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#e6304c]/10 text-[#e6304c] flex items-center justify-center text-2xl font-bold mb-4">
                🛡️
              </div>
              <h3 className="text-base font-bold text-slate-900">پشتیبانی ایده‌نگار</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                تضمین پایداری سرور و ارتقای مداوم برنامه توسط تیم مهندسی نرم‌افزار ایده‌نگار.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ۴. سکشن پایانی CTA (روشن و بدون تداخل با موج فوتر)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-28 sm:pt-20 sm:pb-36 bg-gradient-to-t from-slate-100 via-amber-50/20 to-white border-t border-slate-200/60">
        <Container className="relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center justify-center text-3xl shadow-sm mb-6">
              ✨
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              دانلود کنید و اشتراک تابلوی خود را فعال نمایید
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              هم‌اکنون نسخه اندروید را دانلود کنید و جهت تهیه لایسنس و فعال‌سازی تابلوی مغازه با پشتیبانی تماس بگیرید.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {linkViews
                .filter((link) => link.variant !== "anchor")
                .map((link) => {
                  const isBazaar = link.variant === "bazaar";
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      {...(isExternal(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={
                        isBazaar
                          ? "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-emerald-600/25 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                          : "inline-flex items-center gap-2 rounded-xl bg-[#0f0f52] px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-[#0f0f52]/25 hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
                      }
                    >
                      <span>{link.emoji} {isBazaar ? "نصب از کافه بازار" : "دانلود مستقیم APK"}</span>
                    </a>
                  );
                })}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
              >
                <span>درخواست اشتراک و تابلوی مغازه</span>
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

export default GoldAppClient;
