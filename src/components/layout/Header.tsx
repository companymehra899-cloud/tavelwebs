"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ToolSearch } from "@/components/ToolSearch";
import { SUPPORTED_LOCALES, type AppLocale } from "@/lib/constants";
import { CURRENCIES } from "@/lib/constants";

const NAV = [
  { href: "/tools", key: "nav.tools" },
  { href: "/travel-calculators", key: "nav.travelCalculators" },
  { href: "/road-trips", key: "nav.roadTrips" },
  { href: "/currency", key: "nav.currency" },
  { href: "/travel-planning", key: "nav.travelPlanning" },
];

export function Header() {
  const { t, locale, setLocale, currency, setCurrency } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/80 bg-[rgba(255,253,248,0.88)] backdrop-blur-xl">
      <div className="page-shell flex flex-wrap items-center gap-3 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 text-base font-bold tracking-tight text-ink">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand text-sm text-white shadow-sm"
          >
            TU
          </span>
          {t("brand")}
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                      active ? "bg-brand-soft text-brand-strong" : "text-muted hover:bg-white hover:text-ink"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="order-last w-full sm:order-none sm:ml-auto sm:w-72">
          <ToolSearch placeholder={t("header.searchPlaceholder")} />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <label className="sr-only" htmlFor="locale-select">
            {t("common.language")}
          </label>
          <select
            id="locale-select"
            value={locale}
            onChange={(event) => setLocale(event.target.value as AppLocale)}
            className="hidden min-h-11 rounded-full border border-border bg-white px-3 text-sm sm:block"
          >
            {SUPPORTED_LOCALES.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="currency-select">
            {t("common.currency")}
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as (typeof CURRENCIES)[number]["code"])}
            className="hidden min-h-11 rounded-full border border-border bg-white px-3 text-sm sm:block"
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("header.closeMenu") : t("header.menu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? "X" : "Menu"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-border bg-white/95 lg:hidden"
        >
          <ul className="page-shell flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-brand-soft"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
