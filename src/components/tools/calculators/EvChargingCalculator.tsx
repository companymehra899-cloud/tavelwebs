"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { UnitToggle } from "@/components/tools/UnitToggle";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateEvCharging } from "@/lib/calculators/evCharging";
import { formatCurrency, formatDistance, formatNumber, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ChargingType, ResultRow } from "@/lib/types";

export function EvChargingCalculator() {
  const { units, currency, t } = usePreferences();
  const [distance, setDistance] = useState("200");
  const [consumption, setConsumption] = useState("17");
  const [price, setPrice] = useState("0.35");
  const [startBattery, setStartBattery] = useState("20");
  const [targetBattery, setTargetBattery] = useState("80");
  const [capacity, setCapacity] = useState("60");
  const [chargingType, setChargingType] = useState<ChargingType>("home");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateEvCharging>>("EV Charging Cost");

  function calculate() {
    run(() =>
      calculateEvCharging({
        distance: parseNumberInputSafe(distance, "Please enter a distance greater than 0."),
        consumptionKwhPer100km: parseNumberInputSafe(consumption, "Please enter a valid consumption."),
        electricityPrice: parseNumberInputSafe(price, "Please enter a valid electricity price."),
        startBatteryPercent: parseNumberInputSafe(startBattery, "Enter a starting battery percentage."),
        targetBatteryPercent: parseNumberInputSafe(targetBattery, "Enter a target battery percentage."),
        batteryCapacityKwh: parseNumberInputSafe(capacity, "Enter a valid battery capacity."),
        chargingType,
        unitSystem: units,
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Distance", value: formatDistance(result.distanceKm, units === "imperial") },
        { label: "Energy required", value: `${formatNumber(result.energyRequiredKwh, { maximumFractionDigits: 2 })} kWh` },
        { label: "Charging cost", value: formatCurrency(result.chargingCost, currency), emphasize: true },
        { label: "Estimated cost per km", value: formatCurrency(result.costPerKm, currency) },
        { label: "Battery change", value: `${formatNumber(result.batteryDeltaPercent, { maximumFractionDigits: 1 })}%` },
      ]
    : [];

  const summary = result
    ? [
        "EV Charging Cost",
        `Energy required: ${formatNumber(result.energyRequiredKwh, { maximumFractionDigits: 2 })} kWh`,
        `Charging cost: ${formatCurrency(result.chargingCost, currency)}`,
        `Cost per km: ${formatCurrency(result.costPerKm, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">EV charging estimate</h2>
          <UnitToggle />
        </div>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="ev-distance" label={`Distance (${units === "imperial" ? "miles" : "km"})`} value={distance} onChange={setDistance} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ev-consumption" label="Consumption (kWh/100km)" value={consumption} onChange={setConsumption} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ev-price" label={`Electricity price per kWh`} value={price} onChange={setPrice} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ev-capacity" label="Battery capacity (kWh)" value={capacity} onChange={setCapacity} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ev-start" label="Starting battery (%)" value={startBattery} onChange={setStartBattery} type="number" inputMode="numeric" min="0" max="100" step="1" />
            <TextField id="ev-target" label="Target battery (%)" value={targetBattery} onChange={setTargetBattery} type="number" inputMode="numeric" min="0" max="100" step="1" />
          </FieldGrid>
          <fieldset>
            <legend className="text-sm font-medium">Charging type</legend>
            <div className="mt-2 inline-flex rounded-lg border border-border bg-white p-0.5">
              {(["home", "public"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={chargingType === value}
                  onClick={() => setChargingType(value)}
                  className={`min-h-9 rounded-md px-3 text-xs font-medium ${chargingType === value ? "bg-brand text-white" : "text-muted"}`}
                >
                  {value === "home" ? "Home charging" : "Public charging"}
                </button>
              ))}
            </div>
          </fieldset>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setDistance("200"); setConsumption("17"); setPrice("0.35"); setStartBattery("20"); setTargetBattery("80"); setCapacity("60"); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="EV Charging Cost" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/ev-charging-cost-calculator?distance=${distance}&price=${price}`} onReset={() => reset(() => { setDistance("200"); setConsumption("17"); setPrice("0.35"); })} />
      ) : (
        <p className="calc-empty">Enter distance, energy consumption and electricity price to estimate your charging cost.</p>
      )}
    </div>
  );
}
