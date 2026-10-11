// components/sections/about/engineering-philosophy.tsx
"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { AboutSectionDto, PhilosophyPrincipleDto } from "@/lib/cms";
import { resolveText } from "./about-copy";
import { 
  Code2, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  GitMerge, 
  Workflow,
  type LucideIcon,
} from "lucide-react";

interface PhilosophyItem {
  icon: React.ElementType;
  tag: string;
  title: string;
  desc: string;
  codeSnippet?: string;
}

const philosophyData: Record<Locale, { title: string; subtitle: string; items: PhilosophyItem[] }> = {
  fa: {
    title: "فلسفه مهندسی ما",
    subtitle: "نرم‌افزار پایدار اتفاقی نیست؛ نتیجه پایبندی به اصول معماری، استاندارد کدنویسی و تست خودکار است.",
    items: [
      {
        icon: Layers,
        tag: "معماری مقیاس‌پذیر",
        title: "Clean Architecture & DDD",
        desc: "توسعه مبتنی بر جداسازی لایه‌ها و دامنه‌محوری؛ سامانه‌ای که با رشد بیزینس دچار بدهی فنی (Technical Debt) نمی‌شود.",
        codeSnippet: "UI -> Application -> Domain <- Infrastructure",
      },
      {
        icon: ShieldCheck,
        tag: "پایداری محصول",
        title: "توسعه آزمون‌محور و امنیت ذاتی",
        desc: "تست‌های اتوماتیک Integration و Unit همراه با اسکن امنیتی خطوط کد قبل از استقرار در پروداکشن.",
      },
      {
        icon: GitMerge,
        tag: "اتوماسیون DevOps",
        title: "استقرار پیوسته بدون قطعی (Zero Downtime)",
        desc: "پایپ‌لاین‌های CI/CD مدرن با رویکرد Infrastructure as Code جهت انتشار پایدار، سریع و بدون ریسک.",
      },
      {
        icon: Workflow,
        tag: "متدولوژی تحویل",
        title: "توسعه چابک و تکرارشونده (Iterative)",
        desc: "ارائه فیچرها در قالب اسپرینت‌های شفاف، فیدبک‌گیری پیوسته و تحویل مداوم ارزش به کاربر نهایی.",
      },
    ],
  },
  en: {
    title: "Our Engineering Culture",
    subtitle: "Robust systems aren't accidental; they stem from architectural rigor, code standards, and automation.",
    items: [
      {
        icon: Layers,
        tag: "Scalable Architecture",
        title: "Clean Architecture & DDD",
        desc: "Layered separation and domain-centric design, ensuring the product scales without crippling technical debt.",
        codeSnippet: "UI -> Application -> Domain <- Infrastructure",
      },
      {
        icon: ShieldCheck,
        tag: "System Reliability",
        title: "Security-First & Automated Testing",
        desc: "End-to-end integration test suites and static analysis scans executed prior to any production deployment.",
      },
      {
        icon: GitMerge,
        tag: "DevOps Automation",
        title: "Zero-Downtime Deployment",
        desc: "Battle-tested CI/CD pipelines with GitOps workflows for predictable, automated releases.",
      },
      {
        icon: Workflow,
        tag: "Agile Delivery",
        title: "Iterative Engineering Sprints",
        desc: "Transparent sprint cycles with continuous stakeholder feedback to maximize shipped value.",
      },
    ],
  },
};

const philosophyIcons: Record<string, LucideIcon> = {
  Layers,
  ShieldCheck,
  GitMerge,
  Workflow,
  Code2,
  Cpu,
};

export function EngineeringPhilosophy({
  locale,
  items,
  copy,
}: {
  locale: Locale;
  items?: PhilosophyPrincipleDto[];
  copy?: AboutSectionDto;
}) {
  const fallback = philosophyData[locale];
  const data: { title: string; subtitle: string; items: PhilosophyItem[] } = {
    title: resolveText(copy?.title, locale, fallback.title),
    subtitle: resolveText(copy?.subtitle, locale, fallback.subtitle),
    items:
      items && items.length > 0
        ? items.map((item) => ({
            icon: (item.icon && philosophyIcons[item.icon]) || Layers,
            tag: resolveText(item.tag, locale, ""),
            title: resolveText(item.title, locale, ""),
            desc: resolveText(item.desc, locale, ""),
            codeSnippet: item.codeSnippet ?? undefined,
          }))
        : fallback.items,
  };

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/5 px-3.5 py-1 text-xs font-mono font-medium text-primary-500"
          >
            <Code2 className="h-3.5 w-3.5" />
            ENGINEERING_STANDARDS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {data.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            {data.subtitle}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-8 backdrop-blur transition-all duration-300 hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background shadow-inner">
                      <Icon className="h-6 w-6 text-primary-500" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>

                {item.codeSnippet && (
                  <div className="mt-6 rounded-lg border border-border/80 bg-background/90 p-3 font-mono text-xs text-primary-400">
                    {item.codeSnippet}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}