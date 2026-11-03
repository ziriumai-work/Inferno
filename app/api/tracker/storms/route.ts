import { NextRequest, NextResponse } from "next/server";
import { getActiveStorms } from "@/lib/nhc/repository";
import { TRACKER_UPDATE_INTERVAL_HOURS, TRACKER_UPDATE_INTERVAL_SECONDS } from "@/lib/nhc/types";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET(req: NextRequest) {
  try {
    const forceRefresh = req.nextUrl.searchParams.get("refresh") === "true";
    const { storms, recentStorms, metrics, fetchedAt, nextUpdateAt } = await getActiveStorms(forceRefresh);
    return NextResponse.json(
      {
        fetchedAt,
        nextUpdateAt,
        updateIntervalSeconds: TRACKER_UPDATE_INTERVAL_SECONDS,
        updateIntervalHours: TRACKER_UPDATE_INTERVAL_HOURS,
        dataSource: "NOAA National Hurricane Center (NHC)",
        metrics,
        storms,
        recentStorms,
      },
      {
        headers: {
          "Cache-Control": forceRefresh
            ? "no-store, no-cache, must-revalidate"
            : `public, s-maxage=${TRACKER_UPDATE_INTERVAL_SECONDS}, stale-while-revalidate=120`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logSecurityEvent({
      eventType: "API_STORMS_ERROR",
      level: "ERROR",
      action: "GET /api/tracker/storms",
      details: { rawError: message },
    });
    return NextResponse.json(
      { error: "An error occurred while fetching storms data.", storms: [], metrics: null },
      { status: 500 }
    );
  }
}