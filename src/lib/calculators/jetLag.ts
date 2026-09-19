import { z } from "zod";
import { timeZoneOffsetMinutes } from "./timeZone";

export const jetLagInputSchema = z.object({
  originTimeZone: z.string().min(3),
  destinationTimeZone: z.string().min(3),
  departureIso: z.string().min(10),
  arrivalIso: z.string().min(10),
  direction: z.enum(["east", "west", "auto"]).default("auto"),
  tripDays: z.number().int().min(1).max(90).default(7),
});

export type JetLagInput = z.input<typeof jetLagInputSchema>;

export interface JetLagResult {
  timeDifferenceHours: number;
  direction: "east" | "west";
  recoveryDays: number;
  adjustmentSchedule: string[];
  lightExposure: string[];
  sleepTiming: string[];
  disclaimer: string;
}

export function calculateJetLag(input: JetLagInput): JetLagResult {
  const parsed = jetLagInputSchema.parse(input);
  const departure = new Date(parsed.departureIso);
  const arrival = new Date(parsed.arrivalIso);
  if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime())) {
    throw new Error("Please enter valid departure and arrival times.");
  }
  const originOffset = timeZoneOffsetMinutes(departure, parsed.originTimeZone);
  const destOffset = timeZoneOffsetMinutes(arrival, parsed.destinationTimeZone);
  const rawDiffHours = (destOffset - originOffset) / 60;
  const direction: "east" | "west" =
    parsed.direction === "auto" ? (rawDiffHours >= 0 ? "east" : "west") : parsed.direction;
  const hours = Math.abs(rawDiffHours);
  const recoveryDays = Math.min(parsed.tripDays, Math.max(1, Math.ceil(hours / 1.5)));
  const shiftPerDay = hours / recoveryDays;
  const adjustmentSchedule = Array.from({ length: recoveryDays }, (_, index) => {
    const day = index + 1;
    const shift = Math.min(hours, shiftPerDay * day);
    return `Day ${day}: shift your body clock about ${shift.toFixed(1)} hours toward destination time.`;
  });
  const lightExposure =
    direction === "east"
      ? [
          "Seek morning light after arrival.",
          "Avoid bright light late in the evening for the first 2–3 nights.",
        ]
      : [
          "Seek afternoon and early evening light after arrival.",
          "Limit early-morning bright light for the first 2–3 days.",
        ];
  const sleepTiming =
    direction === "east"
      ? [
          "Go to bed 30–60 minutes earlier each night before departure when possible.",
          "Keep the first night local bedtime close to destination bedtime.",
        ]
      : [
          "Go to bed 30–60 minutes later each night before departure when possible.",
          "Stay awake until a reasonable local evening on arrival.",
        ];
  return {
    timeDifferenceHours: Math.round(hours * 10) / 10,
    direction,
    recoveryDays,
    adjustmentSchedule,
    lightExposure,
    sleepTiming,
    disclaimer:
      "This is general travel guidance, not medical advice. Sleep needs vary, and suggestions are estimates only.",
  };
}
