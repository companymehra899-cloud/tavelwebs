import { z } from "zod";

export const timeZoneInputSchema = z.object({
  date: z.string().min(8),
  time: z.string().min(4),
  fromTimeZone: z.string().min(3),
  toTimeZone: z.string().min(3),
});

export type TimeZoneInput = z.infer<typeof timeZoneInputSchema>;

export interface TimeZoneResult {
  fromIso: string;
  toIso: string;
  convertedDate: string;
  convertedTime: string;
  fromOffset: string;
  toOffset: string;
  fromTimeZone: string;
  toTimeZone: string;
}

function parseDateTime(date: string, time: string): { year: number; month: number; day: number; hour: number; minute: number } {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if ([year, month, day, hour, minute].some((part) => !Number.isFinite(part))) {
    throw new Error("Please enter a valid date and time.");
  }
  return { year, month, day, hour, minute };
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
    offset: get("timeZoneName") || "UTC",
  };
}

function zonedTimeToUtc(
  parts: { year: number; month: number; day: number; hour: number; minute: number },
  timeZone: string,
): Date {
  const utcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
  let date = new Date(utcGuess);
  for (let i = 0; i < 3; i += 1) {
    const zoned = getTimeZoneParts(date, timeZone);
    const asUtc = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, zoned.second);
    const desired = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
    const diff = desired - asUtc;
    date = new Date(date.getTime() + diff);
    if (diff === 0) {
      break;
    }
  }
  return date;
}

export function convertTimeZone(input: TimeZoneInput): TimeZoneResult {
  const parsed = timeZoneInputSchema.parse(input);
  const source = parseDateTime(parsed.date, parsed.time);
  const utcDate = zonedTimeToUtc(source, parsed.fromTimeZone);
  const converted = getTimeZoneParts(utcDate, parsed.toTimeZone);
  const fromParts = getTimeZoneParts(utcDate, parsed.fromTimeZone);
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    fromIso: utcDate.toISOString(),
    toIso: utcDate.toISOString(),
    convertedDate: `${converted.year}-${pad(converted.month)}-${pad(converted.day)}`,
    convertedTime: `${pad(converted.hour)}:${pad(converted.minute)}`,
    fromOffset: fromParts.offset,
    toOffset: converted.offset,
    fromTimeZone: parsed.fromTimeZone,
    toTimeZone: parsed.toTimeZone,
  };
}

export function timeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "shortOffset",
    hourCycle: "h23",
  }).formatToParts(date);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = offset.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) {
    return 0;
  }
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");
  return sign * (hours * 60 + minutes);
}
