import { NextResponse } from "next/server";

// Cache in-memory for 30 minutes
let cachedData: { timestamp: number; data: unknown } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const naics = searchParams.get("naics") || "541611,624230,562910,561422,561210,488510,541690";
  const apiKey = process.env.SAM_GOV_API_KEY;

  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedData.data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-Cache-Status": "HIT",
      },
    });
  }

  // If SAM_GOV_API_KEY is not configured, return compliant stub state with registration CTA guidance
  if (!apiKey) {
    const stubPayload = {
      source: "SAM.gov Opportunities API (Integration Ready)",
      status: "live_stub",
      opportunities: [],
      message:
        "No open opportunities returned from live feed. To connect live automated SAM.gov pulls, configure SAM_GOV_API_KEY in server environment.",
      naicsFilters: naics.split(","),
      setAsides: ["HUBZone", "VOSB", "Total Small Business"],
      lastSynced: new Date().toISOString(),
    };

    return NextResponse.json(stubPayload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-Cache-Status": "STUB",
      },
    });
  }

  try {
    const samUrl = new URL("https://api.sam.gov/opportunities/v2/search");
    samUrl.searchParams.set("api_key", apiKey);
    samUrl.searchParams.set("limit", "25");
    samUrl.searchParams.set("ncode", naics);
    samUrl.searchParams.set("typeOfSetAside", "SBA,HZC,VOSB");

    const response = await fetch(samUrl.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`SAM.gov API responded with status ${response.status}`);
    }

    const data = await response.json();
    cachedData = { timestamp: now, data };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-Cache-Status": "MISS",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "SAM.gov fetch failed",
        details: message,
        opportunities: [],
      },
      { status: 502 }
    );
  }
}

