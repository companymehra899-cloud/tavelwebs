import { NextResponse } from "next/server";
import { estimateDistance } from "@/services/distance";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin")?.trim();
  const destination = searchParams.get("destination")?.trim();

  if (!origin || !destination) {
    return NextResponse.json({ error: "Both origin and destination are required." }, { status: 400 });
  }

  try {
    const result = await estimateDistance(origin, destination);
    if (!result) {
      return NextResponse.json(
        { error: "We could not find one of those places. Enter the distance manually." },
        { status: 404 },
      );
    }
    return NextResponse.json({
      distanceKm: result.distanceKm,
      origin: result.originLabel,
      destination: result.destinationLabel,
      detourApplied: true,
    });
  } catch {
    return NextResponse.json({ error: "Live data is temporarily unavailable." }, { status: 503 });
  }
}
