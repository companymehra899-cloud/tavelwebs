"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

interface TripCostResult {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  other: number;
  total: number;
  perPerson: number;
}

export function TripCostCalculator() {
  const { currency, t } = usePreferences();
  const [transport, setTransport] = useState("400");
  const [accommodation, setAccommodation] = useState("600");
  const [food, setFood] = useState("300");
  const [activities, setActivities] = useState("150");
  const [other, setOther] = useState("100");
  const [travelers, setTravelers] = useState("2");
  const { run, reset, result, error } = useCalculation<TripCostResult>("Trip Cost");

  function calculate() {
    run(() => {
      const values = {
        transport: parseNumberInputSafe(transport, "Transport must be zero or more.", true, 0),
        accommodation: parseNumberInputSafe(accommodation, "Accommodation must be zero or more.", true, 0),
        food: parseNumberInputSafe(food, "Food must be zero or more.", true, 0),
        activities: parseNumberInputSafe(activities, "Activities must be zero or more.", true, 0),
        other: parseNumberInputSafe(other, "Other must be zero or more.", true, 0),
      };
      const travelersValue = parseNumberInputSafe(travelers, "Please enter at least one traveler.");
      const total = Object.values(values).reduce((sum, value) => sum + value, 0);
      return { ...values, total, perPerson: total / travelersValue };
    });
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Transport", value: formatCurrency(result.transport, currency) },
        { label: "Accommodation", value: formatCurrency(result.accommodation, currency) },
        { label: "Food", value: formatCurrency(result.food, currency) },
        { label: "Activities", value: formatCurrency(result.activities, currency) },
        { label: "Other", value: formatCurrency(result.other, currency) },
        { label: t("calculator.total"), value: formatCurrency(result.total, currency), emphasize: true },
        { label: t("calculator.perPerson"), value: formatCurrency(result.perPerson, currency), emphasize: true },
      ]
    : [];

  const summary = result
    ? [
        "Trip Cost",
        `Transport: ${formatCurrency(result.transport, currency)}`,
        `Accommodation: ${formatCurrency(result.accommodation, currency)}`,
        `Food: ${formatCurrency(result.food, currency)}`,
        `Total: ${formatCurrency(result.total, currency)}`,
        `Per person: ${formatCurrency(result.perPerson, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Trip category totals</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="tc-transport" label="Transport" value={transport} onChange={setTransport} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tc-accom" label="Accommodation" value={accommodation} onChange={setAccommodation} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tc-food" label="Food" value={food} onChange={setFood} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tc-activities" label="Activities" value={activities} onChange={setActivities} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tc-other" label="Other" value={other} onChange={setOther} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tc-travelers" label="Number of travelers" value={travelers} onChange={setTravelers} type="number" inputMode="numeric" min="1" step="1" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setTransport("400"); setAccommodation("600"); setFood("300"); setActivities("150"); setOther("100"); setTravelers("2"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Trip Cost" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/trip-cost-calculator?travelers=${travelers}`} onReset={() => reset(() => { setTransport("400"); setAccommodation("600"); setFood("300"); setActivities("150"); setOther("100"); })} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">Enter your transport, accommodation, food and activity costs to see the trip total.</p>
      )}
    </div>
  );
}
