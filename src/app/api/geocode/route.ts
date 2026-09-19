import { NextResponse } from "next/server";
import { geocode } from "@/services/geolocation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "A search query is required." }, { status: 400 });
  }
  try {
    const result = await geocode(query);
    if (!result) {
      return NextResponse.json({ error: "No location found." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Live data is temporarily unavailable." }, { status: 503 });
  }
}
