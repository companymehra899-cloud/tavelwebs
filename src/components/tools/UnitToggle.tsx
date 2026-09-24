"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";

export function UnitToggle() {
  const { units, setUnits, t } = usePreferences();
  return (
    <fieldset className="no-print inline-flex items-center rounded-full border border-border bg-surface-muted p-0.5">
      <legend className="sr-only">{t("units.unitSystem")}</legend>
      {(["metric", "imperial"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={units === value}
          onClick={() => setUnits(value)}
          className={`min-h-8 rounded-full px-3 text-xs font-semibold transition ${
            units === value ? "bg-brand text-white shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {value === "metric" ? t("units.metricShort") : t("units.imperialShort")}
        </button>
      ))}
    </fieldset>
  );
}
