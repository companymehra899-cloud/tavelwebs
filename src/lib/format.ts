import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "./constants";
import type { CurrencyCode } from "./types";

export function roundTo(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale = DEFAULT_LOCALE,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" || currency === "HUF" ? 0 : 2,
  }).format(roundTo(value, currency === "JPY" || currency === "HUF" ? 0 : 2));
}

export function formatDistance(km: number, imperial: boolean, locale = DEFAULT_LOCALE): string {
  if (imperial) {
    return `${formatNumber(km / 1.609344, { maximumFractionDigits: 1 }, locale)} mi`;
  }
  return `${formatNumber(km, { maximumFractionDigits: 1 }, locale)} km`;
}

export function formatVolume(litres: number, imperial: boolean, locale = DEFAULT_LOCALE): string {
  if (imperial) {
    return `${formatNumber(litres / 3.785411784, { maximumFractionDigits: 2 }, locale)} gal`;
  }
  return `${formatNumber(litres, { maximumFractionDigits: 1 }, locale)} L`;
}

export function formatDuration(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
    return "—";
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours} h ${minutes} min`;
}

export function safeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function displayValue(value: number, digits = 2): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return formatNumber(value, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
