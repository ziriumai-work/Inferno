import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | The Inferno Group LLC",
  description:
    "Review The Inferno Group LLC privacy policies, data governance, PII protection standards, and regulatory compliance protocols.",
  path: "/privacy",
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
