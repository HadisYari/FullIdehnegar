/**
 * عنوان دوزبانهٔ صفحه‌ها و سکشن‌ها از جدول PageMeta / PageSection.
 *
 * قرارداد نگارشی متن عنوان (در پنل مدیریت):
 * - `\n`        → شکستن خط (<br />)
 * - `|متن|`    → بخش گرادیانی برند (gradient text)
 *
 * اگر نشانه‌ای در متن نباشد، کل عنوان ساده رندر می‌شود.
 */
export function SplitTitle({ title, accentClass }: { title: string; accentClass: string }) {
  const parts: React.ReactNode[] = [];
  let key = 0;

  title.split("\n").forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      parts.push(<br key={`br-${key++}`} />);
    }
    line.split("|").forEach((segment, index) => {
      if (segment.length === 0) return;
      if (index % 2 === 1) {
        parts.push(
          <span key={`seg-${key++}`} className={accentClass}>
            {segment}
          </span>,
        );
      } else {
        parts.push(<span key={`seg-${key++}`}>{segment}</span>);
      }
    });
  });

  return <>{parts}</>;
}
