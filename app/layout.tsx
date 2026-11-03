import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";
import TrackerAlert from "@/components/TrackerAlert";
import CMSRealtimeProvider from "@/components/CMSRealtimeProvider";
import "./globals.css";

const Chatbot = dynamic(() => import("@/components/Chatbot"));

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://theinfernogroup.com",
  ),
  title: "The Inferno Group LLC | Government Consulting & Emergency Management Services",
  description: "The Inferno Group LLC is a premier government consulting firm specializing in Emergency Management, disaster recovery, public & individual assistance, SAM.gov registration, and strategic business development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Body/html presentation stays in globals.css. These carried Tailwind
          sizing classes (h-full / min-h-full / flex flex-col) that were inert
          while Tailwind was unwired; leaving them would switch body to flex and
          move the footer on short pages, so they are intentionally omitted. */}
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:py-2.5 focus:px-4 focus:bg-[var(--primary)] focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>
        <CMSRealtimeProvider />
        {/* BACKGROUND OVERLAYS */}
        <div className="grid-bg"></div>
        <div className="glow-spotlight spotlight-1"></div>
        <div className="glow-spotlight spotlight-2"></div>

        <TrackerAlert />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
