"use client";

import Link from "next/link";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export function Footer() {
  const { t } = usePreferences();
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: t("footer.tools"),
      links: [
        { href: "/tools", label: t("nav.tools") },
        { href: "/travel-calculators", label: t("nav.travelCalculators") },
        { href: "/road-trips", label: t("nav.roadTrips") },
        { href: "/currency", label: t("nav.currency") },
        { href: "/travel-planning", label: t("nav.travelPlanning") },
      ],
    },
    {
      heading: t("footer.company"),
      links: [
        { href: "/about", label: t("footer.about") },
        { href: "/contact", label: t("footer.contact") },
      ],
    },
    {
      heading: t("footer.legal"),
      links: [
        { href: "/privacy", label: t("footer.privacy") },
        { href: "/terms", label: t("footer.terms") },
        { href: "/cookies", label: t("footer.cookies") },
      ],
    },
  ];

  return (
    <footer className="no-print mt-16 border-t border-border bg-[rgba(255,253,248,0.92)]">
      <div className="page-shell grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-lg font-bold tracking-tight text-ink">{t("brand")}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{t("tagline")}</p>
        </div>
        {columns.map((column) => (
          <div key={column.heading}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
              {column.heading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            (c) {year} {t("brand")}. {t("footer.rights")}
          </p>
          <p className="max-w-xl">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
