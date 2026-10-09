// components/sections/about/certifications-showcase.tsx
"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n/dictionaries";

const certsData = {
  fa: {
    title: "تاییدیه‌ها و جوایز",
    heading: "اعتبار ما، حاصل کارنامه اجرایی ماست",
    items: [
      {
        icon: "🏛️",
        title: "تاییدیه دانش‌بنیان",
        org: "معاونت علمی، فناوری و اقتصاد دانش‌بنیان ریاست‌جمهوری",
        color: "from-blue-500/10 to-cyan-500/10",
        borderColor: "hover:border-blue-400",
      },
      {
        icon: "💻",
        title: "صلاحیت مشاوره و آموزش",
        org: "نظام صنفی رایانه‌ای کشور",
        color: "from-purple-500/10 to-violet-500/10",
        borderColor: "hover:border-purple-400",
      },
      {
        icon: "🌐",
        title: "صلاحیت نرم‌افزار و پرتال",
        org: "شورای عالی انفورماتیک",
        color: "from-emerald-500/10 to-green-500/10",
        borderColor: "hover:border-emerald-400",
      },
      {
        icon: "🏆",
        title: "تندیس کارآفرین برتر",
        org: "اداره کل تعاون، کار و رفاه اجتماعی (۱۳۹۴)",
        color: "from-amber-500/10 to-orange-500/10",
        borderColor: "hover:border-amber-400",
      },
      {
        icon: "📜",
        title: "لوح تقدیر همدلی و همیاری",
        org: "استانداری کرمانشاه",
        color: "from-rose-500/10 to-pink-500/10",
        borderColor: "hover:border-rose-400",
      },
    ],
  },
  en: {
    title: "Certifications & Awards",
    heading: "Our credibility comes from our track record",
    items: [
      {
        icon: "🏛️",
        title: "Knowledge-Based Certification",
        org: "Iran's Vice Presidency for Science, Technology & Knowledge-Based Economy",
        color: "from-blue-500/10 to-cyan-500/10",
        borderColor: "hover:border-blue-400",
      },
      {
        icon: "💻",
        title: "Consulting & Training Qualification",
        org: "National Computer Trade Union",
        color: "from-purple-500/10 to-violet-500/10",
        borderColor: "hover:border-purple-400",
      },
      {
        icon: "🌐",
        title: "Software & Portal Qualification",
        org: "Supreme Council of Informatics",
        color: "from-emerald-500/10 to-green-500/10",
        borderColor: "hover:border-emerald-400",
      },
      {
        icon: "🏆",
        title: "Top Entrepreneur Award",
        org: "Kermanshah's Cooperatives, Labor & Social Welfare (2015)",
        color: "from-amber-500/10 to-orange-500/10",
        borderColor: "hover:border-amber-400",
      },
      {
        icon: "📜",
        title: "Appreciation Plaque",
        org: "Kermanshah Governorate",
        color: "from-rose-500/10 to-pink-500/10",
        borderColor: "hover:border-rose-400",
      },
    ],
  },
};

export function CertificationsShowcase({ locale }: { locale: Locale }) {
  const t = certsData[locale];

  return (
    <section className="bg-surface py-20 sm:py-28">
      <Container>
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {t.title}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-black text-primary-950 dark:text-white sm:text-4xl lg:text-5xl">
            {t.heading}
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((cert, i) => (
            <motion.div
              key={cert.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 ${cert.borderColor} hover:shadow-xl hover:shadow-black/5`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              {/* Background gradient */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative">
                <span className="text-3xl">{cert.icon}</span>
                <h3 className="mt-4 text-base font-bold text-primary-950 dark:text-white">
                  {cert.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-foreground/50">
                  {cert.org}
                </p>

                {/* Checkmark */}
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                    <svg
                      className="h-3 w-3 text-green-600 dark:text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        d="m5 13 4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    {locale === "fa" ? "تایید شده" : "Verified"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}