import "server-only";
import nodemailer from "nodemailer";

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  if (!isSmtpConfigured()) return false;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = process.env.CONTACT_TO_EMAIL || "info@idehnegar.co";
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!;

  await transporter.sendMail({
    from,
    to,
    replyTo: params.email,
    subject: `[سایت] ${params.subject || "پیام جدید از فرم تماس"}`,
    text: [
      `نام: ${params.name}`,
      `ایمیل: ${params.email}`,
      `تلفن: ${params.phone}`,
      `موضوع: ${params.subject}`,
      "",
      params.message,
    ].join("\n"),
  });

  return true;
}
