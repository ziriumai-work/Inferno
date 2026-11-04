import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://challenges.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
      "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: https://*.tile.openstreetmap.org",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.nhc.noaa.gov https://*.weather.gov https://*.tile.openstreetmap.org https://api.sam.gov https://challenges.cloudflare.com",
      "frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js"],
  },
  allowedDevOrigins: ["192.168.1.212", "http://localhost:3001"],
  async redirects() {
    return [
      {
        source: "/capabilities.pdf",
        destination: "/documents/The_Inferno_Group_LLC_Capability_Statement.pdf",
        permanent: true,
      },
      {
        source: "/capability_statement.pdf",
        destination: "/documents/The_Inferno_Group_LLC_Capability_Statement.pdf",
        permanent: true,
      },
      {
        source: "/capability-statement.pdf",
        destination: "/documents/The_Inferno_Group_LLC_Capability_Statement.pdf",
        permanent: true,
      },
      {
        source: "/capability-statement",
        destination: "/capabilities/statement",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|mp4|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
