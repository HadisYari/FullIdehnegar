// app/[locale]/payment/page.tsx
import type { Metadata } from "next";
import { withPageMeta } from "@/lib/cms";
import { getStorePlans } from "@/lib/store";
import { locales } from "@/lib/i18n/dictionaries";
import { PaymentClient } from "@/components/payment/payment-client";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";
  // صفحهٔ پرداخت در نتایج جست‌وجو نمایش داده نمی‌شود (noIndex در PageMeta).
  return withPageMeta("payment", isFa ? "fa" : "en", {
    path: "/payment",
    title: isFa ? "تسویه حساب و فعال‌سازی اشتراک" : "Checkout & Subscription Activation",
    description: isFa
      ? "تکمیل اطلاعات و پرداخت امن اشتراک فروشگاه‌ساز ایده‌نگار."
      : "Complete your details and pay securely to activate your store subscription.",
  });
}

export default async function PaymentPage() {
  // پلن‌ها از بک‌اند (CMS) خوانده می‌شوند؛ در نبود API از src/data/store-plans.json.
  const plans = await getStorePlans();
  return <PaymentClient plans={plans} />;
}
