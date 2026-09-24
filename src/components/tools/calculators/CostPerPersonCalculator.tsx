"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateCostPerPerson } from "@/lib/calculators/travelBudget";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

export function CostPerPersonCalculator() {
  const { currency, t } = usePreferences();
  const [totalCost, setTotalCost] = useState("1200");
  const [travelers, setTravelers] = useState("2");
  const [custom, setCustom] = useState(false);
  const [shares, setShares] = useState<string[]>(["1", "1"]);
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateCostPerPerson>>("Cost Per Person");

  function updateShare(index: number, value: string) {
    setShares((current) => current.map((item, i) => (i === index ? value : item)));
  }

  function changeTravelers(value: string) {
    setTravelers(value);
    const count = Math.min(Math.max(Number(value) || 1, 1), 20);
    setShares((current) => Array.from({ length: count }, (_, i) => current[i] ?? "1"));
  }

  function calculate() {
    run(() =>
      calculateCostPerPerson({
        totalCost: parseNumberInputSafe(totalCost, "Please enter a total cost greater than 0."),
        travelers: parseNumberInputSafe(travelers, "Please enter at least one traveler."),
        shares: custom ? shares.map((share) => parseNumberInputSafe(share, "Shares must be zero or more.", true, 0)) : undefined,
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Equal split", value: formatCurrency(result.equalSplit, currency), emphasize: !custom },
        ...result.shares.map((share) => ({
          label: share.label,
          value: formatCurrency(share.amount, currency),
          emphasize: custom,
        })),
      ]
    : [];

  const summary = result
    ? [
        "Cost Per Person",
        `Total: ${formatCurrency(Number(totalCost), currency)}`,
        ...result.shares.map((share) => `${share.label}: ${formatCurrency(share.amount, currency)}`),
      ].join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Split the cost</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="cpp-total" label="Total trip cost" value={totalCost} onChange={setTotalCost} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="cpp-travelers" label="Number of travelers" value={travelers} onChange={changeTravelers} type="number" inputMode="numeric" min="1" max="20" step="1" />
          </FieldGrid>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={custom} onChange={(event) => setCustom(event.target.checked)} />
            Use different shares per traveler
          </label>
          {custom ? (
            <FieldGrid>
              {shares.map((share, index) => (
                <TextField key={index} id={`cpp-share-${index}`} label={`Traveler ${index + 1} share weight`} value={share} onChange={(value) => updateShare(index, value)} type="number" inputMode="decimal" min="0" step="any" />
              ))}
            </FieldGrid>
          ) : null}
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setTotalCost("1200"); setTravelers("2"); setCustom(false); setShares(["1", "1"]); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Cost Per Person" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/cost-per-person-calculator?total=${totalCost}&travelers=${travelers}`} onReset={() => reset(() => { setTotalCost("1200"); setTravelers("2"); setCustom(false); setShares(["1", "1"]); })} />
      ) : (
        <p className="calc-empty">Enter the trip total and number of travellers to see what each person pays.</p>
      )}
    </div>
  );
}
