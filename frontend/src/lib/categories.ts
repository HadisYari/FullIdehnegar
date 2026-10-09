export interface Category {
  slug: string;
  fa: string;
  en: string;
}

export const categories = [
  { slug: "enterprise-software", fa: "نرم‌افزار سازمانی", en: "Enterprise Software" },
  { slug: "website", fa: "وب‌سایت شرکتی", en: "Corporate Website" },
  { slug: "ecommerce", fa: "فروشگاه اینترنتی", en: "E-commerce" },
  { slug: "portal", fa: "پرتال سازمانی/دولتی", en: "Government Portal" },
  { slug: "ai", fa: "هوش مصنوعی", en: "AI Solution" },
  { slug: "industrial", fa: "اتوماسیون صنعتی", en: "Industrial Automation" },
  { slug: "international", fa: "پروژه بین‌المللی", en: "International Project" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function categoryLabel(slug: string, locale: "fa" | "en") {
  const found = categories.find((c) => c.slug === slug);
  if (!found) return slug;
  return locale === "fa" ? found.fa : found.en;
}
