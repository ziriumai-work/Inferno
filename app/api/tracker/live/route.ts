import { NextRequest, NextResponse } from "next/server";
import { getRealtimeUnifiedData } from "@/lib/nhc/repository";
import { TRACKER_UPDATE_INTERVAL_SECONDS } from "@/lib/nhc/types";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET(req: NextRequest) {
  try {
    const basin = req.nextUrl.searchParams.get("basin") || "atlc";
    const days = req.nextUrl.searchParams.get("days") || "7";
    const forceRefresh = req.nextUrl.searchParams.get("refresh") === "true";

    const data = await getRealtimeUnifiedData(basin, days, forceRefresh);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": forceRefresh
          ? "no-store, no-cache, must-revalidate"
          : `public, s-maxage=${TRACKER_UPDATE_INTERVAL_SECONDS}, stale-while-revalidate=120`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logSecurityEvent({
      eventType: "API_LIVE_TRACKER_ERROR",
      level: "ERROR",
      action: "GET /api/tracker/live",
      details: { rawError: message },
    });
    return NextResponse.json(
      { error: "Failed to fetch real-time hurricane and storm data.", storms: [], disturbances: [], alerts: [] },
      { status: 500 }
    );
  }
}

