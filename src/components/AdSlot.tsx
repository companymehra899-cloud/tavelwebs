"use client";

import { useEffect } from "react";
import { usePreferences } from "./providers/PreferencesProvider";

export function AdSlot({ placement }: { placement: "tool-top" | "result-bottom" | "content" }) {
  const { cookies } = usePreferences();

  useEffect(() => {
    // Advertising only initialises when consent has been granted.
  }, [cookies.advertising]);

  if (!cookies.advertising) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      data-ad-placement={placement}
      className="no-print flex min-h-[90px] items-center justify-center rounded-3xl border border-dashed border-border bg-white/70 text-xs text-muted"
    >
      Advertisement
    </aside>
  );
}
