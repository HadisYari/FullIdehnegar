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
  loadStoreTemplates,
  type AppDownloadLinkDto,
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

/** لینک‌های دانلود اپلیکیشن — از /api/public/app-download-links یا فایل محلی. */
export async function getAppDownloadLinks(): Promise<AppDownloadLinkDto[]> {
  if (cmsEnabled) {
    const remote = await loadAppDownloadLinks();
    if (remote.length > 0) return remote;
  }
  return readLocal<AppDownloadLinkDto>("app-download-links.json");
}
