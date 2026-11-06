import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Capabilities & Federal Credentials | The Inferno Group LLC",
  description: "Comprehensive federal capabilities, core competencies, NAICS codes, UEI, CAGE code, and disaster recovery expertise.",
  path: "/capabilities",
});

export default function CapabilitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

