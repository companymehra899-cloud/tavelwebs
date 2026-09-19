"use client";

import { useState } from "react";
import Link from "next/link";
import { usePreferences } from "./providers/PreferencesProvider";

export function CookiePreferences() {
  const { t, cookies, setCookies } = usePreferences();
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(cookies.analytics);
  const [advertising, setAdvertising] = useState(cookies.advertising);

  if (cookies.decided && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="no-print fixed bottom-4 left-4 z-50 rounded-full border border-border bg-white px-4 py-2 text-xs text-muted shadow-[0_10px_30px_rgba(28,36,48,0.12)] hover:text-brand"
      >
        {t("cookies.manage")}
      </button>
    );
  }

  if (open) {
    return (
      <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-heading"
          className="w-full max-w-md rounded-[1.75rem] border border-border bg-white p-6 shadow-xl"
        >
          <h2 id="cookie-heading" className="text-lg font-semibold text-ink">
            {t("cookies.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">{t("cookies.message")}</p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t("cookies.essential")}</span>
              <input type="checkbox" checked disabled aria-label={t("cookies.essential")} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t("cookies.analytics")}</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                aria-label={t("cookies.analytics")}
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>{t("cookies.advertising")}</span>
              <input
                type="checkbox"
                checked={advertising}
                onChange={(event) => setAdvertising(event.target.checked)}
                aria-label={t("cookies.advertising")}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCookies({ analytics, advertising });
                setOpen(false);
              }}
              className="min-h-11 flex-1 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
            >
              {t("cookies.save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setCookies({ analytics: false, advertising: false });
                setOpen(false);
              }}
              className="min-h-11 flex-1 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-brand-soft"
            >
              {t("cookies.reject")}
            </button>
          </div>
          <Link href="/cookies" className="mt-3 inline-block text-xs text-brand hover:underline" onClick={() => setOpen(false)}>
            {t("footer.cookies")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[rgba(255,253,248,0.96)] p-4 shadow-[0_-8px_30px_rgba(28,36,48,0.08)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">{t("cookies.message")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCookies({ analytics: true, advertising: true })}
            className="min-h-11 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
          >
            {t("cookies.accept")}
          </button>
          <button
            type="button"
            onClick={() => setCookies({ analytics: false, advertising: false })}
            className="min-h-11 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-brand-soft"
          >
            {t("cookies.reject")}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-h-11 rounded-full px-4 py-2 text-sm text-muted hover:bg-white"
          >
            {t("cookies.manage")}
          </button>
        </div>
      </div>
    </div>
  );
}
