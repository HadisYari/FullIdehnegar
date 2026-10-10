import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { addMessage } from "@/lib/messages";
import { sendContactEmail } from "@/lib/mailer";
import { isRateLimited, recordFailedAttempt } from "@/lib/auth";
import { submitContact } from "@/lib/cms";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `contact:${ip}`;

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

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  const locale = String(body.locale || "fa");
  const inquiryType = String(body.inquiryType || "").trim().slice(0, 80);

  if (!name || !email || !phone || !message) {
    recordFailedAttempt(rateLimitKey);
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (name.length > 200 || subject.length > 300 || message.length > 5000) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  // ۱) ترجیحاً بک‌اند: ثبت در SQL Server، ایمیل و نمایش در صندوق پنل مدیریت.
  const cmsResult = await submitContact({
    name,
    email,
    phone,
    subject,
    message,
    locale,
    inquiryType: inquiryType || undefined,
  });
  if (cmsResult) {
    return NextResponse.json({ ok: true, emailSent: cmsResult.emailSent === true, stored: "cms" });
  }

  // ۲) حالت محلی (بدون بک‌اند): فایل دادهٔ مخزن + SMTP مستقل.
  let emailSent = false;
  try {
    emailSent = await sendContactEmail({ name, email, phone, subject, message });
  } catch (err) {
    console.error("Failed to send contact email", err);
  }

  try {
    await addMessage({
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      subject,
      message,
      locale,
      inquiryType: inquiryType || undefined,
      createdAt: new Date().toISOString(),
      emailSent,
    });
  } catch (err) {
    console.error("Failed to persist contact message", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, emailSent });
}
