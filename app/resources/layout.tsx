import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Federal Playbooks & Procurement Resources | The Inferno Group LLC",
  description: "Access whitepapers, procurement guides, disaster recovery readiness checklists, and regulatory compliance playbooks from The Inferno Group.",
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

