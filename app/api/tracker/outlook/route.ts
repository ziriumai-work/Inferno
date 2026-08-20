import { NextRequest, NextResponse } from "next/server";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET(req: NextRequest) {
  const basin = req.nextUrl.searchParams.get("basin") ?? "atlc";
  
  let url = "https://www.nhc.noaa.gov/index-at.xml";
  if (basin === "epac") {
    url = "https://www.nhc.noaa.gov/index-ep.xml";
  } else if (basin === "cpac") {
    url = "https://www.nhc.noaa.gov/index-cp.xml";
  }
  
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`NOAA returned status ${res.status}`);
    }
    const xml = await res.text();
    
    // Extract the first <item> content
    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
    if (!itemMatch) {
      return NextResponse.json({ error: "Outlook not found in feed." }, { status: 404 });
    }
    
    const itemContent = itemMatch[1];
    const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = itemContent.match(/<description>[\s\S]*?<!\[CDATA\[([\s\S]*?)\]\]>[\s\S]*?<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    
    let description = "";
    if (descMatch) {
      description = descMatch[1];
    } else {
      const fallbackDescMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
      description = fallbackDescMatch ? fallbackDescMatch[1] : "";
    }
    
    // Clean up <br /> tags and HTML formatting to render as text nicely
    description = description
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');
    
    return NextResponse.json({
      title: titleMatch ? titleMatch[1].trim() : "Tropical Weather Outlook",
      pubDate: pubDateMatch ? pubDateMatch[1].trim() : "",
      description: description.trim(),
    }, {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logSecurityEvent({
      eventType: "API_OUTLOOK_ERROR",
      level: "ERROR",
      action: "GET /api/tracker/outlook",
      details: { rawError: message },
    });
    return NextResponse.json({ error: "Unable to retrieve weather outlook at this time." }, { status: 502 });
  }
}
