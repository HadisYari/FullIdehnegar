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
