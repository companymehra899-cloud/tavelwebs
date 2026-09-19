import { z } from "zod";

const TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  value: unknown;
  expires: number;
}

const memoryCache = new Map<string, CacheEntry>();

export function getCached<T>(key: string): T | undefined {
  const entry = memoryCache.get(key);
  if (!entry) {
    return undefined;
  }
  if (entry.expires < Date.now()) {
    memoryCache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached(key: string, value: unknown, ttlMs = TTL_MS): void {
  memoryCache.set(key, { value, expires: Date.now() + ttlMs });
}

export const currencyResponseSchema = z.object({
  amount: z.number(),
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
});

export type CurrencyResponse = z.infer<typeof currencyResponseSchema>;

export interface CurrencyRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  fetchedAt: string;
  source: string;
}

export async function fetchRates(base: string, symbols: string[]): Promise<CurrencyRates> {
  const cacheKey = `rates:${base}:${symbols.sort().join(",")}`;
  const cached = getCached<CurrencyRates>(cacheKey);
  if (cached) {
    return cached;
  }
  const endpoint =
    process.env.CURRENCY_API_URL ?? "https://api.frankfurter.app/latest";
  const url = new URL(endpoint);
  url.searchParams.set("from", base);
  if (symbols.length > 0) {
    url.searchParams.set("to", symbols.join(","));
  }
  const headers: Record<string, string> = { Accept: "application/json" };
  if (process.env.CURRENCY_API_KEY) {
    headers.Authorization = `Bearer ${process.env.CURRENCY_API_KEY}`;
  }
  const response = await fetch(url, {
    headers,
    next: { revalidate: 1800 },
  });
  if (!response.ok) {
    throw new Error(`Currency service responded with ${response.status}`);
  }
  const parsed = currencyResponseSchema.parse(await response.json());
  const result: CurrencyRates = {
    base: parsed.base,
    date: parsed.date,
    rates: { ...parsed.rates, [parsed.base]: 1 },
    fetchedAt: new Date().toISOString(),
    source: "ECB reference rates",
  };
  setCached(cacheKey, result);
  return result;
}
