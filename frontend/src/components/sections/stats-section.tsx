"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Users, Briefcase, Calendar, Award, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Container } from "../container";
import { siteConfig } from "@/lib/site-config";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { LiquidWaveTop } from "../LiquidWaveTop";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}

function Counter({ value, locale }: { value: number; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, { mass: 1, stiffness: 60, damping: 18 });
  const displayValue = useTransform(spring, (current) =>
    formatNumber(Math.floor(current), locale)
  );

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

/* ──────────────────────────────────────────────────────────
   موج نرم و دایره‌ای — منحنی‌های Cubic Bezier نرم
   ────────────────────────────────────────────────────────── */
 

export function StatsSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats: StatItem[] = [
    { value: siteConfig.stats.clients, suffix: "+", label: dict.stats.clients, icon: Users },
    { value: siteConfig.stats.projects, suffix: "+", label: dict.stats.projects, icon: Briefcase },
    { value: siteConfig.stats.yearsActive, suffix: "+", label: dict.stats.years, icon: Calendar },
    { value: siteConfig.stats.awards, suffix: "+", label: dict.stats.awards, icon: Award },
  ];

  return (
    <section ref={ref} className="relative bg-[#0f0f52]">
      <LiquidWaveTop />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-[#e6304c]/10 blur-[100px]" />
        <div className="absolute right-1/4 bottom-10 h-64 w-64 rounded-full bg-[#e6304c]/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 py-7 sm:py-10">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="group relative"
                  initial={{ opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-[#e6304c]/40 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e6304c]/15">
                    <div className="absolute top-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#e6304c] to-transparent transition-all duration-300 group-hover:w-full" />

                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#e6304c] shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#e6304c] group-hover:to-[#e6304c]/80 group-hover:text-white">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      <div className="flex items-baseline justify-center gap-0.5">
                        <p className="text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                          <Counter value={stat.value} locale={locale} />
                        </p>
                        {stat.suffix && (
                          <span className="text-2xl font-bold text-[#e6304c] sm:text-3xl lg:text-4xl">
                            {stat.suffix}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors duration-300 group-hover:text-white">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </div>

      <style jsx global>{`
        @keyframes liquid-wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-slower { animation: liquid-wave 36s linear infinite; }
        .animate-wave-slow   { animation: liquid-wave 28s linear infinite; }
        .animate-wave-medium { animation: liquid-wave 22s linear infinite; }
        .animate-wave-fast   { animation: liquid-wave 16s linear infinite; }
        .animate-wave-faster { animation: liquid-wave 12s linear infinite; }
      `}</style>
    </section>
  );
}