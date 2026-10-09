// Central place for company facts. Edit here to update contact info,
// social links, and stats site-wide.

export const siteConfig = {
  domain: "idehnegar.co",
  url: "https://idehnegar.co",
  nameFa: "پیشگامان ایده‌نگار",
  nameEn: "Idehnegar Pioneers",
  shortNameFa: "ایده‌نگار",
  shortNameEn: "Idehnegar",
  taglineFa: "شرکت دانش‌بنیان توسعه نرم‌افزار و تحول دیجیتال",
  taglineEn: "Knowledge-Based Software & Digital Transformation Company",
  foundedJalali: 1389,
  foundedGregorian: 2010,
  email: "info@idehnegar.co",
  phones: ["083-38254060", "083-38100506"],
  telegram: "09034120744",
  whatsapp: "989034120744",
  addressFa:
    "کرمانشاه، سه‌راه ۲۲ بهمن، برج فناوری، طبقه هفتم، واحد ۱۱",
  addressEn:
    "7th Floor, Unit 11, Fanavari Tower, 22 Bahman Intersection, Kermanshah, Iran",
  hoursFa: "شنبه تا چهارشنبه ۹ الی ۱۷ - پنجشنبه ۹ الی ۱۳",
  hoursEn: "Sat–Wed 9:00–17:00, Thu 9:00–13:00",
  mapEmbedSrc:
    "https://www.openstreetmap.org/export/embed.html?bbox=47.045%2C34.305%2C47.075%2C34.325&layer=mapnik&marker=34.315%2C47.06",
  social: {
    telegram: "https://t.me/idehnegar",
    linkedin: "https://www.linkedin.com/company/idehnegar",
    instagram: "https://instagram.com/idehnegar",
  },
  stats: {
    clients: 65,
    projects: 326,
    yearsActive: 15,
    awards: 15,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export interface LocalizedSiteConfig {
  domain: string;
  url: string;
  name: string;
  alternateName: string;
  shortName: string;
  tagline: string;
  foundedJalali: number;
  foundedGregorian: number;
  email: string;
  phones: string[];
  telegram: string;
  whatsapp: string;
  address: string;
  hours: string;
  mapEmbedSrc: string;
  social: { telegram: string; linkedin: string; instagram: string };
  stats: { clients: number; projects: number; yearsActive: number; awards: number };
}

export function getSiteConfigForLocale(locale: "fa" | "en"): LocalizedSiteConfig {
  return {
    domain: siteConfig.domain,
    url: siteConfig.url,
    name: locale === "fa" ? siteConfig.nameFa : siteConfig.nameEn,
    alternateName: locale === "fa" ? siteConfig.nameEn : siteConfig.nameFa,
    shortName: locale === "fa" ? siteConfig.shortNameFa : siteConfig.shortNameEn,
    tagline: locale === "fa" ? siteConfig.taglineFa : siteConfig.taglineEn,
    foundedJalali: siteConfig.foundedJalali,
    foundedGregorian: siteConfig.foundedGregorian,
    email: siteConfig.email,
    phones: [...siteConfig.phones],
    telegram: siteConfig.telegram,
    whatsapp: siteConfig.whatsapp,
    address: locale === "fa" ? siteConfig.addressFa : siteConfig.addressEn,
    hours: locale === "fa" ? siteConfig.hoursFa : siteConfig.hoursEn,
    mapEmbedSrc: siteConfig.mapEmbedSrc,
    social: { ...siteConfig.social },
    stats: { ...siteConfig.stats },
  };
}
