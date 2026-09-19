"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DateInput, TextField } from "@/components/ui/Field";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";

interface CountdownState {
  name: string;
  date: string;
  time: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

function computeRemaining(target: number): Remaining {
  const diff = target - Date.now();
  const past = diff <= 0;
  const abs = Math.abs(diff);
  return {
    days: Math.floor(abs / 86400000),
    hours: Math.floor((abs % 86400000) / 3600000),
    minutes: Math.floor((abs % 3600000) / 60000),
    seconds: Math.floor((abs % 60000) / 1000),
    past,
  };
}

export function TripCountdown() {
  const { t } = usePreferences();
  const [name, setName] = useState("My trip");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00");
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = readJson<CountdownState | null>(STORAGE_KEYS.countdown, null);
    if (stored) {
      setName(stored.name);
      setDate(stored.date);
      setTime(stored.time);
    }
  }, []);

  useEffect(() => {
    if (!date) {
      return;
    }
    const target = new Date(`${date}T${time || "00:00"}:00`).getTime();
    if (!Number.isFinite(target)) {
      return;
    }
    setRemaining(computeRemaining(target));
    const interval = window.setInterval(() => setRemaining(computeRemaining(target)), 1000);
    return () => window.clearInterval(interval);
  }, [date, time]);

  function save() {
    writeJson(STORAGE_KEYS.countdown, { name, date, time });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const units = remaining
    ? [
        { label: "Days", value: remaining.days },
        { label: "Hours", value: remaining.hours },
        { label: "Minutes", value: remaining.minutes },
        { label: "Seconds", value: remaining.seconds },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="text-base font-semibold">Trip details</h2>
        <div className="mt-4 space-y-4">
          <TextField id="cd-name" label="Trip name" value={name} onChange={setName} placeholder="e.g. Summer in Italy" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateInput id="cd-date" label="Trip date" value={date} onChange={setDate} />
            <TextField id="cd-time" label="Trip time" value={time} onChange={setTime} placeholder="HH:MM" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={!date}>{saved ? "Saved" : "Save trip"}</Button>
            <Button variant="ghost" onClick={() => { setName("My trip"); setDate(""); setTime("08:00"); setRemaining(null); writeJson(STORAGE_KEYS.countdown, null); }}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </div>

      {remaining && date ? (
        <section aria-live="polite" className="rounded-2xl border border-brand/30 bg-brand-soft/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
            {remaining.past ? `${name} has started` : `${name} starts in`}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {units.map((unit) => (
              <div key={unit.label} className="rounded-xl border border-brand/20 bg-white p-3 text-center">
                <p className="text-2xl font-bold tabular-nums text-brand-strong">{unit.value}</p>
                <p className="text-xs text-muted">{unit.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Countdown uses your device&apos;s local time zone.</p>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">
          Choose a date to start the countdown.
        </p>
      )}
    </div>
  );
}
