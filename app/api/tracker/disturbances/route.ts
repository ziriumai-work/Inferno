import { NextResponse } from "next/server";
import { fetchTropicalDisturbances } from "@/lib/nhc/apiService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const basin = searchParams.get("basin") || "atlc";
    const days = searchParams.get("days") || "7";

    const disturbances = await fetchTropicalDisturbances(basin, days);

    return NextResponse.json(
      {
        basin,
        days,
        count: disturbances.length,
        disturbances,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=180, s-maxage=300",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to fetch tropical disturbances", disturbances: [], details: message },
      { status: 500 }
    );
  }
}
