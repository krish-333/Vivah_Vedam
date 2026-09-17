import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSessionToken, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import type { UserRole } from "@/types";

export async function POST(request: Request) {
  const { email, password, full_name: fullName, role } = await request.json();

  if (!email || !password || !fullName || !role) {
    return NextResponse.json({ error: { message: "Missing required fields." } }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: { message: "Password must be at least 6 characters." } }, { status: 400 });
  }
  if (role !== "couple" && role !== "vendor") {
    return NextResponse.json({ error: { message: "Invalid role." } }, { status: 400 });
  }

  const { from } = db();

  const { data: existing } = await from("users").select("id").eq("email", email).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: { message: "An account with that email already exists." } }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const { data: created, error } = await from("users")
    .insert({
      email,
      password_hash: passwordHash,
      full_name: fullName,
      role: role as UserRole,
      onboarding_completed: false,
    })
    .select("id, email, role")
    .single();

  if (error || !created) {
    return NextResponse.json({ error: { message: error?.message ?? "Could not create account." } }, { status: 500 });
  }

  const token = await createSessionToken({ sub: created.id, email: created.email, role: created.role });

  const response = NextResponse.json({ user: created });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
