/**
 * cms.ts — تنها نقطه اتصال فرانت‌اند به بک‌اند ASP.NET (EndPoints)
 *
 * - همه‌چیز «به‌هم‌ریختنی» است: اگر API در دسترس نباشد، داده‌های همراه پروژه
 *   (site-config.ts و src/data/*.json) استفاده می‌شوند تا build و سایت هرگز نشکنند.
 *   بنابراین می‌توان فازبه‌فاز به بک‌اند وصل شد (CMS_ENABLED=true بعد از دیپلوی).
 * - پاسخ‌ها با ISR کش می‌شوند و پنل مدیریت پس از هر ذخیره،
 *   POST /api/revalidate را با تگ‌های همان جدول صدا می‌زند.
 */
import "server-only";
import type { Metadata } from "next";

export const CMS_BASE = (process.env.CMS_API_URL ?? "").replace(/\/+$/, "");

/** روشن بودن اتصال به بک‌اند: فقط با CMS_API_URL. */
export const cmsEnabled = CMS_BASE.length > 0 && process.env.CMS_DISABLED !== "1";

const DEFAULT_REVALIDATE = Number.parseInt(process.env.CMS_REVALIDATE_SECONDS ?? "60", 10) || 60;
const TIMEOUT_MS = Number.parseInt(process.env.CMS_TIMEOUT_MS ?? "4000", 10) || 4000;

/** تگ‌هایی که با جدول‌های پنل مدیریت یکی شده‌اند. */
export const CmsTag = {
  settings: "settings",
  pages: "pages",
  home: "home",
  portfolio: "portfolio",
  services: "services",
  about: "about",
  contact: "contact",
  store: "store",
  payment: "payment",
  goldApp: "gold-app",
  sitemap: "sitemap",
} as const;

export type LocalizedText = { fa: string; en: string };

export type SiteSettingsDto = {
  domain: string;
  siteUrl: string;
  name: LocalizedText;
  shortName: LocalizedText;
  tagline: LocalizedText;
  foundedJalali: number;
  foundedGregorian: number;
  email: string;
  phones: string[];
  telegram?: string | null;
  whatsapp?: string | null;
  address: LocalizedText;
  hours: LocalizedText;
  mapEmbedSrc?: string | null;
  social?: { telegram?: string | null; linkedIn?: string | null; instagram?: string | null };
  stats?: { clients?: number; projects?: number; yearsActive?: number; awards?: number };
  defaultOgImage?: string | null;
  updatedAtUtc?: string;
};

export type PageMetaDto = {
  pageKey: string;
  path: string;
  title: LocalizedText;
  description: LocalizedText;
  keywords: LocalizedText;
  eyebrow: LocalizedText;
  heading: LocalizedText;
  subheading: LocalizedText;
  ctaPrimary: LocalizedText;
  ctaSecondary: LocalizedText;
  ogImage?: string | null;
  noIndex: boolean;
  changeFrequency: string;
  priority: number;
  updatedAtUtc?: string | null;
};

export type SitemapEntryDto = {
  path: string;
  lastModified?: string | null;
  changeFrequency: string;
  priority: number;
  noIndex?: boolean;
};

export type ProjectFeatureDto = { title: LocalizedText; description: LocalizedText };
export type ProjectStatDto = {
  label: LocalizedText;
  value: LocalizedText;
  iconPath?: string | null;
  color?: string | null;
};

/** دقیقاً شکل PortfolioItem در lib/portfolio.ts (فیلدهای اضافه بی‌ضررند). */
export type PortfolioProjectDto = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  category: string;
  image: string;
  featured: boolean;
  desktopScreenshot?: string | null;
  mobileScreenshot?: string | null;
  gallery?: string[];
  features?: ProjectFeatureDto[];
  stats?: ProjectStatDto[];
  challenge?: LocalizedText | null;
  solution?: LocalizedText | null;
  client: LocalizedText;
  year: number;
  tags?: string[];
  link?: string | null;
  updatedAtUtc?: string | null;
};

