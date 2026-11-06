"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { isValidGoogleMeetUrl } from "@/lib/meetUtils";

interface MeetClientProps {
  initialBookingId?: string;
  bookingData?: {
    id: string;
    full_name?: string;
    meeting_type?: string;
    meeting_url?: string;
    status?: string;
    delay_minutes?: number;
    delay_message?: string;
    slot?: {
      start_time: string;
      end_time: string;
      timezone: string;
    };
  } | null;
}

const CONSULT_TITLES: Record<string, string> = {
  sba: "SBA Socioeconomic Certifications Consultation",
  emergency: "FEMA Disaster Recovery Programmatic Audit Compliance",
  teaming: "Prime/Subcontractor Joint-Venture Teaming Review",
};

export default function MeetClient({ initialBookingId, bookingData }: MeetClientProps) {
  const [bookingId, setBookingId] = useState(initialBookingId || "");
  const [copied, setCopied] = useState(false);
  const [isJoined, setIsJoined] = useState(true);
  const [meetingMode, setMeetingMode] = useState<"embedded" | "google_meet">("embedded");

  const booking = bookingData;
  const isGoogleMeetValid = isValidGoogleMeetUrl(booking?.meeting_url);
  const googleMeetUrl = isGoogleMeetValid ? booking!.meeting_url! : "";

  // Auto-redirect to Google Meet room if valid
  useEffect(() => {
    if (googleMeetUrl && isValidGoogleMeetUrl(googleMeetUrl)) {
      window.location.href = googleMeetUrl;
    }
  }, [googleMeetUrl]);

  // Compute conference room identifier
  const safeRoomId = bookingId ? `TheInfernoGroup-${bookingId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}` : "TheInfernoGroup-Consultation";

  // Formatted date and time
  const formattedTime = booking?.slot?.start_time
    ? new Date(booking.slot.start_time).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
      {/* Top Navigation & Status Bar */}
      <header className="border-b border-white/10 bg-[#0a1020]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl">🔥</span>
              <span className="font-bold font-[family-name:var(--font-space-grotesk)] text-sm sm:text-base tracking-wider uppercase text-white group-hover:text-[var(--primary)] transition-colors">
                The Inferno Group
              </span>
            </Link>
            <span className="hidden sm:inline-block w-px h-4 bg-white/20"></span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              256-Bit Encrypted Video Channel
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {googleMeetUrl && (
              <a
                href={googleMeetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>🎥</span>
                <span className="hidden xs:inline">Launch</span>
                <span>Google Meet</span>
                <span>&rarr;</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <span>{copied ? "✓ Copied" : "📋 Copy Link"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Consultation Banner / Details */}
      {booking && (
        <section className="bg-gradient-to-r from-[#0d1b3d]/90 to-[#122452]/90 border-b border-white/10 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <span className="text-[var(--primary)]">Session:</span>
                <span>{CONSULT_TITLES[booking.meeting_type || ""] || "Executive Consultation"}</span>
              </div>
              {booking.full_name && (
                <div className="text-white/80">
                  <span className="text-white/40">Participant:</span> {booking.full_name}
                </div>
              )}
              {formattedTime && (
                <div className="text-emerald-400 font-mono font-semibold">
                  <span>⏰ {formattedTime}</span>
                </div>
              )}
            </div>

            {booking.delay_minutes && booking.delay_minutes > 0 ? (
              <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg font-mono text-[0.72rem]">
                ⏳ Notice: Cadre running +{booking.delay_minutes}m behind
                {booking.delay_message ? ` (${booking.delay_message})` : ""}
              </div>
            ) : (
              <div className="text-white/60 text-[0.72rem] font-mono">
                Status: <span className="text-emerald-400 capitalize">{booking.status || "Confirmed"}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Video Arena */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 md:p-6 max-w-7xl w-full mx-auto">
        <div className="flex-1 min-h-[500px] sm:min-h-[620px] bg-[#0c1220] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
          {/* Top Switcher Bar */}
          <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold tracking-wider uppercase text-white/90">
                Live Video Bridge Room: <span className="font-mono text-emerald-400">{safeRoomId}</span>
              </span>
            </div>

            {googleMeetUrl && (
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-[0.7rem]">Dual-Bridge Active:</span>
                <button
                  type="button"
                  onClick={() => setMeetingMode("embedded")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    meetingMode === "embedded"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Browser Room
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingMode("google_meet")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    meetingMode === "google_meet"
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Google Meet Mode
                </button>
              </div>
            )}
          </div>

          {/* Video Container */}
          <div className="flex-1 relative bg-black flex items-center justify-center">
            {meetingMode === "google_meet" && googleMeetUrl ? (
              <div className="max-w-md mx-auto text-center p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-3xl">
                  🎥
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">
                    Official Google Meet Room
                  </h2>
                  <p className="text-xs text-white/70 leading-relaxed">
                    This consultation is connected to an active Google Meet video room. Click the button below to launch Google Meet directly.
                  </p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-blue-300 break-all select-all">
                  {googleMeetUrl}
                </div>
                <a
                  href={googleMeetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all"
                >
                  <span>Launch Google Meet in New Window</span>
                  <span>&rarr;</span>
                </a>
              </div>
            ) : (
              <iframe
                title="Inferno Video Conference Bridge"
                src={`https://meet.jit.si/${encodeURIComponent(safeRoomId)}#userInfo.displayName=${encodeURIComponent(booking?.full_name || "Consultation Participant")}&config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0 absolute inset-0"
              />
            )}
          </div>
        </div>

        {/* Footer Support & Guidance */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50 px-2 font-mono">
          <div>
            Need assistance or audio troubleshooting? Reach Operations Desk directly at{" "}
            <a href="mailto:operations@theinfernogroup.com" className="text-[var(--primary)] hover:underline">
              operations@theinfernogroup.com
            </a>
          </div>
          <div>UEI: QW6RHJACHA56 &bull; CAGE: 22VP2 &bull; SBA HUBZone &amp; VOSB</div>
        </div>
      </main>
    </div>
  );
}
