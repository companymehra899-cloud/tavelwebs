"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, TOOL_MAP, searchTools } from "@/lib/catalog";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import { useSearch } from "@/components/search/SearchProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";

const POPULAR = [
  "fuel-cost-calculator",
  "road-trip-cost-calculator",
  "currency-converter",
  "travel-budget-calculator",
  "packing-list-generator",
];

export function SearchCommand() {
  const { open, closeSearch } = useSearch();
  const { t } = usePreferences();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return POPULAR.map((slug) => TOOL_MAP[slug]).filter(Boolean);
    }
    return searchTools(trimmed).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
      } else if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        go(results[activeIndex].slug);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, activeIndex]);

  function go(slug: string) {
    closeSearch();
    router.push(`/tools/${slug}`);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="no-print fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={closeSearch}
        className="absolute inset-0 cursor-default bg-[rgba(8,17,33,0.55)] backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Travel Utility"
        className="animate-rise relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_40px_100px_rgba(5,15,32,0.4)] transition-colors focus-within:border-accent"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Icon name="search" size={20} className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            className="search-input min-h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded-md border border-border bg-surface-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {!query.trim() ? (
            <p className="px-3 pb-1 pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
              {t("search.popular")}
            </p>
          ) : null}
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">{t("search.noResults")}</p>
          ) : (
            <ul role="listbox">
              {results.map((tool, index) => (
                <li key={tool.slug} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(tool.slug)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      index === activeIndex ? "bg-brand-soft" : "hover:bg-surface-muted"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent">
                      <Icon name={resolveIcon(tool.icon)} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{tool.title}</span>
                      <span className="block truncate text-xs text-muted">{tool.categoryLabel}</span>
                    </span>
                    <Icon name="arrow-right" size={16} className="shrink-0 text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface-muted px-4 py-2.5 text-[0.7rem] text-muted">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface px-1 py-0.5">↑</kbd>
              <kbd className="rounded border border-border bg-surface px-1 py-0.5">↓</kbd>
              {t("search.navigate")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface px-1 py-0.5">↵</kbd>
              {t("search.open")}
            </span>
          </span>
          <span>{TOOLS.length} tools</span>
        </div>
      </div>
    </div>
  );
}
