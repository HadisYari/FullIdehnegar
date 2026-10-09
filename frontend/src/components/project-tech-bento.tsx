// components/project-tech-bento.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface TechItem {
  name: string;
  role: string; // e.g. "Core Engine", "State / UI", "Vector DB"
  tag: string;
}

interface ProjectBentoProps {
  locale: "fa" | "en";
  overview?: string;
  challenge?: string;
  solution?: string;
  techStack?: TechItem[];
  palette?: string[];
  metrics?: { label: string; val: string; sub?: string }[];
}

export function ProjectTechBento({
  locale,
  overview,
  challenge,
  solution,
  techStack = [],
  palette = ["#0F172A", "#2563EB", "#38BDF8", "#F8FAFC"],
  metrics = [],
}: ProjectBentoProps) {
  const isFa = locale === "fa";
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. خلاصه و دیدگاه کلی - Bento اسپَن ۲ */}
      <div className="md:col-span-2 lg:col-span-2 rounded-3xl border border-border/40 bg-surface/40 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-primary-400 uppercase">
            {isFa ? "خلاصه معماری" : "Architecture Overview"}
          </span>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/80">
            {overview || (isFa ? "سامانه اختصاصی متمرکز بر مقیاس‌پذیری و پایداری داده." : "Scalable system focused on robust data transactions.")}
          </p>
        </div>

        {/* پالت رنگ تعاملی در انتهای کارت */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <span className="text-xs text-muted-foreground block mb-3">
            {isFa ? "پالت بصری سیستم (کلیک برای کپی):" : "Color System (Click to copy):"}
          </span>
          <div className="flex items-center gap-3">
            {palette.map((color) => (
              <button
                key={color}
                onClick={() => copyColor(color)}
                className="group relative flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 shadow-inner transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: color }}
                title={color}
              >
                {copiedHex === color && (
                  <span className="absolute -top-7 text-[10px] bg-black text-white px-2 py-0.5 rounded shadow">
                    کپی شد!
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. چالش و راهکار مهندسی (Problem vs Solution) */}
      {(challenge || solution) && (
        <div className="md:col-span-1 lg:col-span-2 rounded-3xl border border-border/40 bg-surface/40 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-around gap-4">
          {challenge && (
            <div className="rounded-2xl bg-destructive/5 border border-destructive/10 p-4">
              <span className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {isFa ? "چالش بیزینس / فنی" : "Core Challenge"}
              </span>
              <p className="mt-2 text-xs sm:text-sm text-foreground/75 leading-6">{challenge}</p>
            </div>
          )}
          {solution && (
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4">
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {isFa ? "راه‌حل نرم‌افزاری" : "Engineering Solution"}
              </span>
              <p className="mt-2 text-xs sm:text-sm text-foreground/75 leading-6">{solution}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. استک فنی (Tech Stack) با تفکیک وظیفه */}
      <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-border/40 bg-surface/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-300">
            {isFa ? "فناوری‌ها و زیرساخت" : "Technologies & Stack"}
          </h3>
          <span className="text-[11px] text-muted-foreground font-mono">Modern Architecture</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group flex flex-col justify-between p-3.5 rounded-2xl border border-border/30 bg-background/50 hover:border-primary-500/30 hover:bg-background/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground group-hover:text-primary-400 transition-colors">
                  {tech.name}
                </span>
                <span className="text-[10px] font-mono uppercase bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-md">
                  {tech.tag}
                </span>
              </div>
              <span className="mt-2 text-[11px] text-muted-foreground">{tech.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. معیارهای سنجش و کارایی (Metrics Card) */}
      <div className="md:col-span-1 lg:col-span-1 rounded-3xl border border-border/40 bg-gradient-to-br from-primary-950/20 to-surface/60 p-6 backdrop-blur-md flex flex-col justify-center gap-5">
        {metrics.map((m, idx) => (
          <div key={idx} className="border-b border-border/30 pb-3 last:border-0 last:pb-0">
            <span className="text-[11px] text-muted-foreground block">{m.label}</span>
            <div className="text-2xl font-mono font-black text-foreground mt-0.5 tracking-tight">{m.val}</div>
            {m.sub && <span className="text-[10px] text-primary-400 font-medium block mt-0.5">{m.sub}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}