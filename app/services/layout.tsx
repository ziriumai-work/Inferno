import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government & Commercial Solutions | The Inferno Group LLC",
  description: "Explore our comprehensive emergency management, disaster recovery, Stafford Act compliance, and government consulting capabilities.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

