import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { fetchCmsJson, getCmsApiBaseUrl, type CmsEntry } from "@/lib/cms";

export type LocalizedText = { fa: string; en: string };

export interface PortfolioItem {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  description: Record<string, string>;
  category: string;
  image: string;
  featured: boolean;
  desktopScreenshot?: string;
  mobileScreenshot?: string;
  gallery?: string[];
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
  challenge?: Record<string, string>;
  solution?: Record<string, string>;
  client: Record<string, string>;
  year: number;
  tags?: string[];
  link?: string;
  canonicalFa?: string;
  canonicalEn?: string;
}

const DATA_FILE = path.join(process.cwd(), "src", "data", "portfolio.json");

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {};
}

function bilingual(existing: unknown, fa: string | null | undefined, en: string | null | undefined): Record<string, string> {
  const source = asRecord(existing);
  return {
    fa: fa ?? String(source.fa ?? ""),
    en: en ?? String(source.en ?? ""),
  };
}

function mapCmsPortfolio(faEntry: CmsEntry, enEntry?: CmsEntry): PortfolioItem {
  const raw = asRecord(faEntry.shared);
  const fallback = asRecord(faEntry.data);
  const title = bilingual(raw.title ?? fallback.title, faEntry.title, enEntry?.title);
  const summary = bilingual(raw.summary ?? fallback.summary, faEntry.summary, enEntry?.summary);
  const description = bilingual(raw.description ?? fallback.description, faEntry.body, enEntry?.body);
  const client = bilingual(raw.client ?? fallback.client, null, null);
  const slug = faEntry.slug ?? String(raw.slug ?? "");

  return {
    ...(raw as unknown as PortfolioItem),
    slug,
    title,
    summary,
    description,
    category: String(raw.category ?? fallback.category ?? "website"),
    image: faEntry.imagePath ?? String(raw.image ?? fallback.image ?? ""),
    featured: faEntry.isFeatured,
    client,
    year: Number(raw.year ?? fallback.year ?? 0),
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === "string") : [],
    link: typeof raw.link === "string" ? raw.link : "",
    canonicalFa: faEntry.canonicalUrl ?? undefined,
    canonicalEn: enEntry?.canonicalUrl ?? undefined,
  };
}

async function getCmsPortfolioItems(): Promise<PortfolioItem[] | null> {
  if (!getCmsApiBaseUrl()) return null;
  const [faEntries, enEntries] = await Promise.all([
    fetchCmsJson<CmsEntry[]>("/portfolio?locale=fa&limit=300"),
    fetchCmsJson<CmsEntry[]>("/portfolio?locale=en&limit=300"),
  ]);
  if (!faEntries || !enEntries) return null;

  const englishByKey = new Map(enEntries.map((entry) => [entry.key, entry]));
  return faEntries.map((entry) => mapCmsPortfolio(entry, englishByKey.get(entry.key)));
}

/** Reads from the CMS when configured and falls back to the original JSON seed. */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const cmsItems = await getCmsPortfolioItems();
  if (cmsItems) return cmsItems;

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PortfolioItem[];
  } catch (err) {
    console.error("Failed to read portfolio.json", err);
    return [];
  }
}

export async function getPortfolioItem(slug: string): Promise<PortfolioItem | undefined> {
  const items = await getPortfolioItems();
  return items.find((item) => item.slug === slug);
}

export async function getFeaturedPortfolioItems(limit = 6): Promise<PortfolioItem[]> {
  const items = await getPortfolioItems();
  return items.filter((item) => item.featured).slice(0, limit);
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
