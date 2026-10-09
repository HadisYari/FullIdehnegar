"use client";

import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Container } from "../container";
import { localeHref } from "@/lib/i18n/paths";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { PortfolioItem } from "@/lib/portfolio";
import { Sparkles, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

/* ──────────────────────────────────────────────────────────
   موج متحرک ورودی بالا (سفید به سرمه‌ای #0f0f52)
   ────────────────────────────────────────────────────────── */
function LiquidWaveTop() {
  const waves = [
    {
      d: "M0,55 C150,20 350,90 500,55 C650,20 850,90 1000,55 L1000,100 L0,100 Z",
      opacity: 0.18,
      anim: "animate-wave-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,60 C180,30 320,85 500,60 C680,30 820,85 1000,60 L1000,100 L0,100 Z",
      opacity: 0.35,
      anim: "animate-wave-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,66 C200,42 360,90 500,66 C640,42 800,90 1000,66 L1000,100 L0,100 Z",
      opacity: 0.65,
      anim: "animate-wave-medium",
      fill: "#141460",
    },
    {
      d: "M0,74 C160,48 340,92 500,74 C660,52 840,92 1000,74 L1000,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-faster",
      fill: "#070724",
    },
  ];

  return (
    <div className="absolute left-0 top-0 z-20 w-full -translate-y-[85%] overflow-hidden leading-none pointer-events-none">
      <div className="relative h-[65px] w-full sm:h-[95px] md:h-[130px]">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-[65px] w-1/2 sm:h-[95px] md:h-[130px]">
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
   کارت گوشی موبایل و پلاک مشخصات
   ────────────────────────────────────────────────────────── */
function PhoneCard({
  item,
  locale,
}: {
  item: PortfolioItem;
  locale: Locale;
}) {
  const titleText =
    typeof item.title === "object" ? item.title[locale] : item.title;
  const category = item.category || (item.tags && item.tags[0]) || "";
  const imageSrc = item.image || "/images/placeholder.jpg";

  return (
    <Link
      href={localeHref(locale, `/portfolio/${item.slug}`)}
      prefetch={true}
      className="group flex flex-col items-center gap-4 select-none outline-none active:scale-[0.98] transition-all duration-200"
    >
      {/* بدنه گوشی موبایل */}
      <div className="group/phone relative mx-auto w-[185px] sm:w-[205px] md:w-[225px]">
        {/* هاله نور زیر گوشی در زمان هاور */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-10 w-[85%] rounded-full bg-gradient-to-r from-[#e6304c] via-rose-500 to-[#0f0f52] blur-2xl opacity-0 transition-opacity duration-500 group-hover/phone:opacity-90" />

        {/* دکمه‌های ولوم و پاور */}
        <div className="absolute -left-[2.5px] top-[55px] z-10 h-[16px] w-[2.5px] rounded-l-sm bg-white/30" />
        <div className="absolute -left-[2.5px] top-[80px] z-10 h-[26px] w-[2.5px] rounded-l-sm bg-white/30" />
        <div className="absolute -left-[2.5px] top-[114px] z-10 h-[26px] w-[2.5px] rounded-l-sm bg-white/30" />
        <div className="absolute -right-[2.5px] top-[90px] z-10 h-[35px] w-[2.5px] rounded-r-sm bg-white/30" />

        <div className="overflow-hidden rounded-[30px] sm:rounded-[34px] border-[4px] border-white/20 bg-black shadow-[0_25px_50px_rgba(0,0,0,0.7)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/phone:border-[#e6304c] group-hover/phone:shadow-[0_20px_50px_rgba(230,48,76,0.4)] group-hover/phone:-translate-y-3">
          {/* Dynamic Island */}
          <div className="relative flex h-5 items-center justify-center bg-black">
            <div className="flex items-center gap-2">
              <div className="h-[6px] w-[6px] rounded-full bg-white/10 ring-1 ring-white/10">
                <div className="h-[2.5px] w-[2.5px] translate-x-[1.5px] translate-y-[1.5px] rounded-full bg-[#e6304c]" />
              </div>
              <div className="h-[3px] w-10 rounded-full bg-white/20" />
            </div>
          </div>

          {/* صفحه نمایش — تصویر کاملاً واضح و بدون هیچ لایه تاریک یا محوکننده */}
          <div className="relative h-[290px] sm:h-[330px] md:h-[370px] overflow-hidden bg-slate-950">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={imageSrc}
                alt={titleText}
                className="absolute top-0 left-0 w-full h-auto select-none pointer-events-none transition-transform duration-[1500ms] ease-out group-hover/phone:duration-[10000ms] group-hover/phone:ease-linear group-hover/phone:translate-y-[calc(-100%+290px)] sm:group-hover/phone:translate-y-[calc(-100%+330px)] md:group-hover/phone:translate-y-[calc(-100%+370px)]"
                draggable={false}
              />
            </div>
          </div>

          {/* هوم‌بار */}
          <div className="flex items-center justify-center bg-black py-1.5">
            <div className="h-[4px] w-12 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* پلاک مشخصات زیر گوشی — ساده، تمیز و بدون آیتم‌های اضافه زیر عنوان */}
      <div className="w-[185px] sm:w-[205px] md:w-[225px] text-start">
        <div className="relative overflow-hidden rounded-[20px] border border-white/15 bg-white/[0.07] p-3.5 shadow-xl backdrop-blur-xl transition-all duration-500 group-hover:border-[#e6304c]/80 group-hover:bg-white/[0.12] group-hover:shadow-[0_12px_30px_rgba(230,48,76,0.25)] group-hover:-translate-y-1">
          {/* خط نئونی هاور بالای پلاک */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#e6304c] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* دسته‌بندی */}
          {category && (
            <span className="inline-block rounded-md bg-[#e6304c]/20 border border-[#e6304c]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-300 mb-2 truncate max-w-full">
              {category}
            </span>
          )}

          {/* عنوان پروژه */}
          <h3 className="text-xs sm:text-[13px] font-bold text-white leading-snug transition-colors duration-300 group-hover:text-rose-200">
            {titleText}
          </h3>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────
   کاروسل با دکمه‌های ناوبری شیشه‌ای
   ────────────────────────────────────────────────────────── */
function NativeScrollCarousel({
  items,
  locale,
  isRtl,
}: {
  items: PortfolioItem[];
  locale: Locale;
  isRtl: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (isRtl) {
      const absScroll = Math.abs(scrollLeft);
      setCanScrollPrev(absScroll > 5);
      setCanScrollNext(absScroll < maxScroll - 5);

      const pages = Math.max(1, Math.ceil(maxScroll / clientWidth));
      setTotalPages(pages);
      setCurrentPage(Math.min(pages - 1, Math.round(absScroll / clientWidth)));
    } else {
      setCanScrollPrev(scrollLeft > 5);
      setCanScrollNext(scrollLeft < maxScroll - 5);

      const pages = Math.max(1, Math.ceil(maxScroll / clientWidth));
      setTotalPages(pages);
      setCurrentPage(Math.min(pages - 1, Math.round(scrollLeft / clientWidth)));
    }
  }, [isRtl]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = useCallback(
    (direction: "next" | "prev") => {
      const el = scrollRef.current;
      if (!el) return;

      const firstCard = el.querySelector("[data-card]") as HTMLElement | null;
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      let delta = direction === "next" ? scrollAmount : -scrollAmount;
      if (isRtl) delta = -delta;

      el.scrollBy({ left: delta, behavior: "smooth" });
    },
    [isRtl]
  );

  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), 8000);
  }, []);

  const handleLeftClick = useCallback(() => {
    pauseAutoScroll();
    if (isRtl) scrollByCard("next");
    else scrollByCard("prev");
  }, [isRtl, scrollByCard, pauseAutoScroll]);

  const handleRightClick = useCallback(() => {
    pauseAutoScroll();
    if (isRtl) scrollByCard("prev");
    else scrollByCard("next");
  }, [isRtl, scrollByCard, pauseAutoScroll]);

  const scrollToPage = useCallback(
    (page: number) => {
      const el = scrollRef.current;
      if (!el) return;
      pauseAutoScroll();

      const target = page * el.clientWidth;
      if (isRtl) {
        el.scrollTo({ left: -target, behavior: "smooth" });
      } else {
        el.scrollTo({ left: target, behavior: "smooth" });
      }
    },
    [isRtl, pauseAutoScroll]
  );

  useEffect(() => {
    if (isPaused) {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
      return;
    }

    autoScrollTimer.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;

      if (isRtl) {
        const absScroll = Math.abs(scrollLeft);
        if (absScroll >= maxScroll - 5) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollByCard("next");
        }
      } else {
        if (scrollLeft >= maxScroll - 5) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollByCard("next");
        }
      }
    }, 4000);

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [isPaused, isRtl, scrollByCard]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleLeftClick();
      if (e.key === "ArrowRight") handleRightClick();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleLeftClick, handleRightClick]);

  const showLeftBtn = isRtl ? canScrollNext : canScrollPrev;
  const showRightBtn = isRtl ? canScrollPrev : canScrollNext;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* دکمه چپ */}
      <button
        onClick={handleLeftClick}
        aria-label="قبلی"
        className={`absolute left-2 sm:-left-3 lg:-left-5 top-[calc(50%-45px)] -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-300 hover:bg-[#e6304c] hover:border-[#e6304c] hover:scale-105 active:scale-95 ${
          !showLeftBtn ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {/* دکمه راست */}
      <button
        onClick={handleRightClick}
        aria-label="بعدی"
        className={`absolute right-2 sm:-right-3 lg:-right-5 top-[calc(50%-45px)] -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-300 hover:bg-[#e6304c] hover:border-[#e6304c] hover:scale-105 active:scale-95 ${
          !showRightBtn ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {/* ترک اسکرول */}
      <div className="px-6 sm:px-4 lg:px-6">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth py-6 snap-x snap-mandatory scrollbar-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onTouchStart={pauseAutoScroll}
        >
          {items.map((item) => (
            <div
              key={item.slug}
              data-card
              className="shrink-0 w-[205px] sm:w-[225px] md:w-[245px] snap-center"
            >
              <PhoneCard item={item} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* ناوبری پایین */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5 text-xs font-bold text-white/70 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full shadow-inner backdrop-blur-md">
          <span className="text-[#e6304c] text-sm font-black tabular-nums">
            {String(currentPage + 1).padStart(2, "0")}
          </span>
          <span className="h-[1px] w-4 bg-white/20" />
          <span className="tabular-nums">
            {String(totalPages).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              aria-label={`صفحه ${i + 1}`}
              className={`transition-all duration-500 rounded-full ${
                i === currentPage
                  ? "h-2.5 w-8 bg-gradient-to-r from-[#e6304c] to-rose-500 shadow-lg shadow-[#e6304c]/50"
                  : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   بخش اصلی نمونه‌کارها
   ────────────────────────────────────────────────────────── */
export function PortfolioPreviewSection({
  items,
  locale,
  dict,
}: {
  items: PortfolioItem[];
  locale: Locale;
  dict: Dictionary;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isRtl = locale === "fa";

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#070724] text-white pt-16 pb-12 lg:pt-24 lg:pb-16">
      {/* 🌊 موج ورودی بالا */}
       

      {/* نورپردازی استودیو و استیج نوری پس‌زمینه */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-[#e6304c]/20 blur-[130px]" />
        <div className="absolute right-1/4 bottom-20 h-[450px] w-[450px] rounded-full bg-[#0f0f52]/40 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* استیج نوری افقی زیر گوشی‌ها */}
        <div className="absolute top-[52%] inset-x-0 h-40 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e6304c]/20 to-transparent blur-3xl opacity-80" />
      </div>

      <div className="relative z-10">
        <Container>
          {/* هدر بخش بدون متن توضیحات اضافی */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="mb-10 flex flex-col items-center text-center max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e6304c]/40 bg-[#e6304c]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-rose-300 backdrop-blur-md shadow-lg shadow-[#e6304c]/15">
              <Sparkles className="h-3.5 w-3.5 text-[#e6304c]" />
              <span>{dict.portfolio?.eyebrow || "نمونه‌کارها و پروژه‌ها"}</span>
            </span>

            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {isRtl ? "خلق تجربیات دیجیتال در " : "Curated Works in "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-400 to-amber-200">
                {isRtl ? "مقیاس واقعی" : "Real Scale"}
              </span>
            </h2>

            {/* خط دکوراتیو کوچک */}
            <div className="mt-4 flex items-center gap-1.5">
              <div className="h-[3px] w-6 rounded-full bg-white/20" />
              <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-[#e6304c] to-rose-400 shadow-sm shadow-[#e6304c]/50" />
              <div className="h-[3px] w-6 rounded-full bg-white/20" />
            </div>
          </motion.div>
        </Container>

        {/* کاروسل گوشی‌ها */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <NativeScrollCarousel items={items} locale={locale} isRtl={isRtl} />
        </motion.div>

        {/* دکمه مشاهده همه پروژه‌ها */}
        <div className="mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href={localeHref(locale, "/portfolio")}
              prefetch={true}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white/10 px-8 py-4 text-xs sm:text-sm font-bold text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:bg-[#e6304c] hover:border-[#e6304c] hover:shadow-[#e6304c]/40 hover:-translate-y-1 active:scale-95"
            >
              <span className="relative z-10">
                {dict.portfolio?.viewAll || "مشاهده همه پروژه‌ها"}
              </span>
              <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>

      
 
    </section>
  );
}