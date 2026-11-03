import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultation Booking Window | The Inferno Group LLC",
  description: "Schedule a secure, confidential consultation window with The Inferno Group federal acquisition and disaster response specialists.",
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

