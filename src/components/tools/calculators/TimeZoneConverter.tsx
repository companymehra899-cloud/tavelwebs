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
import { Icon } from "@/components/ui/Icon";
import type { ResultRow } from "@/lib/types";

const options = TIMEZONES.map((zone) => ({ value: zone, label: zone.replace(/_/g, " ") }));

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function cityName(zone: string): string {
  const parts = zone.split("/");
  return (parts[parts.length - 1] ?? zone).replace(/_/g, " ");
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
        { label: t("timezone.fromZone"), value: `${result.fromTimeZone.replace(/_/g, " ")} (${result.fromOffset})` },
        { label: t("timezone.toZone"), value: `${result.toTimeZone.replace(/_/g, " ")} (${result.toOffset})` },
        { label: `${t("timezone.converted")} (${result.toTimeZone.replace(/_/g, " ")})`, value: `${result.convertedDate} ${result.convertedTime}`, emphasize: true },
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

  const dateChanged = Boolean(result && result.convertedDate !== date);

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="globe" size={17} className="text-accent" />
          {t("timezone.convertTitle")}
        </h2>
        <p className="mt-1 text-xs text-muted">{t("timezone.dstNote")}</p>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <DateInput id="tz-date" label={t("timezone.date")} value={date} onChange={setDate} />
            <TextField id="tz-time" label={t("timezone.time")} value={time} onChange={setTime} placeholder="HH:MM" />
            <SelectField id="tz-from" label={t("timezone.fromZone")} value={from} onChange={setFrom} options={options} />
            <SelectField id="tz-to" label={t("timezone.toZone")} value={to} onChange={setTo} options={options} />
          </FieldGrid>
          {error ? <p role="alert" className="rounded-xl bg-error-soft px-3 py-2 text-sm text-error">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>
              <Icon name="calculator" size={15} />
              {t("calculator.calculate")}
            </Button>
            <Button variant="ghost" onClick={() => reset(() => { setDate(today()); setTime("09:00"); setFrom("Europe/London"); setTo("America/New_York"); })}>
              {t("calculator.reset")}
            </Button>
          </div>
        </div>
      </CalculatorCard>

      <div className="space-y-4">
        {result ? (
          <>
            <div className="print-block animate-rise overflow-hidden rounded-2xl border border-brand-strong/30 bg-[linear-gradient(150deg,#0b1b33_0%,#12315a_100%)] p-5 text-white shadow-[var(--shadow)]">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-200/80">{cityName(from)}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums">{time}</p>
                  <p className="mt-1 text-xs text-sky-200/70">{date}</p>
                </div>
                <div className="flex flex-col items-center text-sky-300">
                  <Icon name="arrow-right" size={20} />
                  <span className="mt-1 text-[0.6rem] uppercase tracking-wide">{result.fromOffset} → {result.toOffset}</span>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-200/80">{cityName(to)}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums">{result.convertedTime}</p>
                  <p className="mt-1 text-xs text-sky-200/70">{result.convertedDate}</p>
                </div>
              </div>
              {dateChanged ? (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
                  <Icon name="calendar" size={13} />
                  {t("timezone.dateChange")}
                </p>
              ) : null}
            </div>
            <ResultCard
              toolName="Time Zone Converter"
              title={t("calculator.result")}
              rows={rows}
              summary={summary}
              sharePath={`/tools/time-zone-converter?from=${from}&to=${to}`}
              onReset={() => reset(() => {})}
              icon="clock"
            />
          </>
        ) : (
          <p className="calc-empty">{t("timezone.empty")}</p>
        )}
      </div>
    </div>
  );
}
