import { NextResponse } from "next/server";
import { fetchTropicalDisturbances } from "@/lib/nhc/apiService";
import { TRACKER_UPDATE_INTERVAL_MS, TRACKER_UPDATE_INTERVAL_SECONDS } from "@/lib/nhc/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const basin = searchParams.get("basin") || "atlc";
    const days = searchParams.get("days") || "7";
    const forceRefresh = searchParams.get("refresh") === "true";

    const disturbances = await fetchTropicalDisturbances(basin, days);
    const fetchedAt = new Date().toISOString();
    const nextUpdateAt = new Date(Date.now() + TRACKER_UPDATE_INTERVAL_MS).toISOString();

    return NextResponse.json(
      {
        basin,
        days,
        count: disturbances.length,
        disturbances,
        fetchedAt,
        nextUpdateAt,
      },
      {
        headers: {
          "Cache-Control": forceRefresh
            ? "no-store"
            : `public, max-age=${TRACKER_UPDATE_INTERVAL_SECONDS}, s-maxage=${TRACKER_UPDATE_INTERVAL_SECONDS}, stale-while-revalidate=3600`,
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