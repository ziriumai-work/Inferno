import { NextRequest, NextResponse } from "next/server";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") ?? req.nextUrl.origin;
    const url = `${origin}/api/tracker/storms`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Sub-request returned status ${res.status}`);
    }
    const json = await res.json();
    return NextResponse.json(json, {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": origin,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logSecurityEvent({
      eventType: "API_HURRICANE_ALIAS_ERROR",
      level: "ERROR",
      action: "GET /api/hurricane",
      details: { rawError: message },
    });
    return NextResponse.json({ error: "Failed to fetch hurricane data." }, { status: 500 });
  }
}
