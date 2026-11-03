import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      // Sensitive user data is strictly forbidden from the public CMS endpoint
      if (key === "inferno_leads" || key.includes("lead") || key.includes("booking") || key.includes("applicant")) {
        return NextResponse.json({ success: false, error: "Access denied." }, { status: 403 });
      }

      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .eq("key", key)
        .maybeSingle();

      if (error) {
        console.error("Supabase GET single error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      let parsedValue = null;
      if (data?.value) {
        try {
          parsedValue = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
        } catch {
          parsedValue = data.value;
        }
      }

      return NextResponse.json({ success: true, key, value: parsedValue });
    }

    // Fetch all public CMS settings and collections in one query (strictly excluding sensitive user leads)
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .neq("key", "inferno_leads");

    if (error) {
      console.error("Supabase GET all error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const result: Record<string, any> = {};
    if (Array.isArray(data)) {
      for (const row of data) {
        if (!row.key || row.key === "inferno_leads" || row.key.includes("lead") || row.key.includes("booking")) continue;
        try {
          result[row.key] = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
        } catch {
          result[row.key] = row.value;
        }
      }
    }

    return NextResponse.json({ success: true, data: result, count: Object.keys(result).length });
  } catch (err: any) {
    console.error("API /api/cms GET unexpected exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch CMS records" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    if (Array.isArray(body?.batch)) {
      const rows = body.batch.map((item: { key: string; value: any }) => ({
        key: item.key,
        value: typeof item.value === "string" ? item.value : JSON.stringify(item.value),
      }));

      const { data, error } = await supabase
        .from("settings")
        .upsert(rows, { onConflict: "key" })
        .select("key");
      if (error) {
        console.error("Supabase batch upsert error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, count: data?.length || rows.length });
    }

    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ success: false, error: "Missing required 'key' parameter." }, { status: 400 });
    }

    const stringValue = typeof value === "string" ? value : JSON.stringify(value);

    const { error } = await supabase.from("settings").upsert(
      {
        key,
        value: stringValue,
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, key });
  } catch (err: any) {
    console.error("API /api/cms POST unexpected exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to update CMS record" }, { status: 500 });
  }
}

