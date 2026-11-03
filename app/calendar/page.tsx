"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookingSlot, generateICSContent, createGoogleCalendarUrl, createOutlookCalendarUrl } from "@/lib/calendarUtils";
import { dataStore } from "@/utils/dataStore";

export default function CalendarPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Selections
  const [consultType, setConsultType] = useState("sba");
  const [timezone, setTimezone] = useState("EST");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotObj, setSelectedSlotObj] = useState<BookingSlot | null>(null);
  
  // Lead info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  // Live state
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailStatusInfo, setEmailStatusInfo] = useState<{ status: string; provider: string } | null>(null);

  // Success details for calendar export
  const [lastBookedData, setLastBookedData] = useState<{
    booking: any;
    slot: BookingSlot;
    full_name: string;
    email: string;
    company: string;
    notes: string;
    meeting_type: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Map timezone abbreviation to IANA name
  const getTimeZoneIANAName = (tzAbbr: string) => {
    switch (tzAbbr) {
      case "EST": return "America/New_York";
      case "CST": return "America/Chicago";
      case "MST": return "America/Denver";
      case "PST": return "America/Los_Angeles";
      case "UTC": return "UTC";
      default: return "America/New_York";
    }
  };

  // Generate next 7 business days starting tomorrow
  const getNextBusinessDays = () => {
    const days = [];
    let current = new Date();
    while (days.length < 7) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sat/Sun
        days.push(new Date(current));
      }
    }
    return days;
  };

  const businessDays = getNextBusinessDays();

  // Set default selected date on load
  useEffect(() => {
    if (!selectedDate && businessDays.length > 0) {
      setSelectedDate(businessDays[0]);
    }
  }, [businessDays, selectedDate]);

  // Fetch live slots from API
  const fetchLiveSlots = useCallback(async () => {
    setIsLoadingSlots(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/bookings/slots?days=10");
      if (!res.ok) {
        throw new Error("Failed to load availability slots");
      }
      const data = await res.json();
      if (data.slots) {
        setSlots(data.slots);
      }
    } catch (err: any) {
      console.error("Error fetching live slots:", err);
      setErrorMessage("Unable to sync live calendar availability. Please refresh.");
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveSlots();
  }, [fetchLiveSlots]);

  // Filter slots for currently selected date in the selected timezone
  const getSlotsForSelectedDate = () => {
    if (!selectedDate || !slots.length) return [];
    
    const tzName = getTimeZoneIANAName(timezone);
    const targetDateStr = selectedDate.toLocaleDateString("en-US", { timeZone: tzName });
    return slots.filter((slot) => {
      const slotDate = new Date(slot.start_time);
      return slotDate.toLocaleDateString("en-US", { timeZone: tzName }) === targetDateStr;
    });
  };

  const currentSlots = getSlotsForSelectedDate();

  // Helper to format ISO time into display time in selected timezone
  const formatSlotTime = (isoString: string, tz: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: getTimeZoneIANAName(tz)
      });
    } catch {
      return new Date(isoString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlotObj) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: selectedSlotObj.id,
          full_name: name,
          email,
          company,
          notes,
          meeting_type: consultType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking transaction failed.");
      }

      // Success
      setIsSuccess(true);
      if (data.emailResult) {
        setEmailStatusInfo(data.emailResult);
      }
      setLastBookedData({
        booking: data.booking,
        slot: selectedSlotObj,
        full_name: name,
        email,
        company,
        notes,
        meeting_type: consultType
      });

      // Save backup in local storage and sync to Supabase database
      void dataStore.submitLead({
        id: data.booking?.id || Date.now().toString(),
        type: "BOOKING",
        name,
        email,
        company,
        consultType,
        timezone,
        date: selectedDate.toLocaleDateString(),
        time: formatSlotTime(selectedSlotObj.start_time, timezone),
        notes,
      });

      // Reset form fields
      setName("");
      setEmail("");
      setCompany("");
      setNotes("");
      setSelectedSlotObj(null);

      // Refresh slots from backend to show slot is now booked
      fetchLiveSlots();

    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMessage(err.message || "Failed to finalize booking.");
      // Refresh slots in case selected slot was taken
      fetchLiveSlots();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadICS = () => {
    if (!lastBookedData) return;
    const icsString = generateICSContent({
      title: `Consultation: ${consultTypeNames[lastBookedData.meeting_type] || "Operations Review"}`,
      description: `Booked by ${lastBookedData.full_name} (${lastBookedData.company || "N/A"})\nEmail: ${lastBookedData.email}\nScope: ${lastBookedData.notes || "None"}`,
      startTime: new Date(lastBookedData.slot.start_time),
      endTime: new Date(lastBookedData.slot.end_time)
    });
    const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inferno-consultation-${lastBookedData.booking?.id || "invite"}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const consultTypeNames: Record<string, string> = {
    sba: "SBA socioeconomic Certifications consultation (30m)",
    emergency: "FEMA Disaster recovery programmatic audit compliance (45m)",
    teaming: "Prime/Subcontractor joint-venture teaming review (30m)"
  };

  const googleCalUrl = lastBookedData ? createGoogleCalendarUrl({
    title: `Consultation: ${consultTypeNames[lastBookedData.meeting_type] || "Operations Review"}`,
    description: `Booked by ${lastBookedData.full_name} (${lastBookedData.company || "N/A"})\nEmail: ${lastBookedData.email}\nScope: ${lastBookedData.notes || "None"}`,
    startTime: new Date(lastBookedData.slot.start_time),
    endTime: new Date(lastBookedData.slot.end_time)
  }) : "#";

  const outlookCalUrl = lastBookedData ? createOutlookCalendarUrl({
    title: `Consultation: ${consultTypeNames[lastBookedData.meeting_type] || "Operations Review"}`,
    description: `Booked by ${lastBookedData.full_name} (${lastBookedData.company || "N/A"})\nEmail: ${lastBookedData.email}\nScope: ${lastBookedData.notes || "None"}`,
    startTime: new Date(lastBookedData.slot.start_time),
    endTime: new Date(lastBookedData.slot.end_time)
  }) : "#";

  return (
    <div className="page-view block">
      <section id="calendar">
        <div className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Alliances &amp; Contracting</div>
          <h1 className="section-title">Operations Booking Window</h1>
          <p className="section-desc">
            Coordinate availability grids and schedule direct consultations with contracting desk officers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 mt-12">
          
          {/* Left Column: Booking Grid */}
          <div className={`contact-form-container reveal relative ${isMounted ? "active" : ""}`}>
            {/* Success Overlay */}
            <div className={`success-overlay ${isSuccess ? "show" : ""}`} id="form-success">
              <div className="success-icon-wrapper">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Consultation Confirmed</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Transmission received and locked in database.
              </p>

              {emailStatusInfo && (
                <div className={`text-xs py-2 px-3 rounded-md mb-5 text-center border ${
                  emailStatusInfo.status === "sent" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                }`}>
                  {emailStatusInfo.status === "sent"
                    ? "Confirmation email sent"
                    : "Confirmation recorded"}
                </div>
              )}

              {lastBookedData && (
                <div className="flex flex-col gap-3 w-full max-w-[340px] mx-auto">
                  <button
                    type="button"
                    onClick={handleDownloadICS}
                    className="btn btn-primary py-2.5 px-4 text-[0.85rem] w-full justify-center"
                  >
                    Download Invitation
                  </button>
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary py-2.5 px-4 text-[0.85rem] w-full text-center justify-center"
                  >
                    Add to Google Calendar
                  </a>
                  <a
                    href={outlookCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary py-2.5 px-4 text-[0.85rem] w-full text-center justify-center"
                  >
                    Add to Outlook Calendar
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-xs mt-2"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>

            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold mb-6">
              Select Schedule Parameters
            </h3>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg py-3 px-4 text-red-400 text-[0.85rem] mb-6">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* 1. Type selection */}
            <div className="mb-6">
              <label className="text-[0.85rem] font-semibold text-[var(--text-bright)] block mb-2">
                Primary Requirement Area
              </label>
              <select
                className="form-input form-select w-full h-auto py-3 pr-11 pl-4 text-[0.925rem] font-semibold text-slate-900 bg-white border border-[var(--border)] rounded-lg cursor-pointer leading-normal"
                value={consultType}
                onChange={(e) => {
                  setConsultType(e.target.value);
                  setSelectedSlotObj(null);
                }}
              >
                <option value="sba" className="text-slate-900 bg-white">SBA Socioeconomic Certifications (30m)</option>
                <option value="emergency" className="text-slate-900 bg-white">FEMA disaster program compliance (45m)</option>
                <option value="teaming" className="text-slate-900 bg-white">Strategic Joint-Venture Teaming (30m)</option>
              </select>
            </div>

            {/* 2. Timezone Selector */}
            <div className="mb-8">
              <label className="text-[0.85rem] font-semibold text-[var(--text-bright)] block mb-2">
                Coordination Timezone
              </label>
              <div className="flex flex-wrap gap-2">
                {["EST", "CST", "MST", "PST", "UTC"].map((tz) => (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => setTimezone(tz)}
                    className={`btn py-1.5 px-4 text-xs ${timezone === tz ? "btn-primary" : "btn-secondary"}`}
                  >
                    {tz}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Calendar Grid */}
            <div className="mb-8">
              <label className="text-[0.85rem] font-semibold text-[var(--text-bright)] block mb-3">
                Select Available Date
              </label>
              <div className="calendar-grid">
                {businessDays.map((date) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlotObj(null);
                      }}
                      className={`py-3 px-2 rounded-lg border cursor-pointer flex flex-col items-center ${
                        isSelected 
                          ? "bg-[var(--primary-glow)] border-[var(--primary)]" 
                          : "bg-[var(--panel-dark)] border-[var(--border)]"
                      }`}
                    >
                      <span className="text-[0.65rem] text-[var(--text-muted)] uppercase">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className={`text-[1.1rem] font-bold my-0.5 ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-bright)]"}`}>
                        {date.getDate()}
                      </span>
                      <span className="text-[0.65rem] text-[var(--text-muted)]">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Time Slots picker */}
            {selectedDate && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[0.85rem] font-semibold text-[var(--text-bright)]">
                    Available Slots ({timezone})
                  </label>
                  {isLoadingSlots && (
                    <span className="text-xs text-[var(--primary)]">Syncing live database...</span>
                  )}
                </div>

                {isLoadingSlots && currentSlots.length === 0 ? (
                  <div className="p-6 text-center text-[var(--text-muted)] text-[0.85rem]">
                    Loading available live slots...
                  </div>
                ) : currentSlots.length === 0 ? (
                  <div className="p-6 text-center text-[var(--text-muted)] text-[0.85rem]">
                    No slots available on this date.
                  </div>
                ) : (
                  <div className="calendar-grid">
                    {currentSlots.map((slot) => {
                      const isSelected = selectedSlotObj?.id === slot.id;
                      const formattedTime = formatSlotTime(slot.start_time, timezone);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => slot.is_available && setSelectedSlotObj(slot)}
                          disabled={!slot.is_available}
                          className={`py-2.5 px-2 text-xs font-semibold rounded-md border ${
                            isSelected
                              ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white border-[var(--primary)] cursor-pointer"
                              : slot.is_available
                              ? "bg-[var(--panel-dark)] text-[var(--text-bright)] border-[var(--border)] cursor-pointer"
                              : "bg-black/5 text-black/25 border-[var(--border)] cursor-not-allowed"
                          }`}
                        >
                          {formattedTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Contact Details Confirmation */}
          <div className={`contact-form-container reveal ${isMounted ? "active" : ""}`}>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold mb-2">
              Casework Coordination
            </h3>
            <p className="text-[var(--text-muted)] text-[0.85rem] mb-8">
              Provide organization and applicant details to register your appointment window.
            </p>

            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
              <div className="form-group m-0">
                <input
                  type="text"
                  id="book-name"
                  className="form-input"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="book-name" className="form-label">Full Name</label>
              </div>

              <div className="form-group m-0">
                <input
                  type="text"
                  id="book-company"
                  className="form-input"
                  placeholder=" "
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
                <label htmlFor="book-company" className="form-label">Agency / Organization</label>
              </div>

              <div className="form-group m-0">
                <input
                  type="email"
                  id="book-email"
                  className="form-input"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="book-email" className="form-label">Work Email</label>
              </div>

              <div className="form-group m-0">
                <textarea
                  id="book-notes"
                  className="form-input"
                  rows={3}
                  placeholder=" "
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                ></textarea>
                <label htmlFor="book-notes" className="form-label">Brief scope parameters</label>
              </div>

              {selectedDate && selectedSlotObj ? (
                <div className="bg-[var(--panel-dark)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-bright)] leading-relaxed">
                  <div className="font-bold text-[var(--primary)]">CONFIRMATION SUMMARY:</div>
                  <strong>Meeting:</strong> {consultTypeNames[consultType]}<br />
                  <strong>Date:</strong> {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br />
                  <strong>Time Slot:</strong> {formatSlotTime(selectedSlotObj.start_time, timezone)} ({timezone})
                </div>
              ) : (
                <div className="text-[0.75rem] text-red-600 bg-red-600/5 border border-dashed border-red-600/20 rounded-md p-3 text-center">
                  Select a date and available time slot on the grid to authorize booking.
                </div>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting || !selectedDate || !selectedSlotObj}
              >
                {isSubmitting ? (
                  <>
                    Locking Slot...
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                  </>
                ) : (
                  <>
                    Lock Appointment Slot
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
