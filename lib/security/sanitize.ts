/**
 * Security Input & URL Sanitization Utilities
 */

/**
 * Escapes potentially unsafe HTML characters in a string to prevent XSS attacks.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitizes rich text content while preserving newlines and safe structural characters.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<iframe\b[^<]*>([\s\S]*?)<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

/**
 * Validates and sanitizes a redirect URL to prevent Open Redirect vulnerabilities.
 * Ensures the destination URL is a relative path starting with a single '/'
 * and does not start with '//' or contain protocol schemes (e.g., http:, https:, javascript:).
 */
export function validateRedirectUrl(url: string | null | undefined, fallback: string = "/admin"): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Reject empty string or non-relative paths (must start with '/' but NOT '//')
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject attempts with explicit protocols like /http:, /https:, /javascript:
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Prevent backslash trick (e.g. /\attacker.com)
  if (trimmed.includes("\\")) {
    return fallback;
  }

  return trimmed;
}
