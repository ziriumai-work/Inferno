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

      // Try 'settings' table first, fall back to 'site_settings'
      let record: any = null;
      const { data: sData, error: sError } = await supabase
        .from("settings")
        .select("key, value")
        .eq("key", key)
        .maybeSingle();

      if (!sError && sData) {
        record = sData;
      } else {
        const { data: ssData } = await supabase
          .from("site_settings")
          .select("key, value")
          .eq("key", key)
          .maybeSingle();
        if (ssData) record = ssData;
      }

      let parsedValue = null;
      if (record?.value) {
        try {
          parsedValue = typeof record.value === "string" ? JSON.parse(record.value) : record.value;
        } catch {
          parsedValue = record.value;
        }
      }

      return NextResponse.json({ success: true, key, value: parsedValue });
    }

    // Fetch all public CMS settings and collections (strictly excluding sensitive user leads)
    let rows: any[] | null = null;
    const { data: sRows, error: sErr } = await supabase
      .from("settings")
      .select("key, value")
      .neq("key", "inferno_leads");

    if (!sErr && Array.isArray(sRows) && sRows.length > 0) {
      rows = sRows;
    } else {
      const { data: ssRows, error: ssErr } = await supabase
        .from("site_settings")
        .select("key, value")
        .neq("key", "inferno_leads");
      if (!ssErr && Array.isArray(ssRows)) {
        rows = ssRows;
      }
    }

    const result: Record<string, any> = {};
    if (Array.isArray(rows)) {
      for (const row of rows) {
        if (!row.key || row.key === "inferno_leads" || row.key.includes("lead") || row.key.includes("booking")) continue;
        try {
          result[row.key] = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
        } catch {
          result[row.key] = row.value;
        }
      }
    }

    return NextResponse.json({ success: true, data: result, count: Object.keys(result).length }, { status: 200 });
  } catch (err: any) {
    console.warn("API /api/cms GET notice (using local defaults):", err?.message);
    return NextResponse.json({ success: true, data: {}, count: 0 }, { status: 200 });
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

      // Try 'settings' table first, fall back to 'site_settings'
      let upsertResult = await supabase
        .from("settings")
        .upsert(rows, { onConflict: "key" })
        .select("key");

      if (upsertResult.error) {
        upsertResult = await supabase
          .from("site_settings")
          .upsert(rows, { onConflict: "key" })
          .select("key");
      }

      if (upsertResult.error) {
        console.error("Supabase batch upsert error:", upsertResult.error);
        return NextResponse.json({ success: false, error: upsertResult.error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, count: upsertResult.data?.length || rows.length });
    }

    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ success: false, error: "Missing required 'key' parameter." }, { status: 400 });
    }

    const stringValue = typeof value === "string" ? value : JSON.stringify(value);

    let singleUpsert = await supabase.from("settings").upsert(
      { key, value: stringValue },
      { onConflict: "key" }
    );

    if (singleUpsert.error) {
      singleUpsert = await supabase.from("site_settings").upsert(
        { key, value: stringValue },
        { onConflict: "key" }
      );
    }

    if (singleUpsert.error) {
      console.error("Supabase upsert error:", singleUpsert.error);
      return NextResponse.json({ success: false, error: singleUpsert.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, key });
  } catch (err: any) {
    console.error("API /api/cms POST unexpected exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to update CMS record" }, { status: 500 });
  }
}

