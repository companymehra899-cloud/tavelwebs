"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { convertCurrency } from "@/lib/calculators/currency";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { CURRENCIES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useRates } from "@/components/tools/useRates";
import { Icon } from "@/components/ui/Icon";
import type { CurrencyCode, ResultRow } from "@/lib/types";

const options = CURRENCIES.map((currency) => ({ value: currency.code, label: `${currency.code} — ${currency.name}` }));
const QUICK_TARGETS: CurrencyCode[] = ["GBP", "USD", "CHF", "CAD", "AUD", "JPY"];

export function CurrencyConverter() {
  const { currency, setCurrency, t } = usePreferences();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<CurrencyCode>(currency);
  const [to, setTo] = useState<CurrencyCode>("GBP");
  const { rates, date, fetchedAt, loading, error: ratesError, reload } = useRates(from, CURRENCIES.map((c) => c.code));
  const { run, reset, result, error } = useCalculation<ReturnType<typeof convertCurrency>>("Currency Converter");

  useEffect(() => {
    setFrom(currency);
  }, [currency]);

  function calculate() {
    if (!rates) {
      return;
    }
    run(() => {
      const rate = to === from ? 1 : rates[to];
      if (!rate || !Number.isFinite(rate)) {
        throw new Error("That currency is not available in the current rate feed.");
      }
      return convertCurrency({
        amount: parseNumberInputSafe(amount, "Please enter an amount of zero or more.", true, 0),
        from,
        to,
        rate,
      });
    });
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const rows: ResultRow[] = result
    ? [
        { label: `${result.from} amount`, value: formatCurrency(result.amount, result.from as CurrencyCode) },
        { label: `${result.to} converted`, value: formatCurrency(result.converted, result.to as CurrencyCode), emphasize: true },
        { label: "Reference rate", value: `1 ${result.from} = ${result.rate} ${result.to}` },
      ]
    : [];

  const summary = result
    ? [
        "Currency Converter",
        `${formatCurrency(result.amount, result.from as CurrencyCode)} = ${formatCurrency(result.converted, result.to as CurrencyCode)}`,
        `Rate: 1 ${result.from} = ${result.rate} ${result.to}`,
        date ? `Rates last updated: ${date}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <Icon name="exchange" size={17} className="text-accent" />
              Convert currency
            </h2>
            <p className="mt-1 text-xs text-muted">
              {loading
                ? t("calculator.loading")
                : ratesError
                  ? t("calculator.unavailable")
                  : date
                    ? `${t("currency.lastUpdated")}: ${date}${fetchedAt ? ` · ${new Date(fetchedAt).toLocaleTimeString()}` : ""}`
                    : t("currency.ratesHint")}
            </p>
          </div>
          {ratesError ? (
            <button type="button" onClick={reload} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted hover:text-ink">
              <Icon name="refresh" size={13} />
              {t("currency.retry")}
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-border bg-surface-muted p-4">
            <label htmlFor="cc-amount" className="text-xs font-semibold text-ink">
              {t("currency.amount")} ({from})
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                id="cc-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-3xl font-bold tabular-nums text-ink outline-none"
              />
              <span className="rounded-lg bg-surface px-2.5 py-1 text-sm font-semibold text-muted">{from}</span>
            </div>
          </div>

          <FieldGrid>
            <SelectField id="cc-from" label={t("currency.from")} value={from} onChange={(value) => setFrom(value as CurrencyCode)} options={options} />
            <SelectField id="cc-to" label={t("currency.to")} value={to} onChange={(value) => setTo(value as CurrencyCode)} options={options} />
          </FieldGrid>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swap}
              aria-label={t("currency.swap")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-[var(--shadow-sm)] transition hover:border-accent/40"
            >
              <Icon name="exchange" size={16} className="rotate-90" />
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink">{t("currency.quick")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_TARGETS.filter((code) => code !== from).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setTo(code)}
                  aria-pressed={to === code}
                  className={`min-h-8 rounded-full border px-3 text-xs font-semibold transition ${
                    to === code ? "border-accent bg-accent-soft text-accent-strong" : "border-border bg-surface text-muted hover:text-ink"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {error ? <p role="alert" className="rounded-xl bg-error-soft px-3 py-2 text-sm text-error">{error}</p> : null}
          {ratesError ? (
            <p className="rounded-xl bg-warning-soft px-3 py-2 text-sm text-warning">{t("calculator.unavailable")}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate} disabled={loading || !rates}>
              <Icon name="calculator" size={15} />
              {t("calculator.calculate")}
            </Button>
            <Button variant="ghost" onClick={() => reset(() => { setAmount("100"); setFrom(currency); setTo("GBP"); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs leading-6 text-muted">
          {t("currency.disclaimer")}{" "}
          <button type="button" className="font-semibold text-accent underline" onClick={() => setCurrency(to)}>
            {t("currency.setAsMyCurrency")} ({to})
          </button>
        </p>
      </CalculatorCard>

      {result ? (
        <ResultCard
          toolName="Currency Converter"
          title={t("calculator.result")}
          rows={rows}
          summary={summary}
          sharePath={`/tools/currency-converter?amount=${amount}&from=${from}&to=${to}`}
          onReset={() => reset(() => { setAmount("100"); })}
          icon="coins"
        />
      ) : (
        <p className="calc-empty">{t("currency.empty")}</p>
      )}
    </div>
  );
}
