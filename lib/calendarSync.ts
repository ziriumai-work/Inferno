import { SupabaseClient } from "@supabase/supabase-js";

interface BusyTimeRange {
  start: Date;
  end: Date;
  source: "google" | "outlook" | "ical";
}

// In-memory 45-second cache to absorb rapid repeated component re-renders
let cachedBusySlots: { timestamp: number; slots: BusyTimeRange[] } | null = null;
const CACHE_TTL_MS = 45 * 1000; // 45 seconds

/**
 * Fetch external Google / Outlook busy slots real-time.
 * Respects a short 45-second in-memory cache to absorb rapid user re-renders while staying strictly live.
 */
export async function fetchExternalBusySlots(startDate: Date, endDate: Date, forceRefresh = false): Promise<BusyTimeRange[]> {
  const now = Date.now();
  if (!forceRefresh && cachedBusySlots && (now - cachedBusySlots.timestamp) < CACHE_TTL_MS) {
    return cachedBusySlots.slots;
  }

  const busySlots: BusyTimeRange[] = [];

  // 1. Google Calendar FreeBusy API check (if configured)
  const googleApiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  const googleCalendarId = process.env.GOOGLE_CALENDAR_ID;

  if (googleApiKey && googleCalendarId) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/freeBusy?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            items: [{ id: googleCalendarId }]
          }),
          next: { revalidate: 30 }
        }
      );

      if (res.ok) {
        const data = await res.json();
        const calBusy = data?.calendars?.[googleCalendarId]?.busy || [];
        for (const item of calBusy) {
          busySlots.push({
            start: new Date(item.start),
            end: new Date(item.end),
            source: "google"
          });
        }
      }
    } catch (err) {
      console.error("Error querying Google Calendar FreeBusy API:", err);
    }
  }

  // 2. Outlook / Microsoft Graph API check (if configured)
  const outlookAccessToken = process.env.OUTLOOK_GRAPH_ACCESS_TOKEN;
  const outlookUserEmail = process.env.OUTLOOK_USER_EMAIL;

  if (outlookAccessToken && outlookUserEmail) {
    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${outlookUserEmail}/calendar/getSchedule`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${outlookAccessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            schedules: [outlookUserEmail],
            startTime: { dateTime: startDate.toISOString(), timeZone: "UTC" },
            endTime: { dateTime: endDate.toISOString(), timeZone: "UTC" },
            availabilityViewInterval: 30
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const schedule = data?.value?.[0]?.scheduleItems || [];
        for (const item of schedule) {
          if (item.status === "busy" || item.status === "oof") {
            busySlots.push({
              start: new Date(item.start.dateTime + "Z"),
              end: new Date(item.end.dateTime + "Z"),
              source: "outlook"
            });
          }
        }
      }
    } catch (err) {
      console.error("Error querying Outlook Graph API:", err);
    }
  }

  // Cache results for 45s
  cachedBusySlots = {
    timestamp: now,
    slots: busySlots
  };

  return busySlots;
}

/**
 * Compare database slots with external busy time ranges and mark conflicting slots unavailable in Supabase
 */
export async function syncExternalCalendarBusyBlocks(
  supabase: SupabaseClient,
  slots: Array<{ id: string; start_time: string; end_time: string; is_available: boolean }>,
  startDate: Date,
  endDate: Date
) {
  const busyRanges = await fetchExternalBusySlots(startDate, endDate);

  if (busyRanges.length === 0) return slots;

  const unavailableSlotIds: string[] = [];

  const updatedSlots = slots.map((slot) => {
    const slotStart = new Date(slot.start_time).getTime();
    const slotEnd = new Date(slot.end_time).getTime();

    const isConflict = busyRanges.some((busy) => {
      const busyStart = busy.start.getTime();
      const busyEnd = busy.end.getTime();
      // Overlap condition
      return slotStart < busyEnd && slotEnd > busyStart;
    });

    if (isConflict && slot.is_available) {
      unavailableSlotIds.push(slot.id);
      return { ...slot, is_available: false };
    }

    return slot;
  });

  // Batch update conflicts in Supabase database if any found
  if (unavailableSlotIds.length > 0) {
    await supabase
      .from("booking_slots")
      .update({ is_available: false })
      .in("id", unavailableSlotIds);
  }

  return updatedSlots;
}
