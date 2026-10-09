import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cmsEnabled, loadPortfolio, loadPortfolioItem, type PortfolioProjectDto } from "./cms";

export type LocalizedText = { fa: string; en: string };

 // lib/portfolio.ts - فیلدهای جدید به تایپ اضافه کنید
 export interface PortfolioItem {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  description: Record<string, string>;
  category: string;
  image: string;
  featured: boolean; // حفظ فیلد طبق درخواست

  // Screenshots & Visuals
  desktopScreenshot?: string;
  mobileScreenshot?: string;
  gallery?: string[];

  // Optional Data Fields (برای پروژه‌هایی که داده کمتری دارند)
  features?: {
    title: Record<string, string>;
    description: Record<string, string>;
  }[];
  stats?: {
    label: Record<string, string>;
    value: Record<string, string>;
    iconPath?: string;
    color?: string;
  }[];

  // Optional Tech-Driven Fields (جهت نمایش هویت مهندسی شرکت نرم‌افزاری)
  challenge?: Record<string, string>;
  solution?: Record<string, string>;

  // Base Info
  client: Record<string, string>;
  year: number;
  tags?: string[];
  link?: string;
}

const DATA_FILE = path.join(process.cwd(), "src", "data", "portfolio.json");

/** دادهٔ همراه مخزن: منبع پشتیبان وقتی بک‌اند در دسترس نیست. */
async function readLocalItems(): Promise<PortfolioItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PortfolioItem[];
  } catch (err) {
    console.error("Failed to read portfolio.json", err);
    return [];
  }
}

/**
 * آیتم‌های نمونه‌کار. با تنظیم CMS_API_URL از SQL Server خوانده می‌شوند
 * (هر ۶۰ ثانیه با ISR؛ پنل مدیریت پس از ذخیره کش را نامعتبر می‌کند) و اگر
 * سرویس پاسخ نداد، همان فایل محلی استفاده می‌شود تا سایت از کار نیفتد.
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!cmsEnabled) return readLocalItems();

  const remote: PortfolioProjectDto[] = await loadPortfolio(200);
  if (remote.length === 0) return readLocalItems();

  return remote as unknown as PortfolioItem[];
}

export async function getPortfolioItem(slug: string): Promise<PortfolioItem | undefined> {
  if (cmsEnabled) {
    const remote = await loadPortfolioItem(slug);
    if (remote) return remote as unknown as PortfolioItem;
  }

  const items = await readLocalItems();
  return items.find((i) => i.slug === slug);
}

/** پروژه‌های شاخص (featured) اول می‌آیند؛ بقیه به ترتیب پنل. */
export async function getFeaturedPortfolioItems(limit = 6): Promise<PortfolioItem[]> {
  const items = await getPortfolioItems();
  const featured = items.filter((i) => i.featured === true);
  const rest = items.filter((i) => i.featured !== true);
  return [...featured, ...rest].slice(0, limit);
}

export async function writePortfolioItems(items: PortfolioItem[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

export async function addPortfolioItem(item: PortfolioItem): Promise<void> {
  const items = await getPortfolioItems();
  items.unshift(item);
  await writePortfolioItems(items);
}

export async function updatePortfolioItem(slug: string, patch: Partial<PortfolioItem>): Promise<boolean> {
  const items = await getPortfolioItems();
  const idx = items.findIndex((i) => i.slug === slug);
  if (idx === -1) return false;
  items[idx] = { ...items[idx], ...patch, slug: items[idx].slug };
  await writePortfolioItems(items);
  return true;
}

export async function deletePortfolioItem(slug: string): Promise<boolean> {
  const items = await getPortfolioItems();
  const next = items.filter((i) => i.slug !== slug);
  if (next.length === items.length) return false;
  await writePortfolioItems(next);
  return true;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
