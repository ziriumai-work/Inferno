import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "News & Operational Bulletins | The Inferno Group LLC",
  description: "Stay informed with the latest disaster response updates, federal procurement analyses, regulatory compliance alerts, and corporate announcements.",
  path: "/news",
});

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

