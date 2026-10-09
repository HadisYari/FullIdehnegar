// components/sections/contact/contact-page-canvas.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { siteConfig } from "@/lib/site-config";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Compass,
  Send,
  ChevronDown,
  CheckCircle2,
  Check,
  Car,
  ShieldCheck,
  Building2,
  Share2,
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Search,
  Zap,
  Radio,
  CalendarCheck,
  ArrowUpRight,
  Lock,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   ۱. موج ورودی: سفید به سرمه‌ای (#0f0f52)
   ────────────────────────────────────────────────────────── */
function WaveWhiteToNavy({ bg = "bg-white" }: { bg?: string }) {
  const waves = [
    {
      d: "M0,35 C280,5 480,70 720,30 C940,5 1100,65 1200,35 L1200,100 L0,100 Z",
      opacity: 0.22,
      anim: "animate-wave-flow-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,45 C220,15 420,70 680,40 C880,10 1040,70 1200,45 L1200,100 L0,100 Z",
      opacity: 0.42,
      anim: "animate-wave-flow-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,58 C200,25 400,75 660,50 C860,20 1040,70 1200,58 L1200,100 L0,100 Z",
      opacity: 0.75,
      anim: "animate-wave-flow-medium",
      fill: "#141460",
    },
    {
      d: "M0,68 C160,35 360,80 620,60 C820,32 1000,75 1200,68 L1200,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-flow-fast",
      fill: "#0f0f52",
    },
  ];

  return (
    <div className={`relative w-full overflow-hidden leading-none pointer-events-none -mt-px -mb-px z-20 ${bg}`}>
      <div className="relative h-[48px] sm:h-[75px] md:h-[95px] w-full">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1200 100" preserveAspectRatio="none" className="h-[48px] sm:h-[75px] md:h-[95px] w-1/2 block">
                <path d={wave.d} fill={wave.fill} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ۲. موج خروجی: سرمه‌ای (#0f0f52) به سفید
   ────────────────────────────────────────────────────────── */
function WaveNavyToWhite({ bg = "bg-[#0f0f52]" }: { bg?: string }) {
  const waves = [
    {
      d: "M0,35 C280,5 480,70 720,30 C940,5 1100,65 1200,35 L1200,100 L0,100 Z",
      opacity: 0.22,
      anim: "animate-wave-flow-slower",
      fill: "#e6304c",
    },
    {
      d: "M0,45 C220,15 420,70 680,40 C880,10 1040,70 1200,45 L1200,100 L0,100 Z",
      opacity: 0.42,
      anim: "animate-wave-flow-slow",
      fill: "#e6304c",
    },
    {
      d: "M0,58 C200,25 400,75 660,50 C860,20 1040,70 1200,58 L1200,100 L0,100 Z",
      opacity: 0.8,
      anim: "animate-wave-flow-medium",
      fill: "#f8fafc",
    },
    {
      d: "M0,68 C160,35 360,80 620,60 C820,32 1000,75 1200,68 L1200,100 L0,100 Z",
      opacity: 1,
      anim: "animate-wave-flow-fast",
      fill: "#ffffff",
    },
  ];

  return (
    <div className={`relative w-full overflow-hidden leading-none pointer-events-none -mt-px -mb-px z-20 ${bg}`}>
      <div className="relative h-[48px] sm:h-[75px] md:h-[95px] w-full">
        {waves.map((wave, i) => (
          <div key={i} className={`absolute bottom-0 left-0 flex w-[200%] ${wave.anim}`}>
            {[0, 1].map((copy) => (
              <svg key={copy} viewBox="0 0 1200 100" preserveAspectRatio="none" className="h-[48px] sm:h-[75px] md:h-[95px] w-1/2 block">
                <path d={wave.d} fill={wave.fill} opacity={wave.opacity} />
              </svg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactPageCanvas({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isFa = locale === "fa";

  // ساعت زنده دفتر
  const [timeString, setTimeString] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString(isFa ? "fa-IR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isFa]);

  // کپی سریع اطلاعات تماس با بازخورد تصویری
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // حوزه‌های پروژه‌های نرم‌افزاری
  const projectCategories = [
    { id: "web", label: isFa ? "طراحی وب اختصاصی" : "Custom Web", icon: Code2 },
    { id: "portal", label: isFa ? "پرتال سازمانی و ERP" : "Enterprise Portal", icon: Layers },
    { id: "ecommerce", label: isFa ? "فروشگاه اینترنتی" : "E-Commerce", icon: Building2 },
    { id: "cloud", label: isFa ? "دواپس و کلاود" : "DevOps & Cloud", icon: Cpu },
    { id: "seo", label: isFa ? "سئو تکنیکال" : "SEO & Speed", icon: Search },
  ];

  const [selectedCategory, setSelectedCategory] = useState("web");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = isFa
    ? [
        {
          q: "در چه روزها و ساعاتی امکان ارتباط مستقیم و مشاوره فنی وجود دارد؟",
          a: "تیم معماری نرم‌افزار و مشاوره در روزهای شنبه تا چهارشنبه از ساعت ۹:۰۰ الی ۱۸:۰۰ و پنج‌شنبه‌ها از ساعت ۹:۰۰ الی ۱۳:۰۰ به صورت تلفنی و حضوری پاسخگوی شما هستند. همچنین سیستم ثبت فرم آنلاین ۲۴ ساعته پایش می‌شود.",
        },
        {
          q: "بررسی نیازمندی‌ها و ارائه پروپوزال اولیه چقدر زمان می‌برد؟",
          a: "پس از ثبت درخواست، حداکثر ظرف مدت ۲ الی ۴ ساعت کاری جهت بررسی اولیه با شما تماس گرفته می‌شود. پروپوزال فنی دقیق، ساختار فازبندی اسپرینت‌ها و برآورد شفاف بودجه نیز ظرف ۴۸ ساعت تقدیم شما خواهد شد.",
        },
        {
          q: "آیا فرآیند مشاوره اولیه و امکان‌سنجی سیستم شامل هزینه است؟",
          a: "خیر، جلسه اولیه اکتشاف نیازها و ارزیابی فنی به‌صورت کاملاً رایگان برگزار می‌شود تا با دیدی شفاف و خاطری آسوده درباره همکاری تصمیم‌گیری نمایید.",
        },
        {
          q: "آیا امکان تنظیم جلسه حضوری در دفتر مرکزی ایده‌نگار وجود دارد؟",
          a: "بله، با هماهنگی قبلی مشتاقانه میزبان شما در دفتر مرکزی جهت برگزاری جلسات فنی، بررسی پروتوتایپ‌ها و آشنایی حضوری با معماران پروژه خواهیم بود.",
        },
      ]
    : [
        {
          q: "What are your business operating hours?",
          a: "Our software engineering leads are available Saturday through Wednesday from 9:00 AM to 6:00 PM, and Thursdays from 9:00 AM to 1:00 PM. Inquiries submitted via this portal are monitored 24/7.",
        },
        {
          q: "How fast do you respond to incoming project proposals?",
          a: "All project scoping forms are reviewed within 2 to 4 business hours. Formal architectural roadmaps and estimates are delivered within 48 hours.",
        },
        {
          q: "Is the preliminary architecture discovery session free?",
          a: "Yes, the initial technical consultation and feasibility review are completely complimentary.",
        },
        {
          q: "Can we schedule an in-person workshop at your headquarters?",
          a: "Absolutely. We welcome in-person technical workshops and sprint planning sessions at our campus upon appointment.",
        },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ fullName: "", phone: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <div className="relative w-full overflow-hidden bg-white text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════
          ۱. HERO: درگاه ارتباط مستقیم (زمینه سرمه‌ای عمیق #0f0f52)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden bg-[#0f0f52] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 start-1/4 h-96 w-96 rounded-full bg-[#e6304c]/20 blur-[130px]" />
          <div className="absolute bottom-0 end-1/4 h-96 w-96 rounded-full bg-black/50 blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* سمت چپ (در نسخه فارسی): پورتال ماهواره‌ای با تله‌متری زنده */}
            <div className="flex-1 w-full max-w-[440px]">
              <Reveal delay={80}>
                <div className="relative mx-auto flex items-center justify-center">
                  <div className="relative h-72 w-72 sm:h-88 sm:w-88 rounded-[48px] border-2 border-white/15 bg-gradient-to-tr from-white/10 via-white/5 to-black/30 p-4 backdrop-blur-2xl shadow-2xl">
                    <div className="h-full w-full rounded-[38px] border border-white/10 bg-[#070720] overflow-hidden relative flex items-center justify-center shadow-inner">
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: `radial-gradient(circle at 50% 50%, #e6304c 1.5px, transparent 1.5px)`,
                          backgroundSize: "20px 20px",
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e6304c] bg-[#e6304c]/20 shadow-[0_0_35px_rgba(230,48,76,0.45)]">
                          <Compass className="h-9 w-9 text-[#e6304c] animate-spin-slow" />
                        </div>
                        <div className="mt-4 font-mono text-xs font-bold text-white tracking-widest uppercase">
                          Idehnegar Campus
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-slate-400">
                          Geo Coordinates Locked • Kermanshah
                        </div>
                      </div>

                      <div className="absolute bottom-3 inset-x-4 rounded-xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-between text-[11px] text-white font-mono border border-white/10">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          HQ Operational
                        </span>
                        <span className="text-white/70">Response &lt; 2h</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 -start-2 rounded-2xl border border-white/15 bg-[#0f0f52]/90 backdrop-blur-md px-4 py-2.5 shadow-2xl flex items-center gap-3 z-20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e6304c] text-white font-bold text-xs shadow-md">
                      ★
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">مشاوره مستقیم مهندسی</div>
                      <div className="text-[10px] text-slate-300 font-mono">Senior Architectural Desk</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* سمت راست: مانیفست تماس و دکمه‌های مستقیم */}
            <div className="flex-1 text-center lg:text-start">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#e6304c] animate-ping" />
                  <span className="font-mono text-xs font-semibold tracking-wider text-rose-300">
                    {isFa ? "درگاه ارتباط مستقیم" : "DIRECT ENGAGEMENT DESK"}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-400 to-amber-200">
                    {isFa ? "با ما در ارتباط باشید" : "Connect With Us"}
                  </span>
                </h1>

                <h2 className="mt-3 text-lg sm:text-2xl font-bold text-white/90">
                  {isFa ? "استودیو مهندسی نرم‌افزار پیشگامان ایده‌نگار" : "Idehnegar Software Engineering Studio"}
                </h2>

                <p className="mt-4 text-xs sm:text-sm sm:leading-relaxed text-white/75 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {isFa
                    ? "ما همیشه مشتاق گفتگو پیرامون معماری‌های نوین، توسعه پلتفرم‌های پرسرعت و ارتقای محصولات دیجیتال شما هستیم. برای هماهنگی جلسات مشاوره یا بررسی پروپوزال، از راه‌های مستقیم زیر با ما همراه باشید."
                    : "We are eager to explore scalable architectures, high-throughput web systems, and your next software milestones. Connect directly with our team."}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <div
                    onClick={() => copyToClipboard(siteConfig.phones[0], "phone")}
                    dir="ltr"
                    className="group cursor-pointer flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#e6304c] hover:bg-white/15"
                  >
                    <div className="text-start">
                      <span className="block text-[10px] font-bold text-white/60 font-sans">
                        {isFa ? "تماس تلفنی مستقیم (کلیک برای کپی)" : "Direct Line (Click to copy)"}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-black text-white group-hover:text-rose-300 transition-colors">
                        {siteConfig.phones[0]}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white group-hover:bg-[#e6304c] transition-all">
                      {copiedPhone ? <Check className="h-4 w-4 text-emerald-400" /> : <Phone className="h-4 w-4" />}
                    </div>
                  </div>

                  <div
                    onClick={() => copyToClipboard(siteConfig.email, "email")}
                    dir="ltr"
                    className="group cursor-pointer flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-white/15"
                  >
                    <div className="text-start">
                      <span className="block text-[10px] font-bold text-white/60 font-sans">
                        {isFa ? "مکاتبات رسمی و پروپوزال" : "Official Proposals"}
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {siteConfig.email}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white group-hover:bg-cyan-600 transition-all">
                      {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Mail className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </Container>
      </section>

      {/* موج خروجی از هیرو سرمه‌ای به سکشن داک اطلاعاتی */}
      <WaveNavyToWhite bg="bg-[#0f0f52]" />

      {/* ══════════════════════════════════════════════════════════
          ۲. داک اطلاعاتی سه‌گانه ارتقایافته (خلاقانه، رنگی و شیشه‌ای)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-6 pb-16 sm:pt-10 sm:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
        {/* نورهای پس‌زمینه آمبینت برای شکستن سفیدی و سادگی */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 start-10 h-72 w-72 rounded-full bg-[#e6304c]/8 blur-[100px]" />
          <div className="absolute bottom-10 end-10 h-80 w-80 rounded-full bg-[#0f0f52]/8 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0f0f52 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <Container className="relative z-10">
          
          {/* هدر کوچک داک */}
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#e6304c] bg-[#e6304c]/10 border border-[#e6304c]/20 px-3.5 py-1 rounded-full">
              STUDIO INTERACTIVE HUBS
            </span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              {isFa ? "درگاه‌های تعاملی و دسترسی پردیس ایده‌نگار" : "Interactive Studio Access Portals"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* کارت ۱: کنسول زمان کاری و ساعت زنده شیشه‌ای دارک (Studio Operations Hub) */}
            <Reveal delay={70} className="relative group">
              <div className="relative h-full rounded-[32px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-[#0f0f52] via-[#151658] to-[#070724] text-white shadow-xl shadow-[#0f0f52]/20 border border-white/10 transition-all duration-300 hover:border-[#e6304c]/60 hover:-translate-y-1.5">
                
                {/* خط نئونی بالای کارت */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e6304c] to-transparent opacity-80" />

                {/* ردیف اول: عنوان و ساعت زنده */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6304c] text-white shadow-md shadow-[#e6304c]/30">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-rose-300 uppercase">Operations Desk</span>
                      <h4 className="text-sm font-bold text-white">{isFa ? "ساعت کاری و پذیرش" : "Working Hours"}</h4>
                    </div>
                  </div>
                  
                  {/* نشانگر زمان زنده با فونت مونو درخشان */}
                  <div className="text-end">
                    <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {timeString || "09:00:00"}
                    </span>
                  </div>
                </div>

                {/* تایم‌لاین رنگی و پیشرفت روزها */}
                <div className="mt-5 space-y-3 font-mono text-xs">
                  {/* شنبه تا ۴شنبه */}
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] text-white/80 font-bold block">{isFa ? "شنبه تا چهارشنبه" : "Sat - Wed"}</span>
                      <span className="text-[10px] text-slate-400">{isFa ? "جلسات و مشاوره حضوری" : "On-site Discovery"}</span>
                    </div>
                    <span className="text-xs font-bold text-rose-300 bg-[#e6304c]/20 border border-[#e6304c]/30 px-2.5 py-1 rounded-lg">
                      ۰۹:۰۰ — ۱۸:۰۰
                    </span>
                  </div>

                  {/* پنج‌شنبه‌ها */}
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] text-white/80 font-bold block">{isFa ? "پنج‌شنبه‌ها" : "Thursdays"}</span>
                      <span className="text-[10px] text-slate-400">{isFa ? "اسپرینت‌های فشرده" : "Sprint Reviews"}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                      ۰۹:۰۰ — ۱۳:۰۰
                    </span>
                  </div>

                  {/* جمعه‌ها */}
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                      {isFa ? "پایش اضطراری زیرساخت" : "Emergency Cloud SLA"}
                    </span>
                    <span className="text-emerald-400 font-bold">۲۴/۷ فعال</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* کارت ۲: هاب دسترسی به پیام‌رسان‌ها با استایل چندرنگ نئونی (Omnichannel Deck) */}
            <Reveal delay={120} className="relative group">
              <div className="relative h-full rounded-[32px] overflow-hidden p-6 sm:p-7 bg-white shadow-xl shadow-slate-200/70 border border-slate-200/90 transition-all duration-300 hover:border-[#0f0f52] hover:-translate-y-1.5 flex flex-col justify-between">
                
                {/* خط نئونی بالای کارت */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#e6304c] via-[#0f0f52] to-cyan-500" />

                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f0f52] text-white shadow-md">
                        <Share2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-slate-400 uppercase">Fast Response</span>
                        <h4 className="text-sm font-bold text-slate-900">{isFa ? "کانال‌های آنلاین مستقیم" : "Instant Channels"}</h4>
                      </div>
                    </div>
                    <span className="rounded-full bg-cyan-50 border border-cyan-200/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-700">
                      &lt; 15 min
                    </span>
                  </div>

                  {/* گرید ۴ دکمه ارتباطی اختصاصی با رنگ‌های زنده */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {/* تلگرام */}
                    <a
                      href={siteConfig.social?.telegram || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group/item flex flex-col justify-between p-3 rounded-2xl bg-sky-50/70 border border-sky-100 hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-sky-700 group-hover/item:text-white">Telegram</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-sky-400 group-hover/item:text-white transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                      </div>
                      <span className="mt-2 text-[10px] text-sky-600 group-hover/item:text-sky-100 font-mono">@idehnegar</span>
                    </a>

                    {/* واتس‌اپ */}
                    <a
                      href={`https://wa.me/${siteConfig.phones[0].replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group/item flex flex-col justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-emerald-700 group-hover/item:text-white">WhatsApp</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 group-hover/item:text-white transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                      </div>
                      <span className="mt-2 text-[10px] text-emerald-600 group-hover/item:text-emerald-100 font-mono">Chat Online</span>
                    </a>

                    {/* لینکدین */}
                    <a
                      href={siteConfig.social?.linkedin || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group/item flex flex-col justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-blue-700 group-hover/item:text-white">LinkedIn</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-blue-400 group-hover/item:text-white transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                      </div>
                      <span className="mt-2 text-[10px] text-blue-600 group-hover/item:text-blue-100 font-mono">Enterprise</span>
                    </a>

                    {/* اینستاگرام */}
                    <a
                      href={siteConfig.social?.instagram || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group/item flex flex-col justify-between p-3 rounded-2xl bg-rose-50/70 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-bold text-rose-700 group-hover/item:text-white">Instagram</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-rose-400 group-hover/item:text-white transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                      </div>
                      <span className="mt-2 text-[10px] text-rose-600 group-hover/item:text-rose-100 font-mono">Studio Life</span>
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{isFa ? "میانگین زمان پاسخ‌گویی:" : "Average response time:"}</span>
                  <span className="font-mono font-bold text-[#e6304c]">~ ۱۰ دقیقه</span>
                </div>
              </div>
            </Reveal>

            {/* کارت ۳: پاسپورت امکانات پردیس مرکزی (VIP Campus Pass) */}
            <Reveal delay={170} className="relative group">
              <div className="relative h-full rounded-[32px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-[#10142b] to-[#0a0d1f] text-white shadow-xl shadow-slate-900/10 border border-slate-800 transition-all duration-300 hover:border-amber-400/60 hover:-translate-y-1.5 flex flex-col justify-between">
                
                {/* خط طلایی نئونی بالای کارت */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-[#e6304c] to-amber-400" />

                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold shadow-md shadow-amber-500/20">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-amber-300 uppercase">Executive Space</span>
                        <h4 className="text-sm font-bold text-white">{isFa ? "امکانات پردیس ایده‌نگار" : "HQ Amenities"}</h4>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                      VIP Access
                    </span>
                  </div>

                  {/* ۳ پاد امکانات رفاهی */}
                  <div className="mt-5 space-y-2.5 text-xs">
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-3 flex items-center gap-3 transition-colors hover:bg-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                        <Car className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">{isFa ? "پارکینگ اختصاصی هوشمند" : "Reserved Client Parking"}</span>
                        <span className="text-[10px] text-slate-400">{isFa ? "رزرو آنی در روز جلسه حضوری" : "Guaranteed spot during workshop"}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/5 p-3 flex items-center gap-3 transition-colors hover:bg-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e6304c]/20 text-rose-300">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">{isFa ? "اتاق جلسات مجهز به ارائه ۴K" : "Conference Room & Tech Hub"}</span>
                        <span className="text-[10px] text-slate-400">{isFa ? "بررسی زنده و آکوستیک کدها" : "Live code review & projection"}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/5 p-3 flex items-center gap-3 transition-colors hover:bg-white/10">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">{isFa ? "تعهد محرمانگی ایده (NDA)" : "Strict NDA Protection"}</span>
                        <span className="text-[10px] text-slate-400">{isFa ? "امضای رسمی پیش از شروع جلسه" : "Full IP & confidentiality pact"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>Campus Location</span>
                  <span className="text-amber-300">Kermanshah HQ</span>
                </div>
              </div>
            </Reveal>

          </div>
        </Container>
      </section>

      {/* موج ورودی به سکشن نقشه دارک و فرم تعاملی */}
      <WaveWhiteToNavy bg="bg-white" />

      {/* ══════════════════════════════════════════════════════════
          ۳. نقشه سایبرنتیک دارک و فرم شناور پیشنهاد همکاری
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-6 pb-16 sm:pt-10 sm:pb-24 bg-[#0f0f52] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 start-1/4 h-80 w-80 rounded-full bg-[#e6304c]/15 blur-[140px]" />
        </div>

        <Container className="relative z-10">
          <div className="relative rounded-[40px] border border-white/15 bg-[#0c1028] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
            
            {/* لایه نقشه پس‌زمینه دارک */}
            <div className="absolute inset-0 opacity-40 mix-blend-luminosity pointer-events-none">
              <iframe
                title="Office Map Coordinates"
                src={siteConfig.mapEmbedSrc}
                className="h-full w-full grayscale contrast-125 pointer-events-none"
                loading="lazy"
              />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
              
              {/* سمت چپ (روی نقشه تیره): آدرس، مختصات و دعوت به جلسه */}
              <div className="flex-1 text-white text-center lg:text-start space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#e6304c] animate-ping" />
                  <span>HQ GEOSPATIAL RADAR</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                  {isFa
                    ? "میزبان جلسات فنی و استراتژیک شما هستیم"
                    : "Hosting Your Technical Discovery Sessions"}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  {isFa
                    ? "برای جلسات امکان‌سنجی نرم‌افزار، مشاوره حضوری در حوزه معماری پلتفرم‌ها و شناخت فرآیند توسعه، با هماهنگی قبلی پذیرای شما در دفتر مرکزی ایده‌نگار هستیم."
                    : "Schedule an on-site architecture workshop with our engineering leads to review your technical roadmap and project milestones."}
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md max-w-md text-start flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-[#e6304c] mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Physical Location
                    </span>
                    <p className="text-xs sm:text-sm text-white mt-1 leading-relaxed">
                      {isFa ? siteConfig.addressFa : siteConfig.addressEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* سمت راست: فرم شناور سفید پیشنهاد همکاری با انتخابگر حوزه پروژه */}
              <div className="w-full lg:w-[480px]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
                  <div className="border-b border-slate-100 pb-4 mb-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-900">
                        {isFa ? "پیشنهاد همکاری و استعلام پروژه" : "Project Proposal"}
                      </h4>
                      <span className="rounded-full bg-[#e6304c]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#e6304c]">
                        SLA Guaranteed
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {isFa
                        ? "نوع نیاز خود را انتخاب و اطلاعات اولیه را ارسال فرمایید."
                        : "Select your project category to initiate technical scoping."}
                    </p>
                  </div>

                  {formSubmitted ? (
                    <div className="py-10 text-center space-y-3">
                      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        {isFa ? "درخواست شما با موفقیت ثبت شد" : "Proposal Submitted"}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {isFa
                          ? "کارشناسان فنی ما ظرف ۲ الی ۴ ساعت کاری با شما تماس می‌گیرند."
                          : "Our engineering leads will get in touch with you shortly."}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                      
                      {/* انتخابگر دسته‌بندی پروژه */}
                      <div>
                        <label className="block font-semibold text-slate-700 mb-2">
                          {isFa ? "حوزه پروژه مورد نظر:" : "Project Domain:"}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {projectCategories.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selectedCategory === type.id;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setSelectedCategory(type.id)}
                                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-medium transition-all ${
                                  isSelected
                                    ? "bg-[#e6304c] text-white border-[#e6304c] shadow-sm"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{type.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* نام و شماره تماس */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {isFa ? "نام و نام خانوادگی" : "Full Name"}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder={isFa ? "مثال: علی احمدی" : "e.g. Alex Morgan"}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#e6304c] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {isFa ? "شماره تماس همراه" : "Phone Number"}
                          </label>
                          <input
                            type="tel"
                            required
                            dir="ltr"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0912..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#e6304c] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* ایمیل کاری */}
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          {isFa ? "ایمیل کاری یا سازمانی" : "Corporate Email"}
                        </label>
                        <input
                          type="email"
                          required
                          dir="ltr"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#e6304c] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* شرح خلاصه اهداف */}
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          {isFa ? "شرح خلاصه اهداف و امکانات مورد نیاز" : "Brief Project Goals"}
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={isFa ? "امکانات کلیدی، زمان‌بندی مد نظر یا مقیاس تخمینی کاربران..." : "Key features, timeline, target user scale..."}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#e6304c] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e6304c] py-3 text-xs font-bold text-white shadow-lg shadow-[#e6304c]/25 hover:bg-[#ff3b59] transition-all"
                      >
                        <span>{isFa ? "ثبت و ارسال پیشنهاد همکاری" : "Submit Scoping Request"}</span>
                        <Send className={`h-3.5 w-3.5 ${isFa ? "rotate-180" : ""}`} />
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* موج خروجی از سکشن نقشه دارک به سکشن سوالات متداول سفید */}
      <WaveNavyToWhite bg="bg-[#0f0f52]" />

      {/* ══════════════════════════════════════════════════════════
          ۴. آکاردئون سوالات متداول («مشتاق شنیدن صدای شما هستیم»)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-6 pb-16 sm:pt-8 sm:pb-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6304c] via-rose-600 to-[#0f0f52]">
                  {isFa ? "مشتاق شنیدن صدای شما هستیم" : "We Are Eager to Hear From You"}
                </span>
              </h3>
              <p className="mt-2 text-base font-bold text-slate-800">
                {isFa ? "پرسش‌های پرتکرار در آغاز همکاری" : "Frequently Asked Questions"}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                {isFa
                  ? "در این بخش به سوالات متداول مدیران و کارفرمایان درباره فرآیند برآورد و استانداردهای مهندسی پاسخ داده‌ایم."
                  : "Transparent answers regarding our engineering standards, scoping process, and delivery pipelines."}
              </p>
            </div>

            {/* لیست سوالات آکاردئون */}
            <div className="space-y-3.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/50 transition-colors overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-start font-bold text-xs sm:text-sm text-slate-900 hover:text-[#e6304c] transition-colors"
                    >
                      <span className="leading-relaxed">{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 text-slate-400 ${
                          isOpen ? "rotate-180 text-[#e6304c]" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 text-xs leading-relaxed text-slate-600 border-t border-slate-200/60 pt-3">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </Container>
      </section>

      {/* انیمیشن پیوسته امواج مایع بدون تداخل با Server Component */}
      <style>{`
        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-flow-slower { animation: wave-flow 32s linear infinite; }
        .animate-wave-flow-slow { animation: wave-flow 24s linear infinite; }
        .animate-wave-flow-medium { animation: wave-flow 18s linear infinite; }
        .animate-wave-flow-fast { animation: wave-flow 12s linear infinite; }
      `}</style>
    </div>
  );
}

export default ContactPageCanvas;