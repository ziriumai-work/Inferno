export interface BookingSlot {
  id: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_available: boolean;
  external_calendar_event_id?: string | null;
  created_at?: string;
}

export interface BookingDetails {
  id?: string;
  slot_id: string;
  full_name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  meeting_type: string;
  status?: string;
  created_at?: string;
}

export interface TimeSlotDisplay {
  id: string;
  time: string; // formatted time e.g. "09:00 AM"
  start_time: string; // ISO string
  end_time: string; // ISO string
  available: boolean;
}

/**
 * Standard business hour template times (in EST)
 */
export const DEFAULT_DAILY_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM"
];

/**
 * Generate iCalendar (.ics) string for download
 */
export function generateICSContent(event: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizerEmail?: string;
}): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);
  const now = formatDate(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Inferno Group LLC//Live Operations Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:booking-${Date.now()}@infernogroup.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location || "Online Consultation Window"}`,
    `ORGANIZER;CN=Inferno Operations:mailto:${event.organizerEmail || "operations@infernogroup.com"}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

/**
 * Create a direct link to add to Google Calendar
 */
export function createGoogleCalendarUrl(event: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}): string {
  const formatGCalDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGCalDate(event.startTime)}/${formatGCalDate(event.endTime)}`,
    details: event.description,
    location: event.location || "Online Consultation Window"
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Create a direct link to add to Outlook / Office 365 Calendar
 */
export function createOutlookCalendarUrl(event: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.startTime.toISOString(),
    enddt: event.endTime.toISOString(),
    body: event.description,
    location: event.location || "Online Consultation Window"
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

