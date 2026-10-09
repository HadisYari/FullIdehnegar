// components/portfolio-filter-grid.tsx
"use client";

import { useMemo, useState } from "react";
import { PortfolioCard } from "./portfolio-card";
import type { PortfolioItem } from "@/lib/portfolio";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { Category } from "@/lib/categories";
import { cn } from "@/lib/cn";

export function PortfolioFilterGrid({
  items,
  locale,
  categories,
  viewLabel,
  allLabel,
  emptyLabel,
}: {
  items: PortfolioItem[];
  locale: Locale;
  categories: Category[];
  viewLabel: string;
  allLabel: string;
  emptyLabel: string;
}) {
  const isFa = locale === "fa";
  const [active, setActive] = useState<string>("all");

  const usedCategories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return categories.filter((c) => set.has(c.slug));
  }, [items, categories]);

  const filtered =
    active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div className="w-full">
      {/* ── فیلترهای رنگی و شیشه‌ای (طراحی تمیز بدون اشغال فضا) ── */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between border-b border-slate-200/80 pb-5">
        
        {/* دکمه‌های کپسولی فیلتر */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-white/80 p-1.5 shadow-sm border border-slate-200/80 backdrop-blur-md">
          <FilterBtn
            active={active === "all"}
            onClick={() => setActive("all")}
            count={items.length}
          >
            {allLabel}
          </FilterBtn>

          {usedCategories.map((c) => {
            const count = items.filter((i) => i.category === c.slug).length;
            return (
              <FilterBtn
                key={c.slug}
                active={active === c.slug}
                onClick={() => setActive(c.slug)}
                count={count}
              >
                {locale === "fa" ? c.fa : c.en}
              </FilterBtn>
            );
          })}
        </div>

        {/* شمارنده پروژه‌ها با پالس رنگی */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e6304c] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e6304c]" />
          </span>
          <span>
            {filtered.length} {isFa ? "پروژه فعال" : "Projects"}
          </span>
        </div>
      </div>

      {/* ── گرید دقیق کارت‌های تبلتی (همان استایل محبوب خودتان) ── */}
      {filtered.length === 0 ? (
        <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50">
          <p className="text-sm font-medium text-slate-400">{emptyLabel}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5 xl:grid-cols-5 xl:gap-x-4">
          {filtered.map((item, i) => (
            <div
              key={item.slug}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* بازخوانی دقیق کارت تبلتی اصلی شما */}
              <PortfolioCard item={item} locale={locale} index={i} categories={categories} viewLabel={viewLabel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200",
        active
          ? "bg-[#e6304c] text-white shadow-md shadow-[#e6304c]/20"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}