import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seoConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/services",
    "/capabilities",
    "/capability-statement",
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
    "/terms",
    "/accessibility",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency:
      route === "" || route === "/tracker" || route === "/contracts"
        ? "daily"
        : "weekly",
    priority:
      route === ""
        ? 1.0
        : route === "/services" ||
            route === "/capabilities" ||
            route === "/contracts" ||
            route === "/tracker"
          ? 0.9
          : 0.8,
  }));
}
