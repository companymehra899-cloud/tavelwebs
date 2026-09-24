"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { UnitToggle } from "@/components/tools/UnitToggle";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateFuelCost } from "@/lib/calculators/fuel";
import { formatCurrency, formatDistance, formatVolume, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

interface DrivingCostResult {
  fuel: ReturnType<typeof calculateFuelCost>;
  wearCost: number;
  total: number;
}

export function DrivingCostCalculator() {
  const { units, currency, t } = usePreferences();
  const [distance, setDistance] = useState("250");
  const [consumption, setConsumption] = useState("6.5");
  const [fuelPrice, setFuelPrice] = useState("1.75");
  const [wearPerKm, setWearPerKm] = useState("0.05");
  const { run, reset, result, error } = useCalculation<DrivingCostResult>("Driving Cost");

  function calculate() {
    run(() => {
      const fuel = calculateFuelCost({
        distance: parseNumberInputSafe(distance, "Please enter a distance greater than 0."),
        consumption: parseNumberInputSafe(consumption, "Please enter a valid fuel consumption."),
        fuelPrice: parseNumberInputSafe(fuelPrice, "Please enter a valid fuel price."),
        unitSystem: units,
        fuelType: "petrol",
      });
      const wear = parseNumberInputSafe(wearPerKm, "Wear-and-tear cost must be zero or more.", true, 0);
      const wearCost = fuel.distanceKm * wear;
      return { fuel, wearCost, total: fuel.fuelCost + wearCost };
    });
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Distance", value: formatDistance(result.fuel.distanceKm, units === "imperial") },
        { label: "Fuel required", value: formatVolume(result.fuel.fuelRequiredLitres, units === "imperial") },
        { label: "Fuel cost", value: formatCurrency(result.fuel.fuelCost, currency) },
        { label: "Wear and tear", value: formatCurrency(result.wearCost, currency) },
        { label: "Total driving cost", value: formatCurrency(result.total, currency), emphasize: true },
      ]
    : [];

  const summary = result
    ? [
        "Driving Cost",
        `Distance: ${formatDistance(result.fuel.distanceKm, units === "imperial")}`,
        `Fuel cost: ${formatCurrency(result.fuel.fuelCost, currency)}`,
        `Wear and tear: ${formatCurrency(result.wearCost, currency)}`,
        `Total: ${formatCurrency(result.total, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Driving cost</h2>
          <UnitToggle />
        </div>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="dc-distance" label={`Distance (${units === "imperial" ? "miles" : "km"})`} value={distance} onChange={setDistance} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="dc-consumption" label={`Consumption (${units === "imperial" ? "MPG" : "L/100km"})`} value={consumption} onChange={setConsumption} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="dc-price" label="Fuel price per litre" value={fuelPrice} onChange={setFuelPrice} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="dc-wear" label="Wear and tear per km" value={wearPerKm} onChange={setWearPerKm} type="number" inputMode="decimal" min="0" step="any" hint="Optional. Tyres, servicing and depreciation estimate." />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setDistance("250"); setConsumption("6.5"); setFuelPrice("1.75"); setWearPerKm("0.05"); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Driving Cost" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/driving-cost-calculator?distance=${distance}&fuelPrice=${fuelPrice}`} onReset={() => reset(() => { setDistance("250"); setConsumption("6.5"); setFuelPrice("1.75"); setWearPerKm("0.05"); })} />
      ) : (
        <p className="calc-empty">Enter distance, fuel consumption and fuel price to estimate your driving cost.</p>
      )}
    </div>
  );
}
