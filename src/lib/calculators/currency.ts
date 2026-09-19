import { z } from "zod";
import { roundTo } from "../format";
import type { CurrencyCode } from "../types";

export const currencyConvertInputSchema = z.object({
  amount: z.number().finite().nonnegative(),
  from: z.string().min(3).max(3),
  to: z.string().min(3).max(3),
  rate: z.number().finite().positive(),
});

export type CurrencyConvertInput = z.infer<typeof currencyConvertInputSchema>;

export interface CurrencyConvertResult {
  amount: number;
  from: CurrencyCode | string;
  to: CurrencyCode | string;
  converted: number;
  rate: number;
}

export function convertCurrency(input: CurrencyConvertInput): CurrencyConvertResult {
  const parsed = currencyConvertInputSchema.parse(input);
  return {
    amount: parsed.amount,
    from: parsed.from.toUpperCase(),
    to: parsed.to.toUpperCase(),
    converted: roundTo(parsed.amount * parsed.rate, 2),
    rate: roundTo(parsed.rate, 6),
  };
}

export function convertMany(
  amount: number,
  base: string,
  rates: Record<string, number>,
  targets: string[],
): { code: string; value: number; rate: number }[] {
  return targets.map((code) => {
    const rate = code === base ? 1 : rates[code];
    if (!rate || !Number.isFinite(rate)) {
      return { code, value: Number.NaN, rate: Number.NaN };
    }
    return { code, value: roundTo(amount * rate, 2), rate: roundTo(rate, 6) };
  });
}
