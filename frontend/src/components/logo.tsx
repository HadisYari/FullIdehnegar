import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/dictionaries";

export function Logo({ locale, className }: { locale: Locale; className?: string }) {
  const href = locale === "fa" ? "/" : "/en";
  return (
    <Link href={href} className={`flex items-center gap-2 shrink-0 ${className ?? ""}`} aria-label="ایده‌نگار">
      <Image
        src="/images/brand/logo-mark.png"
        alt=""
        width={36}
        height={36}
        className="h-8 w-8 sm:h-9 sm:w-9"
        priority
      />
      <Image
        src="/images/brand/logo-wordmark.png"
        alt="ایده‌نگار"
        width={110}
        height={48}
        className="h-6 sm:h-7 w-auto object-contain"
        priority
      />
    </Link>
  );
}
