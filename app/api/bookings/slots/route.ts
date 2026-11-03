import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncExternalCalendarBusyBlocks } from "@/lib/calendarSync";

// Standard daily business hours in Eastern Time (09:00 AM to 04:30 PM EST/EDT)
const DAILY_SLOT_TIMES = [
  { startHour: 9, startMin: 0, durationMin: 30 },
  { startHour: 9, startMin: 30, durationMin: 30 },
  { startHour: 10, startMin: 0, durationMin: 30 },
  { startHour: 10, startMin: 30, durationMin: 30 },
  { startHour: 11, startMin: 0, durationMin: 30 },
  { startHour: 13, startMin: 30, durationMin: 30 },
  { startHour: 14, startMin: 0, durationMin: 30 },
  { startHour: 14, startMin: 30, durationMin: 30 },
  { startHour: 15, startMin: 0, durationMin: 30 },
  { startHour: 15, startMin: 30, durationMin: 30 },
  { startHour: 16, startMin: 0, durationMin: 30 },
];

function getEasternDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

function getEasternOffsetString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(date);
  const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT-4";
  const match = tzPart.match(/GMT([+-]\d+)/);
  if (match) {
    const hours = parseInt(match[1], 10);
    const sign = hours >= 0 ? "+" : "-";
    const absHours = Math.abs(hours);
    return `${sign}${String(absHours).padStart(2, "0")}:00`;
  }
  return "-04:00";
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const startDateParam = searchParams.get("startDate");
    const daysParam = parseInt(searchParams.get("days") || "7", 10);

    let baseDate = startDateParam ? new Date(startDateParam) : new Date();
    baseDate.setHours(0, 0, 0, 0);

    // Calculate start and end date boundaries for query
    const endDate = new Date(baseDate);
    endDate.setDate(endDate.getDate() + daysParam + 2);

    // Query existing slots from Supabase
    const { data: existingSlots, error: fetchError } = await supabase
      .from("booking_slots")
      .select("*")
      .gte("start_time", baseDate.toISOString())
      .lte("start_time", endDate.toISOString())
      .order("start_time", { ascending: true });

    if (fetchError) {
      console.error("Error fetching booking slots:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Check if we need to auto-generate default business slots for upcoming business days
    const businessDays: Date[] = [];
    let curr = new Date(baseDate);
    while (businessDays.length < daysParam) {
      const dayOfWeek = curr.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sat/Sun
        businessDays.push(new Date(curr));
      }
      curr.setDate(curr.getDate() + 1);
    }

    const newSlotsToInsert: Array<{ start_time: string; end_time: string; timezone: string; is_available: boolean }> = [];

    for (const bDay of businessDays) {
      const dateStr = getEasternDateString(bDay);
      const offsetStr = getEasternOffsetString(bDay);

      for (const slotDef of DAILY_SLOT_TIMES) {
        const startHourStr = String(slotDef.startHour).padStart(2, "0");
        const startMinStr = String(slotDef.startMin).padStart(2, "0");
        const slotStart = new Date(`${dateStr}T${startHourStr}:${startMinStr}:00${offsetStr}`);

        const endMinTotal = slotDef.startMin + slotDef.durationMin;
        const endHour = slotDef.startHour + Math.floor(endMinTotal / 60);
        const endMin = endMinTotal % 60;
        const endHourStr = String(endHour).padStart(2, "0");
        const endMinStr = String(endMin).padStart(2, "0");
        const slotEnd = new Date(`${dateStr}T${endHourStr}:${endMinStr}:00${offsetStr}`);

        const slotStartTime = slotStart.getTime();

        // Check if a slot at this start_time already exists in existingSlots
        const slotExists = existingSlots?.some(
          (s) => new Date(s.start_time).getTime() === slotStartTime
        );

        if (!slotExists) {
          newSlotsToInsert.push({
            start_time: slotStart.toISOString(),
            end_time: slotEnd.toISOString(),
            timezone: "EST",
            is_available: true,
          });
        }
      }
    }

    if (newSlotsToInsert.length > 0) {
      const { data: insertedSlots, error: insertError } = await supabase
        .from("booking_slots")
        .insert(newSlotsToInsert)
        .select();

      if (!insertError && insertedSlots) {
        existingSlots?.push(...insertedSlots);
      }
    }

    // Live sync external calendar (Google / Outlook freebusy) real-time
    const syncedSlots = await syncExternalCalendarBusyBlocks(
      supabase,
      existingSlots || [],
      baseDate,
      endDate
    );

    // Filter out past slots and sort ascending
    const nowTimestamp = Date.now();
    const finalSlots = syncedSlots
      .filter((s) => new Date(s.start_time).getTime() > nowTimestamp)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return NextResponse.json({ slots: finalSlots, syncedAt: new Date().toISOString() }, { status: 200 });
  } catch (err: any) {
    console.error("API error in GET /api/bookings/slots:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
