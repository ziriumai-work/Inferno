import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Standards of Conduct & Corporate Ethics | The Inferno Group LLC",
  description:
    "The Inferno Group LLC standards of conduct, FAR compliance, procurement integrity protocols, and conflict of interest guidelines.",
  path: "/conduct",
});

export default function ConductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
