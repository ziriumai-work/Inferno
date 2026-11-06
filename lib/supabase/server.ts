import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function sanitizeSupabaseUrl(rawUrl?: string): string {
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

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZnNiZ2p6dXBjdHZoYWJpamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4ODQzMjIsImV4cCI6MjEwOTQ2MDMyMn0.K4cbAQgByi9rEKwThcOEvFrtYTGre7bPP2YUSnDVSJs"

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
