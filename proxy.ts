import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh user session securely
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isProtectedAdminRoute =
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/infernollc/admin");

    if (isProtectedAdminRoute) {
      if (!user || !user.email_confirmed_at) {
        supabaseResponse.headers.set("X-Admin-Auth", "Unauthenticated");
      } else {
        supabaseResponse.headers.set("X-Admin-Auth", "Authenticated");
      }
    }
  } catch (err) {
    console.warn("[Middleware Proxy] Supabase session check error:", err);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/infernollc/admin/:path*",
    "/api/:path*",
    "/auth/:path*",
  ],
};
