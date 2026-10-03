import Link from "next/link";
import type { ToolMeta } from "@/lib/catalog";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import { CATEGORY_PATHS } from "@/lib/constants";
import { toolImage } from "@/lib/images";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-sm)]"
    >
      <span className="relative h-36 overflow-hidden">
        <img src={toolImage(tool.slug, tool.category)} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-brand">
          <Icon name={resolveIcon(tool.icon)} size={18} />
        </span>
      </span>
      <span className="flex flex-1 flex-col p-4">
        <span className="self-start rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {tool.categoryLabel}
        </span>
        <h3 className="mt-3 text-base font-bold tracking-tight text-ink group-hover:text-accent-strong">{tool.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Open tool
          <Icon name="arrow-right" size={15} className="transition group-hover:translate-x-0.5" />
        </span>
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
    <Link href={href} className="hover-lift group flex flex-col rounded border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
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
