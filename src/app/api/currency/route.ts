import { NextResponse } from "next/server";
import { fetchRates } from "@/services/currency";

export const revalidate = 1800;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("from") ?? "EUR").toUpperCase();
  const to = searchParams.get("to");
  const symbols = to
    ? to.split(",").map((code) => code.trim().toUpperCase()).filter(Boolean)
    : [];

  try {
    const rates = await fetchRates(base, symbols);
    return NextResponse.json(rates, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { error: "Live exchange rates are temporarily unavailable." },
      { status: 503 },
    );
  }
}
