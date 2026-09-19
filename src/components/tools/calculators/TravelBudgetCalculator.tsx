"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateTravelBudget } from "@/lib/calculators/travelBudget";
import { formatCurrency, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { BudgetStyle, ResultRow } from "@/lib/types";

const PRESETS: Record<BudgetStyle, { accommodation: string; food: string; transport: string; activities: string; other: string }> = {
  budget: { accommodation: "45", food: "25", transport: "15", activities: "10", other: "10" },
  "mid-range": { accommodation: "110", food: "45", transport: "30", activities: "25", other: "20" },
  comfortable: { accommodation: "220", food: "80", transport: "50", activities: "50", other: "40" },
};

export function TravelBudgetCalculator() {
  const { currency, t } = usePreferences();
  const [travelers, setTravelers] = useState("2");
  const [days, setDays] = useState("7");
  const [accommodation, setAccommodation] = useState(PRESETS["mid-range"].accommodation);
  const [food, setFood] = useState(PRESETS["mid-range"].food);
  const [transport, setTransport] = useState(PRESETS["mid-range"].transport);
  const [activities, setActivities] = useState(PRESETS["mid-range"].activities);
  const [other, setOther] = useState(PRESETS["mid-range"].other);
  const [style, setStyle] = useState<BudgetStyle>("mid-range");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateTravelBudget>>("Travel Budget");

  function applyPreset(next: BudgetStyle) {
    setStyle(next);
    setAccommodation(PRESETS[next].accommodation);
    setFood(PRESETS[next].food);
    setTransport(PRESETS[next].transport);
    setActivities(PRESETS[next].activities);
    setOther(PRESETS[next].other);
  }

  function calculate() {
    run(() =>
      calculateTravelBudget({
        travelers: parseNumberInputSafe(travelers, "Please enter at least one traveler."),
        days: parseNumberInputSafe(days, "Please enter at least one day."),
        accommodationPerNight: parseNumberInputSafe(accommodation, "Accommodation must be zero or more.", true, 0),
        foodPerDay: parseNumberInputSafe(food, "Food must be zero or more.", true, 0),
        transport: parseNumberInputSafe(transport, "Transport must be zero or more.", true, 0),
        activities: parseNumberInputSafe(activities, "Activities must be zero or more.", true, 0),
        other: parseNumberInputSafe(other, "Other must be zero or more.", true, 0),
        style,
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Accommodation total", value: formatCurrency(result.accommodationTotal, currency) },
        { label: "Food total", value: formatCurrency(result.foodTotal, currency) },
        { label: "Transport", value: formatCurrency(result.transport, currency) },
        { label: "Activities", value: formatCurrency(result.activities, currency) },
        { label: "Other", value: formatCurrency(result.other, currency) },
        { label: t("calculator.total"), value: formatCurrency(result.totalTripCost, currency), emphasize: true },
        { label: t("calculator.perPerson"), value: formatCurrency(result.costPerTraveler, currency), emphasize: true },
        { label: "Daily budget", value: formatCurrency(result.dailyBudget, currency) },
      ]
    : [];

  const summary = result
    ? [
        "Travel Budget",
        `Accommodation: ${formatCurrency(result.accommodationTotal, currency)}`,
        `Food: ${formatCurrency(result.foodTotal, currency)}`,
        `Total: ${formatCurrency(result.totalTripCost, currency)}`,
        `Per traveler: ${formatCurrency(result.costPerTraveler, currency)}`,
        `Daily: ${formatCurrency(result.dailyBudget, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Trip budget</h2>
        <fieldset className="mt-3">
          <legend className="text-sm font-medium">Style preset (editable)</legend>
          <div className="mt-2 inline-flex rounded-lg border border-border bg-white p-0.5">
            {(["budget", "mid-range", "comfortable"] as const).map((value) => (
              <button key={value} type="button" aria-pressed={style === value} onClick={() => applyPreset(value)} className={`min-h-9 rounded-md px-3 text-xs font-medium capitalize ${style === value ? "bg-brand text-white" : "text-muted"}`}>
                {value}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="tb-travelers" label="Number of travelers" value={travelers} onChange={setTravelers} type="number" inputMode="numeric" min="1" step="1" />
            <TextField id="tb-days" label="Number of days" value={days} onChange={setDays} type="number" inputMode="numeric" min="1" step="1" />
            <TextField id="tb-accom" label="Accommodation per night" value={accommodation} onChange={setAccommodation} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tb-food" label="Food per day (per person)" value={food} onChange={setFood} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tb-transport" label="Transport (total)" value={transport} onChange={setTransport} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tb-activities" label="Activities (total)" value={activities} onChange={setActivities} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="tb-other" label="Other expenses" value={other} onChange={setOther} type="number" inputMode="decimal" min="0" step="any" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setTravelers("2"); setDays("7"); applyPreset("mid-range"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Travel Budget" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/travel-budget-calculator?days=${days}&travelers=${travelers}`} onReset={() => reset(() => { setTravelers("2"); setDays("7"); applyPreset("mid-range"); })} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">{t("calculator.enterDetails")}</p>
      )}
    </div>
  );
}
