import { KM_PER_MILE, LITRES_PER_GALLON } from "./constants";
import type { UnitSystem } from "./types";

export function toKm(distance: number, unitSystem: UnitSystem): number {
  return unitSystem === "imperial" ? distance * KM_PER_MILE : distance;
}

export function fromKm(km: number, unitSystem: UnitSystem): number {
  return unitSystem === "imperial" ? km / KM_PER_MILE : km;
}

export function litresFromConsumption(
  distanceKm: number,
  consumption: number,
  unitSystem: UnitSystem,
): number {
  if (unitSystem === "imperial") {
    const miles = distanceKm / KM_PER_MILE;
    const gallons = miles / consumption;
    return gallons * LITRES_PER_GALLON;
  }
  return (distanceKm * consumption) / 100;
}

export function consumptionLabel(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "MPG" : "L/100km";
}

export function distanceLabel(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "miles" : "km";
}

export function volumeLabel(unitSystem: UnitSystem): string {
  return unitSystem === "imperial" ? "gal" : "L";
}
