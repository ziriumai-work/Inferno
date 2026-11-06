import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Frequently Asked Questions | The Inferno Group LLC",
  description: "Get answers to common questions about our federal contracting services, emergency management deployments, HUBZone certification, and teaming protocols.",
  path: "/faq",
});

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