export type TestimonialDto = {
  id: string;
  name: LocalizedText;
  quote: LocalizedText;
};

export type ClientLogoDto = {
  id: string;
  name: LocalizedText;
  monogram?: string | null;
  logoUrl?: string | null;
};

/** «دسته‌بندی نمونه‌کارها» — همان شکل lib/categories.ts */
export type PortfolioCategoryDto = { slug: string; fa: string; en: string };

export type MilestoneDto = {
  year: string;
  title: LocalizedText;
  desc: LocalizedText;
  glow?: string | null;
  gradient?: string | null;
};

export type TeamRoleDto = { role: string; label: string; span?: string | null; bg?: string | null };

export type FaqDto = { question: LocalizedText; answer: LocalizedText };

export type InquiryTypeDto = { id: string; label: LocalizedText; icon?: string | null };

export type ServiceDto = {
  id: string;
  icon?: string | null;
  title: LocalizedText;
  desc: LocalizedText;
  highlights: { fa: string[]; en: string[] };
  visualIndex: number;
};

/** کارت خدمات صفحه اصلی (جدا از شش خدمت صفحه خدمات). */
export type HomeServiceCardDto = {
  id: string;
  code: string;
  icon?: string | null;
  title: LocalizedText;
  desc: LocalizedText;
  color?: string | null;
  softColor?: string | null;
  glowColor?: string | null;
  featureTitle?: LocalizedText | null;
  featureValue?: LocalizedText | null;
  progress?: string | null;
  tags: string[];
};

/* صفحه درباره ما: متن هر بلوک و آیتم‌های جدولی (GET /api/public/about-content) */
export type AboutSectionDto = {
  key: string;
  eyebrow?: LocalizedText | null;
  title: LocalizedText;
  subtitle?: LocalizedText | null;
};
export type CoreValueDto = {
  id: string;
  iconPath?: string | null;
  title: LocalizedText;
  desc: LocalizedText;
};
export type CertificationDto = {
  id: string;
  icon?: string | null;
  title: LocalizedText;
  organization: LocalizedText;
  colorClass?: string | null;
  borderClass?: string | null;
};
export type LifecycleStepDto = {
  id: string;
  number: string;
  name: LocalizedText;
  desc: LocalizedText;
};
export type PhilosophyPrincipleDto = {
  id: string;
  icon?: string | null;
  tag: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  codeSnippet?: string | null;
};
export type TechStackGroupDto = { id: string; label: LocalizedText; items: string[] };
export type AboutStatDto = {
  id: string;
  value: number;
  suffix?: string | null;
  label: LocalizedText;
  icon?: string | null;
};
export type AboutContentDto = {
  sections: AboutSectionDto[];
  coreValues: CoreValueDto[];
  certifications: CertificationDto[];
  lifecycleSteps: LifecycleStepDto[];
  philosophyPrinciples: PhilosophyPrincipleDto[];
  techStackGroups: TechStackGroupDto[];
  stats: AboutStatDto[];
};

export type ProcessStepDto = {
  id: string;
  icon?: string | null;
  color?: string | null;
  accent?: string | null;
  title: LocalizedText;
  duration: LocalizedText;
  desc: LocalizedText;
  deliverables: { fa: string[]; en: string[] };
};

export type StoreTemplateDto = {
  id: string;
  name: string;
  category: string;
  tag?: string | null;
  planName: string;
  priceMonthly: number;
  priceYearly: number;
  discountBadge?: string | null;
  desc?: string | null;
  features?: string[];
  desktopScreens?: { label: string; src: string }[];
  mobileScreens?: { label: string; src: string }[];
};

export type StorePlanDto = {
  id: string;
  name: string;
  badge?: string | null;
  tagline?: string | null;
  isPopular: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  setupTime?: string | null;
  features?: string[];
  limitations?: string[];
};

export type AppDownloadLinkDto = {
  title: LocalizedText;
  caption: LocalizedText;
  href: string;
  emoji?: string | null;
  variant?: string | null;
};

