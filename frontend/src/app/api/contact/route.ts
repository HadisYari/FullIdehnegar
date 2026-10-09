import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { addMessage } from "@/lib/messages";
import { sendContactEmail } from "@/lib/mailer";
import { isRateLimited, recordFailedAttempt } from "@/lib/auth";
import { getCmsApiBaseUrl } from "@/lib/cms";

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

  if (!name || !email || !phone || !message || name.length < 2 || message.length < 10) {
    recordFailedAttempt(rateLimitKey);
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (locale !== "fa" && locale !== "en") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  if (name.length > 120 || email.length > 254 || phone.length > 40 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  const normalizedSubject = subject || (locale === "fa" ? "پیام از فرم تماس سایت" : "Website contact request");
  const cmsBaseUrl = getCmsApiBaseUrl();
  if (cmsBaseUrl) {
    try {
      const cmsResponse = await fetch(`${cmsBaseUrl}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: normalizedSubject,
          message,
          locale,
          website: typeof body.company === "string" ? body.company : "",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (!cmsResponse.ok) {
        const errorBody = await cmsResponse.json().catch(() => null) as { message?: string; title?: string } | null;
        return NextResponse.json(
          { error: errorBody?.message || errorBody?.title || "Failed to save message" },
          { status: cmsResponse.status === 429 ? 429 : cmsResponse.status === 400 ? 400 : 502 },
        );
      }
    } catch (error) {
      console.error("Failed to submit contact message to the CMS API", error);
      return NextResponse.json({ error: "Contact service is temporarily unavailable" }, { status: 502 });
    }

    let emailSent = false;
    try {
      emailSent = await sendContactEmail({ name, email, phone, subject: normalizedSubject, message });
    } catch (err) {
      console.error("Failed to send contact email", err);
    }
    return NextResponse.json({ ok: true, emailSent });
  }

  let emailSent = false;
  try {
    emailSent = await sendContactEmail({ name, email, phone, subject: normalizedSubject, message });
  } catch (err) {
    console.error("Failed to send contact email", err);
  }

  try {
    await addMessage({
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      subject: normalizedSubject,
      message,
      locale,
      createdAt: new Date().toISOString(),
      emailSent,
    });
  } catch (err) {
    console.error("Failed to persist contact message", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, emailSent });
}
