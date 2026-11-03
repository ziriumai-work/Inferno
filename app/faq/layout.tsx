import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | The Inferno Group LLC",
  description: "Get answers to common questions about our federal contracting services, emergency management deployments, HUBZone certification, and teaming protocols.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

