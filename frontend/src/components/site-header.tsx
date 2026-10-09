"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, Menu, X } from "lucide-react";
import { Container } from "./container";
import { Logo } from "./logo";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { localeHref, swapLocalePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/cn";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // تشخیص اسکرول برای تغییر استایل هدر
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // بستن منوی موبایل هنگام تغییر سایز صفحه
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nav = [
    { href: localeHref(locale, "/"), label: dict.nav.home },
    { href: localeHref(locale, "/about"), label: dict.nav.about },
    { href: localeHref(locale, "/services"), label: dict.nav.services },
    { href: localeHref(locale, "/portfolio"), label: dict.nav.portfolio },
    { href: localeHref(locale, "/contact"), label: dict.nav.contact },
    { href: localeHref(locale, "/store-builder"), label: dict.nav.store },
    { href: localeHref(locale, "/gold-app"), label: dict.nav.goldApp },
  ];

  const otherLocale: Locale = locale === "fa" ? "en" : "fa";
  const otherHref = swapLocalePath(pathname, otherLocale);
  const isRtl = locale === "fa" || locale === "en";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-[#0f0f52]/5 shadow-sm shadow-[#0f0f52]/5 py-2"
          : "bg-white/50 backdrop-blur-md border-b border-transparent py-4"
      )}
    >
      <Container className="flex items-center justify-between gap-4">
        {/* لوگو */}
        <div className="relative z-10">
          <Logo locale={locale} />
        </div>

        {/* منوی دسکتاپ */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-[13px] font-bold transition-colors duration-300"
              >
                {/* بک‌گراند انیمیشنی برای آیتم فعال (Sliding Pill) */}
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-[#0f0f52]/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* متن لینک */}
                <span
                  className={cn(
                    "relative z-10",
                    active
                      ? "text-[#0f0f52]"
                      : "text-[#0f0f52]/60 hover:text-[#e6304c]"
                  )}
                >
                  {item.label}
                </span>

                {/* نقطه قرمز کوچک زیر آیتم فعال */}
                {active && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#e6304c]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* بخش سمت چپ (دکمه‌ها) */}
        <div className="hidden lg:flex items-center gap-4 relative z-10">
          {/* دکمه تغییر زبان */}
          <Link
            href={otherHref}
            className="group flex items-center gap-1.5 rounded-full border border-[#0f0f52]/10 bg-white/50 px-3.5 py-1.5 text-xs font-bold text-[#0f0f52]/70 transition-all duration-300 hover:border-[#e6304c]/30 hover:bg-[#e6304c]/5 hover:text-[#e6304c]"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="mt-0.5 uppercase tracking-wider">{dict.common.switchLang}</span>
          </Link>

          {/* دکمه اصلی (CTA) */}
          <Link
            href={localeHref(locale, "/contact")}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#0f0f52] px-6 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e6304c]/20"
          >
            {/* افکت هاور رنگی دکمه */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#e6304c] to-[#e6304c]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <span className="relative z-10">{dict.nav.cta}</span>
            <ArrowRight className={cn("relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1", isRtl && "rotate-180 group-hover:-translate-x-1")} />
          </Link>
        </div>

        {/* دکمه همبرگری موبایل */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#0f0f52]/5 text-[#0f0f52] transition-colors hover:bg-[#e6304c]/10 hover:text-[#e6304c] lg:hidden"
          aria-label="Menu"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </Container>

      {/* منوی موبایل (با انیمیشن کشویی) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full w-full overflow-hidden bg-white/95 backdrop-blur-xl border-b border-[#0f0f52]/10 shadow-xl shadow-[#0f0f52]/5 lg:hidden"
          >
            <Container className="flex flex-col gap-2 py-6">
              {nav.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                        active
                          ? "bg-[#0f0f52]/5 text-[#0f0f52]"
                          : "text-[#0f0f52]/60 hover:bg-slate-50 hover:text-[#e6304c]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#e6304c]" />}
                        {item.label}
                      </div>
                      <ArrowRight className={cn("h-4 w-4 opacity-40", isRtl && "rotate-180")} />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex flex-col gap-3 px-1"
              >
                <Link
                  href={otherHref}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0f0f52]/10 bg-slate-50 py-3.5 text-sm font-bold text-[#0f0f52]/70"
                >
                  <Globe className="h-4 w-4" />
                  {dict.common.switchLang}
                </Link>

                <Link
                  href={localeHref(locale, "/contact")}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f0f52] py-3.5 text-sm font-bold text-white shadow-md shadow-[#0f0f52]/20"
                >
                  {dict.nav.cta}
                </Link>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}