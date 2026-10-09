// components/project-stats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function ProjectStats({ stats }: { stats: Stat[] }) {
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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (stats.length === 0) return null;

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-lg",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ transitionDelay: `${i * 120}ms` }}
        >
          <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", stat.color)}>
            {stat.icon}
          </div>
          <p className="text-xl font-extrabold text-primary-900 dark:text-primary-100 sm:text-2xl">
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-medium text-muted">{stat.label}</p>

          {/* Hover gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-400/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}