"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring, type Variants } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ArrowUpRight,
  Code2,
  Zap,
  Monitor,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { Container } from "../container";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/paths";
import { formatNumber } from "@/lib/format";

// تابع ادغام کلاس‌های تیلوند
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ──────────────────────────────────────────────────────────────────────────
   کارت‌های معلق با انیمیشن شناور نرم (Floating Cards - Light Glassmorphism)
   ────────────────────────────────────────────────────────────────────────── */
function FloatingElement({
  children,
  className,
  delay = 0,
  yOffset = 10,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("absolute z-30", className)}
    >
      <motion.div
        animate={{ y: [0, -yOffset, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   بخش اصلی کامپوننت هیرو (Hero Section - Premium Software Agency Edition)
   ────────────────────────────────────────────────────────────────────────── */
export function HeroSection({
  locale,
  dict,
  meta,
  stats,
}: {
  locale: Locale;
  dict: Dictionary;
  /** متن‌های صفحهٔ اصلی از جدول PageMeta (بک‌اند) — fallback: دیکشنری i18n */
  meta?: { eyebrow?: string; title?: string; subtitle?: string };
  /** ارقام صفحهٔ اصلی (جدول SiteSetting) — fallback: siteConfig */
  stats?: { yearsActive: number; projects: number };
}) {
  const eyebrow = meta?.eyebrow?.trim() || dict.hero.eyebrow;
  const title = meta?.title?.trim() || dict.hero.title;
  const subtitle = meta?.subtitle?.trim() || dict.hero.subtitle;
  const yearsActive = stats?.yearsActive ?? 15;
  const projects = stats?.projects ?? 326;
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  // افکت حرکتی پارالکس پیشرفته با ماوس برای لایه‌های تصویر
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // برای افکت نور دنبال‌کننده ماوس (Cursor Glow)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 30 });
  
  const springCursorX = useSpring(cursorX, { stiffness: 50, damping: 20 });
  const springCursorY = useSpring(cursorY, { stiffness: 50, damping: 20 });
  
  // لایه بک‌گراند تصاویر
  const backX = useTransform(springX, [-0.5, 0.5], [15, -15]);
  const backY = useTransform(springY, [-0.5, 0.5], [10, -10]);
  
  // لایه مید‌گراند تصاویر
  const midX = useTransform(springX, [-0.5, 0.5], [30, -30]);
  const midY = useTransform(springY, [-0.5, 0.5], [20, -20]);

  // لایه فور‌گراند تصاویر
  const frontX = useTransform(springX, [-0.5, 0.5], [45, -45]);
  const frontY = useTransform(springY, [-0.5, 0.5], [35, -35]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // محاسبه برای پارالکس تصاویر
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    
    // محاسبه برای افکت نور ماوس (مختصات دقیق ماوس)
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }

  const listVariant: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32 lg:py-40"
    >
      {/* ──── بک‌گراند روشن سینمایی با تکسچر نویز و گرید ──── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        {/* گرید خطوط مهندسی با رنگ تیره کمرنگ */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black_50%,transparent)]" />
        
        {/* هاله نوری اول (بنفش تکنولوژی - نماد ERP/CRM) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 start-10 h-[600px] w-[600px] rounded-full bg-indigo-300 blur-[150px]"
        />
        
        {/* هاله نوری دوم (قرمز برند - نماد خلاقیت و انرژی) */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-10 end-10 h-[500px] w-[500px] rounded-full bg-[#e6304c] blur-[120px]"
        />

        {/* افکت نور دنبال‌کننده ماوس (ترفند فوق‌العاده برای سایت‌های SaaS) */}
        <motion.div
          style={{ left: springCursorX, top: springCursorY }}
          className="absolute h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6304c]/10 blur-[100px] transition-colors duration-300"
        />

        {/* لایه نویز (Grain Texture) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          
          {/* ──────── سمت متن‌ها ──────── */}
          <motion.div
            variants={listVariant}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="lg:col-span-5 text-center lg:text-start"
          >
            {/* بج مدرن */}
            <motion.div variants={itemVariant} className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e6304c]/20 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#e6304c] shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                {dict.hero.eyebrow}
              </span>
            </motion.div>

            {/* عنوان اصلی با گرادیانت متنی (قرمز به بنفش - مخصوص نرم افزار) */}
            <motion.h1
              variants={itemVariant}
              className="mt-8 text-balance text-3xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3rem] xl:text-[3.5rem]"
            >
              {dict.hero.title.split(" ").map((word, i) => (
                <span key={i} className={i === 2 || i === 3 ? "bg-gradient-to-r from-[#e6304c] to-indigo-600 bg-clip-text text-transparent" : ""}>
                  {word}{" "}
                </span>
              ))}
            </motion.h1>

            {/* زیرعنوان */}
            <motion.p
              variants={itemVariant}
              className="mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0"
            >
              {dict.hero.subtitle}
            </motion.p>

            {/* بخش دکمه‌های فراخوانی */}
            <motion.div
              variants={itemVariant}
              className="mt-10 flex flex-col items-center gap-5 sm:flex-row lg:justify-start"
            >
              <Link
                href={localeHref(locale, "/contact")}
                className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#e6304c] px-9 text-base font-bold text-white shadow-xl shadow-[#e6304c]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e6304c]/30"
              >
                {/* انیمیشن نور متحرک (Shimmer) داخل دکمه */}
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                {/* <span className="relative z-10">{dict.hero.ctaPrimary}</span> */}
                <span className="relative z-10">  درخواست مشاوره </span>
                {/* <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /> */}
              </Link>

              <Link
                href={localeHref(locale, "/store-builder")}
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white backdrop-blur-sm px-9 text-base font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
              >
                {/* <Monitor className="h-4 w-4 text-slate-400 transition-colors group-hover:text-[#e6304c]" /> */}
                {/* {dict.hero.ctaSecondary} */}
            {locale === "en" ? "View Store Builder" : "مشاهده فروشگاه‌ساز"}
              </Link>
            </motion.div>

            {/* آمار و ارقام */}
            <motion.div
              variants={itemVariant}
              className="mt-12 flex flex-wrap items-center justify-center gap-10 border-t border-slate-200 pt-8 lg:justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#e6304c]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none">
                    {formatNumber("15+", locale)}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {dict.stats.years}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6304c]/10 text-[#e6304c]">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none">
                    {formatNumber(projects, locale)}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {dict.stats.projects}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* نشان اعتماد */}
            <motion.p
              variants={itemVariant}
              className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 lg:justify-start"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {dict.hero.trustBadge}
            </motion.p>
          </motion.div>

          {/* ───────ـ سمت راست: کالج تصاویر سه‌بعدی پارالکس ───────ـ */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
            
            {/* لایه ۱: تصویر عقبی */}
            <motion.div
              style={{ x: backX, y: backY }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="absolute z-10 w-72 h-48 sm:w-96 sm:h-64 rounded-2xl overflow-hidden shadow-2xl rotate-[-8deg] translate-y-12 start-0 top-10 border border-white/50"
            >
              <Image
                src="/images/portfolio/off.png"
                alt="Project 1"
                layout="fill"
                objectFit="cover"
                className="scale-110"
              />
            </motion.div>

            {/* لایه ۲: تصویر میانی (تصویر اصلی - بوردر و سایه قوی‌تر در حالت لایت) */}
            <motion.div
              style={{ x: midX, y: midY }}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="absolute z-20 w-80 h-56 sm:w-[28rem] sm:h-72 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 rotate-[2deg] top-20 start-20 sm:start-32 border-4 border-white/80"
            >
              <Image
                src="/images/portfolio/college-zaban.jpg" 
                alt="Premium Web Design Showcase"
                layout="fill"
                objectFit="cover"
                priority
              />
              {/* افکت درخشش شیشه‌ای روی عکس اصلی در حالت لایت */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/40" />
            </motion.div>

            {/* لایه ۳: تصویر جلویی */}
            <motion.div
              style={{ x: frontX, y: frontY }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="absolute z-10 w-64 h-44 sm:w-80 sm:h-56 rounded-2xl overflow-hidden shadow-2xl rotate-[12deg] -translate-y-4 end-0 bottom-10 border border-white/50"
            >
              <Image
                src="/images/portfolio/ghooch-2.png" 
                alt="Project 3"
                layout="fill"
                objectFit="cover"
                className="scale-110"
              />
            </motion.div>

            {/* کارت شناور ۱: تضمین کدنویسی حرفه‌ای (حالت لایت گلاس) */}
            <FloatingElement className="-bottom-4 -start-4 hidden sm:block" delay={0.6} yOffset={12}>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Code2 className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Custom ERP Architecture</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Next.js & Scalable Cloud</p>
                </div>
              </div>
            </FloatingElement>

            {/* کارت شناور ۲: رتبه سرعت و کیفیت فنی */}
            <FloatingElement className="-top-4 -end-4 hidden sm:block" delay={0.8} yOffset={14}>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6304c]/10 text-[#e6304c]">
                  <Zap className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-900">100% Score</span>
                    <span className="rounded bg-emerald-50 px-1 py-0.5 text-[8px] font-bold text-emerald-600 border border-emerald-200">A+</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Optimized CRM Speed</p>
                </div>
              </div>
            </FloatingElement>

            {/* حلقه‌های تزیینی چرخان */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -end-16 -top-16 -z-0 h-60 w-60 rounded-full border border-dashed border-[#e6304c]/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-16 -start-16 -z-0 h-64 w-64 rounded-full border border-dashed border-slate-300/50"
            />

          </div>

        </div>
      </Container>
    </section>
  );
}