type RequestOptions = {
  /** تگ‌های ISR که با تغییر این داده باید نامعتبر شوند. */
  tags?: string[];
  revalidate?: number;
};

/**
 * GET از بک‌اند با افتادگی بی‌خطر به دادهٔ محلی.
 * هیچ‌وقت throw نمی‌کند؛ در خطا `fallback` برمی‌گرداند.
 */
export async function cmsFetch<T>(path: string, fallback: T, options: RequestOptions = {}): Promise<T> {
  if (!cmsEnabled) return fallback;

  const { tags, revalidate = DEFAULT_REVALIDATE } = options;

  try {
    const response = await fetch(`${CMS_BASE}${path}`, {
      headers: { accept: "application/json" },
      next: { revalidate, tags: tags && tags.length > 0 ? tags : undefined },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: revalidate === 0 ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[cms] ${path} ناموفق بود؛ از دادهٔ همراه پروژه استفاده می‌شود.`, describe(error));
    return fallback;
  }
}

/** POST به بک‌اند؛ نتیجهٔ null یعنی «سرویس در دسترس نبود/غیرفعال بود». */
export async function cmsPost<TBody extends object, TResult>(
  path: string,
  body: TBody,
): Promise<TResult | null> {
  if (!cmsEnabled) return null;

  try {
    const response = await fetch(`${CMS_BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS * 2),
      cache: "no-store",
    });

    const text = await response.text();
    const payload = text.length > 0 ? (JSON.parse(text) as TResult) : undefined;

    if (!response.ok) {
      const message = payload ? JSON.stringify(payload) : `HTTP ${response.status}`;
      throw new Error(message);
    }

    return payload ?? ({} as TResult);
  } catch (error) {
    console.warn(`[cms] POST ${path} ناموفق بود.`, describe(error));
    return null;
  }
}

