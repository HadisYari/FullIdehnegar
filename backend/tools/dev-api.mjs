#!/usr/bin/env node
/*
 * dev-api.mjs — استند-این API عمومی بک‌اند برای توسعهٔ فرانت‌اند
 * ---------------------------------------------------------------------------
 * وقتی SDK دات‌نت یا SQL Server در دسترس نیست (مثلاً در سندباکس توسعه)، این
 * سرور کوچک همان قرارداد `GET /api/public/*` بک‌اند ASP.NET را روی دادهٔ
 * seed.json (همان داده‌ای که بک‌اند واقعی در دیتابیس می‌کارد) پیاده‌سازی می‌کند
 * تا مسیر داینامیک فرانت قابل اجرا و آزمایش باشد.
 *
 * تبدیل entity → DTO دقیقاً مطابق ContentMapper.cs و JSON خروجی camelCase
 * (مثل JsonSerializerOptions در Program.cs) است.
 *
 *   node backend/tools/dev-api.mjs            # روی http://localhost:5100
 *   PORT=5200 node backend/tools/dev-api.mjs
 *
 * در محیط واقعی/پروداکشن به‌جای این فایل، خود پروژهٔ EndPoints را اجرا کنید:
 *   cd backend && dotnet run --project EndPoints
 * ---------------------------------------------------------------------------
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(here, "..", "Idehnegar.Infrastructure", "SeedData", "seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

const PORT = Number.parseInt(process.env.PORT ?? "5100", 10);

/* ───────────────────── helpers mirroring ContentMapper.cs ───────────────────── */

// LocalizedText(fa, en) — en falls back to fa like `Text()` in ContentMapper.
const text = (fa, en) => ({ fa: fa ?? "", en: en ?? fa ?? "" });
// OptionalText — null (→ omitted in JSON) when both sides are empty.
const optionalText = (fa, en) =>
  fa === null && en === null ? null : fa || en ? text(fa, en) : null;
const optional = (value) => (value === null || value === undefined || value === "" ? null : value);
const list = (value) => value ?? [];

/** JSON with `WhenWritingNull` semantics: drop null/undefined properties. */
function json(value) {
  return JSON.stringify(value, (_key, v) => (v === null || v === undefined ? undefined : v));
}

const nextId = () => crypto.randomUUID();

const settingsDto = () => {
  const s = seed.siteSettings[0];
  if (!s) return {};
  const social = Object.fromEntries((s.social ?? []).map((kv) => [kv.key.toLowerCase(), kv.value]));
  const stats = Object.fromEntries((s.stats ?? []).map((kv) => [kv.key, Number.parseInt(kv.value ?? "0", 10)]));
  return {
    domain: s.domain,
    siteUrl: (s.siteUrl ?? "").replace(/\/+$/, ""),
    name: text(s.nameFa, s.nameEn),
    shortName: text(s.shortNameFa, s.shortNameEn),
    tagline: text(s.taglineFa, s.taglineEn),
    foundedJalali: s.foundedJalali,
    foundedGregorian: s.foundedGregorian,
    email: s.email,
    phones: list(s.phones),
    telegram: optional(s.telegramId),
    whatsapp: optional(s.whatsAppNumber),
    address: text(s.addressFa, s.addressEn),
    hours: text(s.hoursFa, s.hoursEn),
    mapEmbedSrc: optional(s.mapEmbedSrc),
    social: {
      telegram: optional(social.telegram),
      linkedIn: optional(social.linkedin),
      instagram: optional(social.instagram),
    },
    stats: {
      clients: stats.clients ?? 0,
      projects: stats.projects ?? 0,
      yearsActive: stats.yearsActive ?? 0,
      awards: stats.awards ?? 0,
    },
    defaultOgImage: optional(s.defaultOgImage),
  };
};

const pageMetaDto = (p) => ({
  pageKey: p.pageKey,
  path: p.path,
  title: text(p.titleFa, p.titleEn),
  description: text(p.descriptionFa, p.descriptionEn),
  keywords: text(p.keywordsFa, p.keywordsEn),
  eyebrow: text(p.eyebrowFa, p.eyebrowEn),
  heading: text(p.headingFa, p.headingEn),
  subheading: text(p.subheadingFa, p.subheadingEn),
  ctaPrimary: text(p.ctaPrimaryFa, p.ctaPrimaryEn),
  ctaSecondary: text(p.ctaSecondaryFa, p.ctaSecondaryEn),
  ogImage: optional(p.ogImage),
  noIndex: Boolean(p.noIndex),
  changeFrequency: p.changeFrequency ?? "monthly",
  priority: p.priority ?? 0.8,
});

