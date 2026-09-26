import { z } from "zod";
import { getCached, setCached } from "../currency";

const geocodeResultSchema = z.array(
  z.object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
  }),
);

const openMeteoSchema = z.object({
  results: z
    .array(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        name: z.string(),
        country: z.string().optional(),
        admin1: z.string().optional(),
      }),
    )
    .optional(),
});

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

type GeocodeProvider = (query: string) => Promise<GeocodeResult | null>;

async function geocodeWithNominatim(query: string): Promise<GeocodeResult | null> {
  const endpoint =
    process.env.GEOCODING_API_URL ?? "https://nominatim.openstreetmap.org/search";
  const url = new URL(endpoint);
  url.searchParams.set("q", query);
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
  return {
    lat: Number(first.lat),
    lon: Number(first.lon),
    displayName: first.display_name,
  };
}

// Open-Meteo's geocoder is free, needs no key and tolerates server-side traffic,
// so it is used as a fallback when the primary provider is rate limited or blocked.
async function geocodeWithOpenMeteo(query: string): Promise<GeocodeResult | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Fallback geocoding service responded with ${response.status}`);
  }
  const parsed = openMeteoSchema.parse(await response.json());
  const first = parsed.results?.[0];
  if (!first) {
    return null;
  }
  const label = [first.name, first.admin1, first.country].filter(Boolean).join(", ");
  return {
    lat: first.latitude,
    lon: first.longitude,
    displayName: label,
  };
}

const providers: GeocodeProvider[] = [geocodeWithNominatim, geocodeWithOpenMeteo];

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

  let responded = false;
  let lastError: unknown = null;
  for (const provider of providers) {
    try {
      const result = await provider(trimmed);
      responded = true;
      if (result) {
        setCached(cacheKey, result);
        return result;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (!responded && lastError) {
    throw lastError instanceof Error
      ? lastError
      : new Error("Geocoding service is unavailable.");
  }
  return null;
}

export function unavailableMessage(): string {
  return "Live data is temporarily unavailable.";
}
