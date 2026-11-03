import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contracting Readiness Diagnostic | The Inferno Group LLC",
  description: "Evaluate your organization's federal contracting readiness, SAM registration status, compliance protocols, and teaming potential.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

