import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subcontractor & Teaming Portal | The Inferno Group LLC",
  description: "Join The Inferno Group vendor network. Teaming agreements, joint ventures, and prime subcontracting opportunities for disaster response and federal contracts.",
};

export default function PartnershipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

