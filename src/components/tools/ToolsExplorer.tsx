"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tools/ToolCard";
import { CATEGORIES, TOOLS } from "@/lib/catalog";
import type { ToolCategoryId } from "@/lib/types";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Icon } from "@/components/ui/Icon";

export function ToolsExplorer({
  initialQuery = "",
  initialCategory = "all",
}: {
  initialQuery?: string;
  initialCategory?: ToolCategoryId | "all";
}) {
  const { t } = usePreferences();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ToolCategoryId | "all">(initialCategory);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      if (!matchesCategory) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      const haystack = [tool.title, tool.shortTitle, tool.description, ...tool.keywords].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      tools: filtered.filter((tool) => tool.category === cat.id),
    })).filter((group) => group.tools.length > 0);
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="no-print space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <label htmlFor="tools-query" className="sr-only">
            {t("tools.searchPlaceholder")}
          </label>
          <input
            id="tools-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("tools.searchPlaceholder")}
            className="min-h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-ink shadow-[var(--shadow-sm)] transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
          />
        </div>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
            {t("tools.all")}
          </FilterPill>
          {CATEGORIES.map((cat) => (
            <FilterPill key={cat.id} active={category === cat.id} onClick={() => setCategory(cat.id)}>
              {cat.label}
            </FilterPill>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
      </p>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center">
          <p className="text-sm text-muted">{t("tools.noResults")}</p>
          <button
            type="button"
            className="mt-3 inline-flex min-h-9 items-center rounded-full bg-accent-soft px-4 text-xs font-semibold text-accent-strong"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            {t("tools.clearFilters")}
          </button>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.category.id} aria-labelledby={`cat-${group.category.id}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`cat-${group.category.id}`} className="text-xl font-bold tracking-tight text-ink">
                {group.category.label}
              </h2>
              <span className="text-xs font-medium text-muted">{group.tools.length}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{group.category.description}</p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <li key={tool.slug} className="h-full">
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-9 rounded-full border px-3.5 text-xs font-semibold transition ${
        active ? "border-accent bg-accent text-white shadow-[0_6px_16px_rgba(2,132,199,0.25)]" : "border-border bg-surface text-muted hover:border-border-strong hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
