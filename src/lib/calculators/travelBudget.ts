import { z } from "zod";
import { roundTo } from "../format";
import type { BudgetStyle } from "../types";

export const travelBudgetInputSchema = z.object({
  travelers: z.number().int().min(1).max(50),
  days: z.number().int().min(1).max(365),
  accommodationPerNight: z.number().finite().nonnegative(),
  foodPerDay: z.number().finite().nonnegative(),
  transport: z.number().finite().nonnegative(),
  activities: z.number().finite().nonnegative(),
  other: z.number().finite().nonnegative(),
  style: z.enum(["budget", "mid-range", "comfortable"]).optional(),
});

export type TravelBudgetInput = z.input<typeof travelBudgetInputSchema>;

export interface TravelBudgetResult {
  accommodationTotal: number;
  foodTotal: number;
  transport: number;
  activities: number;
  other: number;
  totalTripCost: number;
  costPerTraveler: number;
  dailyBudget: number;
  style?: BudgetStyle;
}

export function calculateTravelBudget(input: TravelBudgetInput): TravelBudgetResult {
  const parsed = travelBudgetInputSchema.parse(input);
  const nights = Math.max(parsed.days - 1, 1);
  const accommodationTotal = parsed.accommodationPerNight * nights;
  const foodTotal = parsed.foodPerDay * parsed.days * parsed.travelers;
  const totalTripCost =
    accommodationTotal + foodTotal + parsed.transport + parsed.activities + parsed.other;
  return {
    accommodationTotal: roundTo(accommodationTotal, 2),
    foodTotal: roundTo(foodTotal, 2),
    transport: roundTo(parsed.transport, 2),
    activities: roundTo(parsed.activities, 2),
    other: roundTo(parsed.other, 2),
    totalTripCost: roundTo(totalTripCost, 2),
    costPerTraveler: roundTo(totalTripCost / parsed.travelers, 2),
    dailyBudget: roundTo(totalTripCost / parsed.days, 2),
    style: parsed.style,
  };
}

export const dailyBudgetInputSchema = z.object({
  accommodation: z.number().finite().nonnegative(),
  food: z.number().finite().nonnegative(),
  localTransport: z.number().finite().nonnegative(),
  activities: z.number().finite().nonnegative(),
  other: z.number().finite().nonnegative(),
  days: z.number().int().min(1).max(365).default(7),
});

export type DailyBudgetInput = z.input<typeof dailyBudgetInputSchema>;

export interface DailyBudgetResult {
  dailyTotal: number;
  weeklyTotal: number;
  tripTotal: number;
  days: number;
}

export function calculateDailyBudget(input: DailyBudgetInput): DailyBudgetResult {
  const parsed = dailyBudgetInputSchema.parse(input);
  const dailyTotal =
    parsed.accommodation + parsed.food + parsed.localTransport + parsed.activities + parsed.other;
  return {
    dailyTotal: roundTo(dailyTotal, 2),
    weeklyTotal: roundTo(dailyTotal * 7, 2),
    tripTotal: roundTo(dailyTotal * parsed.days, 2),
    days: parsed.days,
  };
}

export const costPerPersonInputSchema = z.object({
  totalCost: z.number().finite().positive(),
  travelers: z.number().int().min(1).max(50),
  shares: z.array(z.number().finite().nonnegative()).optional(),
});

export type CostPerPersonInput = z.input<typeof costPerPersonInputSchema>;

export interface CostPerPersonResult {
  equalSplit: number;
  shares: { label: string; amount: number }[];
}

export function calculateCostPerPerson(input: CostPerPersonInput): CostPerPersonResult {
  const parsed = costPerPersonInputSchema.parse(input);
  const equalSplit = roundTo(parsed.totalCost / parsed.travelers, 2);
  if (!parsed.shares || parsed.shares.length === 0) {
    return {
      equalSplit,
      shares: Array.from({ length: parsed.travelers }, (_, index) => ({
        label: `Traveler ${index + 1}`,
        amount: equalSplit,
      })),
    };
  }
  const totalShares = parsed.shares.reduce((sum, share) => sum + share, 0);
  if (totalShares <= 0) {
    throw new Error("Share values must add up to more than 0.");
  }
  return {
    equalSplit,
    shares: parsed.shares.map((share, index) => ({
      label: `Traveler ${index + 1}`,
      amount: roundTo((share / totalShares) * parsed.totalCost, 2),
    })),
  };
}
