import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations Management Command | The Inferno Group LLC",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

