import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { vendorAvailabilityOverrideCreateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = vendorAvailabilityOverrideCreateSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/vendor/availability");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("availability", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const user = await getCurrentUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { from } = db();
  const { data: existing } = await from("vendor_availability_overrides")
    .select("id")
    .eq("vendor_id", user.id)
    .eq("date", parsed.data.date)
    .maybeSingle();

  const patch = {
    is_available: parsed.data.isAvailable === "true",
    reason: parsed.data.reason || null,
  };

  const { error } = existing
    ? await from("vendor_availability_overrides").update(patch).eq("id", existing.id)
    : await from("vendor_availability_overrides").insert({
        vendor_id: user.id,
        date: parsed.data.date,
        ...patch,
      });

  redirectUrl.searchParams.set("availability", error ? "error" : "saved");
  return NextResponse.redirect(redirectUrl);
}
