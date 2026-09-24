"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { useCalculation } from "@/components/tools/useCalculation";
import { convertMany } from "@/lib/calculators/currency";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { CURRENCIES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useRates } from "@/components/tools/useRates";
import { Icon } from "@/components/ui/Icon";
import type { CurrencyCode } from "@/lib/types";

const options = CURRENCIES.map((currency) => ({ value: currency.code, label: `${currency.code} — ${currency.name}` }));

export function MultiCurrencyConverter() {
  const { currency, t } = usePreferences();
  const [amount, setAmount] = useState("1000");
  const [base, setBase] = useState<CurrencyCode>(currency);
  const { rates, date, loading, error: ratesError, reload } = useRates(base, CURRENCIES.map((c) => c.code));
  const { run, result, error, reset } = useCalculation<ReturnType<typeof convertMany>>("Multi-Currency Converter");

  function calculate() {
    if (!rates) {
      return;
    }
    run(() =>
      convertMany(
        parseNumberInputSafe(amount, "Please enter an amount of zero or more.", true, 0),
        base,
        rates,
        CURRENCIES.map((c) => c.code),
      ),
    );
  }

  const summary = result
    ? [
        "Multi-Currency Converter",
        `Base: ${formatCurrency(Number(amount), base)}`,
        ...result.map((row) => `${row.code}: ${Number.isFinite(row.value) ? row.value.toFixed(2) : "unavailable"}`),
        date ? `Rates last updated: ${date}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="grid" size={17} className="text-accent" />
          {t("multi.title")}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {loading ? t("calculator.loading") : ratesError ? t("calculator.unavailable") : date ? `${t("currency.lastUpdated")}: ${date}` : t("currency.ratesHint")}
        </p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="mc-amount" label={t("currency.amount")} value={amount} onChange={setAmount} type="number" inputMode="decimal" min="0" step="any" suffix={base} />
            <SelectField id="mc-base" label={t("currency.base")} value={base} onChange={(value) => setBase(value as CurrencyCode)} options={options} />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-xl bg-error-soft px-3 py-2 text-sm text-error">{error}</p> : null}
          {ratesError ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-warning-soft px-3 py-2 text-sm text-warning">
              <span>{t("calculator.unavailable")}</span>
              <button type="button" className="inline-flex items-center gap-1 font-semibold underline" onClick={reload}>
                <Icon name="refresh" size={13} />
                {t("currency.retry")}
              </button>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate} disabled={loading || !rates}>
              <Icon name="calculator" size={15} />
              {t("calculator.calculate")}
            </Button>
            <Button variant="ghost" onClick={() => reset(() => { setAmount("1000"); setBase(currency); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>

      {result ? (
        <section aria-label="Converted amounts" className="print-block animate-rise overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow)] lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <p className="eyebrow text-accent">{t("multi.tableTitle")}</p>
              <h2 className="mt-1 text-lg font-bold text-ink">
                {formatCurrency(Number(amount), base)}
              </h2>
            </div>
            <button
              type="button"
              className="no-print inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-muted hover:text-ink"
              onClick={() => navigator.clipboard.writeText(summary)}
            >
              <Icon name="copy" size={14} />
              {t("calculator.copy")}
            </button>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <caption className="sr-only">Converted amounts</caption>
              <thead className="bg-surface-muted text-left text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-2.5">{t("multi.currency")}</th>
                  <th scope="col" className="px-5 py-2.5 text-right">{t("multi.amount")}</th>
                  <th scope="col" className="px-5 py-2.5 text-right">{t("multi.rate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.map((row) => (
                  <tr key={row.code} className="transition hover:bg-surface-muted">
                    <th scope="row" className="px-5 py-2.5 text-left font-semibold text-ink">{row.code}</th>
                    <td className="px-5 py-2.5 text-right font-medium tabular-nums text-ink">
                      {Number.isFinite(row.value) ? formatCurrency(row.value, row.code as CurrencyCode) : "—"}
                    </td>
                    <td className="px-5 py-2.5 text-right text-xs tabular-nums text-muted">{Number.isFinite(row.rate) ? row.rate : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border p-4 text-xs leading-6 text-muted">
            {t("currency.disclaimer")}
            {date ? ` ${t("currency.lastUpdated")}: ${date}.` : ""}
          </p>
        </section>
      ) : (
        <p className="calc-empty">{t("multi.empty")}</p>
      )}
    </div>
  );
}
