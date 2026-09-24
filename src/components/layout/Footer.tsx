"use client";

import Link from "next/link";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const { t } = usePreferences();
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: t("footer.tools"),
      links: [
        { href: "/tools", label: t("nav.tools") },
        { href: "/road-trips", label: t("nav.roadTrips") },
        { href: "/travel-calculators", label: t("nav.calculators") },
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
    <footer className="no-print mt-20 border-t border-border bg-surface">
      <div className="page-shell grid grid-cols-2 gap-x-8 gap-y-10 py-14 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              <Icon name="compass" size={20} />
            </span>
            {t("brand")}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">{t("tagline")}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong">
            <Icon name="shield" size={13} />
            {t("footer.noAccount")}
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.heading}>
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink">{column.heading}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border bg-surface-muted">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t("brand")}. {t("footer.rights")}
          </p>
          <p className="max-w-xl">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
