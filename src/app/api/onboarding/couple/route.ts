import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });

  const body = await request.json();
  const { partner_1_name, partner_2_name, wedding_date, city, guest_count, budget_total } = body;

  if (!partner_1_name || !partner_2_name || !wedding_date || !city || !guest_count) {
    return NextResponse.json({ error: { message: "Missing required fields." } }, { status: 400 });
  }

  const { from } = db();

  const { error: weddingError } = await from("weddings").insert({
    couple_id: user.id,
    partner_1_name,
    partner_2_name,
    wedding_date,
    city,
    guest_count,
    budget_total: budget_total ?? 0,
  });
  if (weddingError) {
    return NextResponse.json({ error: { message: weddingError.message } }, { status: 500 });
  }

  await from("users").update({ onboarding_completed: true }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
