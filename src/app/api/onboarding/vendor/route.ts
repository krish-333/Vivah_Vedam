import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });

  const { business_name, phone, city, about } = await request.json();
  if (!business_name || !phone || !city) {
    return NextResponse.json({ error: { message: "Missing required fields." } }, { status: 400 });
  }

  const { from } = db();

  const { error } = await from("users")
    .update({
      full_name: business_name,
      phone,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }

  // city/about aren't columns on `users` in the current schema — the original
  // client-side form collected them but only ever wrote full_name/phone/onboarding_completed.
  // Kept as accepted-but-unused here so the route doesn't reject the existing form payload;
  // wire them into a vendor-profile table if/when you add one.
  void city;
  void about;

  return NextResponse.json({ ok: true });
}
