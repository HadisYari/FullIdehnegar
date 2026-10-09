// components/project-info-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { localeHref } from "@/lib/i18n/paths";
import { categoryLabel } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

interface ProjectInfoProps {
  item: {
    client: Record<string, string>;
    year: number;
    category: string;
    tags?: string[];
    link?: string;
  };
  locale: Locale;
  dict: Dictionary;
}

export function ProjectInfoCard({ item, locale, dict }: ProjectInfoProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const infoItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: dict.portfolio.client,
      value: item.client[locale],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        </svg>
      ),
      label: dict.portfolio.year,
      value: formatNumber(item.year, locale),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      label: dict.portfolio.category,
      value: categoryLabel(item.category, locale),
      color: "from-accent-500 to-accent-600",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Main info card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-surface via-surface to-primary-50/40 p-6 shadow-lg shadow-primary-900/5 backdrop-blur-sm dark:to-primary-950/20">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-accent-400/15 blur-2xl" />

        {/* Header ribbon */}
        <div className="relative mb-5 flex items-center gap-2 border-b border-border/60 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-sm font-extrabold text-primary-900 dark:text-primary-100">
            {locale === "fa" ? "اطلاعات پروژه" : "Project Info"}
          </h3>
        </div>

        <dl className="relative space-y-3">
          {infoItems.map((info, idx) => (
            <div
              key={idx}
              className="group flex items-start gap-3 rounded-2xl border border-transparent p-3 transition-all hover:border-primary-200/60 hover:bg-white/60 hover:shadow-sm dark:hover:border-primary-800/40 dark:hover:bg-primary-950/30"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110",
                  info.color
                )}
              >
                {info.icon}
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {info.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-bold text-primary-900 dark:text-primary-100">
                  {info.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Technologies */}
        {item.tags && item.tags.length > 0 && (
          <div className="relative mt-5 border-t border-border/60 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-500">
                <path d="m7 20-4-4 4-4M17 4l4 4-4 4M14 4l-4 16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {dict.portfolio.technologies}
              </dt>
            </div>
            <dd className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                  className={cn(
                    "cursor-default rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
                    hoveredTag === tag
                      ? "border-primary-400 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25 scale-105"
                      : "border-border bg-white/60 text-foreground/70 dark:bg-primary-950/30"
                  )}
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}

        {/* Live link button */}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 bg-[length:200%_100%] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-500/30 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-accent-500/40 hover:-translate-y-0.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="relative transition-transform group-hover/btn:rotate-45"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="relative">{dict.portfolio.liveLink}</span>
          </a>
        )}
      </div>

      {/* CTA Card */}
      <Link
        href={localeHref(locale, "/contact")}
        className="group/cta relative block overflow-hidden rounded-3xl border border-accent-300/60 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 p-6 shadow-xl shadow-accent-500/25 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent-500/35"
      >
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover/cta:scale-150" />
        <div className="pointer-events-none absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />

        {/* Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover/cta:scale-110 group-hover/cta:rotate-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 text-start">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              {locale === "fa" ? "پروژه مشابه" : "Similar Project"}
            </p>
            <p className="mt-1 text-sm font-extrabold text-white">
              {dict.hero.ctaPrimary}
            </p>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="shrink-0 text-white/80 transition-transform group-hover/cta:translate-x-1 rtl:rotate-180 rtl:group-hover/cta:-translate-x-1"
          >
            <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>
    </div>
  );
}