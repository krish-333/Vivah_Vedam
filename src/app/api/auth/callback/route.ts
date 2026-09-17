import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

// Google OAuth callback. Exchanges the Google
// authorization code for tokens directly with Google, then upserts our own
// `users` row and issues our own session JWT.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("state") ?? "/dashboard";

  const fail = () => NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);

  if (!code) return fail();

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin;
  const redirectUri = `${appUrl}/api/auth/callback`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
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
    if (!tokenRes.ok) return fail();
    const tokens = (await tokenRes.json()) as { access_token: string };

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!userInfoRes.ok) return fail();
    const googleUser = (await userInfoRes.json()) as { sub: string; email: string; name?: string };

    const { from } = db();

    let { data: user } = await from("users").select("*").eq("email", googleUser.email).maybeSingle();

    if (!user) {
      const { data: created, error } = await from("users")
        .insert({
          email: googleUser.email,
          oauth_provider: "google",
          oauth_id: googleUser.sub,
          full_name: googleUser.name ?? googleUser.email,
          role: "couple",
          onboarding_completed: false,
        })
        .select("*")
        .single();
      if (error || !created) return fail();
      user = created;
    }

    const token = await createSessionToken({ sub: user.id, email: user.email, role: user.role });
    const response = NextResponse.redirect(`${appUrl}${redirect}`);
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch {
    return fail();
  }
}
