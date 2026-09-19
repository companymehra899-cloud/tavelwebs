import { z } from "zod";

export const tripDurationInputSchema = z.object({
  startDate: z.string().min(8),
  endDate: z.string().min(8),
  inclusive: z.boolean().default(true),
});

export type TripDurationInput = z.input<typeof tripDurationInputSchema>;

export interface TripDurationResult {
  days: number;
  nights: number;
  weeks: number;
  weekdays: number;
  weekends: number;
  inclusive: boolean;
}

function parseDate(value: string): Date {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Please enter a valid date.");
  }
  return date;
}

export function calculateTripDuration(input: TripDurationInput): TripDurationResult {
  const parsed = tripDurationInputSchema.parse(input);
  const start = parseDate(parsed.startDate);
  const end = parseDate(parsed.endDate);
  if (end < start) {
    throw new Error("End date must be on or after the start date.");
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  const nightCount = Math.round((end.getTime() - start.getTime()) / msPerDay);
  const days = parsed.inclusive ? nightCount + 1 : nightCount;
  let weekdays = 0;
  let weekends = 0;
  const cursor = new Date(start);
  const limit = parsed.inclusive ? nightCount + 1 : nightCount;
  for (let i = 0; i < limit; i += 1) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      weekends += 1;
    } else {
      weekdays += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return {
    days,
    nights: nightCount,
    weeks: Math.floor(days / 7),
    weekdays,
    weekends,
    inclusive: parsed.inclusive,
  };
}
