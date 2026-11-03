import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Field Operations Coordination | The Inferno Group LLC",
  description: "Connect with The Inferno Group command team. Direct inquiries for emergency support, agency contracting, teaming opportunities, and consultation scheduling.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

