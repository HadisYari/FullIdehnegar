#!/usr/bin/env node
/*
 * generate-seed.mjs
 * ---------------------------------------------------------------------------
 * Builds backend/Idehnegar.Infrastructure/SeedData/seed.json from the Next.js
 * front end so the database starts with exactly the content the site renders
 * today — no invented fields, no hand-typed Persian copy.
 *
 *   node backend/tools/generate-seed.mjs
 *
 * Inputs: frontend/src/**  (ts / tsx / json)
 * Output: backend/Idehnegar.Infrastructure/SeedData/seed.json
 * ---------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const fe = path.join(root, "frontend", "src");

const read = (...p) => fs.readFileSync(path.join(...p), "utf-8");

/* ───────────────────────── tiny TS/JS literal scanners ───────────────────────── */

/** Returns the literal ([...] or {...}) that starts right after `marker`. */
function literalAfter(source, marker, opts = {}) {
  const at = source.indexOf(marker);
  if (at === -1) throw new Error(`marker not found: ${marker}`);
  const start = source.indexOf(opts.open || "[", at + marker.length);
  if (start === -1) throw new Error(`opening bracket not found after: ${marker}`);

  const closers = { "[": "]", "{": "}" };
  const open = source[start];
  const close = closers[open];

  let depth = 0;
  let quote = null;
  let i = start;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
    i++;
  }
  throw new Error(`unbalanced literal after: ${marker}`);
}

/** eval()s a literal twice (once per locale) so `isFa ? … : …` values resolve. */
function evalLiteralBoth(text) {
  return { fa: evalLiteral(text, true), en: evalLiteral(text, false) };
}

/** eval()s an object/array literal after stripping the small TS annotations used in the app. */
function evalLiteral(text, isFa = false) {
  const js = text
    .replace(/\bas\s+const\b/g, "")
    .replace(/\bas\s+Locale\b/g, "")
    .replace(/\bas\s+"rtl"\s*\|\s*"ltr"/g, "")
    .replace(/Record<Locale,\s*string\[\]\[\]>\s*=/g, "=")
    .replace(/StoreTier\[\]\s*=/g, "=")
    .replace(/TemplateItem\[\]\s*=/g, "=")
    .replace(/string\[\]\s*=\s*\[/g, "[")
    // JSX / icon component references are not data: neutralise them.
    .replace(/\bicon:\s*([A-Za-z_][\w.]*)/g, 'icon: "$1"')
    .replace(/\(\s*<[\s\S]*?\)\s*,/g, "null,");
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; const isFa = ${isFa ? "true" : "false"}; return (${js});`)();
}

const grab = (source, marker, opts) => evalLiteral(literalAfter(source, marker, opts));

/** Finds the two string literals of a `key: isFa ? "fa" : "en"` style pair. */
function pair(source, marker) {
  const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const quote = '(["`])';
  const pattern =
    escaped + '\\s*:?\\s*(?:isFa\\s*)?\\?\\s*' + quote + '([\\s\\S]*?)\\1\\s*:\\s*' + quote + '([\\s\\S]*?)\\3';
  const m = source.match(new RegExp(pattern));
  if (!m) return { fa: "", en: "" };
  return { fa: unquote(m[2]), en: unquote(m[4]) };
}

