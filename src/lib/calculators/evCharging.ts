import { z } from "zod";
import { roundTo } from "../format";
import type { ChargingType, UnitSystem } from "../types";

export const evChargingInputSchema = z.object({
  distance: z.number().finite().positive(),
  consumptionKwhPer100km: z.number().finite().positive(),
  electricityPrice: z.number().finite().positive(),
  startBatteryPercent: z.number().min(0).max(100),
  targetBatteryPercent: z.number().min(0).max(100),
  batteryCapacityKwh: z.number().finite().positive().default(60),
  chargingType: z.enum(["home", "public"]),
  unitSystem: z.enum(["metric", "imperial"]),
});

export type EvChargingInput = z.input<typeof evChargingInputSchema>;

export interface EvChargingResult {
  distanceKm: number;
  energyRequiredKwh: number;
  chargingCost: number;
  costPerKm: number;
  chargingType: ChargingType;
  batteryDeltaPercent: number;
  unitSystem: UnitSystem;
}

export function calculateEvCharging(input: EvChargingInput): EvChargingResult {
  const parsed = evChargingInputSchema.parse(input);
  if (parsed.targetBatteryPercent < parsed.startBatteryPercent) {
    throw new Error("Target battery percentage must be greater than or equal to the starting percentage.");
  }
  const distanceKm = parsed.unitSystem === "imperial" ? parsed.distance * 1.609344 : parsed.distance;
  const tripEnergy = (distanceKm * parsed.consumptionKwhPer100km) / 100;
  const batteryDeltaPercent = parsed.targetBatteryPercent - parsed.startBatteryPercent;
  const chargeEnergy = (batteryDeltaPercent / 100) * parsed.batteryCapacityKwh;
  const energyRequiredKwh = Math.max(tripEnergy, chargeEnergy);
  const chargingCost = energyRequiredKwh * parsed.electricityPrice;
  return {
    distanceKm: roundTo(distanceKm, 1),
    energyRequiredKwh: roundTo(energyRequiredKwh, 2),
    chargingCost: roundTo(chargingCost, 2),
    costPerKm: roundTo(chargingCost / distanceKm, 4),
    chargingType: parsed.chargingType,
    batteryDeltaPercent: roundTo(batteryDeltaPercent, 1),
    unitSystem: parsed.unitSystem,
  };
}
