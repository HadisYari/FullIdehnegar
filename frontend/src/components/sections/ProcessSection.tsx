"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Container } from "../container";
import { Reveal } from "../reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  MessagesSquare,
  FileSearch,
  PencilRuler,
  Code2,
  TestTube2,
  Rocket,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Play,
  Flag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const stepConfig = [
  { icon: MessagesSquare, color: "from-blue-500 to-cyan-500", accent: "#3b82f6" },
  { icon: FileSearch, color: "from-violet-500 to-purple-500", accent: "#8b5cf6" },
  { icon: PencilRuler, color: "from-pink-500 to-rose-500", accent: "#ec4899" },
  { icon: Code2, color: "from-[#e6304c] to-red-600", accent: "#e6304c" },
  { icon: TestTube2, color: "from-amber-500 to-orange-500", accent: "#f59e0b" },
  { icon: Rocket, color: "from-emerald-500 to-teal-500", accent: "#10b981" },
  { icon: Headphones, color: "from-indigo-500 to-blue-500", accent: "#6366f1" },
];

/* ──────────────── کارت هر مرحله ──────────────── */
interface StepItem {
  title: string;
  desc: string;
  duration?: string;
}

function StepCard({
  step,
  index,
  total,
  isActive,
  isDone,
  onHover,
}: {
  step: StepItem;
  index: number;
  total: number;
  isActive: boolean;
  isDone: boolean;
  onHover: () => void;
}) {
  const config = stepConfig[index % stepConfig.length];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      className="group relative h-full"
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-6 transition-all duration-500"
        style={{
          borderColor: isActive ? `${config.accent}60` : "rgb(226 232 240)",
          boxShadow: isActive
            ? `0 20px 50px -15px ${config.accent}40`
            : "0 4px 20px -8px rgb(15 23 42 / 0.08)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-slate-100">
          <motion.div
            className={`h-full bg-gradient-to-r ${config.color}`}
            initial={false}
            animate={{ width: isActive || isDone ? "100%" : "0%" }}
            transition={{ duration: isActive ? 3 : 0.4, ease: "linear" }}
          />
        </div>
        <div
          className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-700"
          style={{ backgroundColor: config.accent, opacity: isActive ? 0.15 : 0.04 }}
        />
        <span
          className="pointer-events-none absolute -bottom-4 end-2 select-none font-mono text-8xl font-black leading-none transition-colors duration-500"
          style={{ color: isActive ? `${config.accent}18` : "rgb(241 245 249)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative flex items-center justify-between">
          <motion.div
            animate={isActive ? { rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${config.color} transition-transform duration-300 group-hover:scale-110`}
            style={{ boxShadow: `0 8px 20px -6px ${config.accent}60` }}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </motion.div>
          {step.duration && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ backgroundColor: `${config.accent}12`, color: config.accent }}
            >
              <Clock className="h-3 w-3" />
              {step.duration}
            </span>
          )}
        </div>

        <h3 className="relative mt-5 text-lg font-black tracking-tight text-slate-900">{step.title}</h3>
        <p className="relative mt-2 text-sm leading-7 text-slate-500">{step.desc}</p>

        <div className="relative mt-auto flex items-center gap-2 pt-5">
          <span
            className="font-mono text-[11px] font-black"
            style={{ color: isActive || isDone ? config.accent : "rgb(148 163 184)" }}
          >
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-slate-100" />
          {isDone && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: config.accent }} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── کارت پایانی ──────────────── */
function FinalCard({ dict }: { dict: Dictionary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#e6304c] to-rose-600 p-6 text-white shadow-2xl shadow-[#e6304c]/30"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/20"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-12 -start-12 h-32 w-32 rounded-full bg-white/10"
      />
      <div className="relative flex h-full flex-col">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <h3 className="mt-5 text-lg font-black">{dict.process.finalLabel}</h3>
        <p className="mt-2 text-sm leading-7 text-white/80">{dict.process.finalDesc}</p>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group relative mt-6 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-5 py-3 text-sm font-black text-[#e6304c] shadow-lg"
        >
          <motion.span
            className="absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-rose-100 to-transparent"
            animate={{ x: ["-150%", "150%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          />
          <span className="relative">{dict.process.ctaLabel}</span>
          <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ──────────────── فلش بین کارت‌ها (افقی) ──────────────── */
function HorizontalArrow({ color, delay, isRtl }: { color: string; delay: number; isRtl: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", delay, stiffness: 300 }}
      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100"
      style={{
        [isRtl ? "left" : "right"]: -16,
      }}
    >
      <motion.div
        animate={{ x: isRtl ? [-2, 2, -2] : [2, -2, 2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isRtl ? (
          <ChevronLeft className="h-4 w-4" style={{ color }} strokeWidth={3} />
        ) : (
          <ChevronRight className="h-4 w-4" style={{ color }} strokeWidth={3} />
        )}
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── فلش عمودی بین ردیف‌ها ──────────────── */
function VerticalArrow({ isRtl }: { isRtl: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", delay: 0.8, stiffness: 300 }}
      className="mx-auto my-3 hidden h-10 w-10 lg:flex items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100"
      style={{
        marginInlineStart: isRtl ? undefined : "auto",
        marginInlineEnd: isRtl ? undefined : 0,
        [isRtl ? "marginInlineStart" : "marginInlineEnd"]: "10%",
        [isRtl ? "marginInlineEnd" : "marginInlineStart"]: "auto",
      }}
    >
      <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <ChevronDown className="h-5 w-5 text-[#e6304c]" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── نشانگر شروع ──────────────── */
function StartBadge({ isRtl }: { isRtl: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", delay: 0.1 }}
      className="mb-4 hidden lg:flex items-center gap-2"
      style={{
        [isRtl ? "marginInlineEnd" : "marginInlineStart"]: 0,
        [isRtl ? "marginInlineStart" : "marginInlineEnd"]: "auto",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 ring-4 ring-blue-100"
      >
        <Play className="h-3.5 w-3.5 fill-white text-white ms-0.5" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
          Start Here
        </span>
        <span className="text-[9px] text-slate-400">شروع مسیر</span>
      </div>
    </motion.div>
  );
}

/* ──────────────── نشانگر پایان ──────────────── */
function EndBadge({ isRtl }: { isRtl: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", delay: 1.2 }}
      className="mt-4 hidden lg:flex items-center gap-2"
      style={{
        [isRtl ? "marginInlineStart" : "marginInlineEnd"]: 0,
        [isRtl ? "marginInlineEnd" : "marginInlineStart"]: "auto",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#e6304c] to-rose-600 shadow-lg shadow-[#e6304c]/30 ring-4 ring-red-100"
      >
        <Flag className="h-3.5 w-3.5 fill-white text-white" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#e6304c]">
          Finish
        </span>
        <span className="text-[9px] text-slate-400">تحویل پروژه</span>
      </div>
    </motion.div>
  );
}

/* ──────────────── موج بالا ──────────────── */
function LiquidWaveTop() {
  const waves = [
    { d: "M0,55 C150,20 350,90 500,55 C650,20 850,90 1000,55 L1000,100 L0,100 Z", opacity: 0.08 },
    { d: "M0,58 C180,30 320,85 500,58 C680,30 820,85 1000,58 L1000,100 L0,100 Z", opacity: 0.14 },
    { d: "M0,62 C120,40 280,88 500,62 C720,36 880,80 1000,62 L1000,100 L0,100 Z", opacity: 0.22 },
    { d: "M0,66 C200,42 360,90 500,66 C640,42 800,90 1000,66 L1000,100 L0,100 Z", opacity: 0.35 },
    { d: "M0,72 C160,48 340,92 500,72 C660,52 840,92 1000,72 L1000,100 L0,100 Z", opacity: 1, fill: "#f8fafc" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 -translate-y-[88%] overflow-hidden leading-none">
      <div className="relative h-[60px] w-full sm:h-[90px] md:h-[120px]">
        {waves.map((wave, i) => (
          <svg key={i} className="absolute inset-0 h-full w-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d={wave.d} fill={wave.fill || "#e6304c"} opacity={wave.opacity} />
          </svg>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── موج پایین ──────────────── */
function LiquidWaveBottom() {
  const waves = [
    { d: "M0,45 C150,80 350,10 500,45 C650,80 850,10 1000,45 L1000,0 L0,0 Z", opacity: 0.08 },
    { d: "M0,42 C180,70 320,15 500,42 C680,70 820,15 1000,42 L1000,0 L0,0 Z", opacity: 0.14 },
    { d: "M0,38 C120,60 280,12 500,38 C720,64 880,20 1000,38 L1000,0 L0,0 Z", opacity: 0.22 },
    { d: "M0,34 C200,58 360,10 500,34 C640,58 800,10 1000,34 L1000,0 L0,0 Z", opacity: 0.35 },
    { d: "M0,28 C160,52 340,8 500,28 C660,48 840,8 1000,28 L1000,0 L0,0 Z", opacity: 1, fill: "#f8fafc" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 translate-y-[88%] overflow-hidden leading-none">
      <div className="relative h-[60px] w-full sm:h-[90px] md:h-[120px]">
        {waves.map((wave, i) => (
          <svg key={i} className="absolute inset-0 h-full w-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d={wave.d} fill={wave.fill || "#e6304c"} opacity={wave.opacity} />
          </svg>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── کامپوننت اصلی ──────────────── */
export function ProcessSection({ dict }: { dict: Dictionary }) {
  const steps = dict.process.steps as StepItem[];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isRtl = dict.dir === "rtl";
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSlides = steps.length + 1;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((p) => (p + 1) % steps.length), 3000);
    return () => clearInterval(t);
  }, [paused, steps.length]);

  const scrollToSlide = useCallback((i: number) => {
    const el = sliderRef.current;
    if (!el || !el.children[0]) return;
    const child = el.children[0] as HTMLElement;
    el.scrollTo({ left: i * (child.offsetWidth + 16), behavior: "smooth" });
  }, []);

  const startAutoScroll = useCallback(() => {
    if (mobileTimerRef.current) clearInterval(mobileTimerRef.current);
    mobileTimerRef.current = setInterval(() => {
      setMobileIndex((prev) => {
        const next = prev >= totalSlides - 1 ? 0 : prev + 1;
        scrollToSlide(next);
        return next;
      });
    }, 3000);
  }, [totalSlides, scrollToSlide]);

  const stopAutoScroll = useCallback(() => {
    if (mobileTimerRef.current) {
      clearInterval(mobileTimerRef.current);
      mobileTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  const handleTouchStart = () => {
    stopAutoScroll();
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => startAutoScroll(), 4000);
  };

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el || !el.children[0]) return;
    const child = el.children[0] as HTMLElement;
    const idx = Math.round(el.scrollLeft / (child.offsetWidth + 16));
    setMobileIndex(Math.min(Math.max(idx, 0), totalSlides - 1));
  };

  const handleDotClick = (i: number) => {
    stopAutoScroll();
    setMobileIndex(i);
    scrollToSlide(i);
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => startAutoScroll(), 4000);
  };

  const row1 = steps.slice(0, 4);
  const row2 = steps.slice(4);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 sm:py-28">
      <LiquidWaveTop />
      <LiquidWaveBottom />

      {/* پس‌زمینه تزیینی */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_30%,transparent_100%)]"
          style={{
            backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -start-32 top-10 h-[420px] w-[420px] rounded-full bg-[#e6304c]/[0.07] blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -end-32 bottom-10 h-[420px] w-[420px] rounded-full bg-indigo-500/[0.07] blur-[110px]"
        />
      </div>

      <Container className="relative z-10">
        {/* هدر */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e6304c]/20 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#e6304c] shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              {dict.process.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
              {dict.process.title}
              <span className="bg-gradient-to-r from-[#e6304c] via-rose-500 to-indigo-600 bg-clip-text text-transparent">.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{dict.process.subtitle}</p>
          </Reveal>
        </div>

        {/* دسکتاپ */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <StartBadge isRtl={isRtl} />

          {/* ردیف ۱ */}
          <div className="relative grid grid-cols-2 gap-5 lg:grid-cols-4">
            {row1.map((step, i) => (
              <div key={step.title} className="relative">
                <StepCard
                  step={step}
                  index={i}
                  total={steps.length}
                  isActive={active === i}
                  isDone={i < active}
                  onHover={() => setActive(i)}
                />
                {i < 3 && (
                  <HorizontalArrow
                    color={stepConfig[i].accent}
                    delay={0.4 + i * 0.15}
                    isRtl={isRtl}
                  />
                )}
              </div>
            ))}
          </div>

          <VerticalArrow isRtl={isRtl} />

          {/* ردیف ۲ */}
          <div className="relative grid grid-cols-2 gap-5 lg:grid-cols-4">
            {row2.map((step, i) => {
              const realIndex = i + 4;
              return (
                <div key={step.title} className="relative">
                  <StepCard
                    step={step}
                    index={realIndex}
                    total={steps.length}
                    isActive={active === realIndex}
                    isDone={realIndex < active}
                    onHover={() => setActive(realIndex)}
                  />
                  {i < row2.length - 1 && (
                    <HorizontalArrow
                      color={stepConfig[realIndex].accent}
                      delay={1.0 + i * 0.15}
                      isRtl={isRtl}
                    />
                  )}
                  {i === row2.length - 1 && (
                    <HorizontalArrow
                      color={stepConfig[realIndex].accent}
                      delay={1.5}
                      isRtl={isRtl}
                    />
                  )}
                </div>
              );
            })}
            <div className="relative">
              <FinalCard dict={dict} />
            </div>
          </div>

          <EndBadge isRtl={isRtl} />
        </div>

        {/* موبایل */}
        <div className="md:hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            dir="ltr"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {steps.map((step, i) => (
              <div key={step.title} className="w-[80vw] max-w-[320px] shrink-0 snap-center">
                <StepCard
                  step={step}
                  index={i}
                  total={steps.length}
                  isActive={mobileIndex === i}
                  isDone={i < mobileIndex}
                  onHover={() => {}}
                />
              </div>
            ))}
            <div className="w-[80vw] max-w-[320px] shrink-0 snap-center">
              <FinalCard dict={dict} />
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                aria-label={`slide ${i + 1}`}
                onClick={() => handleDotClick(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: mobileIndex === i ? 24 : 8,
                  backgroundColor:
                    mobileIndex === i
                      ? i < steps.length
                        ? stepConfig[i % stepConfig.length].accent
                        : "#e6304c"
                      : "rgb(203 213 225)",
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}