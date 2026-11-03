import {
  generateICSContent,
  createGoogleCalendarUrl,
  createOutlookCalendarUrl,
} from "@/lib/calendarUtils";
import { SupabaseClient } from "@supabase/supabase-js";

export interface BookingConfirmationParams {
  bookingId: string;
  fullName: string;
  email: string;
  company?: string;
  meetingType: string;
  notes?: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
}

export interface EmailDispatchResult {
  emailSent: boolean;
  provider: "resend" | "fallback_logger";
  status: "sent" | "failed" | "logged_offline";
  messageId?: string;
  error?: string;
}

const CONSULT_TYPE_NAMES: Record<string, string> = {
  sba: "SBA Socioeconomic Certifications Consultation (30m)",
  emergency: "FEMA Disaster Recovery Programmatic Audit Compliance (45m)",
  teaming: "Prime/Subcontractor Joint-Venture Teaming Review (30m)",
};

/**
 * Sends a booking confirmation email via Resend API and records execution status in Supabase.
 * If Resend fails or key is unconfigured, logs detailed failure record to safety net (booking_emails table).
 */
export async function sendBookingConfirmation(
  params: BookingConfirmationParams,
  supabase?: SupabaseClient,
): Promise<EmailDispatchResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "The Inferno Group <onboarding@resend.dev>";
  const adminNotificationEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || "operations@infernogroup.com";

  const meetingTitle =
    CONSULT_TYPE_NAMES[params.meetingType] || "Operations Review Consultation";
  const formattedDate = params.startTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = `${params.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} (${params.timezone})`;

  const gCalUrl = createGoogleCalendarUrl({
    title: meetingTitle,
    description: `Booked by: ${params.fullName} (${params.company || "N/A"})\nEmail: ${params.email}\nScope: ${params.notes || "None"}`,
    startTime: params.startTime,
    endTime: params.endTime,
  });

  const outlookUrl = createOutlookCalendarUrl({
    title: meetingTitle,
    description: `Booked by: ${params.fullName} (${params.company || "N/A"})\nEmail: ${params.email}\nScope: ${params.notes || "None"}`,
    startTime: params.startTime,
    endTime: params.endTime,
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0d1b3d; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .logo { font-size: 20px; font-weight: bold; color: #e14d18; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; }
          h1 { font-size: 22px; color: #0d1b3d; margin-top: 0; margin-bottom: 16px; font-weight: 700; }
          p { font-size: 15px; line-height: 1.6; color: #334155; }
          .details-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }
          .detail-row { margin-bottom: 10px; font-size: 14px; color: #1e293b; }
          .detail-label { color: #e14d18; font-weight: bold; }
          .btn-group { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
          .btn { display: inline-block; padding: 12px 20px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 14px; text-align: center; }
          .btn-google { background-color: #1a56c4; color: #ffffff; }
          .btn-outlook { background-color: #0d1b3d; color: #ffffff; }
          .footer { font-size: 12px; color: #64748b; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🔥 The Inferno Group</div>
          <h1>Consultation Confirmed</h1>
          <p>Dear ${params.fullName},</p>
          <p>Your operations consultation appointment has been scheduled and locked in our calendar desk system.</p>

          <div class="details-card">
            <div class="detail-row"><span class="detail-label">Service Area:</span> ${meetingTitle}</div>
            <div class="detail-row"><span class="detail-label">Date:</span> ${formattedDate}</div>
            <div class="detail-row"><span class="detail-label">Time Window:</span> ${formattedTime}</div>
            <div class="detail-row"><span class="detail-label">Organization:</span> ${params.company || "N/A"}</div>
            ${params.notes ? `<div class="detail-row"><span class="detail-label">Scope Parameter:</span> ${params.notes}</div>` : ""}
          </div>

          <p style="color: #334155; font-weight: 500;">Add this meeting directly to your personal calendar:</p>
          <div class="btn-group">
            <a href="${gCalUrl}" class="btn btn-google" target="_blank">📅 Add to Google Calendar</a>
            <a href="${outlookUrl}" class="btn btn-outlook" target="_blank">📅 Add to Outlook Calendar</a>
          </div>

          <div class="footer">
            The Inferno Group LLC — Live Operations & Contracting Desk<br>
            If you need to reschedule, please reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  // ics file content
  const icsData = generateICSContent({
    title: meetingTitle,
    description: `Booked by ${params.fullName} (${params.company || "N/A"})\nEmail: ${params.email}\nScope: ${params.notes || "None"}`,
    startTime: params.startTime,
    endTime: params.endTime,
  });

  let result: EmailDispatchResult;

  if (resendApiKey) {
    try {
      const payload: Record<string, any> = {
        from: fromEmail,
        to: [params.email],
        subject: `Booking Confirmed: ${meetingTitle}`,
        html: htmlBody,
        attachments: [
          {
            filename: `inferno-consultation-${params.bookingId}.ics`,
            content: Buffer.from(icsData).toString("base64"),
          },
        ],
      };

      // Include bcc if adminNotificationEmail is provided and distinct
      if (adminNotificationEmail && adminNotificationEmail !== params.email) {
        payload.bcc = [adminNotificationEmail];
      }

      let resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let resData = await resendRes.json();

      // Sandbox safety fallback: If Resend blocks sending to unverified recipient domain in testing mode, redirect to account owner email (rafkhan9323@gmail.com)
      if (
        !resendRes.ok &&
        (resendRes.status === 403 || resendRes.status === 422) &&
        adminNotificationEmail
      ) {
        console.warn(
          `Resend sandbox mode active for ${params.email}: ${resData.message}. Rerouting sandbox test copy to owner inbox (${adminNotificationEmail}).`,
        );
        delete payload.bcc;
        payload.to = [adminNotificationEmail];
        payload.subject = `[Sandbox Test Delivery] Booking Confirmed: ${meetingTitle} (Client: ${params.fullName} <${params.email}>)`;

        resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        resData = await resendRes.json();
      }

      if (resendRes.ok && resData.id) {
        result = {
          emailSent: true,
          provider: "resend",
          status: "sent",
          messageId: resData.id,
        };
      } else {
        const errorMsg =
          resData.message ||
          resData.error ||
          "Resend API returned non-OK response.";
        console.error("Resend API dispatch error:", errorMsg);
        result = {
          emailSent: false,
          provider: "resend",
          status: "failed",
          error: errorMsg,
        };
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Resend network error:", errorMessage);
      result = {
        emailSent: false,
        provider: "resend",
        status: "failed",
        error: errorMessage || "Failed to reach Resend API endpoint.",
      };
    }
  } else {
    // Missing API Key -> Logged safety net
    result = {
      emailSent: false,
      provider: "fallback_logger",
      status: "logged_offline",
      error: "RESEND_API_KEY is not configured in environment variables.",
    };
  }

  // Safety net DB recording: Always log dispatch attempt result into Supabase or logs
  if (supabase) {
    try {
      await supabase.from("booking_emails").insert({
        booking_id: params.bookingId,
        recipient_email: params.email,
        subject: `Booking Confirmed: ${meetingTitle}`,
        status: result.status,
        provider: result.provider,
        message_id: result.messageId || null,
        error_message: result.error || null,
        sent_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error(
        "Error writing safety-net record to booking_emails:",
        dbErr,
      );
    }
  }

  return result;
}
