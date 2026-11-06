import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Consultation Booking Window | The Inferno Group LLC",
  description: "Schedule a secure, confidential consultation window with The Inferno Group federal acquisition and disaster response specialists.",
  path: "/calendar",
});

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

