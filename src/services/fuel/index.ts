export interface FuelPriceResult {
  available: boolean;
  currency: string;
  unit: string;
  message: string;
}

/**
 * Fuel prices are user-provided by design. No reliable, licence-free pan-European
 * fuel price API is configured in this build, so this service reports that live
 * data is unavailable instead of inventing a price.
 */
export function getLiveFuelPrice(): FuelPriceResult {
  return {
    available: false,
    currency: "EUR",
    unit: "L",
    message:
      "Live fuel prices are not connected. Enter the price you expect to pay for accurate results.",
  };
}
