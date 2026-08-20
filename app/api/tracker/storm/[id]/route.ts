import { NextRequest, NextResponse } from "next/server";
import { getStormById, generateStormGeoJSON, generateStormCSV } from "@/lib/nhc/repository";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const format = req.nextUrl.searchParams.get("format");

  try {
    const storm = await getStormById(id);
    if (!storm) {
      return NextResponse.json({ error: `Storm not found.` }, { status: 404 });
    }

    if (format === "geojson") {
      const geoJson = generateStormGeoJSON(storm);
      return new NextResponse(JSON.stringify(geoJson, null, 2), {
        headers: {
          "Content-Type": "application/geo+json",
          "Content-Disposition": `attachment; filename="${storm.name.toLowerCase()}_track.geojson"`,
        },
      });
    }

    if (format === "csv") {
      const csv = generateStormCSV(storm);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${storm.name.toLowerCase()}_data.csv"`,
        },
      });
    }

    return NextResponse.json(storm, {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logSecurityEvent({
      eventType: "API_STORM_BY_ID_ERROR",
      level: "ERROR",
      action: "GET /api/tracker/storm/[id]",
      details: { stormId: id, rawError: message },
    });
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}
