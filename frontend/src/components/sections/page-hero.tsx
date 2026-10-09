import { Container } from "../container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-background to-background py-14 sm:py-20">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <Container className="relative text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">{eyebrow}</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-3xl font-extrabold leading-tight text-primary-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-balance leading-7 text-muted">{subtitle}</p>}
      </Container>
    </section>
  );
}
