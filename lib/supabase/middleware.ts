import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_LOGIN_ROUTE,
  ADMIN_ROUTE,
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  UNIVERSITY_ROUTE,
} from "@/lib/auth-redirects";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  const isAdminRoute = pathname === ADMIN_ROUTE || pathname.startsWith(`${ADMIN_ROUTE}/`);
  const isUniversityRoute =
    pathname === UNIVERSITY_ROUTE || pathname.startsWith(`${UNIVERSITY_ROUTE}/`);
  const isDashboardRoute =
    pathname === DASHBOARD_ROUTE || pathname.startsWith(`${DASHBOARD_ROUTE}/`);

  const redirectTo = (target: string) => {
    url.pathname = target;
    url.search = "";
    return NextResponse.redirect(url);
  };

  if (!user) {
    if (isAdminRoute) {
      return redirectTo(ADMIN_LOGIN_ROUTE);
    }

    if (isDashboardRoute) {
      return redirectTo(LOGIN_ROUTE);
    }

    return response;
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  const isAdmin = roleData?.role === "admin";

  const { data: universityAccount } = await supabase
    .from("university_accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const isUniversityUser = Boolean(universityAccount);

  if (pathname === LOGIN_ROUTE) {
    if (isAdmin) return redirectTo(ADMIN_ROUTE);
    if (isUniversityUser) return redirectTo(UNIVERSITY_ROUTE);
    return redirectTo(DASHBOARD_ROUTE);
  }

  if (pathname === ADMIN_LOGIN_ROUTE) {
    if (isAdmin) return redirectTo(ADMIN_ROUTE);
    return redirectTo(DASHBOARD_ROUTE);
  }

  if (isAdminRoute && !isAdmin) {
    return redirectTo(isUniversityUser ? UNIVERSITY_ROUTE : DASHBOARD_ROUTE);
  }

  if (isUniversityRoute && !isUniversityUser) {
    return redirectTo(isAdmin ? ADMIN_ROUTE : DASHBOARD_ROUTE);
  }

  if (isDashboardRoute && isAdmin) {
    return redirectTo(ADMIN_ROUTE);
  }

  return response;
}
