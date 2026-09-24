"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateFlightTime } from "@/lib/calculators/flightTime";
import { AIRPORTS } from "@/services/travel";
import { formatDistance, formatNumber, parseNumberInputSafe } from "@/lib/calculator-utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

const airportOptions = [
  { value: "", label: "Custom coordinates" },
  ...AIRPORTS.map((airport) => ({ value: airport.code, label: `${airport.code} — ${airport.city} (${airport.country})` })),
];

export function FlightTimeCalculator() {
  const { units, t } = usePreferences();
  const [originCode, setOriginCode] = useState("LHR");
  const [destinationCode, setDestinationCode] = useState("JFK");
  const [originLat, setOriginLat] = useState("51.47");
  const [originLon, setOriginLon] = useState("-0.4543");
  const [destinationLat, setDestinationLat] = useState("40.6413");
  const [destinationLon, setDestinationLon] = useState("-73.7781");
  const [speed, setSpeed] = useState("850");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateFlightTime>>("Flight Time");

  const originAirport = useMemo(() => AIRPORTS.find((a) => a.code === originCode), [originCode]);
  const destinationAirport = useMemo(() => AIRPORTS.find((a) => a.code === destinationCode), [destinationCode]);

  function calculate() {
    run(() => {
      const oLat = originAirport ? originAirport.lat : parseNumberInputSafe(originLat, "Enter a valid origin latitude.");
      const oLon = originAirport ? originAirport.lon : parseNumberInputSafe(originLon, "Enter a valid origin longitude.", true, 0);
      const dLat = destinationAirport ? destinationAirport.lat : parseNumberInputSafe(destinationLat, "Enter a valid destination latitude.");
      const dLon = destinationAirport ? destinationAirport.lon : parseNumberInputSafe(destinationLon, "Enter a valid destination longitude.", true, 0);
      return calculateFlightTime({
        originLat: oLat,
        originLon: oLon,
        destinationLat: dLat,
        destinationLon: dLon,
        averageSpeedKmh: parseNumberInputSafe(speed, "Please enter a valid average speed."),
      });
    });
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Great-circle distance", value: formatDistance(result.distanceKm, units === "imperial") },
        { label: "Estimated flight time", value: `${formatNumber(Math.floor(result.estimatedMinutes / 60), { maximumFractionDigits: 0 })} h ${formatNumber(result.estimatedMinutes % 60, { maximumFractionDigits: 0 })} min`, emphasize: true },
        { label: "Average speed used", value: `${formatNumber(result.averageSpeedKmh, { maximumFractionDigits: 0 })} km/h` },
      ]
    : [];

  const summary = result
    ? [
        "Flight Time Calculator (estimate)",
        `Distance: ${formatDistance(result.distanceKm, units === "imperial")}`,
        `Estimated duration: ${Math.floor(result.estimatedMinutes / 60)} h ${result.estimatedMinutes % 60} min`,
      ].join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Route</h2>
        <p className="mt-1 text-xs text-muted">Duration is a straight-line estimate, not an airline schedule.</p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <SelectField id="ft-origin" label="Origin airport" value={originCode} onChange={setOriginCode} options={airportOptions} />
            <SelectField id="ft-destination" label="Destination airport" value={destinationCode} onChange={setDestinationCode} options={airportOptions} />
          </FieldGrid>
          {!originAirport ? (
            <FieldGrid>
              <TextField id="ft-olat" label="Origin latitude" value={originLat} onChange={setOriginLat} type="number" inputMode="decimal" step="any" />
              <TextField id="ft-olon" label="Origin longitude" value={originLon} onChange={setOriginLon} type="number" inputMode="decimal" step="any" />
            </FieldGrid>
          ) : null}
          {!destinationAirport ? (
            <FieldGrid>
              <TextField id="ft-dlat" label="Destination latitude" value={destinationLat} onChange={setDestinationLat} type="number" inputMode="decimal" step="any" />
              <TextField id="ft-dlon" label="Destination longitude" value={destinationLon} onChange={setDestinationLon} type="number" inputMode="decimal" step="any" />
            </FieldGrid>
          ) : null}
          <TextField id="ft-speed" label="Average speed (km/h)" value={speed} onChange={setSpeed} type="number" inputMode="decimal" min="1" step="any" hint="Adjust to compare different cruise speeds." />
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setOriginCode("LHR"); setDestinationCode("JFK"); setSpeed("850"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Flight Time" title={`${t("calculator.result")} (${t("calculator.estimate")})`} rows={rows} summary={summary} sharePath={`/tools/flight-time-calculator?from=${originCode}&to=${destinationCode}`} onReset={() => reset(() => {})} />
      ) : (
        <p className="calc-empty">Enter an origin and destination to estimate the flight distance and duration.</p>
      )}
    </div>
  );
}
