import type { Metadata } from "next";
import { Outfit, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Layouts/Navbar";
import Footer from "@/components/Layouts/Footer";
import Chatbot from "@/components/Chatbot";
import TrackerAlert from "@/components/TrackerAlert";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
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
      className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      {/* Body/html presentation stays in globals.css. These carried Tailwind
          sizing classes (h-full / min-h-full / flex flex-col) that were inert
          while Tailwind was unwired; leaving them would switch body to flex and
          move the footer on short pages, so they are intentionally omitted. */}
      <body>
        {/* BACKGROUND OVERLAYS */}
        <div className="grid-bg"></div>
        <div className="glow-spotlight spotlight-1"></div>
        <div className="glow-spotlight spotlight-2"></div>

        <TrackerAlert />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
