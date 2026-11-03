import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Business Conduct & Ethics | The Inferno Group LLC",
  description: "Examine our ethical guidelines, anti-kickback provisions, conflict of interest rules, and procurement integrity standards.",
};

export default function ConductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

