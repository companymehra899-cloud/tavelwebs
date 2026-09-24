"use client";

import { useState } from "react";
import type { ResultRow } from "@/lib/types";
import { copyText, shareOrCopy } from "@/lib/share";
import { trackResultCopied, trackResultShared } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export interface ResultCardProps {
  toolName: string;
  title: string;
  rows: ResultRow[];
  summary: string;
  sharePath: string;
  onReset: () => void;
  icon?: IconName;
}

export function ResultCard({ toolName, title, rows, summary, sharePath, onReset, icon = "calculator" }: ResultCardProps) {
  const { t } = usePreferences();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const hero = rows.find((row) => row.emphasize) ?? rows[rows.length - 1];
  const others = rows.filter((row) => row !== hero);
  const perPerson = others.filter((row) => row.emphasize);
  const breakdown = others.filter((row) => !row.emphasize);

  async function handleCopy() {
    try {
      await copyText(summary);
      trackResultCopied(toolName);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    try {
      const absolute = `${window.location.origin}${sharePath}`;
      await shareOrCopy(title, summary, absolute);
      trackResultShared(toolName);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  }

  return (
    <section
      aria-label="Result"
      aria-live="polite"
      className="print-block animate-rise overflow-hidden rounded-2xl border border-accent/20 bg-surface shadow-[var(--shadow)] lg:sticky lg:top-24"
    >
      <div className="bg-[linear-gradient(160deg,#0b1b33_0%,#12315a_100%)] p-6 text-white">
        <div className="flex items-center gap-2 text-sky-200/90">
          <Icon name={icon} size={16} />
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">{title}</h2>
        </div>
        <p className="mt-4 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">{hero?.value}</p>
        {hero ? <p className="mt-1.5 text-sm text-sky-200/80">{hero.label}</p> : null}
        {perPerson.map((row) => (
          <p key={row.label} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            <Icon name="users" size={14} className="text-sky-300" />
            {row.value}
            <span className="font-normal text-sky-200/80">{row.label}</span>
          </p>
        ))}
      </div>

      {breakdown.length > 0 ? (
        <dl className="divide-y divide-border px-6 py-2">
          {breakdown.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-sm font-semibold tabular-nums text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="no-print flex flex-wrap gap-2 border-t border-border bg-surface-muted px-5 py-4">
        <Button variant="primary" className="min-h-9 px-3 text-xs" onClick={handleCopy} aria-live="polite">
          <Icon name="copy" size={14} />
          {copied ? t("calculator.copied") : t("calculator.copy")}
        </Button>
        <Button variant="secondary" className="min-h-9 px-3 text-xs" onClick={handleShare}>
          <Icon name="share" size={14} />
          {shared ? t("calculator.shared") : t("calculator.share")}
        </Button>
        <Button variant="secondary" className="min-h-9 px-3 text-xs" onClick={() => window.print()}>
          <Icon name="print" size={14} />
          {t("calculator.print")}
        </Button>
        <Button variant="ghost" className="min-h-9 px-3 text-xs" onClick={onReset}>
          <Icon name="refresh" size={14} />
          {t("calculator.reset")}
        </Button>
      </div>
    </section>
  );
}
