"use client";

import { useCallback, useEffect, useState } from "react";

export interface RatesState {
  rates: Record<string, number> | null;
  date: string | null;
  fetchedAt: string | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useRates(base: string, symbols: string[]): RatesState {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const symbolKey = [...symbols].sort().join(",");
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ from: base });
        if (symbolKey) {
          params.set("to", symbolKey);
        }
        const response = await fetch(`/api/currency?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("unavailable");
        }
        const data = (await response.json()) as {
          rates: Record<string, number>;
          date: string;
          fetchedAt: string;
        };
        setRates(data.rates);
        setDate(data.date);
        setFetchedAt(data.fetchedAt);
      } catch (caught) {
        if ((caught as Error).name === "AbortError") {
          return;
        }
        setRates(null);
        setError("Live data is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, symbols.sort().join(","), nonce]);

  return { rates, date, fetchedAt, loading, error, reload };
}
