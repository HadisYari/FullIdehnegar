"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { PageSectionDto } from "@/lib/cms";
import { resolveSection, type LocalSection } from "@/lib/page-sections";
import { LiquidWaveTop } from "../LiquidWaveTop";

/* کپی ثابت عنوان بخش (fallback). سید داده بک‌اند از همین literal ساخته می‌شود. */
const fallbackSections: Record<string, Record<Locale, LocalSection>> = {
  clients: {
    fa: {
      eyebrow: "مشتریان و کارفرمایان",
      title: "مورد اعتماد سازمان‌ها و صنایع پیشرو",
    },
    en: {
      eyebrow: "Clients & Partners",
      title: "Trusted by leading organizations and industries",
    },
  },
};

/* ──────────────────────────────────────────────────────────
   موج نرم و دایره‌ای بالای بخش (مخصوص پس‌زمینه سرمه‌ای)
   ────────────────────────────────────────────────────────── */
 
// کارت مونوگرام مشتری (تم تاریک) — متن مونوگرام از API می‌آید
function MonogramTile({ text }: { text: string }) {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 font-mono text-[9px] font-black text-white/70 shadow-inner transition-colors duration-300 group-hover:bg-[#e6304c]/20 group-hover:text-[#e6304c]">
      {text}
      <span className="absolute bottom-0.5 right-0.5 h-1 w-1 rounded-full bg-[#e6304c]" />
    </div>
  );
}

export type ClientItem = { name: string; monogram?: string | null };

/** دادهٔ همراه مخزن — fallback وقتی بک‌اند در دسترس نیست. */
const clientsFa: ClientItem[] = [
  { name: "استانداری کرمانشاه", monogram: "GOV" },
  { name: "شهرداری کرمانشاه", monogram: "MUN" },
  { name: "دانشگاه علوم پزشکی", monogram: "MED" },
  { name: "پارک علم و فناوری", monogram: "STP" },
  { name: "سازمان فوریت‌های پزشکی", monogram: "NEM" },
  { name: "میراث فرهنگی و گردشگری", monogram: "CHTO" },
  { name: "سازمان نقشه‌برداری ایران", monogram: "NCC" },
  { name: "جهاد کشاورزی کرمانشاه", monogram: "AJO" },
];

const clientsEn: ClientItem[] = [
  { name: "Kermanshah Governorate", monogram: "GOV" },
  { name: "Kermanshah Municipality", monogram: "MUN" },
  { name: "Univ. of Medical Sciences", monogram: "MED" },
  { name: "Science & Tech Park", monogram: "STP" },
  { name: "National Emergency Org", monogram: "NEM" },
  { name: "Cultural Heritage Org", monogram: "CHTO" },
  { name: "National Cartographic Center", monogram: "NCC" },
  { name: "Agricultural Organization", monogram: "AJO" },
];

// تامین طول کافی جهت جلوگیری از فضای خالی
function fillArray<T>(arr: T[], minLength = 16): T[] {
  let output = [...arr];
  while (output.length < minLength) {
    output = [...output, ...arr];
  }
  return output;
}