function describe(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const text = (value: LocalizedText | undefined, fallback: string, locale: "fa" | "en"): string => {
  const candidate = value?.[locale]?.trim();
  return candidate && candidate.length > 0 ? candidate : fallback;
};

/** مقدار عددی/متنی امن از DTO. */
const pick = <T,>(value: T | undefined | null, fallback: T): T =>
  value === undefined || value === null ? fallback : value;

/* ───────────────────────────────── تنظیمات شرکت ───────────────────────────────── */

import { siteConfig, type SiteConfig } from "./site-config";

/**
 * تنظیمات سایت از دیتابیس، روی `siteConfig` سوار می‌شود.
 * خروجی همان شکل قبلی است، پس کامپوننت‌ها نیازی به تغییر ندارند.
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  const dto = await cmsFetch<SiteSettingsDto>("/api/public/settings", null as unknown as SiteSettingsDto, {
    tags: [CmsTag.settings],
    revalidate: DEFAULT_REVALIDATE,
  });

  if (!dto) return siteConfig;

  const stats = dto.stats ?? {};
  const social = dto.social ?? {};

  return {
    domain: pick(dto.domain, siteConfig.domain),
    url: pick(dto.siteUrl, siteConfig.url),
    nameFa: text(dto.name, siteConfig.nameFa, "fa"),
    nameEn: text(dto.name, siteConfig.nameEn, "en"),
    shortNameFa: text(dto.shortName, siteConfig.shortNameFa, "fa"),
    shortNameEn: text(dto.shortName, siteConfig.shortNameEn, "en"),
    taglineFa: text(dto.tagline, siteConfig.taglineFa, "fa"),
    taglineEn: text(dto.tagline, siteConfig.taglineEn, "en"),
    foundedJalali: Number(dto.foundedJalali) > 0 ? dto.foundedJalali : siteConfig.foundedJalali,
    foundedGregorian:
      Number(dto.foundedGregorian) > 0 ? dto.foundedGregorian : siteConfig.foundedGregorian,
    email: pick(dto.email, siteConfig.email),
    phones: Array.isArray(dto.phones) && dto.phones.length > 0 ? dto.phones : [...siteConfig.phones],
    telegram: pick(dto.telegram, siteConfig.telegram),
    whatsapp: pick(dto.whatsapp, siteConfig.whatsapp),
    addressFa: text(dto.address, siteConfig.addressFa, "fa"),
    addressEn: text(dto.address, siteConfig.addressEn, "en"),
    hoursFa: text(dto.hours, siteConfig.hoursFa, "fa"),
    hoursEn: text(dto.hours, siteConfig.hoursEn, "en"),
    mapEmbedSrc: pick(dto.mapEmbedSrc, siteConfig.mapEmbedSrc),
    social: {
      telegram: pick(social.telegram, siteConfig.social.telegram),
      linkedin: pick(social.linkedIn, siteConfig.social.linkedin),
      instagram: pick(social.instagram, siteConfig.social.instagram),
    },
    stats: {
      clients: Number(stats.clients ?? siteConfig.stats.clients),
      projects: Number(stats.projects ?? siteConfig.stats.projects),
      yearsActive: Number(stats.yearsActive ?? siteConfig.stats.yearsActive),
      awards: Number(stats.awards ?? siteConfig.stats.awards),
    },
  };
}

/* ───────────────────────────────── سئوی صفحات ───────────────────────────────── */

/** همهٔ متاهای سئو یک‌جا (یک درخواست به‌جای هشت تا). */
export function loadPageMetas(): Promise<Record<string, PageMetaDto>> {
  return cmsFetch<Record<string, PageMetaDto>>("/api/public/pages", {}, { tags: [CmsTag.pages] });
}

/**
 * متای یک صفحه. اگر کل `pages` کش‌شده آن را داشت از همان استفاده می‌کنیم،
 * وگرنه یک درخواست تک‌نقطه‌ای زده می‌شود.
 */
export async function loadPageMeta(pageKey: string): Promise<PageMetaDto | null> {
  const cached = await cmsFetch<PageMetaDto | null>(`/api/public/pages/${pageKey}`, null, {
    tags: [CmsTag.pages],
  });
  return cached ?? null;
}



/**
 * تکهٔ Metadata ساخته‌شده از PageMeta دیتابیس.
 * فیلدهای خالی دست‌نخورده می‌مانند تا مقدار پیش‌فرض خود صفحه معتبر بماند.
 */
export function buildMetadata(
  meta: PageMetaDto | null,
  locale: "fa" | "en",
  options: { path: string; fallbackTitle: string; fallbackDescription: string; baseUrl?: string },
): Metadata {
  const { path, fallbackTitle, fallbackDescription } = options;
  const baseUrl = (options.baseUrl ?? siteConfig.url).replace(/\/+$/, "");
  const isFa = locale === "fa";
  const canonical = isFa ? path : `/en${path === "/" ? "" : path}`;

  if (!meta) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical, languages: { fa: path, en: `/en${path === "/" ? "" : path}` } },
    };
  }

  const title = text(meta.title, fallbackTitle, locale);
  const description = text(meta.description, fallbackDescription, locale);
  const keywords = text(meta.keywords, "", locale)
    .split(/[,،]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const fragment: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `${baseUrl}${path === "/" ? "" : path}`,
        en: `${baseUrl}/en${path === "/" ? "" : path}`,
        "x-default": `${baseUrl}${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: isFa ? "fa_IR" : "en_US",
      url: `${baseUrl}${canonical}`,
      title,
      description,
      images: meta.ogImage ? [{ url: meta.ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (keywords.length > 0) fragment.keywords = keywords;
  if (meta.noIndex) fragment.robots = { index: false, follow: false };

  return fragment;
}

/**
 * generateMetadata یک صفحه: متن‌های پیش‌فرض کد، با پوشش PageMeta دیتابیس.
 * اگر بک‌اند فعال نباشد یا فیلدی خالی باشد، همان مقدار کد استفاده می‌شود.
 */
export async function withPageMeta(
  pageKey: string,
  locale: "fa" | "en",
  fallback: { path: string; title: string; description: string },
): Promise<Metadata> {
  const [meta, config] = await Promise.all([loadPageMeta(pageKey), loadSiteConfig()]);

  return buildMetadata(meta, locale, {
    path: fallback.path,
    fallbackTitle: fallback.title,
    fallbackDescription: fallback.description,
    baseUrl: config.url,
  });
}

/* ───────────────────────────────── محتوا ───────────────────────────────── */

export type { PortfolioProjectDto as CmsPortfolioProject };

/** دسته‌بندی‌های نمونه‌کار (VIN /api/public/categories) — fallback آن lib/categories.ts است. */
export function loadCategories(): Promise<PortfolioCategoryDto[]> {
  return cmsFetch<PortfolioCategoryDto[]>("/api/public/categories", [], {
    tags: [CmsTag.portfolio, CmsTag.home],
  });
}

export function loadPortfolio(take = 100, category?: string, featured?: boolean): Promise<PortfolioProjectDto[]> {
  const query = new URLSearchParams();
  if (take > 0) query.set("take", String(take));
  if (category) query.set("category", category);
  if (featured !== undefined) query.set("featured", String(featured));
  const suffix = query.toString().length > 0 ? `?${query.toString()}` : "";

  return cmsFetch<PortfolioProjectDto[]>(`/api/public/portfolio${suffix}`, [], {
    tags: [CmsTag.portfolio, CmsTag.home],
  });
}

export function loadPortfolioItem(slug: string): Promise<PortfolioProjectDto | null> {
  return cmsFetch<PortfolioProjectDto | null>(`/api/public/portfolio/${encodeURIComponent(slug)}`, null, {
    tags: [CmsTag.portfolio],
  });
}

export function loadRelatedProjects(slug: string, take = 3): Promise<PortfolioProjectDto[]> {
  return cmsFetch<PortfolioProjectDto[]>(
    `/api/public/portfolio/${encodeURIComponent(slug)}/related?take=${take}`,
    [],
    { tags: [CmsTag.portfolio] },
  );
}

export function loadServices(): Promise<ServiceDto[]> {
  return cmsFetch<ServiceDto[]>("/api/public/services", [], { tags: [CmsTag.services, CmsTag.home] });
}

export function loadHomeServiceCards(): Promise<HomeServiceCardDto[]> {
  return cmsFetch<HomeServiceCardDto[]>("/api/public/home-services", [], { tags: [CmsTag.home] });
}

/** Whole about page in one request; null when the CMS is offline (components then use their local copy). */
export function loadAboutContent(): Promise<AboutContentDto | null> {
  return cmsFetch<AboutContentDto | null>("/api/public/about-content", null, { tags: [CmsTag.about] });
}

/* بلوک‌های محتوایی صفحات (تیتر، متن و آیتم‌های فهرست/کارت) — GET /api/public/page-sections/{pageKey} */
export type PageSectionItemDto = {
  icon: string | null;
  title: LocalizedText;
  description: LocalizedText | null;
  href: string | null;
  /** Optional short badge (time, figure, status). */
  value: LocalizedText | null;
};

export type PageSectionDto = {
  key: string;
  eyebrow: LocalizedText | null;
  title: LocalizedText | null;
  subtitle: LocalizedText | null;
  body: LocalizedText | null;
  items: PageSectionItemDto[];
};

/** Every block of one page; [] when the CMS is offline (components then use their local copy). */
export function loadPageSections(pageKey: string): Promise<PageSectionDto[]> {
  return cmsFetch<PageSectionDto[]>(`/api/public/page-sections/${encodeURIComponent(pageKey)}`, [], {
    tags: [CmsTag.pages],
  });
}

/** Section copy (eyebrow/title/subtitle) of one about block, by key. */
export function aboutSection(content: AboutContentDto | null, key: string): AboutSectionDto | undefined {
  return content?.sections.find((section) => section.key === key);
}

export function loadProcessSteps(): Promise<ProcessStepDto[]> {
  return cmsFetch<ProcessStepDto[]>("/api/public/process-steps", [], { tags: [CmsTag.home] });
}

export function loadClients(): Promise<ClientLogoDto[]> {
  return cmsFetch<ClientLogoDto[]>("/api/public/clients", [], { tags: [CmsTag.home] });
}

export function loadTestimonials(): Promise<TestimonialDto[]> {
  return cmsFetch<TestimonialDto[]>("/api/public/testimonials", [], { tags: [CmsTag.home] });
}

export function loadMilestones(): Promise<MilestoneDto[]> {
  return cmsFetch<MilestoneDto[]>("/api/public/milestones", [], { tags: [CmsTag.about] });
}

export function loadTeam(): Promise<TeamRoleDto[]> {
  return cmsFetch<TeamRoleDto[]>("/api/public/team", [], { tags: [CmsTag.about] });
}

export function loadFaqs(): Promise<FaqDto[]> {
  return cmsFetch<FaqDto[]>("/api/public/faqs", [], { tags: [CmsTag.contact] });
}

export function loadInquiryTypes(): Promise<InquiryTypeDto[]> {
  return cmsFetch<InquiryTypeDto[]>("/api/public/inquiry-types", [], { tags: [CmsTag.contact] });
}

export function loadStoreTemplates(category?: string): Promise<StoreTemplateDto[]> {
  const suffix = category ? `?category=${encodeURIComponent(category)}` : "";
  return cmsFetch<StoreTemplateDto[]>(`/api/public/store-templates${suffix}`, [], { tags: [CmsTag.store] });
}

export function loadStorePlans(): Promise<StorePlanDto[]> {
  return cmsFetch<StorePlanDto[]>("/api/public/store-plans", [], { tags: [CmsTag.store, CmsTag.payment] });
}

export function loadAppDownloadLinks(): Promise<AppDownloadLinkDto[]> {
  return cmsFetch<AppDownloadLinkDto[]>("/api/public/app-download-links", [], { tags: [CmsTag.goldApp] });
}

export function loadSitemapEntries(): Promise<SitemapEntryDto[]> {
  return cmsFetch<SitemapEntryDto[]>("/api/public/sitemap", [], { tags: [CmsTag.sitemap] });
}

/* ───────────────────────────────── فرم‌ها ───────────────────────────────── */

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  locale?: string;
  inquiryType?: string;
};

export type InquiryResult = { success?: boolean; message?: string; emailSent?: boolean };

/**
 * ثبت پیام تماس در دیتابیس + ارسال ایمیل توسط بک‌اند.
 * null یعنی بک‌اند فعال/در دسترس نبود (فراخواننده به فایل محلی می‌نویسد).
 */
export function submitContact(payload: ContactPayload): Promise<InquiryResult | null> {
  return cmsPost<ContactPayload, InquiryResult>("/api/public/contact", payload);
}

/**
 * بدنهٔ POST /api/public/store-orders — دقیقاً همان قرارداد StoreOrderRequest
 * در بک‌اند (InquiryApiController): FullName/Mobile/StoreName/Domain/TemplateId/
 * Plan/Cycle/Amount/Gateway/RulesAccepted/Locale + هانی‌پات Company.
 */
export type StoreOrderPayload = {
  fullName: string;
  mobile: string;
  storeName: string;
  domain?: string;
  templateId?: string;
  plan?: string;
  cycle?: string;
  amount?: number;
  gateway?: string;
  rulesAccepted: boolean;
  locale?: string;
  /** هانی‌پات: ربات‌ها پرش می‌کنند، کاربر واقعی هرگز نمی‌بیند. */
  company?: string;
};

export type StoreOrderResult = InquiryResult & {
  id?: string;
  reference?: string;
  status?: string;
};

export function submitStoreOrder(payload: StoreOrderPayload): Promise<StoreOrderResult | null> {
  return cmsPost<StoreOrderPayload, StoreOrderResult>("/api/public/store-orders", payload);
}
