import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The Inferno Group LLC",
  description: "Review The Inferno Group LLC privacy policies, data governance, PII protection standards, and regulatory compliance protocols.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

