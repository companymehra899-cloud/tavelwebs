import { NextResponse } from "next/server";
import { fetchRoute } from "@/services/distance";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin")?.trim();
  const destination = searchParams.get("destination")?.trim();

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Both origin and destination are required." },
      { status: 400 },
    );
  }

  try {
    const route = await fetchRoute(origin, destination);
    if (!route) {
      return NextResponse.json(
        { error: "We could not find one of those places. Enter the distance manually." },
        { status: 404 },
      );
    }
    return NextResponse.json({
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      origin: route.originLabel,
      destination: route.destinationLabel,
      originCoords: route.origin,
      destinationCoords: route.destination,
      geometry: route.geometry,
      source: route.source,
      routing: route.source === "osrm" ? "osrm" : "estimate",
    });
  } catch {
    return NextResponse.json(
      { error: "Live data is temporarily unavailable." },
      { status: 503 },
    );
  }
}
