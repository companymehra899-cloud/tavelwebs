import type { AppLocale } from "./constants";
import { DEFAULT_LOCALE } from "./constants";
import en from "../locales/en.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import nl from "../locales/nl.json";

export type TranslationDictionary = typeof en;

const DICTIONARIES: Record<AppLocale, TranslationDictionary> = {
  en,
  de: de as TranslationDictionary,
  fr: fr as TranslationDictionary,
  es: es as TranslationDictionary,
  it: it as TranslationDictionary,
  nl: nl as TranslationDictionary,
};

export function getDictionary(locale: AppLocale): TranslationDictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export type TranslationKey = string;

function lookup(dictionary: TranslationDictionary, key: string): string | undefined {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary) as string | undefined;
}

export function createTranslator(locale: AppLocale) {
  const dictionary = getDictionary(locale);
  return function t(key: TranslationKey, fallback?: string): string {
    const value = lookup(dictionary, key) ?? lookup(DICTIONARIES.en, key);
    return value ?? fallback ?? key;
  };
}
