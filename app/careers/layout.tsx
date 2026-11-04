import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Careers & Emergency Cadre Opportunities | The Inferno Group LLC",
  description:
    "Join our rapid-deployment cadre of emergency management specialists, FEMA consultants, disaster response coordinators, and federal analysts.",
  path: "/careers",
});

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
