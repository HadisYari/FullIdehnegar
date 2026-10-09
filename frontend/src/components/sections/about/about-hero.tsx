// components/sections/about/about-hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n/dictionaries";

const content = {
  fa: {
    eyebrow: "درباره ما",
    titleLine1: "ما فقط کد نمی‌نویسیم",
    titleLine2: "آینده دیجیتال شما را می‌سازیم",
    subtitle:
      "بیش از ۱۵ سال تجربه در طراحی و توسعه نرم‌افزارهای سازمانی، پرتال‌های تحت وب و اتوماسیون‌های اختصاصی با استانداردهای بین‌المللی.",
    scroll: "بیشتر بدانید",
  },
  en: {
    eyebrow: "About Us",
    titleLine1: "We don't just write code",
    titleLine2: "We build your digital future",
    subtitle:
      "15+ years of experience designing and developing enterprise software, web portals, and custom automation to international standards.",
    scroll: "Learn more",
  },
};

// Floating code-like particles
function FloatingParticles() {
  const particles = [
    { text: "</>", x: "10%", y: "20%", delay: 0, duration: 6 },
    { text: "{}", x: "85%", y: "15%", delay: 1, duration: 7 },
    { text: "( )", x: "75%", y: "70%", delay: 2, duration: 5 },
    { text: "=>", x: "15%", y: "75%", delay: 0.5, duration: 8 },
    { text: "[ ]", x: "50%", y: "10%", delay: 1.5, duration: 6 },
    { text: "&&", x: "90%", y: "50%", delay: 3, duration: 7 },
    { text: "//", x: "5%", y: "50%", delay: 2.5, duration: 5 },
    { text: "01", x: "60%", y: "80%", delay: 0.8, duration: 9 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-sm font-bold text-accent-500/20 sm:text-base"
          style={{ left: p.x, top: p.y }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, -15, 10, 0],
            opacity: [0.15, 0.3, 0.15, 0.3, 0.15],
            rotate: [0, 10, -10, 5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.text}
        </motion.span>
      ))}
    </div>
  );
}

// Animated grid background
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient mesh */}
      <div className="absolute -start-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-accent-500/5 blur-[120px]" />
      <div className="absolute -bottom-1/4 -end-1/4 h-[500px] w-[500px] rounded-full bg-primary-500/5 blur-[120px]" />

      {/* Dot grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
        <defs>
          <pattern
            id="about-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-grid)" />
      </svg>

      {/* Animated lines */}
      <motion.div
        className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-accent-500/20 to-transparent"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-0 top-2/3 h-px w-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent"
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 4,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function AboutHero({ locale }: { locale: Locale }) {
  const t = content[locale];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-background pt-24 sm:min-h-screen sm:pt-0"
    >
      <GridBackground />
      <FloatingParticles />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full">
        <Container className="text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-700 backdrop-blur-sm dark:border-accent-800 dark:bg-accent-950/50 dark:text-accent-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-600" />
              </span>
              {t.eyebrow}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mt-6 text-balance text-3xl font-black leading-tight tracking-tight text-primary-950 dark:text-white sm:mt-8 sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="block">{t.titleLine1}</span>
            <span className="mt-1 block bg-gradient-to-l from-accent-600 via-accent-500 to-primary-600 bg-clip-text text-transparent sm:mt-2">
              {t.titleLine2}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-foreground/60 sm:mt-8 sm:text-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>

          {/* Decorative terminal window */}
          <motion.div
            className="mx-auto mt-10 max-w-lg sm:mt-14"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-primary-950 shadow-2xl shadow-primary-950/20 dark:bg-gray-900">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ms-3 font-mono text-[11px] text-white/40">
                  idehnegar.ts
                </span>
              </div>
              {/* Terminal body */}
              <div className="p-4 text-start font-mono text-xs leading-6 text-green-400 sm:p-6 sm:text-sm">
                <TypewriterCode locale={locale} />
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-2 sm:mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-xs text-foreground/40">{t.scroll}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg
                className="h-5 w-5 text-foreground/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}

/* ── Typewriter effect for the terminal ── */
function TypewriterCode({ locale }: { locale: Locale }) {
  const lines =
    locale === "fa"
      ? [
          { prefix: "const", text: ' company = "پیشگامان ایده‌نگار";' },
          { prefix: "const", text: " experience = 15; // سال" },
          { prefix: "const", text: " projects = 300+;" },
          {
            prefix: "const",
            text: ' stack = ["Next.js", "React", ".NET"];',
          },
          { prefix: "const", text: ' status = "دانش‌بنیان ✓";' },
          { prefix: "", text: "" },
          {
            prefix: "export default",
            text: " buildYourFuture(company);",
          },
        ]
      : [
          { prefix: "const", text: ' company = "Idehnegar Pioneers";' },
          { prefix: "const", text: " experience = 15; // years" },
          { prefix: "const", text: " projects = 300+;" },
          {
            prefix: "const",
            text: ' stack = ["Next.js", "React", ".NET"];',
          },
          { prefix: "const", text: ' status = "Knowledge-Based ✓";' },
          { prefix: "", text: "" },
          {
            prefix: "export default",
            text: " buildYourFuture(company);",
          },
        ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const timer = setTimeout(
        () => setVisibleLines((v) => v + 1),
        400 + Math.random() * 200
      );
      return () => clearTimeout(timer);
    }
  }, [visibleLines, lines.length]);

  return (
    <>
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="flex gap-1">
          {line.prefix && (
            <span className="text-purple-400">{line.prefix}</span>
          )}
          <span className="text-green-300">{line.text}</span>
        </div>
      ))}
      {visibleLines < lines.length && (
        <motion.span
          className="inline-block h-4 w-2 bg-green-400"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </>
  );
}