import {
  generateICSContent,
  createGoogleCalendarUrl,
  createOutlookCalendarUrl,
} from "@/lib/calendarUtils";
import { formatGoogleMeetUrl } from "@/lib/meetUtils";
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
  meetingUrl?: string;
  customMessage?: string;
  isPending?: boolean;
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
    "The Inferno Group <operations@theinfernogroup.com>";
  const adminNotificationEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || "operations@theinfernogroup.com";

  const meetingTitle =
    CONSULT_TYPE_NAMES[params.meetingType] || "Operations Review Consultation";
  const formattedDate = params.startTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = `${params.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} (${params.timezone})`;
  const meetUrl = formatGoogleMeetUrl(params.meetingUrl, params.bookingId);

  const gCalUrl = createGoogleCalendarUrl({
    title: meetingTitle,
    description: `Booked by: ${params.fullName} (${params.company || "N/A"})\nEmail: ${params.email}\nScope: ${params.notes || "None"}\nGoogle Meet Room: ${meetUrl}`,
    startTime: params.startTime,
    endTime: params.endTime,
    location: meetUrl,
  });

  const outlookUrl = createOutlookCalendarUrl({
    title: meetingTitle,
    description: `Booked by: ${params.fullName} (${params.company || "N/A"})\nEmail: ${params.email}\nScope: ${params.notes || "None"}\nGoogle Meet Room: ${meetUrl}`,
    startTime: params.startTime,
    endTime: params.endTime,
    location: meetUrl,
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
          .meet-card { background: linear-gradient(135deg, #0d1b3d 0%, #1a2e5a 100%); border: 1px solid rgba(225, 77, 24, 0.4); border-radius: 10px; padding: 24px; margin: 24px 0; text-align: center; color: #ffffff; box-shadow: 0 4px 12px rgba(13, 27, 61, 0.15); }
          .meet-badge { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #e14d18; margin-bottom: 8px; }
          .meet-title { font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
          .meet-desc { font-size: 13px; color: #cbd5e1; margin: 0 0 16px 0; line-height: 1.5; }
          .btn-meet { display: inline-block; background-color: #e14d18; color: #ffffff !important; padding: 13px 26px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(225, 77, 24, 0.35); }
          .meet-url-fallback { margin-top: 14px; font-size: 11px; color: #94a3b8; word-break: break-all; }
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
          <h1>${params.isPending ? "Consultation Request Received" : "Consultation Confirmed"}</h1>
          <p>Dear ${params.fullName},</p>
          <p>${
            params.isPending
              ? "We have received your operations consultation request. Our administration is currently reviewing and confirming your requested time slot."
              : "Your operations consultation appointment has been officially confirmed by our administration."
          }</p>

          ${params.customMessage ? `<div style="background: #eff6ff; border-left: 4px solid #1a56c4; padding: 12px 16px; border-radius: 4px; margin: 16px 0; font-size: 14px; color: #1e3a8a;"><strong>Message from Inferno Operations:</strong><br>${params.customMessage}</div>` : ""}

          ${
            params.isPending
              ? `
                <!-- Pending Notice Banner -->
                <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 18px; margin: 20px 0; color: #92400e;">
                  <div style="font-weight: bold; font-size: 15px; margin-bottom: 6px; color: #b45309;">
                    ⏳ Status: Pending Operations Desk Confirmation
                  </div>
                  <div style="font-size: 13px; line-height: 1.5; color: #78350f;">
                    Our executive operations cadre is reviewing your requested consultation slot (<strong>${formattedDate} at ${formattedTime}</strong>). Once verified by our admin desk, you will receive an official confirmation email containing your direct <strong>Google Meet video room bridge</strong>.
                  </div>
                </div>
              `
              : (() => {
                  const isGoogleMeet = meetUrl.includes("meet.google.com");
                  return `
                <!-- Video Consultation Room Card -->
                <div class="meet-card">
                  <div class="meet-badge">🎥 ${isGoogleMeet ? "Google Meet Video Bridge Ready" : "Executive Video Bridge Ready"}</div>
                  <div class="meet-title">${isGoogleMeet ? "Your Live Google Meet Link" : "Your Live Consultation Room Link"}</div>
                  <p class="meet-desc">
                    ${
                      isGoogleMeet
                        ? "Connect directly with our advisory cadre at your scheduled time. You can join via web browser or the Google Meet mobile app."
                        : "Connect directly with our advisory cadre in your high-definition video room. Works in any web browser on mobile or desktop with zero downloads required."
                    }
                  </p>
                  <a href="${meetUrl}" class="btn-meet" target="_blank" rel="noopener noreferrer">
                    👉 ${isGoogleMeet ? "Click Here to Join Google Meet" : "Click Here to Join Video Consultation"}
                  </a>
                  <div class="meet-url-fallback">
                    Direct Meeting Link: <a href="${meetUrl}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">${meetUrl}</a>
                  </div>
                </div>
              `;
                })()
          }

          <div class="details-card">
            <div class="detail-row"><span class="detail-label">Service Area:</span> ${meetingTitle}</div>
            <div class="detail-row"><span class="detail-label">${params.isPending ? "Requested Date:" : "Confirmed Date:"}</span> ${formattedDate}</div>
            <div class="detail-row"><span class="detail-label">${params.isPending ? "Requested Time:" : "Confirmed Time:"}</span> ${formattedTime}</div>
            <div class="detail-row"><span class="detail-label">Organization:</span> ${params.company || "N/A"}</div>
            ${params.notes ? `<div class="detail-row"><span class="detail-label">Scope Parameter:</span> ${params.notes}</div>` : ""}
          </div>

          ${
            !params.isPending
              ? `
                <p style="color: #334155; font-weight: 500;">Add this appointment to your calendar:</p>
                <div class="btn-group">
                  <a href="${gCalUrl}" class="btn btn-google" target="_blank">📅 Add to Google Calendar</a>
                  <a href="${outlookUrl}" class="btn btn-outlook" target="_blank">📅 Add to Outlook Calendar</a>
                </div>
              `
              : ""
          }

          <div class="footer">
            <strong style="color: #0d1b3d;">The Inferno Group LLC</strong> &mdash; Executive Operations &amp; Contracting Desk<br>
            <span style="display: inline-block; margin-top: 4px; font-size: 11px; color: #94a3b8; font-family: monospace;">UEI: QW6RHJACHA56 &bull; CAGE: 22VP2 &bull; SBA HUBZone &amp; VOSB Certified</span><br>
            <span style="display: inline-block; margin-top: 6px;">If you need to reschedule or have questions, reply directly to this email or contact us at <a href="mailto:${adminNotificationEmail}" style="color: #e14d18; text-decoration: none;">${adminNotificationEmail}</a>.</span>
          </div>
        </div>
      </body>
    </html>
  `;

  // ics file content
  const icsData = generateICSContent({
    title: meetingTitle,
    description: `Booked by ${params.fullName} (${params.company || "N/A"})\nEmail: ${params.email}\nScope: ${params.notes || "None"}\nGoogle Meet Video Room: ${meetUrl}`,
    startTime: params.startTime,
    endTime: params.endTime,
    location: meetUrl,
  });

  let result: EmailDispatchResult;

  if (resendApiKey) {
    try {
      const emailSubject = params.isPending
        ? `Consultation Request Received (Pending Review): ${meetingTitle}`
        : `✓ Booking Confirmed: ${meetingTitle}`;

      const payload: Record<string, any> = {
        from: fromEmail,
        to: [params.email],
        reply_to: adminNotificationEmail || "operations@theinfernogroup.com",
        subject: emailSubject,
        html: htmlBody,
      };

      if (!params.isPending) {
        payload.attachments = [
          {
            filename: `inferno-consultation-${params.bookingId}.ics`,
            content: Buffer.from(icsData).toString("base64"),
          },
        ];
      }

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
