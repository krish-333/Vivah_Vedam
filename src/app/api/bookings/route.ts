import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { bookingCreateSchema } from "@/lib/validation";

function getCommissionRate() {
  const raw = process.env.PLATFORM_COMMISSION_RATE;
  const parsed = raw ? Number(raw) : 0.1;
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return 0.1;
  }
  return parsed;
}

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = bookingCreateSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/bookings");

  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("booking", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { bookingType, listingId, bookingDate, notes } = parsed.data;

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

  if (!profile || profile.role !== "couple") {
    redirectUrl.searchParams.set("booking", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  const { data: wedding } = await session
    .from("weddings")
    .select("id")
    .eq("couple_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!wedding) {
    redirectUrl.searchParams.set("booking", "missing-wedding");
    return NextResponse.redirect(redirectUrl);
  }

  const commissionRate = getCommissionRate();

  if (bookingType === "venue") {
    const { data: venue } = await session
      .from("venues")
      .select("id, vendor_id, price_per_day")
      .eq("id", listingId)
      .eq("is_approved", true)
      .eq("is_active", true)
      .maybeSingle();

    if (!venue) {
      redirectUrl.searchParams.set("booking", "not-found");
      return NextResponse.redirect(redirectUrl);
    }

    const totalAmount = venue.price_per_day;
    const platformFee = Math.round(totalAmount * commissionRate * 100) / 100;
    const vendorPayout = Math.round((totalAmount - platformFee) * 100) / 100;

    const { error } = await session.from("bookings").insert({
      wedding_id: wedding.id,
      venue_id: venue.id,
      service_id: null,
      vendor_id: venue.vendor_id,
      couple_id: user.id,
      booking_date: bookingDate,
      status: "pending",
      total_amount: totalAmount,
      platform_fee: platformFee,
      vendor_payout: vendorPayout,
      stripe_payment_intent_id: null,
      notes: notes || null,
    });

    redirectUrl.searchParams.set("booking", error ? "error" : "requested");
    return NextResponse.redirect(redirectUrl);
  }

  const { data: service } = await session
    .from("services")
    .select("id, vendor_id, price_max")
    .eq("id", listingId)
    .eq("is_approved", true)
    .eq("is_active", true)
    .maybeSingle();

  if (!service) {
    redirectUrl.searchParams.set("booking", "not-found");
    return NextResponse.redirect(redirectUrl);
  }

  const totalAmount = service.price_max;
  const platformFee = Math.round(totalAmount * commissionRate * 100) / 100;
  const vendorPayout = Math.round((totalAmount - platformFee) * 100) / 100;

  const { error } = await session.from("bookings").insert({
    wedding_id: wedding.id,
    venue_id: null,
    service_id: service.id,
    vendor_id: service.vendor_id,
    couple_id: user.id,
    booking_date: bookingDate,
    status: "pending",
    total_amount: totalAmount,
    platform_fee: platformFee,
    vendor_payout: vendorPayout,
    stripe_payment_intent_id: null,
    notes: notes || null,
  });

  redirectUrl.searchParams.set("booking", error ? "error" : "requested");
  return NextResponse.redirect(redirectUrl);
}
