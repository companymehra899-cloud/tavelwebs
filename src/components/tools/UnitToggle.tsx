"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";

export function UnitToggle() {
  const { units, setUnits, t } = usePreferences();
  return (
    <fieldset className="no-print inline-flex items-center rounded-lg border border-border bg-white p-0.5">
      <legend className="sr-only">{t("units.unitSystem")}</legend>
      {(["metric", "imperial"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={units === value}
          onClick={() => setUnits(value)}
          className={`min-h-9 rounded-md px-3 text-xs font-medium transition ${
            units === value ? "bg-brand text-white" : "text-muted hover:bg-slate-100"
          }`}
        >
          {value === "metric" ? t("units.metric") : t("units.imperial")}
        </button>
      ))}
    </fieldset>
  );
}
