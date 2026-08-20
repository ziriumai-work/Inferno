import { NextResponse } from "next/server";
import { getActiveStorms } from "@/lib/nhc/repository";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET() {
  try {
    const { storms, metrics, fetchedAt } = await getActiveStorms();
    return NextResponse.json(
      {
        fetchedAt,
        metrics,
        storms,
      },
      {
        headers: {
          "Cache-Control": "no-store",
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
