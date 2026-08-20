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
