"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { UnitToggle } from "@/components/tools/UnitToggle";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateRoadTrip } from "@/lib/calculators/roadTrip";
import { formatCurrency, formatDistance, formatVolume, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

export function FuelTollCalculator() {
  const { units, currency, t } = usePreferences();
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("400");
  const [consumption, setConsumption] = useState("6");
  const [fuelPrice, setFuelPrice] = useState("1.75");
  const [toll, setToll] = useState("30");
  const [travelers, setTravelers] = useState("2");
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateRoadTrip>>("Fuel + Toll");

  async function estimateDistance() {
    if (!start || !destination) {
      setNote("Enter both a start and destination to estimate the distance.");
      return;
    }
    setLoading(true);
    setNote(null);
    try {
      const response = await fetch(`/api/distance?origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}`);
      if (!response.ok) throw new Error("unavailable");
      const data = (await response.json()) as { distanceKm: number };
      setDistance(String(data.distanceKm));
      setNote("Estimated road distance applied. Adjust it if you know the exact route.");
    } catch {
      setNote("Live data is temporarily unavailable. Enter the distance manually.");
    } finally {
      setLoading(false);
    }
  }

  function calculate() {
    run(() =>
      calculateRoadTrip({
        distanceKm: parseNumberInputSafe(distance, "Please enter a distance greater than 0."),
        consumption: parseNumberInputSafe(consumption, "Please enter a valid fuel consumption."),
        fuelPrice: parseNumberInputSafe(fuelPrice, "Please enter a valid fuel price."),
        travelers: parseNumberInputSafe(travelers, "Please enter at least one traveler."),
        unitSystem: units,
        fuelType: "petrol",
        direction: "one-way",
        tolls: parseNumberInputSafe(toll, "Toll cost must be zero or more.", true, 0),
        parking: 0,
        accommodation: 0,
        other: 0,
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Distance", value: formatDistance(result.distanceKm, units === "imperial") },
        { label: "Fuel required", value: formatVolume(result.fuelRequiredLitres, units === "imperial") },
        { label: "Fuel cost", value: formatCurrency(result.fuelCost, currency) },
        { label: "Tolls", value: formatCurrency(result.tollCost, currency) },
        { label: "Total driving cost", value: formatCurrency(result.totalTripCost, currency), emphasize: true },
        { label: t("calculator.perPerson"), value: formatCurrency(result.costPerPerson, currency), emphasize: true },
      ]
    : [];

  const summary = result
    ? [
        "Fuel + Toll",
        `Fuel cost: ${formatCurrency(result.fuelCost, currency)}`,
        `Tolls: ${formatCurrency(result.tollCost, currency)}`,
        `Total: ${formatCurrency(result.totalTripCost, currency)}`,
        `Per person: ${formatCurrency(result.costPerPerson, currency)}`,
      ].join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Fuel and tolls</h2>
          <UnitToggle />
        </div>
        <p className="mt-1 text-xs text-muted">Toll prices are entered by you. This tool never invents toll data.</p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="ft-start" label="Start" value={start} onChange={setStart} placeholder="e.g. Paris" autoComplete="off" />
            <TextField id="ft-dest" label="Destination" value={destination} onChange={setDestination} placeholder="e.g. Lyon" autoComplete="off" />
          </FieldGrid>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={estimateDistance} disabled={loading}>
              {loading ? t("calculator.loading") : "Estimate distance"}
            </Button>
            {note ? <p className="text-xs text-muted">{note}</p> : null}
          </div>
          <FieldGrid>
            <TextField id="ft-distance" label={`Distance (${units === "imperial" ? "miles" : "km"})`} value={distance} onChange={setDistance} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ft-consumption" label={`Consumption (${units === "imperial" ? "MPG" : "L/100km"})`} value={consumption} onChange={setConsumption} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ft-price" label="Fuel price per litre" value={fuelPrice} onChange={setFuelPrice} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ft-toll" label="Toll cost" value={toll} onChange={setToll} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="ft-travelers" label="Number of travelers" value={travelers} onChange={setTravelers} type="number" inputMode="numeric" min="1" step="1" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setStart(""); setDestination(""); setDistance("400"); setConsumption("6"); setFuelPrice("1.75"); setToll("30"); setTravelers("2"); setNote(null); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Fuel + Toll" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/fuel-toll-calculator?distance=${distance}&fuelPrice=${fuelPrice}&toll=${toll}`} onReset={() => reset(() => { setDistance("400"); setConsumption("6"); setFuelPrice("1.75"); setToll("30"); })} />
      ) : (
        <p className="calc-empty">Enter your distance, fuel use and tolls to estimate the total cost.</p>
      )}
    </div>
  );
}
