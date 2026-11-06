import { createClient } from "@supabase/supabase-js";

/**
 * Google Calendar & Google Meet Integration Service
 * 
 * Uses Google OAuth 2.0 Web Client credentials to create real Google Calendar events
 * with official Google Meet video conference bridges (hangoutLink).
 */

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1";

export interface GoogleCalendarTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expiry_date?: number;
  token_type?: string;
  scope?: string;
}

export interface CreateMeetingParams {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
  attendeeName?: string;
  bookingId?: string;
}

export interface CreateMeetingResult {
  success: boolean;
  meetingUrl?: string;
  eventId?: string;
  htmlLink?: string;
  error?: string;
}

/**
 * Helper to get a server-side Supabase client for reading/writing tokens
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Generates the Google OAuth 2.0 authorization URL
 */
export function getGoogleAuthUrl(customRedirectUri?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    customRedirectUri ||
    process.env.GOOGLE_REDIRECT_URI ||
    "https://www.theinfernogroup.com/";

  if (!clientId) {
    throw new Error("Missing GOOGLE_CLIENT_ID environment variable.");
  }

  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    access_type: "offline",
    prompt: "consent",
    state: "google_calendar_auth",
  });

  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  customRedirectUri?: string
): Promise<{ success: boolean; tokens?: GoogleCalendarTokens; error?: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    customRedirectUri ||
    process.env.GOOGLE_REDIRECT_URI ||
    "https://www.theinfernogroup.com/";

  if (!clientId || !clientSecret) {
    return { success: false, error: "Google OAuth credentials not configured." };
  }

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("Google token exchange error:", data);
      return { success: false, error: data.error_description || data.error || "Token exchange failed" };
    }

    const tokens: GoogleCalendarTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
      token_type: data.token_type,
      scope: data.scope,
    };

    // Save tokens in database
    await saveTokens(tokens);

    return { success: true, tokens };
  } catch (err: any) {
    console.error("Exception exchanging Google code:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Saves tokens in Supabase site_settings
 */
export async function saveTokens(tokens: GoogleCalendarTokens): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Preserve existing refresh_token if new response did not include one
    if (!tokens.refresh_token) {
      const existing = await getStoredTokens();
      if (existing?.refresh_token) {
        tokens.refresh_token = existing.refresh_token;
      }
    }

    await supabase.from("site_settings").upsert(
      {
        key: "inferno_google_calendar_tokens",
        value: tokens,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  } catch (err) {
    console.warn("Could not save Google tokens in Supabase:", err);
  }
}

/**
 * Reads stored tokens from database or environment
 */
export async function getStoredTokens(): Promise<GoogleCalendarTokens | null> {
  // Check env variable fallback
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "inferno_google_calendar_tokens")
        .maybeSingle();

      if (data?.value?.access_token || data?.value?.refresh_token) {
        return data.value as GoogleCalendarTokens;
      }
    } catch (err) {
      console.warn("Could not read Google tokens from Supabase:", err);
    }
  }

  if (envRefreshToken) {
    return {
      access_token: "",
      refresh_token: envRefreshToken,
      expiry_date: 0,
    };
  }

  return null;
}

/**
 * Retrieves a valid Google access token (refreshing automatically if expired)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null;

  // If token is still valid (with 60-second safety buffer), reuse it
  if (tokens.access_token && tokens.expiry_date && tokens.expiry_date > Date.now() + 60000) {
    return tokens.access_token;
  }

  // Refresh token using refresh_token
  const refreshToken = tokens.refresh_token || process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) return null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      console.error("Google token refresh error:", data);
      return null;
    }

    const updatedTokens: GoogleCalendarTokens = {
      ...tokens,
      access_token: data.access_token,
      expires_in: data.expires_in,
      expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
    };

    await saveTokens(updatedTokens);
    return data.access_token;
  } catch (err) {
    console.error("Exception refreshing Google access token:", err);
    return null;
  }
}

/**
 * Checks if Google Calendar integration is connected and active
 */
export async function isGoogleCalendarConnected(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return Boolean(tokens?.refresh_token || process.env.GOOGLE_REFRESH_TOKEN);
}

/**
 * Creates an authentic Google Calendar event with a genuine Google Meet video bridge
 */
export async function createGoogleCalendarMeetingEvent(
  params: CreateMeetingParams
): Promise<CreateMeetingResult> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return {
      success: false,
      error: "Google Calendar is not authenticated. Please connect Google Calendar in Admin Settings.",
    };
  }

  const requestId = `tig-${params.bookingId || Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const eventPayload = {
    summary: params.summary,
    description: params.description || "Executive Operations Consultation with The Inferno Group",
    start: {
      dateTime: params.startTime.toISOString(),
    },
    end: {
      dateTime: params.endTime.toISOString(),
    },
    attendees: params.attendeeEmail ? [{ email: params.attendeeEmail, displayName: params.attendeeName }] : [],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 15 },
      ],
    },
  };

  try {
    const res = await fetch(GOOGLE_CALENDAR_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Google Calendar event creation failed:", data);
      return {
        success: false,
        error: data.error?.message || "Failed to create Google Calendar event",
      };
    }

    // Extract official Google Meet URL
    const meetUrl =
      data.hangoutLink ||
      data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === "video")?.uri ||
      null;

    return {
      success: true,
      meetingUrl: meetUrl,
      eventId: data.id,
      htmlLink: data.htmlLink,
    };
  } catch (err: any) {
    console.error("Exception calling Google Calendar API:", err);
    return { success: false, error: err.message };
  }
}
