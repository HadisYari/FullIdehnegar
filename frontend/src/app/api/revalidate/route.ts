import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * نقطه‌ای که بک‌اند پس از هر ذخیره در پنل مدیریت صدا می‌زند
 * (SiteNotifier در EndPoints: POST { Site:RevalidateUrl } با بدنهٔ { secret, tags }).
 * فقط تگ‌های محتوایی شناخته‌شده پذیرفته می‌شوند تا هیچ مسیر داخلی باز نشود.
 */
const ALLOWED_TAGS = new Set([
  "settings",
  "pages",
  "home",
  "portfolio",
  "services",
  "about",
  "contact",
  "store",
  "payment",
  "gold-app",
  "sitemap",
]);

function authorized(request: NextRequest, bodySecret?: string): boolean {
  const secret = process.env.CMS_REVALIDATE_SECRET;
  if (!secret || secret.length < 8) return false;

  const header = request.headers.get("x-revalidate-secret");
  const query = request.nextUrl.searchParams.get("secret");
  const candidate = bodySecret ?? header ?? query;

  // مقایسهٔ پایدار در برابر زمان (جلوگیری از تایمینگ‌حملات)
  const a = Buffer.from(candidate ?? "");
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  let body: { secret?: string; tags?: string[]; paths?: string[] } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  if (!authorized(request, body.secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const tags = Array.isArray(body.tags) ? body.tags.filter((tag) => ALLOWED_TAGS.has(tag)) : [];
  const paths = Array.isArray(body.paths)
    ? body.paths.filter((path) => typeof path === "string" && path.startsWith("/"))
    : [];

  for (const tag of tags.length > 0 ? tags : [...ALLOWED_TAGS]) {
    // expire: 0 → کش فعلی بی‌درنگ منقضی می‌شود و صفحهٔ بعدی از بک‌اند ساخته می‌شود.
    revalidateTag(tag, { expire: 0 });
  }

  for (const path of paths) {
    revalidatePath(path, "page");
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    tags,
    paths,
  });
}
