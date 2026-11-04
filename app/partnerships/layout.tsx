import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Subcontractor & Teaming Portal | The Inferno Group LLC",
  description:
    "Join The Inferno Group vendor network. Teaming agreements, joint ventures, and prime subcontracting opportunities for disaster response and federal contracts.",
  path: "/partnerships",
});

export default function PartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

