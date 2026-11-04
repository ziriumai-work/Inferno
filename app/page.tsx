import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "The Inferno Group LLC | B2G Government Consulting & Emergency Management",
  description:
    "Operational readiness when crisis meets command. The Inferno Group LLC delivers emergency response coordination, FEMA Public Assistance compliance, HUBZone & VOSB teaming, and federal program management.",
  path: "/",
});

export default function Home() {
  return <HomeClient />;
}
