import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import MeetClient from "./MeetClient";
import { constructMetadata } from "@/lib/seoConfig";
import { createClient } from "@/lib/supabase/server";
import { isValidGoogleMeetUrl } from "@/lib/meetUtils";
import { isGoogleCalendarConnected, createGoogleCalendarMeetingEvent } from "@/lib/googleCalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Live Video Consultation Room | The Inferno Group LLC",
  description:
    "Direct, secure executive video conference bridge for B2G contracting consultations, teaming reviews, and disaster recovery audits.",
  path: "/meet",
});

export default async function MeetPage(props: {
  searchParams?: Promise<{ id?: string; booking?: string }>;
}) {
  const searchParams = await props.searchParams;
  const bookingId = searchParams?.id || searchParams?.booking || "";

  let redirectTargetUrl: string | null = null;
  let bookingData: any = null;

  try {
    const supabase = await createClient();

    // 1. Fetch site settings default meeting link if available
    let defaultMeetingUrl: string | null = process.env.NEXT_PUBLIC_DEFAULT_GOOGLE_MEET_URL || null;
    try {
      const { data: settingsRow } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "inferno_site_settings_v1")
        .maybeSingle();

      if (settingsRow?.value?.defaultMeetingUrl) {
        defaultMeetingUrl = settingsRow.value.defaultMeetingUrl;
      }
    } catch {
      // Non-blocking
    }

    if (bookingId) {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          full_name,
          email,
          company,
          notes,
          meeting_type,
          meeting_url,
          status,
          delay_minutes,
          delay_message,
          booking_slots (
            start_time,
            end_time,
            timezone
          )
        `)
        .eq("id", bookingId)
        .maybeSingle();

      if (data && !error) {
        const slotData: any = Array.isArray(data.booking_slots)
          ? data.booking_slots[0]
          : data.booking_slots;

        bookingData = {
          id: data.id,
          full_name: data.full_name,
          meeting_type: data.meeting_type,
          meeting_url: data.meeting_url,
          status: data.status,
          delay_minutes: data.delay_minutes,
          delay_message: data.delay_message,
          slot: slotData,
        };

        // If booking already has a valid Google Meet URL, redirect directly
        if (data.meeting_url && isValidGoogleMeetUrl(data.meeting_url)) {
          redirectTargetUrl = data.meeting_url;
        } else {
          // If Google Calendar is connected, dynamically create meeting event
          const isConnected = await isGoogleCalendarConnected();
          if (isConnected) {
            try {
              const startTime = slotData?.start_time
                ? new Date(slotData.start_time)
                : new Date();
              const endTime = slotData?.end_time
                ? new Date(slotData.end_time)
                : new Date(startTime.getTime() + 30 * 60 * 1000);

              const calEvent = await createGoogleCalendarMeetingEvent({
                summary: `Consultation: ${data.meeting_type || "Operations Review"} - ${data.full_name}`,
                description: `Booked by ${data.full_name} (${data.company || "N/A"})\nEmail: ${data.email}\nScope: ${data.notes || "None"}`,
                startTime,
                endTime,
                attendeeEmail: data.email,
                attendeeName: data.full_name,
                bookingId: data.id,
              });

              if (calEvent.success && calEvent.meetingUrl) {
                redirectTargetUrl = calEvent.meetingUrl;
                // Update booking record with real meeting url
                await supabase
                  .from("bookings")
                  .update({ meeting_url: calEvent.meetingUrl })
                  .eq("id", data.id);
              }
            } catch (calErr) {
              console.warn("Could not auto-generate calendar event in /meet:", calErr);
            }
          }

          // Fallback to default meeting URL if available
          if (!redirectTargetUrl && defaultMeetingUrl && isValidGoogleMeetUrl(defaultMeetingUrl)) {
            redirectTargetUrl = defaultMeetingUrl;
          }
        }
      } else if (defaultMeetingUrl && isValidGoogleMeetUrl(defaultMeetingUrl)) {
        redirectTargetUrl = defaultMeetingUrl;
      }
    } else if (defaultMeetingUrl && isValidGoogleMeetUrl(defaultMeetingUrl)) {
      redirectTargetUrl = defaultMeetingUrl;
    }
  } catch (err) {
    console.warn("Could not process /meet redirect:", err);
  }

  // If redirect target is determined, redirect to join meeting immediately
  if (redirectTargetUrl) {
    redirect(redirectTargetUrl);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-mono text-gray-400">Connecting to Google Meet Video Room...</p>
          </div>
        </div>
      }
    >
      <MeetClient initialBookingId={bookingId} bookingData={bookingData} />
    </Suspense>
  );
}
