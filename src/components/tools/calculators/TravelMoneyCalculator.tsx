"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateTravelMoney } from "@/lib/calculators/travelMoney";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

export function TravelMoneyCalculator() {
  const { currency, t } = usePreferences();
  const [tripDays, setTripDays] = useState("10");
  const [dailyBudget, setDailyBudget] = useState("80");
  const [buffer, setBuffer] = useState("15");
  const [travelers, setTravelers] = useState("2");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateTravelMoney>>("Travel Money");

  function calculate() {
    run(() =>
      calculateTravelMoney({
        tripDays: parseNumberInputSafe(tripDays, "Please enter at least one day."),
        dailyBudget: parseNumberInputSafe(dailyBudget, "Please enter a daily budget greater than 0."),
        emergencyBufferPercent: parseNumberInputSafe(buffer, "Buffer must be between 0 and 100.", true, 0),
        travelers: parseNumberInputSafe(travelers, "Please enter at least one traveler."),
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Base budget", value: formatCurrency(result.baseBudget, currency) },
        { label: "Emergency buffer", value: formatCurrency(result.emergencyBuffer, currency) },
        { label: "Recommended planned budget", value: formatCurrency(result.totalBudget, currency), emphasize: true },
        { label: t("calculator.perPerson"), value: formatCurrency(result.perTraveler, currency) },
      ]
    : [];

  const summary = result
    ? [
        "Travel Money Calculator",
        `Base budget: ${formatCurrency(result.baseBudget, currency)}`,
        `Emergency buffer: ${formatCurrency(result.emergencyBuffer, currency)}`,
        `Recommended budget: ${formatCurrency(result.totalBudget, currency)}`,
        `Per traveler: ${formatCurrency(result.perTraveler, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Spending plan</h2>
        <p className="mt-1 text-xs text-muted">Based only on the values you enter. The tool does not know real destination prices.</p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="tm-days" label="Trip duration (days)" value={tripDays} onChange={setTripDays} type="number" inputMode="numeric" min="1" step="1" />
            <TextField id="tm-daily" label="Daily budget per person" value={dailyBudget} onChange={setDailyBudget} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tm-buffer" label="Emergency buffer (%)" value={buffer} onChange={setBuffer} type="number" inputMode="decimal" min="0" max="100" step="any" />
            <TextField id="tm-travelers" label="Number of travelers" value={travelers} onChange={setTravelers} type="number" inputMode="numeric" min="1" step="1" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setTripDays("10"); setDailyBudget("80"); setBuffer("15"); setTravelers("2"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Travel Money" title={t("calculator.result")} rows={rows} summary={summary} sharePath="/tools/travel-money-calculator" onReset={() => reset(() => {})} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">Enter your daily budget, trip length and travellers to see how much money to plan for.</p>
      )}
    </div>
  );
}
