import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, response?: NextResponse) {
  let supabaseResponse =
    response ||
    NextResponse.next({
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Create a new response if we are modifying cookies and one wasn't passed,
          // though since we can just mutate supabaseResponse.cookies we'll do that directly
          supabaseResponse =
            response ||
            NextResponse.next({
              request,
            });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Match locale prefix to preserve it in redirects, e.g. /en/ops -> /en
  const match = pathname.match(/^\/(en|hi)/);
  const localePrefix = match ? match[0] : "";

  const localeAgnosticPath = pathname.replace(/^\/(en|hi)/, "") || "/";
  const isLoginPage = localeAgnosticPath === "/ops/login";

  // Protect /ops and /volunteer routes
  if (localeAgnosticPath.startsWith("/ops") || localeAgnosticPath.startsWith("/volunteer")) {
    if (!user && !isLoginPage) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone();
      url.pathname = `${localePrefix}/ops/login`.replace("//", "/");
      return NextResponse.redirect(url);
    }

    if (user && isLoginPage) {
      // user is logged in, redirect them away from the login page
      const url = request.nextUrl.clone();
      url.pathname = `${localePrefix}/ops`.replace("//", "/");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
