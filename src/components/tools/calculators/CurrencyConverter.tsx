"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { convertCurrency } from "@/lib/calculators/currency";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { CURRENCIES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useRates } from "@/components/tools/useRates";
import type { CurrencyCode, ResultRow } from "@/lib/types";

const options = CURRENCIES.map((currency) => ({ value: currency.code, label: `${currency.code} — ${currency.name}` }));

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
        { label: `Converted to ${result.to}`, value: formatCurrency(result.converted, result.to as CurrencyCode), emphasize: true },
        { label: "Rate", value: `1 ${result.from} = ${result.rate} ${result.to}` },
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
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Convert currency</h2>
        <p className="mt-1 text-xs text-muted">
          {loading
            ? t("calculator.loading")
            : ratesError
              ? t("calculator.unavailable")
              : date
                ? `Rates last updated: ${date}${fetchedAt ? ` (fetched ${new Date(fetchedAt).toLocaleTimeString()})` : ""}`
                : ""}
        </p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="cc-amount" label="Amount" value={amount} onChange={setAmount} type="number" inputMode="decimal" min="0" step="any" />
          </FieldGrid>
          <FieldGrid>
            <SelectField id="cc-from" label="From" value={from} onChange={(value) => setFrom(value as CurrencyCode)} options={options} />
            <SelectField id="cc-to" label="To" value={to} onChange={(value) => setTo(value as CurrencyCode)} options={options} />
          </FieldGrid>
          <Button variant="secondary" onClick={swap}>⇅ Swap currencies</Button>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {ratesError ? (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {t("calculator.unavailable")}{" "}
              <button type="button" className="underline" onClick={reload}>Retry</button>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate} disabled={loading || !rates}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setAmount("100"); setFrom(currency); setTo("GBP"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Currency Converter" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/currency-converter?amount=${amount}&from=${from}&to=${to}`} onReset={() => reset(() => { setAmount("100"); })} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">
          {t("calculator.enterDetails")}
        </p>
      )}
      <p className="text-xs text-muted">
        Exchange rates fluctuate and card or bank providers may add a margin. Converted amounts are estimates.
        The currency shown in results follows your header preference ({currency}).{" "}
        <button type="button" className="text-brand underline" onClick={() => setCurrency(to)}>Set {to} as my currency</button>
      </p>
    </div>
  );
}
