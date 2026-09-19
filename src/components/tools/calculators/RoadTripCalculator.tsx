"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldGrid, CalculatorCard } from "@/components/tools/CalculatorCard";
import { TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { UnitToggle } from "@/components/tools/UnitToggle";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateRoadTrip } from "@/lib/calculators/roadTrip";
import { formatCurrency, formatDistance, formatNumber, formatVolume, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { FuelType, ResultRow, TripDirection } from "@/lib/types";

export function RoadTripCalculator() {
  const { units, currency, t } = usePreferences();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("500");
  const [consumption, setConsumption] = useState("6.5");
  const [fuelPrice, setFuelPrice] = useState("1.75");
  const [travelers, setTravelers] = useState("2");
  const [direction, setDirection] = useState<TripDirection>("round-trip");
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [tolls, setTolls] = useState("0");
  const [parking, setParking] = useState("0");
  const [accommodation, setAccommodation] = useState("0");
  const [other, setOther] = useState("0");
  const [distanceNote, setDistanceNote] = useState<string | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateRoadTrip>>("Road Trip Cost");

  async function estimateDistance() {
    if (!origin || !destination) {
      setDistanceNote("Enter both a start and destination to estimate the distance.");
      return;
    }
    setLoadingDistance(true);
    setDistanceNote(null);
    try {
      const response = await fetch(
        `/api/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`,
      );
      if (!response.ok) {
        throw new Error("unavailable");
      }
      const data = (await response.json()) as { distanceKm: number; detourApplied: boolean };
      setDistance(String(data.distanceKm));
      setDistanceNote(
        `Estimated road distance ${formatNumber(data.distanceKm, { maximumFractionDigits: 1 })} km. Adjust it if you know the exact route.`,
      );
    } catch {
      setDistanceNote("Live data is temporarily unavailable. Enter the distance manually.");
    } finally {
      setLoadingDistance(false);
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
        fuelType,
        direction,
        tolls: parseNumberInputSafe(tolls, "Toll cost must be zero or more.", true, 0),
        parking: parseNumberInputSafe(parking, "Parking must be zero or more.", true, 0),
        accommodation: parseNumberInputSafe(accommodation, "Accommodation must be zero or more.", true, 0),
        other: parseNumberInputSafe(other, "Other expenses must be zero or more.", true, 0),
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Distance", value: formatDistance(result.distanceKm, units === "imperial") },
        { label: "Fuel needed", value: formatVolume(result.fuelRequiredLitres, units === "imperial") },
        { label: "Fuel cost", value: formatCurrency(result.fuelCost, currency) },
        { label: "Tolls", value: formatCurrency(result.tollCost, currency) },
        { label: "Parking", value: formatCurrency(result.parking, currency) },
        { label: "Accommodation", value: formatCurrency(result.accommodation, currency) },
        { label: "Other", value: formatCurrency(result.other, currency) },
        { label: t("calculator.total"), value: formatCurrency(result.totalTripCost, currency), emphasize: true },
        { label: t("calculator.perPerson"), value: formatCurrency(result.costPerPerson, currency), emphasize: true },
      ]
    : [];

  const summary = result
    ? [
        "Road Trip Cost",
        `Distance: ${formatDistance(result.distanceKm, units === "imperial")}`,
        `Fuel: ${formatVolume(result.fuelRequiredLitres, units === "imperial")}`,
        `Fuel cost: ${formatCurrency(result.fuelCost, currency)}`,
        `Tolls: ${formatCurrency(result.tollCost, currency)}`,
        `Total: ${formatCurrency(result.totalTripCost, currency)}`,
        `Per person: ${formatCurrency(result.costPerPerson, currency)}`,
      ].join("\n")
    : "";

  const sharePath = `/tools/road-trip-cost-calculator?distance=${distance}&consumption=${consumption}&fuelPrice=${fuelPrice}&travelers=${travelers}`;

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Trip details</h2>
          <UnitToggle />
        </div>
        <p className="mt-1 text-xs text-muted">
          Live fuel prices are not connected. Enter the price you expect to pay.
        </p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="origin" label="Starting location" value={origin} onChange={setOrigin} placeholder="e.g. Berlin" autoComplete="off" />
            <TextField id="destination" label="Destination" value={destination} onChange={setDestination} placeholder="e.g. Rome" autoComplete="off" />
          </FieldGrid>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={estimateDistance} disabled={loadingDistance}>
              {loadingDistance ? t("calculator.loading") : "Estimate distance"}
            </Button>
            {distanceNote ? <p className="text-xs text-muted">{distanceNote}</p> : null}
          </div>
          <FieldGrid>
            <TextField id="rt-distance" label={`Distance (${units === "imperial" ? "miles" : "km"})`} value={distance} onChange={setDistance} type="number" inputMode="decimal" min="0" step="any" error={error ? undefined : undefined} />
            <TextField id="rt-consumption" label={`Fuel consumption (${units === "imperial" ? "MPG" : "L/100km"})`} value={consumption} onChange={setConsumption} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="rt-fuel-price" label="Fuel price per litre/gallon" value={fuelPrice} onChange={setFuelPrice} type="number" inputMode="decimal" min="0" step="any" />
            <TextField id="rt-travelers" label="Number of travelers" value={travelers} onChange={setTravelers} type="number" inputMode="numeric" min="1" step="1" />
          </FieldGrid>
          <FieldGrid columns={3}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rt-fuel-type" className="text-sm font-medium">Fuel type</label>
              <select id="rt-fuel-type" value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)} className="min-h-11 rounded-lg border border-border bg-white px-3 text-sm">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rt-direction" className="text-sm font-medium">Trip type</label>
              <select id="rt-direction" value={direction} onChange={(e) => setDirection(e.target.value as TripDirection)} className="min-h-11 rounded-lg border border-border bg-white px-3 text-sm">
                <option value="one-way">One-way</option>
                <option value="round-trip">Round trip</option>
              </select>
            </div>
          </FieldGrid>
          <div>
            <h3 className="text-sm font-semibold">Optional costs</h3>
            <div className="mt-3">
              <FieldGrid>
                <TextField id="rt-tolls" label="Tolls" value={tolls} onChange={setTolls} type="number" inputMode="decimal" min="0" step="any" />
                <TextField id="rt-parking" label="Parking" value={parking} onChange={setParking} type="number" inputMode="decimal" min="0" step="any" />
                <TextField id="rt-accommodation" label="Accommodation" value={accommodation} onChange={setAccommodation} type="number" inputMode="decimal" min="0" step="any" />
                <TextField id="rt-other" label="Other expenses" value={other} onChange={setOther} type="number" inputMode="decimal" min="0" step="any" />
              </FieldGrid>
            </div>
          </div>
          {error ? (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setOrigin(""); setDestination(""); setDistance("500"); setConsumption("6.5"); setFuelPrice("1.75"); setTravelers("2"); setTolls("0"); setParking("0"); setAccommodation("0"); setOther("0"); setDistanceNote(null); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Road Trip Cost" title={t("calculator.result")} rows={rows} summary={summary} sharePath={sharePath} onReset={() => reset(() => { setDistance("500"); setConsumption("6.5"); setFuelPrice("1.75"); setTravelers("2"); setTolls("0"); setParking("0"); setAccommodation("0"); setOther("0"); })} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">Enter your route details to estimate fuel, tolls and the total road trip cost.</p>
      )}
    </div>
  );
}
