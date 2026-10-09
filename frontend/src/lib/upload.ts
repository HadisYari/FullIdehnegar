import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "portfolio");
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveUploadedImage(file: File, slugHint: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("فقط فایل تصویر JPG، PNG یا WebP مجاز است.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("حجم تصویر نباید بیشتر از ۸ مگابایت باشد.");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const safeSlug = slugHint.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "project";
  const uniqueId = crypto.randomBytes(4).toString("hex");
  const filename = `${safeSlug}-${uniqueId}.jpg`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await sharp(buffer)
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(filePath);

  return `/uploads/portfolio/${filename}`;
}

export async function deleteUploadedImage(publicPath: string): Promise<void> {
  if (!publicPath.startsWith("/uploads/portfolio/")) return; // never delete seed images in /images
  const filePath = path.join(process.cwd(), "public", publicPath);
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore missing file
  }
}
