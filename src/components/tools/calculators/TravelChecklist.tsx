"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { CalculatorCard } from "@/components/tools/CalculatorCard";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Icon } from "@/components/ui/Icon";

interface Task {
  id: string;
  label: string;
}

const CATEGORIES: { title: string; tasks: Task[] }[] = [
  {
    title: "Before booking",
    tasks: [
      { id: "bb1", label: "Check passport validity for your destination" },
      { id: "bb2", label: "Compare travel dates and prices" },
      { id: "bb3", label: "Check visa or entry requirements with official sources" },
      { id: "bb4", label: "Decide on travel insurance" },
    ],
  },
  {
    title: "Before departure",
    tasks: [
      { id: "bd1", label: "Check in online where available" },
      { id: "bd2", label: "Confirm accommodation details" },
      { id: "bd3", label: "Download offline maps and tickets" },
      { id: "bd4", label: "Charge devices and power banks" },
    ],
  },
  {
    title: "Airport",
    tasks: [
      { id: "ap1", label: "Arrive with enough time for security" },
      { id: "ap2", label: "Keep liquids and electronics accessible" },
      { id: "ap3", label: "Check gate and boarding time" },
    ],
  },
  {
    title: "Documents",
    tasks: [
      { id: "dc1", label: "Passport and boarding passes" },
      { id: "dc2", label: "Travel insurance details" },
      { id: "dc3", label: "Booking confirmations" },
      { id: "dc4", label: "Emergency contact list" },
    ],
  },
  {
    title: "Money",
    tasks: [
      { id: "mo1", label: "Tell your bank you are travelling" },
      { id: "mo2", label: "Carry a small amount of local currency" },
      { id: "mo3", label: "Check card fees abroad" },
    ],
  },
  {
    title: "Packing",
    tasks: [
      { id: "pk1", label: "Check airline baggage allowance" },
      { id: "pk2", label: "Pack medication in hand luggage" },
      { id: "pk3", label: "Use the packing list generator" },
    ],
  },
  {
    title: "Home preparation",
    tasks: [
      { id: "hp1", label: "Arrange pet or plant care" },
      { id: "hp2", label: "Unplug non-essential appliances" },
      { id: "hp3", label: "Secure windows and doors" },
      { id: "hp4", label: "Leave keys with someone you trust" },
    ],
  },
];

interface ChecklistState {
  completed: string[];
  custom: Task[];
}

export function TravelChecklist() {
  const { t } = usePreferences();
  const [state, setState] = useState<ChecklistState>({ completed: [], custom: [] });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    setState(readJson<ChecklistState>(STORAGE_KEYS.checklist, { completed: [], custom: [] }));
  }, []);

  function persist(next: ChecklistState) {
    setState(next);
    writeJson(STORAGE_KEYS.checklist, next);
  }

  const allTasks = useMemo(() => {
    const base = CATEGORIES.flatMap((category) => category.tasks);
    return [...base, ...state.custom];
  }, [state.custom]);

  function toggle(id: string) {
    persist({
      ...state,
      completed: state.completed.includes(id) ? state.completed.filter((item) => item !== id) : [...state.completed, id],
    });
  }

  function addTask() {
    if (!newTask.trim()) {
      return;
    }
    persist({ ...state, custom: [...state.custom, { id: `custom-${Date.now()}`, label: newTask.trim() }] });
    setNewTask("");
  }

  function deleteTask(id: string) {
    persist({
      completed: state.completed.filter((item) => item !== id),
      custom: state.custom.filter((item) => item.id !== id),
    });
  }

  const completedCount = allTasks.filter((task) => state.completed.includes(task.id)).length;
  const progress = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

  return (
    <div className="calc-workspace">
      <CalculatorCard>
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="check" size={17} className="text-accent" />
          {t("checklist.title")}
        </h2>
        <p className="mt-1 text-xs text-muted">{t("checklist.intro")}</p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>
              {completedCount} / {allTasks.length} {t("checklist.complete")}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--cyan))] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-surface-muted p-4">
          <h3 className="text-sm font-semibold text-ink">{t("checklist.addCustom")}</h3>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] flex-1">
              <TextField id="cl-new" label={t("checklist.task")} value={newTask} onChange={setNewTask} placeholder={t("checklist.taskPlaceholder")} />
            </div>
            <Button onClick={addTask}>
              <Icon name="plus" size={14} />
              {t("checklist.add")}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <Icon name="print" size={14} />
            {t("calculator.print")}
          </Button>
          <Button variant="danger" onClick={() => persist({ completed: [], custom: [] })}>
            <Icon name="refresh" size={14} />
            {t("calculator.reset")}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">{t("checklist.saved")}</p>
      </CalculatorCard>

      <section aria-label="Checklist" className="print-block overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow)] lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <div className="space-y-5 p-5">
          {CATEGORIES.map((category) => (
            <div key={category.title}>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {category.title}
              </h3>
              <ul className="mt-2 space-y-0.5">
                {category.tasks.map((task) => {
                  const done = state.completed.includes(task.id);
                  return (
                    <li key={task.id}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-muted">
                        <input type="checkbox" checked={done} onChange={() => toggle(task.id)} className="h-4 w-4 accent-[var(--accent)]" />
                        <span className={done ? "text-muted line-through" : "text-ink"}>{task.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {state.custom.length > 0 ? (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t("checklist.myTasks")}
              </h3>
              <ul className="mt-2 space-y-0.5">
                {state.custom.map((task) => {
                  const done = state.completed.includes(task.id);
                  return (
                    <li key={task.id} className="group flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-muted">
                      <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-sm">
                        <input type="checkbox" checked={done} onChange={() => toggle(task.id)} className="h-4 w-4 accent-[var(--accent)]" />
                        <span className={done ? "text-muted line-through" : "text-ink"}>{task.label}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label="Delete task"
                        className="no-print text-muted opacity-0 transition hover:text-error group-hover:opacity-100"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
