import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { exchangeCodeForTokens } from "@/lib/googleCalendar";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("Google OAuth returned error:", error);
    return NextResponse.redirect(`${origin}/infernollc/admin?google_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/infernollc/admin?google_error=no_code_provided`);
  }

  // The redirect_uri passed to token exchange MUST match the redirect_uri used in authorization
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "https://www.theinfernogroup.com/";
  const result = await exchangeCodeForTokens(code, redirectUri);

  if (!result.success) {
    console.error("Token exchange failed:", result.error);
    return NextResponse.redirect(
      `${origin}/infernollc/admin?google_error=${encodeURIComponent(result.error || "exchange_failed")}`
    );
  }

  return NextResponse.redirect(`${origin}/infernollc/admin?google_calendar=connected`);
}
