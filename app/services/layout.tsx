import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Government & Commercial Solutions | The Inferno Group LLC",
  description: "Explore our comprehensive emergency management, disaster recovery, Stafford Act compliance, and government consulting capabilities.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

