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

export type CategoryOption = { slug: string; fa: string; en: string };

/**
 * برچسب دسته‌بندی.
 * `list` اختیاری است: کامپوننت‌های سرور (azität از /api/public/categories) لیست
 * CMS را می‌فرستند؛ در غیر این صورت از دادهٔ همراه مخزن استفاده می‌شود.
 */
export function categoryLabel(
  slug: string,
  locale: "fa" | "en",
  list: readonly CategoryOption[] = categories,
) {
  const found = list.find((c) => c.slug === slug);
  if (!found) return slug;
  return locale === "fa" ? found.fa : found.en;
}
