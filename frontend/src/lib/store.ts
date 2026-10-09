/**
 * lib/store.ts — لایهٔ خواندن داده‌های فروشگاه‌ساز و اپ طلا از بک‌اند (CMS)
 * با افتادگی به داده‌های همراه مخزن (src/data/*.json) تا سایت آفلاین هم
 * بالا بیاید. همان الگوی lib/portfolio.ts.
 */
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import {
  cmsEnabled,
  loadAppDownloadLinks,
  loadStorePlans,
  loadStoreTemplates,
  type AppDownloadLinkDto,
  type StorePlanDto,
  type StoreTemplateDto,
} from "./cms";

async function readLocal<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "src", "data", file), "utf-8");
    return JSON.parse(raw) as T[];
  } catch (err) {
    console.error(`Failed to read src/data/${file}`, err);
    return [];
  }
}

/** قالب‌های فروشگاه‌ساز — از /api/public/store-templates یا فایل محلی. */
export async function getStoreTemplates(): Promise<StoreTemplateDto[]> {
  if (cmsEnabled) {
    const remote = await loadStoreTemplates();
    if (remote.length > 0) return remote;
  }
  return readLocal<StoreTemplateDto>("store-templates.json");
}

/** پلن‌های اشتراک — از /api/public/store-plans یا فایل محلی. */
export async function getStorePlans(): Promise<StorePlanDto[]> {
  if (cmsEnabled) {
    const remote = await loadStorePlans();
    if (remote.length > 0) return remote;
  }
  return readLocal<StorePlanDto>("store-plans.json");
}

/** لینک‌های دانلود اپلیکیشن — از /api/public/app-download-links یا فایل محلی. */
export async function getAppDownloadLinks(): Promise<AppDownloadLinkDto[]> {
  if (cmsEnabled) {
    const remote = await loadAppDownloadLinks();
    if (remote.length > 0) return remote;
  }
  return readLocal<AppDownloadLinkDto>("app-download-links.json");
}

/* ────────────────────────── سفارش‌های فروشگاه (حالت آفلاین) ────────────────────────── */

export type LocalStoreOrder = {
  id: string;
  fullName: string;
  mobile: string;
  storeName: string;
  domain?: string;
  templateId?: string;
  plan?: string;
  cycle: string;
  amount: number;
  gateway: string;
  locale: string;
  createdAt: string;
  stored: "local";
};

const ORDERS_FILE = path.join(process.cwd(), "src", "data", "store-orders.json");

async function ensureFile() {
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]\n", "utf-8");
  }
}

/**
 * fallback ذخیرهٔ سفارش وقتی بک‌اند در دسترس نیست (همان الگوی messages.json).
 * در حالت آنلاین، بک‌اند خودش در SQL Server ذخیره می‌کند.
 */
export async function addLocalStoreOrder(order: LocalStoreOrder): Promise<void> {
  await ensureFile();
  let orders: LocalStoreOrder[] = [];
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    orders = JSON.parse(raw) as LocalStoreOrder[];
  } catch {
    orders = [];
  }
  orders.unshift(order);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2) + "\n", "utf-8");
}
