import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { messageReadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = messageReadSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/messages");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("chat", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { conversationId } = parsed.data;

  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { data: conversation } = await session
    .from("conversations")
    .select("id,couple_id,vendor_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || ![conversation.couple_id, conversation.vendor_id].includes(user.id)) {
    redirectUrl.searchParams.set("chat", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  await session
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .is("read_at", null)
    .neq("sender_id", user.id);

  redirectUrl.searchParams.set("chat", "read");
  return NextResponse.redirect(redirectUrl);
}
