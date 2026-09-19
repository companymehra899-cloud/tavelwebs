"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { DateInput, SelectField, TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { calculateJetLag } from "@/lib/calculators/jetLag";
import { TIMEZONES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

const options = TIMEZONES.map((zone) => ({ value: zone, label: zone.replace(/_/g, " ") }));

export function JetLagCalculator() {
  const { t } = usePreferences();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState("Europe/London");
  const [to, setTo] = useState("America/New_York");
  const [departureDate, setDepartureDate] = useState(today);
  const [departureTime, setDepartureTime] = useState("10:00");
  const [arrivalDate, setArrivalDate] = useState(today);
  const [arrivalTime, setArrivalTime] = useState("13:00");
  const [direction, setDirection] = useState<"east" | "west" | "auto">("auto");
  const [tripDays, setTripDays] = useState("7");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof calculateJetLag>>("Jet Lag");

  function calculate() {
    run(() =>
      calculateJetLag({
        originTimeZone: from,
        destinationTimeZone: to,
        departureIso: `${departureDate}T${departureTime}:00Z`,
        arrivalIso: `${arrivalDate}T${arrivalTime}:00Z`,
        direction,
        tripDays: Number(tripDays) || 7,
      }),
    );
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Time difference", value: `${result.timeDifferenceHours} hours ${result.direction}` },
        { label: "Suggested recovery window", value: `${result.recoveryDays} days` },
      ]
    : [];

  const summary = result
    ? [
        "Jet Lag Calculator",
        `Time difference: ${result.timeDifferenceHours} hours (${result.direction})`,
        `Suggested recovery: ${result.recoveryDays} days`,
        ...result.adjustmentSchedule,
        `Light: ${result.lightExposure.join(" ")}`,
        `Sleep: ${result.sleepTiming.join(" ")}`,
        result.disclaimer,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Flight and time difference</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <SelectField id="jl-from" label="Origin time zone" value={from} onChange={setFrom} options={options} />
            <SelectField id="jl-to" label="Destination time zone" value={to} onChange={setTo} options={options} />
            <DateInput id="jl-dep-date" label="Departure date" value={departureDate} onChange={setDepartureDate} />
            <TextField id="jl-dep-time" label="Departure time" value={departureTime} onChange={setDepartureTime} placeholder="HH:MM" />
            <DateInput id="jl-arr-date" label="Arrival date" value={arrivalDate} onChange={setArrivalDate} />
            <TextField id="jl-arr-time" label="Arrival time" value={arrivalTime} onChange={setArrivalTime} placeholder="HH:MM" />
            <SelectField id="jl-direction" label="Travel direction" value={direction} onChange={(value) => setDirection(value as "east" | "west" | "auto")} options={[{ value: "auto", label: "Auto detect" }, { value: "east", label: "Flying east" }, { value: "west", label: "Flying west" }]} />
            <TextField id="jl-days" label="Trip duration (days)" value={tripDays} onChange={setTripDays} type="number" inputMode="numeric" min="1" step="1" />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setFrom("Europe/London"); setTo("America/New_York"); setDirection("auto"); setTripDays("7"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <>
          <ResultCard toolName="Jet Lag" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/jet-lag-calculator?from=${from}&to=${to}`} onReset={() => reset(() => {})} />
          <section aria-labelledby="jl-plan" className="rounded-2xl border border-border bg-white p-5">
            <h2 id="jl-plan" className="text-lg font-semibold">Suggested adjustment schedule</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
              {result.adjustmentSchedule.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <h3 className="mt-4 text-sm font-semibold text-foreground">Light exposure</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
              {result.lightExposure.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h3 className="mt-4 text-sm font-semibold text-foreground">Sleep timing</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
              {result.sleepTiming.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{result.disclaimer}</p>
          </section>
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">{t("calculator.enterDetails")}</p>
      )}
    </div>
  );
}
