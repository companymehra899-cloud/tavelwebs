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
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">One amount, many currencies</h2>
        <p className="mt-1 text-xs text-muted">
          {loading ? t("calculator.loading") : ratesError ? t("calculator.unavailable") : date ? `Rates last updated: ${date}` : ""}
        </p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="mc-amount" label="Amount" value={amount} onChange={setAmount} type="number" inputMode="decimal" min="0" step="any" />
            <SelectField id="mc-base" label="Base currency" value={base} onChange={(value) => setBase(value as CurrencyCode)} options={options} />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {ratesError ? (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {t("calculator.unavailable")} <button type="button" className="underline" onClick={reload}>Retry</button>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate} disabled={loading || !rates}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setAmount("1000"); setBase(currency); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
        {result ? (
          <div className="mt-5">
            <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Result table</h3>
              <button
                type="button"
                className="text-xs text-brand underline"
                onClick={() => navigator.clipboard.writeText(summary)}
              >
                Copy result
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <caption className="sr-only">Converted amounts</caption>
                <thead className="bg-slate-50 text-left text-xs uppercase text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2">Currency</th>
                    <th scope="col" className="px-3 py-2 text-right">Amount</th>
                    <th scope="col" className="px-3 py-2 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {result.map((row) => (
                    <tr key={row.code}>
                      <th scope="row" className="px-3 py-2 font-medium">{row.code}</th>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {Number.isFinite(row.value) ? formatCurrency(row.value, row.code as CurrencyCode) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right text-xs tabular-nums text-muted">
                        {Number.isFinite(row.rate) ? row.rate : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted">
              Rates fluctuate and providers may add a margin. Amounts are estimates, not a quote.
              {date ? ` Rates last updated: ${date}.` : ""}
            </p>
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">{t("calculator.enterDetails")}</p>
        )}
      </CalculatorCard>
    </div>
  );
}
