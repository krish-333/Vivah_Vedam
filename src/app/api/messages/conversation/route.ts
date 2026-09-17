import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { messageConversationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = messageConversationSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/messages");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("chat", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { targetUserId, asRole } = parsed.data;

  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const coupleId = asRole === "couple" ? user.id : targetUserId;
  const vendorId = asRole === "vendor" ? user.id : targetUserId;

  const { data: existing } = await session
    .from("conversations")
    .select("id")
    .eq("couple_id", coupleId)
    .eq("vendor_id", vendorId)
    .maybeSingle();

  let conversationId = existing?.id ?? null;

  if (!conversationId) {
    const { data: created } = await session
      .from("conversations")
      .insert({
        couple_id: coupleId,
        vendor_id: vendorId,
        booking_id: null,
      })
      .select("id")
      .single();

    conversationId = created?.id ?? null;
  }

  if (!conversationId) {
    redirectUrl.searchParams.set("chat", "error");
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.searchParams.set("conversation", conversationId);
  return NextResponse.redirect(redirectUrl);
}
