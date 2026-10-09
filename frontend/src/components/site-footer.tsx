"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "./container";
import { siteConfig } from "@/lib/site-config";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/paths";
import { LiquidWaveTop } from "./LiquidWaveTop";

/* ──────────────────────────────────────────────────────────
   موج نرم و دایره‌ای بالای فوتر
   ────────────────────────────────────────────────────────── */


// آیکون‌های SVG اختصاصی برای شبکه‌های اجتماعی
const SocialIcons = {
  Telegram: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a5.8 5.8 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.667 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  LinkedIn: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Instagram: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
};

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: localeHref(locale, "/about"), label: dict.nav.about },
    { href: localeHref(locale, "/services"), label: dict.nav.services },
    { href: localeHref(locale, "/portfolio"), label: dict.nav.portfolio },
    { href: localeHref(locale, "/contact"), label: dict.nav.contact },
  ];

  const services = dict.services.items.slice(0, 5);
  const isRtl = locale === "fa";

  return (
    <footer className="relative bg-[#0f0f52] text-white/85 mb-[64px] lg:mb-0">
      <LiquidWaveTop />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-[#e6304c]/8 blur-[100px]" />
        <div className="absolute right-1/4 bottom-10 h-48 w-48 rounded-full bg-[#e6304c]/5 blur-[80px]" />
      </div>

      {/* تغییر گرید به 12 ستونه برای توزیع بهتر فضا */}
      <Container className="relative z-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
        
        {/* ستون اول: برند و درباره (بزرگترین ستون) */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2">
            <Image src="/images/brand/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
            <Image
              src="/images/brand/logo-wordmark.png"
              alt="ایده‌نگار"
              width={110}
              height={48}
              className="h-7 w-auto brightness-0 invert opacity-95"
            />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-sm text-justify">
            {dict.footer.description}
          </p>
          
          {/* شبکه‌های اجتماعی با آیکون واقعی */}
          <div className="mt-6 flex items-center gap-3">
            {[
              { href: siteConfig.social.telegram, label: "Telegram", icon: SocialIcons.Telegram },
              { href: siteConfig.social.linkedin, label: "LinkedIn", icon: SocialIcons.LinkedIn },
              { href: siteConfig.social.instagram, label: "Instagram", icon: SocialIcons.Instagram },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:bg-[#e6304c] hover:border-[#e6304c] hover:text-white hover:shadow-lg hover:shadow-[#e6304c]/20"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ستون دوم: لینک‌های سریع */}
        <div className="lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e6304c]" />
            {dict.footer.quickLinks}
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex items-center text-sm text-white/60 transition-colors hover:text-white">
                  <span className={`transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`}>
                    {l.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ستون سوم: خدمات */}
        <div className="lg:col-span-3">
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e6304c]" />
            {dict.footer.servicesTitle}
          </h3>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.title} className="text-sm text-white/60 transition-colors hover:text-white cursor-default">
                {s.title}
              </li>
            ))}
          </ul>
        </div>

        {/* ستون چهارم: اطلاعات تماس (برجسته و آیکون‌دار) */}
        <div className="lg:col-span-3">
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e6304c]" />
            {dict.footer.contactTitle}
          </h3>
          <ul className="space-y-4">
            {/* آدرس */}
            <li className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e6304c]/10 text-[#e6304c]">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm leading-relaxed text-white/80">
                {locale === "fa" ? siteConfig.addressFa : siteConfig.addressEn}
              </p>
            </li>
            
            {/* تلفن */}
            <li className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e6304c]/10 text-[#e6304c]">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div dir="ltr" className={`flex-1 text-sm font-semibold text-white/90 ${isRtl ? 'text-end' : 'text-start'}`}>
                <a href={`tel:${siteConfig.phones[0]}`} className="hover:text-[#e6304c] transition-colors">
                  {siteConfig.phones.join(" / ")}
                </a>
              </div>
            </li>

            {/* ایمیل */}
            <li className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e6304c]/10 text-[#e6304c]">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div dir="ltr" className={`flex-1 text-sm font-semibold text-white/90 ${isRtl ? 'text-end' : 'text-start'}`}>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#e6304c] transition-colors">
                  {siteConfig.email}
                </a>
              </div>
            </li>

            {/* ساعت کاری */}
            <li className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e6304c]/10 text-[#e6304c]">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm text-white/70">
                {locale === "fa" ? siteConfig.hoursFa : siteConfig.hoursEn}
              </p>
            </li>
          </ul>
        </div>
      </Container>

      {/* بخش کپی‌رایت پایین */}
      <div className="relative z-10 border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <Container className="py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50 font-medium">
          <p>
            © {year} {locale === "fa" ? siteConfig.nameFa : siteConfig.nameEn}. {dict.footer.rights}
          </p>
          <p className="flex items-center gap-1.5">
            {dict.footer.madeWith}
            <span className="text-[#e6304c]">❤</span>
          </p>
        </Container>
      </div>

      <style jsx global>{`
        @keyframes liquid-wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-slower { animation: liquid-wave 36s linear infinite; }
        .animate-wave-slow   { animation: liquid-wave 28s linear infinite; }
        .animate-wave-medium { animation: liquid-wave 22s linear infinite; }
        .animate-wave-fast   { animation: liquid-wave 16s linear infinite; }
        .animate-wave-faster { animation: liquid-wave 12s linear infinite; }
      `}</style>
    </footer>
  );
}