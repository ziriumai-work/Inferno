import { createBrowserClient } from '@supabase/ssr'

export function sanitizeSupabaseUrl(rawUrl?: string): string {
  const fallback = "https://mefsbgjzupctvhabijca.supabase.co";
  if (!rawUrl) return fallback;
  let cleaned = rawUrl.trim().replace(/^["']|["']$/g, "").replace(/\/$/, "");
  if (!cleaned) return fallback;
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return fallback;
  }
}

export function sanitizeSupabaseKey(rawKey?: string): string {
  const fallback =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZnNiZ2p6dXBjdHZoYWJpamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4ODQzMjIsImV4cCI6MjEwOTQ2MDMyMn0.K4cbAQgByi9rEKwThcOEvFrtYTGre7bPP2YUSnDVSJs";
  if (!rawKey) return fallback;
  // Strip quotes (including smart/curly quotes), whitespace, and any non-ASCII characters
  const cleaned = rawKey
    .trim()
    .replace(/^[\s"'“”‘’`]+|[\s"'“”‘’`]+$/g, "")
    .replace(/[^\x20-\x7E]/g, "");
  return cleaned && cleaned.length >= 20 ? cleaned : fallback;
}

export function sanitizeHeaderString(val: any): string {
  if (typeof val !== "string") val = String(val ?? "");
  return val
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...")
    .replace(/[^\x00-\xFF]/g, "");
}

export function sanitizeHeadersInit(headers: HeadersInit): HeadersInit {
  if (!headers) return headers;
  if (headers instanceof Headers) {
    const cleanHeaders = new Headers();
    headers.forEach((value, key) => {
      cleanHeaders.set(sanitizeHeaderString(key), sanitizeHeaderString(value));
    });
    return cleanHeaders;
  }
  if (Array.isArray(headers)) {
    return headers.map(([k, v]) => [
      sanitizeHeaderString(k),
      sanitizeHeaderString(v),
    ] as [string, string]);
  }
  if (typeof headers === "object") {
    const cleanObj: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      cleanObj[sanitizeHeaderString(k)] = sanitizeHeaderString(v);
    }
    return cleanObj;
  }
  return headers;
}

export function createClient() {
  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseAnonKey = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          if (init && init.headers) {
            init.headers = sanitizeHeadersInit(init.headers);
          }
          return fetch(input, init);
        },
      },
    }
  )
}
