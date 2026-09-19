"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tools/ToolCard";
import { CATEGORIES, TOOLS } from "@/lib/catalog";
import type { ToolCategoryId } from "@/lib/types";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export function ToolsExplorer({ initialQuery = "" }: { initialQuery?: string }) {
  const { t } = usePreferences();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ToolCategoryId | "all">("all");

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
      <div className="no-print space-y-4 rounded-[1.75rem] border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(28,36,48,0.05)]">
        <label htmlFor="tools-query" className="sr-only">{t("tools.searchPlaceholder")}</label>
        <input
          id="tools-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("tools.searchPlaceholder")}
          className="min-h-12 w-full rounded-full border border-border bg-white px-4 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
            className={`min-h-9 rounded-full border px-3.5 text-xs font-medium ${category === "all" ? "border-brand bg-brand text-white" : "border-border bg-white text-muted"}`}
          >
            {t("tools.all")}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={category === cat.id}
              onClick={() => setCategory(cat.id)}
              className={`min-h-9 rounded-full border px-3.5 text-xs font-medium ${category === cat.id ? "border-brand bg-brand text-white" : "border-border bg-white text-muted"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted">
          <p>{t("tools.noResults")}</p>
          <button type="button" className="mt-2 text-brand underline" onClick={() => { setQuery(""); setCategory("all"); }}>
            {t("tools.clearFilters")}
          </button>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.category.id} aria-labelledby={`cat-${group.category.id}`}>
            <h2 id={`cat-${group.category.id}`} className="text-xl font-semibold tracking-tight text-ink">
              {group.category.label}
            </h2>
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
