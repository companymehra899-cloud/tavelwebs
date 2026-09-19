import { haversineKm } from "@/lib/geo";
import { geocode } from "../geolocation";

export interface DistanceResult {
  distanceKm: number;
  originLabel: string;
  destinationLabel: string;
  source: "api" | "calculated";
}

export async function estimateDistance(
  origin: string,
  destination: string,
): Promise<DistanceResult | null> {
  const [from, to] = await Promise.all([geocode(origin), geocode(destination)]);
  if (!from || !to) {
    return null;
  }
  const straightLine = haversineKm(
    { lat: from.lat, lon: from.lon },
    { lat: to.lat, lon: to.lon },
  );
  // Road distance is typically longer than the straight line; 1.2 is a transparent
  // detour factor so the estimate is clearly labelled, never presented as exact.
  const roadEstimate = straightLine * 1.2;
  return {
    distanceKm: Math.round(roadEstimate * 10) / 10,
    originLabel: from.displayName,
    destinationLabel: to.displayName,
    source: "calculated",
  };
}
