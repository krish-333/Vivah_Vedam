import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/server/auth";

export async function GET() {
  const profile = await getCurrentUserProfile();
  if (!profile) return NextResponse.json({ user: null, profile: null });

  return NextResponse.json({
    user: { id: profile.id, email: profile.email },
    profile,
  });
}
