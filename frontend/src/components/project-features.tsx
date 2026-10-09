// components/project-features.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ProjectFeatures({
  features,
  title,
}: {
  features: Feature[];
  title: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (features.length === 0) return null;

  // پالت رنگ برای هر کارت
  const colors = [
    "from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/30",
    "from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/30",
    "from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-800/30",
    "from-emerald-500/10 to-teal-500/10 border-emerald-200/50 dark:border-emerald-800/30",
    "from-rose-500/10 to-red-500/10 border-rose-200/50 dark:border-rose-800/30",
    "from-indigo-500/10 to-violet-500/10 border-indigo-200/50 dark:border-indigo-800/30",
  ];

  const badgeColors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-red-500",
    "from-indigo-500 to-violet-500",
  ];

  return (
    <div ref={ref}>
      {title && (
        <h2 className="mb-6 text-xl font-bold text-primary-900 dark:text-primary-100 sm:text-2xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature, i) => {
          const colorClass = colors[i % colors.length];
          const badgeClass = badgeColors[i % badgeColors.length];

          return (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-lg",
                colorClass,
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Number badge */}
              <div
                className={cn(
                  "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
                  badgeClass
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-sm font-bold text-primary-900 dark:text-primary-100">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-foreground/70">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-2xl opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/5" />

              {/* Corner accent */}
              <div
                className={cn(
                  "pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-20",
                  badgeClass
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}