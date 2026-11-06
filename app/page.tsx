import { redirect } from "next/navigation";
import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "The Inferno Group LLC | B2G Government Consulting & Emergency Management",
  description:
    "Operational readiness when crisis meets command. The Inferno Group LLC delivers emergency response coordination, FEMA Public Assistance compliance, HUBZone & VOSB teaming, and federal program management.",
  path: "/",
});

export default async function Home(props: {
  searchParams?: Promise<{ code?: string; state?: string }>;
}) {
  const searchParams = await props.searchParams;
  if (
    searchParams?.code &&
    (searchParams.code.startsWith("4/") || searchParams.state === "google_calendar_auth")
  ) {
    redirect(`/api/auth/google/callback?code=${encodeURIComponent(searchParams.code)}`);
  }

  return <HomeClient />;
}
