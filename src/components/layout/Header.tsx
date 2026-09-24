"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useSearch } from "@/components/search/SearchProvider";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, TOOL_MAP } from "@/lib/catalog";
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
    <div className="flex items-center rounded-full border border-border bg-surface p-0.5" role="group" aria-label={t("units.unitSystem")}>
      {(["metric", "imperial"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={units === value}
          onClick={() => setUnits(value)}
          className={`min-h-8 rounded-full px-3 text-xs font-semibold transition ${
            units === value ? "bg-brand text-white shadow-sm" : "text-muted hover:text-ink"
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
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-ink transition hover:border-border-strong hover:text-accent"
      >
        <Icon name="heart" size={18} />
        {items.length > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-white">
            {items.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="animate-fade absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-surface p-3 shadow-[0_24px_60px_rgba(11,27,51,0.18)]">
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
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-ink transition hover:border-border-strong hover:text-accent"
      >
        <Icon name="sliders" size={18} />
      </button>
      {open ? (
        <div className="animate-fade absolute right-0 z-50 mt-2 w-64 space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(11,27,51,0.18)]">
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
  const { t, locale, setLocale, currency, setCurrency } = usePreferences();
  const { openSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`no-print sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-border bg-[rgba(241,245,251,0.85)] backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="page-shell flex items-center gap-3 py-3">
        <Link href="/" className="flex items-center gap-2.5 text-base font-bold tracking-tight text-ink">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <Icon name="compass" size={20} />
          </span>
          <span className="whitespace-nowrap">{t("brand")}</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-4 hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                      active ? "bg-accent-soft text-accent-strong" : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label={t("header.searchPlaceholder")}
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-muted transition hover:border-border-strong hover:text-ink sm:pr-14"
          >
            <Icon name="search" size={18} />
            <span className="hidden sm:inline">{t("header.searchShort")}</span>
            <kbd className="absolute right-3 hidden rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted sm:block">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-ink lg:hidden"
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
        <nav id="mobile-menu" aria-label="Mobile navigation" className="animate-fade border-t border-border bg-surface/95 backdrop-blur-xl lg:hidden">
          <div className="page-shell flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-brand-soft"
              >
                {t(item.labelKey)}
                <Icon name="arrow-right" size={15} className="text-muted" />
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-xl bg-surface-muted px-3 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("units.unitSystem")}</span>
              <UnitsMenu />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 px-3">
              <select
                aria-label={t("common.language")}
                value={locale}
                onChange={(event) => setLocale(event.target.value as AppLocale)}
                className="min-h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink"
              >
                {SUPPORTED_LOCALES.map((code) => (
                  <option key={code} value={code}>
                    {t(`languages.${code}`)}
                  </option>
                ))}
              </select>
              <select
                aria-label={t("common.currency")}
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                className="min-h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink"
              >
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 px-3 pb-2">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/tools?category=${cat.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-muted hover:text-ink"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
