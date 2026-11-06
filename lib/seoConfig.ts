import type { Metadata } from "next";

export function getSanitizedSiteUrl(rawUrl?: string): string {
  const fallback = "https://www.theinfernogroup.com";
  const input = rawUrl || process.env.NEXT_PUBLIC_SITE_URL;
  if (!input) return fallback;

  let cleaned = input
    .trim()
    .replace(/^[\s"'“”‘’`]+|[\s"'“”‘’`]+$/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\/$/, "");
  if (!cleaned) return fallback;

  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export function getValidMetadataBase(): URL {
  try {
    return new URL(getSanitizedSiteUrl());
  } catch {
    return new URL("https://www.theinfernogroup.com");
  }
}

export const SITE_URL = getSanitizedSiteUrl();

export const SITE_NAME = "The Inferno Group LLC";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOProps {
  title: string;
  description: string;
  path?: string;
  ogType?: "website" | "article";
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path = "",
  ogType = "website",
  image = DEFAULT_OG_IMAGE,
  imageAlt = "The Inferno Group LLC - Emergency Management, FEMA Public Assistance & Defense Support",
  noindex = false,
}: SEOProps): Metadata {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  const absoluteImageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: absoluteImageUrl,
          secureUrl: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@theinfernogroup",
      creator: "@theinfernogroup",
      images: [
        {
          url: absoluteImageUrl,
          alt: imageAlt,
        },
      ],
    },
    verification: {
      google: "google6e2e92a7a0d58085",
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
  };
}

export const corporateJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GovernmentOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "The Inferno Group LLC",
      legalName: "The Inferno Group LLC",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: "InfernoCares@theinfernogroup.com",
      telephone: "+1-407-499-1443",
      address: {
        "@type": "PostalAddress",
        streetAddress: "200 E. Robinson Street, Suite 1120",
        addressLocality: "Orlando",
        addressRegion: "FL",
        postalCode: "32801",
        addressCountry: "US",
      },
      sameAs: [
        "https://www.linkedin.com/company/the-inferno-group",
      ],
      knowsAbout: [
        "FEMA Public Assistance",
        "Disaster Recovery Consulting",
        "Stafford Act Compliance",
        "Emergency Management Logistics",
        "HUBZone Small Business Teaming",
        "Veteran-Owned Small Business Contracting",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "The Inferno Group LLC",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};
