import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";
import { constructMetadata, SITE_URL } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "About Our Firm & Leadership Team | The Inferno Group LLC",
  description:
    "Learn about The Inferno Group LLC (TIG) — a HUBZone Certified and Veteran-Owned Small Business (VOSB) specializing in emergency management, disaster recovery, and government consulting.",
  path: "/about",
  image: "/hero-bg.jpg",
  imageAlt: "The Inferno Group LLC Leadership & Command Center",
});

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About The Inferno Group LLC",
    description:
      "Information about The Inferno Group LLC, leadership team, mission, core values, socioeconomic credentials, and community engagement.",
    publisher: {
      "@type": "GovernmentOrganization",
      name: "The Inferno Group LLC",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: "InfernoCares@theinfernogroup.com",
    },
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
