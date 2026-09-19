"use client";

import { useCallback, useState } from "react";
import { trackCalculation } from "@/lib/analytics";

export interface CalculatorRun<TResult> {
  run: (compute: () => TResult) => void;
  reset: (clear: () => void) => void;
  result: TResult | null;
  error: string | null;
  setError: (message: string | null) => void;
}

export function useCalculation<TResult>(toolName: string): CalculatorRun<TResult> {
  const [result, setResult] = useState<TResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    (compute: () => TResult) => {
      try {
        const next = compute();
        setResult(next);
        setError(null);
        trackCalculation(toolName);
      } catch (caught) {
        setResult(null);
        setError(caught instanceof Error ? caught.message : "Something went wrong. Please check your inputs.");
      }
    },
    [toolName],
  );

  const reset = useCallback((clear: () => void) => {
    clear();
    setResult(null);
    setError(null);
  }, []);

  return { run, reset, result, error, setError };
}
