import Link from "next/link";
import { Container } from "@/components/container";
import { defaultLocale } from "@/lib/i18n/dictionaries";
import { getDictionaryForLocale } from "@/lib/cms";

// Segment-level not-found can't read the [locale] param, so default to Persian
// copy here. Portfolio details handle missing slugs with their own notFound().
export default async function NotFound() {
  const dict = await getDictionaryForLocale(defaultLocale);
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
