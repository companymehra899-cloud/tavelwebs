import { z } from "zod";
import { litresFromConsumption } from "../units";
import { roundTo } from "../format";
import type { FuelType, TripDirection, UnitSystem } from "../types";

export const roadTripInputSchema = z.object({
  distanceKm: z.number().finite().positive(),
  consumption: z.number().finite().positive(),
  fuelPrice: z.number().finite().positive(),
  travelers: z.number().int().min(1).max(50),
  unitSystem: z.enum(["metric", "imperial"]),
  fuelType: z.enum(["petrol", "diesel"]),
  direction: z.enum(["one-way", "round-trip"]),
  tolls: z.number().finite().nonnegative().default(0),
  parking: z.number().finite().nonnegative().default(0),
  accommodation: z.number().finite().nonnegative().default(0),
  other: z.number().finite().nonnegative().default(0),
});

export type RoadTripInput = z.input<typeof roadTripInputSchema>;

export interface RoadTripResult {
  distanceKm: number;
  fuelRequiredLitres: number;
  fuelCost: number;
  tollCost: number;
  parking: number;
  accommodation: number;
  other: number;
  totalTripCost: number;
  costPerPerson: number;
  direction: TripDirection;
  fuelType: FuelType;
  unitSystem: UnitSystem;
  travelers: number;
}

export function calculateRoadTrip(input: RoadTripInput): RoadTripResult {
  const parsed = roadTripInputSchema.parse(input);
  const multiplier = parsed.direction === "round-trip" ? 2 : 1;
  const distanceKm = parsed.distanceKm * multiplier;
  const fuelRequiredLitres = litresFromConsumption(
    distanceKm,
    parsed.consumption,
    parsed.unitSystem,
  );
  const fuelCost = fuelRequiredLitres * parsed.fuelPrice;
  const totalTripCost =
    fuelCost + parsed.tolls + parsed.parking + parsed.accommodation + parsed.other;
  return {
    distanceKm: roundTo(distanceKm, 1),
    fuelRequiredLitres: roundTo(fuelRequiredLitres, 2),
    fuelCost: roundTo(fuelCost, 2),
    tollCost: roundTo(parsed.tolls, 2),
    parking: roundTo(parsed.parking, 2),
    accommodation: roundTo(parsed.accommodation, 2),
    other: roundTo(parsed.other, 2),
    totalTripCost: roundTo(totalTripCost, 2),
    costPerPerson: roundTo(totalTripCost / parsed.travelers, 2),
    direction: parsed.direction,
    fuelType: parsed.fuelType,
    unitSystem: parsed.unitSystem,
    travelers: parsed.travelers,
  };
}
