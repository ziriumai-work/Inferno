import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capabilities & Federal Credentials | The Inferno Group LLC",
  description: "Comprehensive federal capabilities, core competencies, NAICS codes, UEI, CAGE code, and disaster recovery expertise.",
};

export default function CapabilitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

