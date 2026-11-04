import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Federal Contracting Opportunities & Pursuits | The Inferno Group LLC",
  description:
    "Explore government prime and subcontracting vehicles, solicitations, SAM.gov opportunities, and federal agency procurement partnerships.",
  path: "/contracts",
});

export default function ContractsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
