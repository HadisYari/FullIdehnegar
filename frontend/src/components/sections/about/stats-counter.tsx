// components/sections/about/stats-counter.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n/dictionaries";

const statsData = {
  fa: [
    { value: 15, suffix: "+", label: "سال تجربه", icon: "📅" },
    { value: 300, suffix: "+", label: "پروژه موفق", icon: "🚀" },
    { value: 50, suffix: "+", label: "مشتری فعال", icon: "🤝" },
    { value: 4, suffix: "", label: "کشور همکاری", icon: "🌍" },
  ],
  en: [
    { value: 15, suffix: "+", label: "Years Experience", icon: "📅" },
    { value: 300, suffix: "+", label: "Successful Projects", icon: "🚀" },
    { value: 50, suffix: "+", label: "Active Clients", icon: "🤝" },
    { value: 4, suffix: "", label: "Countries Served", icon: "🌍" },
  ],
};

function AnimatedNumber({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsCounter({ locale }: { locale: Locale }) {
  const stats = statsData[locale];

  return (
    <section className="relative -mt-16 z-20 sm:-mt-20">
      <Container>
        <motion.div
          className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-background/80 p-4 shadow-2xl shadow-primary-950/5 backdrop-blur-xl sm:gap-4 sm:p-6 lg:grid-cols-4"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-surface to-background p-5 text-center transition-all duration-300 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-500/5 sm:p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-500/0 to-primary-500/0 opacity-0 transition-opacity duration-300 group-hover:from-accent-500/5 group-hover:to-primary-500/5 group-hover:opacity-100" />

              <span className="text-2xl sm:text-3xl">{stat.icon}</span>
              <p className="mt-3 text-2xl font-black tabular-nums text-primary-950 dark:text-white sm:text-4xl">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-xs font-medium text-foreground/50 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}