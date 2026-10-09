// components/sections/home-cta-section.tsx
"use client";

import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { localeHref } from "@/lib/i18n/paths";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

export function HomeCtaSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isFa = locale === "fa";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-white pt-14 pb-24 sm:pt-20 sm:pb-32">
      {/* نورهای پس‌زمینه آمبینت به رنگ لوگو و سرمه‌ای */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <div className="absolute start-1/4 top-10 h-80 w-80 rounded-full bg-[#e6304c]/8 blur-[120px]" />
        <div className="absolute end-1/4 bottom-10 h-96 w-96 rounded-full bg-[#0f0f52]/6 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0f0f52 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200/90 bg-white/80 p-8 sm:p-14 lg:p-16 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
          
          {/* خط نئونی رنگی بالای بنر */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0f0f52] via-[#e6304c] to-[#0f0f52]" />

          {/* هاله نور درونی کارت */}
          <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[#e6304c]/10 blur-[90px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
            
            {/* ستون متن و فراخوان اقدام */}
            <div className="lg:col-span-7 text-center lg:text-start">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e6304c]/20 bg-[#e6304c]/10 px-4 py-1.5 text-xs font-bold text-[#e6304c]">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>{isFa ? "شروع خلق یک اثر متمایز" : "Start Your Next Milestone"}</span>
                </div>

                <h2 className="mt-5 text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25]">
                  {isFa ? (
                    <>
                      ایده بزرگ بعدی‌تان را با <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-600 to-[#0f0f52]">
                        بالاترین استانداردهای مهندسی
                      </span>{" "}
                      بسازید
                    </>
                  ) : (
                    <>
                      Build Your Next Breakthrough With <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-600 to-[#0f0f52]">
                        World-Class Engineering
                      </span>
                    </>
                  )}
                </h2>

                <p className="mt-4 text-xs sm:text-sm sm:leading-relaxed text-slate-600 max-w-xl mx-auto lg:mx-0">
                  {isFa
                    ? "ما در ایده‌نگار آماده‌ایم از اولین گام تحلیل نیازمندی‌ها تا معماری توزیع‌شده، لودینگ زیر ثانیه و استقرار ابری در کنار کسب‌وکار شما باشیم."
                    : "From preliminary domain modeling to high-throughput cloud deployment and sub-second web performance, our senior leads are with you."}
                </p>

                {/* دکمه‌های اقدام */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    href={localeHref(locale, "/contact")}
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-[#e6304c] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#e6304c]/30 transition-all duration-300 hover:scale-[1.03] hover:bg-[#ff3b59]"
                  >
                    <span>ثبت و درخواست مشاوره</span>
                    {/* <span>{isFa ? "درخواست جلسه و مشاوره فنی" : "Schedule Technical Discovery"}</span> */}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <Link
                    href={localeHref(locale, "/payment")}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all duration-300 hover:border-[#0f0f52] hover:bg-slate-50"
                  >
                    {/* <span>{isFa ? "مشاهده پرونده پروژه‌ها" : "View Case Studies"}</span> */}
                    <span>خرید اشتراک فروشگاه ساز</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* ستون کارت‌های تله‌متری و تعهد کیفیت */}
            <div className="lg:col-span-5 w-full">
              <Reveal delay={120}>
                <div className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-6 shadow-lg backdrop-blur-md space-y-3 font-mono text-xs">
                  
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-bold text-slate-900 font-sans">{isFa ? "تعهدنامه کیفیت ایده‌نگار" : "Quality Assurance"}</span>
                    </div>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      SLA Guaranteed
                    </span>
                  </div>

                  <div className="space-y-2.5 text-slate-700 font-sans text-xs">
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200/70 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <Zap className="h-4 w-4 text-[#e6304c]" />
                        <span>{isFa ? "میانگین زمان لود اولیه (TTFB)" : "Sub-second TTFB"}</span>
                      </div>
                      <span className="font-mono font-bold text-[#0f0f52]">&lt; 50ms</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200/70 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>{isFa ? "پایداری بدون توقف سرورها" : "High Availability Uptime"}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">99.98%</span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200/70 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <Cpu className="h-4 w-4 text-indigo-600" />
                        <span>{isFa ? "معماری کامپوننت‌ها و تایپ‌سیفتی" : "Strict Type-Safety Coverage"}</span>
                      </div>
                      <span className="font-mono font-bold text-indigo-600">100% TS</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-slate-400 font-sans">
                    {isFa ? "پاسخ‌گویی فنی ظرف حداکثر ۲ تا ۴ ساعت کاری" : "Initial response within 2-4 business hours"}
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}