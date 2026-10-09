import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isRateLimited, recordFailedAttempt } from "@/lib/auth";
import { submitStoreOrder } from "@/lib/cms";
import { addLocalStoreOrder } from "@/lib/store";

/**
 * ثبت Purchase Intent فروشگاه‌ساز.
 * ۱) ترجیحاً بک‌اند: ذخیره در SQL Server + نمایش در صندوق پنل مدیریت (POST /api/public/store-orders).
 * ۲) حالت محلی (بدون بک‌اند): فایل src/data/store-orders.json.
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `store-order:${ip}`;

  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — if filled, silently accept without doing anything.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fullName = String(body.fullName || "").trim();
  const mobile = String(body.mobile || "").trim();
  const storeName = String(body.storeName || "").trim();
  const domain = String(body.domain || "").trim();
  const templateId = String(body.templateId || "").trim();
  const plan = String(body.plan || "").trim();
  const cycle = String(body.cycle || "yearly").trim() === "monthly" ? "monthly" : "yearly";
  const gateway = String(body.gateway || "shaparak").trim() === "zarinpal" ? "zarinpal" : "shaparak";
  const locale = String(body.locale || "fa").trim() === "en" ? "en" : "fa";
  const rulesAccepted = body.rulesAccepted === true;
  const amount = Number(body.amount);

  if (!fullName || !mobile || !storeName) {
    recordFailedAttempt(rateLimitKey);
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!rulesAccepted) {
    recordFailedAttempt(rateLimitKey);
    return NextResponse.json({ error: "Rules must be accepted" }, { status: 400 });
  }
  if (fullName.length > 200 || storeName.length > 200 || mobile.length > 60 || domain.length > 200) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  // ۱) بک‌اند: ثبت سفارش در دیتابیس + ایمیل (در صورت تنظیم SMTP)
  const cmsResult = await submitStoreOrder({
    fullName,
    mobile,
    storeName,
    domain: domain || undefined,
    templateId: templateId || undefined,
    plan: plan || undefined,
    cycle,
    amount,
    gateway,
    rulesAccepted,
    locale,
  });
  if (cmsResult) {
    return NextResponse.json({
      ok: true,
      stored: "cms",
      id: cmsResult.id,
      reference: cmsResult.reference,
      status: cmsResult.status,
    });
  }

  // ۲) حالت محلی: ذخیره در فایل مخزن تا нич bestellen verloren نرود.
  try {
    await addLocalStoreOrder({
      id: crypto.randomUUID(),
      fullName,
      mobile,
      storeName,
      domain: domain || undefined,
      templateId: templateId || undefined,
      plan: plan || undefined,
      cycle,
      amount,
      gateway,
      locale,
      createdAt: new Date().toISOString(),
      stored: "local",
    });
  } catch (err) {
    console.error("Failed to persist store order", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: "local" });
}
