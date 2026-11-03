import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theinfernogroup.com";
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/services",
    "/capabilities",
    "/tracker",
    "/partnerships",
    "/contracts",
    "/careers",
    "/news",
    "/resources",
    "/faq",
    "/contact",
    "/calendar",
    "/quiz",
    "/privacy",
    "/conduct",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/tracker" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/services" || route === "/capabilities" || route === "/tracker" ? 0.9 : 0.8,
  }));
}

