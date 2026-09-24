import Link from "next/link";
import { getRelatedTools } from "@/lib/catalog";
import { Icon, resolveIcon } from "@/components/ui/Icon";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);
  if (related.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="related-heading" className="no-print">
      <h2 id="related-heading" className="text-lg font-bold tracking-tight text-ink">
        Related travel tools
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className="hover-lift group flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon name={resolveIcon(tool.icon)} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink group-hover:text-accent-strong">{tool.shortTitle}</span>
                <span className="block truncate text-xs text-muted">{tool.categoryLabel}</span>
              </span>
              <Icon name="arrow-right" size={15} className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
