import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theinfernogroup.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/infernollc/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

