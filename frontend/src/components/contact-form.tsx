"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const f = dict.contact.form;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: bots fill every field, humans never see this one.
    if (data.company) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground/80">
            {f.name}
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground/80">
            {f.phone}
          </label>
          <input id="phone" name="phone" required dir="ltr" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground/80">
          {f.email}
        </label>
        <input id="email" name="email" type="email" required dir="ltr" className={inputClass} />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground/80">
          {f.subject}
        </label>
        <input id="subject" name="subject" className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground/80">
          {f.message}
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>

      {/* Honeypot field — hidden from real users via CSS, catches basic bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-transform hover:-translate-y-0.5 hover:bg-accent-600 disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "submitting" ? f.submitting : f.submit}
      </button>

      {status === "success" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{f.success}</p>
      )}
      {status === "error" && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{f.error}</p>}
    </form>
  );
}
