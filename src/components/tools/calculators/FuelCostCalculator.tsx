"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { UnitToggle } from "@/components/tools/UnitToggle";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateFuelCost } from "@/lib/calculators/fuel";
import { formatCurrency, formatNumber, formatVolume, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { FuelType, ResultRow } from "@/lib/types";

export function FuelCostCalculator() {
  const { units, currency, t } = usePreferences();
  const [distance, setDistance] = useState("100");
  const [consumption, setConsumption] = useState("5");
  const [fuelPrice, setFuelPrice] = useState("1.75");
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateFuelCost>>("Fuel Cost");

  function calculate() {
    run(() =>
      calculateFuelCost({
        distance: parseNumberInputSafe(distance, "Please enter a distance greater than 0."),
        consumption: parseNumberInputSafe(consumption, "Please enter a valid fuel consumption."),
        fuelPrice: parseNumberInputSafe(fuelPrice, "Please enter a valid fuel price."),
        unitSystem: units,
        fuelType,
      }),
    );
  }

  const costPerUnit = result
    ? units === "imperial"
      ? formatCurrency(result.costPerMile, currency)
      : formatCurrency(result.costPerKm, currency)
    : "";

  const rows: ResultRow[] = result
    ? [
        { label: "Distance", value: units === "imperial" ? `${formatNumber(Number(distance), { maximumFractionDigits: 1 })} mi` : `${formatNumber(result.distanceKm, { maximumFractionDigits: 1 })} km` },
        { label: "Fuel required", value: formatVolume(result.fuelRequiredLitres, units === "imperial") },
        { label: "Fuel cost", value: formatCurrency(result.fuelCost, currency), emphasize: true },
        { label: units === "imperial" ? "Cost per mile" : "Cost per km", value: costPerUnit },
      ]
    : [];

  const summary = result
    ? [
        "Fuel Cost",
        `Distance: ${formatNumber(result.distanceKm, { maximumFractionDigits: 1 })} km`,
        `Fuel required: ${formatVolume(result.fuelRequiredLitres, units === "imperial")}`,
        `Fuel cost: ${formatCurrency(result.fuelCost, currency)}`,
        `${units === "imperial" ? "Cost per mile" : "Cost per km"}: ${costPerUnit}`,
      ].join("\n")
    : "";

  const sharePath = `/tools/fuel-cost-calculator?distance=${distance}&consumption=${consumption}&fuelPrice=${fuelPrice}`;

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Journey fuel cost</h2>
          <UnitToggle />
        </div>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="fc-distance" label={`Distance (${units === "imperial" ? "miles" : "km"})`} value={distance} onChange={setDistance} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="fc-consumption" label={`Consumption (${units === "imperial" ? "MPG" : "L/100km"})`} value={consumption} onChange={setConsumption} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="fc-price" label="Fuel price per litre/gallon" value={fuelPrice} onChange={setFuelPrice} type="number" inputMode="decimal" min="0" step="any" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fc-type" className="text-sm font-medium">Fuel type</label>
              <select id="fc-type" value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)} className="min-h-11 rounded-lg border border-border bg-white px-3 text-sm">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setDistance("100"); setConsumption("5"); setFuelPrice("1.75"); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Fuel Cost" title={t("calculator.result")} rows={rows} summary={summary} sharePath={sharePath} onReset={() => reset(() => { setDistance("100"); setConsumption("5"); setFuelPrice("1.75"); })} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">{t("calculator.enterDetails")}</p>
      )}
    </div>
  );
}
