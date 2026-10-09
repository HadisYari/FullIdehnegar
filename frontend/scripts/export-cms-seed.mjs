import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(frontendRoot, "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

function loadTypeScriptModule(filePath) {
  const source = require("node:fs").readFileSync(filePath, "utf8");
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: filePath,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  const parseErrors = (diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
  if (parseErrors.length) {
    throw new Error(parseErrors.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("\n"));
  }

  const moduleObject = { exports: {} };
  const execute = new Function("exports", "require", "module", "__filename", "__dirname", outputText);
  execute(moduleObject.exports, require, moduleObject, filePath, path.dirname(filePath));
  return moduleObject.exports;
}

const { dictionaries } = loadTypeScriptModule(path.join(frontendRoot, "src/lib/i18n/dictionaries.ts"));
const { siteConfig } = loadTypeScriptModule(path.join(frontendRoot, "src/lib/site-config.ts"));
const { categories } = loadTypeScriptModule(path.join(frontendRoot, "src/lib/categories.ts"));
const portfolio = JSON.parse(await fs.readFile(path.join(frontendRoot, "src/data/portfolio.json"), "utf8"));
const testimonials = JSON.parse(await fs.readFile(path.join(frontendRoot, "src/data/testimonials.json"), "utf8"));

const settingsFor = (locale) => ({
  domain: siteConfig.domain,
  url: siteConfig.url,
  name: locale === "fa" ? siteConfig.nameFa : siteConfig.nameEn,
  alternateName: locale === "fa" ? siteConfig.nameEn : siteConfig.nameFa,
  shortName: locale === "fa" ? siteConfig.shortNameFa : siteConfig.shortNameEn,
  tagline: locale === "fa" ? siteConfig.taglineFa : siteConfig.taglineEn,
  foundedJalali: siteConfig.foundedJalali,
  foundedGregorian: siteConfig.foundedGregorian,
  email: siteConfig.email,
  phones: siteConfig.phones,
  telegram: siteConfig.telegram,
  whatsapp: siteConfig.whatsapp,
  address: locale === "fa" ? siteConfig.addressFa : siteConfig.addressEn,
  hours: locale === "fa" ? siteConfig.hoursFa : siteConfig.hoursEn,
  mapEmbedSrc: siteConfig.mapEmbedSrc,
  social: siteConfig.social,
  stats: siteConfig.stats,
});

const compactText = (value, max = 155) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const records = [
  {
    contentKey: "site:dictionary",
    contentType: "site",
    titleFa: "واژه‌نامه و متن‌های عمومی سایت",
    titleEn: "Website dictionary and shared copy",
    dataFa: dictionaries.fa,
    dataEn: dictionaries.en,
    shared: {},
    sortOrder: -100,
  },
  {
    contentKey: "site:settings",
    contentType: "site",
    titleFa: "تنظیمات شرکت و اطلاعات تماس",
    titleEn: "Company settings and contact information",
    dataFa: settingsFor("fa"),
    dataEn: settingsFor("en"),
    shared: siteConfig,
    sortOrder: -90,
  },
  {
    contentKey: "site:categories",
    contentType: "site",
    titleFa: "دسته‌بندی نمونه‌کارها",
    titleEn: "Portfolio categories",
    dataFa: categories,
    dataEn: categories,
    shared: categories,
    sortOrder: -80,
  },
];

const pages = [
  {
    key: "home", faPath: "/", enPath: "/en",
    faTitle: "پیشگامان ایده‌نگار | طراحی سایت و نرم‌افزار سازمانی در کرمانشاه",
    enTitle: "Idehnegar Pioneers | Web & Enterprise Software Development",
    faDescription: "شرکت دانش‌بنیان پیشگامان ایده‌نگار؛ طراحی وب‌سایت، پرتال سازمانی، فروشگاه اینترنتی و نرم‌افزار تحت وب با بیش از ۱۵ سال تجربه در کرمانشاه.",
    enDescription: "Idehnegar Pioneers is a certified knowledge-based company delivering websites, enterprise portals, online stores, and web software — 15+ years of experience.",
  },
  {
    key: "about", faPath: "/about", enPath: "/en/about",
    faTitle: "درباره ما | پیشگامان مهندسی نرم‌افزار ایده‌نگار",
    enTitle: "About Us | Idehnegar Software Studio",
    faDescription: "روایت ما در خلق پلتفرم‌های مقیاس‌پذیر، پرتال‌های سازمانی مدرن و همگرایی هنر دیزاین با مهندسی روز دنیا.",
    enDescription: "Our story of architecting resilient digital platforms, enterprise software, and human-centered design.",
  },
  {
    key: "services", faPath: "/services", enPath: "/en/services",
    faTitle: "معماری نرم‌افزار و پلتفرم‌های وب | استودیو ایده‌نگار",
    enTitle: "Web Platforms & Software Architecture | Ideh Negar",
    faDescription: "توسعه نرم‌افزارهای مدرن، پرتال‌های سازمانی، فروشگاه‌های آنلاین مقیاس‌پذیر و طراحی وب اختصاصی.",
    enDescription: "High-performance web applications, scalable enterprise platforms, and bespoke digital experiences.",
  },
  {
    key: "portfolio", faPath: "/portfolio", enPath: "/en/portfolio",
    faTitle: "نمونه‌کارها و پروژه‌های شاخص",
    enTitle: "Portfolio & Case Studies",
    faDescription: "پرتال‌های سازمانی، سامانه‌های نرم‌افزاری و وب‌سایت‌های اجرا شده توسط استودیو ایده‌نگار.",
    enDescription: "Enterprise portals, custom web systems, and digital platforms crafted by Idehnegar.",
  },
  {
    key: "contact", faPath: "/contact", enPath: "/en/contact",
    faTitle: "تماس با ما | پیشگامان ایده‌نگار",
    enTitle: "Contact Us | Idehnegar Studio",
    faDescription: "برای مشاوره فنی رایگان و برآورد پروژه نرم‌افزاری با تیم پیشگامان ایده‌نگار در تماس باشید.",
    enDescription: "Connect with the Idehnegar engineering team for architecture consultations and project roadmaps.",
  },
  {
    key: "store-builder", faPath: "/store-builder", enPath: "/en/store-builder",
    faTitle: "فروشگاه‌ساز ایده‌نگار | راه‌اندازی فروشگاه آنلاین",
    enTitle: "Idehnegar Store Builder | Launch an Online Store",
    faDescription: "پلن‌ها، امکانات و سرویس‌های فروشگاه‌ساز ایده‌نگار را مشاهده و برای راه‌اندازی فروشگاه آنلاین اقدام کنید.",
    enDescription: "Explore Idehnegar's online store plans, features, and services for launching your e-commerce business.",
  },
  {
    key: "payment", faPath: "/payment", enPath: "/en/payment",
    faTitle: "انتخاب پلن و پرداخت | فروشگاه‌ساز ایده‌نگار",
    enTitle: "Choose a Plan and Pay | Idehnegar Store Builder",
    faDescription: "انتخاب پلن فروشگاه‌ساز و ثبت درخواست راه‌اندازی فروشگاه اینترنتی.",
    enDescription: "Choose an online store plan and submit your setup request.",
  },
  {
    key: "gold-app", faPath: "/gold-app", enPath: "/en/gold-app",
    faTitle: "اپلیکیشن و تابلوی قیمت طلا | ایده‌نگار",
    enTitle: "Gold Price App and Digital Display | Idehnegar",
    faDescription: "معرفی اپلیکیشن طلا و جواهر و تابلوی دیجیتال نمایش قیمت برای طلافروشی‌ها.",
    enDescription: "Discover the Idehnegar gold and jewelry app and digital price display for gold retailers.",
  },
];

for (const [index, page] of pages.entries()) {
  records.push({
    contentKey: `page:${page.key}`,
    contentType: "page",
    slug: page.faPath,
    slugFa: page.faPath,
    slugEn: page.enPath,
    titleFa: page.faTitle,
    titleEn: page.enTitle,
    summaryFa: page.faDescription,
    summaryEn: page.enDescription,
    metaTitleFa: page.faTitle,
    metaTitleEn: page.enTitle,
    metaDescriptionFa: page.faDescription,
    metaDescriptionEn: page.enDescription,
    openGraphTitleFa: page.faTitle,
    openGraphTitleEn: page.enTitle,
    openGraphDescriptionFa: page.faDescription,
    openGraphDescriptionEn: page.enDescription,
    canonicalUrlFa: page.faPath,
    canonicalUrlEn: page.enPath,
    imagePath: "/images/portfolio/smartexport-ai.jpg",
    imageAltFa: page.faTitle,
    imageAltEn: page.enTitle,
    dataFa: { route: page.faPath, key: page.key },
    dataEn: { route: page.enPath, key: page.key },
    shared: {},
    sortOrder: index,
  });
}

for (const [index, item] of portfolio.entries()) {
  const slug = item.slug;
  records.push({
    contentKey: `portfolio:${slug}`,
    contentType: "portfolio",
    slug,
    slugFa: slug,
    slugEn: slug,
    titleFa: item.title?.fa ?? "",
    titleEn: item.title?.en ?? "",
    summaryFa: item.summary?.fa ?? "",
    summaryEn: item.summary?.en ?? "",
    bodyFa: item.description?.fa ?? "",
    bodyEn: item.description?.en ?? "",
    metaTitleFa: item.title?.fa ?? "",
    metaTitleEn: item.title?.en ?? "",
    metaDescriptionFa: compactText(item.summary?.fa),
    metaDescriptionEn: compactText(item.summary?.en),
    canonicalUrlFa: `/portfolio/${slug}`,
    canonicalUrlEn: `/en/portfolio/${slug}`,
    imagePath: item.image,
    imageAltFa: item.title?.fa ?? "",
    imageAltEn: item.title?.en ?? "",
    isPublished: true,
    isFeatured: Boolean(item.featured),
    dataFa: { ...item, locale: "fa" },
    dataEn: { ...item, locale: "en" },
    shared: item,
    sortOrder: index + 1,
  });
}

for (const [index, item] of testimonials.entries()) {
  records.push({
    contentKey: `testimonial:${String(index + 1).padStart(2, "0")}`,
    contentType: "testimonial",
    titleFa: item.name?.fa ?? "",
    titleEn: item.name?.en ?? "",
    summaryFa: item.quote?.fa ?? "",
    summaryEn: item.quote?.en ?? "",
    dataFa: { name: item.name?.fa ?? "", quote: item.quote?.fa ?? "" },
    dataEn: { name: item.name?.en ?? "", quote: item.quote?.en ?? "" },
    shared: item,
    sortOrder: index + 1,
  });
}

const outputFile = path.join(repositoryRoot, "backend/EndPoints/Seed/site-content.seed.json");
await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(records, null, 2)}\n`, "utf8");
console.log(`Exported ${records.length} idempotent CMS seed records to ${path.relative(repositoryRoot, outputFile)}`);
