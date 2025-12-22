import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Get the Auth User (from the Session)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. PROTECTED ROUTE CHECK: /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // A. Not Logged In -> Go to Login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // Redirect to login, then send them back to where they were trying to go
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // B. Logged In -> Check Permissions in DB
    // We query the 'public.users' table because 'auth.users' doesn't have the 'is_admin' column.
    const { data: dbUser } = await supabase
      .from("users")
      .select("is_admin, role")
      .eq("id", user.id)
      .single();

    // If fetch failed, or user is not admin, or role isn't admin
    const isAdmin = dbUser?.is_admin === true || dbUser?.role === "admin";

    if (!isAdmin) {
      // Unauthorized -> Go to Home Page (or a 403 page)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. AUTH ROUTE CHECK: /login or /register
  // If already logged in, don't let them see the login page again.
  if (["/login", "/register"].includes(request.nextUrl.pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
