"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateDailyBudget } from "@/lib/calculators/travelBudget";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

export function DailyBudgetCalculator() {
  const { currency, t } = usePreferences();
  const [accommodation, setAccommodation] = useState("90");
  const [food, setFood] = useState("40");
  const [transport, setTransport] = useState("15");
  const [activities, setActivities] = useState("20");
  const [other, setOther] = useState("10");
  const [days, setDays] = useState("7");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateDailyBudget>>("Daily Travel Budget");

  function calculate() {
    run(() =>
      calculateDailyBudget({
        accommodation: parseNumberInputSafe(accommodation, "Accommodation must be zero or more.", true, 0),
        food: parseNumberInputSafe(food, "Food must be zero or more.", true, 0),
        localTransport: parseNumberInputSafe(transport, "Transport must be zero or more.", true, 0),
        activities: parseNumberInputSafe(activities, "Activities must be zero or more.", true, 0),
        other: parseNumberInputSafe(other, "Other must be zero or more.", true, 0),
        days: parseNumberInputSafe(days, "Please enter at least one day."),
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Daily total", value: formatCurrency(result.dailyTotal, currency), emphasize: true },
        { label: "Weekly total", value: formatCurrency(result.weeklyTotal, currency) },
        { label: `Trip total (${result.days} days)`, value: formatCurrency(result.tripTotal, currency), emphasize: true },
      ]
    : [];

  const summary = result
    ? [
        "Daily Travel Budget",
        `Daily: ${formatCurrency(result.dailyTotal, currency)}`,
        `Weekly: ${formatCurrency(result.weeklyTotal, currency)}`,
        `Trip: ${formatCurrency(result.tripTotal, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Daily costs</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="db-accom" label="Daily accommodation" value={accommodation} onChange={setAccommodation} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="db-food" label="Food per day" value={food} onChange={setFood} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="db-transport" label="Local transport per day" value={transport} onChange={setTransport} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="db-activities" label="Activities per day" value={activities} onChange={setActivities} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="db-other" label="Other per day" value={other} onChange={setOther} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="db-days" label="Number of trip days" value={days} onChange={setDays} type="number" inputMode="numeric" min="1" step="1" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setAccommodation("90"); setFood("40"); setTransport("15"); setActivities("20"); setOther("10"); setDays("7"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Daily Travel Budget" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/daily-travel-budget-calculator?days=${days}`} onReset={() => reset(() => { setAccommodation("90"); setFood("40"); setDays("7"); })} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">{t("calculator.enterDetails")}</p>
      )}
    </div>
  );
}
