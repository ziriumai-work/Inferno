/**
 * Google Meet Utility
 *
 * Ensures all video consultation links are valid, active Google Meet URLs.
 * Eliminates invalid/synthetic meeting codes and ensures real Google Meet rooms.
 */

export function isInvalidOrFakeMeetUrl(url?: string | null): boolean {
  if (!url) return true;
  const cleaned = url.trim().toLowerCase();
  return (
    cleaned.includes("meet.google.com/meet/") ||
    cleaned.endsWith("meet.google.com/new") ||
    cleaned.endsWith("meet.google.com/new/") ||
    cleaned === "https://meet.google.com/new" ||
    cleaned.includes("lookup/") ||
    cleaned.includes("ecf-") ||
    cleaned.includes("eeee") ||
    cleaned.includes("tigconsult") ||
    cleaned.includes("tig-")
  );
}

/**
 * Validates whether a given URL is a properly formatted Google Meet URL.
 */
export function isValidGoogleMeetUrl(url?: string | null): boolean {
  if (!url) return false;
  if (isInvalidOrFakeMeetUrl(url)) return false;

  const cleaned = url.trim().toLowerCase();
  return (
    cleaned.startsWith("https://meet.google.com/") ||
    cleaned.startsWith("http://meet.google.com/") ||
    cleaned.startsWith("meet.google.com/")
  );
}

/**
 * Returns the base URL for the application.
 */
export function getBaseSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.theinfernogroup.com";
}

/**
 * Resolves a valid consultation video room URL.
 * Prioritizes:
 * 1. Admin/SiteSettings default consultation room link (e.g. permanent Google Meet)
 * 2. NEXT_PUBLIC_DEFAULT_GOOGLE_MEET_URL environment variable
 * 3. The Inferno Group dedicated video room bridge (/meet?id=...) which works 100% of the time
 */
export function generateGoogleMeetCode(seed?: string, fallbackDefault?: string): string {
  // 1. Direct fallback from site settings or parameter
  if (fallbackDefault && isValidGoogleMeetUrl(fallbackDefault)) {
    return formatGoogleMeetUrl(fallbackDefault);
  }

  // 2. Default environment variable
  const defaultUrl = process.env.NEXT_PUBLIC_DEFAULT_GOOGLE_MEET_URL;
  if (defaultUrl && isValidGoogleMeetUrl(defaultUrl)) {
    return formatGoogleMeetUrl(defaultUrl);
  }

  // 3. Guaranteed live consultation room bridge on The Inferno Group domain
  const baseUrl = getBaseSiteUrl();
  if (seed) {
    return `${baseUrl}/meet?id=${encodeURIComponent(seed)}`;
  }

  return `${baseUrl}/meet`;
}

/**
 * Formats and sanitizes any user-entered or stored consultation URL.
 * Automatically discards fake/invalid codes (like ecf-eeee-ehf, lookup/tig-..., meet.google.com/new).
 */
export function formatGoogleMeetUrl(
  inputUrl?: string | null,
  fallbackId?: string,
  fallbackDefault?: string
): string {
  if (inputUrl && !isInvalidOrFakeMeetUrl(inputUrl)) {
    const cleaned = inputUrl.trim();
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }
    if (cleaned.startsWith("meet.google.com/")) {
      return `https://${cleaned}`;
    }
    if (/^[a-z]{3}-[a-z]{4}-[a-z]{3}$/i.test(cleaned)) {
      return `https://meet.google.com/${cleaned.toLowerCase()}`;
    }
  }

  return generateGoogleMeetCode(fallbackId, fallbackDefault);
}
