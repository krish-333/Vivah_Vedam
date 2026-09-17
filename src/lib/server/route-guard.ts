import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { rawQuery } from "@/lib/db";

// Route-protection helper for who can see /dashboard, /vendor, /admin, /login -
// figures out "is there a logged-in user, and what's their role" from the JWT
// session cookie against RDS. Not currently wired into a root middleware.ts (this
// app enforces auth per-page instead), kept here as a ready-to-use option.
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? await verifySessionToken(token) : null;
  const user = payload ? { id: payload.sub, role: payload.role } : null;

  const path = request.nextUrl.pathname;

  const coupleRoutes = path.startsWith("/dashboard");
  const vendorRoutes = path.startsWith("/vendor");
  const adminRoutes = path.startsWith("/admin");
  const authRoutes = path.startsWith("/login") || path.startsWith("/signup");

  // Not logged in -> redirect to login
  if (!user && (coupleRoutes || vendorRoutes || adminRoutes)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Logged in -> redirect away from auth pages
  if (user && authRoutes) {
    const rows = await rawQuery<{ role: string; onboarding_completed: boolean }>(
      `SELECT role, onboarding_completed FROM "users" WHERE id = $1 LIMIT 1`,
      [user.id]
    );
    const profile = rows[0];
    const url = request.nextUrl.clone();

    if (profile && !profile.onboarding_completed) {
      url.pathname = profile.role === "couple" ? "/onboarding/couple" : "/onboarding/vendor";
      return NextResponse.redirect(url);
    }

    if (profile) {
      url.pathname = profile.role === "couple" ? "/dashboard" : profile.role === "vendor" ? "/vendor" : "/admin";
      return NextResponse.redirect(url);
    }
  }

  // Role-based route protection
  if (user && (coupleRoutes || vendorRoutes || adminRoutes)) {
    const rows = await rawQuery<{ role: string }>(`SELECT role FROM "users" WHERE id = $1 LIMIT 1`, [user.id]);
    const profile = rows[0];

    if (profile) {
      const url = request.nextUrl.clone();
      if (coupleRoutes && profile.role !== "couple") {
        url.pathname = profile.role === "vendor" ? "/vendor" : "/admin";
        return NextResponse.redirect(url);
      }
      if (vendorRoutes && profile.role !== "vendor") {
        url.pathname = profile.role === "couple" ? "/dashboard" : "/admin";
        return NextResponse.redirect(url);
      }
      if (adminRoutes && profile.role !== "admin") {
        url.pathname = profile.role === "couple" ? "/dashboard" : "/vendor";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
