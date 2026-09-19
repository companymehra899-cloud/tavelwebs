import type { CurrencyCode, ToolCategoryId } from "./types";

export const SITE_NAME = "Travel Utility";
export const DEFAULT_CURRENCY: CurrencyCode = "EUR";
export const DEFAULT_UNIT_SYSTEM = "metric" as const;
export const DEFAULT_LOCALE = "en";

export const SUPPORTED_LOCALES = ["en", "de", "fr", "es", "it", "nl"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const CURRENCIES: { code: CurrencyCode; name: string }[] = [
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "USD", name: "US Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "DKK", name: "Danish Krone" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "HUF", name: "Hungarian Forint" },
];

export const TIMEZONES = [
  "Europe/London",
  "Europe/Dublin",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Zurich",
  "Europe/Vienna",
  "Europe/Lisbon",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Stockholm",
  "Europe/Oslo",
  "Europe/Copenhagen",
  "Europe/Helsinki",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
  "UTC",
] as const;

export const REGIONS = {
  europe: [
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Austria",
    "Switzerland",
    "Portugal",
    "Ireland",
    "United Kingdom",
    "Poland",
    "Czech Republic",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
  ],
  "north-america": ["United States", "Canada"],
  oceania: ["Australia", "New Zealand"],
} as const;

export const CATEGORY_PATHS: Record<ToolCategoryId, string> = {
  "road-trips": "/road-trips",
  "travel-budget": "/travel-calculators",
  "travel-time": "/travel-calculators",
  "travel-planning": "/travel-planning",
  currency: "/currency",
};

export const KM_PER_MILE = 1.609344;
export const LITRES_PER_GALLON = 3.785411784;
export const AVERAGE_FLIGHT_SPEED_KMH = 850;
