import { CATEGORY_PATHS } from "@/lib/constants";
import type { ToolMeta } from "@/lib/catalog";
import Link from "next/link";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(28,36,48,0.06)] transition hover:-translate-y-0.5 hover:border-brand"
    >
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">{tool.categoryLabel}</p>
        <h3 className="mt-2 text-base font-semibold text-ink group-hover:text-brand-strong">
          {tool.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{tool.description}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand">
        Open tool
        <span aria-hidden="true">-</span>
      </span>
    </Link>
  );
}

export function ToolCategoryCard({
  label,
  description,
  href,
}: {
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(28,36,48,0.06)] transition hover:-translate-y-0.5 hover:border-brand"
    >
      <h3 className="text-base font-semibold text-ink">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </Link>
  );
}

export { CATEGORY_PATHS };
