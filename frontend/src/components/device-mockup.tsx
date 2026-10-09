// components/device-mockup.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/* ═══════════════════════════════════════════════════════════════
   HOOK: محاسبه دقیق مسافت اسکرول (رفع باگ صفحه مشکی)
═══════════════════════════════════════════════════════════════ */
function useScrollDistance() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const tr = trackRef.current;
    if (!vp || !tr) return;
    // مسافت واقعی = ارتفاع کل عکس منهای ارتفاع صفحه نمایش دستگاه
    const d = Math.max(0, tr.offsetHeight - vp.clientHeight);
    setDistance(d);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // سرعت اسکرول متناسب با طول صفحه (نه خیلی تند، نه خیلی کند)
  const duration = Math.min(11000, Math.max(2600, distance * 3.4));

  return { viewportRef, trackRef, distance, duration, measure };
}

/* ═══════════════════════════════════════════════════════════════
   HOOK: تشخیص دستگاه لمسی + پخش خودکار وقتی در دید است
═══════════════════════════════════════════════════════════════ */
function useAutoPlay(distance: number, duration: number) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [inView, setInView] = useState(false);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isTouch || !inView || distance <= 4) {
      setAuto(false);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      if (cancelled) return;
      setAuto(true);
      timer = setTimeout(() => {
        if (cancelled) return;
        setAuto(false);
        timer = setTimeout(cycle, 2200); // مکث در بالا
      }, duration + 1400); // مکث در پایین
    };
    timer = setTimeout(cycle, 900);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isTouch, inView, distance, duration]);

  return { wrapRef, isTouch, auto };
}