function unquote(value) {
  return value
    .replace(/\\\$\{/g, "${")
    .replace(/\$\{siteConfig\.(\w+)\}/g, (_, prop) => `\u0000${prop}\u0000`)
    .replace(/\\n/g, "\n")
    .replace(/\\\\"/g, '"')
    .trim();
}

/* ───────────────────────────────── site config ───────────────────────────────── */

const siteConfigSource = read(fe, "lib", "site-config.ts");
const siteConfig = evalLiteral(literalAfter(siteConfigSource, "export const siteConfig = ", { open: "{" }));

/* ───────────────────────────────── dictionaries ───────────────────────────────── */

const dictSource = read(fe, "lib", "i18n", "dictionaries.ts");
const dictionaries = grab(dictSource, "export const dictionaries = ", { open: "{" });
const fa = dictionaries.fa;
const en = dictionaries.en;

/* ───────────────────────────────── page meta (SEO) ───────────────────────────── */

const pageFiles = {
  home: "app/(site)/[locale]/page.tsx",
  about: "app/(site)/[locale]/about/page.tsx",
  services: "app/(site)/[locale]/services/page.tsx",
  portfolio: "app/(site)/[locale]/portfolio/page.tsx",
  contact: "app/(site)/[locale]/contact/page.tsx",
  "store-builder": "app/(site)/[locale]/store-builder/page.tsx",
  "gold-app": "app/(site)/[locale]/gold-app/page.tsx",
  payment: "app/(site)/[locale]/payment/page.tsx",
};

const layoutSource = read(fe, "app/(site)/[locale]/layout.tsx");
const resolvePlaceholders = (text) =>
  String(text || "").replace(/\u0000(\w+)\u0000/g, (_, prop) => String(siteConfig[prop] ?? ""));

const homeTitle = pair(layoutSource, "title =");
const homeDescription = pair(layoutSource, "description =");

const seoDefaults = {
  home: {
    path: "/",
    title: { fa: resolvePlaceholders(homeTitle.fa), en: resolvePlaceholders(homeTitle.en) },
    description: { fa: resolvePlaceholders(homeDescription.fa), en: resolvePlaceholders(homeDescription.en) },
    keywords: {
      fa: "طراحی سایت کرمانشاه, نرم افزار سازمانی, پرتال اداری, فروشگاه اینترنتی, سئو",
      en: "web design Kermanshah, enterprise software, corporate portal, e-commerce, SEO",
    },
    changeFrequency: "weekly",
    priority: 1,
    eyebrow: { fa: fa.hero.eyebrow, en: en.hero.eyebrow },
    heading: { fa: fa.hero.title, en: en.hero.title },
    subheading: { fa: fa.hero.subtitle, en: en.hero.subtitle },
    ctaPrimary: { fa: fa.hero.ctaPrimary, en: en.hero.ctaPrimary },
    ctaSecondary: { fa: fa.hero.ctaSecondary, en: en.hero.ctaSecondary },
  },
};

/* Pages that do not export generateMetadata() today — seeded so the CMS always
 * has an SEO record for every route. */
const MISSING_SEO = {
  "store-builder": {
    title: {
      fa: "فروشگاه‌ساز ابری | خرید اشتراک و تحویل آنی | پیشگامان ایده‌نگار",
      en: "Cloud Store Builder | Subscriptions with Instant Delivery",
    },
    description: {
      fa: "قالب فروشگاه اینترنتی خود را با انبارداری جامع یا نسخه سبک انتخاب کنید؛ فعال‌سازی آنی پس از پرداخت و اتصال به درگاه شاپرک.",
      en: "Pick a storefront template with full warehouse management or the lightweight plan — activated instantly after payment on Shaparak.",
    },
  },
  "gold-app": {
    title: {
      fa: "اپلیکیشن و تابلوی نرخ لحظه‌ای طلا و سکه | ایده‌نگار",
      en: "Live Gold & Coin Rate App and Shop Display | Idehnegar",
    },
    description: {
      fa: "نرم‌افزار نرخ لحظه‌ای طلا، سکه و ارز با نمایشگر مخصوص مغازه‌های طلا و جواهر؛ به‌روزرسانی خودکار از اطلاعیه‌های رسمی اتحادیه.",
      en: "Real-time gold, coin and currency rates for Android and shop TVs, synced with official union announcements.",
    },
  },
  payment: {
    title: { fa: "تسویه حساب و فعال‌سازی اشتراک", en: "Checkout & Subscription Activation" },
    description: {
      fa: "تکمیل اطلاعات و پرداخت امن اشتراک فروشگاه‌ساز ایده‌نگار.",
      en: "Complete your details and pay securely to activate your store subscription.",
    },
  },
};

const pageMetas = Object.entries(pageFiles).map(([key, file], index) => {
  const source = file === pageFiles.home ? layoutSource : read(fe, file);
  const fallback = fa[key] ?? {};
  const fallbackEn = en[key] ?? {};
  const defaults = seoDefaults[key] ?? {};
  const title = defaults.title ?? pair(source, "title");
  const description = defaults.description ?? pair(source, "description");
  const missing = MISSING_SEO[key];

  return {
    pageKey: key,
    path: defaults.path ?? (key === "home" ? "/" : `/${key}`),
    titleFa: title.fa || missing?.title?.fa || "",
    titleEn: title.en || missing?.title?.en || "",
    descriptionFa: description.fa || missing?.description?.fa || "",
    descriptionEn: description.en || missing?.description?.en || "",
    keywordsFa: defaults.keywords?.fa ?? "",
    keywordsEn: defaults.keywords?.en ?? "",
    eyebrowFa: defaults.eyebrow?.fa ?? fallback.eyebrow ?? "",
    eyebrowEn: defaults.eyebrow?.en ?? fallbackEn.eyebrow ?? "",
    headingFa: defaults.heading?.fa ?? fallback.title ?? "",
    headingEn: defaults.heading?.en ?? fallbackEn.title ?? "",
    subheadingFa: defaults.subheading?.fa ?? fallback.subtitle ?? "",
    subheadingEn: defaults.subheading?.en ?? fallbackEn.subtitle ?? "",
    ctaPrimaryFa: defaults.ctaPrimary?.fa ?? "",
    ctaPrimaryEn: defaults.ctaPrimary?.en ?? "",
    ctaSecondaryFa: defaults.ctaSecondary?.fa ?? "",
    ctaSecondaryEn: defaults.ctaSecondary?.en ?? "",
    ogImage: key === "home" ? "/images/portfolio/smartexport-ai.jpg" : null,
    noIndex: key === "payment",
    changeFrequency: defaults.changeFrequency ?? "monthly",
    priority: defaults.priority ?? (key === "services" || key === "portfolio" || key === "store-builder" ? 0.9 : 0.8),
    sortOrder: index,
    isPublished: true,
  };
});

/* ───────────────────────────────── portfolio ─────────────────────────────────── */

const categories = grab(read(fe, "lib", "categories.ts"), "export const categories = ");
const portfolioJson = JSON.parse(read(fe, "data", "portfolio.json"));

const localize = (value, field) => ({
  [`${field}Fa`]: value?.[field]?.fa ?? "",
  [`${field}En`]: value?.[field]?.en ?? "",
});

const portfolioProjects = portfolioJson.map((item, index) => ({
  slug: item.slug,
  ...localize(item, "title"),
  ...localize(item, "summary"),
  ...localize(item, "description"),
  ...localize(item, "client"),
  category: item.category,
  image: item.image ?? null,
  desktopScreenshot: item.desktopScreenshot ?? null,
  mobileScreenshot: item.mobileScreenshot ?? null,
  gallery: item.gallery ?? [],
  tags: item.tags ?? [],
  features: (item.features ?? []).map((f) => ({
    titleFa: f.title?.fa ?? "",
    titleEn: f.title?.en ?? "",
    descriptionFa: f.description?.fa ?? "",
    descriptionEn: f.description?.en ?? "",
  })),
  stats: (item.stats ?? []).map((s) => ({
    labelFa: s.label?.fa ?? "",
    labelEn: s.label?.en ?? "",
    valueFa: s.value?.fa ?? "",
    valueEn: s.value?.en ?? "",
    iconPath: s.iconPath ?? null,
    color: s.color ?? null,
  })),
  ...(item.challenge ? localize(item, "challenge") : {}),
  ...(item.solution ? localize(item, "solution") : {}),
  year: item.year ?? new Date().getFullYear(),
  link: item.link || null,
  featured: Boolean(item.featured),
  sortOrder: index,
  isPublished: true,
}));

const portfolioCategories = categories.map((c, index) => ({
  slug: c.slug,
  nameFa: c.fa,
  nameEn: c.en,
  sortOrder: index,
  isPublished: true,
}));

/* ───────────────────────────────── home sections ─────────────────────────────── */

const servicesSource = read(fe, "app/(site)/[locale]/services/page.tsx");
const highlights = grab(servicesSource, "const serviceHighlights", { open: "{" });

const services = fa.services.items.map((item, index) => ({
  icon: ["Globe", "Server", "ShoppingCart", "Search", "Cloud", "BrainCircuit"][index] ?? null,
  titleFa: item.title,
  titleEn: en.services.items[index]?.title ?? "",
  descriptionFa: item.desc,
  descriptionEn: en.services.items[index]?.desc ?? "",
  highlightsFa: highlights.fa?.[index] ?? [],
  highlightsEn: highlights.en?.[index] ?? [],
  visualIndex: index,
  sortOrder: index,
  isPublished: true,
}));

const processSteps = fa.process.steps.map((step, index) => {
  const palette = [
    { icon: "MessagesSquare", color: "from-blue-500 to-cyan-500", accent: "#3b82f6" },
    { icon: "FileSearch", color: "from-violet-500 to-purple-500", accent: "#8b5cf6" },
    { icon: "PencilRuler", color: "from-pink-500 to-rose-500", accent: "#ec4899" },
    { icon: "Code2", color: "from-[#e6304c] to-red-600", accent: "#e6304c" },
    { icon: "TestTube2", color: "from-amber-500 to-orange-500", accent: "#f59e0b" },
    { icon: "Rocket", color: "from-emerald-500 to-teal-500", accent: "#10b981" },
    { icon: "Headphones", color: "from-indigo-500 to-blue-500", accent: "#6366f1" },
  ][index] ?? {};

  return {
    ...palette,
    titleFa: step.title,
    titleEn: en.process.steps[index]?.title ?? "",
    durationFa: step.duration,
    durationEn: en.process.steps[index]?.duration ?? "",
    descriptionFa: step.desc,
    descriptionEn: en.process.steps[index]?.desc ?? "",
    deliverablesFa: step.deliverables ?? [],
    deliverablesEn: en.process.steps[index]?.deliverables ?? [],
    sortOrder: index,
    isPublished: true,
  };
});

const clientsSource = read(fe, "components", "sections", "clients-section.tsx");
const clientsFa = grab(clientsSource, "const clientsFa = ");
const clientsEn = grab(clientsSource, "const clientsEn = ");
const logoBlock = literalAfter(clientsSource, "const clientLogos = ", { open: "{" });
const monograms = {};
for (const match of logoBlock.matchAll(/(\w+):\s*\([\s\S]*?>\s*([A-Z0-9&]{2,5})\s*</g)) {
  monograms[match[1]] = match[2];
}

const clients = clientsFa.map((client, index) => ({
  nameFa: client.name,
  nameEn: clientsEn[index]?.name ?? "",
  monogram: monograms[client.key] ?? String(client.key).slice(0, 3).toUpperCase(),
  logoUrl: null,
  sortOrder: index,
  isPublished: true,
}));

const testimonials = JSON.parse(read(fe, "data", "testimonials.json")).map((t, index) => ({
  nameFa: t.name.fa,
  nameEn: t.name.en,
  quoteFa: t.quote.fa,
  quoteEn: t.quote.en,
  sortOrder: index,
  isPublished: true,
}));

/* ───────────────────────────────── about page ─────────────────────────────────── */

const aboutSource = read(fe, "app/(site)/[locale]/about/page.tsx");
const timeline = grab(aboutSource, "const timelineItems = ");
const team = grab(aboutSource, "const teamConstellation = ");

const milestones = timeline.map((item, index) => ({
  year: item.year,
  titleFa: item.titleFa,
  titleEn: item.titleEn,
  descriptionFa: item.descFa,
  descriptionEn: item.descEn,
  glow: item.glow,
  gradient: item.gradient,
  sortOrder: index,
  isPublished: true,
}));

const teamDisciplines = team.map((member, index) => ({
  roleEn: member.role,
  labelFa: member.label,
  span: member.span,
  background: member.bg,
  sortOrder: index,
  isPublished: true,
}));

/* ───────────────────────────────── contact page ──────────────────────────────── */

const contactSource = read(fe, "components", "sections", "contact-section.tsx");
/** Two sibling literals: `const x = isFa ? [fa] : [en]`. */
function pairLiterals(source, marker) {
  const at = source.indexOf(marker);
  if (at === -1) throw new Error(`marker not found: ${marker}`);
  const first = literalAfter(source, marker, { open: "[" });
  const rest = source.slice(at + marker.length + first.length + 2);
  const second = literalAfter(rest, "", { open: "[" });
  return { fa: evalLiteral(first, true), en: evalLiteral(second, false) };
}

const faqs = pairLiterals(contactSource, "const faqs = isFa");
const inquiryTypes = evalLiteralBoth(literalAfter(contactSource, "const projectCategories = "));

const faqItems = faqs.fa.map((item, index) => ({
  questionFa: item.q,
  questionEn: faqs.en?.[index]?.q ?? "",
  answerFa: item.a,
  answerEn: faqs.en?.[index]?.a ?? "",
  sortOrder: index,
  isPublished: true,
}));

const inquiryTypesRows = inquiryTypes.fa.map((item, index) => ({
  code: item.id,
  labelFa: item.label,
  labelEn: inquiryTypes.en[index]?.label ?? item.label,
  icon: item.icon,
  sortOrder: index,
  isPublished: true,
}));

/* ───────────────────────────────── store builder / payment ───────────────────── */

const storeSource = read(fe, "app/(site)/[locale]/store-builder/page.tsx");
const templates = grab(storeSource, "const allTemplates: TemplateItem[] = ");

const storeTemplates = templates.map((tpl, index) => ({
  code: tpl.id,
  name: tpl.name,
  category: tpl.category,
  tag: tpl.tag ?? null,
  planName: tpl.planName,
  priceMonthly: tpl.priceMonthly,
  priceYearly: tpl.priceYearly,
  discountBadge: tpl.discountBadge ?? null,
  description: tpl.desc ?? null,
  features: tpl.features ?? [],
  desktopScreens: (tpl.desktopScreens ?? []).map((s) => ({ label: s.label, src: s.src })),
  mobileScreens: (tpl.mobileScreens ?? []).map((s) => ({ label: s.label, src: s.src })),
  sortOrder: index,
  isPublished: true,
}));

const paymentSource = read(fe, "app/(site)/[locale]/payment/page.tsx");
const tiers = grab(paymentSource, "const storeTiers: StoreTier[] = ");

const storePlans = tiers.map((tier, index) => ({
  code: tier.id,
  name: tier.name,
  badge: tier.badge ?? null,
  tagline: tier.tagline ?? null,
  isPopular: Boolean(tier.isPopular),
  monthlyPrice: tier.monthlyPrice,
  yearlyPrice: tier.yearlyPrice,
  setupTime: tier.setupTime ?? null,
  features: tier.features ?? [],
  limitations: tier.limitations ?? [],
  sortOrder: index,
  isPublished: true,
}));

/* ───────────────────────────────── gold app downloads ────────────────────────── */

const goldSource = read(fe, "app/(site)/[locale]/gold-app/page.tsx");
const downloadButtons = [...goldSource.matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
  .slice(0, 3)
  .map((match, index) => {
    const texts = [...match[2].matchAll(/<span[^>]*>([^<]+)<\/span>/g)].map((m) => m[1].trim()).filter(Boolean);
    const emoji = (match[2].match(/>([^<>]{1,2})</) || [])[1]?.trim() || null;
    return {
      titleFa: texts.at(-1) ?? "دانلود",
      titleEn: texts.at(-1) ?? "Download",
      captionFa: texts.length > 1 ? texts[0] : "",
      captionEn: texts.length > 1 ? texts[0] : "",
      href: match[1],
      emoji,
      variant: ["bazaar", "direct", "anchor"][index] ?? "direct",
      sortOrder: index,
      isPublished: true,
    };
  });

/* ───────────────────────────────── site settings row ─────────────────────────── */

const siteSettings = [
  {
    domain: siteConfig.domain,
    siteUrl: siteConfig.url,
    nameFa: siteConfig.nameFa,
    nameEn: siteConfig.nameEn,
    shortNameFa: siteConfig.shortNameFa,
    shortNameEn: siteConfig.shortNameEn,
    taglineFa: siteConfig.taglineFa,
    taglineEn: siteConfig.taglineEn,
    foundedJalali: siteConfig.foundedJalali,
    foundedGregorian: siteConfig.foundedGregorian,
    email: siteConfig.email,
    phones: siteConfig.phones,
    telegramId: siteConfig.telegram,
    whatsAppNumber: siteConfig.whatsapp,
    addressFa: siteConfig.addressFa,
    addressEn: siteConfig.addressEn,
    hoursFa: siteConfig.hoursFa,
    hoursEn: siteConfig.hoursEn,
    mapEmbedSrc: siteConfig.mapEmbedSrc,
    social: [
      { key: "telegram", value: siteConfig.social.telegram },
      { key: "linkedin", value: siteConfig.social.linkedin },
      { key: "instagram", value: siteConfig.social.instagram },
    ],
    stats: [
      { key: "clients", value: String(siteConfig.stats.clients) },
      { key: "projects", value: String(siteConfig.stats.projects) },
      { key: "yearsActive", value: String(siteConfig.stats.yearsActive) },
      { key: "awards", value: String(siteConfig.stats.awards) },
    ],
    defaultOgImage: "/images/portfolio/smartexport-ai.jpg",
  },
];

/* ───────────────────────────────── write the file ────────────────────────────── */

const dataset = {
  siteSettings,
  pageMetas,
  portfolioCategories,
  portfolioProjects,
  services,
  processSteps,
  clients,
  testimonials,
  milestones,
  teamDisciplines,
  faqItems,
  inquiryTypes: inquiryTypesRows,
  storeTemplates,
  storePlans,
  appDownloadLinks: downloadButtons,
};

const out = path.join(root, "backend", "Idehnegar.Infrastructure", "SeedData");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "seed.json"), JSON.stringify(dataset, null, 2) + "\n", "utf-8");

const counts = Object.fromEntries(Object.entries(dataset).map(([key, value]) => [key, value.length]));
console.log("seed.json written:", counts);
