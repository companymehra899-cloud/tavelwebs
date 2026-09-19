"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { DateInput, SelectField, TextField } from "@/components/ui/Field";
import { ResultCard } from "@/components/tools/ResultCard";
import { useCalculation } from "@/components/tools/useCalculation";
import { convertTimeZone } from "@/lib/calculators/timeZone";
import { TIMEZONES } from "@/lib/constants";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { ResultRow } from "@/lib/types";

const options = TIMEZONES.map((zone) => ({ value: zone, label: zone.replace(/_/g, " ") }));

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TimeZoneConverter() {
  const { t } = usePreferences();
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("09:00");
  const [from, setFrom] = useState("Europe/London");
  const [to, setTo] = useState("America/New_York");
  const { run, reset, result, error } = useCalculation<ReturnType<typeof convertTimeZone>>("Time Zone Converter");

  function calculate() {
    run(() => convertTimeZone({ date, time, fromTimeZone: from, toTimeZone: to }));
  }

  const rows: ResultRow[] = result
    ? [
        { label: "Converted date", value: result.convertedDate },
        { label: "Converted time", value: result.convertedTime, emphasize: true },
        { label: "From time zone", value: `${result.fromTimeZone.replace(/_/g, " ")} (${result.fromOffset})` },
        { label: "To time zone", value: `${result.toTimeZone.replace(/_/g, " ")} (${result.toOffset})` },
      ]
    : [];

  const summary = result
    ? [
        "Time Zone Converter",
        `${date} ${time} in ${from}`,
        `= ${result.convertedDate} ${result.convertedTime} in ${to}`,
        `Offsets: ${result.fromOffset} → ${result.toOffset}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Convert a date and time</h2>
        <p className="mt-1 text-xs text-muted">Daylight saving is handled automatically using the IANA time zone database.</p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <DateInput id="tz-date" label="Date" value={date} onChange={setDate} />
            <TextField id="tz-time" label="Time" value={time} onChange={setTime} placeholder="HH:MM" />
            <SelectField id="tz-from" label="From time zone" value={from} onChange={setFrom} options={options} />
            <SelectField id="tz-to" label="To time zone" value={to} onChange={setTo} options={options} />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>{t("calculator.calculate")}</Button>
            <Button variant="ghost" onClick={() => reset(() => { setDate(today()); setTime("09:00"); setFrom("Europe/London"); setTo("America/New_York"); })}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>
      {result ? (
        <ResultCard toolName="Time Zone Converter" title={t("calculator.result")} rows={rows} summary={summary} sharePath={`/tools/time-zone-converter?from=${from}&to=${to}`} onReset={() => reset(() => {})} />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">Enter a date, time and both time zones to see the converted time.</p>
      )}
    </div>
  );
}
