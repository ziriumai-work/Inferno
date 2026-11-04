import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Contact & Operations Coordination | The Inferno Group LLC",
  description:
    "Connect with The Inferno Group command team. Direct inquiries for emergency support, federal contracting, teaming partnerships, and consultation scheduling.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
