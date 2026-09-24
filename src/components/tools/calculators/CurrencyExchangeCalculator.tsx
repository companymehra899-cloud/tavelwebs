"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { CURRENCIES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useRates } from "@/components/tools/useRates";
import type { CurrencyCode, ResultRow } from "@/lib/types";

interface ExchangeResult {
  referenceConverted: number;
  offeredConverted: number;
  difference: number;
  totalCost: number;
  effectiveRate: number;
}

const options = CURRENCIES.map((currency) => ({ value: currency.code, label: `${currency.code} — ${currency.name}` }));

export function CurrencyExchangeCalculator() {
  const { currency, t } = usePreferences();
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState<CurrencyCode>(currency);
  const [to, setTo] = useState<CurrencyCode>("GBP");
  const [offeredRate, setOfferedRate] = useState("0.83");
  const [fee, setFee] = useState("5");
  const { rates, date, loading, error: ratesError, reload } = useRates(from, CURRENCIES.map((c) => c.code));
  const { run, reset, result, error } = useCalculation<ExchangeResult>("Currency Exchange");

  function calculate() {
    if (!rates) {
      return;
    }
    run(() => {
      const referenceRate = to === from ? 1 : rates[to];
      if (!referenceRate || !Number.isFinite(referenceRate)) {
        throw new Error("That currency is not available in the current rate feed.");
      }
      const amountValue = parseNumberInputSafe(amount, "Please enter an amount of zero or more.", true, 0);
      const offered = parseNumberInputSafe(offeredRate, "Please enter the rate offered by your provider.");
      const feeValue = parseNumberInputSafe(fee, "Fee must be zero or more.", true, 0);
      const referenceConverted = amountValue * referenceRate;
      const offeredConverted = amountValue * offered;
      const difference = referenceConverted - offeredConverted;
      return {
        referenceConverted,
        offeredConverted,
        difference,
        totalCost: difference + feeValue,
        effectiveRate: offered,
      };
    });
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Reference rate conversion", value: formatCurrency(result.referenceConverted, to as CurrencyCode) },
        { label: "Provider rate conversion", value: formatCurrency(result.offeredConverted, to as CurrencyCode) },
        { label: "Rate difference cost", value: formatCurrency(result.difference, to as CurrencyCode) },
        { label: "Fixed fee", value: formatCurrency(parseNumberInputSafe(fee, "0", true, 0), to as CurrencyCode) },
        { label: "Total cost of exchange", value: formatCurrency(result.totalCost, to as CurrencyCode), emphasize: true },
      ]
    : [];

  const summary = result
    ? [
        "Currency Exchange Calculator",
        `Reference conversion: ${formatCurrency(result.referenceConverted, to as CurrencyCode)}`,
        `Provider conversion: ${formatCurrency(result.offeredConverted, to as CurrencyCode)}`,
        `Total cost: ${formatCurrency(result.totalCost, to as CurrencyCode)}`,
        date ? `Rates last updated: ${date}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Compare exchange rates</h2>
        <p className="mt-1 text-xs text-muted">
          {loading ? t("calculator.loading") : ratesError ? t("calculator.unavailable") : date ? `Reference rates last updated: ${date}` : ""}
        </p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="ce-amount" label="Amount to exchange" value={amount} onChange={setAmount} type="number" inputMode="decimal" min="0" step="any" />
            <SelectField id="ce-from" label="From" value={from} onChange={(value) => setFrom(value as CurrencyCode)} options={options} />
            <SelectField id="ce-to" label="To" value={to} onChange={(value) => setTo(value as CurrencyCode)} options={options} />
            <TextField id="ce-rate" label="Rate offered by your provider" value={offeredRate} onChange={setOfferedRate} type="number" inputMode="decimal" min="0" step="any" hint="1 unit of the base currency in the target currency." />
            <TextField id="ce-fee" label="Fixed fee" value={fee} onChange={setFee} type="number" inputMode="decimal" min="0" step="any" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {ratesError ? (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {t("calculator.unavailable")} <button type="button" className="underline" onClick={reload}>Retry</button>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate} disabled={loading || !rates}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setAmount("1000"); setOfferedRate("0.83"); setFee("5"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Currency Exchange" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/currency-exchange-calculator?amount=${amount}&from=${from}&to=${to}`} onReset={() => reset(() => { setAmount("1000"); })} />
      ) : (
        <p className="calc-empty">Enter an amount, the offered rate and any fee to see the real cost of exchanging money.</p>
      )}
    </div>
  );
}
