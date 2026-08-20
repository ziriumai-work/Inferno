import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "The Inferno Group | B2G Government Consulting & Emergency Management",
  description: "High-stakes operational readiness when crisis meets command. The Inferno Group LLC delivers emergency response coordination, Stafford Act audit compliance, GSA schedule onboarding, and DCAA indirect cost rate pool accounting.",
  openGraph: {
    title: "The Inferno Group | B2G Government Consulting & Emergency Management",
    description: "High-stakes operational readiness when crisis meets command. The Inferno Group LLC delivers emergency response coordination, Stafford Act audit compliance, GSA schedule onboarding, and DCAA indirect cost rate pool accounting.",
    type: "website",
    url: "https://infernogroup.com",
    siteName: "The Inferno Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Inferno Group | B2G Government Consulting & Emergency Management",
    description: "High-stakes operational readiness when crisis meets command. The Inferno Group LLC delivers emergency response coordination, Stafford Act audit compliance, GSA schedule onboarding, and DCAA indirect cost rate pool accounting.",
  },
};

export default function Home() {
  return <HomeClient />;
}
