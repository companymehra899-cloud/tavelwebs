const PREFIX = "travel-utility:";

export const STORAGE_KEYS = {
  units: `${PREFIX}units`,
  currency: `${PREFIX}currency`,
  favorites: `${PREFIX}favorites`,
  recent: `${PREFIX}recent`,
  checklist: `${PREFIX}checklist`,
  packing: `${PREFIX}packing`,
  countdown: `${PREFIX}countdown`,
  cookies: `${PREFIX}cookies`,
  locale: `${PREFIX}locale`,
} as const;

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}
