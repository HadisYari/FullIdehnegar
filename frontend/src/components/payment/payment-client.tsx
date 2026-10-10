"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import type { PageSectionDto, StorePlanDto } from "@/lib/cms";
import { resolveSection, type LocalSection } from "@/lib/page-sections";

/* کپی ثابت متن‌های بخش‌های این صفحه (فارسی). {count} = تعداد نسخه‌ها. */
const fallbackSections: Record<string, LocalSection> = {
  intro: {
    body: "یکی از {count} نسخه زیر را بر اساس ساختار کسب‌وکار و نوع انبارداری خود انتخاب کنید تا فاکتور رسمی و لینک پرداخت صادر شود.",
  },
  trust: {
    items: [
      { icon: "🔒", title: "رمزنگاری ۲۵۶ بیتی SSL و اتصال به سوئیچ رسمی بانک مرکزی" },
      { title: "ضمانت بازگشت وجه تا ۷ روز در صورت عدم تأیید زیرساخت فنی" },
    ],
  },
};

/* ──────────────────────────────────────────────────────────
   کامپوننت محتوای پرداخت (داخل Suspense برای خواندن searchParams)
   ────────────────────────────────────────────────────────── */
function PaymentContent({ plans, sections }: { plans: StorePlanDto[]; sections?: PageSectionDto[] }) {
  const searchParams = useSearchParams();

  // متن بخش‌ها: CMS اولویت دارد، در نبودش fallbackSections
  const intro = resolveSection(sections, "intro", "fa", fallbackSections.intro);
  const trust = resolveSection(sections, "trust", "fa", fallbackSections.trust);
  const introBody = intro.body.replace("{count}", String(plans.length));

  // گرفتن ورودی‌های صفحه قبل (در صورت وجود)
  const initialTemplate = searchParams.get("templateId");
  const initialCycle = searchParams.get("cycle") === "monthly" ? "monthly" : "yearly";

  // پلن پیش‌فرض: «پرفروش‌ترین» — fallback: اولین پلن
  const defaultTierId =
    plans.find((plan) => plan.isPopular)?.id ?? plans[0]?.id ?? "";

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialCycle);
  const [selectedTierId, setSelectedTierId] = useState<string>(defaultTierId);
  const [gateway, setGateway] = useState<"shaparak" | "zarinpal">("shaparak");

  // فرم اطلاعات مشتری
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    storeName: "",
    domainDesired: "",
    rulesAccepted: true,
    company: "", // هانی‌پات — ربات‌ها پرش می‌کنند
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  // مپینگ templateId صفحه قبل به تایرها (سازگار با دادهٔ قبلی)
  useEffect(() => {
    if (!initialTemplate) return;
    if (initialTemplate === "light-1") setSelectedTierId("light-direct");
    else if (initialTemplate === "wh-2") setSelectedTierId("retail-smart");
    else if (initialTemplate === "wh-3") setSelectedTierId("b2b-techno");
    else if (initialTemplate === "wh-1" || initialTemplate === "wh-4") {
      setSelectedTierId("enterprise-omni");
    }
  }, [initialTemplate]);

  const currentTier =
    plans.find((tier) => tier.id === selectedTierId) ||
    plans.find((tier) => tier.isPopular) ||
    plans[plans.length - 1];

  const payableAmount =
    billingCycle === "yearly" ? currentTier.yearlyPrice : currentTier.monthlyPrice;

  // ارسال سفارش به /api/store-orders → بک‌اند (POST /api/public/store-orders)
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile || !formData.storeName) {
      alert("لطفاً فیلدهای ضروری (نام، شماره تماس و عنوان فروشگاه) را تکمیل کنید.");
      return;
    }
    if (!formData.rulesAccepted) {
      alert("پذیرش قوانین و شرایط خدمات برای صدور فاکتور رسمی الزامی است.");
      return;
    }

    setIsLoading(true);
    setSubmitError(false);

    try {
      const res = await fetch("/api/store-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobile: formData.mobile,
          storeName: formData.storeName,
          domain: formData.domainDesired || undefined,
          templateId: initialTemplate || undefined,
          plan: currentTier.name,
          cycle: billingCycle,
          amount: payableAmount,
          gateway,
          rulesAccepted: formData.rulesAccepted,
          locale: "fa",
          company: formData.company,
        }),
      });

      if (!res.ok) throw new Error("failed");
      const result = (await res.json()) as { reference?: string } | null;

      setIsLoading(false);
      alert(
        `سفارش «${currentTier.name}» به مبلغ ${payableAmount.toLocaleString(
          "fa-IR"
        )} تومان ثبت شد${result?.reference ? ` (کد پیگیری: ${result.reference})` : ""}.
اکنون به درگاه ${gateway === "shaparak" ? "شاپرک (مستقیم)" : "زرین‌پال"} منتقل می‌شوید.`
      );
    } catch {
      setIsLoading(false);
      setSubmitError(true);
    }
  };

  if (!currentTier) return null;

  return (
    <div className="relative w-full min-h-screen bg-slate-50 text-slate-900 pb-28 pt-10">

      {/* هدر صفحه */}
      <section className="relative mb-10">
        <Container className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f0f52]/20 bg-[#0f0f52]/5 px-4 py-1 text-xs font-bold text-[#0f0f52]">
              <span className="h-2 w-2 rounded-full bg-[#e6304c] animate-ping" />
              درگاه پرداخت ایمن و صدور آنی لایسنس
            </div>

            <h1 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              خرید اشتراک و راه‌اندازی فروشگاه‌ساز
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              {introBody}
            </p>

            {/* سوییچر دوره پرداخت ماهانه / سالانه */}
            <div className="mt-6 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#0f0f52] text-white shadow-md shadow-[#0f0f52]/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                پرداخت ماهانه
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-[#0f0f52] text-white shadow-md shadow-[#0f0f52]/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>پرداخت سالانه</span>
                <span className="bg-[#e6304c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ۲۰٪ تخفیف + ۲ ماه رایگان
                </span>
              </button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* محتوای اصلی ۲ ستونه */}
      <Container className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ستون راست (۸ ستون): انتخاب نسخه و مقایسه امکانات */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">
                مرحله ۱: انتخاب نسخه فروشگاه‌ساز
              </span>
              <span className="text-xs text-rose-600 font-bold">
                تحویل خودکار کمتر از ۲ ساعت ⚡
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                const tierPrice =
                  billingCycle === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`relative rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#0f0f52] text-white border-[#e6304c] shadow-xl shadow-[#0f0f52]/25 ring-4 ring-[#e6304c]/20 -translate-y-1"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs"
                    }`}
                  >
                    {/* بج محبوب‌ترین */}
                    {tier.isPopular && (
                      <span className="absolute -top-3 left-4 bg-gradient-to-r from-[#e6304c] to-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                        ★ پرفروش‌ترین انتخاب سازمانی
                      </span>
                    )}

                    <div>
                      {/* رادیو باتن و تگ بالایی */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                            isSelected
                              ? "bg-white/10 text-rose-300 border-white/20"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {tier.badge}
                        </span>

                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-[#e6304c] bg-[#e6304c]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>

                      {/* عنوان و توضیحات تایر */}
                      <h3
                        className={`mt-3 text-base sm:text-lg font-black leading-snug ${
                          isSelected ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {tier.name}
                      </h3>

                      <p
                        className={`mt-1.5 text-xs line-clamp-2 leading-relaxed ${
                          isSelected ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {tier.tagline}
                      </p>

                      {/* قیمت */}
                      <div className="mt-4 pt-3 border-t border-slate-200/20">
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`text-2xl font-black font-mono ${
                              isSelected ? "text-amber-300" : "text-[#0f0f52]"
                            }`}
                          >
                            {tierPrice.toLocaleString("fa-IR")}
                          </span>
                          <span
                            className={`text-xs ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            تومان / {billingCycle === "yearly" ? "سالیانه" : "ماهانه"}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] block mt-1 ${
                            isSelected ? "text-emerald-300" : "text-emerald-600"
                          }`}
                        >
                          ⏱️ {tier.setupTime}
                        </span>
                      </div>

                      {/* ویژگی‌ها */}
                      <div className="mt-4 space-y-2">
                        {(tier.features ?? []).slice(0, 3).map((f) => (
                          <div
                            key={f}
                            className={`flex items-start gap-1.5 text-[11px] ${
                              isSelected ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                            <span className="line-clamp-1">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/20">
                      <span
                        className={`text-xs font-bold block text-center py-2 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-[#e6304c] text-white border-transparent shadow-md"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected ? "✓ انتخاب شده برای پرداخت" : "انتخاب این نسخه"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* کارت امکانات تفصیلی نسخه انتخاب شده */}
            <div className="mt-6 rounded-3xl bg-white border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#0f0f52]" />
                  <h4 className="text-sm font-black text-slate-900">
                    امکانات کامل نسخه انتخابی: {currentTier.name}
                  </h4>
                </div>
                <span className="text-xs text-slate-500">{currentTier.badge}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(currentTier.features ?? []).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}

                {(currentTier.limitations ?? []).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-200"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold">
                      ✕
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ستون چپ (۴ ستون): فرم خریدار و فاکتور نهایی تسویه‌حساب */}
          <div className="lg:col-span-4 sticky top-6 space-y-4">
            <div className="px-1">
              <span className="text-xs font-bold text-slate-500">
                مرحله ۲: فاکتور و اطلاعات خریدار
              </span>
            </div>

            <form
              onSubmit={handleSubmitPayment}
              className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-lg shadow-slate-200/50 space-y-5"
            >
              {/* خلاصه فاکتور */}
              <div className="rounded-2xl bg-[#0f0f52] text-white p-4 space-y-3">
                <span className="text-[11px] text-rose-300 font-bold block">
                  پیش‌‌فاکتور رسمی لایسنس
                </span>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">پلن خریداری‌شده:</span>
                  <span className="font-bold">{currentTier.name}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">دوره اشتراک:</span>
                  <span className="font-bold">
                    {billingCycle === "yearly" ? "سالیانه (شامل تخفیف)" : "ماهانه"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">هزینه راه‌اندازی و سرور:</span>
                  <span className="font-bold text-emerald-400">رایگان (هدیه)</span>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-slate-200 font-bold">مبلغ نهایی پرداخت:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-amber-300 font-mono">
                      {payableAmount.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[11px] text-slate-300">تومان</span>
                  </div>
                </div>
              </div>

              {/* Honeypot — ربات‌ها پرش می‌کنند، کاربر واقعی هرگز نمی‌بیند */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              {/* فرم اطلاعات تحویل */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    نام و نام خانوادگی خریدار <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علی رضایی"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#0f0f52] focus:outline-none focus:ring-2 focus:ring-[#0f0f52]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    شماره همراه (جهت دریافت لاگین و پیامک احراز) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="09123456789"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#0f0f52] focus:outline-none focus:ring-2 focus:ring-[#0f0f52]/10 transition-all text-start"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    عنوان پیشنهادی فروشگاه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فروشگاه تخصصی کالای دیجیتال"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#0f0f52] focus:outline-none focus:ring-2 focus:ring-[#0f0f52]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    نام دامنه مدنظر (اختیاری)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="MyBrand.ir"
                    value={formData.domainDesired}
                    onChange={(e) => setFormData({ ...formData, domainDesired: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#0f0f52] focus:outline-none focus:ring-2 focus:ring-[#0f0f52]/10 transition-all text-start"
                  />
                </div>
              </div>

              {/* انتخاب درگاه */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  انتخاب درگاه بانکی:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGateway("shaparak")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      gateway === "shaparak"
                        ? "border-[#0f0f52] bg-[#0f0f52]/5 text-[#0f0f52] ring-2 ring-[#0f0f52]/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>🏦</span>
                    <span>درگاه سداد  </span>
                  </button>

                  
                </div>
              </div>

              {/* قوانین و چک‌باکس */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rules"
                  checked={formData.rulesAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, rulesAccepted: e.target.checked })
                  }
                  className="rounded border-slate-300 text-[#e6304c] focus:ring-[#e6304c]"
                />
                <label htmlFor="rules" className="text-[11px] text-slate-600 cursor-pointer">
                  قوانین و شرایط استفاده از زیرساخت ابری را مطالعه کرده و می‌پذیرم.
                </label>
              </div>

              {/* دکمه ارسال به درگاه */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e6304c] to-rose-600 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-[#e6304c]/30 hover:from-[#ff3b59] hover:to-rose-500 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    در حال اتصال به درگاه بانکی...
                  </span>
                ) : (
                  <>
                    <span>پرداخت آنلاین ({payableAmount.toLocaleString("fa-IR")} تومان)</span>
                    <span>←</span>
                  </>
                )}
              </button>

              {submitError && (
                <p className="text-[11px] font-bold text-red-600 text-center">
                  ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
                </p>
              )}

              {/* نمادهای اطمینان */}
              <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                {trust.items.map((item) => (
                  <p key={item.title}>
                    {item.icon ? `${item.icon} ` : ""}
                    {item.title}
                  </p>
                ))}
              </div>
            </form>

            {/* لینک بازگشت به دموی قالب‌ها */}
            <div className="text-center pt-2">
              <Link
                href="/store-builder"
                className="text-xs font-bold text-slate-500 hover:text-[#e6304c] transition-colors"
              >
                ← بازگشت به صفحه کاوش و مشاهده پیش‌نمایش قالب‌ها
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

export function PaymentClient({ plans, sections }: { plans: StorePlanDto[]; sections?: PageSectionDto[] }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
          در حال بارگذاری صفحه پرداخت...
        </div>
      }
    >
      <PaymentContent plans={plans} sections={sections} />
    </Suspense>
  );
}

export default PaymentClient;
