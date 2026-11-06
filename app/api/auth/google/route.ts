import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleAuthUrl,
  isGoogleCalendarConnected,
  getStoredTokens,
  saveTokens,
} from "@/lib/googleCalendar";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Check if admin is authenticating
  if (action === "connect") {
    try {
      const redirectUri = searchParams.get("redirect_uri") || undefined;
      const authUrl = getGoogleAuthUrl(redirectUri);
      return NextResponse.redirect(authUrl);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  const connected = await isGoogleCalendarConnected();
  const tokens = await getStoredTokens();

  return NextResponse.json({
    connected,
    hasRefreshToken: Boolean(tokens?.refresh_token),
    hasAccessToken: Boolean(tokens?.access_token),
    clientIdConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, refreshToken } = body;

    if (action === "disconnect") {
      await supabase
        .from("site_settings")
        .delete()
        .eq("key", "inferno_google_calendar_tokens");
      return NextResponse.json({ success: true, message: "Google Calendar disconnected." });
    }

    if (action === "set_refresh_token" && refreshToken) {
      await saveTokens({
        access_token: "",
        refresh_token: refreshToken.trim(),
      });
      return NextResponse.json({ success: true, message: "Refresh token saved." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
