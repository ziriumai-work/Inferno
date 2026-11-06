import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/email/sendBookingConfirmation";
import { formatGoogleMeetUrl, isInvalidOrFakeMeetUrl } from "@/lib/meetUtils";
import {
  isGoogleCalendarConnected,
  createGoogleCalendarMeetingEvent,
} from "@/lib/googleCalendar";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Authenticate Admin Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId, meetingUrl, customMessage } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Missing required bookingId." },
        { status: 400 }
      );
    }

    // 2. Fetch Booking and associated slot details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, booking_slots(*)")
      .eq("id", bookingId)
      .maybeSingle();

    if (fetchError || !booking) {
      return NextResponse.json(
        { success: false, error: `Booking not found: ${fetchError?.message || "Invalid ID"}` },
        { status: 404 }
      );
    }

    const slot = booking.booking_slots;

    let defaultMeetingUrl = process.env.NEXT_PUBLIC_DEFAULT_GOOGLE_MEET_URL;
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

    // 3. Calculate start and end times
    let startTime = new Date();
    let endTime = new Date(Date.now() + 30 * 60 * 1000);
    let timezone = "EST";

    if (slot?.start_time) {
      startTime = new Date(slot.start_time);
      endTime = slot.end_time ? new Date(slot.end_time) : new Date(startTime.getTime() + 30 * 60 * 1000);
      timezone = slot.timezone || "EST";
    }

    // 4. Resolve Google Meet URL (via Google Calendar API if connected, or fallback)
    let finalMeetUrl = meetingUrl;
    let calendarEventLink: string | undefined = undefined;

    const isConnected = await isGoogleCalendarConnected();
    const isCustomUrlProvided =
      meetingUrl &&
      !isInvalidOrFakeMeetUrl(meetingUrl) &&
      !meetingUrl.endsWith("/new") &&
      meetingUrl !== defaultMeetingUrl;

    if (isConnected && (!isCustomUrlProvided || isInvalidOrFakeMeetUrl(finalMeetUrl))) {
      try {
        const calEvent = await createGoogleCalendarMeetingEvent({
          summary: `Consultation: ${booking.meeting_type || "Operations Review"} - ${booking.full_name}`,
          description: `Booked by ${booking.full_name} (${booking.company || "N/A"})\nEmail: ${booking.email}\nScope: ${booking.notes || "None"}\n${customMessage ? `Note: ${customMessage}` : ""}`,
          startTime,
          endTime,
          attendeeEmail: booking.email,
          attendeeName: booking.full_name,
          bookingId: booking.id,
        });

        if (calEvent.success && calEvent.meetingUrl) {
          finalMeetUrl = calEvent.meetingUrl;
          calendarEventLink = calEvent.htmlLink;
        }
      } catch (calErr) {
        console.warn("Failed creating Google Calendar event:", calErr);
      }
    }

    const resolvedMeetingUrl = formatGoogleMeetUrl(
      finalMeetUrl || booking.meeting_url,
      booking.id,
      defaultMeetingUrl
    );

    // 5. Update meeting_url and status to 'confirmed' in the database
    try {
      await supabase
        .from("bookings")
        .update({ meeting_url: resolvedMeetingUrl, status: "confirmed" })
        .eq("id", bookingId);
    } catch (dbErr) {
      console.warn("Could not write meeting_url column directly:", dbErr);
    }

    // 5. Send Video Consultation Email with Google Meet link
    const emailResult = await sendBookingConfirmation(
      {
        bookingId: booking.id,
        fullName: booking.full_name,
        email: booking.email,
        company: booking.company || undefined,
        meetingType: booking.meeting_type || "consultation",
        notes: booking.notes || undefined,
        startTime,
        endTime,
        timezone,
        meetingUrl: resolvedMeetingUrl,
        customMessage: customMessage || undefined,
      },
      supabase
    );

    return NextResponse.json({
      success: true,
      message: `Google Meet link sent to ${booking.email}`,
      meetingUrl: resolvedMeetingUrl,
      emailResult,
    });
  } catch (err: any) {
    console.error("Error in /api/bookings/send-invite:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch meeting link email." },
      { status: 500 }
    );
  }
}

