import type { LocalizedText, PageSectionDto } from "@/lib/cms";
import type { Locale } from "@/lib/i18n/dictionaries";

/**
 * Local copy of a page block. Components keep this as their fallback so the page still
 * renders while the API is offline; the seed generator reads the same literal.
 */
export type LocalItem = { icon?: string; title: string; description?: string; href?: string; value?: string };

export type LocalSection = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  items?: LocalItem[];
};

export type ResolvedItem = {
  title: string;
  description: string;
  href: string | null;
  icon: string | null;
  value: string;
};

export type ResolvedSection = {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  items: ResolvedItem[];
};

const pickLocal = (value: LocalizedText | null | undefined, locale: Locale): string =>
  value ? (locale === "fa" ? value.fa : value.en) : "";

/**
 * Resolves one page block for a locale. CMS text wins; an empty CMS value falls back to the
 * local copy. Items come from the CMS when the block exists, and from the local copy otherwise.
 */
export function resolveSection(
  sections: PageSectionDto[] | null | undefined,
  key: string,
  locale: Locale,
  local: LocalSection,
): ResolvedSection {
  const dto = sections?.find((section) => section.key === key);
  const text = (value: LocalizedText | null | undefined, fallback?: string) =>
    pickLocal(value, locale) || fallback || "";

  const items: ResolvedItem[] = dto
    ? dto.items.map((item, index) => {
        const localItem = local.items?.[index];
        return {
          title: pickLocal(item.title, locale) || localItem?.title || "",
          description: pickLocal(item.description, locale) || localItem?.description || "",
          href: item.href ?? localItem?.href ?? null,
          icon: item.icon ?? null,
          value: pickLocal(item.value, locale) || localItem?.value || "",
        };
      })
    : (local.items ?? []).map((item) => ({
        title: item.title,
        description: item.description ?? "",
        href: item.href ?? null,
        icon: item.icon ?? null,
        value: item.value ?? "",
      }));

  return {
    eyebrow: text(dto?.eyebrow, local.eyebrow),
    title: text(dto?.title, local.title),
    subtitle: text(dto?.subtitle, local.subtitle),
    body: text(dto?.body, local.body),
    items,
  };
}
