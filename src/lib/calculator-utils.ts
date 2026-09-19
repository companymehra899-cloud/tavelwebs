import { parseNumberInput, requirePositive } from "@/lib/validation";
import { formatCurrency, formatDistance, formatNumber, formatVolume } from "@/lib/format";

export { formatCurrency, formatDistance, formatNumber, formatVolume };

export function parseNumberInputSafe(
  value: string | number | null | undefined,
  message: string,
  allowZero = false,
  fallback?: number,
): number {
  const parsed = parseNumberInput(value);
  if (parsed === null) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(message);
  }
  if (allowZero) {
    if (parsed < 0) {
      throw new Error(message);
    }
    return parsed;
  }
  requirePositive(parsed, message);
  return parsed;
}
