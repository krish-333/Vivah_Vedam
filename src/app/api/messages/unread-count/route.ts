import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ count: 0 });

  const { from } = db();

  const { data: profile } = await from("users").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "couple" && profile.role !== "vendor")) {
    return NextResponse.json({ count: 0 });
  }

  const conversationQuery = from("conversations").select("id").limit(100);
  const { data: conversations } =
    profile.role === "couple"
      ? await conversationQuery.eq("couple_id", user.id)
      : await conversationQuery.eq("vendor_id", user.id);

  const conversationIds = (conversations ?? []).map((c) => c.id);
  if (conversationIds.length === 0) return NextResponse.json({ count: 0 });

  const { count } = await from("messages")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", conversationIds)
    .is("read_at", null)
    .neq("sender_id", user.id);

  return NextResponse.json({ count: count ?? 0 });
}
