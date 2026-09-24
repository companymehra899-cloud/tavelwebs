import Link from "next/link";
import type { ToolMeta } from "@/lib/catalog";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import { CATEGORY_PATHS } from "@/lib/constants";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon name={resolveIcon(tool.icon)} size={20} />
        </span>
        <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {tool.categoryLabel}
        </span>
      </div>
      <h3 className="mt-4 text-base font-bold tracking-tight text-ink group-hover:text-accent-strong">{tool.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Open tool
        <Icon name="arrow-right" size={15} className="transition group-hover:translate-x-0.5" />
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
    <Link href={href} className="hover-lift group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="text-base font-bold tracking-tight text-ink group-hover:text-accent-strong">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        View tools
        <Icon name="arrow-right" size={15} />
      </span>
    </Link>
  );
}

export { CATEGORY_PATHS };
