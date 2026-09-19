import { z } from "zod";
import { convertTimeZone } from "./timeZone";

export const layoverInputSchema = z.object({
  arrivalDate: z.string().min(8),
  arrivalTime: z.string().min(4),
  departureDate: z.string().min(8),
  departureTime: z.string().min(4),
  arrivalTimeZone: z.string().optional(),
  departureTimeZone: z.string().optional(),
});

export type LayoverInput = z.infer<typeof layoverInputSchema>;

export interface LayoverResult {
  totalMinutes: number;
  hours: number;
  minutes: number;
  timezoneAware: boolean;
}

function toUtcMs(date: string, time: string, timeZone?: string): number {
  if (timeZone) {
    const converted = convertTimeZone({
      date,
      time,
      fromTimeZone: timeZone,
      toTimeZone: "UTC",
    });
    return new Date(`${converted.convertedDate}T${converted.convertedTime}:00Z`).getTime();
  }
  return new Date(`${date}T${time}:00`).getTime();
}

export function calculateLayover(input: LayoverInput): LayoverResult {
  const parsed = layoverInputSchema.parse(input);
  const timezoneAware = Boolean(parsed.arrivalTimeZone && parsed.departureTimeZone);
  const arrival = toUtcMs(parsed.arrivalDate, parsed.arrivalTime, parsed.arrivalTimeZone);
  const departure = toUtcMs(parsed.departureDate, parsed.departureTime, parsed.departureTimeZone);
  if (!Number.isFinite(arrival) || !Number.isFinite(departure)) {
    throw new Error("Please enter valid arrival and departure times.");
  }
  if (departure <= arrival) {
    throw new Error("Next departure must be after arrival.");
  }
  const totalMinutes = Math.round((departure - arrival) / 60000);
  return {
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    timezoneAware,
  };
}
