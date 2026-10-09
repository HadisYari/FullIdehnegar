import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/dictionaries";
import { getPageContent } from "@/lib/cms";
import PaymentContent from "./PaymentContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isFa = locale === "fa";
  const page = await getPageContent("payment", locale);
  const title = page?.metaTitle || (isFa ? "انتخاب پلن و پرداخت | فروشگاه‌ساز ایده‌نگار" : "Choose a Plan and Pay | Idehnegar Store Builder");
  const description = page?.metaDescription || (isFa
    ? "انتخاب پلن فروشگاه‌ساز و ثبت درخواست راه‌اندازی فروشگاه اینترنتی."
    : "Choose an online store plan and submit your setup request.");
  return {
    title,
    description,
    alternates: {
      canonical: page?.canonicalUrl || (isFa ? "/payment" : "/en/payment"),
      languages: { fa: "/payment", en: "/en/payment" },
    },
    openGraph: {
      title: page?.openGraphTitle || title,
      description: page?.openGraphDescription || description,
      images: page?.imagePath ? [{ url: page.imagePath, alt: page.imageAlt || title }] : undefined,
    },
  };
}

export default function PaymentPage() {
  return <PaymentContent />;
}
