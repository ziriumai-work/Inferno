import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { validateRedirectUrl } from "@/lib/security/sanitize";
import { logSecurityEvent } from "@/lib/security/logger";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  
  // Sanitize next parameter to prevent Open Redirect vulnerability
  const safeNext = validateRedirectUrl(rawNext, "/infernollc/admin?mode=reset");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session) {
      logSecurityEvent({
        eventType: "AUTH_CALLBACK_SUCCESS",
        level: "INFO",
        userEmail: data.session.user?.email,
        userId: data.session.user?.id,
        action: "exchangeCodeForSession",
      });

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${safeNext}`);
      } else {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    } else {
      logSecurityEvent({
        eventType: "AUTH_CALLBACK_FAILED",
        level: "WARN",
        action: "exchangeCodeForSession",
        details: { error: error?.message },
      });
    }
  }

  // Return the user to admin page if something went wrong
  return NextResponse.redirect(`${origin}/infernollc/admin?error=auth_callback_failed`);
}
