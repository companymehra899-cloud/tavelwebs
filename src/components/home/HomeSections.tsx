"use client";

import { useState } from "react";
import Link from "next/link";
import { TOOL_MAP } from "@/lib/catalog";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export function HomeSearch() {
  const { t } = usePreferences();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? Object.values(TOOL_MAP).filter((tool) =>
        [tool.title, tool.shortTitle, tool.description, ...tool.keywords].join(" ").toLowerCase().includes(normalized),
      ).slice(0, 6)
    : [];

  return (
    <div className="relative">
      <label htmlFor="home-search" className="sr-only">{t("home.searchPlaceholder")}</label>
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("home.searchPlaceholder")}
        aria-describedby="home-search-hint"
        className="min-h-14 w-full rounded-full border border-border bg-white px-5 text-base shadow-[0_8px_24px_rgba(28,36,48,0.08)] focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
      />
      <p id="home-search-hint" className="mt-3 text-xs text-muted">{t("home.searchExamples")}</p>
      {normalized ? (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_40px_rgba(28,36,48,0.12)]">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">No tools match your search.</li>
          ) : (
            results.map((tool) => (
              <li key={tool.slug}>
                <Link href={`/tools/${tool.slug}`} className="flex flex-col px-4 py-3 text-sm hover:bg-brand-soft">
                  <span className="font-medium text-foreground">{tool.title}</span>
                  <span className="text-xs text-muted">{tool.categoryLabel}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

export function FavoritesSection() {
  const { favorites, t } = usePreferences();
  if (favorites.length === 0) {
    return (
      <section aria-labelledby="favorites-heading">
        <h2 id="favorites-heading" className="text-lg font-semibold text-ink">{t("home.favorites")}</h2>
        <p className="mt-2 text-sm text-muted">{t("home.noFavorites")}</p>
      </section>
    );
  }
  return (
    <section aria-labelledby="favorites-heading">
      <h2 id="favorites-heading" className="text-lg font-semibold text-ink">{t("home.favorites")}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {favorites.map((slug) => {
          const tool = TOOL_MAP[slug];
          if (!tool) return null;
          return (
            <li key={slug}>
              <Link href={`/tools/${slug}`} className="inline-flex rounded-full border border-brand/30 bg-brand-soft px-3.5 py-2 text-xs font-medium text-brand-strong">
                {tool.shortTitle}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
