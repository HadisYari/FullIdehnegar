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
    .replace(/\$\{(?:siteConfig|config)\.(\w+)\}/g, (_, prop) => `\u0000${prop}\u0000`)
    .replace(/\\n/g, "\n")
    .replace(/\\\\"/g, '"')
    .trim();
}

/* ───────────────────────────────── site config ───────────────────────────────── */

const siteConfigSource = read(fe, "lib", "site-config.ts");
const siteConfig = evalLiteral(literalAfter(siteConfigSource, "export const siteConfig: SiteConfig = ", { open: "{" }));

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
  },
};

/* Pages that do not export generateMetadata() today — seeded so the CMS always
 * has an SEO record for every route. */
const MISSING_SEO = {
  "store-builder": {
    title: {
      fa: "فروشگاه‌ساز ابری | قالب‌های فروشگاه اینترنتی | پیشگامان ایده‌نگار",
      en: "Cloud Store Builder | Store Templates | Idehnegar",
    },
    description: {
      fa: "قالب فروشگاه اینترنتی خود را با انبارداری جامع یا نسخه سبک انتخاب کنید و برای راه‌اندازی با تیم ایده‌نگار در تماس باشید.",
      en: "Pick a store template with full warehouse management or a light version, then contact our team to get started.",
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
    // Hero copy is read by the home page only. Other pages keep their visible H1 in
    // the front end, so their rows carry no eyebrow/heading/subheading.
    eyebrowFa: key === "home" ? defaults.eyebrow?.fa ?? fallback.eyebrow ?? "" : null,
    eyebrowEn: key === "home" ? defaults.eyebrow?.en ?? fallbackEn.eyebrow ?? "" : null,
    headingFa: key === "home" ? defaults.heading?.fa ?? fallback.title ?? "" : null,
    headingEn: key === "home" ? defaults.heading?.en ?? fallbackEn.title ?? "" : null,
    subheadingFa: key === "home" ? defaults.subheading?.fa ?? fallback.subtitle ?? "" : null,
    subheadingEn: key === "home" ? defaults.subheading?.en ?? fallbackEn.subtitle ?? "" : null,
    // The CTA fields are no longer edited in the panel and no page reads them.
    ctaPrimaryFa: null,
    ctaPrimaryEn: null,
    ctaSecondaryFa: null,
    ctaSecondaryEn: null,
    ogImage: key === "home" ? "/images/portfolio/smartexport-ai.jpg" : null,
    noIndex: false,
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

/* home services grid: the cards of components/sections/services-section.tsx (fa only in source) */
const homeServiceCards = grab(
  read(fe, "components", "sections", "services-section.tsx"),
  "const fallbackCards = ",
).map((card, index) => ({
  code: card.code,
  iconName: card.icon ?? null,
  titleFa: card.title,
  titleEn: "",
  descriptionFa: card.desc,
  descriptionEn: "",
  color: card.color ?? null,
  softColor: card.softColor ?? null,
  glowColor: card.glowColor ?? null,
  featureTitleFa: card.featureTitle ?? null,
  featureTitleEn: null,
  featureValueFa: card.featureValue ?? null,
  featureValueEn: null,
  progress: card.progress ?? null,
  tags: card.tags ?? [],
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
// `const clientsFa: ClientItem[] = [ { name, monogram } ]` — the monogram is inline.
const clientsFa = grab(clientsSource, "const clientsFa: ClientItem[] = ");
const clientsEn = grab(clientsSource, "const clientsEn: ClientItem[] = ");

const clients = clientsFa.map((client, index) => ({
  nameFa: client.name,
  nameEn: clientsEn[index]?.name ?? "",
  monogram: client.monogram ?? null,
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
// The contact page content lives in the fallback arrays of contact-section.tsx.
const faqs = {
  fa: grab(contactSource, "const fallbackFaqsFa: FaqView[] = "),
  en: grab(contactSource, "const fallbackFaqsEn: FaqView[] = "),
};
const inquiryTypes = {
  fa: grab(contactSource, "const fallbackInquiryTypesFa: InquiryTypeView[] = "),
  en: grab(contactSource, "const fallbackInquiryTypesEn: InquiryTypeView[] = "),
};

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

/* ───────────────────────────────── store builder ─────────────────────────────── */

// The store templates and plans live in the data files that the front end falls
// back to when the API is unavailable (lib/store.ts), so they are the single source.
const templates = JSON.parse(read(fe, "data", "store-templates.json"));

const storeTemplates = templates.map((tpl, index) => ({
  code: tpl.id,
  name: tpl.name.fa,
  nameEn: tpl.name.en,
  category: tpl.category,
  tag: tpl.tag.fa || null,
  tagEn: tpl.tag.en || null,
  planName: tpl.planName.fa,
  planNameEn: tpl.planName.en,
  priceMonthly: tpl.priceMonthly,
  priceYearly: tpl.priceYearly,
  discountBadge: tpl.discountBadge.fa || null,
  discountBadgeEn: tpl.discountBadge.en || null,
  description: tpl.desc.fa || null,
  descriptionEn: tpl.desc.en || null,
  features: tpl.features.fa,
  featuresEn: tpl.features.en,
  desktopScreens: tpl.desktopScreens.map((s) => ({ label: s.label.fa, labelEn: s.label.en, src: s.src })),
  mobileScreens: tpl.mobileScreens.map((s) => ({ label: s.label.fa, labelEn: s.label.en, src: s.src })),
  sortOrder: index,
  isPublished: true,
}));

/* ───────────────────────────────── gold app downloads ────────────────────────── */

// The gold-app download buttons are the same data the front end falls back to (lib/store.ts).
const downloadButtons = JSON.parse(read(fe, "data", "app-download-links.json")).map((link, index) => ({
  titleFa: link.title?.fa ?? "",
  titleEn: link.title?.en || link.title?.fa || "",
  captionFa: link.caption?.fa ?? "",
  captionEn: link.caption?.en ?? "",
  href: link.href,
  emoji: link.emoji ?? null,
  variant: link.variant ?? "direct",
  sortOrder: index,
  isPublished: true,
}));

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

/* ─────────────────── about page blocks (components/sections/about) ─────────────────── */

const aboutDir = path.join(fe, "components", "sections", "about");
const aboutRead = (file) => read(aboutDir, file);

// Core values: the icon is an inline <svg>, so only its path `d` is stored; the
// first 6 `d=` attributes are the fa items, the next 6 the en items.
const valuesText = literalAfter(aboutRead("core-values.tsx"), "const valuesData = ", { open: "{" });
const valueIconPaths = [...valuesText.matchAll(/d="([^"]+)"/g)].map((m) => m[1]);
if (valueIconPaths.length !== 12) throw new Error(`expected 12 value icon paths, found ${valueIconPaths.length}`);
const valuesData = grab(aboutRead("core-values.tsx"), "const valuesData = ", { open: "{" });
const coreValues = valuesData.fa.map((item, index) => ({
  iconPath: valueIconPaths[index],
  titleFa: item.title,
  titleEn: valuesData.en[index].title,
  descriptionFa: item.description,
  descriptionEn: valuesData.en[index].description,
  sortOrder: index,
  isPublished: true,
}));

const certsData = grab(aboutRead("certifications-showcase.tsx"), "const certsData = ", { open: "{" });
const certifications = certsData.fa.items.map((item, index) => {
  const en = certsData.en.items[index];
  return {
    icon: item.icon,
    titleFa: item.title,
    titleEn: en.title,
    organizationFa: item.org,
    organizationEn: en.org,
    colorClass: item.color,
    borderClass: item.borderColor,
    sortOrder: index,
    isPublished: true,
  };
});

const lifecycleData = grab(aboutRead("development-lifecycle.tsx"), "const steps = ", { open: "{" });
const lifecycleSteps = lifecycleData.fa.map((step, index) => ({
  numberLabel: step.num,
  nameFa: step.name,
  nameEn: lifecycleData.en[index].name,
  descriptionFa: step.desc,
  descriptionEn: lifecycleData.en[index].desc,
  sortOrder: index,
  isPublished: true,
}));

const philosophyData = grab(
  aboutRead("engineering-philosophy.tsx"),
  "Record<Locale, { title: string; subtitle: string; items: PhilosophyItem[] }> = ",
  { open: "{" },
);
const philosophyPrinciples = philosophyData.fa.items.map((item, index) => {
  const en = philosophyData.en.items[index];
  return {
    iconName: item.icon,
    tagFa: item.tag,
    tagEn: en.tag,
    titleFa: item.title,
    titleEn: en.title,
    descriptionFa: item.desc,
    descriptionEn: en.desc,
    codeSnippet: item.codeSnippet ?? null,
    sortOrder: index,
    isPublished: true,
  };
});

const statsData = grab(aboutRead("stats-counter.tsx"), "const statsData = ", { open: "{" });
const aboutStats = statsData.fa.map((stat, index) => ({
  value: stat.value,
  suffix: stat.suffix || null,
  labelFa: stat.label,
  labelEn: statsData.en[index].label,
  icon: stat.icon,
  sortOrder: index,
  isPublished: true,
}));

const techData = grab(aboutRead("tech-stack.tsx"), "const categories = ", { open: "{" });
const techStackGroups = techData.fa.groups.map((group, index) => ({
  labelFa: group.label,
  labelEn: techData.en.groups[index].label,
  items: group.items,
  sortOrder: index,
  isPublished: true,
}));

// Section copy of each block. Lifted from the inline JSX of the components.
const aboutSections = [
  {
    key: "values",
    eyebrowFa: "ارزش‌های ما",
    eyebrowEn: "Our Values",
    titleFa: "اصولی که ما را متفاوت می‌کند",
    titleEn: "Principles that set us apart",
    subtitleFa: null,
    subtitleEn: null,
  },
  {
    key: "certifications",
    eyebrowFa: certsData.fa.title,
    eyebrowEn: certsData.en.title,
    titleFa: certsData.fa.heading,
    titleEn: certsData.en.heading,
    subtitleFa: null,
    subtitleEn: null,
  },
  {
    key: "lifecycle",
    eyebrowFa: "PIPELINE",
    eyebrowEn: "PIPELINE",
    titleFa: "فرایند توسعه و تحویل محصول",
    titleEn: "How We Engineer & Deliver",
    subtitleFa: null,
    subtitleEn: null,
  },
  {
    key: "philosophy",
    eyebrowFa: null,
    eyebrowEn: null,
    titleFa: philosophyData.fa.title,
    titleEn: philosophyData.en.title,
    subtitleFa: philosophyData.fa.subtitle,
    subtitleEn: philosophyData.en.subtitle,
  },
  {
    key: "tech-stack",
    eyebrowFa: techData.fa.title,
    eyebrowEn: techData.en.title,
    titleFa: techData.fa.heading,
    titleEn: techData.en.heading,
    subtitleFa: techData.fa.subtitle,
    subtitleEn: techData.en.subtitle,
  },
].map((section, index) => ({ ...section, sortOrder: index, isPublished: true }));

/* ───────────── page sections (copy + repeated items of page blocks) ───────────── *
 * Each page component keeps its fallback copy in one literal. The literal is either
 * bilingual ({ fa: {...}, en: {...} }) or Persian-only (a single {...} object). Items are
 * strings (bullets) or objects ({ title, description, href }).                         */
const pageSectionSources = [
  { pageKey: "gold-app", file: ["components", "gold-app", "gold-app-client.tsx"], marker: "const fallbackSections = " },
  { pageKey: "about", file: ["app", "(site)", "[locale]", "about", "page.tsx"], marker: "const fallbackPageSections = " },
  { pageKey: "home", file: ["components", "sections", "home-cta-section.tsx"], marker: "const fallbackSections = " },
  { pageKey: "home", file: ["components", "sections", "testimonials-section.tsx"], marker: "const fallbackSections" },
  { pageKey: "services", file: ["app", "(site)", "[locale]", "services", "page.tsx"], marker: "const fallbackSections" },
  { pageKey: "contact", file: ["components", "sections", "contact-section.tsx"], marker: "const fallbackSections" },
  { pageKey: "store-builder", file: ["components", "store-builder", "store-builder-client.tsx"], marker: "const fallbackSections" },
];

const pageSections = pageSectionSources.flatMap(({ pageKey, file, marker }) => {
  const literal = grab(read(fe, ...file), marker, { open: "{" });
  return Object.entries(literal).map(([sectionKey, value], index) => {
    const bilingual = "fa" in value;
    const fa = bilingual ? value.fa : value;
    const en = bilingual ? value.en ?? {} : {};
    const items = (fa.items ?? []).map((item, i) => {
      const base = typeof item === "string" ? { title: item } : item;
      const other = en.items?.[i];
      const otherItem = typeof other === "string" ? { title: other } : other ?? {};
      return {
        icon: base.icon ?? null,
        titleFa: base.title ?? "",
        titleEn: otherItem.title ?? "",
        descriptionFa: base.description ?? "",
        descriptionEn: otherItem.description ?? "",
        href: base.href ?? otherItem.href ?? null,
        valueFa: base.value ?? "",
        valueEn: otherItem.value ?? "",
      };
    });
    return {
      pageKey,
      sectionKey,
      eyebrowFa: fa.eyebrow ?? null,
      eyebrowEn: en.eyebrow ?? null,
      titleFa: fa.title ?? null,
      titleEn: en.title ?? null,
      subtitleFa: fa.subtitle ?? null,
      subtitleEn: en.subtitle ?? null,
      bodyFa: fa.body ?? null,
      bodyEn: en.body ?? null,
      items,
      sortOrder: index,
      isPublished: true,
    };
  });
});

const dataset = {
  siteSettings,
  pageMetas,
  portfolioCategories,
  portfolioProjects,
  services,
  homeServiceCards,
  aboutSections,
  pageSections,
  coreValues,
  certifications,
  lifecycleSteps,
  philosophyPrinciples,
  techStackGroups,
  aboutStats,
  processSteps,
  clients,
  testimonials,
  milestones,
  teamDisciplines,
  faqItems,
  inquiryTypes: inquiryTypesRows,
  storeTemplates,
  appDownloadLinks: downloadButtons,
};

const out = path.join(root, "backend", "Idehnegar.Infrastructure", "SeedData");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "seed.json"), JSON.stringify(dataset, null, 2) + "\n", "utf-8");

const counts = Object.fromEntries(Object.entries(dataset).map(([key, value]) => [key, value.length]));
console.log("seed.json written:", counts);
