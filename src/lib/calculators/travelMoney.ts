import { z } from "zod";
import { roundTo } from "../format";

export const travelMoneyInputSchema = z.object({
  tripDays: z.number().int().min(1).max(365),
  dailyBudget: z.number().finite().positive(),
  emergencyBufferPercent: z.number().min(0).max(100).default(10),
  travelers: z.number().int().min(1).max(50),
});

export type TravelMoneyInput = z.input<typeof travelMoneyInputSchema>;

export interface TravelMoneyResult {
  baseBudget: number;
  emergencyBuffer: number;
  totalBudget: number;
  perTraveler: number;
}

export function calculateTravelMoney(input: TravelMoneyInput): TravelMoneyResult {
  const parsed = travelMoneyInputSchema.parse(input);
  const baseBudget = parsed.tripDays * parsed.dailyBudget * parsed.travelers;
  const emergencyBuffer = baseBudget * (parsed.emergencyBufferPercent / 100);
  const totalBudget = baseBudget + emergencyBuffer;
  return {
    baseBudget: roundTo(baseBudget, 2),
    emergencyBuffer: roundTo(emergencyBuffer, 2),
    totalBudget: roundTo(totalBudget, 2),
    perTraveler: roundTo(totalBudget / parsed.travelers, 2),
  };
}
