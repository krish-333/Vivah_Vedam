import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { messageSendSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = messageSendSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/messages");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("chat", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { conversationId, content } = parsed.data;

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

  if (!conversation) {
    redirectUrl.searchParams.set("chat", "missing");
    return NextResponse.redirect(redirectUrl);
  }

  if (![conversation.couple_id, conversation.vendor_id].includes(user.id)) {
    redirectUrl.searchParams.set("chat", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  const { error: messageError } = await session.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
    read_at: null,
  });

  if (messageError) {
    redirectUrl.searchParams.set("chat", "error");
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.searchParams.set("chat", "sent");
  return NextResponse.redirect(redirectUrl);
}
