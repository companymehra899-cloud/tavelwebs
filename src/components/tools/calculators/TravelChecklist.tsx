"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";
import { usePreferences } from "@/components/providers/PreferencesProvider";

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
      completed: state.completed.includes(id)
        ? state.completed.filter((item) => item !== id)
        : [...state.completed, id],
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

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
        <p className="text-sm text-muted">
          {completedCount} of {allTasks.length} tasks complete
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => window.print()}>Print</Button>
          <Button variant="danger" onClick={() => persist({ completed: [], custom: [] })}>{t("calculator.reset")}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((category) => (
          <section key={category.title} className="rounded-2xl border border-border bg-white p-4">
            <h2 className="text-sm font-semibold text-foreground">{category.title}</h2>
            <ul className="mt-2 space-y-1.5">
              {category.tasks.map((task) => (
                <li key={task.id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" checked={state.completed.includes(task.id)} onChange={() => toggle(task.id)} />
                    <span className={state.completed.includes(task.id) ? "text-muted line-through" : ""}>{task.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {state.custom.length > 0 ? (
          <section className="rounded-2xl border border-border bg-white p-4">
            <h2 className="text-sm font-semibold text-foreground">My tasks</h2>
            <ul className="mt-2 space-y-1.5">
              {state.custom.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" checked={state.completed.includes(task.id)} onChange={() => toggle(task.id)} />
                    <span className={state.completed.includes(task.id) ? "text-muted line-through" : ""}>{task.label}</span>
                  </label>
                  <button type="button" onClick={() => deleteTask(task.id)} className="no-print text-xs text-red-600 hover:underline">Delete</button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="no-print rounded-2xl border border-border bg-white p-4">
        <h2 className="text-sm font-semibold">Add a custom task</h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1">
            <TextField id="cl-new" label="Task" value={newTask} onChange={setNewTask} placeholder="e.g. Book airport parking" />
          </div>
          <Button onClick={addTask}>Add task</Button>
        </div>
        <p className="mt-3 text-xs text-muted">Your checklist is saved in this browser.</p>
      </div>
    </div>
  );
}