const sectionItemDto = (item) => ({
  icon: optional(item.icon),
  title: text(item.titleFa, item.titleEn),
  description: optionalText(item.descriptionFa, item.descriptionEn),
  href: optional(item.href),
  value: optionalText(item.valueFa, item.valueEn),
});

const sectionDto = (s) => ({
  key: s.sectionKey,
  eyebrow: optionalText(s.eyebrowFa, s.eyebrowEn),
  title: optionalText(s.titleFa, s.titleEn),
  subtitle: optionalText(s.subtitleFa, s.subtitleEn),
  body: optionalText(s.bodyFa, s.bodyEn),
  items: list(s.items).map(sectionItemDto),
});

const projectDto = (p) => ({
  slug: p.slug,
  title: text(p.titleFa, p.titleEn),
  summary: text(p.summaryFa, p.summaryEn),
  description: text(p.descriptionFa, p.descriptionEn),
  category: p.category,
  image: p.image ?? "",
  imageAlt: text(
    `${p.titleFa ?? ""}${p.clientFa ? ` — ${p.clientFa}` : ""}`,
    `${p.titleEn ?? p.titleFa ?? ""}${p.clientEn ?? p.clientFa ? ` — ${p.clientEn ?? p.clientFa}` : ""}`,
  ),
  featured: Boolean(p.featured),
  desktopScreenshot: optional(p.desktopScreenshot),
  mobileScreenshot: optional(p.mobileScreenshot),
  gallery: list(p.gallery),
  features: list(p.features).map((f) => ({ title: text(f.titleFa, f.titleEn), description: text(f.descriptionFa, f.descriptionEn) })),
  stats: list(p.stats).map((s) => ({
    label: text(s.labelFa, s.labelEn),
    value: text(s.valueFa, s.valueEn),
    iconPath: optional(s.iconPath),
    color: optional(s.color),
  })),
  challenge: p.challengeFa || p.challengeEn ? text(p.challengeFa, p.challengeEn) : null,
  solution: p.solutionFa || p.solutionEn ? text(p.solutionFa, p.solutionEn) : null,
  client: text(p.clientFa, p.clientEn),
  year: p.year,
  tags: list(p.tags),
  link: optional(p.link),
});

const serviceDto = (s) => ({
  id: nextId(),
  icon: optional(s.icon),
  title: text(s.titleFa, s.titleEn),
  desc: text(s.descriptionFa, s.descriptionEn),
  highlights: { fa: list(s.highlightsFa), en: list(s.highlightsEn) },
  visualIndex: s.visualIndex ?? 0,
});

const homeServiceCardDto = (c) => ({
  id: nextId(),
  code: c.code,
  icon: optional(c.iconName),
  title: text(c.titleFa, c.titleEn),
  desc: text(c.descriptionFa, c.descriptionEn),
  color: optional(c.color),
  softColor: optional(c.softColor),
  glowColor: optional(c.glowColor),
  featureTitle: c.featureTitleFa || c.featureTitleEn ? text(c.featureTitleFa, c.featureTitleEn) : null,
  featureValue: c.featureValueFa || c.featureValueEn ? text(c.featureValueFa, c.featureValueEn) : null,
  progress: optional(c.progress),
  tags: list(c.tags),
});

const processStepDto = (s) => ({
  id: nextId(),
  icon: optional(s.icon),
  color: optional(s.color),
  accent: optional(s.accent),
  title: text(s.titleFa, s.titleEn),
  duration: text(s.durationFa, s.durationEn),
  desc: text(s.descriptionFa, s.descriptionEn),
  deliverables: { fa: list(s.deliverablesFa), en: list(s.deliverablesEn) },
});

const aboutContentDto = () => ({
  sections: seed.aboutSections.map((s) => ({
    key: s.key,
    eyebrow: optionalText(s.eyebrowFa, s.eyebrowEn),
    title: text(s.titleFa, s.titleEn),
    subtitle: optionalText(s.subtitleFa, s.subtitleEn),
  })),
  coreValues: seed.coreValues.map((v) => ({
    id: nextId(),
    iconPath: optional(v.iconPath),
    title: text(v.titleFa, v.titleEn),
    desc: text(v.descriptionFa, v.descriptionEn),
  })),
  certifications: seed.certifications.map((c) => ({
    id: nextId(),
    icon: optional(c.icon),
    title: text(c.titleFa, c.titleEn),
    organization: text(c.organizationFa, c.organizationEn),
    colorClass: optional(c.colorClass),
    borderClass: optional(c.borderClass),
  })),
  lifecycleSteps: seed.lifecycleSteps.map((s) => ({
    id: nextId(),
    number: s.numberLabel,
    name: text(s.nameFa, s.nameEn),
    desc: text(s.descriptionFa, s.descriptionEn),
  })),
  philosophyPrinciples: seed.philosophyPrinciples.map((p) => ({
    id: nextId(),
    icon: optional(p.iconName),
    tag: text(p.tagFa, p.tagEn),
    title: text(p.titleFa, p.titleEn),
    desc: text(p.descriptionFa, p.descriptionEn),
    codeSnippet: optional(p.codeSnippet),
  })),
  techStackGroups: seed.techStackGroups.map((g) => ({
    id: nextId(),
    label: text(g.labelFa, g.labelEn),
    items: list(g.items),
  })),
  stats: seed.aboutStats.map((s) => ({
    id: nextId(),
    value: s.value,
    suffix: optional(s.suffix),
    label: text(s.labelFa, s.labelEn),
    icon: optional(s.icon),
  })),
});

