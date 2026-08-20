import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
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

  const isProtectedAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isProtectedAdminRoute) {
    // If user is not authenticated or email is unverified, flag for client or redirect appropriately
    if (!user || !user.email_confirmed_at) {
      // Add a security header signaling unauthenticated status for edge downstream checks
      supabaseResponse.headers.set("X-Admin-Auth", "Unauthenticated");
    } else {
      supabaseResponse.headers.set("X-Admin-Auth", "Authenticated");
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/auth/:path*",
  ],
};