export function ClientsSection({
  locale,
  clients,
  sections,
}: {
  locale: Locale;
  /** مشتریان از /api/public/clients — fallback: دادهٔ همراه مخزن */
  clients?: ClientItem[];
  /** بلوک عنوان از /api/public/page-sections/home — fallback: fallbackSections */
  sections?: PageSectionDto[];
}) {
  const list = clients && clients.length > 0 ? clients : locale === "fa" ? clientsFa : clientsEn;
  const copy = resolveSection(sections, "clients", locale, fallbackSections.clients[locale]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // تولید پکیج پایه کارت‌ها
  const baseList = fillArray(list, 16);
  const isRtl = locale === "fa";

  return (
    <section ref={sectionRef} className="relative bg-[#0f0f52] pt-10 pb-5 lg:pt-18 lg:pb-10">
      
      {/* 🌊 لایه موج مایع متحرک بالا */}
      <LiquidWaveTop />

      {/* تزئینات پس‌زمینه (هاله‌های نوری مخصوص تم تاریک) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-[#e6304c]/10 blur-[100px]" />
        <div className="absolute right-1/3 bottom-10 h-80 w-80 rounded-full bg-[#e6304c]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="relative z-10 mx-auto w-full">
        
        {/* هدر بخش - تراز شده و بهینه‌شده برای تم تاریک */}
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 mb-2 flex flex-col items-start text-start rtl:text-right">
          <div className="flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-[#e6304c]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
              {copy.eyebrow}
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mt-2 text-lg font-black text-white sm:text-xl lg:text-2xl"
          >
            {copy.title}
          </motion.h2>
        </div>

        {/* کاروسل سراسری */}
        <div className="relative w-full overflow-hidden py-2">
          {/* گرادیان فید دو طرف برای ادغام با بک‌گراند سرمه‌ای */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-28 bg-gradient-to-r from-[#0f0f52] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-28 bg-gradient-to-l from-[#0f0f52] to-transparent" />

          {/* کانتینر ایزوله‌شده به چپ به راست (LTR) */}
          <div className="flex w-full overflow-hidden select-none" dir="ltr">
            
            {/* نگهدارنده انیمیشن */}
            <div className="flex w-max animate-ticker py-2 hover:[animation-play-state:paused]">
              
              {/* تِرک اول (اصلی) */}
              <div className="flex gap-3 sm:gap-4 shrink-0 mr-3 sm:mr-4">
                {baseList.map((item, idx) => (
                  <div
                    key={`client-t1-${idx}`}
                    dir={isRtl ? "rtl" : "ltr"}
                    className="group relative flex w-[170px] sm:w-[220px] shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-[#e6304c]/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-[#e6304c]/10"
                  >
                    <div className="absolute inset-y-0 left-0 w-[2.5px] bg-[#e6304c]/30 transition-all duration-300 group-hover:bg-[#e6304c] rtl:left-auto rtl:right-0 rounded-l-md rtl:rounded-l-none rtl:rounded-r-md" />
                    <MonogramTile text={item.monogram ?? ""} />
                    <div className="min-w-0 flex-1 min-h-[32px] flex flex-col justify-center">
                      <h3 className="text-[10px] sm:text-[11.5px] font-bold text-white/90 transition-colors duration-300 group-hover:text-white truncate">
                        {item.name}
                      </h3>
                      <span className="mt-0.5 block text-[7.5px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                        {isRtl ? "همکاری رسمی" : "Partner"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* تِرک دوم (همزاد شبیه‌ساز لوپ) */}
              <div className="flex gap-3 sm:gap-4 shrink-0 mr-3 sm:mr-4" aria-hidden="true">
                {baseList.map((item, idx) => (
                  <div
                    key={`client-t2-${idx}`}
                    dir={isRtl ? "rtl" : "ltr"}
                    className="group relative flex w-[170px] sm:w-[220px] shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-[#e6304c]/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-[#e6304c]/10"
                  >
                    <div className="absolute inset-y-0 left-0 w-[2.5px] bg-[#e6304c]/30 transition-all duration-300 group-hover:bg-[#e6304c] rtl:left-auto rtl:right-0 rounded-l-md rtl:rounded-l-none rtl:rounded-r-md" />
                    <MonogramTile text={item.monogram ?? ""} />
                    <div className="min-w-0 flex-1 min-h-[32px] flex flex-col justify-center">
                      <h3 className="text-[10px] sm:text-[11.5px] font-bold text-white/90 transition-colors duration-300 group-hover:text-white truncate">
                        {item.name}
                      </h3>
                      <span className="mt-0.5 block text-[7.5px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                        {isRtl ? "همکاری رسمی" : "Partner"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* استایل‌های تمام انیمیشن‌ها (هم موج و هم اسکرول) */}
      <style jsx global>{`
        /* انیمیشن‌های موج */
        @keyframes liquid-wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-slower { animation: liquid-wave 36s linear infinite; }
        .animate-wave-slow   { animation: liquid-wave 28s linear infinite; }
        .animate-wave-medium { animation: liquid-wave 22s linear infinite; }
        .animate-wave-fast   { animation: liquid-wave 16s linear infinite; }
        .animate-wave-faster { animation: liquid-wave 12s linear infinite; }

        /* انیمیشن اسکرول مشتریان */
        @keyframes seamless-horizontal-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          animation: seamless-horizontal-scroll 42s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}