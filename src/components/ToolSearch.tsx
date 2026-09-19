"use client";

import { useMemo, useRef, useState } from "react";
import { searchTools } from "@/lib/catalog";

export function ToolSearch({
  placeholder,
  className = "",
  autoNavigate = true,
  onSelect,
}: {
  placeholder: string;
  className?: string;
  autoNavigate?: boolean;
  onSelect?: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTools(query).slice(0, 6), [query]);

  function go(slug: string) {
    if (autoNavigate) {
      window.location.href = `/tools/${slug}`;
    }
    onSelect?.(slug);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[activeIndex].slug);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`no-print relative ${className}`}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <label htmlFor="tool-search" className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <input
          id="tool-search"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="tool-search-results"
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="min-h-11 w-full rounded-full border border-border bg-white px-4 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
      </div>
      {open && query.trim().length > 0 ? (
        <ul
          id="tool-search-results"
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_40px_rgba(28,36,48,0.12)]"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">No tools match your search.</li>
          ) : (
            results.map((tool, index) => (
              <li key={tool.slug} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => go(tool.slug)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full flex-col items-start px-3 py-2.5 text-left text-sm ${
                    index === activeIndex ? "bg-brand-soft" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="font-medium text-foreground">{tool.title}</span>
                  <span className="text-xs text-muted">{tool.categoryLabel}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
