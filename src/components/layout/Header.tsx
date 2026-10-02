"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useSearch } from "@/components/search/SearchProvider";
import { Icon } from "@/components/ui/Icon";
import { TOOL_MAP } from "@/lib/catalog";
import { CURRENCIES, SUPPORTED_LOCALES, type AppLocale } from "@/lib/constants";
import type { CurrencyCode } from "@/lib/types";

const NAV = [
  { href: "/tools", labelKey: "nav.tools" },
  { href: "/travel-calculators", labelKey: "nav.calculators" },
  { href: "/road-trips", labelKey: "nav.roadTrips" },
  { href: "/travel-planning", labelKey: "nav.travelPlanning" },
];

function UnitsMenu() {
  const { units, setUnits, t } = usePreferences();
  return (
    <div className="flex items-center rounded border border-white/20 bg-white/10 p-0.5" role="group" aria-label={t("units.unitSystem")}>
      {(["metric", "imperial"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={units === value}
          onClick={() => setUnits(value)}
          className={`min-h-8 rounded px-3 text-xs font-semibold transition ${
            units === value ? "bg-white text-brand shadow-sm" : "text-white/75 hover:text-white"
          }`}
        >
          {value === "metric" ? t("units.metricShort") : t("units.imperialShort")}
        </button>
      ))}
    </div>
  );
}

function FavoritesMenu() {
  const { favorites, t } = usePreferences();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = favorites.map((slug) => TOOL_MAP[slug]).filter(Boolean);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("header.favorites")}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded text-white/90 transition hover:bg-white/10 hover:text-white"
      >
        <Icon name="heart" size={18} />
        {items.length > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-white">
            {items.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="animate-fade absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded border border-border bg-surface p-3 shadow-[var(--shadow)]">
          <p className="px-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">{t("header.favorites")}</p>
          {items.length === 0 ? (
            <div className="px-1 py-4">
              <p className="text-sm text-muted">{t("home.noFavorites")}</p>
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-xs font-semibold text-white"
              >
                {t("home.exploreTools")}
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          ) : (
            <ul className="mt-2 space-y-1">
              {items.map((tool) => (
                <li key={tool!.slug}>
                  <Link
                    href={`/tools/${tool!.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-brand-soft"
                  >
                    <span className="truncate">{tool!.shortTitle}</span>
                    <Icon name="arrow-right" size={14} className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SettingsMenu() {
  const { locale, setLocale, currency, setCurrency, t } = usePreferences();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("common.settings")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded text-white/90 transition hover:bg-white/10 hover:text-white"
      >
        <Icon name="sliders" size={18} />
      </button>
      {open ? (
        <div className="animate-fade absolute right-0 z-50 mt-2 w-64 space-y-3 rounded border border-border bg-surface p-4 shadow-[var(--shadow)]">
          <label className="block">
            <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
              {t("common.language")}
            </span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as AppLocale)}
              className="min-h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink"
            >
              {SUPPORTED_LOCALES.map((code) => (
                <option key={code} value={code}>
                  {t(`languages.${code}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
              {t("common.currency")}
            </span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="min-h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink"
            >
              {CURRENCIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} — {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const { t } = usePreferences();
  const { openSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  return (
    <header
      className="no-print sticky top-0 z-50 bg-brand text-white shadow-[0_2px_8px_rgba(8,41,82,0.25)]"
    >
      <div className="page-shell flex items-center gap-3 py-2.5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded bg-accent text-white">
            <Icon name="compass" size={18} />
          </span>
          <span className="whitespace-nowrap">{t("brand")}</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-3 hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                      active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={openSearch}
            aria-label={t("header.searchPlaceholder")}
            className="relative inline-flex h-9 items-center gap-2 rounded border border-white/20 bg-white/10 px-3 text-sm text-white/80 transition hover:bg-white/15 hover:text-white sm:pr-12"
          >
            <Icon name="search" size={16} />
            <span className="hidden sm:inline">{t("header.searchShort")}</span>
            <kbd className="absolute right-2 hidden rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.6rem] font-semibold text-white/70 sm:block">
              ⌘K
            </kbd>
          </button>
          <div className="hidden md:block">
            <UnitsMenu />
          </div>
          <FavoritesMenu />
          <SettingsMenu />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("header.closeMenu") : t("header.menu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="animate-fade border-t border-white/15 bg-brand-strong lg:hidden">
          <div className="page-shell flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded px-3 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                {t(item.labelKey)}
                <Icon name="arrow-right" size={15} className="text-white/60" />
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
