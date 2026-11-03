import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Contracting Vehicles & Solicitations | The Inferno Group LLC",
  description: "Explore government prime and subcontracting vehicles, solicitations, SAM.gov opportunities, and federal agency procurement partnerships.",
};

export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

