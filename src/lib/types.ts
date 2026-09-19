export type UnitSystem = "metric" | "imperial";

export type CurrencyCode =
  | "EUR"
  | "GBP"
  | "USD"
  | "CHF"
  | "CAD"
  | "AUD"
  | "NZD"
  | "JPY"
  | "CNY"
  | "SEK"
  | "NOK"
  | "DKK"
  | "PLN"
  | "CZK"
  | "HUF";

export type FuelType = "petrol" | "diesel";

export type TripDirection = "one-way" | "round-trip";

export type ToolCategoryId =
  | "road-trips"
  | "travel-budget"
  | "travel-time"
  | "travel-planning"
  | "currency";

export type ChargingType = "home" | "public";

export type BudgetStyle = "budget" | "mid-range" | "comfortable";

export type TripType =
  | "business"
  | "beach"
  | "city"
  | "hiking"
  | "winter"
  | "summer"
  | "family"
  | "backpacking";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ResultRow {
  label: string;
  value: string;
  emphasize?: boolean;
}

export interface CalculatorError {
  field?: string;
  message: string;
}
