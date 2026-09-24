"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DateInput, TextField } from "@/components/ui/Field";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";
import { Icon } from "@/components/ui/Icon";

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
        { label: t("countdown.days"), value: remaining.days },
        { label: t("countdown.hours"), value: remaining.hours },
        { label: t("countdown.minutes"), value: remaining.minutes },
        { label: t("countdown.seconds"), value: remaining.seconds },
      ]
    : [];

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="hourglass" size={17} className="text-accent" />
          {t("countdown.details")}
        </h2>
        <div className="mt-4 space-y-4">
          <TextField id="cd-name" label={t("countdown.name")} value={name} onChange={setName} placeholder={t("countdown.namePlaceholder")} />
          <FieldGrid>
            <DateInput id="cd-date" label={t("countdown.date")} value={date} onChange={setDate} />
            <TextField id="cd-time" label={t("countdown.time")} value={time} onChange={setTime} placeholder="HH:MM" />
          </FieldGrid>
          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={!date}>
              <Icon name="check" size={15} />
              {saved ? t("countdown.saved") : t("countdown.save")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setName("My trip");
                setDate("");
                setTime("08:00");
                setRemaining(null);
                writeJson(STORAGE_KEYS.countdown, null);
              }}
            >
              {t("calculator.reset")}
            </Button>
          </div>
          <p className="text-xs text-muted">{t("countdown.localNote")}</p>
        </div>
      </CalculatorCard>

      {remaining && date ? (
        <section aria-live="polite" className="print-block animate-rise overflow-hidden rounded-2xl border border-brand-strong/30 bg-[linear-gradient(150deg,#0b1b33_0%,#12315a_100%)] p-6 text-white shadow-[var(--shadow)] lg:sticky lg:top-24">
          <p className="eyebrow text-sky-300">
            {remaining.past ? t("countdown.started") : t("countdown.startsIn")}
          </p>
          <h2 className="mt-2 truncate text-2xl font-bold">{name}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {units.map((unit) => (
              <div key={unit.label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur">
                <p className="text-3xl font-bold tabular-nums sm:text-4xl">{String(unit.value).padStart(2, "0")}</p>
                <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-200/80">{unit.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-sky-200/70">
            {date} · {time}
          </p>
        </section>
      ) : (
        <p className="calc-empty">{t("countdown.empty")}</p>
      )}
    </div>
  );
}
