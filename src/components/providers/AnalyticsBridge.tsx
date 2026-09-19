"use client";

import { useEffect } from "react";
import { trackToolUsed } from "@/lib/analytics";
import { usePreferences } from "./PreferencesProvider";

export function AnalyticsBridge() {
  const { cookies } = usePreferences();

  useEffect(() => {
    if (cookies.decided && !cookies.analytics) {
      return;
    }
  }, [cookies]);

  return null;
}

export function useTrackTool(toolName: string) {
  useEffect(() => {
    trackToolUsed(toolName);
  }, [toolName]);
}
