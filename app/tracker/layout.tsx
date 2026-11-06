import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Live Hurricane Tracker & NOAA Tropical Outlook | The Inferno Group LLC",
  description: "Real-time meteorological tracking, active tropical cyclone coordinates, NHC advisories, and disaster response staging intelligence.",
  path: "/tracker",
});

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

