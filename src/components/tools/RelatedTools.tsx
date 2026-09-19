import Link from "next/link";
import { getRelatedTools } from "@/lib/catalog";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);
  if (related.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="related-heading" className="no-print">
      <h2 id="related-heading" className="text-xl font-semibold tracking-tight text-ink">
        Related travel tools
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 text-sm shadow-[0_8px_24px_rgba(28,36,48,0.05)] transition hover:border-brand"
            >
              <span className="font-medium text-ink">{tool.shortTitle}</span>
              <span aria-hidden="true" className="text-brand">
                -
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
