"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CURRENCY, DEFAULT_LOCALE, DEFAULT_UNIT_SYSTEM, type AppLocale } from "@/lib/constants";
import { createTranslator } from "@/lib/i18n";
import { readJson, writeJson, STORAGE_KEYS } from "@/lib/storage";
import type { CurrencyCode, UnitSystem } from "@/lib/types";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  advertising: boolean;
  decided: boolean;
}

interface PreferencesContextValue {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, fallback?: string) => string;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  recent: string[];
  recordRecent: (slug: string) => void;
  cookies: CookiePreferences;
  setCookies: (preferences: Partial<CookiePreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const DEFAULT_COOKIES: CookiePreferences = {
  essential: true,
  analytics: false,
  advertising: false,
  decided: false,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [units, setUnitsState] = useState<UnitSystem>(DEFAULT_UNIT_SYSTEM);
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [cookies, setCookiesState] = useState<CookiePreferences>(DEFAULT_COOKIES);

  useEffect(() => {
    setUnitsState(readJson<UnitSystem>(STORAGE_KEYS.units, DEFAULT_UNIT_SYSTEM));
    setCurrencyState(readJson<CurrencyCode>(STORAGE_KEYS.currency, DEFAULT_CURRENCY));
    setLocaleState(readJson<AppLocale>(STORAGE_KEYS.locale, DEFAULT_LOCALE));
    setFavorites(readJson<string[]>(STORAGE_KEYS.favorites, []));
    setRecent(readJson<string[]>(STORAGE_KEYS.recent, []));
    setCookiesState(readJson<CookiePreferences>(STORAGE_KEYS.cookies, DEFAULT_COOKIES));
  }, []);

  const setUnits = useCallback((next: UnitSystem) => {
    setUnitsState(next);
    writeJson(STORAGE_KEYS.units, next);
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    writeJson(STORAGE_KEYS.currency, next);
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    writeJson(STORAGE_KEYS.locale, next);
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      writeJson(STORAGE_KEYS.favorites, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const recordRecent = useCallback((slug: string) => {
    setRecent((current) => {
      const next = [slug, ...current.filter((item) => item !== slug)].slice(0, 8);
      writeJson(STORAGE_KEYS.recent, next);
      return next;
    });
  }, []);

  const setCookies = useCallback((preferences: Partial<CookiePreferences>) => {
    setCookiesState((current) => {
      const next: CookiePreferences = { ...current, ...preferences, essential: true, decided: true };
      writeJson(STORAGE_KEYS.cookies, next);
      return next;
    });
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      units,
      setUnits,
      currency,
      setCurrency,
      locale,
      setLocale,
      t,
      favorites,
      toggleFavorite,
      isFavorite,
      recent,
      recordRecent,
      cookies,
      setCookies,
    }),
    [
      units,
      setUnits,
      currency,
      setCurrency,
      locale,
      setLocale,
      t,
      favorites,
      toggleFavorite,
      isFavorite,
      recent,
      recordRecent,
      cookies,
      setCookies,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
