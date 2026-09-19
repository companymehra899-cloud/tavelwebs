"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorCard, FieldGrid } from "@/components/tools/CalculatorCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { generatePackingList } from "@/lib/calculators/packing";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";
import { usePreferences } from "@/components/providers/PreferencesProvider";
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
  const [saved, setSaved] = useState<SavedState>({ packed: [], removed: [], custom: [] });
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setSaved(readJson<SavedState>(STORAGE_KEYS.packing, { packed: [], removed: [], custom: [] }));
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
    const packed = saved.packed.includes(id)
      ? saved.packed.filter((item) => item !== id)
      : [...saved.packed, id];
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
    persist({ packed: [], removed: [], custom: [] });
    setGenerated(false);
  }

  const packedCount = items.filter((item) => saved.packed.includes(item.id)).length;

  return (
    <div className="space-y-5">
      <CalculatorCard>
        <h2 className="text-base font-semibold">Trip details</h2>
        <div className="mt-4 space-y-4">
          <FieldGrid>
            <TextField id="pl-days" label="Trip duration (days)" value={days} onChange={setDays} type="number" inputMode="numeric" min="1" step="1" />
            <SelectField id="pl-month" label="Travel month" value={month} onChange={setMonth} options={MONTHS.map((label, index) => ({ value: String(index + 1), label }))} />
            <SelectField id="pl-type" label="Trip type" value={tripType} onChange={(value) => setTripType(value as TripType)} options={TRIP_TYPES} />
          </FieldGrid>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setGenerated(true)}>Generate packing list</Button>
            <Button variant="ghost" onClick={resetAll}>{t("calculator.reset")}</Button>
          </div>
        </div>
      </CalculatorCard>

      {generated ? (
        <>
          <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
            <p className="text-sm text-muted">
              {packedCount} of {items.length} items packed
            </p>
            <Button variant="secondary" onClick={() => window.print()}>Print / Save as PDF</Button>
          </div>

          <section aria-label="Packing list" className="space-y-4">
            {grouped.map(([category, categoryItems]) => (
              <div key={category} className="rounded-2xl border border-border bg-white p-4">
                <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                <ul className="mt-2 space-y-1.5">
                  {categoryItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={saved.packed.includes(item.id)}
                          onChange={() => togglePacked(item.id)}
                          className="h-4 w-4"
                        />
                        <span className={saved.packed.includes(item.id) ? "text-muted line-through" : ""}>{item.label}</span>
                      </label>
                      <button type="button" onClick={() => removeItem(item.id)} className="no-print text-xs text-red-600 hover:underline">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <div className="no-print rounded-2xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold">Add a custom item</h3>
            <div className="mt-3">
              <FieldGrid columns={3}>
                <TextField id="pl-custom" label="Item" value={customLabel} onChange={setCustomLabel} placeholder="e.g. Travel pillow" />
                <SelectField id="pl-cat" label="Category" value={customCategory} onChange={setCustomCategory} options={["Documents", "Clothing", "Toiletries", "Electronics", "Medication reminder", "Travel accessories", "Miscellaneous"].map((value) => ({ value, label: value }))} />
                <div className="flex items-end">
                  <Button onClick={addCustom}>Add item</Button>
                </div>
              </FieldGrid>
            </div>
          </div>
          <p className="text-xs text-muted">Your list is saved in this browser. Use Print to save it as a PDF.</p>
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">
          Choose your trip details and generate a packing list. The list uses fixed rules, so it is always predictable.
        </p>
      )}
    </div>
  );
}
