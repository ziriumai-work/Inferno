import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Operational Bulletins | The Inferno Group LLC",
  description: "Stay informed with the latest disaster response updates, federal procurement analyses, regulatory compliance alerts, and corporate announcements.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

