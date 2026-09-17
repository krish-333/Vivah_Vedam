import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import type { Tables } from "@/types";

// This module is the app's single entry point for "who's logged in" (JWT session
// cookie, verified against JWT_SECRET) plus a `.from()` handle onto RDS Postgres.
// Every server component and API route in this app calls `await createDbSession()`
// and then `.auth.getUser()` / `.from()` - see rds/001_initial_schema.sql,
// rds/002_vendor_ops.sql, and src/lib/db for the Postgres side of this.

export type AuthUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

async function getUser(): Promise<{ data: { user: AuthUser | null }; error: null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return { data: { user: null }, error: null };

  const payload = await verifySessionToken(token);
  if (!payload) return { data: { user: null }, error: null };

  return {
    data: {
      user: { id: payload.sub, email: payload.email, user_metadata: { role: payload.role } },
    },
    error: null,
  };
}

export async function createDbSession() {
  const { from } = db();

  return {
    auth: {
      getUser,
      // The one remaining caller (the OAuth callback route) has been rewritten to do
      // the Google code exchange itself and no longer calls this - kept only so an
      // old import doesn't hard-crash the build if something still references it.
      exchangeCodeForSession: async () => ({
        error: { message: "Not implemented - see src/app/api/auth/callback/route.ts" },
      }),
    },
    from,
  };
}

/** Convenience helper for API routes that just need the current user id/role/email. */
export async function getCurrentUser() {
  const { data } = await getUser();
  return data.user;
}

/** Fetch the full `users` row (role, onboarding_completed, etc.) for the session user. */
export async function getCurrentUserProfile(): Promise<Tables<"users"> | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const { from } = db();
  const { data } = await from("users").select("*").eq("id", user.id).single();
  return data;
}
