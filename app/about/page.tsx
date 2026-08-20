import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About Our Firm & Leadership Team | The Inferno Group LLC",
  description: "Learn about The Inferno Group LLC (TIG) — a HUBZone Certified and Veteran-Owned Small Business (VOSB) specializing in emergency management, disaster recovery, and government consulting. Meet our leadership team and discover Inferno Cares.",
  keywords: [
    "The Inferno Group",
    "HUBZone Certified",
    "Veteran-Owned Small Business",
    "VOSB",
    "Emergency Management",
    "Disaster Recovery Consulting",
    "FEMA Public Assistance",
    "Andre Montgomery",
    "Orlando Florida government contracting"
  ],
  openGraph: {
    title: "About Our Firm & Leadership Team | The Inferno Group LLC",
    description: "Learn about The Inferno Group LLC — a HUBZone Certified and Veteran-Owned Small Business (VOSB) specializing in emergency management, disaster recovery, and government consulting.",
    type: "website",
    url: "https://infernogroup.com/about",
    siteName: "The Inferno Group LLC",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "The Inferno Group LLC Command Center",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Firm & Leadership Team | The Inferno Group LLC",
    description: "Learn about The Inferno Group LLC — a HUBZone Certified and Veteran-Owned Small Business (VOSB) specializing in emergency management, disaster recovery, and government consulting.",
    images: ["/hero-bg.jpg"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About The Inferno Group LLC",
    "description": "Information about The Inferno Group LLC, leadership team, mission, core values, socioeconomic credentials, and community engagement.",
    "publisher": {
      "@type": "GovernmentOrganization",
      "name": "The Inferno Group LLC",
      "url": "https://infernogroup.com",
      "logo": "https://infernogroup.com/logo.jpeg",
      "taxID": "22VP2",
      "foundingLocation": "Orlando, Florida, USA",
      "knowsAbout": [
        "Emergency Management",
        "Disaster Recovery",
        "FEMA Public Assistance",
        "Government Consulting",
        "Debris Monitoring",
        "Case Management"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}

