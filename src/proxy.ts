import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define Role Permissions locally to ensure Edge Runtime compatibility
const RESTRICTED_ADMIN_PATHS = {
  // Routes restricted to 'admin' ONLY (Front Desk cannot see these)
  "/admin/inventory": ["admin"],
  "/admin/staff": ["admin"],
  "/admin/reports": ["admin"],
  "/admin/security": ["admin"],
  "/admin/promotions": ["admin"],
  "/admin/activity-logs": ["admin"],
  // Add any other super-admin only routes here
};

export async function proxy(request: NextRequest) {
  // 1. Initialize Response
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

  // 2. Get the Auth User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. PROTECTED ROUTE CHECK: /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // A. Not Logged In -> Go to Login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("return_to", request.nextUrl.pathname); // Updated param name to match your login page
      return NextResponse.redirect(url);
    }

    // B. Logged In -> Fetch User Role
    // We select 'role' specifically.
    const { data: dbUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = dbUser?.role || "user";

    // C. BLOCK REGULAR USERS
    // If it's just a guest ('user'), kick them out of admin entirely.
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // D. ROLE-BASED ACCESS CONTROL (RBAC)
    // We check if the current path is in our "Restricted List"
    const currentPath = request.nextUrl.pathname;

    for (const [route, allowedRoles] of Object.entries(
      RESTRICTED_ADMIN_PATHS
    )) {
      // If the user is trying to access a restricted route (e.g. /admin/security)
      if (currentPath.startsWith(route)) {
        // And their role is NOT in the allowed list
        if (!allowedRoles.includes(userRole)) {
          // Redirect them to a safe page (Admin Dashboard)
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        }
      }
    }

    // If we pass all checks, allow access (for Admin or Front Desk on allowed routes)
  }

  // 4. AUTH ROUTE CHECK: /login or /register
  // If already logged in, redirect to the appropriate dashboard
  if (["/login", "/register"].includes(request.nextUrl.pathname)) {
    if (user) {
      // Check role to decide where to send them
      const { data: dbUser } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      const target =
        dbUser?.role === "user" ? "/dashboard" : "/admin/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|coolstaylogo.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
