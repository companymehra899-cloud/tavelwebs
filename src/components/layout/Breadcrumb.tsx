import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="no-print text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="transition hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? <Icon name="chevron-down" size={12} className="-rotate-90 text-border-strong" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
