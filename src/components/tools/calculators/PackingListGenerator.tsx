"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { generatePackingList } from "@/lib/calculators/packing";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Icon } from "@/components/ui/Icon";
import type { TripType } from "@/lib/types";

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "city", label: "City break" },
  { value: "beach", label: "Beach" },
  { value: "business", label: "Business" },
  { value: "hiking", label: "Hiking" },
  { value: "winter", label: "Winter" },
  { value: "summer", label: "Summer" },
  { value: "family", label: "Family" },
  { value: "backpacking", label: "Backpacking" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface SavedState {
  destination: string;
  packed: string[];
  removed: string[];
  custom: { id: string; label: string; category: string }[];
}

export function PackingListGenerator() {
  const { t } = usePreferences();
  const [days, setDays] = useState("7");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [tripType, setTripType] = useState<TripType>("city");
  const [customLabel, setCustomLabel] = useState("");
  const [customCategory, setCustomCategory] = useState("Miscellaneous");
  const [saved, setSaved] = useState<SavedState>({ destination: "", packed: [], removed: [], custom: [] });
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const stored = readJson<SavedState>(STORAGE_KEYS.packing, { destination: "", packed: [], removed: [], custom: [] });
    setSaved({ destination: stored.destination ?? "", packed: stored.packed ?? [], removed: stored.removed ?? [], custom: stored.custom ?? [] });
  }, []);

  function persist(next: SavedState) {
    setSaved(next);
    writeJson(STORAGE_KEYS.packing, next);
  }

  const items = useMemo(() => {
    const generatedItems = generated
      ? generatePackingList({ days: Number(days) || 1, month: Number(month) || 1, tripType })
      : [];
    return [...generatedItems, ...saved.custom].filter((item) => !saved.removed.includes(item.id));
  }, [generated, days, month, tripType, saved.custom, saved.removed]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((item) => {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    });
    return Array.from(map.entries());
  }, [items]);

  function togglePacked(id: string) {
    const packed = saved.packed.includes(id) ? saved.packed.filter((item) => item !== id) : [...saved.packed, id];
    persist({ ...saved, packed });
  }

  function removeItem(id: string) {
    persist({ ...saved, removed: [...saved.removed, id] });
  }

  function addCustom() {
    if (!customLabel.trim()) {
      return;
    }
    persist({
      ...saved,
      custom: [...saved.custom, { id: `custom-${Date.now()}`, label: customLabel.trim(), category: customCategory }],
    });
    setCustomLabel("");
  }

  function resetAll() {
    persist({ destination: saved.destination, packed: [], removed: [], custom: [] });
    setGenerated(false);
  }

  const packedCount = items.filter((item) => saved.packed.includes(item.id)).length;
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="suitcase" size={17} className="text-accent" />
          Trip details
        </h2>
        <p className="mt-1 text-xs text-muted">{t("packing.intro")}</p>
        <div className="mt-4 space-y-4">
          <TextField
            id="pl-destination"
            label={t("packing.destination")}
            value={saved.destination}
            onChange={(value) => persist({ ...saved, destination: value })}
            placeholder={t("packing.destinationPlaceholder")}
          />
          <FieldGrid>
            <TextField id="pl-days" label={t("packing.duration")} value={days} onChange={setDays} type="number" inputMode="numeric" min="1" step="1" suffix="days" />
            <SelectField id="pl-month" label={t("packing.month")} value={month} onChange={setMonth} options={MONTHS.map((label, index) => ({ value: String(index + 1), label }))} />
            <SelectField id="pl-type" label={t("packing.tripType")} value={tripType} onChange={(value) => setTripType(value as TripType)} options={TRIP_TYPES} />
          </FieldGrid>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setGenerated(true)}>
              <Icon name="sparkle" size={15} />
              {t("packing.generate")}
            </Button>
            <Button variant="ghost" onClick={resetAll}>
              {t("calculator.reset")}
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <h3 className="text-sm font-semibold text-ink">{t("packing.addCustom")}</h3>
            <div className="mt-3 space-y-3">
              <TextField id="pl-custom" label={t("packing.item")} value={customLabel} onChange={setCustomLabel} placeholder={t("packing.itemPlaceholder")} />
              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-[180px] flex-1">
                  <SelectField
                    id="pl-cat"
                    label={t("packing.category")}
                    value={customCategory}
                    onChange={setCustomCategory}
                    options={["Documents", "Clothing", "Toiletries", "Electronics", "Medication reminder", "Travel accessories", "Miscellaneous"].map((value) => ({ value, label: value }))}
                  />
                </div>
                <Button variant="secondary" onClick={addCustom}>
                  <Icon name="plus" size={14} />
                  {t("packing.addItem")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CalculatorCard>

      {generated ? (
        <section aria-label="Packing list" className="print-block animate-rise overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow)] lg:sticky lg:top-24">
          <div className="border-b border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow text-accent">{t("packing.listTitle")}</p>
                <h2 className="mt-1 truncate text-lg font-bold text-ink">{saved.destination || t("packing.myTrip")}</h2>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-muted hover:text-ink"
              >
                <Icon name="print" size={14} />
                {t("packing.printList")}
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted">
                <span>
                  {packedCount} / {items.length} {t("packing.packed")}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--cyan))] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto p-5">
            {grouped.map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  <Icon name="check" size={13} className="text-accent" />
                  {category}
                </h3>
                <ul className="mt-2 space-y-1">
                  {categoryItems.map((item) => {
                    const packed = saved.packed.includes(item.id);
                    return (
                      <li key={item.id} className="group flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-muted">
                        <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-sm">
                          <input type="checkbox" checked={packed} onChange={() => togglePacked(item.id)} className="h-4 w-4 accent-[var(--accent)]" />
                          <span className={packed ? "text-muted line-through" : "text-ink"}>{item.label}</span>
                        </label>
                        <button type="button" onClick={() => removeItem(item.id)} aria-label="Remove item" className="no-print text-muted opacity-0 transition hover:text-error group-hover:opacity-100">
                          <Icon name="close" size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {grouped.length === 0 ? <p className="py-8 text-center text-sm text-muted">{t("packing.empty")}</p> : null}
          </div>
        </section>
      ) : (
        <p className="calc-empty">{t("packing.emptyState")}</p>
      )}
    </div>
  );
}
