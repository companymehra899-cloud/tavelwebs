"use client";

import { useState } from "react";
import type { ResultRow } from "@/lib/types";
import { copyText, shareOrCopy } from "@/lib/share";
import { trackResultCopied, trackResultShared } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

export interface ResultCardProps {
  toolName: string;
  title: string;
  rows: ResultRow[];
  summary: string;
  sharePath: string;
  onReset: () => void;
}

export function ResultCard({ toolName, title, rows, summary, sharePath, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

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
      className="print-block rounded-[1.75rem] border border-brand/20 bg-[linear-gradient(180deg,#e4f3f2_0%,#fffdf8_70%)] p-5 shadow-[0_14px_36px_rgba(28,36,48,0.07)] sm:p-7"
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-strong">{title}</h2>
      <dl className="mt-4 divide-y divide-brand/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
            <dt className={`text-sm ${row.emphasize ? "font-semibold text-ink" : "text-muted"}`}>
              {row.label}
            </dt>
            <dd
              className={
                row.emphasize
                  ? "text-2xl font-bold tabular-nums tracking-tight text-brand-strong"
                  : "text-sm font-medium tabular-nums text-foreground"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="no-print mt-6 flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleCopy} aria-live="polite">
          {copied ? "Copied" : "Copy result"}
        </Button>
        <Button variant="secondary" onClick={handleShare}>
          {shared ? "Shared" : "Share"}
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </section>
  );
}