const templateDto = (t) => ({
  id: t.code,
  name: text(t.name, t.nameEn),
  category: t.category ?? "warehouse",
  tag: text(t.tag, t.tagEn),
  planName: text(t.planName, t.planNameEn),
  priceMonthly: t.priceMonthly ?? 0,
  priceYearly: t.priceYearly ?? 0,
  discountBadge: text(t.discountBadge, t.discountBadgeEn),
  desc: text(t.description, t.descriptionEn),
  features: { fa: list(t.features), en: list(t.featuresEn) },
  desktopScreens: list(t.desktopScreens).map((s) => ({ label: text(s.label, s.labelEn), src: s.src })),
  mobileScreens: list(t.mobileScreens).map((s) => ({ label: text(s.label, s.labelEn), src: s.src })),
});

const published = (rows) => rows.filter((row) => row.isPublished !== false);
const ordered = (rows) => [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

/* ───────────────────────────── routes ───────────────────────────── */

const routes = {
  "GET /api/public/settings": () => settingsDto(),
  "GET /api/public/pages": () =>
    Object.fromEntries(ordered(published(seed.pageMetas)).map((p) => [p.pageKey, pageMetaDto(p)])),
  "GET /api/public/categories": () =>
    ordered(published(seed.portfolioCategories)).map((c) => ({ slug: c.slug, fa: c.nameFa, en: c.nameEn })),
  "GET /api/public/portfolio": (query) => {
    let rows = published(seed.portfolioProjects);
    if (query.get("category")) rows = rows.filter((p) => p.category === query.get("category"));
    if (query.get("featured")) rows = rows.filter((p) => Boolean(p.featured) === (query.get("featured") === "true"));
    const orderedRows = [...rows.filter((p) => p.featured), ...rows.filter((p) => !p.featured)];
    const take = Number.parseInt(query.get("take") ?? "0", 10);
    return (take > 0 ? orderedRows.slice(0, Math.min(take, 100)) : orderedRows).map(projectDto);
  },
  "GET /api/public/services": () => ordered(published(seed.services)).map(serviceDto),
  "GET /api/public/home-services": () => ordered(published(seed.homeServiceCards)).map(homeServiceCardDto),
  "GET /api/public/process-steps": () => ordered(published(seed.processSteps)).map(processStepDto),
  "GET /api/public/clients": () =>
    ordered(published(seed.clients)).map((c) => ({
      id: nextId(),
      name: text(c.nameFa, c.nameEn),
      monogram: optional(c.monogram),
      logoUrl: optional(c.logoUrl),
    })),
  "GET /api/public/testimonials": () =>
    ordered(published(seed.testimonials)).map((t) => ({
      id: nextId(),
      name: text(t.nameFa, t.nameEn),
      quote: text(t.quoteFa, t.quoteEn),
    })),
  "GET /api/public/milestones": () =>
    ordered(published(seed.milestones)).map((m) => ({
      year: m.year,
      title: text(m.titleFa, m.titleEn),
      desc: text(m.descriptionFa, m.descriptionEn),
      glow: optional(m.glow),
      gradient: optional(m.gradient),
    })),
  "GET /api/public/team": () =>
    ordered(published(seed.teamDisciplines)).map((m) => ({
      role: m.roleEn,
      label: m.labelFa,
      span: optional(m.span),
      bg: optional(m.background),
    })),
  "GET /api/public/faqs": () =>
    ordered(published(seed.faqItems)).map((f) => ({
      id: nextId(),
      question: text(f.questionFa, f.questionEn),
      answer: text(f.answerFa, f.answerEn),
    })),
  "GET /api/public/inquiry-types": () =>
    ordered(published(seed.inquiryTypes)).map((t) => ({
      id: t.code,
      label: text(t.labelFa, t.labelEn),
      icon: optional(t.icon),
    })),
  "GET /api/public/store-templates": (query) => {
    let rows = ordered(published(seed.storeTemplates));
    if (query.get("category")) rows = rows.filter((t) => t.category === query.get("category"));
    return rows.map(templateDto);
  },
  "GET /api/public/app-download-links": () =>
    ordered(published(seed.appDownloadLinks)).map((l) => ({
      title: text(l.titleFa, l.titleEn),
      caption: text(l.captionFa, l.captionEn),
      href: l.href ?? "#",
      emoji: optional(l.emoji),
      variant: optional(l.variant),
    })),
  "GET /api/public/about-content": () => aboutContentDto(),
  "GET /api/public/sitemap": () => {
    const pages = ordered(published(seed.pageMetas)).filter((p) => !p.noIndex);
    const projects = ordered(published(seed.portfolioProjects));
    return [
      ...pages.map((p) => ({ path: p.path, lastModified: null, changeFrequency: p.changeFrequency ?? "monthly", priority: p.priority ?? 0.5, noIndex: Boolean(p.noIndex) })),
      ...projects.map((p) => ({ path: `/portfolio/${p.slug}`, lastModified: null, changeFrequency: "yearly", priority: 0.6 })),
    ];
  },
  "GET /api/public/health": () => ({ status: "ok", database: "seed-dataset", source: "dev-api.mjs" }),
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const send = (status, body) => {
    res.writeHead(status, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
      "access-control-allow-origin": "*",
    });
    res.end(json(body));
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "Content-Type" });
    res.end();
    return;
  }

  const key = `${req.method} ${url.pathname.replace(/\/+$/, "") || "/"}`;

  // POST /api/public/contact — فقط پذیرش (ثبت در صندوق نمونه)
  if (req.method === "POST" && url.pathname === "/api/public/contact") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let parsed = {};
      try {
        parsed = JSON.parse(body || "{}");
      } catch {
        /* ignore */
      }
      console.log(`[dev-api] contact submitted: ${parsed.name ?? "?"} <${parsed.email ?? "?"}>`);
      send(202, { ok: true, id: nextId(), emailSent: false });
    });
    return;
  }

  // GET /api/public/pages/{key}
  if (req.method === "GET" && url.pathname.startsWith("/api/public/pages/")) {
    const pageKey = decodeURIComponent(url.pathname.slice("/api/public/pages/".length));
    console.log(`[dev-api] GET /api/public/pages/${pageKey}`);
    const page = published(seed.pageMetas).find((p) => p.pageKey === pageKey);
    return page ? send(200, pageMetaDto(page)) : send(404, { title: "Not Found" });
  }

  // GET /api/public/page-sections/{pageKey}
  if (req.method === "GET" && url.pathname.startsWith("/api/public/page-sections/")) {
    const pageKey = decodeURIComponent(url.pathname.slice("/api/public/page-sections/".length));
    console.log(`[dev-api] GET /api/public/page-sections/${pageKey}`);
    return send(200, ordered(published(seed.pageSections)).filter((s) => s.pageKey === pageKey).map(sectionDto));
  }

  // GET /api/public/portfolio/{slug} و /related
  if (req.method === "GET" && url.pathname.startsWith("/api/public/portfolio/")) {
    const rest = url.pathname.slice("/api/public/portfolio/".length);
    const [slugRaw, related] = rest.split("/");
    const slug = decodeURIComponent(slugRaw);
    console.log(`[dev-api] GET /api/public/portfolio/${slug}${related ? "/" + related : ""}`);
    const project = published(seed.portfolioProjects).find((p) => p.slug === slug);
    if (!project) return send(404, { title: "Not Found" });
    if (related === "related") {
      const take = Math.min(Number.parseInt(url.searchParams.get("take") ?? "3", 10) || 3, 12);
      const others = published(seed.portfolioProjects).filter((p) => p.slug !== slug);
      const sameCategory = others.filter((p) => p.category === project.category);
      const restRows = others.filter((p) => p.category !== project.category);
      return send(200, [...sameCategory, ...restRows].slice(0, take).map(projectDto));
    }
    return send(200, projectDto(project));
  }

  const handler = routes[key];
  if (handler) {
    console.log(`[dev-api] ${key}${url.search}`);
    return send(200, handler(url.searchParams));
  }

  console.warn(`[dev-api] 404 ${key}`);
  send(404, { title: "Not Found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`dev-api (seed stand-in) listening on http://localhost:${PORT} — ${seed.portfolioProjects.length} projects, ${seed.pageSections.length} page sections`);
});
