"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Compass,
  Maximize2,
} from "lucide-react";

import { Container } from "../container";
import { Reveal } from "../reveal";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/paths";
import { LiquidWaveTop } from "../LiquidWaveTop";

// کارت تعاملی با افکت عمق سه‌بعدی و واکنش به حرکت ماوس
function InteractiveCard({
  item,
  index,
  locale,
}: {
  item: any;
  index: number;
  locale: Locale;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative min-h-[440px] rounded-[2.5rem] border border-white/60 bg-gradient-to-b from-white/70 via-white/40 to-white/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(230,48,76,0.15)] flex flex-col justify-between"
    >
      {/* هاله رنگی نئونی داخل کارت */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full blur-3xl opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-75"
        style={{ background: item.glowColor }}
      />

      {/* بخش بالای کارت */}
      <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
        <div className="flex items-center justify-between">
          {/* آیکون شناور با انیمیشن پالس */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, white, ${item.softColor})`,
              color: item.color,
            }}
          >
            <item.icon className="h-7 w-7" />
          </div>

          <span className="font-mono text-xs font-black tracking-widest text-slate-400 group-hover:text-slate-800 transition-colors">
            {item.code}
          </span>
        </div>

        <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-600 font-medium">
          {item.desc}
        </p>
      </div>

      {/* شیپ و اینفوگرافیک انیمیشنی داخل هر کارت */}
      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-md"
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{item.featureTitle}</span>
          <span className="font-mono text-rose-600">{item.featureValue}</span>
        </div>

        {/* نوار متحرک شاخص */}
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: item.progress }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: item.color }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-lg border border-white/80 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* دکمه اکشن گوشه پایین */}
      <div
        style={{ transform: "translateZ(30px)" }}
        className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-slate-200/60"
      >
        <span className="text-xs font-bold text-slate-500">جزئیات و نمونه‌کارها</span>
        <Link
          href={localeHref(locale, "/services")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-600"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export function ServicesSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const services = [
    {
      code: "EXP // 01",
      title: "طراحی وب تعاملی و ۳D",
      desc: "پیاده‌سازی وب‌سایت‌های خلاق با تجربه‌های دیداری عمیق، وب‌جی‌ال (WebGL)، میکرواینترکشن‌ها و هویت انحصاری برند.",
      icon: Sparkles,
      color: "#e6304c",
      softColor: "#ffe5e9",
      glowColor: "rgba(230, 48, 76, 0.4)",
      featureTitle: "نرخ ماندگاری مخاطب (Dwell Time)",
      featureValue: "3.4x بالاتر",
      progress: "92%",
      tags: ["Creative UI/UX", "Three.js", "Framer Motion", "Lenis Scroll"],
    },
    {
      code: "ENG // 02",
      title: "معماری نرم‌افزار و سامانه‌ها",
      desc: "توسعه سامانه‌های ابری یکپارچه، داشبوردهای تحلیل داده و وب‌اپلیکیشن‌های چند کاربره با پایداری حداکثری.",
      icon: Cpu,
      color: "#6366f1",
      softColor: "#e0e7ff",
      glowColor: "rgba(99, 102, 241, 0.4)",
      featureTitle: "پایداری بدون خطا (Uptime)",
      featureValue: "99.98%",
      progress: "98%",
      tags: ["TypeScript", "Next.js", "PostgreSQL", "Scalable APIs"],
    },
    {
      code: "SPD // 03",
      title: "مهندسی سرعت و رتبه‌گیری",
      desc: "لود آنی بدون تأخیر در تمامی دستگاه‌ها، کسب بهترین امتیازها در الگوریتم Core Web Vitals و سئوی ساختاریافته محتوا.",
      icon: Zap,
      color: "#059669",
      softColor: "#d1fae5",
      glowColor: "rgba(5, 150, 105, 0.4)",
      featureTitle: "نمره بهینه‌سازی گوگل",
      featureValue: "100 / 100",
      progress: "100%",
      tags: ["SSR / SSG", "Edge Cache", "LightHouse", "Zero Bloat"],
    },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#eef1f6] pt-12 pb-44"
    >
     
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-20 h-[550px] w-[550px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-tr from-rose-500/25 to-pink-300/30 blur-[90px]"
      />

      {/* شیپ ارگانیک نئون بنفش و آبی */}
      <motion.div
        animate={{
          x: [0, -90, 50, 0],
          y: [0, 70, -40, 0],
          scale: [1, 1.15, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 top-1/3 h-[600px] w-[600px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-bl from-indigo-500/25 to-sky-400/20 blur-[100px]"
      />

      {/* شکل سه‌بعدی ژئومتریک چرخان (Torus Wireframe) در وسط فضا */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute left-1/2 top-48 -translate-x-1/2 -z-0 opacity-15"
      >
        <svg width="600" height="600" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#e6304c" strokeWidth="0.5" strokeDasharray="3 3" />
          <ellipse cx="50" cy="50" rx="45" ry="20" stroke="#6366f1" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="20" ry="45" stroke="#059669" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* شبکه خطوط شطرنجی ترنسپرنت برای حس عمق مهندسی */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10">
        {/* سربرگ دینامیک با فونت حجیم و شیشه‌ای */}
        <div className="flex flex-col items-center text-center">
          

          <Reveal delay={100}>
            <h2 className="mt-7 max-w-4xl text-balance text-2xl font-black tracking-tight text-slate-950 sm:text-2xl lg:text-4xl">
              طراحی فراتر از تصویر؛{" "}
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                خلق تجربه زنده
              </span>
            </h2>
          </Reveal>
 
        </div>

        {/* گرید ۳تایی کارت‌های شناور فضایی */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item, index) => (
            <InteractiveCard
              key={item.code}
              item={item}
              index={index}
              locale={locale}
            />
          ))}
        </div>
      </Container>


       
    </section>
  );
}