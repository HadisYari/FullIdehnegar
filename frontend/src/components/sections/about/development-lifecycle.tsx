// components/sections/about/development-lifecycle.tsx
"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n/dictionaries";

const steps = {
  fa: [
    { num: "01", name: "کشف و تحلیل سیستم", desc: "استخراج Use Caseها، مدلسازی داده‌ها و انتخاب معماری پایدار متناسب با مقیاس." },
    { num: "02", name: "طراحی تعاملی و UI/UX", desc: "طراحی Design System اختصاصی، پروتوتایپ تست‌پذیر و کاربرپژوهی دقیق." },
    { num: "03", name: "پیاده‌سازی ماژولار", desc: "کدنویسی تمیز با بازبینی دونفره (Peer Code Review) و پایبندی به اصول SOLID." },
    { num: "04", name: "تست جامع و بنچ‌مارک", desc: "تست‌های لود (Load Testing)، اعتبارسنجی امنیتی و بررسی نرخ پاسخگویی سیستم." },
    { num: "05", name: "استقرار و مانیتورینگ", desc: "راه‌اندازی پایپ‌لاین CI/CD، لاگ‌گیری متمرکز و مانیتورینگ سلامت با APM." }
  ],
  en: [
    { num: "01", name: "System Discovery", desc: "Domain modeling, gathering core use-cases, and selecting targeted architecture." },
    { num: "02", name: "UI/UX & Prototyping", desc: "Design system crafting, user research, and fully clickable wireframing." },
    { num: "03", name: "Modular Coding", desc: "Clean development enforced by peer code reviews and strict SOLID practices." },
    { num: "04", name: "Testing & Profiling", desc: "Automated test suites, peak load evaluations, and security scans." },
    { num: "05", name: "Deployment & APM", desc: "Containerized deployment, centralized telemetry, and real-time health alerts." }
  ]
};

export function DevelopmentLifecycle({ locale }: { locale: Locale }) {
  const currentSteps = steps[locale];

  return (
    <section className="border-y border-border/40 bg-muted/20 py-24">
      <Container>
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs font-semibold text-primary-500">PIPELINE</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {locale === "fa" ? "فرایند توسعه و تحویل محصول" : "How We Engineer & Deliver"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {currentSteps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5"
            >
              <div>
                <span className="font-mono text-2xl font-black text-primary-500/40">
                  {step.num}
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">{step.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}