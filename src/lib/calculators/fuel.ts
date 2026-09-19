import { z } from "zod";
import { litresFromConsumption } from "../units";
import { roundTo } from "../format";
import type { FuelType, UnitSystem } from "../types";

export const fuelCostInputSchema = z.object({
  distance: z.number().finite().positive(),
  consumption: z.number().finite().positive(),
  fuelPrice: z.number().finite().positive(),
  unitSystem: z.enum(["metric", "imperial"]),
  fuelType: z.enum(["petrol", "diesel"]),
});

export type FuelCostInput = z.infer<typeof fuelCostInputSchema>;

export interface FuelCostResult {
  fuelRequiredLitres: number;
  fuelCost: number;
  costPerKm: number;
  costPerMile: number;
  distanceKm: number;
  fuelType: FuelType;
  unitSystem: UnitSystem;
}

export function calculateFuelCost(input: FuelCostInput): FuelCostResult {
  const parsed = fuelCostInputSchema.parse(input);
  const distanceKm = parsed.unitSystem === "imperial" ? parsed.distance * 1.609344 : parsed.distance;
  const fuelRequiredLitres = litresFromConsumption(
    distanceKm,
    parsed.consumption,
    parsed.unitSystem,
  );
  const fuelCost = fuelRequiredLitres * parsed.fuelPrice;
  return {
    fuelRequiredLitres: roundTo(fuelRequiredLitres, 2),
    fuelCost: roundTo(fuelCost, 2),
    costPerKm: roundTo(fuelCost / distanceKm, 4),
    costPerMile: roundTo(fuelCost / (distanceKm / 1.609344), 4),
    distanceKm: roundTo(distanceKm, 2),
    fuelType: parsed.fuelType,
    unitSystem: parsed.unitSystem,
  };
}
