import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Hurricane Tracker & NOAA Tropical Outlook | The Inferno Group LLC",
  description: "Real-time meteorological tracking, active tropical cyclone coordinates, NHC advisories, and disaster response staging intelligence.",
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

