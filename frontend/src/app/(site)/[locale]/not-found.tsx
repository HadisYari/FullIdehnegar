import Link from "next/link";
import { Container } from "@/components/container";
import { getDictionary, defaultLocale } from "@/lib/i18n/dictionaries";

// Segment-level not-found can't read the [locale] param, so we default to
// Persian copy here — acceptable since this only renders for truly unknown
// URLs (the common case is handled by portfolio/[slug]'s own notFound()).
export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold text-accent-600">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-primary-900 sm:text-3xl">{dict.common.notFoundTitle}</h1>
        <p className="mt-3 text-muted">{dict.common.notFoundDesc}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
        >
          {dict.common.backHome}
        </Link>
      </Container>
    </section>
  );
}
