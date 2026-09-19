import { z } from "zod";
import { AVERAGE_FLIGHT_SPEED_KMH } from "../constants";
import { haversineKm } from "../geo";
import { roundTo } from "../format";

export const flightTimeInputSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLon: z.number().min(-180).max(180),
  destinationLat: z.number().min(-90).max(90),
  destinationLon: z.number().min(-180).max(180),
  averageSpeedKmh: z.number().finite().positive().default(AVERAGE_FLIGHT_SPEED_KMH),
});

export type FlightTimeInput = z.input<typeof flightTimeInputSchema>;

export interface FlightTimeResult {
  distanceKm: number;
  estimatedMinutes: number;
  averageSpeedKmh: number;
}

export function calculateFlightTime(input: FlightTimeInput): FlightTimeResult {
  const parsed = flightTimeInputSchema.parse(input);
  const distanceKm = haversineKm(
    { lat: parsed.originLat, lon: parsed.originLon },
    { lat: parsed.destinationLat, lon: parsed.destinationLon },
  );
  const hours = distanceKm / parsed.averageSpeedKmh;
  return {
    distanceKm: roundTo(distanceKm, 1),
    estimatedMinutes: roundTo(hours * 60, 0),
    averageSpeedKmh: parsed.averageSpeedKmh,
  };
}
