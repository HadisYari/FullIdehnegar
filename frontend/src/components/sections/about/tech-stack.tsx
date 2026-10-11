// components/sections/about/tech-stack.tsx
"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { AboutSectionDto, TechStackGroupDto } from "@/lib/cms";
import { resolveText } from "./about-copy";

const categories = {
  fa: {
    title: "فناوری‌های ما",
    heading: "ابزارهایی که آینده را می‌سازند",
    subtitle: "ما از مدرن‌ترین و قابل‌اعتمادترین فناوری‌های روز دنیا استفاده می‌کنیم.",
    groups: [
      {
        label: "فرانت‌اند",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        label: "بک‌اند",
        items: [".NET / C#", "Node.js", "Python", "REST API", "GraphQL"],
      },
      {
        label: "دیتابیس",
        items: ["PostgreSQL", "SQL Server", "MongoDB", "Redis"],
      },
      {
        label: "زیرساخت",
        items: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
      },
    ],
  },
  en: {
    title: "Our Tech Stack",
    heading: "Tools that build the future",
    subtitle: "We use the most modern and reliable technologies available today.",
    groups: [
      {
        label: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        label: "Backend",
        items: [".NET / C#", "Node.js", "Python", "REST API", "GraphQL"],
      },
      {
        label: "Database",
        items: ["PostgreSQL", "SQL Server", "MongoDB", "Redis"],
      },
      {
        label: "Infrastructure",
        items: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
      },
    ],
  },
};

export function TechStack({
  locale,
  items,
  copy,
}: {
  locale: Locale;
  items?: TechStackGroupDto[];
  copy?: AboutSectionDto;
}) {
  const fallback = categories[locale];
  const t: { title: string; heading: string; subtitle: string; groups: { label: string; items: string[] }[] } = {
    title: resolveText(copy?.eyebrow, locale, fallback.title),
    heading: resolveText(copy?.title, locale, fallback.heading),
    subtitle: resolveText(copy?.subtitle, locale, fallback.subtitle),
    groups:
      items && items.length > 0
        ? items.map((group) => ({ label: resolveText(group.label, locale, ""), items: group.items }))
        : fallback.groups,
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -start-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-accent-500/5 blur-[100px]" />
        <div className="absolute -end-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary-500/5 blur-[100px]" />
      </div>

      <Container className="relative">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {t.title}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-black text-primary-950 dark:text-white sm:text-4xl lg:text-5xl">
            {t.heading}
          </h2>
          <p className="mt-4 text-base leading-8 text-foreground/60">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.groups.map((group, gi) => (
            <motion.div
              key={group.label}
              className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
                {group.label}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item, ii) => (
                  <motion.span
                    key={item}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-colors hover:border-accent-300 hover:text-accent-700 dark:hover:text-accent-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.1 + ii * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}