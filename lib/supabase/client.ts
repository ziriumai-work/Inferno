import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://mefsbgjzupctvhabijca.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZnNiZ2p6dXBjdHZoYWJpamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4ODQzMjIsImV4cCI6MjEwOTQ2MDMyMn0.K4cbAQgByi9rEKwThcOEvFrtYTGre7bPP2YUSnDVSJs"

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
