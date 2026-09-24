"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { DateInput, SelectField, TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateLayover } from "@/lib/calculators/layover";
import { TIMEZONES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

const timezoneOptions = [
  { value: "", label: "Same local time zone" },
  ...TIMEZONES.map((zone) => ({ value: zone, label: zone.replace(/_/g, " ") })),
];

export function LayoverCalculator() {
  const { t } = usePreferences();
  const today = new Date().toISOString().slice(0, 10);
  const [arrivalDate, setArrivalDate] = useState(today);
  const [arrivalTime, setArrivalTime] = useState("08:30");
  const [departureDate, setDepartureDate] = useState(today);
  const [departureTime, setDepartureTime] = useState("12:15");
  const [arrivalZone, setArrivalZone] = useState("");
  const [departureZone, setDepartureZone] = useState("");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateLayover>>("Layover");

  function calculate() {
    run(() =>
      calculateLayover({
        arrivalDate,
        arrivalTime,
        departureDate,
        departureTime,
        arrivalTimeZone: arrivalZone || undefined,
        departureTimeZone: departureZone || undefined,
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Total layover", value: `${result.hours} h ${result.minutes} min`, emphasize: true },
        { label: "Total minutes", value: `${result.totalMinutes} min` },
        { label: "Mode", value: result.timezoneAware ? "Time-zone aware" : "Same local time zone" },
      ]
    : [];

  const summary = result
    ? ["Layover", `Total layover: ${result.hours} h ${result.minutes} min`, `Timezone aware: ${result.timezoneAware ? "yes" : "no"}`].join("\n")
    : "";

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Connection time</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <DateInput id="lo-arr-date" label="Arrival date" value={arrivalDate} onChange={setArrivalDate} />
            <TextField id="lo-arr-time" label="Arrival time" value={arrivalTime} onChange={setArrivalTime} placeholder="HH:MM" />
            <SelectField id="lo-arr-zone" label="Arrival time zone" value={arrivalZone} onChange={setArrivalZone} options={timezoneOptions} />
            <DateInput id="lo-dep-date" label="Next departure date" value={departureDate} onChange={setDepartureDate} />
            <TextField id="lo-dep-time" label="Next departure time" value={departureTime} onChange={setDepartureTime} placeholder="HH:MM" />
            <SelectField id="lo-dep-zone" label="Departure time zone" value={departureZone} onChange={setDepartureZone} options={timezoneOptions} />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setArrivalDate(today); setArrivalTime("08:30"); setDepartureDate(today); setDepartureTime("12:15"); setArrivalZone(""); setDepartureZone(""); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Layover" title={t("calculator.result")} rows={rows} summary={summary} sharePath="/tools/layover-calculator" onReset={() => reset(() => {})} />
      ) : (
        <p className="calc-empty">Enter your arrival and departure times to calculate the layover length.</p>
      )}
    </div>
  );
}
