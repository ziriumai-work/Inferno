import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers & Emergency Cadre Opportunities | The Inferno Group LLC",
  description: "Join our rapid-deployment cadre of emergency management specialists, FEMA consultants, disaster response coordinators, and federal analysts.",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

