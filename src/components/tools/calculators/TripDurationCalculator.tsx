"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { DateInput } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateTripDuration } from "@/lib/calculators/tripDuration";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

export function TripDurationCalculator() {
  const { t } = usePreferences();
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [inclusive, setInclusive] = useState(true);
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateTripDuration>>("Trip Duration");

  function calculate() {
    run(() => calculateTripDuration({ startDate, endDate, inclusive }));
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Days", value: `${result.days}`, emphasize: true },
        { label: "Nights", value: `${result.nights}`, emphasize: true },
        { label: "Weeks", value: `${result.weeks}` },
        { label: "Weekdays", value: `${result.weekdays}` },
        { label: "Weekend days", value: `${result.weekends}` },
        { label: "Counting", value: result.inclusive ? "Inclusive of both dates" : "Difference only" },
      ]
    : [];

  const summary = result
    ? [
        "Trip Duration",
        `Days: ${result.days}`,
        `Nights: ${result.nights}`,
        `Weeks: ${result.weeks}`,
        `Weekdays: ${result.weekdays}`,
        `Weekend days: ${result.weekends}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Date range</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <DateInput id="td-start" label="Start date" value={startDate} onChange={setStartDate} />
            <DateInput id="td-end" label="End date" value={endDate} onChange={setEndDate} />
          </FieldGrid>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inclusive} onChange={(event) => setInclusive(event.target.checked)} />
            Count both the start and end date as trip days
          </label>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setStartDate(today); setEndDate(today); setInclusive(true); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Trip Duration" title={t("calculator.result")} rows={rows} summary={summary} sharePath="/tools/trip-duration-calculator" onReset={() => reset(() => {})} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">Pick a start and end date to see the trip length in days, nights and weeks.</p>
      )}
    </div>
  );
}
