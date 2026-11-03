import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/email/sendBookingConfirmation";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { slot_id, full_name, email, company, phone, meeting_type, notes } = body;

    if (!slot_id || !full_name || !email || !meeting_type) {
      return NextResponse.json(
        { error: "Missing required booking details (slot_id, full_name, email, meeting_type)." },
        { status: 400 }
      );
    }

    // BUG-05: Strict Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // BUG-05: Phone format validation (if provided)
    if (phone) {
      const phoneDigits = String(phone).replace(/[\s\-\(\)\+\.]/g, "");
      if (!/^\d{7,15}$/.test(phoneDigits)) {
        return NextResponse.json(
          { error: "Please provide a valid telephone number." },
          { status: 400 }
        );
      }
    }

    // 1. Check slot availability
    const { data: slot, error: slotFetchError } = await supabase
      .from("booking_slots")
      .select("*")
      .eq("id", slot_id)
      .single();

    if (slotFetchError || !slot) {
      return NextResponse.json({ error: "Selected time slot was not found." }, { status: 444 });
    }

    if (!slot.is_available) {
      return NextResponse.json(
        { error: "This consultation slot has already been reserved by another client. Please select an alternate slot." },
        { status: 409 }
      );
    }

    // 2. Mark slot as unavailable atomically
    const { error: slotUpdateError } = await supabase
      .from("booking_slots")
      .update({ is_available: false })
      .eq("id", slot_id)
      .eq("is_available", true); // Safety check for concurrent updates

    if (slotUpdateError) {
      console.error("Slot update error:", slotUpdateError);
      return NextResponse.json(
        { error: "Failed to reserve time slot. It may have just been taken." },
        { status: 409 }
      );
    }

    // 3. Create booking record
    const { data: newBooking, error: bookingInsertError } = await supabase
      .from("bookings")
      .insert({
        slot_id,
        full_name,
        email,
        company: company || null,
        phone: phone || null,
        meeting_type,
        notes: notes || null,
        status: "confirmed"
      })
      .select()
      .single();

    if (bookingInsertError) {
      console.error("Booking creation error:", bookingInsertError);
      // Revert slot availability if booking insertion failed
      await supabase.from("booking_slots").update({ is_available: true }).eq("id", slot_id);

      return NextResponse.json(
        { error: `Database insertion error: ${bookingInsertError.message}` },
        { status: 500 }
      );
    }

    // 4. Send Confirmation Email via Resend with Safety Net Logging
    let emailResult = null;
    try {
      emailResult = await sendBookingConfirmation(
        {
          bookingId: newBooking.id,
          fullName: full_name,
          email,
          company: company || undefined,
          meetingType: meeting_type,
          notes: notes || undefined,
          startTime: new Date(slot.start_time),
          endTime: new Date(slot.end_time),
          timezone: slot.timezone || "EST"
        },
        supabase
      );
    } catch (emailErr) {
      console.error("Error triggering confirmation email:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Consultation booked successfully.",
        booking: newBooking,
        slot,
        emailResult
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("API error in POST /api/bookings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // BUG-02: Protect endpoint - require authenticated user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized access. Authentication required." },
        { status: 401 }
      );
    }

    const { data: bookingsList, error } = await supabase
      .from("bookings")
      .select(`
        *,
        booking_slots (
          id,
          start_time,
          end_time,
          timezone,
          is_available
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings: bookingsList }, { status: 200 });
  } catch (err: any) {
    console.error("API error in GET /api/bookings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticated admin required
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized access. Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, meeting_url, notes, delay_minutes, delay_message } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing booking id parameter." }, { status: 400 });
    }

    // Try full update
    const updatePayload: Record<string, any> = {};
    if (status !== undefined) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;
    if (meeting_url !== undefined) updatePayload.meeting_url = meeting_url;
    if (delay_minutes !== undefined) updatePayload.delay_minutes = delay_minutes;
    if (delay_message !== undefined) updatePayload.delay_message = delay_message;

    let updatedRecord = null;

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update(updatePayload)
      .eq("id", id)
      .select("*, booking_slots(*)")
      .maybeSingle();

    if (updateError) {
      // If columns like delay_minutes or meeting_url do not exist in database table schema,
      // fallback to updating status and appending meeting details to notes column
      const fallbackPayload: Record<string, any> = {};
      if (status !== undefined) fallbackPayload.status = status;

      let combinedNotes = notes !== undefined ? notes : "";
      if (delay_message || delay_minutes) {
        const delayTag = `[DELAY: +${delay_minutes || 0}m - ${delay_message || "Operational delay notice"}]`;
        if (meeting_url) {
          combinedNotes = combinedNotes ? `${combinedNotes}\n${delayTag}\n[MEETING: ${meeting_url}]` : `${delayTag}\n[MEETING: ${meeting_url}]`;
        } else {
          combinedNotes = combinedNotes ? `${combinedNotes}\n${delayTag}` : delayTag;
        }
      } else if (meeting_url) {
        combinedNotes = combinedNotes ? `${combinedNotes}\n[MEETING: ${meeting_url}]` : `[MEETING: ${meeting_url}]`;
      }

      if (combinedNotes) {
        fallbackPayload.notes = combinedNotes;
      }

      const { data: fallbackUpdated, error: fallbackErr } = await supabase
        .from("bookings")
        .update(fallbackPayload)
        .eq("id", id)
        .select("*, booking_slots(*)")
        .maybeSingle();

      if (fallbackErr) {
        return NextResponse.json({ error: fallbackErr.message }, { status: 500 });
      }
      updatedRecord = fallbackUpdated;
    } else {
      updatedRecord = updated;
    }

    return NextResponse.json({ success: true, booking: updatedRecord }, { status: 200 });
  } catch (err: any) {
    console.error("API error in PATCH /api/bookings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticated admin required
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized access. Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing booking id parameter." }, { status: 400 });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("slot_id")
      .eq("id", id)
      .maybeSingle();

    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (booking?.slot_id) {
      await supabase
        .from("booking_slots")
        .update({ is_available: true })
        .eq("id", booking.slot_id);
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (err: any) {
    console.error("API error in DELETE /api/bookings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
