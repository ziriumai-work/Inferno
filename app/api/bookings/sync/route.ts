import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchExternalBusySlots, syncExternalCalendarBusyBlocks } from "@/lib/calendarSync";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Sync next 30 days

    // Force refresh external busy slots from Google & Outlook
    const busyRanges = await fetchExternalBusySlots(startDate, endDate, true);

    // Fetch active slots
    const { data: slots, error } = await supabase
      .from("booking_slots")
      .select("*")
      .gte("start_time", startDate.toISOString())
      .lte("start_time", endDate.toISOString());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const updatedSlots = await syncExternalCalendarBusyBlocks(
      supabase,
      slots || [],
      startDate,
      endDate
    );

    return NextResponse.json({
      success: true,
      syncedRangesCount: busyRanges.length,
      totalSlotsEvaluated: slots?.length || 0,
      busyRanges,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("API error in POST /api/bookings/sync:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to trigger external calendar sync." }, { status: 405 });
}
