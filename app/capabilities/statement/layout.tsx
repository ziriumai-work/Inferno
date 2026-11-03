import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Capability Statement | The Inferno Group LLC",
  description:
    "Official Capability Statement for The Inferno Group LLC (TIG) — Emergency Management, Disaster Recovery, HUBZone & VOSB Credentials, UEI QW6RHJACHA56, CAGE 22VP2.",
};

export default function CapabilityStatementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

