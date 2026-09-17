import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSessionToken, verifyPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import type { Tables } from "@/types";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: { message: "Email and password are required." } }, { status: 400 });
  }

  const { from } = db();
  const { data: user } = await from("users").select("*").eq("email", email).maybeSingle();
  const row = user as Tables<"users"> | null;

  if (!row || !row.password_hash) {
    return NextResponse.json({ error: { message: "Invalid email or password." } }, { status: 401 });
  }

  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) {
    return NextResponse.json({ error: { message: "Invalid email or password." } }, { status: 401 });
  }

  const token = await createSessionToken({ sub: row.id, email: row.email, role: row.role });

  const response = NextResponse.json({
    user: { id: row.id, email: row.email, role: row.role, onboarding_completed: row.onboarding_completed },
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
