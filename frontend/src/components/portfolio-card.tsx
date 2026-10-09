"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/portfolio";
import type { Locale } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/paths";
import { categoryLabel, type Category } from "@/lib/categories";
import { cn } from "@/lib/cn";

interface PortfolioCardProps {
  item: PortfolioItem;
  locale: Locale;
  index?: number;
  categories?: Category[];
  viewLabel?: string;
}

export function PortfolioCard({ item, locale, index = 0, categories, viewLabel }: PortfolioCardProps) {
  const titleText = typeof item.title === "object" ? item.title[locale] : item.title;
  const clientText = typeof item.client === "object" ? item.client[locale] : "";
  const category = categories?.find((entry) => entry.slug === item.category)?.[locale]
    ?? categoryLabel(item.category, locale);
  const imageSrc = item.image || "/images/placeholder.jpg";

  /* ── Smooth scroll logic ── */
  const screenRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hovered, setHovered] = useState(false);

  const calcMax = useCallback(() => {
    const img = imgRef.current;
    const screen = screenRef.current;
    if (!img || !screen) return;
    const diff = img.scrollHeight - screen.offsetHeight;
    setMaxScroll(Math.max(0, diff));
  }, []);

  useEffect(() => {
    calcMax();
    window.addEventListener("resize", calcMax);
    return () => window.removeEventListener("resize", calcMax);
  }, [calcMax]);

  useEffect(() => {
    if (maxScroll <= 0) return;

    const target = hovered ? maxScroll : 0;
    const speed = 2; // سرعت اسکرول تصویر

    let current = scrollY;

    const animate = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        setScrollY(current);
        return;
      }
      current += Math.sign(diff) * Math.min(speed, Math.abs(diff));
      setScrollY(current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered, maxScroll]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link
      href={localeHref(locale, `/portfolio/${item.slug}`)}
      aria-label={viewLabel ? `${viewLabel}: ${titleText}` : titleText}
      prefetch={true}
      className="group flex flex-col items-center gap-4 select-none outline-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ╭─── Device Shell (موبایل) ───╮ */}
      <div className="relative mx-auto w-full max-w-[190px] sm:max-w-[210px]">
        {/* هاله نور متحرک و ملایم پشت دستگاه */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-[60%] rounded-full bg-[#e6304c]/10 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* دکمه‌های کناری فیزیکی */}
        <div className="absolute -start-[2px] top-[52px] z-10 h-[14px] w-[2px] rounded-s-sm bg-slate-400/40" />
        <div className="absolute -start-[2px] top-[74px] z-10 h-[22px] w-[2px] rounded-s-sm bg-slate-400/40" />
        <div className="absolute -start-[2px] top-[102px] z-10 h-[22px] w-[2px] rounded-s-sm bg-slate-400/40" />
        <div className="absolute -end-[2px] top-[82px] z-10 h-[30px] w-[2px] rounded-e-sm bg-slate-400/40" />

        {/* بدنه گوشی */}
        <div
          className={cn(
            "overflow-hidden rounded-[26px] border-[3.5px] border-slate-900 bg-slate-900",
            "shadow-md shadow-slate-950/10",
            "transition-all duration-700 ease-[cubic-bezier(.23,1,.32,1)]",
            "group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-[#0f0f52]/10",
            "group-hover:border-slate-800"
          )}
        >
          {/* نوار وضعیت بالای صفحه گوشی */}
          <div className="flex h-[18px] items-center justify-between bg-slate-900 px-4">
            <span className="text-[7px] font-semibold text-white/30 font-mono">
              {item.year}
            </span>
            <div className="flex items-center gap-[3px]">
              {/* دوربین سلفی */}
              <div className="h-[5px] w-[5px] rounded-full bg-slate-800 ring-1 ring-slate-700/30">
                <div className="h-[2px] w-[2px] translate-x-[1.5px] translate-y-[1.5px] rounded-full bg-blue-400/40" />
              </div>
              {/* اسپیکر مکالمه */}
              <div className="h-[2.5px] w-8 rounded-full bg-slate-800/60" />
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-end gap-[1.5px]">
                <div className="h-[3px] w-[2px] rounded-full bg-white/20" />
                <div className="h-[5px] w-[2px] rounded-full bg-white/20" />
                <div className="h-[7px] w-[2px] rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          {/* صفحه نمایش */}
          <div
            ref={screenRef}
            className="relative h-[250px] sm:h-[280px] overflow-hidden bg-white"
          >
            <Image
              ref={imgRef}
              src={imageSrc}
              alt={titleText}
              width={420}
              height={900}
              onLoad={calcMax}
              className="absolute top-0 left-0 w-full h-auto select-none pointer-events-none"
              style={{ transform: `translateY(-${scrollY}px)` }}
              draggable={false}
              priority={index < 8}
            />

            {/* سایه ملایم بالا */}
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

            {/* دکمه شناور در هاور */}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
                <svg
                  className={cn(
                    "h-3.5 w-3.5 text-[#0f0f52]",
                    locale === "fa" && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* هوم بار پایین گوشی */}
          <div className="flex items-center justify-center bg-slate-900 py-[5px]">
            <div className="h-[3.5px] w-10 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* ╭─── Spec-Sheet Info (پلاک فنی و شناسنامه پروژه) ───╮ */}
      <div className="w-full max-w-[190px] sm:max-w-[210px] text-start px-1.5">
        <div 
          className={cn(
            "relative border-s-2 border-slate-200 transition-all duration-500 ps-3.5",
            "group-hover:border-[#e6304c] group-hover:ps-4.5"
          )}
        >
          {/* ردیف اول: برچسب فنی پروژه */}
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-slate-400">
            <span>PRJ-{String(index + 1).padStart(3, "0")}</span>
            <span 
              className={cn(
                "h-[1px] w-2 bg-slate-200 transition-all duration-500",
                "group-hover:w-4 group-hover:bg-[#e6304c]/40"
              )} 
            />
            <span className="text-[#e6304c] uppercase tracking-wider font-extrabold">
              {category}
            </span>
          </div>

          {/* عنوان پروژه با فونت خوانا و وزن مشخص */}
          <h3 className="mt-1 text-xs sm:text-[13px] font-extrabold leading-snug text-[#0f0f52] transition-colors duration-300 line-clamp-2">
            {titleText}
          </h3>

          {/* ردیف سوم: جزئیات کارفرما و سال */}
          {clientText && (
            <div className="mt-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-400 font-mono">
              <span className="truncate max-w-[110px]">{clientText}</span>
              <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />
              <span>{item.year}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}