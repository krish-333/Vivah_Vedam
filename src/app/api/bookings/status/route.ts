import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { bookingStatusSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = bookingStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/bookings");

  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("update", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { bookingId, action } = parsed.data;

  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await session
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  const { data: booking } = await session
    .from("bookings")
    .select("id, vendor_id, couple_id")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    redirectUrl.searchParams.set("update", "not-found");
    return NextResponse.redirect(redirectUrl);
  }

  if (action === "pay") {
    if (profile?.role !== "couple" || booking.couple_id !== user.id) {
      redirectUrl.searchParams.set("update", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }

    const mockPaymentIntentId = `mock_pi_${Date.now()}`;
    const { error } = await session
      .from("bookings")
      .update({
        status: "in_progress",
        stripe_payment_intent_id: mockPaymentIntentId,
      })
      .eq("id", bookingId)
      .eq("couple_id", user.id)
      .eq("status", "confirmed");

    redirectUrl.searchParams.set("update", error ? "error" : "paid");
    return NextResponse.redirect(redirectUrl);
  }

  if (action === "admin_confirm" || action === "admin_cancel") {
    if (profile?.role !== "admin") {
      redirectUrl.searchParams.set("update", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }

    const status = action === "admin_confirm" ? "confirmed" : "cancelled";
    const { error } = await session.from("bookings").update({ status }).eq("id", bookingId);

    redirectUrl.searchParams.set("update", error ? "error" : "ok");
    return NextResponse.redirect(redirectUrl);
  }

  if (action === "cancel") {
    if (profile?.role !== "couple" || booking.couple_id !== user.id) {
      redirectUrl.searchParams.set("update", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }

    const { error } = await session
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .eq("couple_id", user.id)
      .in("status", ["pending", "confirmed"]);

    redirectUrl.searchParams.set("update", error ? "error" : "ok");
    return NextResponse.redirect(redirectUrl);
  }

  if (!profile || profile.role !== "vendor" || booking.vendor_id !== user.id) {
    redirectUrl.searchParams.set("update", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  const status =
    action === "confirm" ? "confirmed" : action === "complete" ? "completed" : "cancelled";

  const { error } = await session
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .eq("vendor_id", user.id);

  redirectUrl.searchParams.set("update", error ? "error" : "ok");
  return NextResponse.redirect(redirectUrl);
}
