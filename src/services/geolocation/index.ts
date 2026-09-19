import { z } from "zod";
import { getCached, setCached } from "../currency";

const geocodeResultSchema = z.array(
  z.object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
  }),
);

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export async function geocode(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return null;
  }
  const cacheKey = `geocode:${trimmed.toLowerCase()}`;
  const cached = getCached<GeocodeResult>(cacheKey);
  if (cached) {
    return cached;
  }
  const endpoint =
    process.env.GEOCODING_API_URL ?? "https://nominatim.openstreetmap.org/search";
  const url = new URL(endpoint);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  if (process.env.GEOCODING_API_KEY) {
    url.searchParams.set("api_key", process.env.GEOCODING_API_KEY);
  }
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "TravelUtility/1.0 (travel calculator demo)",
    },
  });
  if (!response.ok) {
    throw new Error(`Geocoding service responded with ${response.status}`);
  }
  const data = geocodeResultSchema.parse(await response.json());
  const first = data[0];
  if (!first) {
    return null;
  }
  const result: GeocodeResult = {
    lat: Number(first.lat),
    lon: Number(first.lon),
    displayName: first.display_name,
  };
  setCached(cacheKey, result);
  return result;
}

export function unavailableMessage(): string {
  return "Live data is temporarily unavailable.";
}
