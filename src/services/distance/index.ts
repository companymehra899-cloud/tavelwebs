import { z } from "zod";
import { haversineKm } from "@/lib/geo";
import { getCached, setCached } from "../currency";
import { geocode } from "../geolocation";

const ROUTE_TTL_MS = 6 * 60 * 60 * 1000;

export interface RoutePoint {
  lat: number;
  lon: number;
}

export interface DistanceResult {
  distanceKm: number;
  originLabel: string;
  destinationLabel: string;
  source: "api" | "osrm" | "calculated";
}

export interface RouteResult extends DistanceResult {
  durationMinutes: number | null;
  origin: RoutePoint;
  destination: RoutePoint;
  geometry: [number, number][];
  source: "osrm" | "calculated";
}

const osrmSchema = z.object({
  code: z.string().optional(),
  routes: z
    .array(
      z.object({
        distance: z.number(),
        duration: z.number(),
        geometry: z.object({
          coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
        }),
      }),
    )
    .min(1),
});

interface RouteGeometry {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][];
}

function routingBaseUrl(): string {
  return (process.env.ROUTING_API_URL ?? "https://router.project-osrm.org").replace(/\/+$/, "");
}

async function loadRouteGeometry(
  from: RoutePoint,
  to: RoutePoint,
): Promise<RouteGeometry | null> {
  const cacheKey = `route:${from.lat.toFixed(5)},${from.lon.toFixed(5)}:${to.lat.toFixed(5)},${to.lon.toFixed(5)}`;
  const cached = getCached<RouteGeometry>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `${routingBaseUrl()}/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "TravelUtility/1.0 (travel calculator demo)",
      },
      next: { revalidate: 21600 },
    });
    if (!response.ok) {
      return null;
    }
    const parsed = osrmSchema.parse(await response.json());
    if (parsed.code && parsed.code !== "Ok") {
      return null;
    }
    const route = parsed.routes[0];
    if (!route) {
      return null;
    }
    const geometry = route.geometry.coordinates.map(
      ([lon, lat]) => [lat, lon] as [number, number],
    );
    const result: RouteGeometry = {
      distanceKm: Math.round(route.distance / 100) / 10,
      durationMinutes: Math.round(route.duration / 60),
      geometry,
    };
    setCached(cacheKey, result, ROUTE_TTL_MS);
    return result;
  } catch {
    return null;
  }
}

export async function fetchRoute(
  origin: string,
  destination: string,
): Promise<RouteResult | null> {
  const [from, to] = await Promise.all([geocode(origin), geocode(destination)]);
  if (!from || !to) {
    return null;
  }

  const route = await loadRouteGeometry(from, to);
  if (route) {
    return {
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      originLabel: from.displayName,
      destinationLabel: to.displayName,
      origin: { lat: from.lat, lon: from.lon },
      destination: { lat: to.lat, lon: to.lon },
      geometry: route.geometry,
      source: "osrm",
    };
  }

  const straightLine = haversineKm(
    { lat: from.lat, lon: from.lon },
    { lat: to.lat, lon: to.lon },
  );
  // Fallback when the routing engine is unreachable: a straight-line estimate
  // with a transparent detour factor, clearly labelled as calculated.
  return {
    distanceKm: Math.round(straightLine * 1.2 * 10) / 10,
    durationMinutes: null,
    originLabel: from.displayName,
    destinationLabel: to.displayName,
    origin: { lat: from.lat, lon: from.lon },
    destination: { lat: to.lat, lon: to.lon },
    geometry: [
      [from.lat, from.lon],
      [to.lat, to.lon],
    ],
    source: "calculated",
  };
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
  const roadEstimate = straightLine * 1.2;
  return {
    distanceKm: Math.round(roadEstimate * 10) / 10,
    originLabel: from.displayName,
    destinationLabel: to.displayName,
    source: "calculated",
  };
}
