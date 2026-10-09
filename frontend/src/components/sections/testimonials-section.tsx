"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "../container";
import { Reveal } from "../reveal";
import testimonials from "@/data/testimonials.json";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function TestimonialsSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "fa";

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused]);

  const goTo = (i: number) => setActive((i + testimonials.length) % testimonials.length);

  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16"
      style={{
        background:
          "radial-gradient(800px 400px at 10% 0%, rgba(230,48,76,0.05), transparent 50%), radial-gradient(600px 300px at 90% 100%, rgba(15,15,82,0.06), transparent 50%), linear-gradient(180deg, #fafafb 0%, #f4f4f7 100%)",
      }}
    >
      {/* Decorative background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#0f0f52 1px, transparent 1px), linear-gradient(90deg, #0f0f52 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 60%, transparent 90%)",
        }}
      />

      {/* Subtle Blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, rgba(230,48,76,0.2), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-12 h-52 w-52 rounded-full blur-3xl animate-blob animation-delay-2000"
        style={{ background: "radial-gradient(circle, rgba(15,15,82,0.2), transparent 70%)" }}
      />

      <Container>
        {/* Header Block with Clear Section Context */}
        <Reveal className="mx-auto max-w-xl text-center">
          <div
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 backdrop-blur-sm"
            style={{
              borderColor: "rgba(15,15,82,0.1)",
              background: "rgba(255,255,255,0.7)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: "#e6304c" }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: "#e6304c" }}
              />
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "#e6304c" }}
            >
              {dict.testimonials.eyebrow || "Feedback"}
            </span>
          </div>

          {/* Main Title describing the Section Purpose */}
          <h2
            className="mt-2.5 text-xl font-black tracking-tight sm:text-2xl"
            style={{ color: "#0f0f52" }}
          >
            {dict.testimonials.title}
          </h2>
          
          {/* Sub-headline for context (perfect for design agencies) */}
          <p className="mt-1.5 text-xs text-dark sm:text-sm">
            {isRTL 
              ? "بشنوید از کسانی که مأموریت دیزاین و توسعه وب‌سایت خود را به ما سپردند" 
              : "What our clients say about our design and development standards"}
          </p>
        </Reveal>

        {/* Testimonials UI Container */}
        <div
          className="relative mt-8 sm:mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slide Card (Compact max-w-lg) */}
          <div className="relative mx-auto max-w-lg">
            <div
              className="absolute -inset-0.5 rounded-xl opacity-40 blur-md transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, rgba(230,48,76,0.25), rgba(15,15,82,0.25))",
              }}
            />
            <div
              ref={trackRef}
              className="relative overflow-hidden rounded-xl border bg-white shadow-lg"
              style={{
                borderColor: "rgba(15,15,82,0.06)",
              }}
            >
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  transform: `translateX(${isRTL ? active * 100 : -active * 100}%)`,
                }}
              >
                {testimonials.map((t) => (
                  <div
                    key={t.name.fa}
                    className="w-full flex-shrink-0 px-5 py-6 sm:px-8 sm:py-8"
                  >
                    {/* Header of Card (Stars & Small Quote Mark) */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="12"
                            height="12"
                            viewBox="0 0 20 20"
                            fill="#e6304c"
                          >
                            <path d="M10 1l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 14.5l-5.2 2.8 1-5.9L1.5 7.2l5.9-.9L10 1z" />
                          </svg>
                        ))}
                      </div>
                      <svg
                        width="24"
                        height="18"
                        viewBox="0 0 32 24"
                        fill="none"
                        style={{ color: "#e6304c" }}
                        className="opacity-20"
                      >
                        <path
                          fill="currentColor"
                          d="M9.5 0C4.3 2.6 0 8.1 0 14.2 0 19.6 3.6 24 8.8 24c4.2 0 7.2-3.3 7.2-7.2 0-3.7-2.7-6.4-6-6.4-.6 0-1.1.1-1.3.2.4-3.1 3.4-6.4 6.6-8L9.5 0Zm18 0c-5.2 2.6-9.5 8.1-9.5 14.2 0 5.4 3.6 9.8 8.8 9.8 4.2 0 7.2-3.3 7.2-7.2 0-3.7-2.7-6.4-6-6.4-.6 0-1.1.1-1.3.2.4-3.1 3.4-6.4 6.6-8L27.5 0Z"
                        />
                      </svg>
                    </div>

                    {/* Compact Testimonial Quote Text */}
                    <p
                      className="mt-3.5 text-sm leading-relaxed sm:text-base sm:leading-relaxed"
                      style={{ color: "#1a1a3a", fontWeight: 500 }}
                    >
                      {t.quote[locale]}
                    </p>

                    {/* Small User Info Footer */}
                    <div className="mt-5 flex items-center gap-2.5">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #0f0f52 0%, #e6304c 100%)",
                        }}
                      >
                        {t.name[locale].charAt(0)}
                      </div>
                      <div>
                        <p
                          className="text-xs font-bold sm:text-sm"
                          style={{ color: "#0f0f52" }}
                        >
                          {t.name[locale]}
                        </p>
                        <div
                          className="mt-0.5 h-[1.5px] w-4"
                          style={{ background: "#e6304c" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Symmetrical Controls */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Previous"
              className="group flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: "rgba(15,15,82,0.1)",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f0f52"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isRTL ? "rotate-180" : ""}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Micro Dots with Active Progress */}
            <div className="flex items-center gap-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${i + 1}`}
                  className="group relative h-1.5 overflow-hidden rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 20 : 6,
                    background:
                      i === active ? "transparent" : "rgba(15,15,82,0.15)",
                  }}
                >
                  {i === active && (
                    <span
                      key={active}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #e6304c, #0f0f52)",
                        animation: isPaused
                          ? "none"
                          : "progress 5s linear forwards",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo(active + 1)}
              aria-label="Next"
              className="group flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: "rgba(15,15,82,0.1)",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f0f52"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isRTL ? "rotate-180" : ""}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Minimalist Symmetrical Thumbnails - Desktop Only */}
          <div className="mt-6 hidden justify-center gap-1.5 md:flex">
            {testimonials.map((t, i) => (
              <button
                key={t.name.fa}
                onClick={() => goTo(i)}
                className="group relative overflow-hidden rounded-md border px-2.5 py-1.5 text-start transition-all duration-300"
                style={{
                  borderColor:
                    i === active
                      ? "rgba(230,48,76,0.35)"
                      : "rgba(15,15,82,0.05)",
                  background:
                    i === active
                      ? "linear-gradient(135deg, rgba(230,48,76,0.03), rgba(15,15,82,0.03))"
                      : "rgba(255,255,255,0.5)",
                  transform: i === active ? "translateY(-1px)" : "translateY(0)",
                  boxShadow:
                    i === active
                      ? "0 3px 8px -3px rgba(15,15,82,0.12)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{
                      background:
                        i === active
                          ? "linear-gradient(135deg, #0f0f52, #e6304c)"
                          : "#0f0f52",
                    }}
                  >
                    {t.name[locale].charAt(0)}
                  </div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "#0f0f52" }}
                  >
                    {t.name[locale]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(15px, -10px) scale(1.03);
          }
          66% {
            transform: translate(-10px, 15px) scale(0.97);
          }
        }
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}