/* ═══════════════════════════════════════════════════════════════
   LAPTOP  —  کاملاً صاف و ایستاده از روبرو
═══════════════════════════════════════════════════════════════ */
export function LaptopMockup({
  screenshot,
  alt,
  className,
  hint = "هاور کنید تا اسکرول شود",
}: {
  screenshot: string;
  alt: string;
  className?: string;
  hint?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { viewportRef, trackRef, distance, duration, measure } = useScrollDistance();
  const { wrapRef, isTouch, auto } = useAutoPlay(distance, duration);

  const active = hovered || auto;

  return (
    <div
      ref={wrapRef}
      className={cn("group relative w-full", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "relative w-full transition-transform duration-700 ease-out",
          active ? "scale-[1.015] -translate-y-1.5" : "scale-100 translate-y-0"
        )}
      >
        {/* ── قاب صفحه نمایش ── */}
        <div className="relative mx-auto w-full">
          <div className="relative rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-[#26262a] to-[#141416] p-1.5 sm:p-2.5 pb-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.65)]">
            {/* دوربین */}
            <div className="absolute top-[3px] sm:top-1 left-1/2 h-1 w-1 sm:h-1.5 sm:w-1.5 -translate-x-1/2 rounded-full bg-[#3a3a3e]">
              <div className="absolute inset-[1px] rounded-full bg-black" />
            </div>

            {/* صفحه نمایش */}
            <div
              ref={viewportRef}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[3px] sm:rounded-t-md bg-white"
            >
              <div
                ref={trackRef}
                className="absolute inset-x-0 top-0 w-full will-change-transform"
                style={{
                  transform: `translate3d(0, ${active ? -distance : 0}px, 0)`,
                  transition: `transform ${duration}ms cubic-bezier(0.33, 0, 0.25, 1)`,
                }}
              >
                <Image
                  src={screenshot}
                  alt={alt}
                  width={1400}
                  height={4000}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="block h-auto w-full"
                  quality={95}
                  priority
                  onLoad={measure}
                />
              </div>

              {/* انعکاس نور روی شیشه */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            </div>
          </div>

          {/* ── لولا و بدنه ── */}
          <div className="relative z-10">
            <div className="h-2 sm:h-3 bg-gradient-to-b from-[#1b1b1e] to-[#101012]" />
            <div className="mx-[-4.5%] h-1.5 sm:h-2.5 rounded-b-lg sm:rounded-b-xl bg-gradient-to-b from-[#b8b8bb] to-[#87878a] shadow-[0_12px_28px_rgba(0,0,0,0.5)]" />
            <div className="mx-[-2.5%] h-[3px] sm:h-1 rounded-b-md bg-[#5c5c5e]" />
          </div>
        </div>

        {/* سایه زیر دستگاه */}
        <div
          className={cn(
            "absolute -bottom-5 left-1/2 h-4 -translate-x-1/2 rounded-[50%] transition-all duration-700",
            active
              ? "w-[84%] bg-black/25 blur-2xl"
              : "w-[92%] bg-black/45 blur-xl"
          )}
        />
      </div>

      {/* راهنمای هاور — فقط دسکتاپ */}
      {!isTouch && (
        <div
          className={cn(
            "pointer-events-none absolute -bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-primary-950/90 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm transition-opacity duration-500",
            active ? "opacity-0" : "opacity-100"
          )}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-bounce">
            <path d="M12 5v14m-7-7 7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {hint}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PHONE  —  با زاویه سه‌بعدی مایل
═══════════════════════════════════════════════════════════════ */
export function PhoneMockup({
  screenshot,
  alt,
  className,
  tilt = true,
}: {
  screenshot: string;
  alt: string;
  className?: string;
  tilt?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { viewportRef, trackRef, distance, duration, measure } = useScrollDistance();
  const { wrapRef, auto } = useAutoPlay(distance, duration);

  const active = hovered || auto;

  return (
    <div
      ref={wrapRef}
      className={cn("group relative w-full", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}>
        <div
          className={cn(
            "relative mx-auto w-full transition-transform duration-700 ease-out",
            !tilt
              ? active
                ? "scale-[1.03]"
                : "scale-100"
              : active
              ? "[transform:rotateY(0deg)_rotateX(0deg)_rotateZ(0deg)_scale(1.04)]"
              : "[transform:rotateY(-14deg)_rotateX(5deg)_rotateZ(2deg)_scale(1)]"
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* بدنه گوشی */}
          <div className="relative rounded-[1.9rem] sm:rounded-[2.4rem] bg-gradient-to-b from-[#2d2d31] to-[#101012] p-[5px] sm:p-2 shadow-[0_22px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/15">
            <div
              ref={viewportRef}
              className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.6rem] sm:rounded-[2rem] bg-white"
            >
              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 z-20 h-4 sm:h-5 w-[34%] -translate-x-1/2 rounded-b-xl sm:rounded-b-2xl bg-black" />

              <div
                ref={trackRef}
                className="absolute inset-x-0 top-0 w-full will-change-transform"
                style={{
                  transform: `translate3d(0, ${active ? -distance : 0}px, 0)`,
                  transition: `transform ${duration}ms cubic-bezier(0.33, 0, 0.25, 1)`,
                }}
              >
                <Image
                  src={screenshot}
                  alt={alt}
                  width={600}
                  height={2600}
                  sizes="(max-width: 1024px) 45vw, 240px"
                  className="block h-auto w-full"
                  quality={95}
                  onLoad={measure}
                />
              </div>

              {/* انعکاس */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] sm:rounded-[2rem] bg-gradient-to-br from-white/[0.09] via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] sm:rounded-[2rem] ring-1 ring-inset ring-white/10" />
            </div>

            {/* دکمه‌های کناری */}
            <div className="absolute -right-[2px] top-[22%] h-[8%] w-[3px] rounded-r-sm bg-[#2b2b2e]" />
            <div className="absolute -left-[2px] top-[17%] h-[5%] w-[3px] rounded-l-sm bg-[#2b2b2e]" />
            <div className="absolute -left-[2px] top-[25%] h-[9%] w-[3px] rounded-l-sm bg-[#2b2b2e]" />
          </div>

          {/* سایه */}
          <div
            className={cn(
              "absolute -bottom-4 left-1/2 h-4 -translate-x-1/2 rounded-[50%] transition-all duration-700",
              active ? "w-[62%] bg-black/20 blur-2xl" : "w-[76%] bg-black/40 blur-xl"
            )}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHOWCASE  —  موبایل: ستونی و بزرگ | دسکتاپ: کنار هم و باشکوه
═══════════════════════════════════════════════════════════════ */
export function DeviceShowcase({
  desktopScreenshot,
  mobileScreenshot,
  alt,
  locale = "fa",
}: {
  desktopScreenshot: string;
  mobileScreenshot: string;
  alt: string;
  locale?: string;
}) {
  const isFa = locale === "fa";

  return (
    <div className="relative mx-auto w-full max-w-7xl px-2 sm:px-6">
      {/* هاله نور پس‌زمینه */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/15 blur-[120px] sm:h-[620px] sm:w-[920px]" />
        <div className="absolute right-6 top-0 h-[320px] w-[320px] rounded-full bg-accent-400/10 blur-[90px]" />
      </div>

      {/*
        زیر lg  → ستونی: لپ‌تاپ تمام‌عرض + گوشی بزرگ زیر آن (عکس‌ها کاملاً واضح)
        از lg   → ردیفی: لپ‌تاپ بزرگ + گوشی سه‌بعدی روی گوشه‌اش
      */}
      <div className="relative flex flex-col items-center gap-14 lg:flex-row lg:items-end lg:justify-center lg:gap-0">
        {/* ── لپ‌تاپ ── */}
        <div className="relative z-10 w-full max-w-[560px] shrink-0 sm:max-w-[640px] md:max-w-[720px] lg:max-w-[820px]">
          <LaptopMockup
            screenshot={desktopScreenshot}
            alt={`${alt} — Desktop`}
            hint={isFa ? "هاور کنید تا اسکرول شود" : "Hover to scroll"}
          />
          <p className="mt-9 text-center text-[11px] font-bold uppercase tracking-widest text-white/40 lg:mt-10">
            {isFa ? "نسخه دسکتاپ" : "Desktop View"}
          </p>
        </div>

        {/* ── گوشی ── */}
        <div
          className={cn(
            "relative z-20 w-[210px] shrink-0 sm:w-[240px]",
            "lg:-ms-28 lg:mb-[-22px] lg:w-[225px]"
          )}
        >
          {/* در موبایل صاف و بزرگ، در دسکتاپ مایل و سه‌بعدی */}
          <div className="lg:hidden">
            <PhoneMockup
              screenshot={mobileScreenshot}
              alt={`${alt} — Mobile`}
              tilt={false}
            />
          </div>
          <div className="hidden lg:block">
            <PhoneMockup
              screenshot={mobileScreenshot}
              alt={`${alt} — Mobile`}
              tilt
            />
          </div>

          <p className="mt-8 text-center text-[11px] font-bold uppercase tracking-widest text-white/40 lg:hidden">
            {isFa ? "نسخه موبایل" : "Mobile View"}
          </p>
        </div>
      </div>
    </div>
  );
}